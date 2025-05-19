import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCallback } from 'react';

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

  // Create a colored placeholder based on the steak name
  const getColoredPlaceholder = () => {
    // Map steak names to colors
    const colorMap: Record<string, string> = {
      'Ribeye': '#E74C3C',
      'Filet Mignon': '#C0392B',
      'New York Strip': '#9B59B6',
      'T-Bone': '#8E44AD',
      'Porterhouse': '#2980B9',
      'Flank Steak': '#3498DB',
      'Skirt Steak': '#1ABC9C',
      'Top Sirloin': '#16A085',
      'Flat Iron': '#27AE60',
      'Hanger Steak': '#2ECC71',
      'Tri-Tip': '#F1C40F',
      'Chuck Steak': '#8E44AD',
      'Tomahawk': '#D35400',
      'Denver Steak': '#E67E22',
      'Picanha': '#F39C12',
      'Beef Shanks': '#BDC3C7',
      'Brisket': '#95A5A6',
    };

    // Get color based on alt text (steak name)
    const color = colorMap[alt] || '#666666';

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '5px',
        textAlign: 'center',
        borderRadius: '4px',
      }}>
        {alt}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Show the colored placeholder if there's an error or while loading */}
      {(!loaded || error) && getColoredPlaceholder()}

      {/* Use Next.js Image component with the colored placeholder as fallback */}
      <div style={{ display: loaded && !error ? 'block' : 'none' }}>
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
            opacity: 1,
            transition: 'opacity 0.3s ease',
            position: 'relative',
            zIndex: 2,
          }}
          unoptimized // Ensure images work with Cloudflare
          loading="eager"
        />
      </div>
    </div>
  );
};

export default SteakImage;
