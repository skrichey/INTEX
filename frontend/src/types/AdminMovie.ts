export interface AdminMovie {
  show_id: string;
  title: string;
  type?: string;
  director?: string;
  cast?: string;
  releaseYear?: number;
  duration?: string;
  description?: string;
  genres?: string[];
  rating?: number;
  posterUrl: string;
}