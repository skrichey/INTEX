import React from 'react';
import { MovieCardProps } from '../types/Movie';
import '../styles/MovieRow.css';
import FallbackImage from './FallbackImage';
import { POSTER_BASE_URL } from '../api/movieService';

// Extend MovieCardProps to include onClick for this component
interface MovieWithClick extends MovieCardProps {
  onClick: () => void;
}

interface Props {
  title: string;
  movies: MovieWithClick[];
}

const MovieRow: React.FC<Props> = ({ title, movies }) => {
  return (
    <section className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-container">
        {movies.map((movie) => (
          <div
            key={movie.show_id}
            className="movie-card"
            onClick={() => {
              console.log("Movie clicked:", movie.title);
              movie.onClick();
            }}
          >
            <FallbackImage
              src={movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg`}
              alt={movie.title}
              title={movie.title}
              className="movie-poster"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
