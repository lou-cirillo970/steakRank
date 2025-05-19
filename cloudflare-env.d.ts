/**
 * Cloudflare environment interface for TypeScript
 */

interface CloudflareEnv {
  // Assets binding for static files
  ASSETS: {
    fetch: typeof fetch;
  };
  
  // Add any other bindings or environment variables here
  // For example:
  // MY_ENV_VAR: string;
  // MY_KV_NAMESPACE: KVNamespace;
}

export {};
