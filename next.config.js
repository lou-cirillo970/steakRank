/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports
  output: 'standalone',
  // Configure images
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure trailing slashes for better static hosting compatibility
  trailingSlash: true,
  // Configure experimental features
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig; 