import React, { useEffect, useState } from 'react';
import '../styles/MoviePage.css';
import { GenreRow } from '../components/GenreRow';
import RecommendedRow from '../components/RecommendedRow';
import MovieModal from '../components/MovieModal';
import { MovieCardProps } from '../types/Movie';
import { fetchGenreRecommendations, fetchRecommendedMovies } from '../api/movieService';

const MoviesPage: React.FC = () => {
  const [genreRecommendations, setGenreRecommendations] = useState<Record<string, MovieCardProps[]>>({});
  const [recommended, setRecommended] = useState<MovieCardProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);

  const genres: string[] = [
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
  ];

  // Fetch genre recommendations
  useEffect(() => {
    const fetchGenresIndividually = async () => {
      for (const genre of genres) {
        try {
          const movies = await fetchGenreRecommendations(genre);
          setGenreRecommendations((prev) => ({
            ...prev,
            [genre]: movies,
          }));
        } catch (err) {
          console.warn(`Error fetching movies for genre: ${genre}`, err);
        }
      }
    };

    fetchGenresIndividually();
  }, []);

  // Fetch "Recommended for You"
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const movies = await fetchRecommendedMovies("1"); // Replace with dynamic user ID if needed
        setRecommended(movies);
      } catch (err) {
        console.error("Failed to fetch recommended movies:", err);
      }
    };

    fetchRecommendations();
  }, []);

  const handleMovieClick = (movie: MovieCardProps) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePlayMovie = (movie: MovieCardProps) => {
    console.log(`Playing ${movie.title}`);
    // Add routing or video player logic here
  };

  return (
    <div className="movies-page">
      {/* Recommended row */}
      <div className="movies-header">
        <RecommendedRow
          movies={recommended}
          onMovieClick={handleMovieClick}
        />
      </div>

      {/* Genre rows */}
      <div className="genre-rows">
        {genres.map((genre) => (
          <GenreRow
            key={genre}
            title={`Top Picks in ${genre}`}
            movies={genreRecommendations[genre] || []}
            onMovieClick={handleMovieClick}
          />
        ))}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onPlay={handlePlayMovie}
        />
      )}
    </div>
  );
};

export default MoviesPage;
