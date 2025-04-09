import React from 'react';
import { MovieCardProps } from '../types/Movie';
import { POSTER_BASE_URL } from '../api/movieService';
import FallbackImage from './FallbackImage';

const MovieCard: React.FC<MovieCardProps> = ({ show_id, title, posterUrl, onClick }) => {
  const finalPoster = posterUrl || `${POSTER_BASE_URL}${show_id}.jpg`;

  return (
    <div
      className="card bg-dark text-light border-0 shadow-sm"
      style={{ width: '10.5rem', cursor: 'pointer', transition: 'transform 0.3s' }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <FallbackImage
        src={finalPoster}
        alt={title}
        className="card-img-top"
        title={title}
      />

      <div className="card-body p-2">
        <h5 className="card-title text-center text-truncate fs-6 fw-semibold m-0">{title}</h5>
      </div>
    </div>
  );
};

export default MovieCard;
