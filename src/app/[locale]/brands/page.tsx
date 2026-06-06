import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insights";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const BRAND_PATH = "/brands";

const TITLE = "German Brands";
const DESCRIPTION =
  "Brand hubs for BMW, Mercedes-Benz, Audi, and Volkswagen: engineering insights, reliability analysis, and buying guidance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(BRAND_PATH) },
  openGraph: {
    type: "website",
    url: canonical(BRAND_PATH),
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
    <span className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-800 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const insights = getAllInsights(locale);
  const blogPosts = getAllBlogPosts(locale);

  const brands = [
    {
      name: "BMW",
      slug: "bmw",
      logo: "/bmw.svg",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80",
      blurb: "Engine families, cooling systems, turbo stress, and ownership-cost signals.",
      highlights: ["N/B engine families", "Cooling + leaks", "Pre-purchase checks"],
      tags: ["N47", "B47", "Oil leaks", "Cooling"],
      score: "72/100",
    },
    {
      name: "Mercedes-Benz",
      slug: "mercedes-benz",
      logo: "/mercedes.svg",
      image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1400&q=80",
      blurb: "Engines, 7G/9G behavior, electronics, and long-term cost drivers.",
      highlights: ["7G/9G patterns", "Electronics", "Diesel emissions"],
      tags: ["OM651", "W205", "9G-Tronic", "Electronics"],
      score: "70/100",
    },
    {
      name: "Audi",
      slug: "audi",
      logo: "/audi.svg",
      image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1400&q=80",
      blurb: "TDI/TSI guidance, oil consumption, timing, cooling, and gearbox behavior.",
      highlights: ["TDI/TSI risks", "Timing + oil", "DSG / S tronic"],
      tags: ["EA888", "TDI", "DSG", "Oil use"],
      score: "68/100",
    },
    {
      name: "Volkswagen",
      slug: "volkswagen",
      logo: "/volkswagen.svg",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
      blurb: "TSI/TDI + DSG deep dives, cooling weak points, sensors, and maintenance sensitivity.",
      highlights: ["DSG behavior", "Cooling weak points", "Service history"],
      tags: ["MQB", "DSG", "TSI", "TDI"],
      score: "67/100",
    },
  ];

  const withCounts = brands.map((brand) => {
    const insightCount = insights.filter(
      (p) => (p.frontmatter.brand ?? "").toLowerCase() === brand.name.toLowerCase()
    ).length;
    const blogCount = blogPosts.filter(
      (p) => (p.frontmatter.brand ?? "").toLowerCase() === brand.name.toLowerCase()
    ).length;
    return { ...brand, insightCount, blogCount };
  });

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Brands", item: canonical(BRAND_PATH) },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonical(BRAND_PATH),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/").replace(/\/$/, "") },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "German Brand Hubs",
    numberOfItems: withCounts.length,
    itemListElement: withCounts.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: canonical(`/brands/${b.slug}`),
      name: b.name,
    })),
  };

  const intents = [
    {
      title: "Compare Reliability",
      desc: "Use brand-level signal scores before going model-specific.",
      href: "/reliability-index",
      badge: "Core",
    },
    {
      title: "Prepare to Buy",
      desc: "Inspection checklists, red flags, and service-history questions.",
      href: "/buying-guides",
      badge: "Guides",
    },
    {
      title: "Read Failure Analysis",
      desc: "Symptoms to root cause to checks, written for ownership decisions.",
      href: "/insights",
      badge: "Insights",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
          <div className="relative min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
              alt="German automotive brand hubs"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-[#0B1220]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

            <div className="relative p-8 md:p-12 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Pill>Brand hubs</Pill>
                <Pill>Reliability</Pill>
                <Pill>Buying checks</Pill>
                <Pill>Diagnostics</Pill>
              </div>

              <p className="text-gray-300/80 text-sm">Brands</p>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 mb-3">
                German Brand Hubs
              </h1>
              <p className="text-gray-200/90 leading-relaxed">
                Choose a brand, then drill into reliability signals, known weak points,
                buying checks, and the latest engineering explainers.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  href="/search"
                  className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Search by Brand
                </Link>
                <Link
                  href="/reliability-index"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Reliability Index
                </Link>
                <Link
                  href="/buying-guides"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Buying Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {intents.map((x) => (
            <Link
              key={x.title}
              href={x.href}
              className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-white text-lg font-semibold">{x.title}</h2>
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
            <h2 className="text-white text-2xl font-bold">Choose a brand</h2>
            <p className="text-gray-300 mt-1">
              Each hub now includes photos, signal scoring, inspection focus, and latest related content.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {withCounts.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group overflow-hidden bg-[#111827] rounded-3xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="relative h-56 border-b border-gray-800 bg-white/5">
                <Image
                  src={brand.image}
                  alt={`${brand.name} brand hub`}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover opacity-85 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-transparent" />
                <div className="absolute left-5 bottom-5 flex items-center gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      width={48}
                      height={48}
                      className="h-11 w-11 object-contain invert"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-300">Reliability signal</div>
                    <div className="text-white font-semibold">{brand.score}</div>
                  </div>
                </div>
              </div>

              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5">
                      Brand Hub
                    </span>
                    <h3 className="text-white text-2xl font-semibold mt-3">{brand.name}</h3>
                  </div>
                  <span className="text-gray-300 text-lg group-hover:text-red-300 transition">
                    -&gt;
                  </span>
                </div>

                <p className="text-gray-300 mt-3">{brand.blurb}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-gray-400">Insights</div>
                    <div className="text-white font-semibold mt-1">{brand.insightCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-gray-400">Blog notes</div>
                    <div className="text-white font-semibold mt-1">{brand.blogCount}</div>
                  </div>
                </div>

                <ul className="mt-5 space-y-1 text-sm text-gray-300">
                  {brand.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/70" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-5">
                  {brand.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
