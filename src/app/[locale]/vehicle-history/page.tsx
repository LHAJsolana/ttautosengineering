import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CarVerticalCTA from "@/components/carvertical/CarVerticalCTA";
import CarVerticalSteps from "@/components/carvertical/CarVerticalSteps";
import { JsonLd } from "@/components/JsonLd";
import { getCarVerticalCopy } from "@/lib/carVertical";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { canonical, localizedPageMetadata, SITE_URL } from "@/lib/site";

const PATH = "/vehicle-history";
const SITE_NAME = "TT AUTO'S Engineering";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const copy = getCarVerticalCopy(locale);
  return localizedPageMetadata({
    locale,
    pathname: PATH,
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    type: "article",
  });
}

export default async function VehicleHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const copy = getCarVerticalCopy(locale);

  const sections = [
    {
      title: copy.facts[0],
      body: copy.cards[0].description,
    },
    {
      title: copy.facts[1],
      body: copy.cards[1].description,
    },
    {
      title: copy.facts[2],
      body: copy.cards[2].description,
    },
    {
      title: copy.facts[3],
      body: copy.description,
    },
    {
      title: copy.facts[4],
      body: copy.compactDescription,
    },
    {
      title: copy.facts[5],
      body: copy.compactDescription,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/", locale) },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.eyebrow,
        item: canonical(PATH, locale),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.metadataTitle,
    description: copy.metadataDescription,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-transparent.png` },
    },
    mainEntityOfPage: canonical(PATH, locale),
    inLanguage: locale,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-transparent.png`,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <JsonLd data={[breadcrumbJsonLd, articleJsonLd, faqJsonLd, organizationJsonLd]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: copy.eyebrow }]} />

      <section className="mt-6 overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
        <div className="relative min-h-[420px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.18),transparent_34%),linear-gradient(135deg,#111827,#0B1220_55%,#050914)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <div className="relative max-w-4xl p-8 md:p-12">
            <p className="text-sm font-semibold text-red-300">{copy.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">{copy.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CarVerticalCTA locale={locale} label={copy.cta} />
              <CarVerticalCTA locale={locale} type="general" label={copy.reportCta} tone="secondary" />
            </div>
            <p className="mt-5 max-w-3xl text-xs leading-5 text-gray-500">{copy.disclosure}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {copy.cards.map((card) => (
          <article key={card.title} className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
            <div className="h-1.5 w-12 rounded-full bg-red-500" />
            <h2 className="mt-5 text-xl font-bold text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-white">{copy.subtitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="font-bold text-white">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <CarVerticalSteps locale={locale} />

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-white">{copy.faqTitle}</h2>
        <div className="mt-6 grid gap-4">
          {copy.faq.map((item) => (
            <article key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="font-bold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-red-500/25 bg-red-500/10 p-7 md:p-8">
        <p className="text-sm font-semibold text-red-200">{copy.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">{copy.completeCta}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-gray-300">{copy.compactDescription}</p>
        <CarVerticalCTA locale={locale} label={copy.secondaryCta} className="mt-6" />
      </section>
    </main>
  );
}
