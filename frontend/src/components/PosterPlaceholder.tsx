import React from 'react';
import '../styles/PosterPlaceholder.css';

interface Props {
  title: string;
}

const PosterPlaceholder: React.FC<Props> = ({ title }) => {
  return (
    <div className="poster-placeholder">
      <span>{title}</span>
    </div>
  );
};

export default PosterPlaceholder;
