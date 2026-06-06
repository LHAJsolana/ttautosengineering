import type { MetadataRoute } from "next";
import { getAllInsights } from "@/lib/insights";
import { getAllBlogPosts } from "@/lib/blog";
import { modelPages } from "@/lib/models";
import { powertrains } from "@/lib/powertrains";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const SITE_LASTMOD = new Date("2026-06-06T00:00:00.000Z");

const staticPaths = [
  "/",
  "/insights",
  "/blog",
  "/search",
  "/models",
  "/powertrains",
  "/brands",
  "/brands/bmw",
  "/brands/mercedes-benz",
  "/brands/audi",
  "/brands/volkswagen",
  "/buying-guides",
  "/buying-checklist",
  "/reliability-index",
  "/about",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
  "/affiliate-disclosure",
];

function safeDate(input?: string) {
  if (!input) return SITE_LASTMOD;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? SITE_LASTMOD : date;
}

function url(locale: Locale, pathname: string) {
  return `${SITE_URL}${localePath(locale, pathname)}`;
}

function languageAlternates(pathname: string) {
  return Object.fromEntries(locales.map((locale) => [locale, url(locale, pathname)]));
}

function localizedEntry(
  locale: Locale,
  pathname: string,
  lastModified: Date
): MetadataRoute.Sitemap[number] {
  return {
    url: url(locale, pathname),
    lastModified,
    alternates: { languages: languageAlternates(pathname) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = locales.flatMap((locale) =>
    staticPaths.map((pathname) => localizedEntry(locale, pathname, SITE_LASTMOD))
  );

  const modelRoutes = locales.flatMap((locale) =>
    modelPages.map((model) =>
      localizedEntry(locale, `/models/${model.slug}`, SITE_LASTMOD)
    )
  );

  const powertrainRoutes = locales.flatMap((locale) =>
    powertrains.map((item) =>
      localizedEntry(locale, `/powertrains/${item.slug}`, SITE_LASTMOD)
    )
  );

  const insightRoutes = locales.flatMap((locale) =>
    getAllInsights(locale)
      .filter((post) => !post.isFallback)
      .map((post) =>
        localizedEntry(
          locale,
          `/insights/${post.slug}`,
          safeDate(post.frontmatter.updated ?? post.frontmatter.date)
        )
      )
  );

  const blogRoutes = locales.flatMap((locale) =>
    getAllBlogPosts(locale)
      .filter((post) => !post.isFallback)
      .map((post) =>
        localizedEntry(
          locale,
          `/blog/${post.slug}`,
          safeDate(post.frontmatter.updated ?? post.frontmatter.date)
        )
      )
  );

  return [
    ...staticRoutes,
    ...modelRoutes,
    ...powertrainRoutes,
    ...insightRoutes,
    ...blogRoutes,
  ];
}
