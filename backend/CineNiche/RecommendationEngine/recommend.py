import pandas as pd
import numpy as np
import json
import argparse
import sys
from pathlib import Path
from sqlalchemy import create_engine

GENRE_COLUMNS = [
    "Action",
    "Children",
    "Comedies",
    "Documentaries",
    "Docuseries",
    "Dramas",
    "Family Movies",
    "Fantasy",
    "Horror Movies",
    "Musicals",
    "Nature TV",
    "Reality TV",
    "Spirituality",
    "TV Action",
    "TV Comedies",
    "TV Dramas",
    "Thrillers"
]


def extract_genres(row):
    return [genre for genre in GENRE_COLUMNS if genre in row and row[genre] == 1]

DB_PATH = Path(__file__).parent / "Movies.sqlite"
engine = create_engine(f"sqlite:///{DB_PATH}")

def build_response(df):
    return [
        {
            "show_id": row["show_id"],
            "title": row["title"],
            "description": row.get("description"),
            "director": row.get("director"),
            "cast": row.get("cast"),
            "country": row.get("country"),
            "release_year": row.get("release_year"),
            "rating": row.get("rating"),
            "duration": row.get("duration"),
            "genres": extract_genres(row)
        }
        for _, row in df.iterrows()
    ]

def recommend_by_movie(show_id):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    available_genre_columns = [col for col in GENRE_COLUMNS if col in titles.columns]

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
    idx_list = titles.index[titles["show_id"] == show_id].tolist()
    if not idx_list:
        return []

    sim_scores = cosine_similarity(tfidf_matrix[idx_list[0]], tfidf_matrix).flatten()
    titles["similarity"] = sim_scores

    filtered = titles[titles["show_id"] != show_id]
    top_recs = filtered.sort_values(by="similarity", ascending=False).head(10)

    return build_response(top_recs)

def hybrid_recommend(user_id):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.preprocessing import MinMaxScaler

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)

    available_genre_columns = [col for col in GENRE_COLUMNS if col in titles.columns]
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
        return titles.head(10).to_dict(orient="records")

    top_shows = user_ratings.sort_values(by="rating", ascending=False).head(3)["show_id"]
    top_indices = titles[titles["show_id"].isin(top_shows)].index.tolist()
    if not top_indices:
        return titles.head(10).to_dict(orient="records")

    user_profile_vector = np.asarray(tfidf_matrix[top_indices].mean(axis=0))
    content_scores = cosine_similarity(user_profile_vector, tfidf_matrix).flatten()

    user_item_matrix = ratings.pivot_table(index="user_id", columns="show_id", values="rating").fillna(0)
    item_similarity = cosine_similarity(user_item_matrix.T)
    sim_df = pd.DataFrame(item_similarity, index=user_item_matrix.columns, columns=user_item_matrix.columns)

    unrated_shows = list(set(user_item_matrix.columns) - set(user_ratings["show_id"]))
    collab_scores = {}

    for show_id in unrated_shows:
        similar_items = sim_df[show_id].drop(labels=[show_id])
        rated_items = user_ratings[user_ratings["show_id"].isin(similar_items.index)]

        if not rated_items.empty:
            denom = similar_items[rated_items["show_id"]].sum()
            if denom == 0:
                continue
            score = np.dot(
                rated_items["rating"],
                similar_items[rated_items["show_id"]]
            ) / denom
            collab_scores[show_id] = score

    collab_df = pd.DataFrame.from_dict(collab_scores, orient="index", columns=["collab_score"]).reset_index()
    collab_df.rename(columns={"index": "show_id"}, inplace=True)

    titles["content_score"] = content_scores
    collab_df["collab_score"] = pd.to_numeric(collab_df["collab_score"], errors="coerce")
    merged = pd.merge(titles, collab_df, on="show_id", how="left")
    merged["collab_score"] = merged["collab_score"].fillna(0.0)

    scaler = MinMaxScaler()
    merged[["content_score", "collab_score"]] = scaler.fit_transform(merged[["content_score", "collab_score"]])
    merged["hybrid_score"] = 0.6 * merged["content_score"] + 0.4 * merged["collab_score"]

    top_recs = merged.sort_values(by="hybrid_score", ascending=False).head(10)
    return build_response(top_recs)

def cold_start(user_id):
    from sklearn.preprocessing import LabelEncoder, normalize

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)
    users = pd.read_sql("SELECT * FROM movies_users", engine)

    current_user = users[users["user_id"] == user_id].copy()
    if current_user.empty:
        return []

    features = ["age", "gender", "city", "state", "zip",
                "Netflix", "Hulu", "Amazon Prime", "Disney+", "Max",
                "Paramount+", "Apple TV+", "Peacock"]

    label_enc_cols = ["gender", "city", "state", "zip"]
    for col in label_enc_cols:
        encoder = LabelEncoder()
        combined = pd.concat([users[col].astype(str), current_user[col].astype(str)])
        encoder.fit(combined)
        users[col] = encoder.transform(users[col].astype(str))
        current_user.loc[:, col] = encoder.transform(current_user[col].astype(str))

    for col in features:
        users[col] = pd.to_numeric(users[col], errors="coerce").fillna(0)
        current_user.loc[:, col] = pd.to_numeric(current_user[col], errors="coerce").fillna(0)

    user_vectors = users[features].to_numpy()
    current_vector = current_user[features].to_numpy()
    user_vectors_normalized = normalize(user_vectors)
    current_vector_normalized = normalize(current_vector).reshape(1, -1)

    similarity = np.dot(user_vectors_normalized, current_vector_normalized.T).flatten()
    users["similarity"] = similarity

    similar_users = users.sort_values(by="similarity", ascending=False).head(10)
    relevant_ratings = ratings[ratings["user_id"].isin(similar_users["user_id"])]
    avg_ratings = relevant_ratings.groupby("show_id")["rating"].mean().reset_index()
    avg_ratings.rename(columns={"rating": "avg_rating"}, inplace=True)

    top_shows = pd.merge(titles, avg_ratings, on="show_id")
    top_recs = top_shows.sort_values(by="avg_rating", ascending=False).head(10)
    return build_response(top_recs)

def genre_recommend(user_id, genre):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.preprocessing import MinMaxScaler, LabelEncoder, normalize

    titles = pd.read_sql("SELECT * FROM movies_titles", engine)
    ratings = pd.read_sql("SELECT * FROM movies_ratings", engine)
    users = pd.read_sql("SELECT * FROM movies_users", engine)

    available_genre_columns = [col for col in GENRE_COLUMNS if col in titles.columns]
    if genre not in available_genre_columns:
        return []

    genre_movies = titles[titles[genre] == 1].copy()
    if genre_movies.empty:
        return []

    genre_movies["combined"] = (
        genre_movies["title"].fillna("") + " " +
        genre_movies["director"].fillna("") + " " +
        genre_movies["cast"].fillna("") + " " +
        genre_movies["description"].fillna("") + " " +
        genre_movies[available_genre_columns].apply(
            lambda row: ' '.join([g for g in available_genre_columns if row.get(g, 0) == 1]),
            axis=1
        )
    )

    user_ratings = ratings[ratings["user_id"] == user_id]

    if not user_ratings.empty:
        titles["combined"] = (
            titles["title"].fillna("") + " " +
            titles["director"].fillna("") + " " +
            titles["cast"].fillna("") + " " +
            titles["description"].fillna("") + " " +
            titles[available_genre_columns].apply(
                lambda row: ' '.join([g for g in available_genre_columns if row.get(g, 0) == 1]),
                axis=1
            )
        )

        tfidf = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf.fit_transform(titles["combined"])
        top_user_ratings = user_ratings.sort_values(by="rating", ascending=False).head(3)
        top_indices = titles[titles["show_id"].isin(top_user_ratings["show_id"])].index.tolist()
        if not top_indices:
            return []

        user_profile_vector = np.asarray(tfidf_matrix[top_indices].mean(axis=0)).reshape(1, -1)
        genre_tfidf = tfidf.transform(genre_movies["combined"])
        content_scores = cosine_similarity(user_profile_vector, genre_tfidf).flatten()
        genre_movies["content_score"] = content_scores

        avg_ratings = ratings.groupby("show_id")["rating"].mean().reset_index()
        avg_ratings.rename(columns={"rating": "avg_rating"}, inplace=True)
        genre_movies = pd.merge(genre_movies, avg_ratings, on="show_id", how="left")
        genre_movies["avg_rating"] = genre_movies["avg_rating"].fillna(0)

        scaler = MinMaxScaler()
        genre_movies[["content_score", "avg_rating"]] = scaler.fit_transform(genre_movies[["content_score", "avg_rating"]])
        genre_movies["hybrid_score"] = 0.6 * genre_movies["content_score"] + 0.4 * genre_movies["avg_rating"]

        top_recs = genre_movies.sort_values(by="hybrid_score", ascending=False).head(10)
        return build_response(top_recs)

    # Cold start
    current_user = users[users["user_id"] == user_id].copy()
    if current_user.empty:
        return []

    features = ["age", "gender", "city", "state", "zip",
                "Netflix", "Hulu", "Amazon Prime", "Disney+", "Max",
                "Paramount+", "Apple TV+", "Peacock"]
    label_enc_cols = ["gender", "city", "state", "zip"]
    for col in label_enc_cols:
        encoder = LabelEncoder()
        combined = pd.concat([users[col].astype(str), current_user[col].astype(str)])
        encoder.fit(combined)
        users[col] = encoder.transform(users[col].astype(str))
        current_user.loc[:, col] = encoder.transform(current_user[col].astype(str))

    for col in features:
        users[col] = pd.to_numeric(users[col], errors="coerce").fillna(0)
        current_user.loc[:, col] = pd.to_numeric(current_user[col], errors="coerce").fillna(0)

    user_vectors = users[features].to_numpy()
    current_vector = current_user[features].to_numpy()
    user_vectors_normalized = normalize(user_vectors)
    current_vector_normalized = normalize(current_vector).reshape(1, -1)

    similarity = np.dot(user_vectors_normalized, current_vector_normalized.T).flatten()
    users["similarity"] = similarity

    similar_users = users.sort_values(by="similarity", ascending=False).head(10)
    relevant_ratings = ratings[ratings["user_id"].isin(similar_users["user_id"])]
    avg_ratings = relevant_ratings.groupby("show_id")["rating"].mean().reset_index()
    avg_ratings.rename(columns={"rating": "avg_rating"}, inplace=True)

    genre_movies = pd.merge(genre_movies, avg_ratings, on="show_id", how="left")
    genre_movies["avg_rating"] = genre_movies["avg_rating"].fillna(0)

    top_recs = genre_movies.sort_values(by="avg_rating", ascending=False).head(10)
    return build_response(top_recs)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", required=True, choices=[
        "recommend", "recommend_by_movie", "cold_start", "genre_recommend"
    ])
    parser.add_argument("--user_id", type=int)
    parser.add_argument("--show_id", type=str)
    parser.add_argument("--genre", type=str)
    args = parser.parse_args()

    if args.mode == "recommend" and args.user_id is not None:
        print(json.dumps(hybrid_recommend(args.user_id)))
    elif args.mode == "recommend_by_movie" and args.show_id:
        print(json.dumps(recommend_by_movie(args.show_id)))
    elif args.mode == "cold_start" and args.user_id is not None:
        print(json.dumps(cold_start(args.user_id)))
    elif args.mode == "genre_recommend" and args.user_id is not None and args.genre:
        print(json.dumps(genre_recommend(args.user_id, args.genre)))
    else:
        print(json.dumps([]))





    