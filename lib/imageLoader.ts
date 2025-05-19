// Custom image loader for Next.js
// This helps ensure images are loaded from the correct path in both development and production

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function customImageLoader({ src }: ImageLoaderProps): string {
  // Check if the URL contains webflow.services and redirect it
  if (src.includes('webflow.services')) {
    console.log('Intercepted webflow URL:', src);
    const filename = src.split('/').pop();
    if (filename) {
      console.log('Redirecting to local path:', `/${filename}`);
      return `/${filename}`;
    }
  }

  // For any image, extract the filename
  const filename = src.split('/').pop();

  // If we have a filename, use it from the root
  if (filename && filename.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)) {
    // For steak images, try multiple paths to increase chances of success
    if (src.includes('steaks/') ||
        filename.includes('steak') ||
        filename.includes('Ribeye') ||
        filename.includes('Tbone') ||
        filename.includes('fillet') ||
        filename.includes('Fillet') ||
        filename.includes('beef') ||
        filename.includes('picanha') ||
        filename.includes('tomahawk')) {

      // Log the image path for debugging
      console.log(`Steak image handled by custom loader: ${filename}`);

      // For steak images, always use the root path
      // This ensures we use our colorful SVG placeholders
      return `/${filename}`;
    }

    // For other images, also use the root path
    return `/${filename}`;
  }

  // If it's not an image or we couldn't extract a filename, return the original
  return src;
}
