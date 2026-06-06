import type { MetadataRoute } from "next";
import { getAllInsights } from "@/lib/insights";
import { getAllBlogPosts } from "@/lib/blog";
import { modelPages } from "@/lib/models";
import { powertrains } from "@/lib/powertrains";

const BASE_URL = "https://ttautosengineering.com";

// Use a stable fallback for static pages (update this when you ship big site changes)
const SITE_LASTMOD = new Date("2026-02-19T00:00:00.000Z");

function safeDate(input?: string) {
  if (!input) return SITE_LASTMOD;
  const d = new Date(input);
  return isNaN(d.getTime()) ? SITE_LASTMOD : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/insights`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/blog`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/search`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/models`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/powertrains`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/brands`, lastModified: SITE_LASTMOD },

    // Brand pages
    { url: `${BASE_URL}/brands/bmw`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/brands/mercedes-benz`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/brands/audi`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/brands/volkswagen`, lastModified: SITE_LASTMOD },

    // Money / authority pages
    { url: `${BASE_URL}/buying-guides`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/buying-checklist`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/reliability-index`, lastModified: SITE_LASTMOD },

    // Trust pages (important for ads approvals later)
    { url: `${BASE_URL}/about`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/contact`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/disclaimer`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/privacy-policy`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/terms`, lastModified: SITE_LASTMOD },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: SITE_LASTMOD },
    // Recommended for AdSense later:
  ];

  // Prefer updated date if present, otherwise date
  const insightRoutes: MetadataRoute.Sitemap = getAllInsights().map((p) => ({
    url: `${BASE_URL}/insights/${p.slug}`,
    lastModified: safeDate(p.frontmatter.updated ?? p.frontmatter.date),
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: safeDate(p.frontmatter.updated ?? p.frontmatter.date),
  }));

  const modelRoutes: MetadataRoute.Sitemap = modelPages.map((model) => ({
    url: `${BASE_URL}/models/${model.slug}`,
    lastModified: SITE_LASTMOD,
  }));

  const powertrainRoutes: MetadataRoute.Sitemap = powertrains.map((item) => ({
    url: `${BASE_URL}/powertrains/${item.slug}`,
    lastModified: SITE_LASTMOD,
  }));

  return [...staticRoutes, ...modelRoutes, ...powertrainRoutes, ...insightRoutes, ...blogRoutes];
}
