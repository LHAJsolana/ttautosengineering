import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
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

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(BRAND_PATH) },
  openGraph: {
    type: "website",
    url: canonical(BRAND_PATH),
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function MercedesPage() {
  return (
    <BrandHubPage
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
