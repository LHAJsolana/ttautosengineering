import type { MetadataRoute } from "next";
import { getAllInsights } from "@/lib/insights";
import { getAllBlogPosts } from "@/lib/blog";
import { modelPages } from "@/lib/models";
import { powertrains } from "@/lib/powertrains";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { brands } from "@/lib/brands";
import { faultCodes } from "@/lib/faultCodes";
import { modelYears } from "@/lib/modelYears";
import { directComparisons } from "@/lib/comparisons";
import { seoLandingPages } from "@/lib/seoLandingPages";
import { partsFailureItems } from "@/lib/partsFailureMap";

const SITE_LASTMOD = new Date("2026-07-06T00:00:00.000Z");

const staticPaths = [
  "/",
  "/insights",
  "/blog",
  "/models",
  "/powertrains",
  "/brands",
  "/buying-guides",
  "/buying-checklist",
  "/parts-failure-map",
  "/how-we-evaluate-used-cars",
  "/tools",
  "/vin-history",
  "/compare",
  "/maintenance-cost",
  "/fault-codes",
  "/model-years",
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
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, url(locale, pathname)])),
    "x-default": url("en", pathname),
  };
}

function localizedEntry(
  locale: Locale,
  pathname: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  priority = 0.7
): MetadataRoute.Sitemap[number] {
  return {
    url: url(locale, pathname),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languageAlternates(pathname) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const newestContentDate = [...getAllInsights("en"), ...getAllBlogPosts("en")]
    .map((post) => safeDate(post.frontmatter.updated ?? post.frontmatter.date))
    .reduce((latest, date) => (date > latest ? date : latest), SITE_LASTMOD);

  const staticRoutes = locales.flatMap((locale) =>
    staticPaths.map((pathname) => {
      const isHome = pathname === "/";
      const isCollection = pathname === "/insights" || pathname === "/blog";
      return localizedEntry(
        locale,
        pathname,
        isCollection ? newestContentDate : SITE_LASTMOD,
        isHome || isCollection ? "weekly" : "monthly",
        isHome ? 1 : isCollection ? 0.9 : 0.7
      );
    })
  );

  const modelRoutes = locales.flatMap((locale) =>
    modelPages.map((model) =>
      localizedEntry(locale, `/models/${model.slug}`, SITE_LASTMOD, "monthly", 0.8)
    )
  );

  const brandRoutes = locales.flatMap((locale) =>
    brands.map((brand) =>
      localizedEntry(locale, `/brands/${brand.slug}`, SITE_LASTMOD, "monthly", 0.8)
    )
  );

  const powertrainRoutes = locales.flatMap((locale) =>
    powertrains.map((item) =>
      localizedEntry(locale, `/powertrains/${item.slug}`, SITE_LASTMOD, "monthly", 0.8)
    )
  );

  const faultCodeRoutes = locales.flatMap((locale) =>
    faultCodes.map((item) =>
      localizedEntry(
        locale,
        `/fault-codes/${item.code.toLowerCase()}`,
        SITE_LASTMOD,
        "monthly",
        0.76
      )
    )
  );

  const modelYearRoutes = locales.flatMap((locale) =>
    modelYears.map((item) =>
      localizedEntry(
        locale,
        `/model-years/${item.slug}`,
        SITE_LASTMOD,
        "monthly",
        0.82
      )
    )
  );

  const directComparisonRoutes = locales.flatMap((locale) =>
    directComparisons.map((comparison) =>
      localizedEntry(locale, `/compare/${comparison.slug}`, SITE_LASTMOD, "monthly", 0.78)
    )
  );

  const researchRoutes = locales.flatMap((locale) =>
    seoLandingPages.map((page) =>
      localizedEntry(locale, `/research/${page.slug}`, SITE_LASTMOD, "monthly", 0.82)
    )
  );

  const partsFailureRoutes = locales.flatMap((locale) =>
    partsFailureItems.map((item) =>
      localizedEntry(locale, `/parts-failure-map/${item.slug}`, SITE_LASTMOD, "monthly", 0.82)
    )
  );

  const insightRoutes = locales.flatMap((locale) =>
    getAllInsights(locale)
      .filter((post) => !post.isFallback)
      .map((post) =>
        localizedEntry(
          locale,
          `/insights/${post.slug}`,
          safeDate(post.frontmatter.updated ?? post.frontmatter.date),
          "monthly",
          0.85
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
          safeDate(post.frontmatter.updated ?? post.frontmatter.date),
          "monthly",
          0.8
        )
      )
  );

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...powertrainRoutes,
    ...directComparisonRoutes,
    ...researchRoutes,
    ...partsFailureRoutes,
    ...faultCodeRoutes,
    ...modelYearRoutes,
    ...insightRoutes,
    ...blogRoutes,
  ];
}
