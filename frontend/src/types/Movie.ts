export interface MovieCardProps {
  show_id: string;
  title: string;
  description?: string;
  release_year?: number;
  duration?: string;
  genres?: string[];
  director?: string;
  cast?: string;
  rating?: number;
  posterUrl?: string;
  recommended?: Array<{
    show_id: string;
    title: string;
    posterUrl?: string;
  }>;
  userRatings?: number[]; // Added userRatings property
  onClick?: () => void; // Add onClick property as optional
}
