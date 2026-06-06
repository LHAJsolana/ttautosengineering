import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModelHubPage from "@/components/ModelHubPage";
import { getModelPage, modelPages } from "@/lib/models";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";

export function generateStaticParams() {
  return modelPages.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelPage(slug);
  if (!model) return {};

  const path = `/models/${model.slug}`;
  return {
    title: model.title,
    description: model.description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      type: "website",
      url: canonical(path),
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelPage(slug);
  if (!model) notFound();
  return <ModelHubPage model={model} />;
}
