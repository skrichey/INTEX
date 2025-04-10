import React, { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { MovieCardProps } from '../types/Movie';
import {
  fetchMovies,
  fetchRecommendedMovies,
  POSTER_BASE_URL,
  API_URL,
} from '../api/movieService';
import genreColumns from '../constants/genreColumns';

const MAX_CONTINUE_WATCHING = 10;
const MOVIES_PER_ROW = 10;

const genreList = [
  "Action", "Adventure", "Anime Series International TV Shows",
  "British TV Shows Docuseries International TV Shows", "Children", "Comedies",
  "Comedies Dramas International Movie", "Comedies International Movies",
  "Comedies Romantic Movies", "Crime TV Shows Docuseries", "Documentaries",
  "Documentaries International Movies", "Docuseries", "Dramas",
  "Dramas International Movies", "Dramas Romantic Movies", "Family Movies",
  "Fantasy", "Horror Movies", "International Movies Thrillers",
  "International TV Shows Romantic TV Shows TV Dramas", "Kids' TV",
  "Language TV Shows", "Musicals", "Nature TV", "Reality TV", "Spirituality",
  "TV Action", "TV Comedies", "TV Dramas", "Talk Shows TV Comedies", "Thrillers"
];

const MoviesPage: React.FC = () => {
  const [recommended, setRecommended] = useState<MovieCardProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);
  const [continueWatching, setContinueWatching] = useState<MovieCardProps[]>([]);
  const [genreMap, setGenreMap] = useState<Record<string, MovieCardProps[]>>({});
  const [genreRecs, setGenreRecs] = useState<Record<string, MovieCardProps[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMovies();

        const enrichedMovies = data.map((movie) => {
          const genres = genreColumns.filter((col) => (movie as any)[col] === 1);
          return {
            ...movie,
            genres,
            posterUrl: movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg?v=${movie.show_id}`,
          };
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

        localStorage.setItem('userId', '1');
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const recommendedData = await fetchRecommendedMovies(userId);
            const enrichedRecommended = recommendedData.map((movie) => {
              const genres = Array.isArray(movie.genres)
                ? movie.genres
                : genreColumns.filter((col) => (movie as any)[col] === 1);
              return {
                ...movie,
                genres,
                posterUrl: movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg?v=${movie.show_id}`,
              };
            });
            setRecommended(enrichedRecommended.slice(0, MOVIES_PER_ROW));

            const genreResults: Record<string, MovieCardProps[]> = {};
            await Promise.all(
              genreList.map(async (genre) => {
                const url = `${API_URL}/Recommendations/genre?userId=${userId}&genre=${encodeURIComponent(genre)}`;
                console.log('Fetching genre:', genre, url);
                const res = await fetch(url);
                const contentType = res.headers.get('Content-Type') || '';

                if (res.ok && contentType.includes('application/json')) {
                  const data = await res.json();
                  const enrichedGenre = data.map((movie: any) => ({
                    ...movie,
                    genres: movie.genres ?? [],
                    posterUrl: movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg?v=${movie.show_id}`,
                  }));
                  genreResults[genre] = enrichedGenre.slice(0, MOVIES_PER_ROW);
                } else {
                  console.warn(`Skipping genre "${genre}" due to bad response ${res.status} and contentType: ${contentType}`);
                }
              })
            );
            setGenreRecs(genreResults);
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
      {continueWatching.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatching.map((movie) => ({
            ...movie,
            onClick: () => handleCardClick(movie),
          }))}
        />
      )}

      {recommended.length > 0 && (
        <MovieRow
          title="Recommended for You"
          movies={recommended.map((movie) => ({
            ...movie,
            onClick: () => handleCardClick(movie),
          }))}
        />
      )}

      {Object.entries(genreMap).map(([genre, genreMovies]) => (
        <MovieRow
          key={genre}
          title={genre}
          movies={genreMovies.map((movie) => ({
            ...movie,
            onClick: () => handleCardClick(movie),
          }))}
        />
      ))}

      {Object.entries(genreRecs)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([genre, movies]) =>
          movies.length > 0 ? (
            <MovieRow
              key={`rec-${genre}`}
              title={`Top Picks in ${genre}`}
              movies={movies.map((movie) => ({
                ...movie,
                onClick: () => handleCardClick(movie),
              }))}
            />
          ) : null
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
