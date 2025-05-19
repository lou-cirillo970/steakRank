/**
 * SteakFlow Cloudflare Worker
 * This worker handles the routing and serving of the Next.js application
 */

export default {
  async fetch(request, env, ctx) {
    // Get the URL and pathname
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      // Handle static assets
      if (pathname.startsWith('/_next/') ||
          pathname.includes('.') ||
          pathname === '/favicon.ico') {
        // Try to serve the asset directly
        const response = await env.ASSETS.fetch(request.clone());
        if (response.status === 200) {
          return response;
        }
      }

      // For all other routes, try to serve the appropriate HTML file
      // First, try the specific path (for static routes)
      let assetPath = pathname;
      if (pathname.endsWith('/')) {
        assetPath += 'index.html';
      } else if (!pathname.includes('.')) {
        assetPath += '/index.html';
      }

      // Try to fetch the specific path
      try {
        const response = await env.ASSETS.fetch(`${url.origin}${assetPath}`);
        if (response.status === 200) {
          return response;
        }
      } catch (e) {
        // If specific path fails, fall back to index.html
        console.log(`Failed to fetch ${assetPath}, falling back to index.html`);
      }

      // Fall back to index.html for SPA-style routing
      return env.ASSETS.fetch(`${url.origin}/index.html`);
    } catch (e) {
      // Return a 500 error if something goes wrong
      return new Response(`Server Error: ${e.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};
