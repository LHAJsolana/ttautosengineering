import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
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
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {years.map((item) => (
          <Link key={item.slug} href={`/model-years/${item.slug}`} className="group rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-red-500/40">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-red-300">{item.year} · {item.generation}</p><h2 className="mt-2 text-2xl font-black text-white">{item.model}</h2></div>
              <div className="rounded-2xl bg-white/[0.05] px-4 py-3 text-center"><strong className="text-xl text-white">{item.score}</strong><div className="text-[10px] text-gray-500">/100</div></div>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-400">{item.verdict}</p>
            <div className="mt-5 flex items-center justify-between text-sm"><span className="rounded-full border border-white/10 px-3 py-1 text-gray-300">{item.risk}</span><span className="font-bold text-white">{copy.viewGuide} <span data-directional-icon className="text-red-300">-&gt;</span></span></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
