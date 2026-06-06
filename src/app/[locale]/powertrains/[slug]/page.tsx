import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PowertrainHubPage from "@/components/PowertrainHubPage";
import { getLocalizedPowertrain, powertrains } from "@/lib/powertrains";
import { canonical } from "@/lib/site";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return powertrains.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const powertrain = getLocalizedPowertrain(slug, locale);
  if (!powertrain) return {};

  const title = `${powertrain.name} Reliability and Buying Guide`;
  const path = `/powertrains/${powertrain.slug}`;
  return {
    title,
    description: powertrain.summary,
    alternates: { canonical: canonical(path, locale) },
    openGraph: {
      type: "article",
      url: canonical(path, locale),
      title,
      description: powertrain.summary,
      images: [{ url: powertrain.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: powertrain.summary,
      images: [powertrain.image],
    },
  };
}

export default async function PowertrainPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const powertrain = getLocalizedPowertrain(slug, locale);
  if (!powertrain) notFound();
  return <PowertrainHubPage powertrain={powertrain} locale={locale} />;
}
