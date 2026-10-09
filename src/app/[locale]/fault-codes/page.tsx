import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import FaultCodeLibrary from "@/components/FaultCodeLibrary.client";
import { getLocalizedFaultCodes } from "@/lib/faultCodes";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return localizedPageMetadata({ locale, pathname: "/fault-codes", title: copy.faults, description: copy.faultsIntro });
}

export default async function FaultCodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={copy.tools} title={copy.faults} description={copy.faultsIntro} links={[{ label: copy.compare, href: "/compare" }, { label: copy.years, href: "/model-years" }]} />
      <p className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">{copy.codeDisclaimer}</p>
      <section className="mt-6"><FaultCodeLibrary codes={getLocalizedFaultCodes(locale)} copy={copy} /></section>
    </main>
  );
}
