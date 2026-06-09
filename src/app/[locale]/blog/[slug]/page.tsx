import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/site";

const SITE_URL = "https://ttautosengineering.com";
const SITE_NAME = "TT AUTO'S Engineering";

function absoluteUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

function absoluteImageUrl(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  return absoluteUrl(src);
}

function safeIsoDate(input?: string) {
  if (!input) return undefined;
  const d = new Date(input);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}

function ogForPost(opts: { title: string; subtitle?: string; brand?: string }) {
  const params = new URLSearchParams();
  params.set("title", opts.title);
  if (opts.subtitle) params.set("subtitle", opts.subtitle);
  if (opts.brand) params.set("brand", opts.brand);
  return `/opengraph-image?${params.toString()}`;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5">
      {children}
    </span>
  );
}

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const post = getBlogPostBySlug(slug, locale);
  if (!post) return {};

  const path = `/blog/${post.slug}`;
  const contentLocale = post.isFallback ? post.locale : locale;
  const title = post.frontmatter.title;
  const description = post.frontmatter.description;
  const ogImage =
    post.frontmatter.image ??
    ogForPost({
      title,
      subtitle: description,
      brand: post.frontmatter.brand,
    });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: post.isFallback
      ? { canonical: absoluteUrl(localePath(contentLocale, path)) }
      : localizedAlternates(path, locale),
    openGraph: {
      type: "article",
      url: absoluteUrl(localePath(contentLocale, path)),
      title: `${title} - ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const post = getBlogPostBySlug(slug, locale);
  if (!post) return notFound();

  const path = `/blog/${post.slug}`;
  const contentLocale = post.isFallback ? post.locale : locale;
  const canonicalPath = localePath(contentLocale, path);
  const title = post.frontmatter.title;
  const description = post.frontmatter.description;
  const heroImage = post.frontmatter.image;
  const datePublished = safeIsoDate(post.frontmatter.date);
  const dateModified = safeIsoDate(post.frontmatter.updated) ?? datePublished;
  const author = post.frontmatter.author ?? SITE_NAME;

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  const related = getAllBlogPosts(locale)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(canonicalPath)}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(localePath(contentLocale)) },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl(localePath(contentLocale, "/blog")) },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(canonicalPath) },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    mainEntityOfPage: absoluteUrl(canonicalPath),
    url: absoluteUrl(canonicalPath),
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.ico") },
    },
    image: [
      absoluteImageUrl(
        post.frontmatter.image ??
          ogForPost({
            title,
            subtitle: description,
            brand: post.frontmatter.brand,
          })
      ),
    ],
    keywords: [
      post.frontmatter.category,
      post.frontmatter.brand,
      "German cars",
      "ownership",
      "buying advice",
    ].filter(Boolean),
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, articleJsonLd]} />

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 mb-6">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="text-gray-500">/</span>
        <Link href="/blog" className="hover:text-white">
          Blog
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-200 line-clamp-1">{title}</span>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#0B1220] via-[#0F1B33] to-[#0B1220]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-red-600/20 blur-3xl" />

        {heroImage ? (
          <div className="relative h-[260px] md:h-[360px] border-b border-gray-800 bg-white/5">
            <Image
              src={heroImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/10 to-transparent" />
          </div>
        ) : null}

        <div className="relative p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Pill>Blog</Pill>
            {post.frontmatter.category ? <Pill>{post.frontmatter.category}</Pill> : null}
            {post.frontmatter.brand ? <Pill>{post.frontmatter.brand}</Pill> : null}
            <Pill>{post.frontmatter.updated ?? post.frontmatter.date}</Pill>
            <Pill>{post.meta.readingMinutes} min read</Pill>
          </div>

          <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-[1.08]">
            {title}
          </h1>

          <p className="text-gray-200/90 mt-4 max-w-3xl leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/blog"
              className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
            >
              Blog
            </Link>
            <Link
              href="/insights"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Insights
            </Link>
            <Link
              href="/buying-guides"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Buying Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-gray-800 bg-[#111827] p-5 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
            Article brief
          </p>
          <div className="mt-4 space-y-4 text-sm text-gray-300">
            <div>
              <div className="text-xs text-gray-500">Reading time</div>
              <div className="mt-1 font-semibold text-white">{post.meta.readingMinutes} min</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Words</div>
              <div className="mt-1 font-semibold text-white">{post.meta.wordCount.toLocaleString()}</div>
            </div>
            {post.frontmatter.category ? (
              <div>
                <div className="text-xs text-gray-500">Focus</div>
                <div className="mt-1 font-semibold text-white">{post.frontmatter.category}</div>
              </div>
            ) : null}
          </div>
          <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-relaxed text-red-50">
            Read it like a buyer: note the warning signs, then turn them into inspection questions before viewing the car.
          </div>
        </aside>

        <article className="prose prose-invert max-w-none rounded-3xl border border-gray-800 bg-[#0F172A]/70 p-6 md:p-8">
          {content}
        </article>
      </section>

      {related.length > 0 ? (
        <section className="mt-14 pt-10 border-t border-gray-800">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white text-2xl font-bold">More From The Blog</h2>
              <p className="text-gray-300 mt-1">
                Recent ownership notes and buyer-focused thinking.
              </p>
            </div>
            <Link href="/blog" className="text-sm text-gray-200 hover:text-white">
              View all -&gt;
            </Link>
          </div>

          <div className="grid gap-5">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
              >
                <div className="flex flex-wrap gap-2">
                  {p.frontmatter.category ? <Pill>{p.frontmatter.category}</Pill> : null}
                  <Pill>{p.frontmatter.updated ?? p.frontmatter.date}</Pill>
                </div>
                <h3 className="text-white text-lg font-semibold mt-3">
                  {p.frontmatter.title}
                </h3>
                <p className="text-gray-300 mt-2 text-sm">{p.frontmatter.description}</p>
                <div className="text-sm text-gray-200 mt-5 group-hover:text-white">
                  Read post -&gt;
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
