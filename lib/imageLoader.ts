// Custom image loader for Next.js
// This helps ensure images are loaded from the correct path in both development and production

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function customImageLoader({ src }: ImageLoaderProps): string {
  // Handle Webflow URLs - this is the critical fix for the 404 errors
  if (src.includes('webflow.services') && src.includes('.webp')) {
    console.log('Intercepted Webflow URL in image loader:', src);
    const filename = src.split('/').pop();
    return `/${filename}`;
  }

  // If the src is already an absolute URL, return it as is
  if (src.startsWith('http')) {
    return src;
  }

  // If the src is a relative path starting with a slash, remove the slash
  const cleanSrc = src.startsWith('/') ? src.substring(1) : src;

  // For steak images, try to load them directly from the root
  if (cleanSrc.includes('steaks/')) {
    const filename = cleanSrc.split('/').pop();
    return `/${filename}`;
  }

  // For other images, use the standard path
  return `/${cleanSrc}`;
}
