import { useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import styles from '../styles/Home.module.css';

interface Steak {
  name: string;
  image: string;
}

const STEAK_TYPES: Steak[] = [
  { name: 'Ribeye', image: '/steaks/Ribeye.webp' },
  { name: 'Filet Mignon', image: '/steaks/Fillet_mignon.webp' },
  { name: 'New York Strip', image: '/steaks/new_york_strip.webp' },
  { name: 'T-Bone', image: '/steaks/Tbone.webp' },
  { name: 'Porterhouse', image: '/steaks/porterhouse.webp' },
  { name: 'Flank Steak', image: '/steaks/flanksteak.webp' },
  { name: 'Skirt Steak', image: '/steaks/skirt_steak.webp' },
  { name: 'Top Sirloin', image: '/steaks/top_sirloin.webp' },
  { name: 'Flat Iron', image: '/steaks/flatiron.webp' },
  { name: 'Hanger Steak', image: '/steaks/hanger_steak.webp' },
  { name: 'Tri-Tip', image: '/steaks/tri_tip.webp' },
  { name: 'Chuck Steak', image: '/steaks/chuck_steak.webp' },
  { name: 'Tomahawk', image: '/steaks/tomahawk.webp' },
  { name: 'Denver Steak', image: '/steaks/denver_steak.webp' },
  { name: 'Picanha', image: '/steaks/picanha.webp' },
  { name: 'Beef Shanks', image: '/steaks/beef_shank.webp' },
  { name: 'Brisket', image: '/steaks/brisket.webp' },
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

  const handleDragStart = (e: React.DragEvent, steak: Steak, fromRank: string) => {
    e.dataTransfer.setData('steak', JSON.stringify({ steak, fromRank }));
  };

  const handleDrop = (e: React.DragEvent, toRank: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('steak'));
    const { steak, fromRank } = data;

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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getTop5 = () => {
    const allRanked = [...rankings.S, ...rankings.A, ...rankings.B, ...rankings.C, ...rankings.D];
    return allRanked.slice(0, 5);
  };

  const generateImage = async () => {
    if (!rankingRef.current) return;

    try {
      const canvas = await html2canvas(rankingRef.current, {
        backgroundColor: '#1a1f2e',
        scale: 2, // Higher quality
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
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Steak Ranking App</title>
        <meta name="description" content="Rank your favorite steaks" />
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
                <li>Once you&apos;re satisfied with your ranking, click &quot;Generate Top 5 Image&quot; to create a shareable image of your top picks.</li>
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
                        className={styles.steakItem}
                      >
                        <Image 
                          src={steak.image} 
                          alt={steak.name}
                          width={70}
                          height={70}
                          style={{ objectFit: 'cover' }}
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
                  className={styles.steakItem}
                >
                  <Image 
                    src={steak.image} 
                    alt={steak.name}
                    width={70}
                    height={70}
                    style={{ objectFit: 'cover' }}
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
        >
          Generate Top 5 Image
        </button>
      </main>
    </div>
  );
};

export default Home;
