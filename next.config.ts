import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingIncludes: {
    "/api/mcv/calculate": [
      "./node_modules/playwright-core/browsers.json",
      "./node_modules/playwright-core/.local-browsers/**/*",
    ],
    "/api/mcv/options": [
      "./node_modules/playwright-core/browsers.json",
      "./node_modules/playwright-core/.local-browsers/**/*",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
