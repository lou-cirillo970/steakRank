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

    // Add global error handler for images
    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      if (img && img.src && img.src.includes('/steaks/')) {
        console.log('Image failed to load:', img.src);

        // Try a fallback path
        const filename = img.src.split('/').pop();
        if (filename) {
          const fallbackSrc = `/${filename}`;
          console.log(`Trying fallback path: ${fallbackSrc}`);
          img.src = fallbackSrc;
        }
      }
    };

    // Add the global event listener
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
