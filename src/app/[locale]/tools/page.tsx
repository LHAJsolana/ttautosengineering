import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

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
    { title: copy.compare, description: copy.compareIntro, href: "/compare", icon: "01", accent: "from-red-500/30" },
    { title: copy.cost, description: copy.costIntro, href: "/maintenance-cost", icon: "02", accent: "from-emerald-500/25" },
    { title: copy.faults, description: copy.faultsIntro, href: "/fault-codes", icon: "03", accent: "from-amber-500/25" },
    { title: copy.years, description: copy.yearsIntro, href: "/model-years", icon: "04", accent: "from-blue-500/25" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero eyebrow="TT AUTO'S Engineering" title={copy.tools} description={copy.toolsIntro} />
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={localePath(locale, tool.href)} className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${tool.accent} via-[#111827] to-[#0b1220] p-7 transition hover:-translate-y-1 hover:border-red-500/35`}>
            <div className="font-mono text-sm font-bold text-red-300">{tool.icon}</div>
            <h2 className="mt-8 text-2xl font-black text-white">{tool.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">{tool.description}</p>
            <div className="mt-7 inline-flex items-center text-sm font-bold text-white">{copy.openTool}<span data-directional-icon className="ms-2 text-red-300 transition group-hover:translate-x-1">-&gt;</span></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
