export type MovieCardProps = {
    type: string;
    show_id: string;
    title: string;
    director?: string;
    cast?: string;
    releaseYear?: number;
    duration?: string;
    description?: string;
    genres?: string[];
    rating?: number; // average user rating
    posterUrl?: string;
    onClick?: () => void;
    recommended?: MovieCardProps[]; // Recommended movies
  };
  