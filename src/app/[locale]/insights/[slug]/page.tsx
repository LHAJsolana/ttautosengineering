// src/app/insights/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllInsights, getInsightBySlug } from "@/lib/insights";
import { mdxComponents } from "@/components/mdx";
import RelatedResearch from "@/components/RelatedResearch";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/site";
import { getBrandByName } from "@/lib/brands";

const SITE_URL = "https://ttautosengineering.com";
const SITE_NAME = "TT AUTO’S Engineering";

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
  if (!isNaN(d.getTime())) return d.toISOString();
  return undefined;
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

function brandToHubPath(brand?: string) {
  const match = getBrandByName(brand);
  return match ? `/brands/${match.slug}` : "/brands";
}

function ogForPost(opts: { title: string; subtitle?: string; brand?: string }) {
  const params = new URLSearchParams();
  params.set("title", opts.title);
  if (opts.subtitle) params.set("subtitle", opts.subtitle);
  if (opts.brand) params.set("brand", opts.brand);
  return `/opengraph-image?${params.toString()}`;
}

function computeMetaFromContent(content: string) {
  const cleaned = content.replace(/^---[\s\S]*?---\s*/m, "");
  const words = cleaned.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));
  return { wordCount: words, readingMinutes };
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5">
      {children}
    </span>
  );
}

export function generateStaticParams() {
  return getAllInsights().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;

  const post = getInsightBySlug(slug, locale);
  if (!post) return {};

  const path = `/insights/${post.slug}`;
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
      title: `${title} — ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;

  const post = getInsightBySlug(slug, locale);
  if (!post) return notFound();

  const path = `/insights/${post.slug}`;
  const contentLocale = post.isFallback ? post.locale : locale;
  const canonicalPath = localePath(contentLocale, path);
  const title = post.frontmatter.title;
  const description = post.frontmatter.description;
  const heroImage = post.frontmatter.image;

  const datePublished = safeIsoDate(post.frontmatter.date);
  const dateModified = safeIsoDate(post.frontmatter.updated) ?? datePublished;

  const brand = post.frontmatter.brand;
  const platform = post.frontmatter.platform;
  const category = post.frontmatter.category;
  const risk = post.frontmatter.risk ?? [];

  const brandHub = brandToHubPath(brand);

  const imageForSchema = post.frontmatter.image
    ? absoluteImageUrl(post.frontmatter.image)
    : absoluteUrl(
        ogForPost({
          title,
          subtitle: description,
          brand,
        })
      );

  const metaFallback = computeMetaFromContent(post.content || "");
  const meta = post.meta ?? metaFallback;

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  // Related: brand+platform first; then brand; then platform; then latest
  const all = getAllInsights(locale).filter((p) => p.slug !== post.slug);

  const sameBrandPlatform =
    brand && platform
      ? all.filter(
          (p) =>
            (p.frontmatter.brand ?? "").toLowerCase() === brand.toLowerCase() &&
            (p.frontmatter.platform ?? "").toLowerCase() === platform.toLowerCase()
        )
      : [];

  const sameBrand =
    brand
      ? all.filter(
          (p) => (p.frontmatter.brand ?? "").toLowerCase() === brand.toLowerCase()
        )
      : [];

  const samePlatform =
    platform
      ? all.filter(
          (p) =>
            (p.frontmatter.platform ?? "").toLowerCase() === platform.toLowerCase()
        )
      : [];

  const related = [...sameBrandPlatform, ...sameBrand, ...samePlatform, ...all]
    .filter((p, idx, arr) => arr.findIndex((x) => x.slug === p.slug) === idx)
    .slice(0, 4);

  const breadcrumbId = `${absoluteUrl(canonicalPath)}#breadcrumb`;
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(localePath(contentLocale)) },
      { "@type": "ListItem", position: 2, name: "Insights", item: absoluteUrl(localePath(contentLocale, "/insights")) },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(canonicalPath) },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(canonicalPath),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    breadcrumb: { "@id": `${absoluteUrl(canonicalPath)}#breadcrumb` },
  };

  const keywords: string[] = ["reliability", "buying guide", "engineering"];
  if (brand) keywords.unshift(brand);
  if (platform) keywords.unshift(platform);
  if (category) keywords.unshift(category);
  for (const r of risk) keywords.unshift(r);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: absoluteUrl(canonicalPath),
    url: absoluteUrl(canonicalPath),
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.ico") },
    },
    image: [imageForSchema],
    keywords,
  };

  const metaDateLabel = post.frontmatter.updated
    ? post.frontmatter.updated
    : post.frontmatter.date;

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, webPageJsonLd, articleJsonLd]} />

      {/* Top nav */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 mb-6">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="text-gray-500">/</span>
        <Link href="/insights" className="hover:text-white">
          Insights
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-200 line-clamp-1">{title}</span>
      </div>

      {/* Hero */}
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
            {post.frontmatter.featured ? (
              <span className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-red-500/50 bg-red-500/10 text-red-100">
                Editor’s Pick
              </span>
            ) : null}

            {brand ? (
              <>
                <Link
                  href={`/insights?brand=${encodeURIComponent(brand)}`}
                  className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5 hover:bg-white/10 transition"
                >
                  {brand}
                </Link>
                <Link
                  href={brandHub}
                  className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5 hover:bg-white/10 transition"
                >
                  Open {brand} hub →
                </Link>
              </>
            ) : (
              <Link
                href="/brands"
                className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5 hover:bg-white/10 transition"
              >
                Browse brand hubs →
              </Link>
            )}

            {/* Taxonomy pills (graceful fallback) */}
            {category ? <Pill>{category}</Pill> : null}
            {platform ? <Pill>{platform}</Pill> : null}
            {risk.slice(0, 3).map((r) => (
              <Pill key={r}>{r}</Pill>
            ))}

            <Pill>{metaDateLabel}</Pill>
            <Pill>{meta.readingMinutes} min read</Pill>
            <Pill>{meta.wordCount.toLocaleString()} words</Pill>
          </div>

          <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-[1.08]">
            {title}
          </h1>

          <p className="text-gray-200/90 mt-4 max-w-3xl leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/reliability-index"
              className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
            >
              Reliability Index
            </Link>
            <Link
              href="/buying-guides"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Buying Guides
            </Link>
            <Link
              href="/brands"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Brand Hubs
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="prose prose-invert max-w-none mt-10">{content}</article>

      <RelatedResearch
        className="mt-14"
        items={[
          { label: brand ? `${brand} hub` : "Brand hubs", href: brand ? brandHub : "/brands", badge: "Brand" },
          { label: "Model guides", href: "/models", badge: "Models" },
          { label: "Powertrain library", href: "/powertrains", badge: "Engines" },
          { label: "Fault-code library", href: "/fault-codes", badge: "Diagnostics" },
          { label: "Parts & Failure Map", href: "/parts-failure-map", badge: "Systems" },
          { label: "Used-car checklist", href: "/buying-checklist", badge: "Buyer" },
        ]}
      />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-gray-800">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white text-2xl font-bold">Related Insights</h2>
              <p className="text-gray-300 mt-1">
                Same brand/platform first, then the latest.
              </p>
            </div>
            <Link href="/insights" className="text-sm text-gray-200 hover:text-white">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/insights/${p.slug}`}
                className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-white font-semibold leading-snug">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.brand ? (
                    <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5 shrink-0">
                      {p.frontmatter.brand}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.frontmatter.platform ? (
                    <span className="text-[11px] px-2 py-1 rounded-full border border-gray-700 bg-white/5 text-gray-200">
                      {p.frontmatter.platform}
                    </span>
                  ) : null}
                  {p.frontmatter.category ? (
                    <span className="text-[11px] px-2 py-1 rounded-full border border-gray-700 bg-white/5 text-gray-200">
                      {p.frontmatter.category}
                    </span>
                  ) : null}
                  {(p.frontmatter.risk ?? []).slice(0, 2).map((r) => (
                    <span
                      key={r}
                      className="text-[11px] px-2 py-1 rounded-full border border-gray-700 bg-white/5 text-gray-200"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 mt-3 text-sm">{p.frontmatter.description}</p>
                <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                  <span>{p.frontmatter.updated ?? p.frontmatter.date}</span>
                  <span>•</span>
                  <span>{p.meta?.readingMinutes ?? 1} min read</span>
                </div>
                <div className="text-sm text-gray-200 mt-5 group-hover:text-white">
                  Read →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
