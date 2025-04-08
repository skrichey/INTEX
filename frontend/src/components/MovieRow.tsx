import React from 'react';
import MovieCard from './MovieCard';
import { MovieCardProps } from '../types/Movie';

type MovieRowProps = {
  title: string;
  movies: MovieCardProps[];
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <div className="mb-5">
      <h2 className="fs-4 fw-bold text-light mb-3 ms-2">{title}</h2>
      <div
        className="d-flex overflow-auto px-2 pb-2"
        style={{ gap: '1rem', scrollSnapType: 'x mandatory' }}
      >
        {movies.map((movie) => (
          <div key={movie.show_id} style={{ scrollSnapAlign: 'start' }}>
            <MovieCard {...movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
