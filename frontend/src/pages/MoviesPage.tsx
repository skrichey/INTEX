import React, { useState } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { MovieCardProps } from '../types/Movie';

const mockMovies: MovieCardProps[] = [
  {
    show_id: 's25',
    title: 'Pokémon Indigo League',
    director: 'Kunihiko Yuyama',
    cast: 'Ash, Misty, Brock, Pikachu',
    releaseYear: 1997,
    duration: '82 Episodes',
    description: 'Ash Ketchum sets out to become a Pokémon Master.',
    genres: ['Animation', 'Adventure'],
    rating: 4.5,
  },
  {
    show_id: 's26',
    title: 'Inception',
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
    releaseYear: 2010,
    duration: '2h 28m',
    description: 'A skilled thief is given a chance at redemption if he can successfully perform inception.',
    genres: ['Sci-Fi', 'Thriller'],
    rating: 4.8,
  },
  {
    show_id: 's27',
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    cast: 'Christian Bale, Heath Ledger',
    releaseYear: 2008,
    duration: '2h 32m',
    description: 'Batman faces his toughest enemy yet: The Joker.',
    genres: ['Action', 'Crime'],
    rating: 4.9,
  },
];

const MoviesPage: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);

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
        movies={mockMovies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />
      <MovieRow
        title="Continue Watching"
        movies={mockMovies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />
      <MovieRow
        title="Action Picks"
        movies={mockMovies.map((movie) => ({
          ...movie,
          onClick: () => handleCardClick(movie),
        }))}
      />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default MoviesPage;
