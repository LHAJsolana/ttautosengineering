import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PowertrainHubPage from "@/components/PowertrainHubPage";
import { getLocalizedPowertrain, powertrains } from "@/lib/powertrains";
import { localizedPageMetadata } from "@/lib/site";
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
  return localizedPageMetadata({
    locale,
    pathname: `/powertrains/${powertrain.slug}`,
    title,
    description: powertrain.summary,
    image: powertrain.image,
    type: "article",
  });
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
