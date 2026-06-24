import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import RelatedResearch from "@/components/RelatedResearch";
import { getAllInsights } from "@/lib/insights";
import type { Locale } from "@/lib/i18n";
import { getLocalizedModelPages } from "@/lib/models";
import type { PowertrainData } from "@/lib/powertrains";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-200">
      {children}
    </span>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-gray-800 bg-[#111827] p-7">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-gray-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PowertrainHubPage({
  powertrain,
  locale,
}: {
  powertrain: PowertrainData;
  locale: Locale;
}) {
  const terms = [
    powertrain.name,
    ...powertrain.aliases,
    ...powertrain.brands,
    ...powertrain.applications,
  ].map((term) => term.toLowerCase());

  const relatedInsights = getAllInsights(locale)
    .filter((post) => {
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
      return terms.some((term) => haystack.includes(term));
    })
    .slice(0, 4);

  const relatedModels = getLocalizedModelPages(locale).filter((model) =>
    powertrain.relatedModels.includes(model.slug)
  );

  const riskClass =
    powertrain.risk === "Lower"
      ? "text-emerald-300"
      : powertrain.risk === "Medium"
        ? "text-yellow-300"
        : "text-red-300";

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Powertrains", href: "/powertrains" },
          { label: powertrain.name },
        ]}
      />

      <section className="mt-6 overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
        <div className="relative min-h-[480px]">
          <Image
            src={powertrain.image}
            alt={`${powertrain.name} ${powertrain.kind.toLowerCase()} guide`}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/88 to-[#0B1220]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

          <div className="relative max-w-3xl p-8 md:p-12">
            <div className="flex flex-wrap gap-2">
              <Badge>{powertrain.kind}</Badge>
              <Badge>{powertrain.fuel}</Badge>
              <Badge>{powertrain.years}</Badge>
              {powertrain.brands.map((brand) => (
                <Badge key={brand}>{brand}</Badge>
              ))}
            </div>
            <p className="mt-7 text-sm font-semibold text-red-300">Powertrain Guide</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {powertrain.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-200">{powertrain.verdict}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/search?q=${encodeURIComponent(powertrain.name)}`}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Search related content
              </Link>
              <Link
                href="/buying-checklist"
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-gray-100 transition hover:bg-white/15"
              >
                Run risk checker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="h-fit rounded-3xl border border-gray-800 bg-[#111827] p-7 lg:sticky lg:top-28">
          <p className={`text-sm font-semibold ${riskClass}`}>{powertrain.risk} risk profile</p>
          <div className="mt-2 text-5xl font-extrabold">{powertrain.score}</div>
          <div className="mt-3 text-xs text-gray-500">Reliability signal out of 100</div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${powertrain.score}%` }} />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">{powertrain.summary}</p>
          <div className="mt-6 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
            <div className="text-xs text-gray-500">Best for</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-200">{powertrain.bestFor}</p>
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold text-white">Also known as</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {powertrain.aliases.map((alias) => (
                <Badge key={alias}>{alias}</Badge>
              ))}
            </div>
          </div>
        </aside>

        <div className="grid gap-6">
          <ListPanel title="Strengths" items={powertrain.strengths} />
          <div className="grid gap-6 md:grid-cols-2">
            <ListPanel title="Common problems" items={powertrain.commonProblems} />
            <ListPanel title="Pre-purchase checks" items={powertrain.inspectionChecks} />
          </div>
          <ListPanel title="Service priorities" items={powertrain.servicePriorities} />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7">
        <h2 className="text-2xl font-bold">Common applications</h2>
        <p className="mt-2 text-sm text-gray-400">
          Availability varies by market, year, output, and drivetrain configuration.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {powertrain.applications.map((application) => (
            <Link
              key={application}
              href={`/search?q=${encodeURIComponent(application)}`}
              className="rounded-full border border-gray-700 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:border-gray-500 hover:bg-white/10"
            >
              {application}
            </Link>
          ))}
        </div>
      </section>

      {relatedModels.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Related model guides</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedModels.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="group rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-red-500 hover:bg-white/5"
              >
                <div className="text-xs font-semibold text-red-300">{model.brand}</div>
                <h3 className="mt-2 text-lg font-bold">{model.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{model.description}</p>
                <div className="mt-5 text-sm font-semibold text-gray-200">Open model guide -&gt;</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <RelatedResearch
        className="mt-10"
        items={[
          ...relatedModels.slice(0, 3).map((model) => ({
            label: model.name,
            href: `/models/${model.slug}`,
            badge: "Model",
          })),
          { label: "Parts & Failure Map", href: "/parts-failure-map", badge: "Systems" },
          { label: "Fault-code library", href: "/fault-codes", badge: "Diagnostics" },
          { label: "Used-car checklist", href: "/buying-checklist", badge: "Buyer" },
          { label: "How we evaluate used cars", href: "/how-we-evaluate-used-cars", badge: "Trust" },
        ]}
      />

      <LeadCaptureCTA source={`powertrain:${powertrain.slug}`} compact className="mt-10" />

      {relatedInsights.length > 0 ? (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Related technical reading</h2>
              <p className="mt-1 text-sm text-gray-400">
                Existing insights connected to this engine or gearbox.
              </p>
            </div>
            <Link href="/insights" className="text-sm text-gray-200 hover:text-white">
              All insights -&gt;
            </Link>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {relatedInsights.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-red-500 hover:bg-white/5"
              >
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.brand ? <Badge>{post.frontmatter.brand}</Badge> : null}
                  {post.frontmatter.platform ? <Badge>{post.frontmatter.platform}</Badge> : null}
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug">{post.frontmatter.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {post.frontmatter.description}
                </p>
                <div className="mt-5 text-sm font-semibold text-gray-200">Read insight -&gt;</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
