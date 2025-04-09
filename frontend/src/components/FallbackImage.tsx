import React, { useState } from 'react';
import PosterPlaceholder from './PosterPlaceholder';

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  title: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({ src, alt, className, title }) => {
  const [hasError, setHasError] = useState(false);

  return !hasError ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  ) : (
    <div className={className}>
      <PosterPlaceholder title={title} />
    </div>
  );
};

export default FallbackImage;
