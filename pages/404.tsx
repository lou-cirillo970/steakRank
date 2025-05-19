import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Check if the URL is for an image
    const path = router.asPath;
    if (path.endsWith('.webp') || path.endsWith('.png') || path.endsWith('.jpg')) {
      console.log('404 for image:', path);
      
      // Try to extract the filename
      const filename = path.split('/').pop();
      
      // If this is a Webflow URL, try to redirect to the local file
      if (path.includes('webflow.services') && filename) {
        console.log('Redirecting Webflow URL to local path');
        router.replace(`/${filename}`);
      } else if (filename) {
        // For other image 404s, try to load from the root
        console.log('Trying to load image from root');
        router.replace(`/${filename}`);
      }
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button 
          onClick={() => router.push('/')}
          className={styles.button}
        >
          Go Home
        </button>
      </main>
    </div>
  );
}
