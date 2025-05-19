/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const nextConfig = {
  // Use 'standalone' output for OpenNext compatibility
  output: 'standalone',

  // Configure images for Cloudflare compatibility
  images: {
    unoptimized: true,
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Use a custom loader
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
  },

  // Ensure trailing slashes are handled correctly
  trailingSlash: true,

  // Compiler options for better optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'log'],
    } : false,
  },

  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ensure static assets are copied to the output directory
  assetPrefix: '',

  // Custom build step to copy steak images to the root of the output directory
  onBuildComplete: async () => {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const steaksDir = path.join(publicDir, 'steaks');
      const outputDir = path.join(process.cwd(), '.open-next/assets');

      if (fs.existsSync(steaksDir)) {
        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Copy all steak images to the root of the output directory
        const steakImages = fs.readdirSync(steaksDir);
        steakImages.forEach(image => {
          const sourcePath = path.join(steaksDir, image);
          const destPath = path.join(outputDir, image);
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${sourcePath} to ${destPath}`);
        });
      }
    } catch (error) {
      console.error('Error copying steak images:', error);
    }
  },
}

module.exports = nextConfig