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
      // Serve static assets from the ASSETS binding
      if (pathname.startsWith('/static/') || 
          pathname.startsWith('/_next/') || 
          pathname.includes('.') || 
          pathname === '/favicon.ico') {
        return env.ASSETS.fetch(request);
      }

      // For all other routes, serve the index.html
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
