import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AdminMovie } from '../../types/AdminMovie';

interface EditMovieModalProps {
  movie: AdminMovie;
  onClose: () => void;
  onUpdate: (movie: AdminMovie) => void;
  onDelete: (id: string) => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ movie, onClose, onUpdate, onDelete }) => {
  const [editedMovie, setEditedMovie] = useState<AdminMovie>(movie);

  useEffect(() => {
    setEditedMovie(movie);
  }, [movie]);

  const handleChange = (key: keyof AdminMovie, value: any) => {
    setEditedMovie((prev) => ({
      ...prev,
      [key]: key === 'genres' ? value.split(',').map((g: string) => g.trim()) : value,
    }));
  };

  const handleSave = () => {
    onUpdate(editedMovie);
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {([
          ['Title', 'title'],
          ['Year', 'release_year'],
          ['Director', 'director'],
          ['Cast', 'cast'],
          ['Genres (comma-separated)', 'genres'],
          ['Duration', 'duration'],
          ['Rating', 'rating'],
          ['Description', 'description'],
          ['Poster URL', 'posterUrl'],
        ] as [string, keyof AdminMovie][]).map(([label, key]) => (
          <Form.Group key={key} className="mb-3">
            <Form.Label>{label}</Form.Label>
            {key === 'description' ? (
              <Form.Control
                as="textarea"
                rows={3}
                value={editedMovie[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <Form.Control
                type={key === 'release_year' ? 'number' : 'text'}
                value={
                  key === 'genres'
                    ? (editedMovie.genres ?? []).join(', ')
                    : (editedMovie[key] as string | number | undefined) || ''
                }
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </Form.Group>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
            if (confirmDelete) {
              onDelete(movie.show_id);
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMovieModal;
