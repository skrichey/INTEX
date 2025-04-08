// src/components/admin/AddMovieModal.tsx
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AdminMovie } from '../../types/AdminMovie';

interface AddMovieModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (movie: AdminMovie) => void;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({ show, onClose, onAdd }) => {
  const [newMovie, setNewMovie] = useState<AdminMovie>({
    show_id: '',
    title: '',
    director: '',
    cast: '',
    releaseYear: new Date().getFullYear(),
    duration: '',
    description: '',
    genres: [],
    rating: 0,
    posterUrl: '',
  });

  const handleChange = (key: keyof AdminMovie, value: any) => {
    setNewMovie((prev) => ({
      ...prev,
      [key]: key === 'genres' ? value.split(',').map((g: string) => g.trim()) : value,
    }));
  };

  const handleSubmit = () => {
    if (!newMovie.title || !newMovie.show_id) return alert('Movie title and show ID are required.');
    onAdd(newMovie);
    onClose();
    setNewMovie({
      show_id: '',
      title: '',
      director: '',
      cast: '',
      releaseYear: new Date().getFullYear(),
      duration: '',
      description: '',
      genres: [],
      rating: 0,
      posterUrl: '',
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {([['Title', 'title'], ['Show ID', 'show_id'], ['Year', 'releaseYear'], ['Director', 'director'], ['Cast', 'cast'], ['Genres (comma-separated)', 'genres'], ['Duration', 'duration'], ['Rating', 'rating'], ['Description', 'description'], ['Poster URL', 'posterUrl']] as [string, keyof AdminMovie][]).map(([label, key]) => (
          <Form.Group key={key} className="mb-3">
            <Form.Label>{label}</Form.Label>
            {key === 'description' ? (
              <Form.Control
                as="textarea"
                rows={3}
                value={newMovie[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <Form.Control
                type={key === 'releaseYear' || key === 'rating' ? 'number' : 'text'}
                value={key === 'genres' ? (newMovie.genres ?? []).join(', ') : newMovie[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </Form.Group>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit}>Add Movie</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMovieModal;
