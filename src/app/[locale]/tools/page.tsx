import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";
import { modelPages } from "@/lib/models";
import { powertrains } from "@/lib/powertrains";
import { faultCodes } from "@/lib/faultCodes";
import { modelYears } from "@/lib/modelYears";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  return localizedPageMetadata({ locale, pathname: "/tools", title: copy.tools, description: copy.toolsIntro });
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const copy = getToolCopy(locale);
  const tools = [
    { title: copy.compare, description: copy.compareIntro, href: "/compare", icon: "01", accent: "from-red-500/30", stat: `${modelPages.length + powertrains.length} ${copy.vehiclesCovered}`, bars: [72, 84, 64] },
    { title: copy.cost, description: copy.costIntro, href: "/maintenance-cost", icon: "02", accent: "from-emerald-500/25", stat: `4 ${copy.currency} | 3 ${copy.region}`, bars: [55, 70, 91] },
    { title: copy.faults, description: copy.faultsIntro, href: "/fault-codes", icon: "03", accent: "from-amber-500/25", stat: `${faultCodes.length} ${copy.codesCovered}`, bars: [86, 62, 76] },
    { title: copy.years, description: copy.yearsIntro, href: "/model-years", icon: "04", accent: "from-blue-500/25", stat: `${modelYears.length} ${copy.yearsCovered}`, bars: [69, 75, 82] },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow="TT AUTO'S Engineering" title={copy.tools} description={copy.toolsIntro} />
      <section className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
        <div><div className="text-2xl font-black text-white">{modelPages.length + powertrains.length}</div><div className="text-xs text-gray-500">{copy.vehiclesCovered}</div></div>
        <div><div className="text-2xl font-black text-white">{faultCodes.length}</div><div className="text-xs text-gray-500">{copy.codesCovered}</div></div>
        <div><div className="text-2xl font-black text-white">{modelYears.length}</div><div className="text-xs text-gray-500">{copy.yearsCovered}</div></div>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={localePath(locale, tool.href)} className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${tool.accent} via-[#111827] to-[#0b1220] p-7 transition hover:-translate-y-1 hover:border-red-500/35`}>
            <div className="font-mono text-sm font-bold text-red-300">{tool.icon}</div>
            <div className="absolute end-7 top-7 flex h-12 items-end gap-1.5" aria-hidden="true">
              {tool.bars.map((height, index) => <span key={index} className="w-2 rounded-t bg-white/15 transition group-hover:bg-red-400/50" style={{ height: `${height / 2}px` }} />)}
            </div>
            <h2 className="mt-8 text-2xl font-black text-white">{tool.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">{tool.description}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-500">{tool.stat}</p>
            <div className="mt-7 inline-flex items-center text-sm font-bold text-white">{copy.openTool}<span data-directional-icon className="ms-2 text-red-300 transition group-hover:translate-x-1">-&gt;</span></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
