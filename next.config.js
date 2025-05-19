/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'export' for static site generation which works well with Cloudflare
  output: 'export',
  // Keep images unoptimized for Cloudflare compatibility
  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Compiler options for better optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable server components for Cloudflare Workers compatibility
  experimental: {
    serverActions: false,
  },
}

module.exports = nextConfig