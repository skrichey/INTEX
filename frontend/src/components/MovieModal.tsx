import React from 'react';
import { MovieCardProps } from '../types/Movie';
import { FaPlay } from 'react-icons/fa';
import '../styles/MovieModal.css';

interface Props {
  movie: MovieCardProps;
  onClose: () => void;
  onPlay: (movie: MovieCardProps) => void;
}

const MovieModal: React.FC<Props> = ({ movie, onClose, onPlay }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content-horizontal">
          <img
            src={movie.posterUrl || `/posters/${movie.show_id}.jpg`}
            alt={movie.title}
            className="modal-poster-left"
          />
          <div className="modal-info-right">
            <h2 className="modal-title">{movie.title}</h2>

            {movie.rating && (
              <div className="modal-meta mb-2">
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.releaseYear && movie.duration && <span className="mx-2">•</span>}
              {movie.duration && <span>{movie.duration}</span>}
              {movie.rating && (
                <>
                  <span className="mx-2">•</span>
                  <strong>{movie.rating.toFixed(1)}</strong> / 10
                </>
              )}
            </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className="modal-genres mb-3">
                {movie.genres.map((genre) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
