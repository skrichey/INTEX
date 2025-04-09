import { MovieCardProps } from '../types/Movie';

const API_URL = 'https://your-backend-url.azurewebsites.net/api/Movies';

export const fetchMovies = async (): Promise<MovieCardProps[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieById = async (id: string): Promise<MovieCardProps | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch movie');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const addMovie = async (movie: Omit<MovieCardProps, 'show_id'>): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) throw new Error('Failed to add movie');
};

export const updateMovie = async (id: string, movie: MovieCardProps): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) throw new Error('Failed to update movie');
};

export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete movie');
};

export const fetchRecommendedMovies = async (userId: string): Promise<MovieCardProps[]> => {
    try {
      const response = await fetch(`${API_URL}/recommendations/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
      return [];
    }
  };
  
  export const fetchAdminMovies = async (): Promise<MovieCardProps[]> => {
    try {
      const response = await fetch(`${API_URL}/movies`);
      if (!response.ok) throw new Error('Failed to fetch admin movies');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching admin movies:', error);
      return [];
    }
  };
  