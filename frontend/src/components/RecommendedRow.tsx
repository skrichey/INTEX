import React from 'react';
import { MovieCardProps } from '../types/Movie';
import MovieCard from './MovieCard';
import '../styles/MovieRow.css';

interface RecommendedRowProps {
  movies: MovieCardProps[];
  onMovieClick: (movie: MovieCardProps) => void;
}

const RecommendedRow: React.FC<RecommendedRowProps> = ({ movies, onMovieClick }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <div className="movie-row-title">Recommended for You</div>
      <div className="movie-row-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.show_id}
            show_id={movie.show_id}
            title={movie.title}
            posterUrl={`https://cinenicheposters.blob.core.windows.net/posters/${movie.show_id}.jpg`}
            onClick={() => onMovieClick(movie)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedRow;
