import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { canonical } from "@/lib/site";
import { defaultLocale, isLocale } from "@/lib/i18n";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/blog";

const TITLE = "Blog";
const DESCRIPTION =
  "Practical ownership notes, buying advice, maintenance thinking, and editorial updates from TT AUTO'S Engineering.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: {
    type: "website",
    url: canonical(PATH),
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

function BlogThumb({
  src,
  alt,
  sizes,
  className = "",
}: {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-gray-800 bg-white/5 ${className}`}>
      <Image
        src={src ?? "/opengraph-image"}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent" />
    </div>
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const posts = getAllBlogPosts(locale);
  const featured = posts.find((p) => p.frontmatter.featured) ?? posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: canonical(PATH) },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: TITLE,
    description: DESCRIPTION,
    url: canonical(PATH),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: canonical("/").replace(/\/$/, ""),
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Blog Posts",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: canonical(`/blog/${p.slug}`),
      name: p.frontmatter.title,
    })),
  };

  const categories = Array.from(
    new Set(posts.map((p) => p.frontmatter.category).filter(Boolean))
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#0B1220] via-[#0F1B33] to-[#0B1220] p-8 md:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-[460px] w-[460px] rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap gap-2 mb-6">
              <Pill>Ownership notes</Pill>
              <Pill>Buying advice</Pill>
              <Pill>Maintenance thinking</Pill>
              <Pill>Editorial</Pill>
            </div>

            <p className="text-gray-300/80 text-sm">Blog</p>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 mb-3">
              Practical notes for German car ownership
            </h1>
            <p className="text-gray-200/90 max-w-3xl leading-relaxed">
              Shorter editorial posts that sit beside the deep technical insights:
              buying judgment, maintenance habits, ownership risk, and what to
              think about before the repair bill arrives.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/search?q=buying"
                className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
              >
                Search Blog Topics
              </Link>
              <Link
                href="/insights"
                className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
              >
                Read Insights
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
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200"
              >
                {category}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {featured ? (
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-white text-2xl font-bold">Featured</h2>
            <p className="text-gray-300 mt-1">
              A practical starting point from the blog.
            </p>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] hover:border-red-500 hover:bg-white/5 transition"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <BlogThumb
                src={featured.frontmatter.image}
                alt={featured.frontmatter.title}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="min-h-[260px] lg:min-h-full"
              />

              <div className="p-7 md:p-8">
                <div className="flex flex-wrap gap-2">
                  {featured.frontmatter.category ? <Pill>{featured.frontmatter.category}</Pill> : null}
                  {featured.frontmatter.brand ? <Pill>{featured.frontmatter.brand}</Pill> : null}
                  <Pill>{featured.frontmatter.updated ?? featured.frontmatter.date}</Pill>
                  <Pill>{featured.meta.readingMinutes} min read</Pill>
                </div>

                <h3 className="text-white text-2xl md:text-3xl font-bold mt-4 leading-tight">
                  {featured.frontmatter.title}
                </h3>
                <p className="text-gray-300 mt-3 max-w-3xl">
                  {featured.frontmatter.description}
                </p>
                {featured.meta.excerpt ? (
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-4xl">
                    {featured.meta.excerpt}
                  </p>
                ) : null}
                <div className="text-sm text-gray-200 mt-6 group-hover:text-white">
                  Read post -&gt;
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-white text-2xl font-bold">Latest Posts</h2>
            <p className="text-gray-300 mt-1">
              Editorial notes, ownership thinking, and practical buyer judgment.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6 text-gray-300">
            No blog posts yet. Add MDX files in{" "}
            <code className="text-gray-100">src/content/blog</code>.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden bg-[#111827] rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
              >
                <BlogThumb
                  src={p.frontmatter.image}
                  alt={p.frontmatter.title}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="h-48"
                />

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {p.frontmatter.category ? <Pill>{p.frontmatter.category}</Pill> : null}
                    {p.frontmatter.brand ? <Pill>{p.frontmatter.brand}</Pill> : null}
                  </div>

                  <h3 className="text-white text-xl font-semibold mt-4 leading-snug">
                    {p.frontmatter.title}
                  </h3>
                  <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                    {p.frontmatter.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>{p.frontmatter.updated ?? p.frontmatter.date}</span>
                    <span className="text-gray-600">-</span>
                    <span>{p.meta.readingMinutes} min read</span>
                  </div>

                  <div className="text-sm text-gray-200 mt-6 group-hover:text-white">
                    Read post -&gt;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
