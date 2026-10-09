import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedModelYear, modelYears } from "@/lib/modelYears";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export function generateStaticParams() {
  return modelYears.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const item = getLocalizedModelYear(slug, locale);
  if (!item) return {};
  return localizedPageMetadata({ locale, pathname: `/model-years/${slug}`, title: item.title, description: item.description });
}

export default async function ModelYearPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const item = getLocalizedModelYear(slug, locale);
  if (!item) notFound();
  const copy = getToolCopy(locale);
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow={`${item.year} · ${item.generation}`} title={item.title} description={item.description} links={[{ label: copy.compare, href: "/compare" }, { label: copy.cost, href: "/maintenance-cost" }]} />
      <section className="mt-8 grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">{copy.verdict}</h2><p className="mt-4 leading-8 text-gray-300">{item.verdict}</p>
          <h2 className="mt-8 text-xl font-black text-white">{copy.inspectFirst}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{item.inspection.map((text) => <li key={text} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-gray-300">{text}</li>)}</ul>
        </div>
        <aside className="grid gap-5">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6"><h2 className="font-black text-white">{copy.bestChoice}</h2><p className="mt-3 text-sm leading-7 text-gray-300">{item.bestChoice}</p></div>
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6"><h2 className="font-black text-white">{copy.avoidIf}</h2><p className="mt-3 text-sm leading-7 text-gray-300">{item.avoidIf}</p></div>
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6"><div className="text-4xl font-black text-white">{item.score}<span className="text-lg text-gray-500">/100</span></div><p className="mt-2 text-sm text-gray-400">{copy.risk}: {item.risk}</p></div>
        </aside>
      </section>
      <section className="mt-5 rounded-3xl border border-white/10 bg-[#111827] p-6">
        <h2 className="text-xl font-black text-white">{copy.highlights}</h2>
        <div className="mt-4 flex flex-wrap gap-3">{item.highlights.map((text) => <span key={text} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">{text}</span>)}</div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/models/${item.modelSlug}`} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500">{item.model}</Link>
          {item.relatedPowertrains.map((slug) => <Link key={slug} href={`/powertrains/${slug}`} className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white hover:bg-white/10">{slug.toUpperCase()}</Link>)}
        </div>
      </section>
    </main>
  );
}
