import React, { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { MovieCardProps } from '../types/Movie';
import { fetchMovies } from '../api/movieService';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    loadMovies();
  }, []);

  const handleCardClick = (movie: MovieCardProps) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="bg-dark text-light min-vh-100 px-3 pb-5 overflow-auto">
      <MovieRow
        title="Recommended for You"
        movies={movies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />
      <MovieRow
        title="Continue Watching"
        movies={movies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />
      <MovieRow
        title="Action Picks"
        movies={movies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default MoviesPage;
