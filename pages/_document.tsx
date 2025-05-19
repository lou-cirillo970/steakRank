import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to the origin for faster asset loading */}
        <link rel="preconnect" href="/" />

        {/* Preload critical assets with crossorigin attribute for Cloudflare compatibility */}
        <link rel="preload" href="/steaks/Ribeye.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/Fillet_mignon.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/new_york_strip.webp" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/steaks/Tbone.webp" as="image" crossOrigin="anonymous" />

        {/* Add a meta tag to ensure proper CORS handling */}
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
