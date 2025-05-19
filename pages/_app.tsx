import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import Image from 'next/image'

// Override the default Next.js Image component to add better error handling
const OriginalNextImage = Image;
// @ts-ignore - Overriding the Image component
Image = function CustomImage(props: any) {
  const { onError, ...rest } = props;

  const handleError = (e: any) => {
    console.log('Global image error handler triggered for:', props.src);

    // Try to apply a fallback if the image is from the steaks directory
    if (typeof props.src === 'string' && props.src.includes('/steaks/')) {
      const imgElement = e.target as HTMLImageElement;
      const filename = props.src.split('/').pop();
      const fallbackSrc = `/${filename}`;

      console.log(`Trying global fallback: ${fallbackSrc}`);
      imgElement.src = fallbackSrc;
    }

    // Call the original onError handler if provided
    if (onError) {
      onError(e);
    }
  };

  return <OriginalNextImage {...rest} onError={handleError} />;
};

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
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function(tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'img') {
        element.addEventListener('error', function(e) {
          console.log('Global DOM image error handler triggered for:', (e.target as HTMLImageElement).src);
        });
      }
      return element;
    };

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
      // Restore original createElement
      document.createElement = originalCreateElement;
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
