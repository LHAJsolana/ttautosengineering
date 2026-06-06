import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  frontmatter: BlogFrontmatter;
  content: string;
  meta: BlogMeta;
};

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

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

function readBlogFile(filePath: string, slug: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, slug);
  return {
    slug,
    frontmatter,
    content,
    meta: computeMeta(content),
  };
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      return readBlogFile(path.join(BLOG_DIR, filename), slug);
    })
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

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filePath) return null;
  return readBlogFile(filePath, slug);
}
