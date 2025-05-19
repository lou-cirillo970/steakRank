// Custom image loader for Next.js
// This helps ensure images are loaded from the correct path in both development and production

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function customImageLoader({ src }: ImageLoaderProps): string {
  // For any image, just use the filename directly from the root
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
      console.log(`Loading steak image: ${filename}`);

      // For steak images, always use the root path first
      // This ensures we use our colorful SVG placeholders
      return `/${filename}`;
    }

    // For other images, also use the root path
    return `/${filename}`;
  }

  // If it's not an image or we couldn't extract a filename, return the original
  return src;
}
