export interface AdminMovie {
  show_id: string;
  title: string;
  director?: string;
  cast?: string;
  country?: string;
  release_year?: number;
  duration?: string;
  description?: string;
  genres: string[];
  rating?: string;
  posterUrl?: string;
  type?: string;
}
