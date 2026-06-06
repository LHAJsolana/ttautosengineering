import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModelHubPage from "@/components/ModelHubPage";
import { getLocalizedModelPage, modelPages } from "@/lib/models";
import { canonical } from "@/lib/site";
import { defaultLocale, isLocale } from "@/lib/i18n";

const SITE_NAME = "TT AUTO'S Engineering";

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

  const path = `/models/${model.slug}`;
  return {
    title: model.title,
    description: model.description,
    alternates: { canonical: canonical(path, locale) },
    openGraph: {
      type: "website",
      url: canonical(path, locale),
      title: `${model.title} - ${SITE_NAME}`,
      description: model.description,
      siteName: SITE_NAME,
      images: [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${model.title} - ${SITE_NAME}`,
      description: model.description,
      images: ["/opengraph-image"],
    },
  };
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
