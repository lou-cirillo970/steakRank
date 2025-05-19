# Deploying SteakFlow to Cloudflare Workers

This document provides instructions for deploying the SteakFlow application to Cloudflare Workers.

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler`)
3. Node.js (v16 or higher)
4. npm or yarn

## Setup

1. Log in to your Cloudflare account using Wrangler:

```bash
wrangler login
```

2. Make sure all dependencies are installed:

```bash
npm install
```

## Development

To run the application locally with Cloudflare Workers:

```bash
# Start the Next.js development server
npm run dev

# Or use the Cloudflare Workers development server
npm run cf:dev
```

## Deployment

To deploy the application to Cloudflare Workers:

```bash
# Build and deploy in one step
npm run cf:deploy

# Or deploy to Cloudflare Pages
npm run deploy:pages
```

## Configuration Files

The following files are used for Cloudflare Workers configuration:

- `wrangler.toml` - Main configuration file for Cloudflare Workers
- `wrangler.jsonc` - Additional configuration in JSON format
- `worker.js` - The worker script that handles routing
- `.env.production` - Production environment variables
- `.env.development` - Development environment variables

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Cloudflare Workers logs in the Cloudflare dashboard
2. Verify that your account has the necessary permissions
3. Ensure that the `wrangler.toml` file has the correct configuration
4. Check that all environment variables are properly set

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare Workers](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
