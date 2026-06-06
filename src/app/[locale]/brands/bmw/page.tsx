import type { Metadata } from "next";
import BrandHubPage from "@/components/BrandHubPage";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const BRAND_NAME = "BMW";
const BRAND_PATH = "/brands/bmw";
const TITLE = "BMW Engineering Insights";
const DESCRIPTION =
  "BMW reliability analysis, common problems, buying guides, and engineering-driven maintenance insights.";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80";
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

export default function BMWPage() {
  return (
    <BrandHubPage
      brandName={BRAND_NAME}
      brandPath={BRAND_PATH}
      title={TITLE}
      description={DESCRIPTION}
      heroImage={HERO_IMAGE}
      logo="/bmw.svg"
      intro="Technical analysis, reliability insights, and buying guidance for BMW vehicles, with an engineering mindset around engines, cooling, oil leaks, timing chains, and maintenance costs."
      signals={[
        { label: "Service history sensitivity", score: 7 },
        { label: "Cooling system plastics / leaks", score: 5 },
        { label: "Oil leaks (gaskets / housing)", score: 5 },
        { label: "Timing chain risk (engine dependent)", score: 4 },
      ]}
      focusAreas={[
        "Cold-start chain noise and idle quality",
        "Oil filter housing / valve cover leaks",
        "Cooling system plastics and coolant residue",
        "Turbo response and smoke under load",
      ]}
      models={["3 Series", "5 Series", "X3", "X5", "N47", "B47", "N52", "B48"]}
      problemAreas={["Cooling", "Oil leaks", "Timing", "Turbo", "Electronics"]}
      bestFor="Drivers who want strong dynamics and are willing to maintain cooling, oil, and engine-family weak points before they become expensive."
    />
  );
}
