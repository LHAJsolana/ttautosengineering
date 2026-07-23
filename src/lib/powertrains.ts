import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type PowertrainRisk = "Lower" | "Medium" | "Higher";
export type PowertrainKind = "Engine" | "Gearbox";
export type FuelType = "Petrol" | "Diesel" | "Transmission";

export type PowertrainData = {
  slug: string;
  name: string;
  kind: PowertrainKind;
  fuel: FuelType;
  brands: string[];
  years: string;
  score: number;
  risk: PowertrainRisk;
  summary: string;
  verdict: string;
  bestFor: string;
  image: string;
  aliases: string[];
  applications: string[];
  strengths: string[];
  commonProblems: string[];
  inspectionChecks: string[];
  servicePriorities: string[];
  relatedModels: string[];
};

export const powertrains: PowertrainData[] = [
  {
    slug: "bmw-n47",
    name: "BMW N47",
    kind: "Engine",
    fuel: "Diesel",
    brands: ["BMW"],
    years: "2007-2015",
    score: 58,
    risk: "Higher",
    summary:
      "Efficient four-cylinder diesel whose buying risk is dominated by timing-chain history and cold-start evidence.",
    verdict:
      "An N47 can still be a usable buy, but only when timing-chain condition, oil-service intervals, emissions health, and repair history are verified before purchase.",
    bestFor: "Buyers who find a documented example and can inspect it from a true cold start.",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1600&q=80",
    aliases: ["N47D20", "BMW 2.0 diesel"],
    applications: ["BMW 1 Series", "BMW 3 Series", "BMW 5 Series", "BMW X1", "BMW X3"],
    strengths: ["Strong fuel economy", "Good mid-range torque", "Wide parts and specialist support"],
    commonProblems: [
      "Rear-mounted timing-chain wear and expensive access",
      "EGR and DPF problems on short-trip cars",
      "Turbo and crankcase-breather wear",
      "Injector correction and glow-system faults",
    ],
    inspectionChecks: [
      "Hear the engine start completely cold and listen for metallic chain noise",
      "Verify invoices for timing work and frequent oil changes",
      "Scan DPF loading, EGR faults, injector corrections, and glow modules",
      "Check for smoke, uneven idle, boost hesitation, and oil leaks",
    ],
    servicePriorities: [
      "Use correct-spec oil at conservative intervals",
      "Do not ignore chain noise or unexplained metallic rasp",
      "Protect DPF health with suitable driving and prompt fault diagnosis",
    ],
    relatedModels: ["bmw-3-series", "bmw-5-series"],
  },
  {
    slug: "bmw-b47",
    name: "BMW B47",
    kind: "Engine",
    fuel: "Diesel",
    brands: ["BMW"],
    years: "2014-present",
    score: 74,
    risk: "Medium",
    summary:
      "A more mature BMW four-cylinder diesel with improved timing architecture but continued emissions and service sensitivity.",
    verdict:
      "The B47 is generally the safer modern BMW diesel choice. Clean oil history, cooling health, DPF use pattern, and EGR campaign evidence still matter.",
    bestFor: "High-mileage drivers who can support regular motorway use and disciplined maintenance.",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
    aliases: ["B47D20", "BMW 2.0d"],
    applications: ["BMW 1 Series", "BMW 3 Series", "BMW 5 Series", "BMW X1", "BMW X3"],
    strengths: ["Strong economy and torque", "Improved refinement", "Generally improved chain risk"],
    commonProblems: [
      "EGR cooler and emissions-system faults",
      "DPF loading on repeated short journeys",
      "Cooling-system leaks and plastic aging",
      "Intake contamination and sensor plausibility faults",
    ],
    inspectionChecks: [
      "Check EGR recall or campaign history where applicable",
      "Read DPF soot load, regeneration history, and stored emissions faults",
      "Inspect coolant level and residue around hoses and housings",
      "Confirm smooth cold idle and clean boost delivery",
    ],
    servicePriorities: [
      "Shorten oil intervals from the longest factory schedule",
      "Investigate coolant loss immediately",
      "Maintain conditions that allow complete DPF regeneration",
    ],
    relatedModels: ["bmw-3-series", "bmw-5-series"],
  },
  {
    slug: "bmw-b48",
    name: "BMW B48",
    kind: "Engine",
    fuel: "Petrol",
    brands: ["BMW"],
    years: "2014-present",
    score: 78,
    risk: "Lower",
    summary:
      "Modern turbo-petrol four-cylinder that is usually a strong base when cooling, oil leaks, and service intervals are controlled.",
    verdict:
      "The B48 is one of the more convincing modern BMW petrol choices. It is not maintenance-free, but its risks are usually inspectable and manageable.",
    bestFor: "Buyers wanting modern petrol performance without the highest-risk older engine families.",
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80",
    aliases: ["B48B20", "BMW 2.0 turbo petrol"],
    applications: ["BMW 1 Series", "BMW 3 Series", "BMW 5 Series", "BMW X1", "MINI models"],
    strengths: ["Strong performance", "Good efficiency", "Broad parts and tuning knowledge"],
    commonProblems: [
      "Cooling-system leaks and plastic components",
      "Oil-filter housing or gasket seepage",
      "PCV and crankcase-pressure faults",
      "Direct-injection deposits with unsuitable use patterns",
    ],
    inspectionChecks: [
      "Pressure-check the cooling system and inspect for dried residue",
      "Scan mixture, boost, misfire, and temperature plausibility data",
      "Check idle quality, crankcase vacuum, and oil consumption history",
      "Test from cold through full operating temperature",
    ],
    servicePriorities: [
      "Use correct oil and conservative change intervals",
      "Treat cooling leaks before overheating occurs",
      "Keep ignition components and crankcase ventilation healthy",
    ],
    relatedModels: ["bmw-3-series", "bmw-5-series"],
  },
  {
    slug: "mercedes-om651",
    name: "Mercedes-Benz OM651",
    kind: "Engine",
    fuel: "Diesel",
    brands: ["Mercedes-Benz"],
    years: "2008-2020",
    score: 68,
    risk: "Medium",
    summary:
      "Widely used diesel with strong fundamentals but meaningful injector, timing, cooling, and emissions-system dependencies.",
    verdict:
      "The OM651 rewards complete records and proper diagnosis. A clean scan and credible service history matter more than a freshly detailed engine bay.",
    bestFor: "Long-distance drivers buying a fully documented Mercedes diesel.",
    image:
      "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1600&q=80",
    aliases: ["OM 651", "CDI", "BlueTEC diesel"],
    applications: ["Mercedes C-Class", "Mercedes E-Class", "Mercedes GLK", "Mercedes Vito"],
    strengths: ["Good economy", "Strong torque", "High-mileage potential with correct care"],
    commonProblems: [
      "Injector seal or injector-related faults",
      "NOx, EGR, DPF, and AdBlue system failures",
      "Timing-chain wear on neglected examples",
      "Cooling leaks and thermostat problems",
    ],
    inspectionChecks: [
      "Run a full Mercedes-capable scan across engine and emissions modules",
      "Check injector corrections and listen for combustion irregularity",
      "Verify AdBlue, NOx, EGR, and DPF status rather than clearing warnings",
      "Inspect coolant temperature behavior and leak evidence",
    ],
    servicePriorities: [
      "Keep oil and fuel-filter service documented",
      "Resolve emissions faults before they create secondary problems",
      "Maintain battery voltage to avoid misleading electronic faults",
    ],
    relatedModels: ["mercedes-c-class", "mercedes-e-class", "mercedes-a-class"],
  },
  {
    slug: "vag-ea888",
    name: "VAG EA888",
    kind: "Engine",
    fuel: "Petrol",
    brands: ["Audi", "Volkswagen"],
    years: "2007-present",
    score: 66,
    risk: "Medium",
    summary:
      "A broad turbo-petrol engine family whose risk changes significantly by generation, oil behavior, timing design, and cooling history.",
    verdict:
      "Do not buy an EA888 by badge alone. Identify the exact generation and engine code, then verify oil consumption, timing adaptation, cooling, and PCV behavior.",
    bestFor: "Buyers prepared to identify the exact engine generation before comparing cars.",
    image:
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1600&q=80",
    aliases: ["2.0 TFSI", "2.0 TSI", "EA888 Gen 2", "EA888 Gen 3"],
    applications: ["Audi A3", "Audi A4", "Volkswagen Golf GTI", "Volkswagen Passat", "Volkswagen Tiguan"],
    strengths: ["Strong performance", "Excellent parts availability", "Later generations can be solid"],
    commonProblems: [
      "Oil consumption on specific earlier generations",
      "Timing-chain tensioner or stretch concerns",
      "Water-pump and thermostat-housing leaks",
      "PCV failure and direct-injection carbon buildup",
    ],
    inspectionChecks: [
      "Confirm the engine code and EA888 generation",
      "Ask for measured oil-consumption history, not verbal reassurance",
      "Inspect cooling housings and scan timing adaptation values",
      "Check PCV behavior, idle quality, misfire counts, and boost control",
    ],
    servicePriorities: [
      "Use correct oil and monitor consumption",
      "Address cooling leaks early",
      "Maintain ignition, PCV, and intake condition",
    ],
    relatedModels: ["audi-a4", "audi-a3", "volkswagen-golf", "volkswagen-passat"],
  },
  {
    slug: "vag-dq250-dsg",
    name: "VAG DQ250 DSG",
    kind: "Gearbox",
    fuel: "Transmission",
    brands: ["Audi", "Volkswagen"],
    years: "2003-present",
    score: 71,
    risk: "Medium",
    summary:
      "Six-speed wet-clutch dual-clutch gearbox that can be durable when fluid service and mechatronics health are taken seriously.",
    verdict:
      "The DQ250 is not automatically fragile. The real dividing line is service proof, adaptation quality, fault history, and behavior both cold and hot.",
    bestFor: "Drivers who want fast shifts and can maintain the gearbox on schedule.",
    image:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=80",
    aliases: ["02E DSG", "6-speed DSG", "S tronic"],
    applications: ["Volkswagen Golf", "Volkswagen Passat", "Audi A3", "Audi TT", "Skoda Octavia"],
    strengths: ["Fast shifts", "Strong torque capacity", "Good durability with correct servicing"],
    commonProblems: [
      "Mechatronics pressure or solenoid faults",
      "Clutch wear and adaptation limits",
      "Flywheel noise or vibration",
      "Poor behavior after neglected fluid and filter service",
    ],
    inspectionChecks: [
      "Verify documented DSG fluid and filter changes",
      "Test reverse engagement, hill starts, crawling, and hot low-speed traffic",
      "Scan gearbox faults, temperatures, clutch adaptations, and pressure data",
      "Listen for flywheel rattle and check for shift flare or harsh engagement",
    ],
    servicePriorities: [
      "Service fluid and filter at the correct interval",
      "Diagnose hesitation before replacing parts by guesswork",
      "Use correct procedures for adaptation and fluid level",
    ],
    relatedModels: ["volkswagen-golf", "volkswagen-passat", "audi-a3"],
  },
  {
    slug: "zf-8hp",
    name: "ZF 8HP",
    kind: "Gearbox",
    fuel: "Transmission",
    brands: ["BMW", "Audi", "Volkswagen"],
    years: "2008-present",
    score: 82,
    risk: "Lower",
    summary:
      "Widely respected eight-speed automatic whose long-term quality still depends on fluid condition, sealing, adaptation, and drivetrain context.",
    verdict:
      "The ZF 8HP is a strong automatic, not a maintenance-free one. Smooth behavior and credible fluid-service history make it one of the safer premium gearbox choices.",
    bestFor: "Buyers wanting a smooth, efficient automatic with broad specialist support.",
    image:
      "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1600&q=80",
    aliases: ["8HP45", "8HP50", "8HP70", "8-speed ZF"],
    applications: ["BMW 3 Series", "BMW 5 Series", "BMW X3", "Audi models", "Volkswagen Touareg"],
    strengths: ["Smooth shifts", "Good efficiency", "Strong torque capacity", "Wide specialist knowledge"],
    commonProblems: [
      "Pan, sleeve, or connector sealing leaks",
      "Shift quality deterioration with old fluid",
      "Valve-body or adaptation issues at higher mileage",
      "Torque-converter symptoms that can resemble engine faults",
    ],
    inspectionChecks: [
      "Test cold and hot shifts including reverse and low-speed traffic",
      "Inspect the pan and connector area for seepage",
      "Read gearbox adaptations and stored ratio or pressure faults",
      "Verify the exact fluid, pan, and service procedure used",
    ],
    servicePriorities: [
      "Use the correct ZF-compatible fluid and service procedure",
      "Repair leaks before fluid level becomes critical",
      "Investigate shudder and flare before secondary damage develops",
    ],
    relatedModels: ["bmw-3-series", "bmw-5-series", "audi-a6"],
  },
  {
    slug: "mercedes-9g-tronic",
    name: "Mercedes-Benz 9G-Tronic",
    kind: "Gearbox",
    fuel: "Transmission",
    brands: ["Mercedes-Benz"],
    years: "2013-present",
    score: 73,
    risk: "Medium",
    summary:
      "Efficient nine-speed automatic that needs correct fluid service, software context, and careful low-speed testing.",
    verdict:
      "A healthy 9G-Tronic suits modern Mercedes cars well. Hesitation, harsh engagement, or repeated software explanations deserve proper scan data and service evidence.",
    bestFor: "Drivers prioritizing refinement and motorway efficiency.",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
    aliases: ["9G-Tronic", "725.0", "9-speed Mercedes automatic"],
    applications: ["Mercedes C-Class", "Mercedes E-Class", "Mercedes GLC", "Mercedes S-Class"],
    strengths: ["Excellent cruising efficiency", "Wide ratio spread", "Smooth when healthy"],
    commonProblems: [
      "Low-speed hesitation or harsh engagement",
      "Software and adaptation-related shift complaints",
      "Fluid-service neglect",
      "Valve-body or control faults on problematic examples",
    ],
    inspectionChecks: [
      "Drive from cold through full temperature in comfort and sport modes",
      "Test reverse, parking maneuvers, kickdown, and stop-start traffic",
      "Scan gearbox control data and verify software campaign history",
      "Confirm fluid-service records use the correct specification",
    ],
    servicePriorities: [
      "Follow the correct fluid and filter schedule",
      "Keep battery and charging voltage healthy",
      "Use diagnosis and adaptation data before authorizing major repairs",
    ],
    relatedModels: ["mercedes-c-class", "mercedes-e-class"],
  },
];

export function getPowertrain(slug: string) {
  return powertrains.find((item) => item.slug === slug);
}

export function getLocalizedPowertrains(locale: Locale) {
  return powertrains.map((powertrain) => translateValue(locale, powertrain));
}

export function getLocalizedPowertrain(slug: string, locale: Locale) {
  const powertrain = getPowertrain(slug);
  return powertrain ? translateValue(locale, powertrain) : undefined;
}
