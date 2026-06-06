import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PowertrainHubPage from "@/components/PowertrainHubPage";
import { getPowertrain, powertrains } from "@/lib/powertrains";
import { canonical } from "@/lib/site";

export function generateStaticParams() {
  return powertrains.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const powertrain = getPowertrain(slug);
  if (!powertrain) return {};

  const title = `${powertrain.name} Reliability and Buying Guide`;
  const path = `/powertrains/${powertrain.slug}`;
  return {
    title,
    description: powertrain.summary,
    alternates: { canonical: canonical(path) },
    openGraph: {
      type: "article",
      url: canonical(path),
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const powertrain = getPowertrain(slug);
  if (!powertrain) notFound();
  return <PowertrainHubPage powertrain={powertrain} />;
}
