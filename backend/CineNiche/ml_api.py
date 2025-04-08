from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# File paths
TITLES_CSV = "movies_titles.csv"
RATINGS_CSV = "movies_ratings.csv"
USERS_CSV = "movies_users.csv"

# ----------------- UTILITIES ----------------- #
def read_csv(path, columns):
    if os.path.exists(path):
        return pd.read_csv(path)
    return pd.DataFrame(columns=columns)

def write_csv(path, df):
    df.to_csv(path, index=False)

# ----------------- CRUD: TITLES ----------------- #
@app.route("/titles", methods=["GET"])
def get_titles():
    df = read_csv(TITLES_CSV, [])
    return jsonify(df.to_dict(orient="records"))

@app.route("/titles", methods=["POST"])
def add_title():
    df = read_csv(TITLES_CSV, [])
    new = request.get_json()
    if new["show_id"] in df["show_id"].values:
        return jsonify({"error": "Duplicate show_id"}), 400
    df = pd.concat([df, pd.DataFrame([new])], ignore_index=True)
    write_csv(TITLES_CSV, df)
    return jsonify({"message": "Added successfully"})

@app.route("/titles/<show_id>", methods=["PUT"])
def update_title(show_id):
    df = read_csv(TITLES_CSV, [])
    if show_id not in df["show_id"].values:
        return jsonify({"error": "Not found"}), 404
    updated = request.get_json()
    df.loc[df["show_id"] == show_id, updated.keys()] = updated.values()
    write_csv(TITLES_CSV, df)
    return jsonify({"message": "Updated successfully"})

@app.route("/titles/<show_id>", methods=["DELETE"])
def delete_title(show_id):
    df = read_csv(TITLES_CSV, [])
    if show_id not in df["show_id"].values:
        return jsonify({"error": "Not found"}), 404
    df = df[df["show_id"] != show_id]
    write_csv(TITLES_CSV, df)
    return jsonify({"message": "Deleted successfully"})

# ----------------- CRUD: RATINGS ----------------- #
@app.route("/ratings", methods=["GET"])
def get_ratings():
    df = read_csv(RATINGS_CSV, [])
    return jsonify(df.to_dict(orient="records"))

@app.route("/ratings", methods=["POST"])
def add_rating():
    df = read_csv(RATINGS_CSV, [])
    new = request.get_json()
    df = pd.concat([df, pd.DataFrame([new])], ignore_index=True)
    write_csv(RATINGS_CSV, df)
    return jsonify({"message": "Rating added"})

# ----------------- CRUD: USERS ----------------- #
@app.route("/users", methods=["GET"])
def get_users():
    df = read_csv(USERS_CSV, [])
    return jsonify(df.to_dict(orient="records"))

@app.route("/users", methods=["POST"])
def add_user():
    df = read_csv(USERS_CSV, [])
    new = request.get_json()
    if new["user_id"] in df["user_id"].values:
        return jsonify({"error": "Duplicate user_id"}), 400
    df = pd.concat([df, pd.DataFrame([new])], ignore_index=True)

    write_csv(USERS_CSV, df)
    return jsonify({"message": "User added"})

# ----------------- RECOMMENDATIONS ----------------- #
@app.route("/recommend", methods=["POST"])
def recommend():
    user_id = request.json.get("user_id")
    if user_id is None:
        return jsonify({"error": "user_id missing"}), 400

    titles = read_csv(TITLES_CSV, [])
    ratings = read_csv(RATINGS_CSV, [])

    if titles.empty or ratings.empty:
        return jsonify([])

    # ----------- Content-Based Filtering -----------
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

    # ----------- Collaborative Filtering (Item-Item CF) -----------
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

    # ----------- Merge and Normalize -----------
    titles['content_score'] = content_scores
    merged = pd.merge(titles, collab_df, on='show_id', how='left')
    merged['collab_score'] = merged['collab_score'].fillna(0)

    scaler = MinMaxScaler()
    merged[['content_score', 'collab_score']] = scaler.fit_transform(merged[['content_score', 'collab_score']])

    merged['hybrid_score'] = 0.6 * merged['content_score'] + 0.4 * merged['collab_score']
    top_recs = merged.sort_values(by='hybrid_score', ascending=False).head(10)

    top_recs.fillna('', inplace=True)

    return jsonify(top_recs[[
    "show_id", "title", "director", "cast", "country",
    "release_year", "rating", "duration", "description"
    ]].to_dict(orient="records"))

@app.route("/recommend_by_movie", methods=["POST"])
def recommend_by_movie():
    show_id = request.json.get("show_id")
    if not show_id:
        return jsonify({"error": "show_id is required"}), 400

    titles = read_csv(TITLES_CSV, [])
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

    return jsonify(recs[[
        "show_id", "title", "director", "cast", "country",
        "release_year", "rating", "duration", "description"
    ]].to_dict(orient="records"))


#TOP 10 RATED MOVIES OVERALL
@app.route("/top_rated", methods=["GET"])
def top_rated():
    titles = read_csv(TITLES_CSV, [])
    ratings = read_csv(RATINGS_CSV, [])

    if titles.empty or ratings.empty:
        return jsonify([])

    # Calculate average rating per show_id
    avg_ratings = ratings.groupby('show_id')['rating'].mean().reset_index()
    avg_ratings.columns = ['show_id', 'avg_rating']

    # Join with movie metadata
    merged = pd.merge(titles, avg_ratings, on='show_id')
    top_movies = merged.sort_values(by='avg_rating', ascending=False).head(10)

    top_movies.fillna('', inplace=True)

    return jsonify(top_movies[[
        "show_id", "title", "director", "cast", "country",
        "release_year", "rating", "duration", "description"
    ]].to_dict(orient="records"))



# ----------------- START SERVER ----------------- #
if __name__ == '__main__':
    app.run(port=5000, debug=True)
    app.run(port=5000, debug=True)
    