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
          <img src={movie.poster} alt={movie.title} className="modal-poster" />
          <div className="modal-info">
            <h2>{movie.title}</h2>

            <div className="modal-genres">
              {movie.genres?.map((genre) => (
                <span key={genre} className="genre-badge">{genre}</span>
              ))}
            </div>

            <div className="modal-rating">
  <span className="rating-label">Rating:</span> <span>{movie.rating} / 10</span>
</div>


            <p><strong>Director:</strong> Unknown</p>
            <p><strong>Cast:</strong> Unknown</p>

<div className="modal-right-meta">
  {movie.cast && (
    <p><span className="label">Cast:</span> {movie.cast}, <em>more</em></p>
  )}
  {movie.genres && (
    <p><span className="label">Genres:</span> {movie.genres.join(', ')}</p>
  )}
</div>

            <button className="modal-play" onClick={() => onPlay(movie)}>
              <FaPlay className="me-2" /> Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
