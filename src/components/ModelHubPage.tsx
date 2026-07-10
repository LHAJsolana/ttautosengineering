import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import RelatedResearch from "@/components/RelatedResearch";
import CarVerticalInline from "@/components/carvertical/CarVerticalInline";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insights";
import type { Locale } from "@/lib/i18n";
import {
  getBestUsedBuyScores,
  getModelWarningSections,
  type BestUsedBuyScores,
  type ModelPageData,
} from "@/lib/models";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-200">
      {children}
    </span>
  );
}

function RiskBadge({ risk }: { risk: "Lower" | "Medium" | "Higher" }) {
  const className =
    risk === "Lower"
      ? "border-emerald-500/40 text-emerald-200"
      : risk === "Medium"
        ? "border-yellow-500/40 text-yellow-200"
        : "border-red-500/40 text-red-200";

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${className}`}>{risk}</span>;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 76 ? "bg-emerald-500" : value >= 66 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-4 text-xs text-gray-400">
        <span>{label}</span>
        <strong className="text-gray-200">{value}</strong>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function WarningList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5">
      <h3 className="font-bold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-gray-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContentCard({
  href,
  title,
  description,
  image,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] transition hover:border-red-500 hover:bg-white/5"
    >
      <div className="relative h-40 border-b border-gray-800 bg-white/5">
        <Image
          src={image ?? "/opengraph-image"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        {badge ? <Pill>{badge}</Pill> : null}
        <h3 className="mt-3 font-semibold leading-snug text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
        <div className="mt-5 text-sm font-semibold text-gray-200 group-hover:text-white">
          Open -&gt;
        </div>
      </div>
    </Link>
  );
}

export default function ModelHubPage({
  model,
  locale,
}: {
  model: ModelPageData;
  locale: Locale;
}) {
  const relatedInsights = getAllInsights(locale)
    .filter((post) => {
      const haystack = [
        post.frontmatter.title,
        post.frontmatter.description,
        post.frontmatter.brand,
        post.frontmatter.platform,
        post.frontmatter.category,
        ...(post.frontmatter.risk ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes(model.brand.toLowerCase()) ||
        model.searchTopics.some((topic) => haystack.includes(topic.toLowerCase()))
      );
    })
    .slice(0, 4);

  const relatedBlog = getAllBlogPosts(locale)
    .filter((post) => {
      const haystack = [
        post.frontmatter.title,
        post.frontmatter.description,
        post.frontmatter.brand,
        post.frontmatter.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes(model.brand.toLowerCase()) ||
        haystack.includes("buying") ||
        haystack.includes("ownership")
      );
    })
    .slice(0, 3);

  const scoreLabel =
    model.score >= 72 ? "Good candidate" : model.score >= 68 ? "Verify carefully" : "History sensitive";
  const buyScores: BestUsedBuyScores = getBestUsedBuyScores(model);
  const warnings = getModelWarningSections(model);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Models", href: "/models" },
          { label: model.name },
        ]}
      />

      <section className="mt-6 overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
        <div className="relative min-h-[460px]">
          <Image
            src={model.heroImage}
            alt={`${model.name} used buying guide`}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/86 to-[#0B1220]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

          <div className="relative max-w-3xl p-8 md:p-12">
            <div className="mb-6 flex flex-wrap gap-2">
              <Pill>{model.brand}</Pill>
              <Pill>Used buying guide</Pill>
              <Pill>Reliability score {model.score}/100</Pill>
            </div>
            <p className="text-sm font-semibold text-red-300">Model Guide</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {model.title}
            </h1>
            <p className="mt-5 leading-relaxed text-gray-200">{model.verdict}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/buying-checklist"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Run risk checker
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(model.name)}`}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-gray-100 transition hover:bg-white/15"
              >
                Search {model.name}
              </Link>
              <Link
                href={model.brandHref}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-gray-100 transition hover:bg-white/15"
              >
                Open {model.brand} hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <CarVerticalInline locale={locale} compact />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
          <p className="text-sm font-semibold text-red-300">{scoreLabel}</p>
          <div className="mt-3 text-5xl font-extrabold text-white">{model.score}</div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${model.score}%` }} />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">{model.bestFor}</p>
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <h2 className="font-semibold text-white">Watch out</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{model.watchOut}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
            <h2 className="font-semibold text-white">Market position</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{model.marketPosition}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
            <h2 className="font-semibold text-white">Best used buy scoring</h2>
            <div className="mt-4 grid gap-3">
              <ScoreBar label="Reliability" value={buyScores.reliability} />
              <ScoreBar label="Repair cost" value={buyScores.repairCost} />
              <ScoreBar label="Parts availability" value={buyScores.partsAvailability} />
              <ScoreBar label="Fuel economy" value={buyScores.fuelEconomy} />
              <ScoreBar label="Resale" value={buyScores.resale} />
            </div>
          </div>
        </aside>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
            <h2 className="text-2xl font-bold text-white">Ownership plan</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Use this as the first-month plan after viewing the car. It keeps the inspection practical and turns vague risk into jobs you can price.
            </p>
            <div className="mt-5 grid gap-3">
              {model.ownershipPlan.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
            <h2 className="text-2xl font-bold text-white">Engines and versions to understand</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {model.engines.map((engine) => (
                <div key={engine.label} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white">{engine.label}</h3>
                    <RiskBadge risk={engine.risk} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{engine.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
              <h2 className="text-xl font-bold text-white">Common problems</h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                {model.commonProblems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
              <h2 className="text-xl font-bold text-white">Inspection checklist</h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                {model.inspectionChecklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
            <h2 className="text-2xl font-bold text-white">Used-buy warning zones</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Turn the score into practical checks: engine risk, gearbox behavior, mileage exposure, and what to verify before paying.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <WarningList title="Common engine problems" items={warnings.commonEngineProblems} />
              <WarningList title="Gearbox issues" items={warnings.gearboxIssues} />
              <WarningList title="Mileage danger zones" items={warnings.mileageDangerZones} />
              <WarningList title="What to check before buying" items={warnings.whatToCheckBeforeBuying} />
            </div>
          </section>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7">
        <h2 className="text-2xl font-bold text-white">Search related topics</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {model.searchTopics.map((topic) => (
            <Link
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="rounded-full border border-gray-700 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:border-gray-500 hover:bg-white/10"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      <RelatedResearch
        className="mt-8"
        items={[
          { label: `${model.brand} hub`, href: model.brandHref, badge: "Brand" },
          { label: "Parts & Failure Map", href: "/parts-failure-map", badge: "Systems" },
          { label: "Fault-code library", href: "/fault-codes", badge: "Diagnostics" },
          { label: "Used-car checklist", href: "/buying-checklist", badge: "Buyer" },
          { label: "How we evaluate used cars", href: "/how-we-evaluate-used-cars", badge: "Trust" },
        ]}
      />

      <LeadCaptureCTA source={`model:${model.slug}`} compact className="mt-8" />

      {(relatedInsights.length > 0 || relatedBlog.length > 0) && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-white">Related reading</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedInsights.map((post) => (
              <ContentCard
                key={post.slug}
                href={`/insights/${post.slug}`}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                image={post.frontmatter.image}
                badge={post.frontmatter.platform ?? post.frontmatter.category}
              />
            ))}
            {relatedBlog.map((post) => (
              <ContentCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                image={post.frontmatter.image}
                badge={post.frontmatter.category}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
