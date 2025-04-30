/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Disable type checking during build (we do it in development)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (we do it in development)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 