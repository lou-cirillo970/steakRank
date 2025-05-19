// Service Worker to intercept and fix Webflow image URLs
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Claim clients so the service worker starts controlling current pages
  event.waitUntil(clients.claim());
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is a Webflow URL for an image
  if (
    (url.hostname.includes('webflow.services') || url.pathname.includes('webflow.services')) && 
    (url.pathname.endsWith('.webp') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))
  ) {
    console.log('Service Worker intercepted Webflow URL:', url.toString());
    
    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();
    
    if (filename) {
      // Create a new URL to the current origin with just the filename
      const newUrl = new URL(`/${filename}`, self.location.origin);
      console.log('Service Worker redirecting to:', newUrl.toString());
      
      // Fetch from the new URL instead
      event.respondWith(
        fetch(newUrl)
          .then(response => {
            if (response.ok) {
              console.log('Successfully fetched from local path:', newUrl.toString());
              return response;
            }
            
            // If the response is not ok, try fetching from /steaks/ directory
            const steaksUrl = new URL(`/steaks/${filename}`, self.location.origin);
            console.log('Trying steaks directory:', steaksUrl.toString());
            return fetch(steaksUrl);
          })
          .catch(error => {
            console.error('Error fetching redirected URL:', error);
            // Fall back to the original request as a last resort
            return fetch(event.request);
          })
      );
      return;
    }
  }
  
  // Check for specific Webflow domain we're seeing in errors
  if (url.toString().includes('7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82')) {
    console.log('Service Worker intercepted specific Webflow domain:', url.toString());
    
    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();
    
    if (filename) {
      // Create a new URL to the current origin with just the filename
      const newUrl = new URL(`/${filename}`, self.location.origin);
      console.log('Service Worker redirecting to:', newUrl.toString());
      
      // Fetch from the new URL instead
      event.respondWith(
        fetch(newUrl)
          .then(response => {
            if (response.ok) {
              console.log('Successfully fetched from local path:', newUrl.toString());
              return response;
            }
            
            // If the response is not ok, try fetching from /steaks/ directory
            const steaksUrl = new URL(`/steaks/${filename}`, self.location.origin);
            console.log('Trying steaks directory:', steaksUrl.toString());
            return fetch(steaksUrl);
          })
          .catch(error => {
            console.error('Error fetching redirected URL:', error);
            // Fall back to the original request as a last resort
            return fetch(event.request);
          })
      );
      return;
    }
  }
  
  // For all other requests, proceed normally
  // We don't call event.respondWith() so the browser handles the request normally
});
