import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
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

export default function AudiPage() {
  return (
    <BrandHubPage
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
