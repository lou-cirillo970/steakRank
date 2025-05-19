import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  // Handle viewport height for mobile browsers
  useEffect(() => {
    // Fix for mobile viewport height issues (100vh)
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)

    // Register service worker for image URL interception
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Simple image error handler
    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;

      if (img && img.src) {
        console.log('Image failed to load:', img.src);

        // Check if this is a steak image
        const filename = img.src.split('/').pop();
        const isSteak = filename && (
          filename.includes('steak') ||
          filename.includes('Ribeye') ||
          filename.includes('Tbone') ||
          filename.includes('fillet') ||
          filename.includes('Fillet') ||
          filename.includes('beef') ||
          filename.includes('picanha') ||
          filename.includes('tomahawk')
        );

        // For steak images, we don't need to do anything as our custom loader
        // should already be using the SVG placeholders from the root directory
        if (isSteak) {
          console.log('Steak image handled by custom loader');
          return;
        }

        // For other images, try a fallback
        if (filename && filename.includes('.')) {
          // Only try this fallback once to avoid loops
          if (!img.dataset.triedFallback) {
            img.dataset.triedFallback = 'true';
            const fallbackSrc = `/${filename}`;
            console.log(`Trying fallback path: ${fallbackSrc}`);
            img.src = fallbackSrc;
          } else {
            // If we've already tried the fallback, set a background color
            img.style.backgroundColor = '#444';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.color = 'white';
            img.style.fontSize = '10px';
            img.style.padding = '5px';
            img.style.textAlign = 'center';
          }
        }
      }
    };

    // Add the global event listener for image errors
    window.addEventListener('error', (e) => {
      if (e.target instanceof HTMLImageElement) {
        handleImageError(e);
      }
    }, true);

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
      // We can't easily remove the error event listener since it's anonymous
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1B4D3E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
