import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights, getInsightsByBrand } from "@/lib/insights";
import type { Locale } from "@/lib/i18n";
import { canonical } from "@/lib/site";

type Signal = {
  label: string;
  score: number;
};

type BrandHubProps = {
  brandName: string;
  brandPath: string;
  title: string;
  description: string;
  heroImage: string;
  logo?: string;
  intro: string;
  signals: Signal[];
  focusAreas: string[];
  models: string[];
  problemAreas: string[];
  bestFor: string;
  contentTerms?: string[];
  locale: Locale;
};

const SITE_NAME = "TT AUTO'S Engineering";

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
    <span className="inline-flex text-xs px-2.5 py-1.5 rounded-full border border-gray-700 text-gray-200 bg-white/5">
      {children}
    </span>
  );
}

function ScoreRow({ label, score }: Signal) {
  const clamped = Math.max(1, Math.min(10, score));
  const level =
    clamped >= 8 ? "Strong" : clamped >= 6 ? "Mid" : clamped >= 4 ? "Risk" : "High Risk";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-800 bg-white/5 px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white truncate">{label}</div>
        <div className="text-xs text-gray-300">{level}</div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${clamped * 10}%` }} />
        </div>
        <div className="text-sm font-semibold tabular-nums text-gray-100">{clamped}/10</div>
      </div>
    </div>
  );
}

function ContentCard({
  href,
  title,
  description,
  image,
  badge,
  date,
}: {
  href: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  date?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] hover:border-red-500 hover:bg-white/5 transition"
    >
      <div className="relative h-44 border-b border-gray-800 bg-white/5">
        <Image
          src={image ?? "/opengraph-image"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white text-lg font-semibold leading-snug">{title}</h3>
          {badge ? (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5 shrink-0">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-gray-300 mt-2 text-sm leading-relaxed">{description}</p>
        {date ? <p className="text-gray-400 text-xs mt-4">{date}</p> : null}
        <div className="text-sm text-gray-200 mt-5 group-hover:text-white">Open -&gt;</div>
      </div>
    </Link>
  );
}

export default function BrandHubPage({
  brandName,
  brandPath,
  title,
  description,
  heroImage,
  logo,
  intro,
  signals,
  focusAreas,
  models,
  problemAreas,
  bestFor,
  contentTerms = [],
  locale,
}: BrandHubProps) {
  const exactPosts = getInsightsByBrand(brandName, locale);
  const relatedPosts = getAllInsights(locale).filter((post) => {
    const haystack = [
      post.frontmatter.title,
      post.frontmatter.description,
      post.frontmatter.brand,
      post.frontmatter.platform,
      post.frontmatter.category,
      ...(post.frontmatter.risk ?? []),
      post.meta?.excerpt,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return contentTerms.some((term) => haystack.includes(term.toLowerCase()));
  });
  const posts = [...exactPosts, ...relatedPosts]
    .filter((post, index, items) => items.findIndex((item) => item.slug === post.slug) === index)
    .slice(0, 6);
  const blogPosts = getAllBlogPosts(locale)
    .filter((p) => (p.frontmatter.brand ?? "").toLowerCase() === brandName.toLowerCase())
    .slice(0, 3);

  const brandUrl = canonical(brandPath);
  const siteUrl = canonical("/").replace(/\/$/, "");

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Brands", item: canonical("/brands") },
      { "@type": "ListItem", position: 3, name: brandName, item: brandUrl },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: brandUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  const itemListJsonLd =
    posts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Latest ${brandName} Insights`,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: posts.length,
          itemListElement: posts.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: canonical(`/insights/${p.slug}`),
            name: p.frontmatter.title,
          })),
        }
      : null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd
        data={[breadcrumbsJsonLd, collectionPageJsonLd, ...(itemListJsonLd ? [itemListJsonLd] : [])]}
      />

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: brandName }]}
      />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
          <div className="relative min-h-[420px]">
            <Image
              src={heroImage}
              alt={`${brandName} engineering hub`}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-[#0B1220]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

            <div className="relative p-8 md:p-12 max-w-3xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-[76px] min-w-[76px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={`${brandName} logo`}
                      width={52}
                      height={52}
                      className="h-12 w-12 object-contain invert"
                    />
                  ) : (
                    <span className="text-center text-sm font-black tracking-[0.12em] text-white">
                      {brandName}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-gray-300/90 text-sm">Brand Hub</p>
                  <div className="text-gray-100 font-semibold">{brandName}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <Pill>Reliability</Pill>
                <Pill>Buying checks</Pill>
                <Pill>Common faults</Pill>
                <Pill>Ownership cost</Pill>
              </div>

              <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
                {title}
              </h1>
              <p className="text-gray-200 mt-4 leading-relaxed">{intro}</p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  href={`/insights?brand=${encodeURIComponent(brandName)}`}
                  className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Browse {brandName} Insights
                </Link>
                <Link
                  href="/buying-guides"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Buying Guides
                </Link>
                <Link
                  href="/reliability-index"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Reliability Index
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-white text-2xl font-bold">{brandName} reliability signals</h2>
              <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5">
                Snapshot
              </span>
            </div>
            <div className="grid gap-3">
              {signals.map((x) => (
                <ScoreRow key={x.label} label={x.label} score={x.score} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-gray-400">Best for</div>
              <p className="text-sm text-gray-100 mt-1 leading-relaxed">{bestFor}</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <h2 className="text-white text-2xl font-bold">Inspection focus</h2>
            <p className="text-gray-300 mt-2">
              Start here before reading individual model pages or booking a pre-purchase inspection.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Priority checks</div>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  {focusAreas.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500/80 shrink-0" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">Model targets</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {models.map((x) => (
                    <span
                      key={x}
                      className="text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5"
                    >
                      {x}
                    </span>
                  ))}
                </div>

                <div className="text-sm font-semibold text-white mt-6">Problem areas</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problemAreas.map((x) => (
                    <span
                      key={x}
                      className="text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Use this hub</h2>
          <p className="text-gray-300 mt-1">
            Pick the path that matches your decision: inspect, compare, or understand the fault.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Buying Guides",
              desc: "Inspection checklists, red flags, service history questions, and deal-breaker logic.",
              href: "/buying-guides",
              badge: "Checklist",
            },
            {
              title: "Reliability Index",
              desc: "Compare signal weights across brands: cooling, oil leaks, timing, gearbox, electronics.",
              href: "/reliability-index",
              badge: "Signals",
            },
            {
              title: "Problem Analysis",
              desc: "Read symptoms, root causes, diagnostics, and repair-priority explanations.",
              href: `/insights?brand=${encodeURIComponent(brandName)}`,
              badge: "Insights",
            },
          ].map((x) => (
            <Link
              key={x.title}
              href={x.href}
              className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-white text-lg font-semibold">{x.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5">
                  {x.badge}
                </span>
              </div>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed">{x.desc}</p>
              <div className="text-sm text-gray-200 mt-6 group-hover:text-white">Open -&gt;</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white text-2xl font-bold">Latest {brandName} Insights</h2>
            <p className="text-gray-300 mt-1">
              Engineering notes and buying-risk explainers connected to this brand.
            </p>
          </div>
          <Link
            href={`/insights?brand=${encodeURIComponent(brandName)}`}
            className="text-sm text-gray-200 hover:text-white"
          >
            View all -&gt;
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <ContentCard
              key={p.slug}
              href={`/insights/${p.slug}`}
              title={p.frontmatter.title}
              description={p.frontmatter.description}
              image={p.frontmatter.image}
              badge={p.frontmatter.platform ?? p.frontmatter.category}
              date={p.frontmatter.updated ?? p.frontmatter.date}
            />
          ))}

          {posts.length === 0 && (
            <div className="text-gray-300 rounded-2xl border border-gray-800 bg-[#111827] p-6">
              No {brandName} insights yet. Add MDX files with{" "}
              <code className="text-gray-100">brand: &quot;{brandName}&quot;</code>.
            </div>
          )}
        </div>
      </section>

      {blogPosts.length > 0 ? (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white text-2xl font-bold">{brandName} Blog Notes</h2>
              <p className="text-gray-300 mt-1">
                Shorter ownership and buying-advice posts tied to this brand.
              </p>
            </div>
            <Link href="/blog" className="text-sm text-gray-200 hover:text-white">
              Blog -&gt;
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((p) => (
              <ContentCard
                key={p.slug}
                href={`/blog/${p.slug}`}
                title={p.frontmatter.title}
                description={p.frontmatter.description}
                image={p.frontmatter.image}
                badge={p.frontmatter.category}
                date={p.frontmatter.updated ?? p.frontmatter.date}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
