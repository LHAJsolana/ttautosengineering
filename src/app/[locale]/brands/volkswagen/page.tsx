import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";

const BRAND_NAME = "Volkswagen";
const BRAND_PATH = "/brands/volkswagen";
const TITLE = "Volkswagen Engineering Insights";
const DESCRIPTION =
  "Volkswagen reliability analysis, common problems (TSI/TDI/DSG), buying guides, and engineering-driven ownership insights.";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80";
const OG_IMAGE = `/opengraph-image?brand=${encodeURIComponent(
  BRAND_NAME
)}&title=${encodeURIComponent(TITLE)}&subtitle=${encodeURIComponent(DESCRIPTION)}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: BRAND_PATH,
    title: TITLE,
    description: DESCRIPTION,
    image: OG_IMAGE,
  });
}

export default async function VolkswagenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;

  return (
    <BrandHubPage
      locale={locale}
      brandName={BRAND_NAME}
      brandPath={BRAND_PATH}
      title={TITLE}
      description={DESCRIPTION}
      heroImage={HERO_IMAGE}
      logo="/volkswagen.svg"
      intro="Engineering notes on Volkswagen platforms: TSI/TDI reliability, DSG behavior, cooling weak points, sensors, oil consumption, and maintenance sensitivity."
      signals={[
        { label: "Parts availability / value", score: 8 },
        { label: "DSG service sensitivity", score: 5 },
        { label: "Cooling and sensor aging", score: 5 },
        { label: "Timing / oil behavior by engine", score: 5 },
      ]}
      focusAreas={[
        "DSG service records and low-speed behavior",
        "Water pump / thermostat / coolant residue",
        "Timing components by TSI/TDI generation",
        "Service history and sensor-related faults",
      ]}
      models={["Golf", "Passat", "Tiguan", "Polo", "MQB", "EA888", "TDI", "DSG"]}
      problemAreas={["DSG", "Cooling", "Timing", "Sensors", "Oil use"]}
      bestFor="Budget-focused buyers who want strong parts availability and value, as long as service history and DSG/cooling checks are not skipped."
    />
  );
}
