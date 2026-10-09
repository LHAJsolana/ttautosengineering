import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import ModelYearExplorer from "@/components/ModelYearExplorer.client";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedModelYears } from "@/lib/modelYears";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return localizedPageMetadata({ locale, pathname: "/model-years", title: copy.years, description: copy.yearsIntro });
}

export default async function ModelYearsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  const years = getLocalizedModelYears(locale);
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={copy.tools} title={copy.years} description={copy.yearsIntro} links={[{ label: copy.compare, href: "/compare" }, { label: copy.cost, href: "/maintenance-cost" }]} />
      <section className="mt-8"><ModelYearExplorer years={years} copy={copy} /></section>
    </main>
  );
}
