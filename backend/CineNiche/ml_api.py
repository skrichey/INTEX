from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler, LabelEncoder, normalize

# Define known genre columns used in recommendations
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

# Function to extract genres from genre columns
def extract_genres(row):
    return [genre for genre in GENRE_COLUMNS if genre in row and row[genre] == 1]

# Set up SQLite connection
engine = create_engine("sqlite:///Movies.sqlite")

# Create and configure Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend/backend communication

# ===============================
# Requirement 1: Recommendation for Show Details Page
# Endpoint to recommend similar shows using content-based filtering only
@app.route("/recommend_by_movie", methods=["POST"])
def recommend_similar():
    show_id = request.json.get("show_id")
    
    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    available_genre_columns = [col for col in GENRE_COLUMNS if col in titles.columns]

    # Combine multiple metadata fields for TF-IDF
    titles["combined"] = (
        titles["title"].fillna("") + " " +
        titles["director"].fillna("") + " " +
        titles["cast"].fillna("") + " " +
        titles["description"].fillna("") + " " +
        titles[available_genre_columns].apply(
            lambda row: ' '.join([genre for genre in available_genre_columns if row.get(genre, 0) == 1]),
            axis=1
        )
    )

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(titles["combined"])

    # Get index for the selected show
    idx_list = titles.index[titles["show_id"] == show_id].tolist()
    if not idx_list:
        return jsonify([])

    show_vector = tfidf_matrix[idx_list[0]]
    sim_scores = cosine_similarity(show_vector, tfidf_matrix).flatten()

    # Attach similarity scores and return top 10
    titles["similarity"] = sim_scores
    top_recs = titles.sort_values(by="similarity", ascending=False).head(10)

    response = []
    for _, row in top_recs.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "description": row["description"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "genres": extract_genres(row)
        })
    return jsonify(response)


# ===============================
# Requirement 2: Home Page Recommendations
# Hybrid Recommendation (Content + Collaborative) for returning users
@app.route("/recommend", methods=["POST"])
def recommend():
    user_id = request.json.get("user_id")

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)

    if titles.empty or ratings.empty:
        return jsonify([])

    available_genre_columns = [col for col in GENRE_COLUMNS if col in titles.columns]

    # Create combined text field for content-based model
    titles["combined"] = (
        titles["title"].fillna("") + " " +
        titles["director"].fillna("") + " " +
        titles["cast"].fillna("") + " " +
        titles["description"].fillna("") + " " +
        titles[available_genre_columns].apply(
            lambda row: ' '.join([genre for genre in available_genre_columns if row.get(genre, 0) == 1]),
            axis=1
        )
    )

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(titles["combined"])

    user_ratings = ratings[ratings["user_id"] == user_id]
    if user_ratings.empty:
        return jsonify(titles[["show_id", "title"]].head(10).to_dict(orient="records"))

    # Use top 3 rated shows to form user's content preference vector
    top_shows = user_ratings.sort_values(by="rating", ascending=False).head(3)["show_id"]
    top_indices = titles[titles["show_id"].isin(top_shows)].index.tolist()
    if not top_indices:
        return jsonify(titles[["show_id", "title"]].head(10).to_dict(orient="records"))

    user_profile_vector = np.asarray(tfidf_matrix[top_indices].mean(axis=0))
    content_scores = cosine_similarity(user_profile_vector, tfidf_matrix).flatten()

    # Collaborative filtering (item-item similarity)
    user_item_matrix = ratings.pivot_table(index="user_id", columns="show_id", values="rating").fillna(0)
    item_similarity = cosine_similarity(user_item_matrix.T)
    sim_df = pd.DataFrame(item_similarity, index=user_item_matrix.columns, columns=user_item_matrix.columns)

    unrated_shows = list(set(user_item_matrix.columns) - set(user_ratings["show_id"]))

    collab_scores = {}
    for show_id in unrated_shows:
        similar_items = sim_df[show_id].drop(labels=[show_id])
        rated_items = user_ratings[user_ratings["show_id"].isin(similar_items.index)]
        if not rated_items.empty:
            score = np.dot(
                rated_items["rating"],
                similar_items[rated_items["show_id"]]
            ) / similar_items[rated_items["show_id"]].sum()
            collab_scores[show_id] = score

    collab_df = pd.DataFrame.from_dict(collab_scores, orient="index", columns=["collab_score"]).reset_index()
    collab_df.rename(columns={"index": "show_id"}, inplace=True)

    titles["content_score"] = content_scores
    merged = pd.merge(titles, collab_df, on="show_id", how="left")
    merged["collab_score"] = merged["collab_score"].fillna(0)

    # Normalize and compute final hybrid score
    scaler = MinMaxScaler()
    merged[["content_score", "collab_score"]] = scaler.fit_transform(merged[["content_score", "collab_score"]])
    merged["hybrid_score"] = 0.6 * merged["content_score"] + 0.4 * merged["collab_score"]

    top_recs = merged.sort_values(by="hybrid_score", ascending=False).head(10)

    response = []
    for _, row in top_recs.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "description": row["description"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "genres": extract_genres(row)
        })
    return jsonify(response)


# ===============================
# Cold-Start Recommendations
# For new users without any rating history, based on similar user metadata
@app.route("/cold_start_recommend", methods=["POST"])
def cold_start_recommend():
    user_id = request.json.get("user_id")

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)
    users = pd.read_sql("SELECT * FROM movies_users", engine)

    if titles.empty or users.empty:
        return jsonify([])

    current_user = users[users["user_id"] == user_id]
    if current_user.empty:
        return jsonify([])

    users_clean = users.copy()
    current_user_data = current_user.copy()

    features = ["age", "gender", "city", "state", "zip",
                "Netflix", "Hulu", "Amazon Prime", "Disney+", "Max",
                "Paramount+", "Apple TV+", "Peacock"]

    # Encode categorical features
    label_enc_cols = ["gender", "city", "state", "zip"]
    for col in label_enc_cols:
        encoder = LabelEncoder()
        combined = pd.concat([users_clean[col].astype(str), current_user_data[col].astype(str)])
        encoder.fit(combined)
        users_clean[col] = encoder.transform(users_clean[col].astype(str))
        current_user_data[col] = encoder.transform(current_user_data[col].astype(str))

    for col in features:
        users_clean[col] = pd.to_numeric(users_clean[col], errors="coerce").fillna(0)
        current_user_data[col] = pd.to_numeric(current_user_data[col], errors="coerce").fillna(0)

    # Normalize and compute cosine similarity between users
    user_vectors = users_clean[features].to_numpy()
    current_vector = current_user_data[features].to_numpy()

    user_vectors_normalized = normalize(user_vectors)
    current_vector_normalized = normalize(current_vector).reshape(1, -1)

    similarity = np.dot(user_vectors_normalized, current_vector_normalized.T).flatten()
    users_clean["similarity"] = similarity

    similar_users = users_clean.sort_values(by="similarity", ascending=False).head(10)
    top_users = similar_users["user_id"].tolist()

    relevant_ratings = ratings[ratings["user_id"].isin(top_users)]
    avg_ratings = relevant_ratings.groupby("show_id")["rating"].mean().reset_index()
    avg_ratings.rename(columns={"rating": "avg_rating"}, inplace=True)

    top_shows = pd.merge(titles, avg_ratings, on="show_id")
    top_recs = top_shows.sort_values(by="avg_rating", ascending=False).head(10)

    response = []
    for _, row in top_recs.iterrows():
        response.append({
            "show_id": row["show_id"],
            "title": row["title"],
            "description": row["description"],
            "director": row["director"],
            "cast": row["cast"],
            "country": row["country"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "genres": extract_genres(row)
        })
    return jsonify(response)

# Run Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)



    