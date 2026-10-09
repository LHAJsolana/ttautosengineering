import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import RelatedResearch from "@/components/RelatedResearch";
import CarVerticalCard from "@/components/carvertical/CarVerticalCard";
import { faultCodes, getLocalizedFaultCode } from "@/lib/faultCodes";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export function generateStaticParams() {
  return faultCodes.map((item) => ({ code: item.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; code: string }> }): Promise<Metadata> {
  const { locale: value, code } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const item = getLocalizedFaultCode(code, locale);
  if (!item) return {};
  return localizedPageMetadata({ locale, pathname: `/fault-codes/${code.toLowerCase()}`, title: `${item.code}: ${item.title}`, description: item.summary });
}

export default async function FaultCodePage({ params }: { params: Promise<{ locale: string; code: string }> }) {
  const { locale: value, code } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const item = getLocalizedFaultCode(code, locale);
  if (!item) notFound();
  const copy = getToolCopy(locale);
  const sections = [
    { title: copy.symptoms, items: item.symptoms },
    { title: copy.likelyCauses, items: item.likelyCauses },
    { title: copy.firstChecks, items: item.firstChecks },
  ];
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={`${copy.faults} · ${item.system}`} title={`${item.code}: ${item.title}`} description={item.summary} links={[{ label: copy.faults, href: "/fault-codes" }]} />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-lg font-black text-white">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
              {section.items.map((text) => <li key={text} className="flex gap-2"><span className="text-red-400">•</span><span>{text}</span></li>)}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-5 rounded-3xl border border-red-500/25 bg-red-500/10 p-6">
        <h2 className="font-black text-white">{copy.important}</h2>
        <p className="mt-2 text-sm leading-7 text-gray-300">{item.warning}</p>
        <p className="mt-3 text-xs leading-6 text-gray-400">{copy.codeDisclaimer}</p>
      </section>
      <div className="mt-6">
        <CarVerticalCard locale={locale} compact />
      </div>
      <Link href="/buying-checklist" className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500">{copy.inspectFirst}</Link>
      <RelatedResearch
        className="mt-8"
        items={[
          { label: "Used-car checklist", href: "/buying-checklist", badge: "Buyer" },
          { label: "Parts & Failure Map", href: "/parts-failure-map", badge: "Systems" },
          { label: "Reliability index", href: "/reliability-index", badge: "Risk" },
          { label: "How we evaluate used cars", href: "/how-we-evaluate-used-cars", badge: "Trust" },
        ]}
      />
      <LeadCaptureCTA source={`fault-code:${item.code}`} compact className="mt-8" />
    </main>
  );
}
