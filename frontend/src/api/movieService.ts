import { MovieCardProps } from '../types/Movie';

const API_URL = 'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api';

export const POSTER_BASE_URL =
  'https://cinenicheposters.blob.core.windows.net/posters/';

// Fetch all public movies (if used on landing page etc.)
export const fetchMovies = async (): Promise<MovieCardProps[]> => {
  try {
    const response = await fetch(`${API_URL}/Movies/all`); // Correct API call
    if (!response.ok) throw new Error('Failed to fetch movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieById = async (
  id: string
): Promise<MovieCardProps | null> => {
  try {
    const response = await fetch(`${API_URL}/Movies/${id}`); // Correct API call
    if (!response.ok) throw new Error('Failed to fetch movie');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const addMovie = async (
  movie: Omit<MovieCardProps, 'show_id'>
): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
    credentials: 'include', // Ensures authentication cookie is sent with request
  });
  if (!response.ok) throw new Error('Failed to add movie');
};

export const updateMovie = async (
  id: string,
  movie: MovieCardProps
): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
    credentials: 'include', // Ensures authentication cookie is sent with request
  });
  if (!response.ok) throw new Error('Failed to update movie');
};

export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies/${id}`, {
    method: 'DELETE',
    credentials: 'include', // Ensures authentication cookie is sent with request
  });
  if (!response.ok) throw new Error('Failed to delete movie');
};

export const fetchRecommendedMovies = async (
  userId: string
): Promise<MovieCardProps[]> => {
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
export const fetchAdminMovies = async (
  currentPage: number,
  pageSize: number
): Promise<{
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  movies: MovieCardProps[];
}> => {
  try {
    const response = await fetch(
      `${API_URL}/Movies?page=${currentPage}&pageSize=${pageSize}`,
      {
        credentials: 'include', // Ensures auth cookies are sent with each request
      }
    );
    if (!response.ok) throw new Error('Failed to fetch admin movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin movies:', error);
    throw error;
  }
};




