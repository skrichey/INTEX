import React, { useState, useEffect } from 'react';
import AdminMovieCard from '../components/admin/AdminMovieCard';
import EditMovieModal from '../components/admin/EditMovieModal';
import AddMovieModal from '../components/admin/AddMovie';
import Pagination from '../components/Pagination';
import { AdminMovie } from '../types/AdminMovie';
import { Button } from 'react-bootstrap';
import '../styles/AdminPage.css';

import {
  fetchAdminMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  POSTER_BASE_URL,
} from '../api/movieService';

const PAGE_SIZE = 48;

const AdminMoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<AdminMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<AdminMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('adminSearchQuery') || '');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        let allResults: AdminMovie[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const data = await fetchAdminMovies(page, PAGE_SIZE);
          if (!data.movies || data.movies.length === 0) {
            hasMore = false;
            break;
          }

          const enriched: AdminMovie[] = data.movies
            .filter((movie) =>
              typeof movie.show_id === 'string' && typeof movie.title === 'string'
            )
            .map((movie: any): AdminMovie => ({
              ...movie,
              posterUrl: `${POSTER_BASE_URL}${movie.show_id}.jpg?v=${movie.show_id}`,
              type: movie.type || 'Unknown',
              rating: movie.rating !== undefined ? String(movie.rating) : 'N/A',
              genres: movie.genres ?? [],
            }));

          allResults = [...allResults, ...enriched];

          if (data.movies.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            page++;
          }
        }

        const sorted = allResults.sort((a, b) => a.title.localeCompare(b.title));
        setAllMovies(sorted);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const syncSearch = () => {
      const query = localStorage.getItem('adminSearchQuery') || '';
      setSearchQuery(query);
    };

    window.addEventListener('storage', syncSearch);
    return () => window.removeEventListener('storage', syncSearch);
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query)
    );
    setFilteredMovies(results);
    setCurrentPage(1);
  }, [searchQuery, allMovies]);

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / PAGE_SIZE));

  const handleOpenModal = (movie: AdminMovie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleUpdate = async (updated: AdminMovie) => {
    try {
      await updateMovie(updated.show_id, {
        ...updated,
        rating: updated.rating ? Number(updated.rating) : undefined,
      });
      const enriched = {
        ...updated,
        rating: updated.rating ?? 'N/A',
        posterUrl: `${POSTER_BASE_URL}${updated.show_id}.jpg?v=${updated.show_id}`,
        type: updated.type || 'Unknown',
        genres: updated.genres ?? [],
      };
      setAllMovies((prev) =>
        prev.map((m) => (m.show_id === updated.show_id ? enriched : m))
      );
      handleCloseModal();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      setAllMovies((prev) => prev.filter((m) => m.show_id !== id));
      handleCloseModal();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleAdd = async (newMovie: AdminMovie) => {
    try {
      await addMovie({
        ...newMovie,
        rating: newMovie.rating ? Number(newMovie.rating) : undefined,
      });
      const enriched = {
        ...newMovie,
        rating: newMovie.rating ?? 'N/A',
        posterUrl: `${POSTER_BASE_URL}${newMovie.show_id}.jpg?v=${newMovie.show_id}`,
        type: newMovie.type || 'Unknown',
        genres: newMovie.genres ?? [],
      };
      setAllMovies((prev) =>
        [...prev, enriched].sort((a, b) => a.title.localeCompare(b.title))
      );
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
        {paginatedMovies.map((movie) => (
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

