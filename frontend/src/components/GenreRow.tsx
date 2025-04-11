import React from 'react';
import { MovieCardProps } from '../types/Movie';
import MovieCard from './MovieCard'; // Make sure this import is correct
import '../styles/MovieRow.css'; // Keep your styling for movie rows

interface GenreRowProps {
    title: string;
    movies: MovieCardProps[];
    onMovieClick: (movie: MovieCardProps) => void;
  }
  
  export const GenreRow: React.FC<GenreRowProps> = ({ title, movies, onMovieClick }) => {
    return (
      <div className="movie-row">
        <div className="movie-row-title">{title}</div>
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
  
