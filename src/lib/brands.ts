import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type BrandData = {
  name: string;
  slug: string;
  logo?: string;
  image: string;
  title: string;
  description: string;
  intro: string;
  blurb: string;
  score: number;
  signals: { label: string; score: number }[];
  focusAreas: string[];
  models: string[];
  problemAreas: string[];
  highlights: string[];
  tags: string[];
  bestFor: string;
  contentTerms: string[];
};

export const brands: BrandData[] = [
  {
    name: "BMW",
    slug: "bmw",
    logo: "/bmw.svg",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
    title: "BMW Engineering Insights",
    description: "BMW reliability analysis, common problems, buying guides, and engineering-driven maintenance insights.",
    intro: "Technical analysis, reliability insights, and buying guidance for BMW vehicles, with an engineering mindset around engines, cooling, oil leaks, timing chains, and maintenance costs.",
    blurb: "Engine families, cooling systems, turbo stress, and ownership-cost signals.",
    score: 72,
    signals: [
      { label: "Service history sensitivity", score: 7 },
      { label: "Cooling system plastics / leaks", score: 5 },
      { label: "Oil leaks (gaskets / housing)", score: 5 },
      { label: "Timing chain risk (engine dependent)", score: 4 },
    ],
    focusAreas: ["Cold-start chain noise and idle quality", "Oil filter housing / valve cover leaks", "Cooling system plastics and coolant residue", "Turbo response and smoke under load"],
    models: ["1 Series", "3 Series", "5 Series", "X3", "X5", "N47", "B47", "N52", "B48"],
    problemAreas: ["Cooling", "Oil leaks", "Timing", "Turbo", "Electronics"],
    highlights: ["N/B engine families", "Cooling + leaks", "Pre-purchase checks"],
    tags: ["N47", "B47", "Oil leaks", "Cooling"],
    bestFor: "Drivers who want strong dynamics and are willing to maintain cooling, oil, and engine-family weak points before they become expensive.",
    contentTerms: ["BMW", "N47", "B47", "B48", "ZF 8HP"],
  },
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    logo: "/mercedes.svg",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1600&q=80",
    title: "Mercedes-Benz Engineering Insights",
    description: "Mercedes-Benz reliability analysis, common problems, buying guides, and engineering-driven ownership insights.",
    intro: "Reliability insights, common issues, and buying guidance for Mercedes-Benz, explained through engines, 7G/9G behavior, electronics, suspension, and ownership costs.",
    blurb: "Engines, 7G/9G behavior, electronics, and long-term cost drivers.",
    score: 70,
    signals: [
      { label: "Service history sensitivity", score: 7 },
      { label: "Diesel emissions systems", score: 5 },
      { label: "Electronics and battery voltage", score: 5 },
      { label: "Gearbox calibration and service", score: 6 },
    ],
    focusAreas: ["Full Mercedes-capable diagnostic scan", "AdBlue, NOx, DPF, and EGR health", "7G/9G low-speed shift behavior", "Battery voltage and electrical functions"],
    models: ["A-Class", "C-Class", "E-Class", "GLC", "S-Class", "OM651", "OM654", "9G-Tronic"],
    problemAreas: ["Emissions", "Electronics", "Gearbox", "Cooling", "Suspension"],
    highlights: ["7G/9G patterns", "Electronics", "Diesel emissions"],
    tags: ["OM651", "W205", "9G-Tronic", "Electronics"],
    bestFor: "Drivers prioritizing comfort and refinement who will verify electronics, emissions systems, and transmission behavior before buying.",
    contentTerms: ["Mercedes-Benz", "Mercedes", "OM651", "9G-Tronic", "AdBlue", "NOx"],
  },
  {
    name: "Audi",
    slug: "audi",
    logo: "/audi.svg",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1600&q=80",
    title: "Audi Engineering Insights",
    description: "Audi reliability analysis, common problems, TDI/TSI guidance, and engineering-driven buying insights.",
    intro: "Engineering notes on Audi platforms, TDI/TSI reliability, common failures, gearbox behavior, timing, oil consumption, cooling, and electronics.",
    blurb: "TDI/TSI guidance, oil consumption, timing, cooling, and gearbox behavior.",
    score: 68,
    signals: [
      { label: "Service history sensitivity", score: 7 },
      { label: "Timing / oil behavior by engine", score: 5 },
      { label: "DSG / gearbox history", score: 5 },
      { label: "Cooling and thermostat/water pump risk", score: 5 },
    ],
    focusAreas: ["Timing chain/belt evidence by engine family", "Oil consumption and leak history", "DSG, S tronic, or Multitronic behavior", "Cooling system and thermostat/water pump work"],
    models: ["A3", "A4", "A5", "A6", "Q5", "Q7", "EA888", "TDI", "DSG"],
    problemAreas: ["Timing", "Oil use", "Gearbox", "Cooling", "Carbon buildup"],
    highlights: ["TDI/TSI risks", "Timing + oil", "DSG / S tronic"],
    tags: ["EA888", "TDI", "DSG", "Oil use"],
    bestFor: "Buyers who verify the exact engine and gearbox combination, then insist on service proof before trusting the badge.",
    contentTerms: ["Audi", "EA888", "TFSI", "TDI", "DSG", "Haldex"],
  },
  {
    name: "Volkswagen",
    slug: "volkswagen",
    logo: "/volkswagen.svg",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
    title: "Volkswagen Engineering Insights",
    description: "Volkswagen reliability analysis, common problems (TSI/TDI/DSG), buying guides, and engineering-driven ownership insights.",
    intro: "Engineering notes on Volkswagen platforms: TSI/TDI reliability, DSG behavior, cooling weak points, sensors, oil consumption, and maintenance sensitivity.",
    blurb: "TSI/TDI and DSG deep dives, cooling weak points, sensors, and maintenance sensitivity.",
    score: 67,
    signals: [
      { label: "Parts availability / value", score: 8 },
      { label: "DSG service sensitivity", score: 5 },
      { label: "Cooling and sensor aging", score: 5 },
      { label: "Timing / oil behavior by engine", score: 5 },
    ],
    focusAreas: ["DSG service records and low-speed behavior", "Water pump / thermostat / coolant residue", "Timing components by TSI/TDI generation", "Service history and sensor-related faults"],
    models: ["Golf", "Passat", "Polo", "Tiguan", "Touareg", "MQB", "EA888", "TDI", "DSG"],
    problemAreas: ["DSG", "Cooling", "Timing", "Sensors", "Oil use"],
    highlights: ["DSG behavior", "Cooling weak points", "Service history"],
    tags: ["MQB", "DSG", "TSI", "TDI"],
    bestFor: "Budget-focused buyers who want strong parts availability and value, as long as service history and DSG/cooling checks are not skipped.",
    contentTerms: ["Volkswagen", "VW", "EA888", "TSI", "TDI", "DSG", "Haldex"],
  },
  {
    name: "Porsche",
    slug: "porsche",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    title: "Porsche Engineering Insights",
    description: "Porsche reliability, PDK, cooling, bore condition, air suspension, and used performance-car buying guidance.",
    intro: "Engineering-led Porsche buying guidance covering exact model and engine identification, PDK behavior, cooling stability, oil evidence, suspension systems, and the cost of deferred maintenance.",
    blurb: "Performance-car inspection, PDK evidence, cooling, oil analysis, and chassis condition.",
    score: 69,
    signals: [
      { label: "Driving experience and engineering", score: 9 },
      { label: "Specialist inspection importance", score: 8 },
      { label: "Deferred-maintenance cost", score: 4 },
      { label: "Model-specific engine risk", score: 5 },
    ],
    focusAreas: ["Cold-start noise, smoke, and oil-pressure evidence", "PDK or manual-clutch condition", "Cooling system and temperature stability", "Underbody, brakes, tires, and suspension options"],
    models: ["911", "Cayman", "Boxster", "Macan", "Cayenne", "Panamera", "PDK"],
    problemAreas: ["Cooling", "Oil use", "PDK", "Air suspension", "Bore condition"],
    highlights: ["Specialist inspection", "PDK behavior", "Model-specific risks"],
    tags: ["911", "Macan", "PDK", "Cooling"],
    bestFor: "Enthusiasts who can fund specialist inspection and preventive maintenance rather than buying the cheapest example.",
    contentTerms: ["Porsche", "PDK", "turbo", "PCV", "cooling", "oil", "misfire", "battery"],
  },
  {
    name: "MINI",
    slug: "mini",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
    title: "MINI Engineering Insights",
    description: "MINI reliability, BMW-derived engines, cooling, oil leaks, timing, turbo, and used-car buying guidance.",
    intro: "MINI ownership analysis focused on generation-specific BMW powertrains, compact cooling systems, oil and PCV faults, timing risk, electronics, and realistic maintenance budgets.",
    blurb: "BMW-derived engines in a compact package: cooling, timing, oil, turbo, and electronics.",
    score: 64,
    signals: [
      { label: "Driving character", score: 8 },
      { label: "Generation sensitivity", score: 5 },
      { label: "Cooling and oil leak exposure", score: 4 },
      { label: "Packaging and labor access", score: 4 },
    ],
    focusAreas: ["Identify exact engine family and generation", "Check coolant residue and oil leaks", "Listen for timing and cold-start noise", "Scan misfires, boost, temperature, and battery faults"],
    models: ["Cooper", "Cooper S", "Countryman", "Clubman", "B38", "B48"],
    problemAreas: ["Cooling", "Timing", "PCV", "Oil leaks", "Turbo"],
    highlights: ["Engine generation", "Compact cooling", "BMW powertrains"],
    tags: ["Cooper S", "B48", "PCV", "Cooling"],
    bestFor: "Drivers who value compact character and will choose by engine generation and condition rather than styling alone.",
    contentTerms: ["MINI", "B48", "PCV", "cooling", "timing chain", "misfire"],
  },
  {
    name: "Škoda",
    slug: "skoda",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
    title: "Škoda Engineering Insights",
    description: "Škoda reliability, TSI/TDI engines, DSG, cooling, Haldex, emissions systems, and practical used-car guidance.",
    intro: "Practical Škoda analysis built around shared Volkswagen Group platforms: TSI and TDI engine families, DSG maintenance, cooling modules, Haldex service, and emissions-system condition.",
    blurb: "VAG engineering with practical value: TSI/TDI, DSG, Haldex, cooling, and emissions.",
    score: 71,
    signals: [
      { label: "Practicality and value", score: 9 },
      { label: "Shared parts availability", score: 8 },
      { label: "DSG service sensitivity", score: 5 },
      { label: "Engine-generation dependency", score: 6 },
    ],
    focusAreas: ["Confirm exact TSI/TDI engine and gearbox", "Verify DSG fluid service where required", "Inspect cooling module and water-pump evidence", "Scan DPF, EGR, AdBlue, and Haldex systems"],
    models: ["Octavia", "Superb", "Kodiaq", "Karoq", "Fabia", "EA888", "TDI", "DSG"],
    problemAreas: ["DSG", "Cooling", "DPF", "EGR", "Haldex"],
    highlights: ["Practical value", "Shared VAG systems", "DSG and diesel checks"],
    tags: ["Octavia", "Superb", "DSG", "TDI"],
    bestFor: "Buyers wanting Volkswagen Group engineering and space with less badge cost, provided the exact drivetrain is verified.",
    contentTerms: ["Škoda", "Skoda", "EA888", "TSI", "TDI", "DSG", "Haldex", "DPF"],
  },
  {
    name: "SEAT / CUPRA",
    slug: "seat-cupra",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    title: "SEAT and CUPRA Engineering Insights",
    description: "SEAT and CUPRA reliability, EA888, TSI/TDI, DSG, Haldex, cooling, tuning history, and used-car buying guidance.",
    intro: "SEAT and CUPRA buying intelligence focused on Volkswagen Group engines and gearboxes, performance calibration, tuning evidence, DSG behavior, Haldex maintenance, cooling, and previous-owner use.",
    blurb: "VAG platforms with a sportier edge: EA888, DSG, Haldex, cooling, and tuning history.",
    score: 66,
    signals: [
      { label: "Performance per cost", score: 8 },
      { label: "Shared parts availability", score: 8 },
      { label: "Previous-owner use sensitivity", score: 4 },
      { label: "DSG and cooling dependence", score: 5 },
    ],
    focusAreas: ["Check tuning and modification history", "Verify DSG and Haldex service", "Inspect cooling module and oil behavior", "Test brakes, tires, mounts, and launch behavior"],
    models: ["Leon", "Ateca", "Formentor", "Ibiza", "EA888", "DSG", "Haldex"],
    problemAreas: ["Tuning", "DSG", "Cooling", "PCV", "Haldex"],
    highlights: ["Performance history", "EA888 checks", "DSG and Haldex"],
    tags: ["Leon", "Formentor", "EA888", "DSG"],
    bestFor: "Drivers seeking VAG performance value who will investigate tuning, launch use, tires, brakes, cooling, and gearbox service.",
    contentTerms: ["SEAT", "CUPRA", "EA888", "TSI", "TDI", "DSG", "Haldex", "PCV"],
  },
];

export const brandNames = brands.map((brand) => brand.name);

export function getBrandBySlug(slug: string, locale: Locale = "en") {
  const brand = brands.find((item) => item.slug === slug);
  return brand ? translateValue(locale, brand) : undefined;
}

export function getLocalizedBrands(locale: Locale) {
  return translateValue(locale, brands);
}

export function getBrandByName(name?: string) {
  const key = name?.trim().toLowerCase();
  if (!key) return undefined;
  return brands.find(
    (brand) =>
      brand.name.toLowerCase() === key ||
      brand.slug === key ||
      (brand.slug === "seat-cupra" && ["seat", "cupra"].includes(key)) ||
      (brand.slug === "skoda" && key === "škoda")
  );
}
