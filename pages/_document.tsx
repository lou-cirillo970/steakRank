import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to the origin for faster asset loading */}
        <link rel="preconnect" href="/" />

        {/* Preload critical assets with crossorigin attribute for Cloudflare compatibility */}
        <link rel="preload" href="/steaks/Ribeye.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/Fillet_mignon.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/new_york_strip.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/Tbone.webp" as="image" crossOrigin="anonymous" />

        {/* Add a meta tag to ensure proper CORS handling */}
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />

        {/* Add a script to intercept and fix Webflow image URLs */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Intercept fetch requests
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                  if (url && typeof url === 'string' && url.includes('webflow.services') && url.includes('.webp')) {
                    console.log('Intercepted webflow URL in fetch:', url);

                    // Extract the filename from the URL
                    const filename = url.split('/').pop();

                    // Use a local path instead
                    const newUrl = '/' + filename;
                    console.log('Redirecting to local URL:', newUrl);

                    return originalFetch(newUrl, options);
                  }
                  return originalFetch.apply(this, arguments);
                };

                // Override the Image constructor to intercept image loading
                const originalImage = window.Image;
                window.Image = function() {
                  const img = new originalImage(...arguments);

                  // Override the src setter
                  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
                  if (originalSrcDescriptor && originalSrcDescriptor.set) {
                    const originalSrcSetter = originalSrcDescriptor.set;

                    Object.defineProperty(img, 'src', {
                      set: function(url) {
                        // Check if the URL contains webflow.services
                        if (url && typeof url === 'string' && url.includes('webflow.services')) {
                          console.log('Intercepted webflow URL:', url);

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

                  return img;
                };

                // Patch existing images when they load
                document.addEventListener('DOMContentLoaded', function() {
                  // Fix any images that are already in the DOM
                  const images = document.querySelectorAll('img');
                  images.forEach(img => {
                    if (img.src && img.src.includes('webflow.services')) {
                      console.log('Found webflow URL in existing image:', img.src);

                      // Extract the filename from the URL
                      const filename = img.src.split('/').pop();

                      // Use a local path instead
                      const newUrl = '/' + filename;
                      console.log('Redirecting to local URL:', newUrl);

                      img.src = newUrl;
                    }
                  });
                });
              })();
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
