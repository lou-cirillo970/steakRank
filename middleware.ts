import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the edge (Cloudflare Workers)
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Only process image requests
  if (!url.pathname.endsWith('.webp') && !url.pathname.endsWith('.png') && !url.pathname.endsWith('.jpg')) {
    return NextResponse.next();
  }

  // Check if this is a request for an image that might be in the root
  const filename = url.pathname.split('/').pop();

  // Skip processing if we don't have a filename or if it's already at the root level
  if (!filename || url.pathname === `/${filename}`) {
    return NextResponse.next();
  }

  // For any image request that's not at the root, try to serve it from the root
  console.log(`Middleware: Rewriting ${url.pathname} to /${filename}`);
  url.pathname = `/${filename}`;
  return NextResponse.rewrite(url);
}

// Configure the middleware to run only for image requests
export const config = {
  matcher: [
    // Match image paths
    '/(.*)\\.webp',
    '/(.*)\\.png',
    '/(.*)\\.jpg',
    '/(.*)\\.jpeg',
  ],
};
