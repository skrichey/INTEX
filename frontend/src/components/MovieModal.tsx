import React from 'react';
import { MovieCardProps } from '../types/Movie';
import { FaStar, FaPlay } from 'react-icons/fa';
import '../styles/MovieModal.css';

interface Props {
  movie: MovieCardProps;
  onClose: () => void;
  onPlay: (movie: MovieCardProps) => void;
}

const MovieModal: React.FC<Props> = ({ movie, onClose, onPlay }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-content">
          <img
            src={movie.posterUrl || `/posters/${movie.show_id}.jpg`}
            alt={movie.title}
            className="modal-poster"
          />
          <div className="modal-info">
            <h2>{movie.title}</h2>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="modal-genres">
                {movie.genres.map((genre) => (
                  <span key={genre} className="genre-badge">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            {movie.rating && (
              <div className="modal-rating">
                <span className="rating-label">Rating:</span>{' '}
                <span><span className="text-warning me-1"><FaStar /></span>{movie.rating} / 10</span>
              </div>
            )}

            {/* Director & Cast */}
            <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
            <p><strong>Cast:</strong> {movie.cast || 'Unknown'}</p>

            {/* Description */}
            {movie.description && (
              <p className="modal-description">{movie.description}</p>
            )}

            {/* Play Button */}
            <button className="modal-play" onClick={() => onPlay(movie)}>
              <span className="me-2"><FaPlay /></span> Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
