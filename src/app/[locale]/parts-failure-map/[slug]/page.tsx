import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import RelatedResearch, { type ResearchLink } from "@/components/RelatedResearch";
import Link from "@/components/LocalizedLink";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getPartsFailureItem, partsFailureItems } from "@/lib/partsFailureMap";
import { canonical, localizedPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return partsFailureItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const item = getPartsFailureItem(slug, locale);
  if (!item) return {};

  return localizedPageMetadata({
    locale,
    pathname: `/parts-failure-map/${item.slug}`,
    title: `${item.title} symptoms, faults, and buying checks`,
    description: item.summary,
    type: "article",
  });
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
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

export default async function PartsFailureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const item = getPartsFailureItem(slug, locale);
  if (!item) notFound();

  const researchLinks: ResearchLink[] = [
    { label: `${item.brand} hub`, href: item.brandHref, badge: "Brand" },
    ...item.relatedModels.map((link) => ({ ...link, badge: "Model" })),
    ...item.relatedPowertrains.map((link) => ({ ...link, badge: "Powertrain" })),
    ...item.faultCodes.map((code) => ({
      label: `${code} fault code`,
      href: `/fault-codes/${code.toLowerCase()}`,
      badge: "Fault code",
    })),
    ...item.relatedGuides.map((link) => ({ ...link, badge: "Guide" })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: item.title,
    description: item.summary,
    mainEntityOfPage: canonical(`/parts-failure-map/${item.slug}`, locale),
    about: [item.brand, item.system, ...item.faultCodes],
    publisher: { "@type": "Organization", name: "TT AUTO'S Engineering" },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Parts & Failure Map", href: "/parts-failure-map" },
          { label: item.title },
        ]}
      />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B1220] p-8 md:p-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100">
            {item.system}
          </span>
          <Link href={item.brandHref} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10">
            {item.brand}
          </Link>
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
          {item.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-300">{item.summary}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs text-gray-500">Repair difficulty</div>
            <div className="mt-1 text-lg font-black text-white">{item.repairDifficulty}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs text-gray-500">Estimated cost</div>
            <div className="mt-1 text-sm font-semibold leading-6 text-white">{item.estimatedCost}</div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Panel title="Affected models and engines" items={item.affected} />
        <Panel title="Symptoms" items={item.symptoms} />
        <Panel title="Why it fails" items={item.whyItFails} />
        <Panel title="Checks before buying" items={item.checksBeforeBuying} />
      </section>

      <section className="mt-5 rounded-3xl border border-red-500/25 bg-red-500/10 p-6">
        <h2 className="font-black text-white">Fault codes to investigate</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.faultCodes.map((code) => (
            <Link
              key={code}
              href={`/fault-codes/${code.toLowerCase()}`}
              className="rounded-full border border-red-400/30 bg-[#0B1220]/70 px-3 py-2 text-sm font-semibold text-red-50 hover:bg-[#0B1220]"
            >
              {code}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-gray-400">
          Fault codes guide diagnosis; they do not confirm a part without live data,
          inspection, service history, and repeat testing.
        </p>
      </section>

      <RelatedResearch items={researchLinks} className="mt-8" />
      <LeadCaptureCTA source={`parts-failure-map:${item.slug}`} className="mt-8" />
    </main>
  );
}
