import React, { useEffect, useState } from 'react';
import '../styles/MoviePage.css';
import GenreRow from '../components/GenreRow';
import RecommendedRow from '../components/RecommendedRow';
import { MovieCardProps } from '../types/Movie';
import { fetchGenreRecommendations } from '../api/movieService';

const MoviesPage: React.FC = () => {
  const [genreRecommendations, setGenreRecommendations] = useState<Record<string, MovieCardProps[]>>({});
  const genres: string[] = [
    'Action', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama',
    'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery',
    'News', 'Reality-TV', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Talk-Show', 'Thriller',
    'War', 'Western', 'Game-Show', 'Lifestyle', 'Travel', 'Superhero', 'Teen', 'Holiday'
  ];

  // Fetch genre recommendations only once per genre
  useEffect(() => {
    genres.forEach((genre) => {
      // Skip if genre is already loaded
      if (genreRecommendations[genre]) return;

      // Fetch recommendations for each genre if not already loaded
      const fetchMoviesForGenre = async () => {
        try {
          const movies = await fetchGenreRecommendations(genre);
          setGenreRecommendations((prev) => ({
            ...prev,
            [genre]: movies,
          }));
        } catch (err) {
          console.warn(`Error fetching movies for genre: ${genre}`, err);
        }
      };
      fetchMoviesForGenre();
    });
  }, [genreRecommendations, genres]);

  return (
    <div className="movies-page">
      {/* Recommended and Continue Watching rows */}
      <div className="movies-header">
        <RecommendedRow movies={[]} />
      </div>

      {/* Genre rows */}
      <div className="genre-rows">
        {genres.map((genre) => (
          <GenreRow
            key={genre}
            title={`Top Picks in ${genre}`}
            movies={genreRecommendations[genre] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
