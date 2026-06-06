import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/lib/i18n";

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  category?: string;
  brand?: string;
  image?: string;
  featured?: boolean;
};

export type BlogMeta = {
  excerpt: string;
  wordCount: number;
  readingMinutes: number;
};

export type BlogPost = {
  slug: string;
  locale: Locale;
  isFallback: boolean;
  frontmatter: BlogFrontmatter;
  content: string;
  meta: BlogMeta;
};

function blogDir(locale: Locale) {
  return path.join(process.cwd(), "src", "content", locale, "blog");
}

function safeDate(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
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

function normalizeBrand(input?: unknown) {
  const raw = normalizeString(input);
  if (!raw) return undefined;

  const key = raw.toLowerCase();
  if (key === "bmw") return "BMW";
  if (key === "audi") return "Audi";
  if (key === "volkswagen" || key === "vw") return "Volkswagen";
  if (key === "mercedes" || key === "mercedes-benz" || key === "mercedes benz")
    return "Mercedes-Benz";

  return raw;
}

function validateFrontmatter(data: Record<string, unknown>, slug: string): BlogFrontmatter {
  const title = normalizeString(data?.title) ?? "";
  const description = normalizeString(data?.description) ?? "";
  const date = normalizeString(data?.date) ?? "";

  if (!title || !description || !date) {
    throw new Error(
      `[blog] Missing required frontmatter in "${slug}": title, description, date`
    );
  }

  return {
    title,
    description,
    date,
    updated: normalizeString(data?.updated),
    author: normalizeString(data?.author),
    category: normalizeString(data?.category),
    brand: normalizeBrand(data?.brand),
    image: normalizeString(data?.image),
    featured: normalizeBool(data?.featured),
  };
}

function stripMdx(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[#>*_-]+/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string, maxChars = 190) {
  const cleaned = stripMdx(content);
  if (!cleaned) return "";
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.slice(0, maxChars - 3).trimEnd() + "...";
}

function computeMeta(content: string): BlogMeta {
  const cleaned = stripMdx(content);
  const wordCount = cleaned ? cleaned.split(" ").filter(Boolean).length : 0;
  return {
    excerpt: makeExcerpt(content),
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / 200)),
  };
}

function readBlogFile(
  filePath: string,
  slug: string,
  locale: Locale,
  requestedLocale: Locale
): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, slug);
  return {
    slug,
    locale,
    isFallback: locale !== requestedLocale,
    frontmatter,
    content,
    meta: computeMeta(content),
  };
}

function contentFiles(locale: Locale) {
  const dir = blogDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getAllBlogPosts(locale: Locale = defaultLocale): BlogPost[] {
  const localized = new Map(
    contentFiles(locale).map((filename) => [filename.replace(/\.mdx?$/, ""), filename])
  );
  const english = contentFiles(defaultLocale);
  const slugs = new Set([
    ...english.map((filename) => filename.replace(/\.mdx?$/, "")),
    ...localized.keys(),
  ]);

  return [...slugs]
    .map((slug) => {
      const localizedFilename = localized.get(slug);
      const contentLocale = localizedFilename ? locale : defaultLocale;
      const filename = localizedFilename ?? english.find((file) => file.replace(/\.mdx?$/, "") === slug);
      if (!filename) return null;
      return readBlogFile(
        path.join(blogDir(contentLocale), filename),
        slug,
        contentLocale,
        locale
      );
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
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

export function getBlogPostBySlug(
  slug: string,
  locale: Locale = defaultLocale
): BlogPost | null {
  const localizedDir = blogDir(locale);
  const fallbackDir = blogDir(defaultLocale);
  const localizedMdx = path.join(localizedDir, `${slug}.mdx`);
  const localizedMd = path.join(localizedDir, `${slug}.md`);
  const fallbackMdx = path.join(fallbackDir, `${slug}.mdx`);
  const fallbackMd = path.join(fallbackDir, `${slug}.md`);

  const filePath = fs.existsSync(localizedMdx)
    ? localizedMdx
    : fs.existsSync(localizedMd)
      ? localizedMd
      : fs.existsSync(fallbackMdx)
        ? fallbackMdx
        : fs.existsSync(fallbackMd)
          ? fallbackMd
      : null;

  if (!filePath) return null;
  const contentLocale = filePath.startsWith(localizedDir) ? locale : defaultLocale;
  return readBlogFile(filePath, slug, contentLocale, locale);
}
