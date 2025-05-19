/** @type {import('next').NextConfig} */

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
    formats: ['image/webp'],
    minimumCacheTTL: 60,
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
}

module.exports = nextConfig