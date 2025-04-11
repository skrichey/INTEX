// src/api/movieService.ts
import { MovieCardProps } from '../types/Movie';

export const API_URL = 'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api';
export const POSTER_BASE_URL = 'https://cinenicheposters.blob.core.windows.net/posters/';

// Fetch all public movies (if used on landing page etc.)
export const fetchMovies = async (): Promise<MovieCardProps[]> => {
  try {
    const response = await fetch(`${API_URL}/Movies/all`);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Fetch a single movie by ID
export const fetchMovieById = async (id: string): Promise<MovieCardProps | null> => {
  try {
    const response = await fetch(`${API_URL}/Movies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch movie');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

// Add a new movie
export const addMovie = async (movie: Omit<MovieCardProps, 'show_id'>): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to add movie');
};

// Update an existing movie
export const updateMovie = async (id: string, movie: MovieCardProps): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update movie');
};

// Delete a movie by ID
export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete movie');
};

// Fetch recommended movies for a user
export const fetchRecommendedMovies = async (userId: string): Promise<MovieCardProps[]> => {
  try {
    const response = await fetch(`${API_URL}/Recommendations/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
};

// Fetch all movies for admin (paginated)
export const fetchAdminMovies = async (currentPage: number, pageSize: number): Promise<{
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  movies: MovieCardProps[];
}> => {
  try {
    const response = await fetch(`${API_URL}/Movies?page=${currentPage}&pageSize=${pageSize}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin movies:', error);
    throw error;
  }
};

// Fetch genre recommendations
export async function fetchGenreRecommendations(genre: string): Promise<MovieCardProps[]> {
  const userId = 1;
  const encodedGenre = encodeURIComponent(genre);
  const url = `${API_URL}/Recommendations/genre?userId=${userId}&genre=${encodedGenre}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch recommendations for genre ${genre}. Status: ${response.status}`);
    throw new Error(`Failed to fetch recommendations for genre ${genre}`);
  }

  return response.json();
}

// Fetch recommendations based on a specific movie
export const getRecommendationsByMovieId = async (showId: string): Promise<MovieCardProps[]> => {
  try {
    const response = await fetch(`${API_URL}/Recommendations/by-movie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show_id: showId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations for show_id: ${showId}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations by movie:', error);
    return [];
  }
};
