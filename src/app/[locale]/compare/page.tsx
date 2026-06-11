import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import VehicleComparisonTool, { type ComparisonItem } from "@/components/VehicleComparisonTool.client";
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
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={copy.tools} title={copy.compare} description={copy.compareIntro} links={[{ label: copy.cost, href: "/maintenance-cost" }, { label: copy.faults, href: "/fault-codes" }]} />
      <section className="mt-8"><VehicleComparisonTool items={[...models, ...powertrains]} copy={copy} /></section>
    </main>
  );
}
