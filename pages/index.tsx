
import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

interface Steak {
  name: string;
  image: string;
}

const STEAK_TYPES: Steak[] = [
  { name: 'Ribeye', image: '/steaks/ribeye.jpg' },
  { name: 'Filet Mignon', image: '/steaks/filet.jpg' },
  { name: 'New York Strip', image: '/steaks/nystrip.jpg' },
  { name: 'T-Bone', image: '/steaks/tbone.jpg' },
  { name: 'Porterhouse', image: '/steaks/porterhouse.jpg' },
  { name: 'Flank Steak', image: '/steaks/flank.jpg' },
  { name: 'Skirt Steak', image: '/steaks/skirt.jpg' },
  { name: 'Top Sirloin', image: '/steaks/sirloin.jpg' },
  { name: 'Flat Iron', image: '/steaks/flatiron.jpg' },
  { name: 'Hanger Steak', image: '/steaks/hanger.jpg' },
  { name: 'Tri-Tip', image: '/steaks/tritip.jpg' },
  { name: 'Chuck Steak', image: '/steaks/chuck.jpg' },
  { name: 'Tomahawk', image: '/steaks/tomahawk.jpg' },
  { name: 'Denver Steak', image: '/steaks/denver.jpg' },
  { name: 'Picanha', image: '/steaks/picanha.jpg' },
  { name: 'Beef Shanks', image: '/steaks/shanks.jpg' },
  { name: 'Brisket', image: '/steaks/brisket.jpg' },
];

const RANKS = ['S', 'A', 'B', 'C', 'D'];

const Home = () => {
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
      newRankings[fromRank] = prev[fromRank].filter(s => s.name !== steak.name);
      newRankings[toRank] = [...prev[toRank], steak];
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Steak Ranking App</title>
        <meta name="description" content="Rank your favorite steaks" />
      </Head>

      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>Steak Ranking</h1>
          <div className={styles.howTo}>
          <h2>How to Rank Your Steaks</h2>
          <ol>
            <li>Drag and drop steaks from the "Unranked Steaks" section into your preferred rank (S being the best, D being the lowest).</li>
            <li>You can place multiple steaks in each rank.</li>
            <li>Rearrange steaks between ranks by dragging them to different tiers.</li>
            <li>Once you're satisfied with your ranking, click "Generate Top 5 Image" to create a shareable image of your top picks.</li>
          </ol>
        </div>
        
        <div className={styles.rankingSystem}>
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
                    <img src={steak.image} alt={steak.name} />
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
                <img src={steak.image} alt={steak.name} />
                <p>{steak.name}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.generateButton}
          onClick={() => {
            const top5 = getTop5();
            // Here you would generate and download the image
            console.log('Top 5 steaks:', top5);
          }}
        >
          Generate Top 5 Image
        </button>
      </main>
    </div>
  );
};

export default Home;
