import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type ModelYearData = {
  slug: string;
  modelSlug: string;
  model: string;
  year: number;
  generation: string;
  score: number;
  risk: "Lower" | "Medium" | "Higher";
  title: string;
  description: string;
  verdict: string;
  bestChoice: string;
  avoidIf: string;
  highlights: string[];
  inspection: string[];
  relatedPowertrains: string[];
};

export const modelYears: ModelYearData[] = [
  {
    slug: "bmw-3-series-2018",
    modelSlug: "bmw-3-series",
    model: "BMW 3 Series",
    year: 2018,
    generation: "F30 late production",
    score: 75,
    risk: "Medium",
    title: "2018 BMW 3 Series Reliability and Buying Guide",
    description: "A model-year view of the late F30 BMW 3 Series, including B47/B48 choices, inspection priorities, and ownership risk.",
    verdict: "One of the more mature F30 years. Engine choice, cooling health, oil leaks, and ZF service evidence remain more important than trim level.",
    bestChoice: "A documented B48 petrol or B47 diesel matched to the buyer's driving pattern.",
    avoidIf: "Cooling loss, warning lights, rough cold starts, or gearbox hesitation are explained away without invoices and scan evidence.",
    highlights: ["Late-generation F30 development", "Strong B-series engine choices", "Broad specialist and parts support"],
    inspection: ["Cold-start engine and listen carefully", "Pressure-check cooling system", "Scan all modules", "Verify automatic-transmission servicing"],
    relatedPowertrains: ["bmw-b47", "bmw-b48", "zf-8hp"],
  },
  {
    slug: "bmw-3-series-2020",
    modelSlug: "bmw-3-series",
    model: "BMW 3 Series",
    year: 2020,
    generation: "G20 early production",
    score: 78,
    risk: "Lower",
    title: "2020 BMW 3 Series Reliability and Buying Guide",
    description: "Reliability signals, engine choices, electronics checks, and inspection priorities for the 2020 G20 BMW 3 Series.",
    verdict: "A convincing modern 3 Series when software history, cooling integrity, and complete servicing are confirmed.",
    bestChoice: "A standard-output B48 petrol with full digital and invoice history.",
    avoidIf: "The car has unresolved driver-assistance, cooling, battery-voltage, or drivetrain warnings.",
    highlights: ["Strong B48 and ZF pairing", "Modern safety and infotainment", "Good daily efficiency"],
    inspection: ["Run a BMW-capable full scan", "Test every driver-assistance feature", "Check coolant residue", "Confirm tire and alignment condition"],
    relatedPowertrains: ["bmw-b47", "bmw-b48", "zf-8hp"],
  },
  {
    slug: "mercedes-c-class-2019",
    modelSlug: "mercedes-c-class",
    model: "Mercedes-Benz C-Class",
    year: 2019,
    generation: "W205 facelift",
    score: 73,
    risk: "Medium",
    title: "2019 Mercedes-Benz C-Class Reliability and Buying Guide",
    description: "A focused guide to 2019 W205 C-Class reliability, 9G-Tronic behavior, diesel emissions, electronics, and used-car checks.",
    verdict: "The facelift W205 is refined and mature, but scan quality and emissions-system verification decide whether it is a calm buy.",
    bestChoice: "A petrol or regularly motorway-driven diesel with clean diagnostics and complete servicing.",
    avoidIf: "AdBlue, NOx, battery, gearbox, or electrical warnings are present without a documented diagnosis.",
    highlights: ["Mature W205 platform", "Comfortable long-distance behavior", "Wide engine availability"],
    inspection: ["Check battery and charging voltage", "Scan SCR/NOx systems on diesels", "Test 9G-Tronic cold and hot", "Operate every cabin feature"],
    relatedPowertrains: ["mercedes-om651", "mercedes-9g-tronic"],
  },
  {
    slug: "audi-a4-2018",
    modelSlug: "audi-a4",
    model: "Audi A4",
    year: 2018,
    generation: "B9",
    score: 74,
    risk: "Medium",
    title: "2018 Audi A4 Reliability and Buying Guide",
    description: "2018 Audi A4 B9 reliability, EA888 and TDI checks, S tronic behavior, cooling risks, and pre-purchase priorities.",
    verdict: "A refined B9 year with strong fundamentals. Exact engine code, cooling integrity, oil behavior, and gearbox history still control the risk.",
    bestChoice: "A serviced mainstream engine with clean oil history and smooth S tronic operation.",
    avoidIf: "There is unexplained coolant loss, oil consumption, timing noise, or delayed gearbox engagement.",
    highlights: ["High-quality B9 cabin", "Efficient engine range", "Strong motorway comfort"],
    inspection: ["Identify exact engine and gearbox codes", "Inspect thermostat and coolant system", "Review oil-use history", "Scan gearbox adaptations and faults"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
  {
    slug: "audi-a4-2020",
    modelSlug: "audi-a4",
    model: "Audi A4",
    year: 2020,
    generation: "B9 facelift",
    score: 77,
    risk: "Lower",
    title: "2020 Audi A4 Reliability and Buying Guide",
    description: "2020 facelift Audi A4 reliability, engine and S tronic choices, digital systems, cooling checks, and ownership planning.",
    verdict: "A mature B9 choice with improved technology. Clean cooling, software, gearbox, and service records make it one of the stronger A4 years covered.",
    bestChoice: "A mainstream petrol specification with complete oil, cooling, and transmission records.",
    avoidIf: "Digital-system warnings, coolant loss, oil consumption, or gearbox hesitation remain unresolved.",
    highlights: ["Mature facelift platform", "Efficient modern engines", "Strong cabin technology"],
    inspection: ["Scan driver-assistance modules", "Inspect coolant housings", "Verify S tronic servicing", "Review oil-level history"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
  {
    slug: "volkswagen-golf-2019",
    modelSlug: "volkswagen-golf",
    model: "Volkswagen Golf",
    year: 2019,
    generation: "Golf Mk7.5",
    score: 76,
    risk: "Medium",
    title: "2019 Volkswagen Golf Reliability and Buying Guide",
    description: "A buyer-focused view of the 2019 Golf Mk7.5, covering TSI/TDI engines, DSG servicing, cooling, electronics, and inspection.",
    verdict: "A mature Golf year and a strong all-round used buy when the exact drivetrain has been maintained correctly.",
    bestChoice: "A simple, documented specification with the drivetrain matched to annual mileage.",
    avoidIf: "DSG service is missing, coolant is low, warning lamps are active, or modifications obscure the car's history.",
    highlights: ["Mature Mk7 platform", "Excellent everyday usability", "Good parts availability"],
    inspection: ["Confirm wet- or dry-clutch DSG type", "Check cooling-system residue", "Scan engine and gearbox", "Inspect driver-assistance sensors"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
  {
    slug: "volkswagen-golf-2017",
    modelSlug: "volkswagen-golf",
    model: "Volkswagen Golf",
    year: 2017,
    generation: "Golf Mk7",
    score: 72,
    risk: "Medium",
    title: "2017 Volkswagen Golf Reliability and Buying Guide",
    description: "2017 Golf Mk7 reliability, TSI and TDI choices, DSG history, water-pump checks, and practical used-car inspection advice.",
    verdict: "A well-understood Golf year with broad support. DSG type, cooling history, exact engine code, and usage pattern remain decisive.",
    bestChoice: "A simple, unmodified specification with complete annual servicing and a drivetrain suited to the buyer's mileage.",
    avoidIf: "Coolant loss, DSG shudder, emissions warnings, or tuning modifications complicate the evidence.",
    highlights: ["Proven Mk7 platform", "Excellent parts support", "Strong everyday packaging"],
    inspection: ["Identify exact DSG type", "Inspect water-pump area", "Scan engine and gearbox", "Check for modification history"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
  {
    slug: "bmw-x5-2019",
    modelSlug: "bmw-x5",
    model: "BMW X5",
    year: 2019,
    generation: "G05 early production",
    score: 71,
    risk: "Medium",
    title: "2019 BMW X5 Reliability and Buying Guide",
    description: "2019 BMW X5 G05 ownership risk, air suspension, electronics, B-series engines, xDrive, and pre-purchase inspection priorities.",
    verdict: "Highly capable, but complexity makes a full-system inspection essential. A good engine cannot compensate for neglected chassis electronics or suspension.",
    bestChoice: "A standard, documented six-cylinder specification without unresolved chassis or electrical warnings.",
    avoidIf: "Air suspension sinks, tires mismatch, cooling loss is present, or the scan shows repeated network and chassis faults.",
    highlights: ["Strong long-distance ability", "Excellent drivetrain choices", "Modern cabin and safety technology"],
    inspection: ["Leave air suspension parked and recheck height", "Verify matching tires", "Scan every chassis module", "Inspect cooling and transfer-case behavior"],
    relatedPowertrains: ["bmw-b47", "zf-8hp"],
  },
  {
    slug: "audi-q5-2020",
    modelSlug: "audi-q5",
    model: "Audi Q5",
    year: 2020,
    generation: "FY pre-facelift",
    score: 72,
    risk: "Medium",
    title: "2020 Audi Q5 Reliability and Buying Guide",
    description: "2020 Audi Q5 reliability, EA888/TDI considerations, S tronic, quattro, cooling, and electronic-system checks.",
    verdict: "A polished premium SUV whose risk depends on drivetrain identification, cooling health, gearbox service, and electronic condition.",
    bestChoice: "A mainstream engine with full service records and clean gearbox and quattro diagnostics.",
    avoidIf: "The seller cannot explain coolant loss, drivetrain vibration, warning lights, or missing transmission service.",
    highlights: ["Refined cabin", "Secure road manners", "Useful family packaging"],
    inspection: ["Confirm actual quattro system", "Check gearbox service history", "Inspect cooling housings", "Test MMI and driver-assistance systems"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
  {
    slug: "volkswagen-tiguan-2020",
    modelSlug: "volkswagen-tiguan",
    model: "Volkswagen Tiguan",
    year: 2020,
    generation: "Second generation",
    score: 70,
    risk: "Medium",
    title: "2020 Volkswagen Tiguan Reliability and Buying Guide",
    description: "2020 Volkswagen Tiguan reliability, TSI/TDI and DSG checks, 4Motion servicing, cooling leaks, and ownership planning.",
    verdict: "A practical family SUV that can be a sensible buy, provided DSG, cooling, emissions, and 4Motion servicing are verified.",
    bestChoice: "A modest-output, unmodified car with complete annual service and drivetrain records.",
    avoidIf: "There is DSG shudder, coolant residue, diesel emissions trouble, or mismatched tires on a 4Motion car.",
    highlights: ["Practical interior", "Wide drivetrain choice", "Good independent support"],
    inspection: ["Test DSG in slow traffic", "Check Haldex/4Motion service", "Inspect water-pump area", "Scan emissions systems on diesels"],
    relatedPowertrains: ["vag-ea888", "vag-dq250-dsg"],
  },
];

export function getModelYear(slug: string) {
  return modelYears.find((item) => item.slug === slug);
}

export function getLocalizedModelYears(locale: Locale) {
  return modelYears.map((item) => ({
    ...translateValue(locale, item),
    slug: item.slug,
    modelSlug: item.modelSlug,
    relatedPowertrains: item.relatedPowertrains,
  }));
}

export function getLocalizedModelYear(slug: string, locale: Locale) {
  const item = getModelYear(slug);
  return item
    ? {
        ...translateValue(locale, item),
        slug: item.slug,
        modelSlug: item.modelSlug,
        relatedPowertrains: item.relatedPowertrains,
      }
    : undefined;
}
