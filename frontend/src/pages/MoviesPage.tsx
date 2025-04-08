import React, { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { MovieCardProps } from '../types/Movie';
import { fetchMovies, fetchRecommendedMovies } from '../api/movieService';
import genreColumns from '../constants/genreColumns';

const MAX_CONTINUE_WATCHING = 10;
const MOVIES_PER_ROW = 10;
const useDummyData = true;

const dummyMovies: MovieCardProps[] = [
  {
    show_id: 'm1',
    title: 'Cyber Rebellion',
    rating: 8.4,
    posterUrl: '/posters/s1.jpg',
    genres: ['Sci-Fi'],
  },
  {
    show_id: 'm2',
    title: 'Dreamscape',
    rating: 7.8,
    posterUrl: '/posters/s2.jpg',
    genres: ['Fantasy'],
  },
];


const MoviesPage: React.FC = () => {
  const [recommended, setRecommended] = useState<MovieCardProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);
  const [continueWatching, setContinueWatching] = useState<MovieCardProps[]>([]);
  const [genreMap, setGenreMap] = useState<Record<string, MovieCardProps[]>>({});

  useEffect(() => {
    if (useDummyData) {
      setRecommended(dummyMovies);
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchMovies();

        const enrichedMovies = data.map((movie) => {
          const genres = genreColumns.filter((col) => (movie as any)[col] === 1);
          return { ...movie, genres };
        });

        const genres: Record<string, MovieCardProps[]> = {};
        for (const movie of enrichedMovies) {
          const primaryGenre = movie.genres?.[0];
          if (!primaryGenre) continue;
          if (!genres[primaryGenre]) genres[primaryGenre] = [];
          genres[primaryGenre].push(movie);
        }

        for (const genre in genres) {
          genres[genre] = genres[genre]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, MOVIES_PER_ROW);
        }

        setGenreMap(genres);

        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const recommendedData = await fetchRecommendedMovies(userId);
            const enrichedRecommended = recommendedData.map((movie) => {
              const genres = genreColumns.filter((col) => (movie as any)[col] === 1);
              return { ...movie, genres };
            });
            setRecommended(enrichedRecommended.slice(0, MOVIES_PER_ROW));
          } catch (err) {
            console.warn('Recommended fetch failed:', err);
          }
        }

        const localIds = JSON.parse(localStorage.getItem('continueWatching') || '[]');
        const recent = enrichedMovies.filter((m) => localIds.includes(m.show_id));
        const ordered = localIds
          .map((id: string) => recent.find((m) => m.show_id === id))
          .filter(Boolean) as MovieCardProps[];
        setContinueWatching(ordered);
      } catch (error) {
        console.error('Failed to load movies:', error);
      }
    };

    loadData();
  }, []);

  const handleCardClick = (movie: MovieCardProps) => {
    setSelectedMovie(movie);
  };

  const handlePlay = (movie: MovieCardProps) => {
    const existing = JSON.parse(localStorage.getItem('continueWatching') || '[]');
    const updated = [movie.show_id, ...existing.filter((id: string) => id !== movie.show_id)].slice(0, MAX_CONTINUE_WATCHING);
    localStorage.setItem('continueWatching', JSON.stringify(updated));
    setContinueWatching((prev) => {
      const filtered = prev.filter((m) => m.show_id !== movie.show_id);
      return [movie, ...filtered].slice(0, MAX_CONTINUE_WATCHING);
    });
  };

  return (
    <div className="bg-dark text-light min-vh-100 px-3 pb-5 overflow-auto">
      {useDummyData ? (
        <MovieRow
          title="Recommended for You"
          movies={dummyMovies.map((movie) => ({
            ...movie,
            onClick: () => handleCardClick(movie),
          }))}
        />
      ) : (
        <>
          {continueWatching.length > 0 && (
            <MovieRow
              title="Continue Watching"
              movies={continueWatching.map((movie) => ({ ...movie, onClick: () => handleCardClick(movie) }))}
            />
          )}

          <MovieRow
            title="Recommended for You"
            movies={recommended.map((movie) => ({ ...movie, onClick: () => handleCardClick(movie) }))}
          />

          {Object.entries(genreMap).map(([genre, genreMovies]) => (
            <MovieRow
              key={genre}
              title={genre}
              movies={genreMovies.map((movie) => ({ ...movie, onClick: () => handleCardClick(movie) }))}
            />
          ))}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
};

export default MoviesPage;
