// Custom image loader for Next.js
// This helps ensure images are loaded from the correct path in both development and production

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function customImageLoader({ src }: ImageLoaderProps): string {
  // Log all image loading attempts for debugging
  console.log('Image loader processing:', src);

  // Handle specific Webflow domain we're seeing in the errors
  if (src.includes('7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82')) {
    console.log('Intercepted specific Webflow domain in image loader:', src);
    const filename = src.split('/').pop();
    return `/${filename}`;
  }

  // Handle Webflow URLs - this is the critical fix for the 404 errors
  if (src.includes('webflow.services') && src.includes('.webp')) {
    console.log('Intercepted Webflow URL in image loader:', src);
    const filename = src.split('/').pop();
    return `/${filename}`;
  }

  // If the src is already an absolute URL but not a Webflow URL, check if it's an image
  if (src.startsWith('http') && !src.includes('webflow.services')) {
    // If it's an image URL, extract the filename and try to load it locally
    if (src.match(/\.(webp|jpg|jpeg|png|gif|svg)$/i)) {
      const filename = src.split('/').pop();
      console.log('Intercepted external image URL in image loader:', src);
      return `/${filename}`;
    }
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
