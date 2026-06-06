import type { MetadataRoute } from "next";

const BASE_URL = "https://ttautosengineering.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          // If you ever add admin/drafts, block them here:
          // "/admin/",
          // "/drafts/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}