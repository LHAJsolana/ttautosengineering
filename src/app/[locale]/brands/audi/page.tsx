import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";

const BRAND_NAME = "Audi";
const BRAND_PATH = "/brands/audi";
const TITLE = "Audi Engineering Insights";
const DESCRIPTION =
  "Audi reliability analysis, common problems, TDI/TSI guidance, and engineering-driven buying insights.";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1600&q=80";
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

export default async function AudiPage({
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
      logo="/audi.svg"
      intro="Engineering notes on Audi platforms, TDI/TSI reliability, common failures, gearbox behavior, timing, oil consumption, cooling, and electronics."
      signals={[
        { label: "Service history sensitivity", score: 7 },
        { label: "Timing / oil behavior by engine", score: 5 },
        { label: "DSG / gearbox history", score: 5 },
        { label: "Cooling and thermostat/water pump risk", score: 5 },
      ]}
      focusAreas={[
        "Timing chain/belt evidence by engine family",
        "Oil consumption and leak history",
        "DSG, S tronic, or Multitronic behavior",
        "Cooling system and thermostat/water pump work",
      ]}
      models={["A3", "A4", "A5", "A6", "Q5", "EA888", "TDI", "DSG"]}
      problemAreas={["Timing", "Oil use", "Gearbox", "Cooling", "Carbon buildup"]}
      bestFor="Buyers who verify the exact engine and gearbox combination, then insist on service proof before trusting the badge."
    />
  );
}
