from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

# List of known genre columns (based on your schema)
GENRE_COLUMNS = [
    "Action", "Adventure", "Anime Series International TV Shows",
    "British TV Shows Docuseries International TV Shows", "Children",
    "Comedies", "Comedies Dramas International Movie", "Comedies International Movies",
    "Comedies Romantic Movies", "Crime TV Shows Docuseries", "Documentaries",
    "Documentaries International Movies", "Docuseries", "Dramas",
    "Dramas International Movies", "Dramas Romantic Movies", "Family Movies", "Fantasy",
    "Horror Movies", "International Movies Thrillers", 
    "International TV Shows Romantic TV Shows TV Dramas", "Kids' TV", 
    "Language TV Shows", "Musicals", "Nature TV", "Reality TV", 
    "Spirituality", "TV Action", "TV Comedies", "TV Dramas", 
    "Talk Shows TV Comedies", "Thrillers"
]

def extract_genres(row):
    return [genre for genre in GENRE_COLUMNS if row.get(genre, 0) == 1]


# SQLite connection
engine = create_engine("sqlite:///Movies.sqlite")

app = Flask(__name__)
CORS(app)

# ----------------- CRUD: TITLES ----------------- #
@app.route("/titles", methods=["GET"])
def get_titles():
    df = pd.read_sql("SELECT * FROM movies_titles", engine)
    return jsonify(df.to_dict(orient="records"))

@app.route("/titles", methods=["POST"])
def add_title():
    new = request.get_json()
    show_id = new.get("show_id")

    existing = pd.read_sql("SELECT show_id FROM movies_titles WHERE show_id = ?", engine, params=(show_id,))
    if not existing.empty:
        return jsonify({"error": "Duplicate show_id"}), 400

    query = """
    INSERT INTO movies_titles (show_id, title, director, cast, country, release_year, rating, duration, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    values = (
        new.get("show_id"), new.get("title"), new.get("director"), new.get("cast"),
        new.get("country"), new.get("release_year"), new.get("rating"),
        new.get("duration"), new.get("description")
    )

    with engine.begin() as conn:
        conn.execute(query, values)

    return jsonify({"message": "Added successfully"})

@app.route("/titles/<show_id>", methods=["PUT"])
def update_title(show_id):
    updated = request.get_json()
    set_clause = ", ".join(f"{k} = ?" for k in updated.keys())
    values = list(updated.values()) + [show_id]

    query = f"UPDATE movies_titles SET {set_clause} WHERE show_id = ?"

    with engine.begin() as conn:
        conn.execute(query, values)

    return jsonify({"message": "Updated successfully"})

@app.route("/titles/<show_id>", methods=["DELETE"])
def delete_title(show_id):
    with engine.begin() as conn:
        result = conn.execute("DELETE FROM movies_titles WHERE show_id = ?", (show_id,))
        if result.rowcount == 0:
            return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

# ----------------- CRUD: RATINGS ----------------- #
@app.route("/ratings", methods=["GET"])
def get_ratings():
    df = pd.read_sql("SELECT * FROM movies_ratings", engine)
    return jsonify(df.to_dict(orient="records"))

@app.route("/ratings", methods=["POST"])
def add_rating():
    new = request.get_json()
    query = """
    INSERT INTO movies_ratings (user_id, show_id, rating)
    VALUES (?, ?, ?)
    """
    values = (new.get("user_id"), new.get("show_id"), new.get("rating"))

    with engine.begin() as conn:
        conn.execute(query, values)

    return jsonify({"message": "Rating added"})

# ----------------- CRUD: USERS ----------------- #
@app.route("/users", methods=["GET"])
def get_users():
    df = pd.read_sql("SELECT * FROM movies_users", engine)
    return jsonify(df.to_dict(orient="records"))

@app.route("/users", methods=["POST"])
def add_user():
    new = request.get_json()
    user_id = new.get("user_id")

    existing = pd.read_sql("SELECT user_id FROM movies_users WHERE user_id = ?", engine, params=(user_id,))
    if not existing.empty:
        return jsonify({"error": "Duplicate user_id"}), 400

    query = """
    INSERT INTO movies_users (user_id, name)
    VALUES (?, ?)
    """
    values = (new.get("user_id"), new.get("name"))

    with engine.begin() as conn:
        conn.execute(query, values)

    return jsonify({"message": "User added"})

# ----------------- RECOMMENDATIONS ----------------- #
@app.route("/recommend", methods=["POST"])
def recommend():
    user_id = request.json.get("user_id")
    if user_id is None:
        return jsonify({"error": "user_id missing"}), 400

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)

    if titles.empty or ratings.empty:
        return jsonify([])

    titles['combined'] = (
        titles['title'].fillna('') + " " +
        titles['director'].fillna('') + " " +
        titles['cast'].fillna('') + " " +
        titles['description'].fillna('')
    )

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(titles['combined'])

    user_ratings = ratings[ratings['user_id'] == user_id]
    if user_ratings.empty:
        return jsonify(titles[["show_id", "title"]].head(10).to_dict(orient="records"))

    top_show_id = user_ratings.sort_values(by='rating', ascending=False).iloc[0]['show_id']
    idx_list = titles.index[titles['show_id'] == top_show_id].tolist()
    if not idx_list:
        return jsonify(titles[["show_id", "title"]].head(10).to_dict(orient="records"))

    top_idx = idx_list[0]
    content_scores = cosine_similarity(tfidf_matrix[top_idx], tfidf_matrix).flatten()

    user_item_matrix = ratings.pivot_table(index='user_id', columns='show_id', values='rating').fillna(0)
    item_similarity = cosine_similarity(user_item_matrix.T)
    sim_df = pd.DataFrame(item_similarity, index=user_item_matrix.columns, columns=user_item_matrix.columns)

    unrated_shows = list(set(user_item_matrix.columns) - set(user_ratings['show_id']))

    collab_scores = {}
    for show_id in unrated_shows:
        similar_items = sim_df[show_id].drop(labels=[show_id])
        rated_items = user_ratings[user_ratings['show_id'].isin(similar_items.index)]
        if not rated_items.empty:
            score = np.dot(
                rated_items['rating'],
                similar_items[rated_items['show_id']]
            ) / similar_items[rated_items['show_id']].sum()
            collab_scores[show_id] = score

    collab_df = pd.DataFrame.from_dict(collab_scores, orient='index', columns=['collab_score']).reset_index()
    collab_df.rename(columns={'index': 'show_id'}, inplace=True)

    titles['content_score'] = content_scores
    merged = pd.merge(titles, collab_df, on='show_id', how='left')
    merged['collab_score'] = merged['collab_score'].fillna(0)

    scaler = MinMaxScaler()
    merged[['content_score', 'collab_score']] = scaler.fit_transform(merged[['content_score', 'collab_score']])

    merged['hybrid_score'] = 0.6 * merged['content_score'] + 0.4 * merged['collab_score']
    top_recs = merged.sort_values(by='hybrid_score', ascending=False).head(10)

    top_recs.fillna('', inplace=True)

    response = []
    for _, row in top_recs.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "description": row["description"],
            "genres": extract_genres(row)
        })
    return jsonify(response)


@app.route("/recommend_by_movie", methods=["POST"])
def recommend_by_movie():
    show_id = request.json.get("show_id")
    if not show_id:
        return jsonify({"error": "show_id is required"}), 400

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    if titles.empty or show_id not in titles['show_id'].values:
        return jsonify([])

    titles['combined'] = (
        titles['title'].fillna('') + " " +
        titles['director'].fillna('') + " " +
        titles['cast'].fillna('') + " " +
        titles['description'].fillna('')
    )

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(titles['combined'])

    idx_list = titles.index[titles['show_id'] == show_id].tolist()
    if not idx_list:
        return jsonify([])

    idx = idx_list[0]
    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

    titles['similarity'] = cosine_sim
    recs = titles[titles['show_id'] != show_id] \
        .sort_values(by='similarity', ascending=False) \
        .head(10)

    recs.fillna('', inplace=True)

    response = []
    for _, row in recs.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "description": row["description"],
            "genres": extract_genres(row)
        })
    return jsonify(response)

@app.route("/top_rated", methods=["GET"])
def top_rated():
    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)

    if titles.empty or ratings.empty:
        return jsonify([])

    avg_ratings = ratings.groupby('show_id')['rating'].mean().reset_index()
    avg_ratings.columns = ['show_id', 'avg_rating']

    merged = pd.merge(titles, avg_ratings, on='show_id')
    top_movies = merged.sort_values(by='avg_rating', ascending=False).head(10)

    top_movies.fillna('', inplace=True)

    response = []
    for _, row in top_movies.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "description": row["description"],
            "genres": extract_genres(row)
        })
    return jsonify(response)

# ----------------- START SERVER ----------------- #
if __name__ == '__main__':
    app.run(port=5000, debug=True)

    