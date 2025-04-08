import React from 'react';
import { MovieCardProps } from '../types/Movie';

type MovieModalProps = {
  movie: MovieCardProps;
  onClose: () => void;
  onPlay: (movie: MovieCardProps) => void; // ✅ THIS LINE
};

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 z-3 px-3">
      <div className="bg-dark text-light rounded shadow-lg overflow-hidden w-100" style={{ maxWidth: '800px' }}>
        {/* Close Button */}
        <button
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
          onClick={onClose}
          aria-label="Close"
        ></button>

        {/* Content */}
        <div className="row g-0">
          {/* Poster */}
          <div className="col-md-5">
            <img
              src={movie.posterUrl || `/posters/${movie.show_id}.jpg`}
              alt={movie.title}
              className="img-fluid h-100 object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Info */}
          <div className="col-md-7 p-4">
            <h2 className="h4 fw-bold">{movie.title}</h2>
            <p className="text-muted small mb-2">
              {movie.releaseYear} • {movie.duration}
            </p>

            {/* Genres */}
            {(movie.genres?.length ?? 0) > 0 && (
              <div className="mb-3">
                {(movie.genres ?? []).map((genre) => (
                  <span
                    key={genre}
                    className="badge bg-danger me-2 mb-2"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            {movie.rating && (
              <p className="text-warning mb-2">
                ⭐ {movie.rating.toFixed(1)} / 5
              </p>
            )}

            {/* Description */}
            <p className="small mb-3">{movie.description}</p>

            <p className="small text-muted mb-1">
              <strong>Director:</strong> {movie.director || 'Unknown'}
            </p>
            <p className="small text-muted mb-3">
              <strong>Cast:</strong> {movie.cast || 'Unknown'}
            </p>

            {/* Play Button */}
            <button className="btn btn-danger mt-2">
              ▶️ Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
