import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insights";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/reliability-index";

const TITLE = "Reliability Index";
const DESCRIPTION =
  "Engineering-based reliability scoring: signal-driven rankings and ownership-risk drivers for BMW, Mercedes-Benz, Audi, and Volkswagen.";

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
    <span className="inline-flex text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded-full bg-white/10 border border-gray-800 overflow-hidden">
      <div className="h-full rounded-full bg-red-500/85" style={{ width: `${v}%` }} />
    </div>
  );
}

function scoreLabel(score: number) {
  if (score >= 78) return { label: "Low risk", hint: "Strong if maintained" };
  if (score >= 70) return { label: "Moderate risk", hint: "Watch known weak points" };
  if (score >= 62) return { label: "Higher risk", hint: "History matters a lot" };
  return { label: "High risk", hint: "Buy only with proof and budget" };
}

function brandHref(brand: string) {
  if (brand === "BMW") return "/brands/bmw";
  if (brand === "Mercedes-Benz") return "/brands/mercedes-benz";
  if (brand === "Audi") return "/brands/audi";
  return "/brands/volkswagen";
}

function brandLogo(brand: string) {
  if (brand === "BMW") return "/bmw.svg";
  if (brand === "Mercedes-Benz") return "/mercedes.svg";
  if (brand === "Audi") return "/audi.svg";
  return "/volkswagen.svg";
}

function brandImage(brand: string) {
  if (brand === "BMW")
    return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";
  if (brand === "Mercedes-Benz")
    return "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1200&q=80";
  if (brand === "Audi")
    return "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=80";
  return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80";
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

export default function ReliabilityIndexPage() {
  const leaderboard = [
    {
      brand: "BMW",
      score: 72,
      note: "Strong engines when maintained; cooling plastics and oil leaks are the usual cost drivers.",
      strengths: ["Excellent driving platforms", "Many durable engines with correct intervals"],
      watch: ["Cooling system plastics", "Oil filter housing / valve cover leaks", "Timing risk on specific engines"],
      bestFor: "Owners who maintain on time and want a strong driving platform.",
    },
    {
      brand: "Mercedes-Benz",
      score: 70,
      note: "Drivetrains are solid; reliability varies most by electronics era and maintenance history.",
      strengths: ["Comfort-focused durability", "Many strong drivetrain combinations"],
      watch: ["Electronics by generation", "Diesel emissions/injector faults", "Suspension cost on some models"],
      bestFor: "Daily comfort with predictable upkeep when history is clean.",
    },
    {
      brand: "Audi",
      score: 68,
      note: "Platform-dependent; timing/oil behavior and gearbox history are the big differentiators.",
      strengths: ["Strong highway cars", "Good platforms when serviced correctly"],
      watch: ["Timing/oil consumption by engine", "DSG / S tronic history", "Cooling and carbon buildup"],
      bestFor: "Buyers who verify the exact engine and gearbox combination.",
    },
    {
      brand: "Volkswagen",
      score: 67,
      note: "Great value; DSG and service history sensitivity are the main risk multipliers.",
      strengths: ["Parts availability", "Strong value when serviced properly"],
      watch: ["DSG service intervals", "Cooling and sensor aging", "Neglected maintenance"],
      bestFor: "Budget-focused buyers who insist on proof and preventive service.",
    },
  ];

  const signals = [
    {
      title: "Cooling system weak points",
      desc: "Plastics, pumps, housings, pressure control, and heat management. Failures here can escalate quickly.",
      weight: 22,
      query: "cooling",
      image:
        "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Oil leaks and gasket aging",
      desc: "Valve cover, oil filter housing, rear main area, turbo oil lines, and leak location severity.",
      weight: 18,
      query: "oil leak",
      image:
        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Timing risk",
      desc: "Chain, belt, tensioner, guide wear, oil interval history, and cold-start symptom evidence.",
      weight: 18,
      query: "timing chain",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Gearbox behavior",
      desc: "Automatic and DSG/S tronic service intervals, low-speed behavior, mechatronics, and stored faults.",
      weight: 16,
      query: "DSG",
      image:
        "https://images.unsplash.com/photo-1597766353939-e696c052898f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Electronics and sensors",
      desc: "Intermittent faults, modules, voltage history, sensor plausibility, and diagnostic complexity.",
      weight: 14,
      query: "sensor",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Service history sensitivity",
      desc: "The most practical risk multiplier: proof of oil, fluids, filters, gearbox service, and preventive work.",
      weight: 12,
      query: "service history",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const relatedInsights = getAllInsights()
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
        haystack.includes("reliability") ||
        haystack.includes("timing") ||
        haystack.includes("cooling") ||
        haystack.includes("dsg") ||
        haystack.includes("diesel")
      );
    })
    .slice(0, 4);

  const relatedBlog = getAllBlogPosts()
    .filter((p) => {
      const haystack = [p.frontmatter.title, p.frontmatter.description, p.frontmatter.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes("ownership") || haystack.includes("buying");
    })
    .slice(0, 3);

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Reliability Index", item: canonical(PATH) },
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
    name: "Reliability Index Leaderboard",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: leaderboard.length,
    itemListElement: leaderboard.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.brand,
      url: canonical(brandHref(b.brand)),
    })),
  };

  const modelRequests = [
    { label: "BMW F30 320d", q: "BMW F30 320d reliability" },
    { label: "BMW G20 330i", q: "BMW G20 330i reliability" },
    { label: "C-Class W205", q: "Mercedes W205 reliability" },
    { label: "E-Class W213", q: "Mercedes W213 reliability" },
    { label: "Audi A4 B9", q: "Audi A4 B9 reliability" },
    { label: "Audi A3 8V", q: "Audi A3 8V reliability" },
    { label: "Golf 7", q: "Volkswagen Golf 7 reliability" },
    { label: "Passat B8", q: "Volkswagen Passat B8 reliability" },
  ];

  const mailtoHref =
    "mailto:contact@ttautosengineering.com" +
    "?subject=" +
    encodeURIComponent("Reliability Index request - model page") +
    "&body=" +
    encodeURIComponent(
      `Hi TT AUTO'S Engineering,\n\nPlease add a model reliability page for:\n- Model:\n- Year / engine:\n- Gearbox:\n- Mileage range:\n- Market (EU/US):\n\nWhat should I watch and what fails first?\n\nThanks.`
    );

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, collectionPageJsonLd, itemListJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reliability Index" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
          <div className="relative min-h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1800&q=80"
              alt="Reliability scoring for German cars"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/82 to-[#0B1220]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

            <div className="relative p-8 md:p-12 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Pill>Signal-driven</Pill>
                <Pill>Transparent weights</Pill>
                <Pill>Ownership risk</Pill>
                <Pill>BMW / Mercedes / Audi / VW</Pill>
              </div>

              <p className="text-gray-300/80 text-sm">Reliability Index</p>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
                Reliability, scored like a buying decision
              </h1>
              <p className="text-gray-200/90 mt-4 leading-relaxed">
                An engineering-first scoring system based on repeatable repair predictors:
                cooling, oil leaks, timing risk, gearbox behavior, electronics, and
                service-history sensitivity.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  href="/search?q=reliability"
                  className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Search Reliability Topics
                </Link>
                <Link
                  href="/brands"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Browse Brand Hubs
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

      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { k: "78-100", v: "Lower predicted repair risk", hint: "Strong if maintenance is proven." },
            { k: "70-77", v: "Moderate risk", hint: "Good candidates, but weak points matter." },
            { k: "69 or less", v: "History-sensitive", hint: "Buy only with proof and budget." },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
              <div className="text-xs text-gray-400">Score band</div>
              <div className="text-white text-2xl font-bold mt-1">{x.k}</div>
              <div className="text-gray-100 font-semibold mt-3">{x.v}</div>
              <p className="text-gray-300 text-sm mt-1">{x.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white text-2xl font-bold">Leaderboard</h2>
            <p className="text-gray-300 mt-1">
              Higher score means lower predicted repair risk assuming proper maintenance.
            </p>
          </div>
          <Link href="/brands" className="text-sm text-gray-200 hover:text-white">
            Explore brands -&gt;
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {leaderboard.map((b) => {
            const s = scoreLabel(b.score);
            return (
              <div
                key={b.brand}
                className="overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]"
              >
                <div className="relative h-44 border-b border-gray-800 bg-white/5">
                  <Image
                    src={brandImage(b.brand)}
                    alt={`${b.brand} reliability profile`}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-transparent" />
                  <div className="absolute left-5 bottom-5 flex items-center gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
                      <Image
                        src={brandLogo(b.brand)}
                        alt={`${b.brand} logo`}
                        width={48}
                        height={48}
                        className="h-10 w-10 object-contain invert"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Score</div>
                      <div className="text-white text-2xl font-bold">{b.score}/100</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold text-white">{b.brand}</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
                        {s.label} <span className="text-gray-500">/</span>{" "}
                        <span className="text-gray-300">{s.hint}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <ProgressBar value={b.score} />
                  </div>

                  <p className="text-gray-300 mt-4 text-sm leading-relaxed">{b.note}</p>

                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">Strengths</div>
                      <ul className="mt-2 space-y-2 text-sm text-gray-300">
                        {b.strengths.map((x) => (
                          <li key={x} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Watch-outs</div>
                      <ul className="mt-2 space-y-2 text-sm text-gray-300">
                        {b.watch.map((x) => (
                          <li key={x} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500/70 shrink-0" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-gray-400">Best for</div>
                    <p className="text-sm text-gray-100 mt-1">{b.bestFor}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={brandHref(b.brand)}
                      className="text-sm px-3 py-2 rounded-xl border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 transition"
                    >
                      Open hub -&gt;
                    </Link>
                    <Link
                      href={`/insights?brand=${encodeURIComponent(b.brand)}`}
                      className="text-sm px-3 py-2 rounded-xl border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 transition"
                    >
                      Read insights -&gt;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <h2 className="text-white text-2xl font-bold">Methodology</h2>
            <p className="text-gray-300 mt-3 leading-relaxed">
              The index is not a badge ranking. It is a buying-risk model: what tends
              to fail, how expensive it is to verify, and how much maintenance history
              changes the outcome.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["Failure frequency", "How often the pattern appears across real ownership."],
                ["Repair exposure", "How quickly a small symptom becomes a large invoice."],
                ["Inspection clarity", "How easily the risk can be checked before buying."],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <p className="text-sm text-gray-300 mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5">
              <h2 className="text-white text-2xl font-bold">Core signal weights</h2>
              <p className="text-gray-300 mt-1">
                The repeat patterns we track across German platforms.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {signals.map((s) => (
                <Link
                  key={s.title}
                  href={`/search?q=${encodeURIComponent(s.query)}`}
                  className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] hover:border-red-500 hover:bg-white/5 transition"
                >
                  <div className="relative h-36 border-b border-gray-800 bg-white/5">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover opacity-85 transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-white text-lg font-semibold">{s.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-200 bg-white/5">
                        {s.weight}%
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm leading-relaxed">{s.desc}</p>
                    <div className="mt-4">
                      <ProgressBar value={s.weight * 4} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(relatedInsights.length > 0 || relatedBlog.length > 0) && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold">Related reliability reading</h2>
            <p className="text-gray-300 mt-1">
              Use these before comparing models or inspecting a car.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              {relatedInsights.map((p) => (
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
              {relatedBlog.map((p) => (
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

      <section id="request" className="mt-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]">
          <div className="relative min-h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80"
              alt="Diagnostic scan and reliability analysis"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/35" />

            <div className="relative p-8 md:p-10 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
              <div>
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Next step: model-level scoring
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
                  Want a model reliability page next?
                </h2>
                <p className="text-gray-200/90 mt-3 max-w-3xl leading-relaxed">
                  We will expand the index into model-level pages with engine, gearbox,
                  mileage range, known failure points, and buying checks.
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
                    href="/buying-guides"
                    className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
                  >
                    Buying guides
                  </Link>
                  <Link
                    href="/brands"
                    className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
                  >
                    Brand hubs
                  </Link>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
                <h3 className="text-white font-semibold text-lg">How to use this index</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-200/90">
                  {[
                    "Compare risk bands first, then choose a brand hub.",
                    "Use signal weights to know what to inspect before buying.",
                    "Treat missing service history as a risk multiplier.",
                    "Read related insights before viewing a car.",
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
