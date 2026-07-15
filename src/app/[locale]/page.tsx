import type { ReactNode } from "react";
import Image from "next/image";
import { brands as brandRegistry } from "@/lib/brands";
import Link from "@/components/LocalizedLink";
import { getAllBlogPosts } from "@/lib/blog";
import { getLocalizedDirectComparisons } from "@/lib/comparisons";
import { getAllInsights } from "@/lib/insights";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedModelPages } from "@/lib/models";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import CarVerticalBanner from "@/components/carvertical/CarVerticalBanner";

type Feature = {
  title: string;
  description: string;
  href: string;
  label: string;
};

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-100">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-sm font-semibold text-red-300">{eyebrow}</p> : null}
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 leading-relaxed text-gray-400">{description}</p>
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="inline-flex w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 transition hover:bg-white/10"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={feature.href}
      className="group rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-red-500 hover:bg-[#131f33]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold leading-snug text-white">{feature.title}</h3>
        <span className="shrink-0 rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-300">
          {feature.label}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">{feature.description}</p>
      <div className="mt-6 text-sm font-semibold text-gray-200 group-hover:text-white">
        Open section -&gt;
      </div>
    </Link>
  );
}

function ScoreRow({ label, score, note }: { label: string; score: number; note: string }) {
  const value = Math.max(1, Math.min(10, score));
  return (
    <div className="rounded-2xl border border-gray-800 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{label}</div>
          <div className="mt-1 text-xs text-gray-400">{note}</div>
        </div>
        <div className="shrink-0 text-sm font-bold tabular-nums text-white">{value}/10</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-red-500" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function TopicCard({
  title,
  description,
  href,
  meta,
}: {
  title: string;
  description: string;
  href: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-800 bg-white/[0.035] p-5 transition hover:border-red-500 hover:bg-white/[0.06]"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
        {meta}
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-400">{description}</p>
      <div className="mt-5 text-sm font-semibold text-gray-200 group-hover:text-white">
        Read more -&gt;
      </div>
    </Link>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const allInsights = getAllInsights(locale);
  const allBlogPosts = getAllBlogPosts(locale);
  const directComparisons = getLocalizedDirectComparisons(locale);
  const modelGuides = getLocalizedModelPages(locale);
  const latestInsights = allInsights.slice(0, 4);
  const latestBlog = allBlogPosts.slice(0, 3);
  const featuredInsight = allInsights.find((post) => post.frontmatter.featured) ?? allInsights[0];
  const technicalTopics = allInsights
    .filter((post) =>
      ["Transmission", "Engine Systems", "Diesel Emissions", "Drivetrain", "Diagnosis"].includes(
        post.frontmatter.category ?? ""
      )
    )
    .slice(0, 4);

  const features: Feature[] = [
    {
      title: "Used German Car Buying Hub",
      description:
        "Start with one complete buyer workflow: history, fault codes, reliability, maintenance costs, model risk, and inspection priorities.",
      href: "/buying-hub",
      label: "Start",
    },
    {
      title: "Risk Checker",
      description:
        "Score a used German car before buying with service, scan, cold-start, leak, gearbox, and seller signals.",
      href: "/buying-checklist",
      label: "Tool",
    },
    {
      title: "Search Library",
      description:
        "Find topics by symptom, engine, gearbox, brand, platform, or fault pattern across the whole site.",
      href: "/search",
      label: "Find",
    },
    {
      title: "Reliability Index",
      description:
        "Compare ownership risk by platform, engine, service sensitivity, and known failure patterns.",
      href: "/reliability-index",
      label: "Core",
    },
    {
      title: "Buying Guides",
      description: "Use structured inspection notes before committing to a German car purchase.",
      href: "/buying-guides",
      label: "Buyer",
    },
    {
      title: "Parts & Failure Map",
      description:
        "Inspect weak systems such as timing chains, DSG mechatronics, EGR, DPF, AdBlue, cooling, and turbo control.",
      href: "/parts-failure-map",
      label: "New",
    },
    {
      title: "Direct Comparisons",
      description:
        "Compare engines and models buyers actually cross-shop, including B47 vs B48 and Golf vs A3.",
      href: "/compare",
      label: "Compare",
    },
    {
      title: "Engineering Insights",
      description:
        "Understand the mechanism behind common symptoms instead of guessing from opinions.",
      href: "/insights",
      label: "Deep dive",
    },
    {
      title: "Brand Hubs",
      description:
        "Move quickly through BMW, Mercedes-Benz, Audi, and Volkswagen reliability topics.",
      href: "/brands",
      label: "Brands",
    },
    {
      title: "How We Evaluate Cars",
      description:
        "See the trust method behind diagnostics, service-history review, failure patterns, fault codes, and buyer red flags.",
      href: "/how-we-evaluate-used-cars",
      label: "Trust",
    },
    {
      title: "Model Guides",
      description:
        "Start with BMW 3 Series, Mercedes C-Class, Audi A4, and Volkswagen Golf buying pages.",
      href: "/models",
      label: "Models",
    },
    {
      title: "Engine & Gearbox Library",
      description:
        "Identify exact powertrains, known failure patterns, service priorities, and pre-purchase checks.",
      href: "/powertrains",
      label: "Database",
    },
  ];

  const brands = brandRegistry.map((brand) => ({
    name: brand.name,
    href: `/brands/${brand.slug}`,
    detail: brand.blurb,
  }));

  const reliabilitySignals = [
    { label: "VW 1.9 TDI legacy engines", score: 9, note: "Strong when maintained" },
    { label: "BMW N52 naturally aspirated six", score: 8, note: "Known issues, solid base" },
    { label: "Mercedes OM651 with records", score: 7, note: "History matters heavily" },
    { label: "DSG mechatronics risk", score: 4, note: "Service proof is critical" },
  ];

  return (
    <main className="min-h-screen bg-[#0B1220] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80"
            alt="German performance car detail"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/86 to-[#0B1220]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <Pill>German cars</Pill>
              <Pill>Reliability analysis</Pill>
              <Pill>Buying guidance</Pill>
              <Pill>Engineering-first</Pill>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
              Check used German car risks before buying.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
              Research reliability risks, fault codes, known failure patterns,
              ownership costs, and buying red flags for used BMW, Mercedes-Benz,
              Audi, and Volkswagen models.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Check a car", "/buying-hub", "Start the complete buyer workflow"],
                ["Search a fault code", "/fault-codes", "Decode common OBD issues"],
                ["Compare models", "/compare", "Cross-shop real used-car choices"],
              ].map(([label, href, note]) => (
                <Link
                  key={label}
                  href={href}
                  className="group rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:border-red-400 hover:bg-white/15"
                >
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="mt-2 text-xs leading-5 text-gray-300">{note}</div>
                  <div className="mt-4 text-xs font-semibold text-gray-200 group-hover:text-white">
                    Open -&gt;
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${allBlogPosts.length}+`, "blog articles"],
              [`${allInsights.length}`, "technical insights"],
              [`${directComparisons.length}`, "direct comparisons"],
              [`${modelGuides.length}`, "model guides"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-white/15 bg-white/[0.04] px-5 py-4">
                <div className="text-3xl font-extrabold text-white">{value}</div>
                <div className="mt-1 text-sm text-gray-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarVerticalBanner locale={locale} />

      <section className="mx-auto max-w-6xl px-6 pt-12">
        <div className="grid gap-6 rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-950/45 via-[#111827] to-[#0B1220] p-7 shadow-2xl shadow-red-950/10 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-sm font-semibold text-red-200">Buyer shortcut</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              Check the car before the seller sells you the story.
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
              Start with one clean buyer workflow: model risk, vehicle history, diagnostic
              scan results, maintenance costs, seller signals, and final inspection before
              you commit to a BMW, Mercedes-Benz, Audi, or Volkswagen.
            </p>
          </div>
          <Link
            href="/buying-hub"
            className="inline-flex w-fit rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Open the buying hub -&gt;
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <LeadCaptureCTA source="homepage" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Start here"
          title="Choose the fastest route to a smarter ownership decision"
          description="The homepage now acts like a control room: quick routes for research, model comparison, reliability concerns, and practical buying decisions."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <SectionHeading
          eyebrow="Compare"
          title="Direct used-buy comparisons"
          description="Short, practical matchups for the choices buyers actually make: engine versus engine, model versus model, and cross-brand diesel decisions."
          href="/compare"
          linkLabel="Open comparison tool -&gt;"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {directComparisons.slice(0, 6).map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="group rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-red-500 hover:bg-[#131f33]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                    {comparison.kind}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-white">
                    {comparison.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-300">
                  {comparison.leftScore} / {comparison.rightScore}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {comparison.description}
              </p>
              <div className="mt-5 text-sm font-semibold text-gray-200 group-hover:text-white">
                Compare now -&gt;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredInsight ? (
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[340px] bg-white/5">
              <Image
                src={featuredInsight.frontmatter.image ?? "/opengraph-image"}
                alt={featuredInsight.frontmatter.title}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 via-transparent to-transparent" />
            </div>
            <div className="p-7 md:p-10">
              <p className="text-sm font-semibold text-red-300">Featured technical insight</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
                {featuredInsight.frontmatter.title}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-300">
                {featuredInsight.frontmatter.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  featuredInsight.frontmatter.brand,
                  featuredInsight.frontmatter.category,
                  featuredInsight.frontmatter.platform,
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
              </div>
              <Link
                href={`/insights/${featuredInsight.slug}`}
                className="mt-8 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Read featured insight
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
          <SectionHeading
            eyebrow="Latest"
            title="Newest engineering insights"
            description="Recent technical explainers and reliability breakdowns from the insights library."
            href="/insights"
            linkLabel="All insights -&gt;"
          />

          <div className="grid gap-4">
            {latestInsights.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group grid gap-4 rounded-2xl border border-gray-800 bg-white/[0.03] p-4 transition hover:border-red-500 sm:grid-cols-[150px_1fr]"
              >
                <div className="relative min-h-32 overflow-hidden rounded-xl bg-white/5">
                  <Image
                    src={post.frontmatter.image ?? "/opengraph-image"}
                    alt={post.frontmatter.title}
                    fill
                    sizes="150px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    {post.frontmatter.brand ? <span>{post.frontmatter.brand}</span> : null}
                    {post.frontmatter.category ? <span>{post.frontmatter.category}</span> : null}
                  </div>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-white">
                    {post.frontmatter.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {post.frontmatter.description}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-gray-200">
                    Read insight -&gt;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
          <SectionHeading
            eyebrow="Reliability"
            title="Signal board"
            description="A quick visual summary of the type of scoring readers can explore in the full reliability index."
            href="/reliability-index"
            linkLabel="Open index -&gt;"
          />
          <div className="grid gap-3">
            {reliabilitySignals.map((item) => (
              <ScoreRow key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Diagnostic library"
          title="Technical topics now covered"
          description="The insights library now goes beyond model opinions into the systems that actually create ownership cost: gearboxes, emissions hardware, boost control, oil control, AWD service, and misfires."
          href="/insights"
          linkLabel="Explore technical insights -&gt;"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {technicalTopics.map((post) => (
            <TopicCard
              key={post.slug}
              title={post.frontmatter.title}
              description={post.frontmatter.description}
              href={`/insights/${post.slug}`}
              meta={post.frontmatter.category ?? post.frontmatter.brand ?? "Insight"}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Blog"
          title="Practical ownership notes"
          description="Shorter articles for buyers and owners who need useful judgment without a full technical teardown."
          href="/blog"
          linkLabel="All blog posts -&gt;"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {latestBlog.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] transition hover:border-red-500"
            >
              <div className="relative h-48 bg-white/5">
                <Image
                  src={post.frontmatter.image ?? "/opengraph-image"}
                  alt={post.frontmatter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 to-transparent" />
              </div>
              <div className="p-6">
                <div className="text-xs text-gray-400">
                  {post.frontmatter.category ?? "Ownership"} - {post.meta.readingMinutes} min read
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white">
                  {post.frontmatter.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {post.frontmatter.description}
                </p>
                <div className="mt-6 text-sm font-semibold text-gray-200">
                  Read post -&gt;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Brand hubs"
          title="Research by manufacturer"
          description="Each hub gathers common weaknesses, useful model notes, and the next pages to read before buying."
          href="/brands"
          linkLabel="Browse all brands -&gt;"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-red-500 hover:bg-[#131f33]"
            >
              <h3 className="text-2xl font-extrabold text-white">{brand.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{brand.detail}</p>
              <div className="mt-6 text-sm font-semibold text-gray-200 group-hover:text-white">
                Open hub -&gt;
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <div className="grid gap-6 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-sm font-semibold text-red-300">Need a specific model?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Send a topic request
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">
              Ask for a model, engine, gearbox, buying guide, or reliability issue and it can
              be added to the publishing queue.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Contact TT AUTO&apos;S
          </Link>
        </div>
      </section>
    </main>
  );
}
