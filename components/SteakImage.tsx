import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SteakImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  onLoad?: () => void;
}

const SteakImage = ({ src, alt, width, height, priority = false, onLoad }: SteakImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Extract the filename from the path
  const filename = src.split('/').pop() || '';
  
  // Always use the root path for the image
  const imagePath = `/${filename}`;
  
  // Reset error state if src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);
  
  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  };
  
  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        src={imagePath}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          opacity: loaded ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}
        unoptimized // Ensure images work with Cloudflare
        loading="eager"
      />
    </div>
  );
};

export default SteakImage;
