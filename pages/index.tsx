import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import html2canvas from 'html2canvas';
import styles from '../styles/Home.module.css';
import SteakImage from '../components/SteakImage';

// Custom hook for responsive design
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

interface Steak {
  name: string;
  image: string;
}

// Helper function to ensure image paths work in both development and production
const getImagePath = (path: string): string => {
  // Extract the filename from the path
  const filename = path.split('/').pop() || path;

  // Always use the root path with just the filename
  // This ensures images work correctly in both development and Cloudflare Workers
  return `/${filename}`;
};

const STEAK_TYPES: Steak[] = [
  { name: 'Ribeye', image: getImagePath('steaks/Ribeye.webp') },
  { name: 'Filet Mignon', image: getImagePath('steaks/Fillet_mignon.webp') },
  { name: 'New York Strip', image: getImagePath('steaks/new_york_strip.webp') },
  { name: 'T-Bone', image: getImagePath('steaks/Tbone.webp') },
  { name: 'Porterhouse', image: getImagePath('steaks/porterhouse.webp') },
  { name: 'Flank Steak', image: getImagePath('steaks/flanksteak.webp') },
  { name: 'Skirt Steak', image: getImagePath('steaks/skirt_steak.webp') },
  { name: 'Top Sirloin', image: getImagePath('steaks/top_sirloin.webp') },
  { name: 'Flat Iron', image: getImagePath('steaks/flatiron.webp') },
  { name: 'Hanger Steak', image: getImagePath('steaks/hanger_steak.webp') },
  { name: 'Tri-Tip', image: getImagePath('steaks/tri_tip.webp') },
  { name: 'Chuck Steak', image: getImagePath('steaks/chuck_steak.webp') },
  { name: 'Tomahawk', image: getImagePath('steaks/tomahawk.webp') },
  { name: 'Denver Steak', image: getImagePath('steaks/denver_steak.webp') },
  { name: 'Picanha', image: getImagePath('steaks/picanha.webp') },
  { name: 'Beef Shanks', image: getImagePath('steaks/beef_shank.webp') },
  { name: 'Brisket', image: getImagePath('steaks/brisket.webp') },
];

const RANKS = ['S', 'A', 'B', 'C', 'D'];

const Home = () => {
  const rankingRef = useRef<HTMLDivElement>(null);
  const [rankings, setRankings] = useState<{ [key: string]: Steak[] }>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    unranked: STEAK_TYPES,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);

  // Responsive design hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  // We'll use this for image quality in the html2canvas function

  // Track loaded images for better UX
  const handleImageLoad = () => {
    setLoadedImagesCount(prev => prev + 1);
    console.log(`Loaded images: ${loadedImagesCount + 1}`);
  };

  const handleDragStart = (e: React.DragEvent, steak: Steak, fromRank: string) => {
    // Store the steak data for the drop handler
    e.dataTransfer.setData('steak', JSON.stringify({ steak, fromRank: fromRank }));

    // Add visual feedback for drag operation
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.6';
    }

    // Create a custom drag image - with error handling for Cloudflare Workers
    try {
      // Simple approach that works in most browsers
      e.dataTransfer.effectAllowed = 'move';

      // Only try to create custom drag image in environments that support it
      if (typeof document !== 'undefined') {
        const dragPreview = document.createElement('div');
        dragPreview.style.width = '70px';
        dragPreview.style.height = '70px';
        dragPreview.style.backgroundImage = `url(${steak.image})`;
        dragPreview.style.backgroundSize = 'cover';
        dragPreview.style.borderRadius = '8px';
        dragPreview.style.opacity = '0.8';
        document.body.appendChild(dragPreview);

        e.dataTransfer.setDragImage(dragPreview, 35, 35);

        // Clean up after drag operation
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);
      }
    } catch (error) {
      console.log('Custom drag image not supported');
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset opacity when drag ends
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDrop = (e: React.DragEvent, toRank: string) => {
    e.preventDefault();
    if (e.currentTarget) {
      try {
        const data = JSON.parse(e.dataTransfer.getData('steak'));
        // Destructure only what we need, ignoring fromRank
        const { steak } = data;

        setRankings(prev => {
          const newRankings = { ...prev };

          // Remove the steak from all ranks first
          Object.keys(newRankings).forEach(rank => {
            newRankings[rank] = newRankings[rank].filter(s => s.name !== steak.name);
          });

          // Then add it to the new rank
          newRankings[toRank] = [...newRankings[toRank], steak];

          return newRankings;
        });
      } catch (error) {
        console.error('Error handling drop:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Allow the drop
    e.dataTransfer.dropEffect = 'move';

    // Add visual feedback but don't add/remove classes too frequently
    // This helps with performance on Cloudflare Workers
    if (e.currentTarget instanceof HTMLElement) {
      // Use a simple style change instead of class manipulation for better performance
      const element = e.currentTarget;
      if (!element.dataset.isDragOver) {
        element.dataset.isDragOver = 'true';
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';

        setTimeout(() => {
          if (element) {
            element.style.backgroundColor = '';
            delete element.dataset.isDragOver;
          }
        }, 300);
      }
    }
  };

  // Add a class to the global CSS for the drop highlight animation
  useEffect(() => {
    // Add the CSS class to the document if it doesn't exist
    if (!document.getElementById('drop-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'drop-highlight-style';
      style.innerHTML = `
        .drop-highlight {
          animation: dropHighlight 0.3s ease-out;
        }
        @keyframes dropHighlight {
          0% { box-shadow: 0 0 0 2px #2A6E5A; }
          50% { box-shadow: 0 0 0 4px #2A6E5A; }
          100% { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up the style when component unmounts
      const styleElement = document.getElementById('drop-highlight-style');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const generateImage = async () => {
    if (!rankingRef.current) return;

    setIsGenerating(true);

    try {
      // Scroll to top to ensure full capture
      window.scrollTo(0, 0);

      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(rankingRef.current, {
        backgroundColor: '#1a1f2e',
        scale: isMobile ? 1.5 : 2, // Adjust quality based on device
        useCORS: true, // Enable CORS for images
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'steak-rankings.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SteakFlow - Rank Your Favorite Steaks</title>
        <meta name="description" content="Create your ultimate steak tier list with SteakFlow. Drag and drop to rank your favorite cuts of beef from S-tier to D-tier." />
        <meta property="og:title" content="SteakFlow - The Ultimate Steak Ranking App" />
        <meta property="og:description" content="Create and share your personal steak rankings with this interactive tier list maker." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SteakFlow</h1>
        <div className={styles.content}>
          <div>
            <div className={styles.howTo}>
              <h2>How to Rank Your Steaks</h2>
              <ol>
                <li>Drag and drop steaks from the &quot;Unranked Steaks&quot; section into your preferred rank (S being the best, D being the lowest).</li>
                <li>You can place multiple steaks in each rank.</li>
                <li>Rearrange steaks between ranks by dragging them to different tiers.</li>
                <li>Once you&apos;re satisfied with your ranking, click &quot;Generate Image&quot; to create a shareable image of your rankings.</li>
              </ol>
            </div>

            <div className={styles.rankingSystem} ref={rankingRef}>
              {RANKS.map(rank => (
                <div
                  key={rank}
                  className={styles.rankRow}
                  onDrop={e => handleDrop(e, rank)}
                  onDragOver={handleDragOver}
                >
                  <h2>{rank}</h2>
                  <div className={styles.steakContainer}>
                    {rankings[rank].map(steak => (
                      <div
                        key={steak.name}
                        draggable
                        onDragStart={e => handleDragStart(e, steak, rank)}
                        onDragEnd={handleDragEnd}
                        className={styles.steakItem}
                      >
                        <SteakImage
                          src={steak.image}
                          alt={steak.name}
                          width={70}
                          height={70}
                          priority
                          onLoad={() => handleImageLoad()}
                        />
                        <p>{steak.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.unrankedSection}>
            <h2>Unranked Steaks</h2>
            <div className={styles.steakContainer}>
              {rankings.unranked.map(steak => (
                <div
                  key={steak.name}
                  draggable
                  onDragStart={e => handleDragStart(e, steak, 'unranked')}
                  onDragEnd={handleDragEnd}
                  className={styles.steakItem}
                >
                  <SteakImage
                    src={steak.image}
                    alt={steak.name}
                    width={70}
                    height={70}
                    priority={rankings.unranked.indexOf(steak) < 8} // Prioritize loading first 8 images
                    onLoad={() => handleImageLoad()}
                  />
                  <p>{steak.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className={styles.generateButton}
          onClick={generateImage}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </main>
    </div>
  );
};

export default Home;
