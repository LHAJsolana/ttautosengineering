import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
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

export default function VolkswagenPage() {
  return (
    <BrandHubPage
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
