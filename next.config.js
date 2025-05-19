/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the recommended output mode for Cloudflare Pages
  output: 'export',

  // Configure images for Cloudflare compatibility
  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Ensure trailing slashes are handled correctly
  trailingSlash: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Compiler options for better optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig