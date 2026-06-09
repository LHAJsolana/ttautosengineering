import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";

const BRAND_NAME = "Mercedes-Benz";
const BRAND_PATH = "/brands/mercedes-benz";
const TITLE = "Mercedes-Benz Engineering Insights";
const DESCRIPTION =
  "Mercedes-Benz reliability analysis, common problems, buying guides, and engineering-driven ownership insights.";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1600&q=80";
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

export default async function MercedesPage({
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
      logo="/mercedes.svg"
      intro="Reliability insights, common issues, and buying guidance for Mercedes-Benz, explained through engines, 7G/9G behavior, electronics, suspension, and ownership costs."
      signals={[
        { label: "Drivetrain durability when maintained", score: 7 },
        { label: "Electronics / module sensitivity", score: 5 },
        { label: "Diesel emissions and injector risk", score: 5 },
        { label: "Suspension and age-related cost", score: 5 },
      ]}
      focusAreas={[
        "Cold-start quality and injector behavior",
        "7G/9G shift quality and service history",
        "Electronics, battery health, and stored faults",
        "Suspension wear and leak-prone areas",
      ]}
      models={["C-Class", "E-Class", "GLC", "W205", "W213", "OM651", "M274", "9G-Tronic"]}
      problemAreas={["Electronics", "Injectors", "Emissions", "Gearbox", "Suspension"]}
      bestFor="Owners who want comfort and durability, but verify electronics, transmission behavior, and diesel/emissions history before purchase."
    />
  );
}
