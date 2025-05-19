import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the edge (Cloudflare Workers)
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Check if the request is for a Webflow image
  if (url.pathname.includes('webflow.services') && url.pathname.includes('.webp')) {
    console.log('Middleware intercepted Webflow URL:', url.pathname);
    
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
  if (url.pathname.includes('/app/') && url.pathname.endsWith('.webp')) {
    console.log('Middleware intercepted app path URL:', url.pathname);
    
    // Extract the filename from the URL
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

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    // Match all image paths
    '/(.*).webp',
    // Match paths that might contain Webflow URLs
    '/(.*)/app/(.*)',
    // Match all API routes
    '/api/:path*',
  ],
};
