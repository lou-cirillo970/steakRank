/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'standalone' output for OpenNext compatibility
  output: 'standalone',

  // Configure images for Cloudflare compatibility
  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Ensure trailing slashes are handled correctly
  trailingSlash: true,

  // Compiler options for better optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig