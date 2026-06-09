import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { canonical, localizedPageMetadata } from "@/lib/site";
import { defaultLocale, isLocale } from "@/lib/i18n";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/blog";

const TITLE = "Blog";
const DESCRIPTION =
  "Practical ownership notes, buying advice, maintenance thinking, and editorial updates from TT AUTO'S Engineering.";

const BLOG_COPY = {
  en: {
    home: "Home",
    eyebrow: "TT AUTO'S Journal",
    title: "Practical notes for German car ownership",
    description:
      "Buying judgment, maintenance habits, ownership risk, and the engineering context behind the next repair bill.",
    ownership: "Ownership notes",
    buying: "Buying advice",
    maintenance: "Maintenance thinking",
    editorial: "Editorial",
    search: "Search blog topics",
    insights: "Read insights",
    guides: "Buying guides",
    brands: "Brand hubs",
    featured: "Featured analysis",
    featuredDescription: "A practical starting point selected by the editorial team.",
    latest: "Latest from the workshop",
    latestDescription: "Fresh ownership thinking, buyer judgment, and maintenance notes.",
    minRead: "min read",
    read: "Read article",
    noPosts: "No blog posts are available yet.",
  },
  nl: {
    home: "Thuis",
    eyebrow: "TT AUTO'S Journaal",
    title: "Praktische notities voor bezit van een Duitse auto",
    description:
      "Aankoopkeuzes, onderhoudsgewoonten, eigendomsrisico en de technische context achter de volgende reparatiefactuur.",
    ownership: "Eigendomsnotities",
    buying: "Aankoopadvies",
    maintenance: "Onderhoud",
    editorial: "Redactie",
    search: "Zoek blogonderwerpen",
    insights: "Lees inzichten",
    guides: "Koopgidsen",
    brands: "Merkenhubs",
    featured: "Uitgelichte analyse",
    featuredDescription: "Een praktisch startpunt geselecteerd door de redactie.",
    latest: "Nieuw uit de werkplaats",
    latestDescription: "Nieuwe inzichten over bezit, aankoopkeuzes en onderhoud.",
    minRead: "min lezen",
    read: "Lees artikel",
    noPosts: "Er zijn nog geen blogberichten beschikbaar.",
  },
  ar: {
    home: "الرئيسية",
    eyebrow: "مجلة TT AUTO'S",
    title: "ملاحظات عملية لامتلاك سيارة ألمانية",
    description:
      "قرارات الشراء وعادات الصيانة ومخاطر الملكية والسياق الهندسي وراء فاتورة الإصلاح القادمة.",
    ownership: "ملاحظات الملكية",
    buying: "نصائح الشراء",
    maintenance: "الصيانة",
    editorial: "التحرير",
    search: "ابحث في مواضيع المدونة",
    insights: "اقرأ التحليلات",
    guides: "أدلة الشراء",
    brands: "صفحات العلامات",
    featured: "تحليل مميز",
    featuredDescription: "نقطة بداية عملية اختارها فريق التحرير.",
    latest: "الأحدث من الورشة",
    latestDescription: "أفكار جديدة حول الملكية والشراء والصيانة.",
    minRead: "دقائق قراءة",
    read: "اقرأ المقال",
    noPosts: "لا توجد مقالات متاحة بعد.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: PATH,
    title: TITLE,
    description: DESCRIPTION,
  });
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
  const copy = BLOG_COPY[locale];
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
    <main className="mx-auto max-w-6xl px-6 py-14 text-white md:py-16">
      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd]} />

      <Breadcrumbs items={[{ label: copy.home, href: "/" }, { label: "Blog" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0B1220] via-[#111f39] to-[#0B1220] p-8 shadow-2xl shadow-black/20 md:p-12">
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
              <Pill>{copy.ownership}</Pill>
              <Pill>{copy.buying}</Pill>
              <Pill>{copy.maintenance}</Pill>
              <Pill>{copy.editorial}</Pill>
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
              {copy.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/search?q=buying"
                className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
              >
                {copy.search}
              </Link>
              <Link
                href="/insights"
                className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
              >
                {copy.insights}
              </Link>
              <Link
                href="/buying-guides"
                className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
              >
                {copy.guides}
              </Link>
              <Link
                href="/brands"
                className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
              >
                {copy.brands}
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
            <h2 className="text-2xl font-bold text-white">{copy.featured}</h2>
            <p className="text-gray-300 mt-1">
              {copy.featuredDescription}
            </p>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-[#101827] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/20"
          >
            <span className="absolute inset-y-0 start-0 z-20 w-1 bg-gradient-to-b from-red-500 via-red-600 to-amber-400" />
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
                  <Pill>{featured.meta.readingMinutes} {copy.minRead}</Pill>
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
                  {copy.read} <span data-directional-icon>-&gt;</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-white">{copy.latest}</h2>
            <p className="text-gray-300 mt-1">
              {copy.latestDescription}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6 text-gray-300">
            {copy.noPosts}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/20"
              >
                <span className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-red-600 via-red-400 to-amber-300 transition duration-500 group-hover:scale-x-100" />
                <BlogThumb
                  src={p.frontmatter.image}
                  alt={p.frontmatter.title}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="h-48"
                />

                <div className="flex flex-1 flex-col p-6">
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

                  <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-5 text-xs text-gray-400">
                    <span>{p.frontmatter.updated ?? p.frontmatter.date}</span>
                    <span className="text-gray-600">-</span>
                    <span>{p.meta.readingMinutes} {copy.minRead}</span>
                  </div>

                  <div className="mt-5 text-sm font-bold text-gray-200 transition group-hover:text-red-300">
                    {copy.read} <span data-directional-icon>-&gt;</span>
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
