import React from 'react';
import { MovieCardProps } from '../types/Movie';

const MovieCard: React.FC<MovieCardProps> = ({ show_id, title, posterUrl, onClick }) => {
  return (
    <div
      className="card bg-dark text-light border-0 shadow-sm"
      style={{ width: '10.5rem', cursor: 'pointer', transition: 'transform 0.3s' }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={posterUrl || `/posters/${show_id}.jpg`}
        className="card-img-top"
        alt={title}
        style={{ objectFit: 'cover' }}
      />
      <div className="card-body p-2">
        <h5 className="card-title text-center text-truncate fs-6 fw-semibold m-0">{title}</h5>
      </div>
    </div>
  );
};

export default MovieCard;
