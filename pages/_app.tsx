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

      // Handle both steak images and Webflow URLs
      if (img && img.src) {
        console.log('Image failed to load:', img.src);

        // Check for Webflow URLs
        if (img.src.includes('webflow.services')) {
          const filename = img.src.split('/').pop();
          if (filename) {
            const fallbackSrc = `/${filename}`;
            console.log(`Trying fallback path for Webflow URL: ${fallbackSrc}`);
            img.src = fallbackSrc;
            return;
          }
        }

        // Check for steak images
        if (img.src.includes('/steaks/')) {
          const filename = img.src.split('/').pop();
          if (filename) {
            const fallbackSrc = `/${filename}`;
            console.log(`Trying fallback path for steak image: ${fallbackSrc}`);
            img.src = fallbackSrc;
            return;
          }
        }

        // For any other image that fails, try to extract the filename and load from root
        const filename = img.src.split('/').pop();
        if (filename && filename.includes('.')) {
          const fallbackSrc = `/${filename}`;
          console.log(`Trying fallback path for generic image: ${fallbackSrc}`);
          img.src = fallbackSrc;
        }
      }
    };

    // Add the global event listener for image errors
    window.addEventListener('error', (e) => {
      if (e.target instanceof HTMLImageElement) {
        handleImageError(e);
      }
    }, true);

    // Also intercept all image loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);

      if (tagName.toLowerCase() === 'img') {
        // Override the src property for images
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        if (originalSrcDescriptor && originalSrcDescriptor.set) {
          const originalSrcSetter = originalSrcDescriptor.set;

          Object.defineProperty(element, 'src', {
            set: function(url) {
              // Check if the URL contains webflow.services
              if (url && typeof url === 'string' && url.includes('webflow.services')) {
                console.log('Intercepted webflow URL in createElement:', url);

                // Extract the filename from the URL
                const filename = url.split('/').pop();

                // Use a local path instead
                const newUrl = '/' + filename;
                console.log('Redirecting to local URL:', newUrl);

                // Call the original setter with the new URL
                originalSrcSetter.call(this, newUrl);
              } else {
                // Call the original setter for other URLs
                originalSrcSetter.call(this, url);
              }
            },
            get: function() {
              return originalSrcDescriptor.get.call(this);
            }
          });
        }
      }

      return element;
    };

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
