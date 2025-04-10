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
  deleteMovie,
  POSTER_BASE_URL
} from '../api/movieService';

const PAGE_SIZE = 48;

const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchAdminMovies(currentPage, PAGE_SIZE);
        const enriched = data.movies.map((movie) => ({
          ...movie,
          posterUrl: movie.posterUrl || `${POSTER_BASE_URL}${movie.show_id}.jpg`,
        }));

        const sorted = enriched.sort((a, b) => a.title.localeCompare(b.title));
        setMovies(sorted);
        setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));

        const savedQuery = localStorage.getItem("adminSearchQuery") || '';
        setSearchQuery(savedQuery);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    loadMovies();

    return () => {
      localStorage.removeItem("adminSearchQuery"); // optional cleanup
    };
  }, [currentPage]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="admin-page container-fluid py-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Movies</h2>
        <Button variant="danger" onClick={() => setShowAddModal(true)}>
          Add Movie
        </Button>
      </div>

      <div className="admin-movie-grid">
        {filteredMovies.map((movie) => (
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
      <div className="text-center text-light mt-2">
        Page {currentPage} of {totalPages}
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
