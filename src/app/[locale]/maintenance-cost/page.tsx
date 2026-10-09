import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import OwnershipCostCalculator from "@/components/OwnershipCostCalculator.client";
import CarVerticalInline from "@/components/carvertical/CarVerticalInline";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedModelPages } from "@/lib/models";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return localizedPageMetadata({ locale, pathname: "/maintenance-cost", title: copy.cost, description: copy.costIntro });
}

export default async function MaintenanceCostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  const models = getLocalizedModelPages(locale).map(({ slug, name, score }) => ({ slug, name, score }));
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={copy.tools} title={copy.cost} description={copy.costIntro} links={[{ label: copy.compare, href: "/compare" }, { label: copy.years, href: "/model-years" }]} />
      <section className="mt-8"><CarVerticalInline locale={locale} compact /></section>
      <section className="mt-8"><OwnershipCostCalculator models={models} copy={copy} /></section>
    </main>
  );
}
