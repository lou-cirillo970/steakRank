import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the edge (Cloudflare Workers)
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const originalUrl = request.url;

  // Check if the request URL contains the Webflow domain
  if (originalUrl.includes('webflow.services') && originalUrl.includes('.webp')) {
    console.log('Middleware intercepted full Webflow URL:', originalUrl);

    // Extract the filename from the URL
    const filename = originalUrl.split('/').pop();

    // Rewrite to a local path
    if (filename) {
      // Create a new URL to the current host but with the filename path
      const newUrl = new URL(`/${filename}`, request.url);
      console.log('Middleware redirecting to:', newUrl.toString());
      return NextResponse.redirect(newUrl);
    }
  }

  // Check if the request is for a Webflow image in the pathname
  if (url.pathname.includes('webflow.services') && url.pathname.includes('.webp')) {
    console.log('Middleware intercepted Webflow URL in pathname:', url.pathname);

    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();

    // Rewrite to a local path
    if (filename) {
      url.pathname = `/${filename}`;
      console.log('Middleware redirecting to:', url.pathname);
      return NextResponse.rewrite(url);
    }
  }

  // Also check for image requests that might be coming from Webflow
  if ((url.pathname.includes('/app/') || url.pathname.includes('/steaks/')) && url.pathname.endsWith('.webp')) {
    console.log('Middleware intercepted app/steaks path URL:', url.pathname);

    // Extract the filename from the URL
    const filename = url.pathname.split('/').pop();

    // Rewrite to a local path
    if (filename) {
      url.pathname = `/${filename}`;
      console.log('Middleware redirecting to:', url.pathname);
      return NextResponse.rewrite(url);
    }
  }

  // Handle the specific Webflow domain we're seeing in the errors
  if (url.pathname.includes('7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82')) {
    console.log('Middleware intercepted specific Webflow domain URL:', url.pathname);

    // Extract the filename from the URL - it's the last part after the last slash
    const filename = url.pathname.split('/').pop();

    // Rewrite to a local path
    if (filename) {
      url.pathname = `/${filename}`;
      console.log('Middleware redirecting to:', url.pathname);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run for all requests
export const config = {
  matcher: [
    // Match all paths
    '/:path*',
  ],
};
