import React, { useState, useEffect } from 'react';
import { MovieCardProps } from '../types/Movie';
import { FaPlay } from 'react-icons/fa';
import '../styles/MovieModal.css';
import { POSTER_BASE_URL, fetchMovieById } from '../api/movieService';
import FallbackImage from './FallbackImage';

interface Props {
  movie: MovieCardProps;
  onClose: () => void;
  onPlay: (movie: MovieCardProps) => void;
}

const MovieModal: React.FC<Props> = ({ movie: initialMovie, onClose, onPlay }) => {
  const [movie, setMovie] = useState<MovieCardProps>(initialMovie);
  const [userRating, setUserRating] = useState<number | null>(null);

  const isNumericRating = typeof movie.rating === 'number' && !isNaN(movie.rating);
  const poster = movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg`;

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Update modal content if the passed movie changes
  useEffect(() => {
    setMovie(initialMovie);
  }, [initialMovie]);

  const handleUserRating = (rating: number) => {
    const existing = movie.userRatings || [];
    const updatedRatings = [...existing, rating];

    const newAverage =
      updatedRatings.reduce((sum, r) => sum + r, 0) / updatedRatings.length;

    const updatedMovie = { ...movie, userRatings: updatedRatings, rating: newAverage };
    localStorage.setItem(`rating-${movie.show_id}`, JSON.stringify(updatedRatings));
    setMovie(updatedMovie);
    setUserRating(rating);
  };

  const handleRecommendedClick = async (id: string) => {
    try {
      const data = await fetchMovieById(id);
      if (data) {
        setMovie(data);
      } else {
        console.error('Movie data is null');
      }
      setUserRating(null); // reset user rating
    } catch (err) {
      console.error('Failed to load recommended movie:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content-horizontal">
          {/* Left: Poster */}
          <FallbackImage
            src={poster}
            alt={movie.title}
            className="modal-poster-left"
            title={movie.title}
          />

          {/* Right: Info + scrollable content */}
          <div className="modal-info-right">
            <h2 className="modal-title">{movie.title}</h2>

            <div className="modal-meta mb-2">
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.duration && (
                <>
                  <span className="mx-2">•</span>
                  <span>{movie.duration}</span>
                </>
              )}
              <span className="mx-2">•</span>
              <span>
                {isNumericRating ? (movie.rating ?? 0).toFixed(1) : 'Not Rated'} / 5

              </span>
            </div>

            {(movie.genres ?? []).length > 0 && (
              <div className="modal-genres mb-3">
                {(movie.genres ?? []).map((genre) => (
                  <span key={genre} className="genre-badge">{genre}</span>
                ))}
              </div>
            )}

            {movie.description && (
              <p className="modal-description mb-3">{movie.description}</p>
            )}

            <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
            <p><strong>Cast:</strong> {movie.cast || 'Unknown'}</p>

            <button className="modal-play mt-3" onClick={() => onPlay(movie)}>
              <span className="me-2"><FaPlay /></span> Play
            </button>

            {/* User Rating */}
            <div className="user-rating mt-4">
              <p><strong>Rate this movie:</strong></p>
              <div className="rating-options">
              {[1, 2, 3, 4, 5].map((num) => (

                  <button
                    key={num}
                    onClick={() => handleUserRating(num)}
                    className={`rating-btn ${userRating === num ? 'selected' : ''}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended movies */}
            <div className="recommended-section mt-5">
              <h4 className="mb-3">Watch Next</h4>
              <div className="recommended-row">
                {(movie.recommended || []).slice(0, 5).map((rec) => (
                  <img
                    key={rec.show_id}
                    src={rec.posterUrl || `${POSTER_BASE_URL}${rec.show_id}.jpg`}
                    alt={rec.title}
                    title={rec.title}
                    className="recommended-thumbnail"
                    onClick={() => handleRecommendedClick(rec.show_id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
