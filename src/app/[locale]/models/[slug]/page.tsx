import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModelHubPage from "@/components/ModelHubPage";
import { getLocalizedModelPage, modelPages } from "@/lib/models";
import { localizedPageMetadata } from "@/lib/site";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return modelPages.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const model = getLocalizedModelPage(slug, locale);
  if (!model) return {};

  return localizedPageMetadata({
    locale,
    pathname: `/models/${model.slug}`,
    title: model.title,
    description: model.description,
  });
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const model = getLocalizedModelPage(slug, locale);
  if (!model) notFound();
  return <ModelHubPage model={model} locale={locale} />;
}
