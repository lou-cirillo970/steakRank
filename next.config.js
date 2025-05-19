/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Run the prepare-for-deployment script before building
try {
  console.log('Running prepare-for-deployment script...');
  require('./scripts/prepare-for-deployment');
} catch (error) {
  console.error('Error running prepare-for-deployment script:', error);
}

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

  // Custom build step to copy all images to the root of the output directory
  onBuildComplete: async () => {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const steaksDir = path.join(publicDir, 'steaks');
      const outputDir = path.join(process.cwd(), '.open-next/assets');

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Copy all steak images to the root of the output directory
      if (fs.existsSync(steaksDir)) {
        const steakImages = fs.readdirSync(steaksDir);
        steakImages.forEach(image => {
          const sourcePath = path.join(steaksDir, image);
          const destPath = path.join(outputDir, image);
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${sourcePath} to ${destPath}`);
        });
      }

      // Also copy all images from the public root to the output directory
      const publicImages = fs.readdirSync(publicDir).filter(file =>
        file.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)
      );

      publicImages.forEach(image => {
        const sourcePath = path.join(publicDir, image);
        const destPath = path.join(outputDir, image);

        // Only copy if it's a file (not a directory)
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${sourcePath} to ${destPath}`);
        }
      });

      // Copy all files from public directory to the root of the output directory
      const copyFilesRecursively = (sourceDir, targetDir) => {
        // Skip the steaks directory since we already processed it
        if (sourceDir === steaksDir) return;

        const files = fs.readdirSync(sourceDir);

        files.forEach(file => {
          const sourcePath = path.join(sourceDir, file);
          const targetPath = path.join(targetDir, file);

          if (fs.statSync(sourcePath).isDirectory()) {
            // If it's a directory, create it in the target and recurse
            if (!fs.existsSync(targetPath)) {
              fs.mkdirSync(targetPath, { recursive: true });
            }
            copyFilesRecursively(sourcePath, targetPath);
          } else {
            // If it's a file, copy it to both the target directory and the root
            fs.copyFileSync(sourcePath, targetPath);

            // Also copy to root if it's an image file
            if (file.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)) {
              const rootPath = path.join(outputDir, file);
              fs.copyFileSync(sourcePath, rootPath);
              console.log(`Copied ${sourcePath} to ${rootPath} (root)`);
            }
          }
        });
      };

      copyFilesRecursively(publicDir, outputDir);

      console.log('All files copied successfully');
    } catch (error) {
      console.error('Error copying files:', error);
    }
  },
}

module.exports = nextConfig