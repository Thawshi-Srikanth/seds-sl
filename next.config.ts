import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), "node_modules", "@payloadcms", "ui", "scss"),
    ],
  },
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.private.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
    ],
  },
  headers: async () => [
    {
      source: "/api/media/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/api/divisions",
      headers: [
        {
          key: "Cache-Control",
          value:
            "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/api/projects",
      headers: [
        {
          key: "Cache-Control",
          value:
            "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/api/chapters",
      headers: [
        {
          key: "Cache-Control",
          value:
            "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
  ],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
};

export default withPayload(nextConfig);
