import React from 'react';
import { MovieCardProps } from '../types/Movie';
import MovieCard from './MovieCard'; // Make sure the import path is correct
import '../styles/MovieRow.css'; // Make sure it's consistent

interface RecommendedRowProps {
  movies: MovieCardProps[];
}

const RecommendedRow: React.FC<RecommendedRowProps> = ({ movies }) => {
  return (
    <div className="movie-row">
      <div className="movie-row-title">Recommended for You</div>
      <div className="movie-row-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.show_id}
            show_id={movie.show_id}
            title={movie.title}
            posterUrl={`https://cinenicheposters.blob.core.windows.net/posters/${movie.show_id}.jpg`} // Using the URL for the poster
            onClick={() => console.log(`Clicked on ${movie.title}`)} // Handle the click as needed
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedRow;
