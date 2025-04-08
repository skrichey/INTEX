import React, { useState, useEffect } from 'react';
import AdminMovieCard from '../components/admin/AdminMovieCard';
import EditMovieModal from '../components/admin/EditMovieModal';
import AddMovieModal from '../components/admin/AddMovie';
import Pagination from '../components/Pagination';
import { AdminMovie } from '../types/AdminMovie';
import { Button } from 'react-bootstrap';
import "../styles/AdminPage.css";

import {
  fetchAdminMovies,
  addMovie,
  updateMovie,
  deleteMovie
} from '../api/movieService';

const PAGE_SIZE = 50;

const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchAdminMovies();
        const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
        setMovies(sorted);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    loadMovies();
  }, []);

  const handleOpenModal = (movie: AdminMovie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleUpdate = async (updated: AdminMovie) => {
    try {
      await updateMovie(updated.show_id, updated);
      setMovies((prev) => prev.map((m) => (m.show_id === updated.show_id ? updated : m)));
      handleCloseModal();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m.show_id !== id));
      handleCloseModal();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleAdd = async (newMovie: AdminMovie) => {
    try {
      await addMovie(newMovie);
      setMovies((prev) => [...prev, newMovie]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentMovies = movies.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(movies.length / PAGE_SIZE);

  return (
    <div className="admin-page container-fluid py-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Movies</h2>
        <Button variant="danger" onClick={() => setShowAddModal(true)}>
          Add Movie
        </Button>
      </div>

      <div className="admin-movie-grid">
        {currentMovies.map((movie) => (
          <AdminMovieCard
            key={movie.show_id}
            movie={movie}
            onClick={() => handleOpenModal(movie)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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