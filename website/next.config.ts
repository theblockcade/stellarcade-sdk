import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      // Clean URLs: docs.stellarcade.xyz/quickstart → serves app/docs/[slug]
      {
        source: "/:slug*",
        destination: "/docs/:slug*",
      },
    ];
  },
};

export default nextConfig;
