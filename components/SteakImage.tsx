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
  const [retryCount, setRetryCount] = useState(0);

  // Extract the filename from the path
  const filename = src.split('/').pop() || '';

  // Handle Webflow URLs
  let imagePath = src;
  if (src.includes('webflow.services')) {
    imagePath = `/${filename}`;
    console.log(`Redirecting Webflow URL to: ${imagePath}`);
  } else if (src.startsWith('steaks/') || src.includes('/steaks/')) {
    // Always use the root path for steak images
    imagePath = `/${filename}`;
    console.log(`Using root path for steak image: ${imagePath}`);
  } else if (!src.startsWith('/') && !src.startsWith('http')) {
    // Ensure all relative paths start with /
    imagePath = `/${src}`;
    console.log(`Normalizing path to: ${imagePath}`);
  }

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
    setRetryCount(0);
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error(`Failed to load image: ${imagePath}`);

    // Try one more time with just the filename if we haven't already
    if (retryCount === 0) {
      setRetryCount(1);
      console.log(`Retrying with direct filename: /${filename}`);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        src={retryCount > 0 ? `/${filename}` : imagePath}
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
          backgroundColor: error ? '#666666' : 'transparent',
        }}
        unoptimized // Ensure images work with Cloudflare
        loading="eager"
      />
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#666666',
          color: 'white',
          fontSize: '10px',
          padding: '5px',
          textAlign: 'center',
          borderRadius: '4px',
        }}>
          {alt}
        </div>
      )}
    </div>
  );
};

export default SteakImage;
