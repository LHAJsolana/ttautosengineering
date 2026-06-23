// src/app/insights/page.tsx
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical, localizedPageMetadata } from "@/lib/site";
import { getAllInsights, sortFeaturedFirst } from "@/lib/insights";
import InsightsGridClient from "@/components/InsightsGrid.client";
import type { InsightGridItem } from "@/components/InsightsGrid.client";
import type { Insight } from "@/lib/insights";
import { slugifyTaxonomy } from "@/lib/taxonomy";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { brandNames } from "@/lib/brands";

const SITE_NAME = "TT AUTO’S Engineering";
const PATH = "/insights";

const TITLE = "Insights";
const DESCRIPTION =
  "Engineering-driven automotive insights, reliability breakdowns, and buyer-focused guides.";

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

const BRANDS = ["All", ...brandNames];

function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 hover:border-gray-500 transition"
    >
      {children}
    </Link>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] px-2 py-1 rounded-full border border-gray-700 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

function buildHref({
  brand,
  q,
  category,
  platform,
  risk,
}: {
  brand?: string;
  q?: string;
  category?: string;
  platform?: string;
  risk?: string;
}) {
  const params = new URLSearchParams();
  if (brand && brand !== "All") params.set("brand", brand);
  if (q && q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  if (platform) params.set("platform", platform);
  if (risk) params.set("risk", risk);
  const qs = params.toString();
  return qs ? `/insights?${qs}` : "/insights";
}

function rankedValues(values: Array<string | undefined>, limit = 8) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const clean = value?.trim();
    if (!clean) continue;
    counts.set(clean, (counts.get(clean) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function cardPills(p: Insight): string[] {
  const out: string[] = [];
  if (p?.frontmatter?.category) out.push(p.frontmatter.category);
  if (p?.frontmatter?.platform) out.push(p.frontmatter.platform);
  if (Array.isArray(p?.frontmatter?.risk)) {
    for (const r of p.frontmatter.risk.slice(0, 2)) out.push(r);
  }
  return out.slice(0, 4);
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    brand?: string;
    q?: string;
    category?: string;
    platform?: string;
    risk?: string;
  }>;
}) {
  const [{ locale: localeParam }, query] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve({} as {
        brand?: string;
        q?: string;
        category?: string;
        platform?: string;
        risk?: string;
      }),
  ]);
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const selected = query.brand ?? "All";
  const q = (query.q ?? "").trim();
  const selectedCategory = query.category ?? "";
  const selectedPlatform = query.platform ?? "";
  const selectedRisk = query.risk ?? "";

  // getAllInsights() includes meta (excerpt/wordCount/readingMinutes)
  const posts = getAllInsights(locale);

  const categoryOptions = rankedValues(posts.map((post) => post.frontmatter.category));
  const platformOptions = rankedValues(posts.map((post) => post.frontmatter.platform));
  const riskOptions = rankedValues(posts.flatMap((post) => post.frontmatter.risk ?? []));

  const taxonomyFiltered = posts.filter((p) => {
    const brandMatches =
      selected === "All" ||
      (p.frontmatter.brand ?? "").toLowerCase() === selected.toLowerCase();
    const categoryMatches =
      !selectedCategory || p.frontmatter.category === selectedCategory;
    const platformMatches =
      !selectedPlatform || p.frontmatter.platform === selectedPlatform;
    const riskMatches =
      !selectedRisk || (p.frontmatter.risk ?? []).includes(selectedRisk);
    return brandMatches && categoryMatches && platformMatches && riskMatches;
  });

  const filtered = q
    ? taxonomyFiltered.filter((p) => {
        const query = q.toLowerCase();
        return (
          p.frontmatter.title.toLowerCase().includes(query) ||
          p.frontmatter.description.toLowerCase().includes(query) ||
          (p.meta?.excerpt ?? "").toLowerCase().includes(query) ||
          (p.frontmatter.category ?? "").toLowerCase().includes(query) ||
          (p.frontmatter.platform ?? "").toLowerCase().includes(query) ||
          (p.frontmatter.risk ?? []).some((risk) =>
            risk.toLowerCase().includes(query)
          )
        );
      })
    : taxonomyFiltered;

  // Canonical fixed to /insights. noindex variants to avoid duplicates.
  const shouldNoIndex =
    selected !== "All" ||
    !!q ||
    !!selectedCategory ||
    !!selectedPlatform ||
    !!selectedRisk;

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Insights", item: canonical(PATH) },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
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
    name: "Latest Insights",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: Math.min(filtered.length, 24),
    itemListElement: filtered.slice(0, 24).map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: canonical(`/insights/${p.slug}`),
      name: p.frontmatter.title,
    })),
  };

  const startHere = [
    {
      title: "Reliability Index",
      desc: "Signal-based scoring and ownership risk drivers.",
      href: "/reliability-index",
      badge: "Core",
    },
    {
      title: "Buying Guides",
      desc: "Inspection checklists, red flags, and what fails first.",
      href: "/buying-guides",
      badge: "Guides",
    },
    {
      title: "Brand Hubs",
      desc: "BMW, Mercedes, Audi, VW — organized per brand.",
      href: "/brands",
      badge: "Hubs",
    },
  ];

  const popularTopics = [
    { label: "Timing chain", href: "/insights?q=timing%20chain" },
    { label: "Oil leaks", href: "/insights?q=oil%20leak" },
    { label: "Cooling system", href: "/insights?q=cooling" },
    { label: "DSG", href: "/insights?q=DSG" },
    { label: "Diesel reliability", href: "/insights?q=diesel" },
  ];

  // Upgrade these to SEO-clean platform pages (NOT query pages)
  const collections = [
    {
      title: "BMW engines",
      items: [
        { label: "N47", platform: "N47" },
        { label: "B47", platform: "B47" },
        { label: "N20", platform: "N20" },
        { label: "B48", platform: "B48" },
      ],
    },
    {
      title: "Mercedes platforms",
      items: [
        { label: "W205", platform: "W205" },
        { label: "OM651", platform: "OM651" },
        { label: "M274", platform: "M274" },
        { label: "9G-Tronic", platform: "9G-Tronic" },
      ],
    },
    {
      title: "VAG (Audi/VW)",
      items: [
        { label: "EA888", platform: "EA888" },
        { label: "DSG", platform: "DSG" },
        { label: "MQB", platform: "MQB" },
        { label: "Oil consumption", platform: "Oil consumption" },
      ],
    },
  ];

  // Editor’s Pick / Featured (respects filters/search)
  const featuredCandidates = filtered.filter((p) => p.frontmatter.featured);
  const featuredSorted = sortFeaturedFirst(featuredCandidates);
  const featured = featuredSorted.slice(0, 3);
  const featuredMain = featured[0];
  const featuredSide = featured.slice(1, 3);

  const showClear =
    selected !== "All" ||
    !!q ||
    !!selectedCategory ||
    !!selectedPlatform ||
    !!selectedRisk;

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      {shouldNoIndex ? <meta name="robots" content="noindex,follow" /> : null}

      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />

      {/* Hero */}
      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#0B1220] via-[#0F1B33] to-[#0B1220] p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative">
            <p className="text-gray-300/80 text-sm">Insights</p>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 mb-3">
              {TITLE}
            </h1>
            <p className="text-gray-200/90 max-w-3xl leading-relaxed">
              {DESCRIPTION}
            </p>

            {/* Search */}
            <form action="/insights" className="mt-6 flex flex-col sm:flex-row gap-3">
              {selected !== "All" ? (
                <input type="hidden" name="brand" value={selected} />
              ) : null}
              {selectedCategory ? (
                <input type="hidden" name="category" value={selectedCategory} />
              ) : null}
              {selectedPlatform ? (
                <input type="hidden" name="platform" value={selectedPlatform} />
              ) : null}
              {selectedRisk ? (
                <input type="hidden" name="risk" value={selectedRisk} />
              ) : null}

              <input
                name="q"
                defaultValue={q}
                placeholder="Search: N47, timing chain, oil leak, DSG…"
                className="w-full sm:flex-1 rounded-2xl border border-gray-700 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
              >
                Search
              </button>

              {showClear ? (
                <Link
                  href="/insights"
                  className="sm:self-stretch inline-flex items-center justify-center rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
                >
                  Clear
                </Link>
              ) : null}
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-400">
              <span>
                Showing <span className="text-gray-200">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "post" : "posts"}
                {selected !== "All" ? (
                  <>
                    {" "}
                    for <span className="text-gray-200">{selected}</span>
                  </>
                ) : null}
                {selectedCategory ? (
                  <>
                    {" "}
                    in <span className="text-gray-200">{selectedCategory}</span>
                  </>
                ) : null}
                {selectedPlatform ? (
                  <>
                    {" "}
                    on <span className="text-gray-200">{selectedPlatform}</span>
                  </>
                ) : null}
                {selectedRisk ? (
                  <>
                    {" "}
                    with <span className="text-gray-200">{selectedRisk}</span> risk
                  </>
                ) : null}
                {q ? (
                  <>
                    {" "}
                    matching <span className="text-gray-200">“{q}”</span>
                  </>
                ) : null}
                .
              </span>
              <span className="text-gray-600">•</span>
              <span>Popular:</span>
              {popularTopics.map((t) => (
                <PillLink key={t.label} href={t.href}>
                  {t.label}
                </PillLink>
              ))}
            </div>

            <div className="mt-5 text-xs text-gray-400">
              Engineering-first notes: failure modes, diagnostics signals, and ownership cost drivers.
              <Link href="/search" className="ml-2 text-gray-200 hover:text-white underline underline-offset-4">
                Search the full site -&gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-10 rounded-3xl border border-gray-800 bg-[#111827] p-5">
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Brand
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {BRANDS.map((b) => {
                const isActive = b === selected;
                const href = buildHref({
                  brand: b,
                  q,
                  category: selectedCategory,
                  platform: selectedPlatform,
                  risk: selectedRisk,
                });

                return (
                  <Link
                    key={b}
                    href={href}
                    className={[
                      "text-sm px-3 py-1.5 rounded-full border transition",
                      isActive
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-gray-700 bg-white/0 text-gray-200 hover:border-gray-500 hover:bg-white/5",
                    ].join(" ")}
                  >
                    {b}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Category",
                param: "category" as const,
                selected: selectedCategory,
                options: categoryOptions,
              },
              {
                title: "Platform",
                param: "platform" as const,
                selected: selectedPlatform,
                options: platformOptions,
              },
              {
                title: "Risk signal",
                param: "risk" as const,
                selected: selectedRisk,
                options: riskOptions,
              },
            ].map((group) => (
              <div key={group.title}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildHref({
                      brand: selected,
                      q,
                      category:
                        group.param === "category" ? undefined : selectedCategory,
                      platform:
                        group.param === "platform" ? undefined : selectedPlatform,
                      risk: group.param === "risk" ? undefined : selectedRisk,
                    })}
                    className={[
                      "text-xs px-3 py-1.5 rounded-full border transition",
                      !group.selected
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-gray-700 bg-white/0 text-gray-300 hover:border-gray-500 hover:bg-white/5",
                    ].join(" ")}
                  >
                    All
                  </Link>
                  {group.options.map((option) => {
                    const isActive = option.label === group.selected;
                    const href = buildHref({
                      brand: selected,
                      q,
                      category:
                        group.param === "category" ? option.label : selectedCategory,
                      platform:
                        group.param === "platform" ? option.label : selectedPlatform,
                      risk: group.param === "risk" ? option.label : selectedRisk,
                    });

                    return (
                      <Link
                        key={option.label}
                        href={href}
                        className={[
                          "text-xs px-3 py-1.5 rounded-full border transition",
                          isActive
                            ? "border-red-500 bg-red-500/10 text-white"
                            : "border-gray-700 bg-white/0 text-gray-300 hover:border-gray-500 hover:bg-white/5",
                        ].join(" ")}
                      >
                        {option.label}
                        <span className="ms-1 text-gray-500">{option.count}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {showClear ? (
            <Link
              href="/insights"
              className="w-fit rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:border-red-400/50 hover:bg-red-500/15"
            >
              Clear all filters
            </Link>
          ) : null}
        </div>
      </section>

      {/* Editor’s Pick */}
      {featuredMain ? (
        <section className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-white text-2xl font-bold">Editor’s Pick</h2>
              <p className="text-gray-300 mt-1">
                Curated, high-impact ownership signals (featured + priority).
              </p>
            </div>
            <Link
              href="/insights"
              className="text-sm text-gray-200 hover:text-white transition"
            >
              View all →
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main featured */}
            <Link
              href={`/insights/${featuredMain.slug}`}
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-gradient-to-br from-transparent via-transparent to-red-500/20" />
              <div className="p-7 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2 py-1 rounded-full border border-red-500/50 bg-red-500/10 text-red-100">
                      Editor’s Pick
                    </span>

                    {featuredMain.frontmatter.brand ? (
                      <MiniPill>{featuredMain.frontmatter.brand}</MiniPill>
                    ) : null}

                    {cardPills(featuredMain).map((t) => (
                      <MiniPill key={t}>{t}</MiniPill>
                    ))}
                  </div>

                  <h3 className="text-white text-2xl md:text-3xl font-bold mt-4 leading-tight">
                    {featuredMain.frontmatter.title}
                  </h3>
                  <p className="text-gray-300 mt-3">
                    {featuredMain.frontmatter.description}
                  </p>

                  {featuredMain.meta?.excerpt ? (
                    <p className="text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3">
                      {featuredMain.meta.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>
                      {featuredMain.frontmatter.updated ?? featuredMain.frontmatter.date}
                    </span>
                    {featuredMain.meta ? (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>{featuredMain.meta.readingMinutes} min read</span>
                        <span className="text-gray-600">•</span>
                        <span>{featuredMain.meta.wordCount.toLocaleString()} words</span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-6 text-sm text-gray-200 group-hover:text-white">
                    Read →
                  </div>
                </div>

                {/* Image */}
                <div className="relative w-full md:w-[260px] shrink-0">
                  <div className="relative h-[180px] md:h-full rounded-2xl overflow-hidden border border-gray-800 bg-white/5">
                    <Image
                      src={featuredMain.frontmatter.image ?? "/opengraph-image"}
                      alt={featuredMain.frontmatter.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Side featured */}
            <div className="grid gap-6">
              {featuredSide.map((p) => (
                <Link
                  key={p.slug}
                  href={`/insights/${p.slug}`}
                  className="group rounded-3xl border border-gray-800 bg-[#111827] p-6 hover:border-red-500 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2 py-1 rounded-full border border-red-500/50 bg-red-500/10 text-red-100">
                      Editor’s Pick
                    </span>
                    {p.frontmatter.brand ? <MiniPill>{p.frontmatter.brand}</MiniPill> : null}
                    {cardPills(p).map((t) => (
                      <MiniPill key={t}>{t}</MiniPill>
                    ))}
                  </div>

                  <h4 className="text-white text-lg font-semibold mt-3 leading-snug">
                    {p.frontmatter.title}
                  </h4>
                  <p className="text-gray-300 mt-2 text-sm">
                    {p.frontmatter.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                    <span>{p.frontmatter.updated ?? p.frontmatter.date}</span>
                    {p.meta ? (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>{p.meta.readingMinutes} min</span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 text-sm text-gray-200 group-hover:text-white">
                    Read →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Start Here */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-white text-2xl font-bold">Start here</h2>
          <p className="text-gray-300 mt-1">The core sections people use most.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {startHere.map((x) => (
            <Link
              key={x.title}
              href={x.href}
              className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white text-lg font-semibold">{x.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5">
                  {x.badge}
                </span>
              </div>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed">{x.desc}</p>
              <div className="text-sm text-gray-200 mt-6 group-hover:text-white">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-white text-2xl font-bold">Browse by platform</h2>
          <p className="text-gray-300 mt-1">
            Clean platform hubs (SEO-friendly) instead of query pages.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((c) => (
            <div
              key={c.title}
              className="bg-[#111827] p-6 rounded-2xl border border-gray-800"
            >
              <div className="text-white font-semibold">{c.title}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.items.map((it) => (
                  <PillLink
                    key={it.label}
                    href={`/insights/platform/${slugifyTaxonomy(it.platform)}`}
                  >
                    {it.label}
                  </PillLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-white text-2xl font-bold">
              {showClear ? "Results" : "Latest"}
            </h2>
            <p className="text-gray-300 mt-1">
              Transparent notes: what fails, why it fails, and what to check.
            </p>
          </div>

          {showClear ? (
            <Link
              href="/insights"
              className="text-sm text-gray-200 hover:text-white transition"
            >
              Reset →
            </Link>
          ) : null}
        </div>

        {/* 12 per page, “Load more” */}
        <InsightsGridClient items={filtered satisfies InsightGridItem[]} pageSize={12} />

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-800 bg-[#111827] p-6">
            <p className="text-gray-200 font-semibold">No results found.</p>
            <p className="text-gray-400 mt-1 text-sm">
              Try another keyword or remove filters.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href="/insights"
                className="text-sm px-3 py-2 rounded-xl border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 transition"
              >
                Reset filters
              </Link>
              <Link
                href="/brands"
                className="text-sm px-3 py-2 rounded-xl border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 transition"
              >
                Browse brand hubs →
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
