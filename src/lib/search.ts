import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insights";
import { powertrains } from "@/lib/powertrains";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";
import { brands } from "@/lib/brands";

export type SearchType = "Insight" | "Blog" | "Powertrain" | "Guide" | "Brand" | "Page";

export type SearchItem = {
  title: string;
  description: string;
  href: string;
  type: SearchType;
  date?: string;
  brand?: string;
  category?: string;
  platform?: string;
  image?: string;
  keywords: string[];
};

export type SearchResult = SearchItem & {
  score: number;
};

const staticItems: SearchItem[] = [
  {
    title: "Reliability Index",
    description:
      "Signal-based ownership risk scoring for German cars, engines, drivetrains, and known failure patterns.",
    href: "/reliability-index",
    type: "Guide",
    category: "Reliability",
    keywords: ["reliability", "risk", "score", "index", "engine", "ownership"],
  },
  {
    title: "Buying Guides",
    description:
      "Structured buying advice, inspection priorities, and used German car red flags before purchase.",
    href: "/buying-guides",
    type: "Guide",
    category: "Buying",
    keywords: ["buying", "used car", "inspection", "checklist", "pre purchase", "red flags"],
  },
  {
    title: "Contact TT AUTO'S Engineering",
    description:
      "Send model requests, buying questions, reliability topics, corrections, or collaboration inquiries.",
    href: "/contact",
    type: "Page",
    category: "Contact",
    keywords: ["contact", "email", "instagram", "request", "question"],
  },
];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function itemText(item: SearchItem) {
  return normalize(
    [
      item.title,
      item.description,
      item.type,
      item.brand,
      item.category,
      item.platform,
      ...item.keywords,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function scoreItem(item: SearchItem, terms: string[]) {
  const title = normalize(item.title);
  const description = normalize(item.description);
  const haystack = itemText(item);

  let score = 0;
  for (const term of terms) {
    if (title === term) score += 30;
    if (title.includes(term)) score += 12;
    if (description.includes(term)) score += 5;
    if (haystack.includes(term)) score += 3;
    if (item.keywords.some((keyword) => normalize(keyword).includes(term))) score += 8;
    if (normalize(item.brand ?? "").includes(term)) score += 8;
    if (normalize(item.platform ?? "").includes(term)) score += 8;
    if (normalize(item.category ?? "").includes(term)) score += 5;
  }

  if (item.type === "Insight") score += 2;
  return score;
}

export function getSearchIndex(locale: Locale = defaultLocale): SearchItem[] {
  const brandItems = brands.map<SearchItem>((brand) => ({
    title: `${brand.name} Brand Hub`,
    description: brand.description,
    href: `/brands/${brand.slug}`,
    type: "Brand",
    brand: brand.name,
    image: brand.image,
    keywords: [...brand.contentTerms, ...brand.models, ...brand.problemAreas],
  }));
  const insightItems = getAllInsights(locale).map<SearchItem>((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    href: `/insights/${post.slug}`,
    type: "Insight",
    date: post.frontmatter.updated ?? post.frontmatter.date,
    brand: post.frontmatter.brand,
    category: post.frontmatter.category,
    platform: post.frontmatter.platform,
    image: post.frontmatter.image,
    keywords: [
      post.frontmatter.brand,
      post.frontmatter.category,
      post.frontmatter.platform,
      ...(post.frontmatter.risk ?? []),
      post.meta?.excerpt,
    ].filter((value): value is string => Boolean(value)),
  }));

  const blogItems = getAllBlogPosts(locale).map<SearchItem>((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    href: `/blog/${post.slug}`,
    type: "Blog",
    date: post.frontmatter.updated ?? post.frontmatter.date,
    brand: post.frontmatter.brand,
    category: post.frontmatter.category,
    image: post.frontmatter.image,
    keywords: [
      post.frontmatter.brand,
      post.frontmatter.category,
      post.frontmatter.author,
      post.meta.excerpt,
    ].filter((value): value is string => Boolean(value)),
  }));

  const powertrainItems = powertrains.map<SearchItem>((item) => ({
    title: item.name,
    description: item.summary,
    href: `/powertrains/${item.slug}`,
    type: "Powertrain",
    brand: item.brands.join(", "),
    category: item.kind,
    platform: item.name,
    image: item.image,
    keywords: [
      item.kind,
      item.fuel,
      item.risk,
      item.years,
      ...item.brands,
      ...item.aliases,
      ...item.applications,
      ...item.commonProblems,
    ],
  }));

  return translateValue(locale, [
    ...insightItems,
    ...blogItems,
    ...powertrainItems,
    ...brandItems,
    ...staticItems,
  ]);
}

export function searchSite(
  query: string,
  type?: string,
  locale: Locale = defaultLocale
) {
  const terms = normalize(query).split(" ").filter(Boolean);
  const selectedType = type && type !== "All" ? type : undefined;
  const items = getSearchIndex(locale).filter(
    (item) => !selectedType || item.type === selectedType
  );

  if (!terms.length) return items.map((item) => ({ ...item, score: 0 }));

  return items
    .map<SearchResult>((item) => ({ ...item, score: scoreItem(item, terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
