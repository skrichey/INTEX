// src/api/movieService.ts
import api from './api';
import { MovieCardProps } from '../types/Movie';
import { AdminMovie } from '../types/AdminMovie';

export const fetchMovies = async (): Promise<MovieCardProps[]> => {
  const response = await api.get<MovieCardProps[]>('/movies');
  return response.data;
};

export const fetchAdminMovies = async (): Promise<AdminMovie[]> => {
  const response = await api.get<AdminMovie[]>('/movies');
  return response.data;
};

export const addMovie = async (movie: AdminMovie): Promise<void> => {
  await api.post('/movies', movie);
};

export const updateMovie = async (id: string, movie: AdminMovie): Promise<void> => {
  await api.put(`/movies/${id}`, movie);
};

export const deleteMovie = async (id: string): Promise<void> => {
  await api.delete(`/movies/${id}`);
};
