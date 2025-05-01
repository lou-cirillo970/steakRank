/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // Enable static exports
  output: 'export',
  // Disable image optimization during build
  images: {
    unoptimized: true,
  },
  // Disable type checking during build (we do it in development)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (we do it in development)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure trailing slashes for better static hosting compatibility
  trailingSlash: true,
};

module.exports = nextConfig; 