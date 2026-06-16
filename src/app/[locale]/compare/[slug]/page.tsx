import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocalizedLink";
import ToolPageHero from "@/components/ToolPageHero";
import { directComparisons, getLocalizedDirectComparison } from "@/lib/comparisons";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { getToolCopy } from "@/lib/toolCopy";

export function generateStaticParams() {
  return directComparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const comparison = getLocalizedDirectComparison(slug, locale);
  if (!comparison) return {};

  return localizedPageMetadata({
    locale,
    pathname: `/compare/${comparison.slug}`,
    title: `${comparison.title} - Used Buy Comparison`,
    description: comparison.description,
  });
}

function ScoreBox({ label, score }: { label: string; score: number }) {
  const color = score >= 76 ? "bg-emerald-500" : score >= 66 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-black text-white">{label}</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center">
          <div className="text-2xl font-black text-white">{score}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">/ 100</div>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function DirectComparePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const comparison = getLocalizedDirectComparison(slug, locale);
  if (!comparison) notFound();
  const copy = getToolCopy(locale);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 text-white md:py-14">
      <ToolPageHero
        eyebrow={comparison.kind}
        title={comparison.title}
        description={comparison.description}
        links={[
          { label: copy.compare, href: "/compare" },
          { label: copy.cost, href: "/maintenance-cost" },
        ]}
      />

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Link href={comparison.leftHref} className="block transition hover:-translate-y-0.5">
          <ScoreBox label={comparison.left} score={comparison.leftScore} />
        </Link>
        <Link href={comparison.rightHref} className="block transition hover:-translate-y-0.5">
          <ScoreBox label={comparison.right} score={comparison.rightScore} />
        </Link>
      </section>

      <section className="mt-6 rounded-3xl border border-red-500/25 bg-red-500/10 p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-200">Best used buy</p>
        <h2 className="mt-2 text-3xl font-black text-white">{comparison.winner}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-gray-200">{comparison.bestUsedBuy}</p>
        <p className="mt-4 max-w-4xl leading-7 text-gray-300">{comparison.verdict}</p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <BulletCard title="Key differences" items={comparison.keyDifferences} />
        <BulletCard title="Buyer advice" items={comparison.buyerAdvice} />
        <BulletCard title="Red flags" items={comparison.redFlags} />
      </section>
    </main>
  );
}
