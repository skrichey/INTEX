import React from 'react';
import { AdminMovie } from '../../types/AdminMovie';

interface AdminMovieCardProps {
  movie: AdminMovie;
  onClick: () => void;
}

const AdminMovieCard: React.FC<AdminMovieCardProps> = ({ movie, onClick }) => {
  return (
    <div className="admin-movie-card" onClick={onClick}>
      <img
        src={movie.posterUrl || `/posters/${movie.title}.jpg`}
        alt={movie.title}
        className="poster-img"
      />
      <p className="fw-bold mt-2 text-center small">{movie.title}</p>
    </div>
  );
};

export default AdminMovieCard;
