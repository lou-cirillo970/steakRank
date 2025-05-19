// Simple Service Worker to serve local images for Webflow URLs
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Claim clients so the service worker starts controlling current pages
  event.waitUntil(clients.claim());
});

// Keep track of processed URLs to prevent loops
const processedUrls = new Set();

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip if we've already processed this URL to prevent loops
  if (processedUrls.has(url.toString())) {
    return; // Let the browser handle it normally
  }

  // Check if this is a Webflow URL for an image
  if (
    (url.hostname.includes('webflow.services') || url.pathname.includes('webflow.services')) &&
    (url.pathname.endsWith('.webp') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))
  ) {
    // Mark this URL as processed
    processedUrls.add(url.toString());

    console.log('Service Worker intercepted Webflow URL:', url.toString());

    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();

    if (filename) {
      // Create a new URL to the current origin with just the filename
      const newUrl = new URL(`/${filename}`, self.location.origin);
      console.log('Service Worker redirecting to:', newUrl.toString());

      // Respond with a fetch to the local file
      event.respondWith(
        fetch(newUrl)
          .catch(() => {
            // If that fails, create a simple response with an error message
            return new Response('Image not found', { status: 404 });
          })
      );
    }
  }

  // Check for specific Webflow domain we're seeing in errors
  else if (url.toString().includes('7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82')) {
    // Mark this URL as processed
    processedUrls.add(url.toString());

    console.log('Service Worker intercepted specific Webflow domain:', url.toString());

    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();

    if (filename) {
      // Create a new URL to the current origin with just the filename
      const newUrl = new URL(`/${filename}`, self.location.origin);
      console.log('Service Worker redirecting to:', newUrl.toString());

      // Respond with a fetch to the local file
      event.respondWith(
        fetch(newUrl)
          .catch(() => {
            // If that fails, create a simple response with an error message
            return new Response('Image not found', { status: 404 });
          })
      );
    }
  }

  // For all other requests, proceed normally
  // We don't call event.respondWith() so the browser handles the request normally
});
