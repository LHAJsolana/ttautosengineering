import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import Link from "@/components/LocalizedLink";
import VehicleComparisonTool, { type ComparisonItem } from "@/components/VehicleComparisonTool.client";
import { getLocalizedDirectComparisons } from "@/lib/comparisons";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedModelPages } from "@/lib/models";
import { getLocalizedPowertrains } from "@/lib/powertrains";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return localizedPageMetadata({ locale, pathname: "/compare", title: copy.compare, description: copy.compareIntro });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  const directComparisons = getLocalizedDirectComparisons(locale);
  const models: ComparisonItem[] = getLocalizedModelPages(locale).map((item) => ({
    id: `model-${item.slug}`,
    name: item.name,
    type: "Model",
    score: item.score,
    risk: item.score >= 76 ? "Lower" : item.score >= 66 ? "Medium" : "Higher",
    summary: item.verdict,
    bestFor: item.bestFor,
    problems: item.commonProblems,
    checks: item.inspectionChecklist,
    href: `/models/${item.slug}`,
    metrics: {
      reliability: item.score,
      ownershipValue: Math.max(48, item.score - Math.round(item.commonProblems.length * 1.5)),
      usability: Math.min(92, item.score + (item.name.includes("Golf") || item.name.includes("Passat") ? 10 : 4)),
      inspectionConfidence: Math.min(90, 58 + item.inspectionChecklist.length * 5),
    },
  }));
  const powertrains: ComparisonItem[] = getLocalizedPowertrains(locale).map((item) => ({
    id: `powertrain-${item.slug}`,
    name: item.name,
    type: item.kind,
    score: item.score,
    risk: item.risk,
    summary: item.verdict,
    bestFor: item.bestFor,
    problems: item.commonProblems,
    checks: item.inspectionChecks,
    href: `/powertrains/${item.slug}`,
    metrics: {
      reliability: item.score,
      ownershipValue: Math.max(45, item.score - (item.risk === "Higher" ? 14 : item.risk === "Medium" ? 6 : 0)),
      usability: item.kind === "Gearbox" ? Math.min(90, item.score + 5) : Math.min(88, item.score + 2),
      inspectionConfidence: Math.min(92, 60 + item.inspectionChecks.length * 6),
    },
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={copy.tools} title={copy.compare} description={copy.compareIntro} links={[{ label: copy.cost, href: "/maintenance-cost" }, { label: copy.faults, href: "/fault-codes" }]} />
      <section className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-red-300">Direct comparisons</p>
            <h2 className="mt-2 text-2xl font-black text-white">Popular used-buy matchups</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-gray-400">
            Fast pages for the comparisons buyers actually search before choosing an engine, model, or brand.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {directComparisons.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{comparison.kind}</p>
                  <h3 className="mt-1 font-bold text-white">{comparison.title}</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300">
                  {comparison.leftScore} vs {comparison.rightScore}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">{comparison.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-8"><VehicleComparisonTool items={[...models, ...powertrains]} copy={copy} /></section>
    </main>
  );
}
