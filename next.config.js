/** @type {import('next').NextConfig} */
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

  // Ensure static assets are copied to the output directory
  assetPrefix: '',

  // Explicitly configure public directory handling
  // This ensures that files in the public directory are correctly copied to the output
  publicRuntimeConfig: {
    staticFolder: '/static',
  },

  // Add webpack configuration to handle image assets
  webpack: (config, { isServer }) => {
    // Ensure images are properly handled
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
}

module.exports = nextConfig