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
    return `/${filename}`;
  }

  // If it's not an image or we couldn't extract a filename, return the original
  return src;
}
