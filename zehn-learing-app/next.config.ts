import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // --- correctness -----------------------------------------------------
  // Surfaces unsafe lifecycles / double-render bugs at build time so they
  // never reach production. Required for a clean production compile.
  reactStrictMode: true,

  // --- performance / hygiene -------------------------------------------
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    // Tree-shakes large icon/animation barrels for a much smaller client bundle.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // --- remote assets (avatars, posters, game art, video frames) ---------
  // Dynamic player profiles, gaming illustrations and CDN assets may come
  // from any HTTPS host, so every secure origin is whitelisted.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // --- caching headers (required by the offline service worker) ---------
  async headers() {
    return [
      {
        // Generated artwork is content-addressed per deploy and safe to keep.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // The service worker must never be served stale after a deployment.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
