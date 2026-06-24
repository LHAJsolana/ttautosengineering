import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import RelatedResearch, { type ResearchLink } from "@/components/RelatedResearch";
import Link from "@/components/LocalizedLink";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { seoLandingPages, getSeoLandingPage } from "@/lib/seoLandingPages";
import { canonical, localizedPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const page = getSeoLandingPage(slug, locale);
  if (!page) return {};

  return localizedPageMetadata({
    locale,
    pathname: `/research/${page.slug}`,
    title: page.metaTitle,
    description: page.metaDescription,
    type: "article",
  });
}

function BulletPanel({ title, items }: { title: string; items: string[] }) {
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

export default async function ResearchLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const page = getSeoLandingPage(slug, locale);
  if (!page) notFound();

  const researchLinks: ResearchLink[] = [
    { label: `${page.brand} hub`, href: page.brandHref, badge: "Brand", note: "Start with manufacturer-wide reliability patterns." },
    ...page.relatedModels.map((item) => ({ ...item, badge: "Model" })),
    ...page.relatedPowertrains.map((item) => ({ ...item, badge: "Powertrain" })),
    ...page.relatedFaultCodes.map((code) => ({
      label: `${code} fault code`,
      href: `/fault-codes/${code.toLowerCase()}`,
      badge: "Fault code",
      note: "Use diagnostic evidence before trusting symptoms alone.",
    })),
    ...page.relatedComparisons.map((item) => ({ ...item, badge: "Compare" })),
    ...page.relatedGuides.map((item) => ({ ...item, badge: "Guide" })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    mainEntityOfPage: canonical(`/research/${page.slug}`, locale),
    publisher: { "@type": "Organization", name: "TT AUTO'S Engineering" },
    about: [page.brand, ...page.relatedPowertrains.map((item) => item.label)],
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research", href: "/buying-guides" },
          { label: page.title },
        ]}
      />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B1220] p-8 md:p-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100">
            High-intent buyer research
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200">
            {page.brand}
          </span>
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-300">{page.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/buying-checklist" className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">
            Check a car before buying
          </Link>
          <Link href="/fault-codes" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10">
            Search a fault code
          </Link>
          <Link href="/compare" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10">
            Compare models
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <BulletPanel title="Common problems" items={page.commonProblems} />
        <BulletPanel title="Symptoms to take seriously" items={page.symptoms} />
      </section>

      <section className="mt-5 rounded-3xl border border-gray-800 bg-[#111827] p-6 md:p-7">
        <h2 className="text-2xl font-black text-white">Checks before buying</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {page.checksBeforeBuying.map((check) => (
            <div key={check} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-gray-300">
              {check}
            </div>
          ))}
        </div>
      </section>

      <RelatedResearch items={researchLinks} className="mt-8" />
      <LeadCaptureCTA source={`research:${page.slug}`} className="mt-8" />
    </main>
  );
}
