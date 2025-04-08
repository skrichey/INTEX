import React, { useState } from 'react';
import AdminMovieCard from '../components/admin/AdminMovieCard';
import EditMovieModal from '../components/admin/EditMovieModal';
import AddMovieModal from '../components/admin/AddMovie'; // Adjusted path to match the correct location
import { AdminMovie } from '../types/AdminMovie';
import { Button } from 'react-bootstrap';
import "../styles/AdminPage.css";

const mockAdminMovies: AdminMovie[] = [
  {
    show_id: 's1',
    title: 'Inception',
    posterUrl: '/posters/Inception.jpg',
    releaseYear: 2010,
    director: 'Christopher Nolan',
    rating: 4.8,
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
    genres: ['Sci-Fi', 'Thriller'],
    duration: '2h 28m',
    description: 'A thief who steals corporate secrets through dream-sharing tech.',
  },
  {
    show_id: 's2',
    title: 'The Dark Knight',
    posterUrl: '/posters/The Dark Knight.jpg',
    releaseYear: 2008,
    director: 'Christopher Nolan',
    rating: 4.9,
    cast: 'Christian Bale, Heath Ledger',
    genres: ['Action', 'Crime'],
    duration: '2h 32m',
    description: 'Batman faces his greatest psychological and physical tests.',
  },
];

const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<AdminMovie[]>(mockAdminMovies);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenModal = (movie: AdminMovie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleUpdate = (updated: AdminMovie) => {
    setMovies((prev) =>
      prev.map((m) => (m.show_id === updated.show_id ? updated : m))
    );
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.show_id !== id));
    handleCloseModal();
  };

  const handleAdd = (newMovie: AdminMovie) => {
    setMovies((prev) => [...prev, newMovie]);
    setShowAddModal(false);
  };

  return (
    <div className="admin-page container-fluid py-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Movies</h2>
        <Button variant="danger" onClick={() => setShowAddModal(true)}>
          Add Movie
        </Button>
      </div>
      <div className="admin-movie-grid">
        {movies.map((movie) => (
          <AdminMovieCard
            key={movie.show_id}
            movie={movie}
            onClick={() => handleOpenModal(movie)}
          />
        ))}
      </div>

      {selectedMovie && (
        <EditMovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {showAddModal && (
        <AddMovieModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default AdminMoviesPage;
