import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandHubPage from "@/components/BrandHubPage";
import { brands, getBrandBySlug } from "@/lib/brands";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";

const dedicatedBrandPages = new Set(["bmw", "mercedes-benz", "audi", "volkswagen"]);

export function generateStaticParams() {
  return brands
    .filter((brand) => !dedicatedBrandPages.has(brand.slug))
    .map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, brand: slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const brand = getBrandBySlug(slug, locale);
  if (!brand || dedicatedBrandPages.has(slug)) return {};

  return localizedPageMetadata({
    locale,
    pathname: `/brands/${brand.slug}`,
    title: brand.title,
    description: brand.description,
    image: `/opengraph-image?brand=${encodeURIComponent(brand.name)}&title=${encodeURIComponent(brand.title)}&subtitle=${encodeURIComponent(brand.description)}`,
  });
}

export default async function AdditionalBrandPage({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale: localeParam, brand: slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const brand = getBrandBySlug(slug, locale);
  if (!brand || dedicatedBrandPages.has(slug)) notFound();

  return (
    <BrandHubPage
      locale={locale}
      brandName={brand.name}
      brandPath={`/brands/${brand.slug}`}
      title={brand.title}
      description={brand.description}
      heroImage={brand.image}
      logo={brand.logo}
      intro={brand.intro}
      signals={brand.signals}
      focusAreas={brand.focusAreas}
      models={brand.models}
      problemAreas={brand.problemAreas}
      bestFor={brand.bestFor}
      contentTerms={brand.contentTerms}
    />
  );
}
