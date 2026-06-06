import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type InsightFrontmatter = {
  title: string;
  description: string;

  /**
   * Publish date. Prefer "YYYY-MM-DD".
   */
  date: string;

  /**
   * Optional last update date. Prefer "YYYY-MM-DD".
   * Used for schema dateModified + sitemap lastModified.
   */
  updated?: string;

  /**
   * Optional brand label (BMW, Mercedes-Benz, Audi, Volkswagen).
   */
  brand?: string;

  /**
   * Optional relative image path, e.g. "/images/insights/bmw-n47.jpg"
   * Used later for OG image + Article schema image.
   */
  image?: string;

  /**
   * Premium editorial system
   */
  featured?: boolean;
  priority?: number;

  /**
   * Taxonomy (frontmatter-driven)
   */
  category?: string; // e.g. "Reliability", "Buying Guide"
  platform?: string; // e.g. "N47", "B47", "W205", "MQB"
  risk?: string[]; // e.g. ["High", "Costly", "Common"]
};

export type InsightMeta = {
  excerpt: string;
  wordCount: number;
  readingMinutes: number;
};

export type Insight = {
  slug: string;
  frontmatter: InsightFrontmatter;
  content: string;
  meta?: InsightMeta;
};

export type InsightListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  brand?: string;
  image?: string;

  featured?: boolean;
  priority?: number;
  category?: string;
  platform?: string;
  risk?: string[];

  excerpt: string;
  wordCount: number;
  readingMinutes: number;
};

const INSIGHTS_DIR = path.join(process.cwd(), "src", "content", "insights");

function safeDate(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeBrand(input?: unknown) {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) return undefined;

  const key = raw.toLowerCase();
  if (key === "bmw") return "BMW";
  if (key === "audi") return "Audi";
  if (key === "volkswagen" || key === "vw") return "Volkswagen";
  if (key === "mercedes" || key === "mercedes-benz" || key === "mercedes benz")
    return "Mercedes-Benz";

  return raw;
}

function normalizeString(input?: unknown) {
  const raw = typeof input === "string" ? input.trim() : "";
  return raw || undefined;
}

function normalizeBool(input?: unknown) {
  if (typeof input === "boolean") return input;
  if (typeof input === "string") {
    const v = input.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  return undefined;
}

function normalizeNumber(input?: unknown) {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  if (typeof input === "string") {
    const n = Number(input);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function normalizeRisk(input?: unknown): string[] | undefined {
  if (!input) return undefined;

  if (Array.isArray(input)) {
    const arr = input
      .map((x) => (typeof x === "string" ? x.trim() : ""))
      .filter(Boolean);
    return arr.length ? arr : undefined;
  }

  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return undefined;

    // allow "High, Costly" style
    if (s.includes(",")) {
      const arr = s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      return arr.length ? arr : undefined;
    }

    return [s];
  }

  return undefined;
}

function validateFrontmatter(data: Record<string, unknown>, slug: string): InsightFrontmatter {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";

  if (!title || !description || !date) {
    throw new Error(
      `[insights] Missing required frontmatter in "${slug}": title, description, date`
    );
  }

  const updated =
    typeof data.updated === "string" ? data.updated.trim() : undefined;
  const image =
    typeof data.image === "string" ? data.image.trim() : undefined;

  return {
    title,
    description,
    date,
    updated,
    brand: normalizeBrand(data.brand),
    image,

    featured: normalizeBool(data.featured),
    priority: normalizeNumber(data.priority),

    category: normalizeString(data.category),
    platform: normalizeString(data.platform),
    risk: normalizeRisk(data.risk),
  };
}

function stripMdx(text: string) {
  return (
    text
      // code blocks
      .replace(/```[\s\S]*?```/g, " ")
      // inline code
      .replace(/`([^`]+)`/g, "$1")
      // md links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      // headings / emphasis / lists
      .replace(/[#>*_-]+/g, " ")
      // html tags
      .replace(/<[^>]+>/g, " ")
      // collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

function countWords(text: string) {
  const cleaned = stripMdx(text);
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
}

function makeExcerpt(content: string, maxChars = 180) {
  const cleaned = stripMdx(content);
  if (!cleaned) return "";
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.slice(0, maxChars - 1).trimEnd() + "…";
}

function computeMeta(content: string): InsightMeta {
  const wordCount = countWords(content);
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));
  return {
    excerpt: makeExcerpt(content, 200),
    wordCount,
    readingMinutes,
  };
}

function readInsightFile(filePath: string, slug: string): Insight {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data as Record<string, unknown>, slug);
  const meta = computeMeta(content);
  return { slug, frontmatter, content, meta };
}

export function getAllInsights(): Insight[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];

  const files = fs
    .readdirSync(INSIGHTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const items = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const fullPath = path.join(INSIGHTS_DIR, filename);
    return readInsightFile(fullPath, slug);
  });

  // Sort by updated (if exists) else date, newest first
  return items.sort((a, b) => {
    const aKey =
      safeDate(a.frontmatter.updated) ??
      safeDate(a.frontmatter.date) ??
      new Date(0);
    const bKey =
      safeDate(b.frontmatter.updated) ??
      safeDate(b.frontmatter.date) ??
      new Date(0);
    return bKey.getTime() - aKey.getTime();
  });
}

export function getAllInsightsList(): InsightListItem[] {
  const all = getAllInsights();
  return all.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    updated: p.frontmatter.updated,
    brand: p.frontmatter.brand,
    image: p.frontmatter.image,

    featured: p.frontmatter.featured,
    priority: p.frontmatter.priority,
    category: p.frontmatter.category,
    platform: p.frontmatter.platform,
    risk: p.frontmatter.risk,

    excerpt: p.meta?.excerpt ?? "",
    wordCount: p.meta?.wordCount ?? 0,
    readingMinutes: p.meta?.readingMinutes ?? 1,
  }));
}

export function getInsightBySlug(slug: string): Insight | null {
  const mdxPath = path.join(INSIGHTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(INSIGHTS_DIR, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filePath) return null;

  return readInsightFile(filePath, slug);
}

export function getInsightsByBrand(brand: string): Insight[] {
  const normalized = normalizeBrand(brand) ?? brand;
  const all = getAllInsights();
  return all.filter(
    (p) => (p.frontmatter.brand ?? "").toLowerCase() === normalized.toLowerCase()
  );
}

/**
 * Editor’s Pick / Featured ordering:
 * - featured: true first
 * - higher priority first (desc)
 * - then newest by updated/date
 */
export function sortFeaturedFirst(items: Insight[]): Insight[] {
  return [...items].sort((a, b) => {
    const aFeat = a.frontmatter.featured ? 1 : 0;
    const bFeat = b.frontmatter.featured ? 1 : 0;
    if (aFeat !== bFeat) return bFeat - aFeat;

    const aPri = a.frontmatter.priority ?? 0;
    const bPri = b.frontmatter.priority ?? 0;
    if (aPri !== bPri) return bPri - aPri;

    const aKey =
      safeDate(a.frontmatter.updated) ??
      safeDate(a.frontmatter.date) ??
      new Date(0);
    const bKey =
      safeDate(b.frontmatter.updated) ??
      safeDate(b.frontmatter.date) ??
      new Date(0);
    return bKey.getTime() - aKey.getTime();
  });
}
