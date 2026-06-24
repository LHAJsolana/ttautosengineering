import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insights";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedSeoLandingPages } from "@/lib/seoLandingPages";
import { canonical, localizedPageMetadata } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/buying-guides";

const TITLE = "Buying Guides";
const DESCRIPTION =
  "Inspection checklists, red flags, and model-by-model guidance for buying used German cars (BMW, Mercedes-Benz, Audi, Volkswagen).";

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
    <span className="inline-flex text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

function ImageCard({
  title,
  desc,
  href,
  image,
  badge,
}: {
  title: string;
  desc: string;
  href: string;
  image: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] hover:border-red-500 hover:bg-white/5 transition"
    >
      <div className="relative h-44 border-b border-gray-800 bg-white/5">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white text-xl font-semibold leading-snug">{title}</h3>
          {badge ? (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5 shrink-0">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-gray-300 mt-3 text-sm leading-relaxed">{desc}</p>
        <div className="text-sm text-gray-200 mt-6 group-hover:text-white">Open -&gt;</div>
      </div>
    </Link>
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
      <div className="relative h-40 border-b border-gray-800 bg-white/5">
        <Image
          src={image ?? "/opengraph-image"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-semibold leading-snug">{title}</h3>
          {badge ? (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5 shrink-0">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-gray-300 mt-2 text-sm leading-relaxed">{description}</p>
        {date ? <p className="text-gray-400 text-xs mt-4">{date}</p> : null}
      </div>
    </Link>
  );
}

export default async function BuyingGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const localizedInsights = new Map(
    getAllInsights(locale).map((post) => [post.slug, post])
  );
  const localizedBlogPosts = new Map(
    getAllBlogPosts(locale).map((post) => [post.slug, post])
  );
  const researchPages = getLocalizedSeoLandingPages(locale);

  const insights = getAllInsights()
    .filter((p) => {
      const haystack = [
        p.frontmatter.title,
        p.frontmatter.description,
        p.frontmatter.category,
        p.frontmatter.platform,
        ...(p.frontmatter.risk ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        haystack.includes("buying") ||
        haystack.includes("check") ||
        haystack.includes("service") ||
        haystack.includes("dsg") ||
        haystack.includes("diesel")
      );
    })
    .slice(0, 4)
    .map((post) => localizedInsights.get(post.slug) ?? post);

  const blogPosts = getAllBlogPosts()
    .filter((p) => {
      const haystack = [
        p.frontmatter.title,
        p.frontmatter.description,
        p.frontmatter.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes("buying") || haystack.includes("ownership");
    })
    .slice(0, 3)
    .map((post) => localizedBlogPosts.get(post.slug) ?? post);

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: canonical(PATH) },
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

  const guidePaths = [
    {
      title: "Universal Used-Car Checklist",
      desc: "Documents, service proof, cold start, leaks, tires, brakes, scan results, and test-drive behavior.",
      href: "/search?q=checklist",
      badge: "Start",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Engine Risk Signals",
      desc: "Timing risk, oil consumption, turbo stress, cooling health, emissions faults, and bad maintenance patterns.",
      href: "/reliability-index",
      badge: "Signals",
      image:
        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Diagnostic Scan Before Buying",
      desc: "Stored faults, cleared codes, gearbox warnings, emissions readiness, sensor patterns, and battery health.",
      href: "/blog/why-a-pre-purchase-scan-is-worth-it",
      badge: "Scan",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const checklistBlocks = [
    {
      title: "1. Before you visit",
      items: [
        "Ask for VIN, engine code, gearbox type, and full service proof.",
        "Request a cold-start video with idle audio.",
        "Confirm oil, coolant, brake, and gearbox service history.",
        "Check common failure points for that engine family.",
      ],
    },
    {
      title: "2. On-site inspection",
      items: [
        "Look for coolant residue, oil leaks, uneven tire wear, and cheap repairs.",
        "Scan every module before and after the test drive.",
        "Drive cold and warm: low-speed, highway pull, braking, and reverse.",
        "Check paperwork matches mileage, ownership, and maintenance claims.",
      ],
    },
    {
      title: "3. Decision rules",
      items: [
        "No proof means the price must include catch-up maintenance.",
        "One major red flag beats ten cosmetic positives.",
        "A clean scan supports the deal; it does not replace inspection.",
        "Budget first for fluids, leaks, tires, brakes, and cooling health.",
      ],
    },
  ];

  const brands = [
    {
      name: "BMW",
      href: "/brands/bmw",
      logo: "/bmw.svg",
      note: "Cooling, oil leaks, engine-family timing risk, and service history.",
    },
    {
      name: "Mercedes-Benz",
      href: "/brands/mercedes-benz",
      logo: "/mercedes.svg",
      note: "Electronics, diesel emissions, 7G/9G behavior, and suspension cost.",
    },
    {
      name: "Audi",
      href: "/brands/audi",
      logo: "/audi.svg",
      note: "EA888 timing/oil behavior, cooling, TDI risk, and DSG/S tronic history.",
    },
    {
      name: "Volkswagen",
      href: "/brands/volkswagen",
      logo: "/volkswagen.svg",
      note: "DSG service, MQB cooling issues, sensors, TSI/TDI maintenance sensitivity.",
    },
  ];

  const modelRequests = [
    { label: "BMW F30 320d", q: "BMW F30 320d buying checklist" },
    { label: "BMW G20 330i", q: "BMW G20 330i pre purchase inspection" },
    { label: "C-Class W205", q: "Mercedes W205 buying checklist" },
    { label: "E-Class W213", q: "Mercedes W213 reliability buying guide" },
    { label: "Audi A4 B9", q: "Audi A4 B9 buying checklist" },
    { label: "Audi A3 8V", q: "Audi A3 8V used buying guide" },
    { label: "Golf 7", q: "Volkswagen Golf 7 buying checklist" },
    { label: "Passat B8", q: "Volkswagen Passat B8 reliability buying" },
  ];

  const mailtoHref =
    "mailto:contact@ttautosengineering.com" +
    "?subject=" +
    encodeURIComponent("Model checklist request - TT AUTO'S Engineering") +
    "&body=" +
    encodeURIComponent(
      `Hi TT AUTO'S Engineering,\n\nI want a buying checklist for this model:\n- Model:\n- Year / engine:\n- Mileage range:\n- Country/market:\n\nWhat should I check before buying?\n\nThanks.`
    );

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Buying Guides" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
          <div className="relative min-h-[430px]">
            <Image
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=80"
              alt="Used car inspection and buying guide"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-[#0B1220]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

            <div className="relative p-8 md:p-12 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Pill>Inspection checklists</Pill>
                <Pill>Red flags</Pill>
                <Pill>Service proof</Pill>
                <Pill>BMW / Mercedes / Audi / VW</Pill>
              </div>

              <p className="text-gray-300/80 text-sm">Buying Guides</p>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
                Buy the car, not the story
              </h1>
              <p className="text-gray-200/90 mt-4 leading-relaxed">
                Practical used-car buying guides built around evidence: service history,
                fault scans, cold-start behavior, leaks, gearbox health, and the repairs
                that change the real price of ownership.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  href="/buying-checklist"
                  className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Open Risk Checker
                </Link>
                <Link
                  href="/brands"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Browse Brand Hubs
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
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Start here</h2>
          <p className="text-gray-300 mt-1">
            Three routes into a safer buying decision: checklist, risk signals, and diagnostic proof.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {guidePaths.map((guide) => (
            <ImageCard key={guide.title} {...guide} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">High-intent buyer research</h2>
          <p className="text-gray-300 mt-1">
            Fast pages for the common searches buyers make before viewing a car.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {researchPages.map((page) => (
            <Link
              key={page.slug}
              href={`/research/${page.slug}`}
              className="group rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-red-500 hover:bg-white/[0.06]"
            >
              <div className="text-xs font-semibold text-red-300">{page.brand}</div>
              <h3 className="mt-2 font-bold leading-snug text-white">{page.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">{page.intro}</p>
              <div className="mt-5 text-sm font-semibold text-gray-300 group-hover:text-white">
                Open research -&gt;
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <h2 className="text-white text-2xl font-bold">The buying logic</h2>
            <p className="text-gray-300 mt-3 leading-relaxed">
              A used German car is rarely expensive because it is German. It becomes
              expensive when previous maintenance, diagnostics, and known weak points are
              ignored before purchase.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                ["Proof", "Invoices, dates, mileage, fluids, parts, and previous diagnostics."],
                ["Behavior", "Cold start, idle, smoke, shift quality, braking, vibration, and temperature."],
                ["Risk price", "What the car costs after overdue maintenance is added back in."],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <p className="text-sm text-gray-300 mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {checklistBlocks.map((block) => (
              <div
                key={block.title}
                className="bg-[#111827] p-6 rounded-2xl border border-gray-800"
              >
                <h3 className="text-white font-semibold text-lg">{block.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500/70 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white text-2xl font-bold">Brand shortcuts</h2>
            <p className="text-gray-300 mt-1">
              Jump into the brand hub before inspecting a specific model.
            </p>
          </div>
          <Link href="/brands" className="text-sm text-gray-200 hover:text-white">
            All brands -&gt;
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shrink-0">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain invert"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white text-xl font-semibold">{brand.name}</h3>
                    <span className="text-gray-400 group-hover:text-red-300 transition">
                      -&gt;
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2 text-sm leading-relaxed">{brand.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>Inspection focus</Pill>
                    <Pill>Weak points</Pill>
                    <Pill>Cost drivers</Pill>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {(insights.length > 0 || blogPosts.length > 0) && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold">Related reading</h2>
            <p className="text-gray-300 mt-1">
              Articles that help before viewing, scanning, or negotiating a car.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((p) => (
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
            </div>

            <div className="grid gap-6">
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
          </div>
        </section>
      )}

      <LeadCaptureCTA source="buying-guides" className="mt-12" />

      <section id="request" className="mt-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]">
          <div className="relative min-h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80"
              alt="Pre-purchase diagnostic scan"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/35" />

            <div className="relative p-8 md:p-10 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
              <div>
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Next: model-specific checklists
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
                  Want a checklist for a specific model?
                </h2>
                <p className="text-gray-200/90 mt-3 max-w-3xl leading-relaxed">
                  Send the model, year, engine, gearbox, mileage range, and market.
                  We will prioritize a practical guide with inspection steps, common
                  failure points, and negotiation logic.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {modelRequests.map((m) => (
                    <Link
                      key={m.label}
                      href={`/search?q=${encodeURIComponent(m.q)}`}
                      className="text-xs md:text-sm px-3 py-2 rounded-full border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10 hover:border-white/20 transition"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={mailtoHref}
                    className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Request a model
                  </a>
                  <Link
                    href="/brands"
                    className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
                  >
                    Browse brands
                  </Link>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
                <h3 className="text-white font-semibold text-lg">Checklist output</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-200/90">
                  {[
                    "Cold-start and test-drive inspection steps.",
                    "Known failures, symptoms, and root-cause clues.",
                    "Deal-breaker vs negotiable issue guidance.",
                    "Maintenance catch-up budget and ownership cost signals.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500/80 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
