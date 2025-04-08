import React from 'react';
import { MovieCardProps } from '../types/Movie';
import '../styles/MovieRow.css';

interface Props {
  title: string;
  movies: MovieCardProps[];
}

const MovieRow: React.FC<Props> = ({ title, movies }) => {
  return (
    <section className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-container">
        {movies.map((movie) => (
          <div key={movie.show_id} className="movie-card" onClick={movie.onClick}>
            <img
              src={movie.posterUrl || `/posters/${movie.show_id}.jpg`}
              alt={movie.title}
              className="movie-poster"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
