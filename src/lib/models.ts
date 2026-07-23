import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type ModelPageData = {
  slug: string;
  name: string;
  brand: string;
  brandHref: string;
  title: string;
  description: string;
  heroImage: string;
  score: number;
  verdict: string;
  bestFor: string;
  watchOut: string;
  marketPosition: string;
  ownershipPlan: string[];
  engines: {
    label: string;
    note: string;
    risk: "Lower" | "Medium" | "Higher";
  }[];
  commonProblems: string[];
  inspectionChecklist: string[];
  searchTopics: string[];
};

export type BestUsedBuyScores = {
  reliability: number;
  repairCost: number;
  partsAvailability: number;
  fuelEconomy: number;
  resale: number;
};

export type ModelWarningSections = {
  commonEngineProblems: string[];
  gearboxIssues: string[];
  mileageDangerZones: string[];
  whatToCheckBeforeBuying: string[];
};

const MODEL_HERO_IMAGES = {
  "bmw-3-series": "https://images.unsplash.com/photo-1630165695908-e68c9f2e8a29?auto=format&fit=crop&w=1800&q=80",
  "bmw-5-series": "https://images.unsplash.com/photo-1652890041546-2de2829c43b5?auto=format&fit=crop&w=1800&q=80",
  "bmw-x5": "https://images.unsplash.com/photo-1635990215241-4d2805d729bb?auto=format&fit=crop&w=1800&q=80",
  "bmw-x3": "https://images.unsplash.com/photo-1677961019377-d45643fde74f?auto=format&fit=crop&w=1800&q=80",
  "bmw-1-series": "https://images.unsplash.com/photo-1600268330186-76564be81357?auto=format&fit=crop&w=1800&q=80",
  "bmw-4-series": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1800&q=80",
  "bmw-7-series": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1800&q=80",
  "bmw-x1": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1800&q=80",
  "mercedes-c-class": "https://images.unsplash.com/photo-1589667679944-aa672d42dd76?auto=format&fit=crop&w=1800&q=80",
  "mercedes-e-class": "https://images.unsplash.com/photo-1624085568108-36410cfe4d24?auto=format&fit=crop&w=1800&q=80",
  "mercedes-a-class": "https://images.unsplash.com/photo-1593081727404-575eeb723999?auto=format&fit=crop&w=1800&q=80",
  "mercedes-glc": "https://images.unsplash.com/photo-1619466548431-54ffb2fe2674?auto=format&fit=crop&w=1800&q=80",
  "mercedes-s-class": "https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?auto=format&fit=crop&w=1800&q=80",
  "mercedes-cla": "https://images.unsplash.com/photo-1622206346001-2f40bd4c23c0?auto=format&fit=crop&w=1800&q=80",
  "mercedes-gla": "/images/models/mercedes-gla-x156.webp",
  "mercedes-gle": "https://images.unsplash.com/photo-1610647752706-3bb12232b3ff?auto=format&fit=crop&w=1800&q=80",
  "audi-a4": "https://images.unsplash.com/photo-1611758433285-3ea014b434eb?auto=format&fit=crop&w=1800&q=80",
  "audi-a3": "https://images.unsplash.com/photo-1561924563-d9ad0f32b23f?auto=format&fit=crop&w=1800&q=80",
  "audi-q5": "https://images.unsplash.com/photo-1599912027806-cfec9f5944b6?auto=format&fit=crop&w=1800&q=80",
  "audi-a6": "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1800&q=80",
  "audi-a5": "https://images.unsplash.com/photo-1618849985511-7dbc48d7d2e4?auto=format&fit=crop&w=1800&q=80",
  "audi-q7": "https://images.unsplash.com/photo-1532974143451-8162d38a1257?auto=format&fit=crop&w=1800&q=80",
  "audi-a1": "https://images.unsplash.com/photo-1612911912304-9005873d7e10?auto=format&fit=crop&w=1800&q=80",
  "audi-q3": "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-golf": "https://images.unsplash.com/photo-1605475300127-0a31e8273bc2?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-passat": "https://images.unsplash.com/photo-1607082615064-eb85a8c1f4cd?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-tiguan": "https://images.unsplash.com/photo-1760713164476-7eb5063b3d07?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-polo": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-touareg": "https://images.unsplash.com/photo-1623013274387-45cbcbc1725b?auto=format&fit=crop&w=1800&q=80",
  "volkswagen-arteon": "/images/models/volkswagen-arteon.webp",
  "volkswagen-t-roc": "/images/models/volkswagen-t-roc.webp",
  "bmw-2-series": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1800&q=80",
  "bmw-x6": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=80",
  "mercedes-b-class": "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1800&q=80",
  "audi-q8": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=80",
} as const;

export const modelPages: ModelPageData[] = [
  {
    slug: "bmw-3-series",
    name: "BMW 3 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 3 Series Used Buying Guide",
    description:
      "BMW 3 Series reliability, engine risks, common problems, and pre-purchase checks for used buyers.",
    heroImage: MODEL_HERO_IMAGES["bmw-3-series"],
    score: 72,
    verdict:
      "A strong used buy when the engine family is understood and service history is real. Cooling, oil leaks, timing risk, and gearbox service proof matter more than cosmetic condition.",
    bestFor: "Drivers who want a balanced daily car with strong dynamics and manageable upkeep.",
    watchOut:
      "Avoid cars with vague oil service history, unresolved coolant loss, chain noise, gearbox hesitation, or seller pressure.",
    marketPosition:
      "Best judged by generation and engine code. A clean 3 Series can be one of the sharpest daily drivers in the segment, but a cheap neglected car quickly becomes a repair queue.",
    ownershipPlan: [
      "Budget for a baseline oil service, coolant inspection, filters, brake fluid, and a full diagnostic scan after purchase.",
      "Treat cooling and oil leaks early; small seepage around BMW gaskets can become expensive if ignored.",
      "If the car is automatic, verify ZF service history or plan a proper fluid/filter service.",
    ],
    engines: [
      { label: "N52 petrol", note: "Often a strong base if cooling and gasket issues are handled.", risk: "Lower" },
      { label: "N47 diesel", note: "Timing chain history is essential before purchase.", risk: "Higher" },
      { label: "B47 diesel", note: "Generally improved, but still needs clean service proof.", risk: "Medium" },
      { label: "B48 petrol", note: "Good modern option; inspect cooling, oil leaks, and scan data.", risk: "Medium" },
    ],
    commonProblems: [
      "Cooling system plastics, water pump, thermostat, and coolant residue.",
      "Oil filter housing, valve cover, and gasket leaks.",
      "Timing chain risk on specific diesel generations.",
      "ZF automatic service proof and shift quality.",
      "Suspension wear, run-flat tire harshness, and alignment issues.",
    ],
    inspectionChecklist: [
      "Listen from cold for chain rattle, rough idle, or smoke.",
      "Inspect oil filter housing, valve cover, and underside for leaks.",
      "Check coolant level, residue, and previous cooling-system invoices.",
      "Scan engine, gearbox, ABS, and body modules before buying.",
      "Test gearbox shifts cold and warm, including reverse and low-speed traffic.",
    ],
    searchTopics: ["BMW 3 Series", "N47", "B47", "ZF 8HP", "oil leak", "cooling"],
  },
  {
    slug: "mercedes-c-class",
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz C-Class Used Buying Guide",
    description:
      "Mercedes-Benz C-Class reliability, diesel emissions risks, electronics checks, gearbox behavior, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-c-class"],
    score: 70,
    verdict:
      "A comfortable used car when the drivetrain and electronics are healthy. Service history, scan quality, and emissions-system status are decisive on modern diesel examples.",
    bestFor: "Buyers who want comfort, refinement, and a calmer ownership experience than a sport-focused saloon.",
    watchOut:
      "Be careful with warning lights, AdBlue/NOx faults, unexplained electrical behavior, and incomplete service records.",
    marketPosition:
      "The C-Class is usually a comfort-first buy. It rewards buyers who scan deeply, test every electrical feature, and avoid cars with emissions faults hidden behind fresh detailing.",
    ownershipPlan: [
      "Start ownership with battery and charging-system checks because weak voltage can create misleading faults.",
      "Confirm transmission behavior cold and hot, especially on urban stop-start test drives.",
      "For diesels, verify NOx, AdBlue, DPF, and EGR health before trusting the asking price.",
    ],
    engines: [
      { label: "OM651 diesel", note: "Can be durable with correct service and clean emissions health.", risk: "Medium" },
      { label: "OM654 diesel", note: "Modern and efficient; emissions and sensor systems need verification.", risk: "Medium" },
      { label: "M274 petrol", note: "Inspect timing, cooling, oil leaks, and scan data.", risk: "Medium" },
      { label: "AMG variants", note: "Performance wear and maintenance cost change the buying logic.", risk: "Higher" },
    ],
    commonProblems: [
      "NOx sensor, AdBlue, SCR, and diesel emissions warnings.",
      "Battery voltage issues causing misleading electronic faults.",
      "7G/9G gearbox behavior and service proof.",
      "Suspension wear, bushings, and alignment.",
      "Interior electronics, sensors, and module faults by generation.",
    ],
    inspectionChecklist: [
      "Run a full Mercedes-capable diagnostic scan, not only generic OBD.",
      "Verify AdBlue/NOx readiness and no start-countdown history.",
      "Check gearbox shifts at low speed and during light throttle.",
      "Inspect service records for oil, filters, brake fluid, and gearbox work.",
      "Test every electrical feature before negotiating.",
    ],
    searchTopics: ["C-Class", "OM651", "AdBlue", "NOx sensor", "9G-Tronic", "diesel"],
  },
  {
    slug: "audi-a4",
    name: "Audi A4",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi A4 Used Buying Guide",
    description:
      "Audi A4 reliability, TFSI/TDI engine risks, quattro and S tronic checks, oil consumption, timing, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-a4"],
    score: 68,
    verdict:
      "A refined used car with strong long-distance ability, but engine generation and gearbox history make a huge difference. Confirm the exact engine, not just the badge.",
    bestFor: "Buyers who want refinement, cabin quality, and secure road feel with verified service history.",
    watchOut:
      "Walk carefully around oil consumption, timing chain risk, neglected S tronic service, and quattro/Haldex assumptions.",
    marketPosition:
      "The A4 is strong when the exact engine and gearbox are understood. Badge, trim, and quattro branding are less important than engine generation, oil behavior, and service evidence.",
    ownershipPlan: [
      "Confirm engine code before applying generic TFSI/TDI advice.",
      "Build an early baseline around oil level tracking, coolant inspection, and gearbox adaptation/scan data.",
      "If quattro is fitted, confirm which system it uses and whether the relevant fluid service has been done.",
    ],
    engines: [
      { label: "EA888 TFSI", note: "Generation matters for timing and oil consumption risk.", risk: "Medium" },
      { label: "2.0 TDI", note: "Strong when serviced; check emissions and injector data.", risk: "Medium" },
      { label: "V6 TDI", note: "Smooth and capable, but repairs and emissions costs rise.", risk: "Higher" },
      { label: "S/RS variants", note: "Performance maintenance history is non-negotiable.", risk: "Higher" },
    ],
    commonProblems: [
      "EA888 timing chain and oil consumption on sensitive generations.",
      "Carbon buildup on direct-injection petrol engines.",
      "S tronic/DSG service intervals and mechatronics symptoms.",
      "Cooling leaks, thermostat housings, and sensor faults.",
      "Quattro system assumptions: verify actual drivetrain type and service.",
    ],
    inspectionChecklist: [
      "Confirm engine code and gearbox type before applying reliability advice.",
      "Check for oil consumption history and timing chain invoices.",
      "Scan gearbox and engine modules after a proper test drive.",
      "Inspect coolant residue and listen for cold-start rattle.",
      "Verify quattro/Haldex service if applicable.",
    ],
    searchTopics: ["Audi A4", "EA888", "TFSI", "TDI", "S tronic", "oil consumption"],
  },
  {
    slug: "volkswagen-golf",
    name: "Volkswagen Golf",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Golf Used Buying Guide",
    description:
      "Volkswagen Golf reliability, TSI/TDI engine checks, DSG service history, Haldex notes, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-golf"],
    score: 67,
    verdict:
      "A strong value choice when service history is complete. The Golf can be cheap to run or expensive to catch up depending on DSG, cooling, sensors, and engine-specific maintenance.",
    bestFor: "Buyers who want practical daily usability, parts availability, and a wide choice of engines.",
    watchOut:
      "Do not buy on reputation alone. DSG service proof, cooling health, TSI timing/oil behavior, and diesel emissions condition all matter.",
    marketPosition:
      "The Golf is the practical benchmark, but the spread between a well-kept car and a neglected one is wide. Buy the history and drivetrain, not only the badge.",
    ownershipPlan: [
      "Check DSG, Haldex, coolant, and timing-related paperwork before spending on cosmetics.",
      "Use a scan to catch misfire counters, emissions readiness, and gearbox faults.",
      "Plan preventive maintenance immediately if the records are incomplete but the car is otherwise strong.",
    ],
    engines: [
      { label: "1.9 TDI legacy", note: "Known for durability, but age and condition now dominate.", risk: "Lower" },
      { label: "2.0 TDI", note: "Good with service proof; emissions and injector checks matter.", risk: "Medium" },
      { label: "TSI petrol", note: "Check timing, oil use, PCV, cooling, and misfires.", risk: "Medium" },
      { label: "GTI / R", note: "Fast and capable; inspect modifications and DSG/Haldex service.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service neglect, mechatronics symptoms, and low-speed behavior.",
      "Cooling leaks, thermostat housings, and water pump issues.",
      "PCV faults, carbon buildup, and misfires on direct-injection petrols.",
      "Diesel emissions and EGR/DPF/NOx-related faults.",
      "Haldex service on AWD models where applicable.",
    ],
    inspectionChecklist: [
      "Ask for DSG service invoices if the car is automatic.",
      "Check coolant loss, heater behavior, and water pump/thermostat history.",
      "Scan for misfires, emissions readiness, and gearbox faults.",
      "Inspect modifications, tires, brakes, and suspension wear.",
      "For AWD models, verify Haldex service and rear axle engagement.",
    ],
    searchTopics: ["Volkswagen Golf", "DSG", "TSI", "TDI", "Haldex", "PCV"],
  },
  {
    slug: "bmw-5-series",
    name: "BMW 5 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 5 Series Used Buying Guide",
    description:
      "BMW 5 Series reliability, diesel and petrol engine risks, ZF gearbox checks, suspension wear, and executive-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-5-series"],
    score: 71,
    verdict:
      "A refined executive car that can handle high mileage well when servicing is disciplined. The risk is buying one that looks premium but has delayed cooling, gearbox, emissions, or suspension work.",
    bestFor: "Long-distance drivers who want comfort, torque, and a calmer BMW than the smaller sport-focused models.",
    watchOut:
      "Watch for air suspension faults on equipped cars, oil leaks, diesel emissions warnings, coolant loss, and vague gearbox behavior.",
    marketPosition:
      "The 5 Series is often better value than it should be because running costs scare casual buyers. That value only works when you verify maintenance instead of trusting presentation.",
    ownershipPlan: [
      "Baseline the car with fluids, filters, scan report, and a cooling-system inspection.",
      "For diesel examples, check DPF, EGR, NOx, and injector data before purchase.",
      "Inspect suspension arms, dampers, tires, and alignment because heavy executive cars can hide wear.",
    ],
    engines: [
      { label: "N57 diesel", note: "Strong when maintained, but timing, emissions, and oil leaks need checks.", risk: "Medium" },
      { label: "B47 diesel", note: "Efficient option; verify service intervals and emissions health.", risk: "Medium" },
      { label: "B48 petrol", note: "Good balance; inspect cooling, PCV, oil leaks, and scan data.", risk: "Medium" },
      { label: "Six-cylinder petrol", note: "Desirable, but maintenance cost and cooling health matter.", risk: "Medium" },
    ],
    commonProblems: [
      "Oil leaks around common gasket areas and filter housings.",
      "Cooling-system plastics, thermostat, and water pump age.",
      "ZF gearbox service neglect or low-speed hesitation.",
      "Diesel emissions faults including EGR, DPF, AdBlue, and NOx systems.",
      "Suspension arms, dampers, air suspension, and tire wear.",
    ],
    inspectionChecklist: [
      "Drive the car cold and warm, including low-speed traffic and motorway acceleration.",
      "Check cooling residue, oil leaks, and undertray dampness.",
      "Scan engine, gearbox, suspension, and body modules.",
      "Verify gearbox service, brake fluid, coolant, and differential service where applicable.",
      "Inspect tire brands and wear; cheap mismatched tires often signal wider neglect.",
    ],
    searchTopics: ["BMW 5 Series", "N57", "B47", "ZF 8HP", "EGR", "DPF"],
  },
  {
    slug: "bmw-x5",
    name: "BMW X5",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW X5 Used Buying Guide",
    description:
      "BMW X5 reliability, xDrive checks, diesel engine risks, air suspension, cooling, and used SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-x5"],
    score: 64,
    verdict:
      "A capable premium SUV, but it is not a cheap car to rescue. Weight, xDrive hardware, tires, suspension, diesel emissions, and cooling systems all raise the cost of neglected ownership.",
    bestFor: "Buyers who need space, towing ability, road presence, and can budget like they own a premium SUV.",
    watchOut:
      "Avoid cars with cheap tires, suspension warning lights, coolant leaks, transfer case shudder, or diesel emissions faults.",
    marketPosition:
      "The X5 is tempting because used prices drop hard. The smart buy is the car with boring paperwork, matched tires, and no mystery warnings.",
    ownershipPlan: [
      "Budget more than a saloon for tires, brakes, suspension, and fluid services.",
      "Verify xDrive/transfer case behavior and matched tire sizes before purchase.",
      "Treat air suspension and diesel-emissions faults as negotiation points, not minor annoyances.",
    ],
    engines: [
      { label: "N57 diesel", note: "Popular and capable; timing, emissions, and oil leaks need proof.", risk: "Medium" },
      { label: "B57 diesel", note: "Improved modern option; still scan emissions and boost systems.", risk: "Medium" },
      { label: "V8 petrol", note: "Performance is strong, but heat, oil leaks, and costs are high.", risk: "Higher" },
      { label: "Plug-in hybrid", note: "Check battery health, charging history, and cooling complexity.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor fatigue, and ride-height faults.",
      "Transfer case wear, xDrive shudder, and mismatched tire damage.",
      "Cooling leaks, oil leaks, and boost/vacuum issues.",
      "Diesel EGR, DPF, AdBlue, and NOx faults.",
      "Heavy brake, tire, and suspension wear.",
    ],
    inspectionChecklist: [
      "Check all tires match in size, brand, tread depth, and load rating.",
      "Test tight low-speed turns for xDrive shudder.",
      "Raise and lower suspension modes if fitted and inspect overnight sag.",
      "Scan drivetrain, suspension, body, and emissions modules.",
      "Review invoices for transfer case, gearbox, differential, and brake work.",
    ],
    searchTopics: ["BMW X5", "xDrive", "N57", "B57", "air suspension", "transfer case"],
  },
  {
    slug: "mercedes-e-class",
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz E-Class Used Buying Guide",
    description:
      "Mercedes-Benz E-Class reliability, diesel emissions checks, gearbox behavior, air suspension, electronics, and executive-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-e-class"],
    score: 73,
    verdict:
      "A strong long-distance car when bought carefully. The E-Class can feel expensive to fix only when buyers ignore electronics, suspension, diesel emissions, or gearbox symptoms before purchase.",
    bestFor: "Drivers who value comfort, motorway stability, and a mature executive-car feel.",
    watchOut:
      "Be cautious with Airmatic faults, AdBlue/NOx warnings, low battery health, gearbox jolts, and incomplete service records.",
    marketPosition:
      "The E-Class is usually at its best as a documented, well-serviced cruiser. Taxi-mileage examples can still be good, but only when records are exceptional.",
    ownershipPlan: [
      "Start with a Mercedes-capable scan and battery health check.",
      "Plan gearbox and brake-fluid service if the paperwork is unclear.",
      "Inspect suspension height, tire wear, and all comfort electronics before negotiating.",
    ],
    engines: [
      { label: "OM651 diesel", note: "Durable with proof; check injectors, EGR, DPF, and NOx systems.", risk: "Medium" },
      { label: "OM654 diesel", note: "Efficient and modern; emissions-system health is decisive.", risk: "Medium" },
      { label: "M274 petrol", note: "Good when maintained; inspect timing, cooling, and oil leaks.", risk: "Medium" },
      { label: "AMG variants", note: "Brilliant but costlier; brakes, tires, and service proof matter.", risk: "Higher" },
    ],
    commonProblems: [
      "AdBlue, NOx, EGR, and DPF warning chains.",
      "Airmatic or rear air-spring leaks on equipped cars.",
      "Battery voltage causing electrical oddities.",
      "7G/9G gearbox shift quality and service gaps.",
      "Interior electronics, sensors, and comfort-system faults.",
    ],
    inspectionChecklist: [
      "Run a full module scan and save the report before purchase.",
      "Check suspension height after sitting and during mode changes.",
      "Verify emissions readiness and no start-countdown history.",
      "Test seats, windows, parking sensors, cameras, climate, and infotainment.",
      "Drive over rough roads to expose suspension knocks.",
    ],
    searchTopics: ["E-Class", "OM651", "OM654", "Airmatic", "AdBlue", "9G-Tronic"],
  },
  {
    slug: "mercedes-a-class",
    name: "Mercedes-Benz A-Class",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz A-Class Used Buying Guide",
    description:
      "Mercedes-Benz A-Class reliability, compact Mercedes ownership costs, diesel and petrol checks, dual-clutch behavior, and buyer advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-a-class"],
    score: 66,
    verdict:
      "A stylish compact car, but it needs a calmer inspection than the badge suggests. Gearbox behavior, electronics, diesel emissions, and trim condition separate good buys from expensive fashion choices.",
    bestFor: "Buyers who want a premium-feeling compact car and can verify maintenance properly.",
    watchOut:
      "Avoid rough dual-clutch shifts, warning lights, damp interiors, poor crash repairs, and diesel emissions issues.",
    marketPosition:
      "The A-Class often attracts first premium-car buyers, so many examples are bought on looks. The better buy is the less flashy car with clear records and clean diagnostics.",
    ownershipPlan: [
      "Check every cabin feature because compact premium electronics still cost premium money.",
      "Test dual-clutch behavior in traffic, reverse, hill starts, and light throttle.",
      "Budget for tires, brakes, filters, and scan-based maintenance after purchase.",
    ],
    engines: [
      { label: "1.5/1.6 diesel", note: "Efficient; check emissions, EGR, DPF, and service intervals.", risk: "Medium" },
      { label: "M270/M260 petrol", note: "Inspect cooling, oil leaks, misfires, and timing noises.", risk: "Medium" },
      { label: "A35/A45 AMG", note: "Performance models need strict service and modification checks.", risk: "Higher" },
      { label: "Plug-in hybrid", note: "Check battery, charging, cooling, and warranty history.", risk: "Higher" },
    ],
    commonProblems: [
      "Dual-clutch hesitation, judder, or neglected service.",
      "Electrical features, screens, sensors, and battery voltage faults.",
      "Diesel EGR/DPF/NOx-related warnings.",
      "Suspension knocks and tire wear from city use.",
      "Interior wear that does not match mileage claims.",
    ],
    inspectionChecklist: [
      "Test stop-start traffic shifts, reverse engagement, and hill starts.",
      "Scan for gearbox, emissions, and body-module faults.",
      "Check infotainment, cameras, parking sensors, and steering controls.",
      "Inspect tires, wheel damage, suspension noise, and accident repair signs.",
      "Verify service intervals and brake-fluid records.",
    ],
    searchTopics: ["A-Class", "dual clutch", "M270", "DPF", "NOx sensor", "electronics"],
  },
  {
    slug: "audi-a3",
    name: "Audi A3",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi A3 Used Buying Guide",
    description:
      "Audi A3 reliability, TFSI/TDI checks, S tronic service, Haldex, oil consumption, timing, and compact premium buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-a3"],
    score: 67,
    verdict:
      "A premium-feeling compact with Golf-family engineering underneath. It can be sensible, but S tronic service, TFSI oil behavior, diesel emissions, and Haldex maintenance need proof.",
    bestFor: "Buyers who want compact size, strong cabin quality, and VW Group parts availability.",
    watchOut:
      "Be careful with oil use, timing rattle, mechatronics symptoms, cheap modifications, and quattro models with no Haldex history.",
    marketPosition:
      "The A3 is strongest when bought as a well-kept MQB car, not as a discounted badge. The drivetrain details decide the risk.",
    ownershipPlan: [
      "Confirm engine, gearbox, and quattro/Haldex equipment before inspection.",
      "Track oil consumption after purchase and keep service intervals conservative.",
      "Baseline DSG/S tronic and Haldex service if records are missing.",
    ],
    engines: [
      { label: "EA888 TFSI", note: "Generation matters; check oil consumption, PCV, and timing.", risk: "Medium" },
      { label: "1.4/1.5 TSI", note: "Efficient; inspect cooling, misfires, and service records.", risk: "Medium" },
      { label: "2.0 TDI", note: "Capable; scan emissions, injector data, and DPF readiness.", risk: "Medium" },
      { label: "S3/RS3", note: "Fast but modification and maintenance history are crucial.", risk: "Higher" },
    ],
    commonProblems: [
      "S tronic service gaps and mechatronics symptoms.",
      "TFSI PCV, carbon buildup, timing, and oil consumption.",
      "Cooling leaks and thermostat/water pump issues.",
      "Diesel EGR, DPF, and NOx-related faults.",
      "Haldex service neglect on quattro models.",
    ],
    inspectionChecklist: [
      "Confirm exact engine and gearbox codes.",
      "Check DSG/S tronic service records and test low-speed shifts.",
      "Inspect coolant residue, oil level history, and cold-start behavior.",
      "Scan for misfires, gearbox faults, and emissions readiness.",
      "Verify Haldex service for quattro cars.",
    ],
    searchTopics: ["Audi A3", "EA888", "S tronic", "Haldex", "TFSI", "TDI"],
  },
  {
    slug: "audi-q5",
    name: "Audi Q5",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi Q5 Used Buying Guide",
    description:
      "Audi Q5 reliability, quattro checks, TFSI/TDI risks, S tronic service, oil consumption, suspension, and SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-q5"],
    score: 65,
    verdict:
      "A refined family SUV, but weight and drivetrain complexity make poor maintenance expensive. Confirm engine generation, gearbox history, quattro service, and tire condition.",
    bestFor: "Families who want comfort, premium cabin feel, and all-weather confidence with maintenance budget.",
    watchOut:
      "Avoid oil consumption history, rough S tronic shifts, coolant leaks, cheap tires, and neglected quattro/driveline service.",
    marketPosition:
      "The Q5 can be a sensible premium SUV if it has the paperwork. Without that, it is a heavier A4 with higher parts, tires, and drivetrain exposure.",
    ownershipPlan: [
      "Inspect tires, brakes, suspension, and driveline fluids early.",
      "Use a full scan to check gearbox, emissions, parking sensors, and body modules.",
      "Track coolant and oil after purchase; small leaks are common negotiation clues.",
    ],
    engines: [
      { label: "2.0 TFSI", note: "Check oil consumption, timing, PCV, and carbon buildup.", risk: "Medium" },
      { label: "2.0 TDI", note: "Efficient and common; emissions health matters.", risk: "Medium" },
      { label: "3.0 TDI", note: "Smooth and strong, but repairs and emissions costs rise.", risk: "Higher" },
      { label: "Plug-in hybrid", note: "Check charging, battery, cooling, and warranty paperwork.", risk: "Higher" },
    ],
    commonProblems: [
      "S tronic/Tiptronic behavior and service history.",
      "Oil consumption, timing, PCV, and carbon buildup on petrols.",
      "Diesel emissions faults and sensor warnings.",
      "Cooling leaks, thermostat, and water pump issues.",
      "Suspension, brakes, tires, and alignment wear from SUV weight.",
    ],
    inspectionChecklist: [
      "Check all tires match and inspect inner-edge wear.",
      "Test gearbox shifts cold, warm, reverse, and low-speed maneuvering.",
      "Scan engine, gearbox, parking, body, and emissions modules.",
      "Inspect for coolant residue, oil leaks, and undertray dampness.",
      "Review quattro/driveline service where applicable.",
    ],
    searchTopics: ["Audi Q5", "quattro", "TFSI", "TDI", "S tronic", "oil consumption"],
  },
  {
    slug: "volkswagen-passat",
    name: "Volkswagen Passat",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Passat Used Buying Guide",
    description:
      "Volkswagen Passat reliability, TDI checks, DSG service, emissions systems, suspension, and used family-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-passat"],
    score: 69,
    verdict:
      "A practical, comfortable family car that makes sense with complete service history. DSG, diesel emissions, cooling, and suspension condition are the big checks.",
    bestFor: "Buyers who need space, comfort, economy, and sensible running costs.",
    watchOut:
      "Be careful with high-mileage cars hiding DSG neglect, EGR/DPF faults, tired suspension, or poor fleet maintenance.",
    marketPosition:
      "The Passat is a rational used buy when it has been maintained like a working car, not merely cleaned like a retail car.",
    ownershipPlan: [
      "Check DSG and timing-belt/water-pump records before falling for mileage or trim.",
      "For diesels, verify DPF, EGR, AdBlue, and injector health with scan data.",
      "Inspect suspension and tires because family/load use can hide wear.",
    ],
    engines: [
      { label: "2.0 TDI", note: "Mainstream choice; emissions and service proof are key.", risk: "Medium" },
      { label: "1.4/1.5 TSI", note: "Efficient petrols; inspect cooling, timing, and misfires.", risk: "Medium" },
      { label: "BiTDI", note: "Strong but more complex; turbo and emissions costs rise.", risk: "Higher" },
      { label: "GTE hybrid", note: "Check battery, charging, cooling, and hybrid service records.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service neglect and low-speed shift symptoms.",
      "Diesel EGR, DPF, AdBlue, and NOx faults.",
      "Timing belt/water pump service gaps on relevant engines.",
      "Suspension bushings, dampers, and tire wear.",
      "Electrical features and parking sensor/camera faults.",
    ],
    inspectionChecklist: [
      "Verify timing belt, water pump, DSG, and brake-fluid records.",
      "Scan for emissions readiness and stored gearbox faults.",
      "Test motorway pull, low-speed shifts, reverse, and hill starts.",
      "Inspect boot, rear seats, tires, brakes, and suspension for family/fleet wear.",
      "Check coolant level stability and heater performance.",
    ],
    searchTopics: ["Volkswagen Passat", "2.0 TDI", "DSG", "AdBlue", "EGR", "timing belt"],
  },
  {
    slug: "volkswagen-tiguan",
    name: "Volkswagen Tiguan",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Tiguan Used Buying Guide",
    description:
      "Volkswagen Tiguan reliability, TSI/TDI checks, DSG and Haldex service, cooling issues, emissions faults, and SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-tiguan"],
    score: 66,
    verdict:
      "A useful family SUV, but drivetrain service history matters. DSG, Haldex, cooling, TSI timing, and diesel emissions decide whether it is sensible or costly.",
    bestFor: "Families who want a compact SUV with practical space, familiar VW controls, and wide parts support.",
    watchOut:
      "Avoid cars with no DSG/Haldex invoices, coolant loss, rough shifts, diesel warning lights, or mismatched tires.",
    marketPosition:
      "The Tiguan is popular, which means prices can stay high even when maintenance is average. Do not pay premium money for missing paperwork.",
    ownershipPlan: [
      "Baseline DSG and Haldex service if the car has them and records are unclear.",
      "Inspect cooling system and water-pump/thermostat history before purchase.",
      "Scan for emissions, misfires, gearbox, and AWD faults.",
    ],
    engines: [
      { label: "2.0 TDI", note: "Common and capable; check emissions, DPF, EGR, and service.", risk: "Medium" },
      { label: "1.4/1.5 TSI", note: "Smooth daily option; inspect timing, cooling, and misfires.", risk: "Medium" },
      { label: "2.0 TSI", note: "Stronger performance; oil, PCV, timing, and cooling need checks.", risk: "Medium" },
      { label: "4Motion models", note: "Verify Haldex service and tire matching.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service neglect and mechatronics symptoms.",
      "Haldex pump/filter service neglect on AWD cars.",
      "Cooling leaks, thermostat, and water pump failure.",
      "Diesel emissions faults and sensor warnings.",
      "Suspension, brakes, and tires worn by SUV weight.",
    ],
    inspectionChecklist: [
      "Ask for DSG and Haldex invoices before the test drive.",
      "Check tire matching and test tight turns for AWD issues.",
      "Inspect coolant residue around pump/thermostat areas.",
      "Scan engine, gearbox, AWD, parking, and body modules.",
      "Drive in traffic and on open road to expose shift and boost behavior.",
    ],
    searchTopics: ["Volkswagen Tiguan", "DSG", "Haldex", "2.0 TDI", "TSI", "cooling"],
  },
  {
    slug: "audi-a6",
    name: "Audi A6",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi A6 Used Buying Guide",
    description:
      "Audi A6 reliability, TDI and TFSI risks, quattro checks, gearbox service, electronics, air suspension, and executive-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-a6"],
    score: 70,
    verdict:
      "A refined executive car with real long-distance ability. It becomes expensive when buyers overlook gearbox behavior, diesel emissions, quattro service, air suspension, or electronic faults.",
    bestFor: "Drivers who want quiet motorway pace, cabin quality, and strong diesel or quattro capability.",
    watchOut:
      "Watch for V6 diesel emissions costs, S tronic/Tiptronic behavior, air suspension faults, oil leaks, and battery-related electronics issues.",
    marketPosition:
      "The A6 is often excellent value against its original price. Treat that discount as room for maintenance, not as free luxury.",
    ownershipPlan: [
      "Scan all modules and confirm battery health before trusting the electronics.",
      "Verify gearbox, differential, quattro, and air-suspension service where applicable.",
      "Use tire condition and brake quality as clues to how the car was run.",
    ],
    engines: [
      { label: "2.0 TDI", note: "Efficient and common; check emissions, injectors, and DPF.", risk: "Medium" },
      { label: "3.0 TDI", note: "Excellent cruiser; timing, emissions, and repair costs rise.", risk: "Higher" },
      { label: "2.0 TFSI", note: "Inspect timing, oil consumption, PCV, and carbon buildup.", risk: "Medium" },
      { label: "S/RS variants", note: "Performance models need specialist inspection and records.", risk: "Higher" },
    ],
    commonProblems: [
      "Diesel EGR, DPF, AdBlue, and NOx faults.",
      "Gearbox service gaps, hesitation, or harsh engagement.",
      "Air suspension leaks on equipped cars.",
      "MMI, sensors, cameras, and battery-voltage-related faults.",
      "Oil leaks, coolant leaks, and heavy suspension wear.",
    ],
    inspectionChecklist: [
      "Run a full Audi/VAG-capable scan after a proper road test.",
      "Test gearbox behavior in traffic, reverse, and steady acceleration.",
      "Check air suspension height changes and overnight settling.",
      "Verify emissions readiness and no hidden warning history.",
      "Inspect tires, brakes, suspension arms, and service invoices.",
    ],
    searchTopics: ["Audi A6", "3.0 TDI", "quattro", "S tronic", "AdBlue", "air suspension"],
  },
  {
    slug: "bmw-x3",
    name: "BMW X3",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW X3 Used Buying Guide",
    description:
      "BMW X3 reliability, xDrive checks, B47/B48/N57 engine notes, transfer case risk, suspension wear, and used SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-x3"],
    score: 68,
    verdict:
      "A useful premium SUV when drivetrain history is clean. The X3 needs the same BMW engine checks as the saloons, plus extra attention to xDrive, tires, suspension, and cooling load.",
    bestFor: "Buyers who want a compact premium SUV with BMW dynamics and can verify driveline maintenance.",
    watchOut:
      "Avoid mismatched tires, transfer case shudder, coolant loss, rough ZF shifts, diesel emissions warnings, and vague service records.",
    marketPosition:
      "The X3 sits in the sweet spot between daily usability and SUV running cost. It is sensible only when tire matching, xDrive behavior, and engine condition are checked properly.",
    ownershipPlan: [
      "Confirm all tires match in size, brand, tread depth, and load rating before judging xDrive behavior.",
      "Baseline fluids, filters, coolant inspection, and a full module scan after purchase.",
      "Plan suspension and brake inspection early because SUV weight hides wear well.",
    ],
    engines: [
      { label: "B47 diesel", note: "Efficient and common; verify emissions, EGR, DPF, and service intervals.", risk: "Medium" },
      { label: "N57 diesel", note: "Strong in larger versions, but timing, oil leaks, and emissions costs rise.", risk: "Medium" },
      { label: "B48 petrol", note: "Good all-rounder; inspect cooling, PCV, oil leaks, and scan data.", risk: "Medium" },
      { label: "M40i / M variants", note: "Desirable but tire, brake, cooling, and modification checks become stricter.", risk: "Higher" },
    ],
    commonProblems: [
      "xDrive transfer case wear from mismatched tires or old fluid.",
      "Cooling-system plastics, coolant residue, and thermostat/water pump age.",
      "Diesel EGR, DPF, AdBlue, and NOx faults on modern examples.",
      "Oil leaks around common BMW gasket and housing areas.",
      "Suspension arms, dampers, brakes, and tire wear from SUV weight.",
    ],
    inspectionChecklist: [
      "Test tight low-speed turns for drivetrain shudder.",
      "Inspect tire match, inner-edge wear, brakes, and suspension arms.",
      "Scan engine, gearbox, transfer case, ABS, body, and emissions modules.",
      "Check coolant level stability and oil leak evidence underneath.",
      "Verify gearbox, transfer case, differential, and brake-fluid invoices where available.",
    ],
    searchTopics: ["BMW X3", "xDrive", "B47", "B48", "transfer case", "EGR"],
  },
  {
    slug: "bmw-1-series",
    name: "BMW 1 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 1 Series Used Buying Guide",
    description:
      "BMW 1 Series reliability, N47/B47/B48 engine checks, timing risk, cooling, oil leaks, and compact BMW buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-1-series"],
    score: 67,
    verdict:
      "A fun compact car when bought by engine and maintenance history, not just badge. Timing, cooling, oil leaks, and previous-owner use decide whether it feels clever or costly.",
    bestFor: "Drivers who want compact size, BMW handling, and lower running costs than larger models.",
    watchOut:
      "Be careful with timing noise, tuned cars, poor tires, oil leaks, coolant loss, clutch/gearbox wear, and missing oil-service proof.",
    marketPosition:
      "The 1 Series attracts mixed ownership. The best cars are boringly documented; the risky ones are modified, under-serviced, or dressed up for sale.",
    ownershipPlan: [
      "Identify the exact engine family before applying reliability advice.",
      "Use cold start, scan data, oil leak inspection, and coolant checks as the first filter.",
      "Budget for tires, brakes, filters, fluids, and alignment after purchase.",
    ],
    engines: [
      { label: "N47 diesel", note: "Timing chain evidence is essential before purchase.", risk: "Higher" },
      { label: "B47 diesel", note: "Improved diesel option, but emissions and service history still matter.", risk: "Medium" },
      { label: "B38/B48 petrol", note: "Good daily engines; inspect cooling, PCV, oil leaks, and misfires.", risk: "Medium" },
      { label: "M135i / M140i", note: "Strong performance; inspect modifications, cooling, tires, brakes, and differential use.", risk: "Higher" },
    ],
    commonProblems: [
      "Timing chain risk on specific diesel generations.",
      "Oil filter housing, valve cover, and gasket leaks.",
      "Cooling-system leaks, thermostat, and water pump faults.",
      "Clutch, dual-mass flywheel, or automatic gearbox wear.",
      "Suspension, tire, and alignment issues from hard use.",
    ],
    inspectionChecklist: [
      "Listen from cold for chain rattle and rough idle.",
      "Inspect oil leaks from above and underneath.",
      "Scan engine, gearbox, ABS, and body modules.",
      "Check tire quality, brake condition, suspension knocks, and alignment.",
      "Verify oil service frequency and any timing or cooling invoices.",
    ],
    searchTopics: ["BMW 1 Series", "N47", "B47", "B48", "timing chain", "oil leak"],
  },
  {
    slug: "mercedes-glc",
    name: "Mercedes-Benz GLC",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz GLC Used Buying Guide",
    description:
      "Mercedes-Benz GLC reliability, OM651/OM654 diesel checks, 9G-Tronic behavior, 4Matic, suspension, electronics, and SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-glc"],
    score: 68,
    verdict:
      "A comfortable premium SUV when electronics, emissions, gearbox, and suspension are healthy. The GLC is not hard to like, but neglected examples can hide expensive faults behind a clean cabin.",
    bestFor: "Families and commuters who want comfort, refinement, and a calmer SUV than sportier rivals.",
    watchOut:
      "Avoid AdBlue/NOx warnings, rough 9G shifts, battery-voltage faults, suspension knocks, mismatched tires, and incomplete service history.",
    marketPosition:
      "The GLC works best as a documented, steady-use car. A cheap one with warning history can cost more than buying the right car first.",
    ownershipPlan: [
      "Start with a Mercedes-capable full scan and battery/charging-system check.",
      "Verify emissions readiness and gearbox behavior before negotiating.",
      "Inspect tires, brakes, suspension, and all comfort electronics because SUV use adds wear.",
    ],
    engines: [
      { label: "OM651 diesel", note: "Can be durable; check injectors, EGR, DPF, NOx, and service proof.", risk: "Medium" },
      { label: "OM654 diesel", note: "Efficient modern diesel; emissions system health is decisive.", risk: "Medium" },
      { label: "M274/M264 petrol", note: "Inspect timing, cooling, oil leaks, and misfire data.", risk: "Medium" },
      { label: "AMG / plug-in hybrid", note: "Higher performance or hybrid complexity raises inspection cost.", risk: "Higher" },
    ],
    commonProblems: [
      "AdBlue, NOx, DPF, and EGR warning chains.",
      "9G-Tronic low-speed shift complaints or service gaps.",
      "Battery voltage creating misleading electronic faults.",
      "Suspension bushings, dampers, tires, and brake wear.",
      "Parking sensors, cameras, infotainment, and comfort electronics.",
    ],
    inspectionChecklist: [
      "Run a full Mercedes-capable scan and confirm no emissions countdown history.",
      "Test gearbox behavior cold, warm, in reverse, and in traffic.",
      "Check every screen, camera, parking sensor, window, seat, and climate function.",
      "Inspect tires, suspension knocks, brake wear, and underbody condition.",
      "Review service records for gearbox, brake fluid, coolant, filters, and emissions repairs.",
    ],
    searchTopics: ["Mercedes GLC", "OM651", "OM654", "9G-Tronic", "AdBlue", "4Matic"],
  },
  {
    slug: "mercedes-s-class",
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz S-Class Used Buying Guide",
    description:
      "Mercedes-Benz S-Class reliability, air suspension, electronics, diesel and petrol engine checks, gearbox behavior, and luxury-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-s-class"],
    score: 65,
    verdict:
      "A brilliant luxury car when maintained like one. The S-Class is rarely a cheap rescue: air suspension, electronics, emissions, cooling, and option-heavy interiors all need serious inspection.",
    bestFor: "Buyers who want luxury and long-distance comfort with budget for specialist diagnosis and preventive maintenance.",
    watchOut:
      "Walk carefully around suspension warnings, weak batteries, electrical faults, AdBlue/NOx issues, oil leaks, and cars with luxury options that do not work.",
    marketPosition:
      "Depreciation makes the S-Class tempting, but repair exposure stays flagship-level. The right car is the one with records, clean scans, and fully working equipment.",
    ownershipPlan: [
      "Pay for a specialist inspection before purchase, especially on air suspension and electronics.",
      "Check battery health, charging stability, and every comfort feature before trusting the car.",
      "Budget for fluids, filters, brake fluid, gearbox service, tires, and suspension diagnosis early.",
    ],
    engines: [
      { label: "OM642/OM656 diesel", note: "Strong cruisers; emissions, oil leaks, and cooling need checks.", risk: "Medium" },
      { label: "V6/V8 petrol", note: "Smooth but heat, oil leaks, ignition, and cooling costs rise.", risk: "Higher" },
      { label: "Hybrid variants", note: "Check battery, charging, cooling, and high-voltage service history.", risk: "Higher" },
      { label: "AMG variants", note: "Performance versions need specialist inspection and complete records.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor fatigue, and ride-height faults.",
      "Battery, alternator, and voltage-related electronic issues.",
      "Command, sensors, cameras, soft-close, seats, and comfort-system faults.",
      "Diesel AdBlue, NOx, DPF, and EGR warnings.",
      "Oil leaks, coolant leaks, gearbox behavior, and heavy brake/tire wear.",
    ],
    inspectionChecklist: [
      "Scan every module with Mercedes-capable diagnostics and save the report.",
      "Check ride height after sitting, mode changes, compressor behavior, and suspension noises.",
      "Test every luxury feature, seat function, camera, sensor, window, and infotainment control.",
      "Drive cold and warm to assess gearbox, cooling stability, steering, and brake feel.",
      "Verify invoices for suspension, gearbox, brake fluid, batteries, tires, and emissions repairs.",
    ],
    searchTopics: ["Mercedes S-Class", "Airmatic", "OM642", "OM656", "AdBlue", "electronics"],
  },
  {
    slug: "audi-a5",
    name: "Audi A5",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi A5 Used Buying Guide",
    description:
      "Audi A5 reliability, EA888/TDI engine checks, S tronic, quattro, oil consumption, timing, and coupe or Sportback buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-a5"],
    score: 67,
    verdict:
      "A stylish A4-family car that can be a strong used buy with the right engine and gearbox history. Oil behavior, timing, S tronic service, and quattro assumptions matter more than trim.",
    bestFor: "Buyers who want Audi refinement and style without ignoring drivetrain details.",
    watchOut:
      "Be careful with oil consumption, timing rattle, rough S tronic shifts, neglected quattro service, and tuned or hard-used S models.",
    marketPosition:
      "The A5 often looks better kept than it is mechanically. Treat it like an A4 inspection with extra attention to tires, doors, trim, and previous-owner use.",
    ownershipPlan: [
      "Confirm engine code, gearbox type, and quattro system before applying generic advice.",
      "Track oil level and coolant stability immediately after purchase.",
      "Baseline S tronic, Haldex/quattro, brake fluid, and filters if records are unclear.",
    ],
    engines: [
      { label: "EA888 TFSI", note: "Generation matters for oil consumption, timing, PCV, and cooling.", risk: "Medium" },
      { label: "2.0 TDI", note: "Good with records; scan DPF, EGR, injectors, and NOx systems.", risk: "Medium" },
      { label: "3.0 TDI", note: "Strong cruiser but emissions, timing, and repair costs rise.", risk: "Higher" },
      { label: "S5 / RS5", note: "Performance models require specialist checks and clean modification history.", risk: "Higher" },
    ],
    commonProblems: [
      "EA888 timing, PCV, oil consumption, and carbon buildup.",
      "S tronic service gaps, mechatronics symptoms, or rough engagement.",
      "Cooling leaks, thermostat housing, and water pump issues.",
      "Diesel emissions faults and injector correction concerns.",
      "Quattro service assumptions and uneven tire wear.",
    ],
    inspectionChecklist: [
      "Confirm engine and gearbox codes before the test drive.",
      "Listen for cold-start rattle and check oil consumption evidence.",
      "Scan engine, gearbox, AWD, ABS, and body modules.",
      "Test low-speed shifts, reverse engagement, and steady acceleration.",
      "Inspect tires, brakes, suspension, door operation, and service invoices.",
    ],
    searchTopics: ["Audi A5", "EA888", "TFSI", "S tronic", "quattro", "oil consumption"],
  },
  {
    slug: "audi-q7",
    name: "Audi Q7",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi Q7 Used Buying Guide",
    description:
      "Audi Q7 reliability, 3.0 TDI checks, quattro, air suspension, gearbox behavior, electronics, and large SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-q7"],
    score: 63,
    verdict:
      "A capable large SUV with real comfort, but poor maintenance is expensive. The Q7 needs heavy-SUV checks: tires, brakes, air suspension, quattro, gearbox, emissions, and electronics.",
    bestFor: "Families needing space, towing ability, comfort, and premium SUV capability with a realistic maintenance budget.",
    watchOut:
      "Avoid air suspension faults, cheap tires, diesel emissions warnings, rough gearbox behavior, coolant leaks, and weak-battery electronic oddities.",
    marketPosition:
      "Used Q7 prices can look tempting because running costs are not small. The best buy is the car with complete service proof and no hidden warning history.",
    ownershipPlan: [
      "Budget more than a saloon for tires, brakes, suspension, and fluid services.",
      "Verify quattro/driveline service, air suspension condition, and gearbox behavior early.",
      "Run a full scan before purchase because warning lights do not tell the whole story.",
    ],
    engines: [
      { label: "3.0 TDI", note: "Mainstream choice; check emissions, timing evidence, oil leaks, and cooling.", risk: "Higher" },
      { label: "2.0 TFSI / 3.0 TFSI", note: "Petrols need cooling, PCV, oil, ignition, and carbon checks.", risk: "Medium" },
      { label: "Plug-in hybrid", note: "Check charging, battery health, cooling, and warranty history.", risk: "Higher" },
      { label: "SQ7 / performance variants", note: "Very capable but specialist inspection and brake/tire budget are essential.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor wear, and ride-height faults.",
      "Diesel EGR, DPF, AdBlue, and NOx system issues.",
      "Gearbox service gaps, harsh shifts, or driveline vibration.",
      "MMI, sensors, cameras, battery voltage, and comfort electronics.",
      "Heavy tire, brake, suspension, and alignment wear.",
    ],
    inspectionChecklist: [
      "Check tire match, tread depth, load rating, and inner-edge wear.",
      "Test air suspension height changes and look for overnight sag.",
      "Scan engine, gearbox, suspension, AWD, parking, body, and emissions modules.",
      "Drive in traffic and at motorway speed to check gearbox and vibration.",
      "Review invoices for gearbox, differential, suspension, brakes, tires, and emissions repairs.",
    ],
    searchTopics: ["Audi Q7", "3.0 TDI", "quattro", "air suspension", "AdBlue", "Tiptronic"],
  },
  {
    slug: "volkswagen-polo",
    name: "Volkswagen Polo",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Polo Used Buying Guide",
    description:
      "Volkswagen Polo reliability, TSI/TDI engine checks, DSG behavior, timing, cooling, city-car wear, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-polo"],
    score: 70,
    verdict:
      "A sensible small car when service history is real. The Polo is cheap to run compared with larger German cars, but DSG, timing, cooling, and city-use wear still need inspection.",
    bestFor: "Drivers wanting compact practicality, parts availability, and low running costs.",
    watchOut:
      "Avoid rough DSG behavior, timing noise, coolant loss, misfires, cheap tires, accident repairs, and interiors that do not match the mileage.",
    marketPosition:
      "The Polo is strongest as a simple, well-serviced car. Pay for condition and records, not for a shiny small car with no maintenance proof.",
    ownershipPlan: [
      "Confirm the exact TSI/TDI engine and gearbox before judging reliability.",
      "Baseline oil, filters, brake fluid, coolant checks, and scan data after purchase.",
      "Inspect for city-use damage: wheels, clutch, brakes, suspension, and parking repairs.",
    ],
    engines: [
      { label: "1.0 MPI / TSI", note: "Good daily engines; check service intervals, misfires, and cooling.", risk: "Medium" },
      { label: "1.2 / 1.4 TSI", note: "Generation matters for timing, oil behavior, and PCV faults.", risk: "Medium" },
      { label: "1.4 / 1.6 TDI", note: "Efficient, but DPF/EGR health depends on driving profile.", risk: "Medium" },
      { label: "GTI", note: "Fun, but inspect DSG, modifications, brakes, tires, and oil behavior.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service gaps or low-speed judder on equipped cars.",
      "Timing chain/belt evidence depending on engine generation.",
      "Cooling leaks, thermostat behavior, and water pump issues.",
      "Misfires, coils, plugs, PCV, and carbon buildup on TSI engines.",
      "Suspension knocks, tire wear, wheel damage, and accident repair clues.",
    ],
    inspectionChecklist: [
      "Test clutch or DSG behavior in traffic, reverse, and hill starts.",
      "Scan for misfires, gearbox faults, emissions readiness, and battery voltage issues.",
      "Check coolant level, heater behavior, and timing-service evidence.",
      "Inspect tires, wheels, brakes, suspension, and crash repair signs.",
      "Verify oil service, brake fluid, filters, and DSG records where applicable.",
    ],
    searchTopics: ["Volkswagen Polo", "TSI", "TDI", "DSG", "timing", "misfire"],
  },
  {
    slug: "volkswagen-touareg",
    name: "Volkswagen Touareg",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Touareg Used Buying Guide",
    description:
      "Volkswagen Touareg reliability, 3.0 TDI checks, 4Motion, air suspension, gearbox behavior, electronics, and large SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-touareg"],
    score: 64,
    verdict:
      "A capable large SUV that can be excellent value, but it carries premium-SUV repair exposure. The Touareg needs careful checks for diesel emissions, air suspension, tires, driveline, and electronics.",
    bestFor: "Buyers needing towing ability, comfort, and long-distance SUV strength without paying Audi or Porsche badge money.",
    watchOut:
      "Avoid air suspension faults, diesel warning lights, rough gearbox shifts, mismatched tires, coolant leaks, and incomplete driveline service history.",
    marketPosition:
      "The Touareg is often underrated, which helps value. It only stays good value when the expensive systems are inspected before purchase.",
    ownershipPlan: [
      "Budget for large-SUV tires, brakes, suspension, gearbox, and driveline services.",
      "Run a full VAG-capable scan and verify emissions readiness before buying.",
      "Inspect air suspension and towing-related wear carefully if the car has been used hard.",
    ],
    engines: [
      { label: "3.0 TDI", note: "Common and capable; check EGR, DPF, AdBlue, injectors, oil leaks, and cooling.", risk: "Higher" },
      { label: "V6 petrol", note: "Less diesel emissions risk, but fuel cost, cooling, ignition, and oil leaks matter.", risk: "Medium" },
      { label: "Hybrid variants", note: "Check battery, charging, cooling, and high-voltage service history.", risk: "Higher" },
      { label: "Air suspension models", note: "Comfortable, but leaks and compressor wear can be costly.", risk: "Higher" },
    ],
    commonProblems: [
      "Diesel EGR, DPF, AdBlue, NOx, and injector-related faults.",
      "Air suspension leaks, compressor fatigue, and height-sensor issues.",
      "Gearbox or driveline service gaps and vibration under load.",
      "Cooling leaks, oil leaks, and boost/vacuum system faults.",
      "Heavy brake, tire, bushing, and alignment wear.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, suspension, AWD, parking, body, and emissions modules.",
      "Check tire match, load rating, tread depth, and inner-edge wear.",
      "Raise and lower air suspension where fitted and check for overnight sag.",
      "Test towing-speed acceleration, low-speed shifts, reverse, and tight turns.",
      "Verify gearbox, differential, transfer case, brake, and emissions repair invoices.",
    ],
    searchTopics: ["Volkswagen Touareg", "3.0 TDI", "4Motion", "air suspension", "AdBlue", "DPF"],
  },
  {
    slug: "bmw-4-series",
    name: "BMW 4 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 4 Series Used Buying Guide",
    description:
      "BMW 4 Series reliability, petrol and diesel engine checks, ZF gearbox behavior, coupe body checks, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-4-series"],
    score: 70,
    verdict:
      "A sharper, style-led 3 Series relative that can be a strong used buy when engine history, cooling health, oil leaks, and ZF service proof are clear.",
    bestFor: "Drivers who want BMW dynamics with coupe, Gran Coupe, or convertible style.",
    watchOut:
      "Avoid cars with timing noise, coolant loss, roof faults on convertibles, rough gearbox behavior, cheap modifications, or vague service history.",
    marketPosition:
      "The 4 Series is often bought on looks, but the smart purchase is still about engine family, gearbox evidence, tire quality, and body condition.",
    ownershipPlan: [
      "Baseline oil, filters, coolant inspection, brake fluid, and scan data soon after purchase.",
      "Check ZF service evidence and low-speed shift quality before trusting a tidy cabin.",
      "On coupes and convertibles, inspect doors, seals, roof drains, and previous repair quality.",
    ],
    engines: [
      { label: "N20/N26 petrol", note: "Inspect timing evidence, oil leaks, cooling, and service intervals.", risk: "Higher" },
      { label: "B48 petrol", note: "Good modern choice; check cooling leaks, PCV behavior, and scan data.", risk: "Medium" },
      { label: "N47/B47 diesel", note: "Buy on timing, EGR, DPF, and oil-service evidence.", risk: "Medium" },
      { label: "Six-cylinder models", note: "Desirable, but tires, brakes, cooling, and maintenance cost rise.", risk: "Medium" },
    ],
    commonProblems: [
      "Cooling leaks, thermostat, water pump, and plastic hose fatigue.",
      "Oil filter housing, valve cover, and gasket seepage.",
      "Timing-chain risk on sensitive N20/N47 examples.",
      "ZF gearbox service gaps and low-speed hesitation.",
      "Convertible roof, seals, water ingress, tire wear, and suspension knocks.",
    ],
    inspectionChecklist: [
      "Listen from cold for chain rattle, rough idle, and exhaust smoke.",
      "Inspect coolant residue, oil leaks, and undertray dampness.",
      "Scan engine, gearbox, body, roof, and chassis modules where applicable.",
      "Test ZF shifts cold and warm, including reverse and crawling traffic.",
      "Check tire match, wheel damage, roof operation, and body repair evidence.",
    ],
    searchTopics: ["BMW 4 Series", "B48", "N20", "B47", "ZF 8HP", "convertible"],
  },
  {
    slug: "bmw-7-series",
    name: "BMW 7 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 7 Series Used Buying Guide",
    description:
      "BMW 7 Series reliability, air suspension, electronics, diesel and petrol engine checks, ZF gearbox behavior, and luxury-car buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-7-series"],
    score: 64,
    verdict:
      "A superb luxury car when maintained properly, but cheap examples can carry flagship repair exposure in suspension, electronics, cooling, gearbox, and emissions systems.",
    bestFor: "Buyers who want luxury, space, and long-distance comfort with budget for specialist maintenance.",
    watchOut:
      "Walk carefully around air suspension warnings, battery voltage faults, coolant loss, oil leaks, AdBlue/NOx issues, and dead luxury options.",
    marketPosition:
      "Depreciation makes the 7 Series tempting, but it should be bought like a flagship. Clean scans and invoices matter more than low purchase price.",
    ownershipPlan: [
      "Pay for specialist diagnostics before purchase and keep the scan report.",
      "Budget early for fluids, filters, gearbox service, battery health, tires, brakes, and suspension checks.",
      "Test every comfort feature, camera, seat, window, soft-close door, and infotainment function.",
    ],
    engines: [
      { label: "B57/N57 diesel", note: "Strong cruisers; emissions, timing evidence, oil leaks, and cooling need checks.", risk: "Medium" },
      { label: "B58 petrol", note: "Desirable, but cooling, oil leaks, ignition, and scan data still matter.", risk: "Medium" },
      { label: "V8 petrol", note: "Performance is strong, but heat, oil leaks, and repair costs are high.", risk: "Higher" },
      { label: "Plug-in hybrid", note: "Check battery, charging, cooling, and high-voltage service history.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor fatigue, and ride-height faults.",
      "Battery, charging, comfort electronics, cameras, and module faults.",
      "Cooling leaks, oil leaks, and turbo/boost issues on higher-output cars.",
      "Diesel EGR, DPF, AdBlue, NOx, and injector-related faults.",
      "ZF gearbox service neglect, heavy brake wear, and expensive tire fitments.",
    ],
    inspectionChecklist: [
      "Scan every module with BMW-capable diagnostics before paying a deposit.",
      "Check ride height after sitting, mode changes, compressor noise, and suspension warnings.",
      "Test all luxury features, screens, cameras, seats, windows, and driver aids.",
      "Drive cold and warm to assess gearbox, steering, brakes, cooling stability, and vibration.",
      "Review invoices for suspension, gearbox, batteries, tires, brakes, coolant, and emissions repairs.",
    ],
    searchTopics: ["BMW 7 Series", "B57", "B58", "air suspension", "AdBlue", "ZF 8HP"],
  },
  {
    slug: "bmw-x1",
    name: "BMW X1",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW X1 Used Buying Guide",
    description:
      "BMW X1 reliability, sDrive and xDrive checks, B47/B48 engine risks, gearbox behavior, and compact SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-x1"],
    score: 69,
    verdict:
      "A practical compact BMW that can be sensible when drivetrain history is clear. xDrive, diesel emissions, cooling, and automatic gearbox behavior need proper checks.",
    bestFor: "Drivers wanting compact SUV practicality with BMW branding and manageable running costs.",
    watchOut:
      "Avoid coolant loss, EGR/DPF faults, xDrive vibration, rough shifts, cheap tires, and incomplete service history.",
    marketPosition:
      "The X1 is best as a clean daily driver, not a neglected premium SUV bargain. Exact engine, gearbox, and drivetrain matter more than trim.",
    ownershipPlan: [
      "Confirm sDrive or xDrive hardware and inspect tire match before purchase.",
      "Baseline fluids, filters, coolant inspection, brake fluid, and diagnostic scan.",
      "For diesel examples, verify EGR campaign status, DPF loading, and regular longer-run use.",
    ],
    engines: [
      { label: "B47 diesel", note: "Efficient and common; check EGR, DPF, coolant, and oil history.", risk: "Medium" },
      { label: "B48 petrol", note: "Good petrol option; inspect cooling, PCV, oil leaks, and misfires.", risk: "Medium" },
      { label: "Three-cylinder petrol/diesel", note: "Can be economical; test refinement, service evidence, and scan data.", risk: "Medium" },
      { label: "xDrive variants", note: "Check tire match, transfer behavior, and driveline vibration.", risk: "Medium" },
    ],
    commonProblems: [
      "Diesel EGR, DPF, NOx, and short-trip emissions issues.",
      "Cooling leaks, thermostat behavior, and coolant residue.",
      "Automatic gearbox hesitation or service uncertainty.",
      "xDrive driveline vibration from tire mismatch or service neglect.",
      "Suspension knocks, brake wear, interior trim wear, and parking damage.",
    ],
    inspectionChecklist: [
      "Check tire sizes, tread depths, brands, and inner-edge wear.",
      "Scan engine, gearbox, ABS, xDrive, and body modules.",
      "Drive in traffic and on faster roads to test shift quality and vibration.",
      "Inspect coolant residue, oil leaks, brake wear, and suspension knocks.",
      "Verify service invoices for oil, filters, brake fluid, gearbox, and emissions repairs.",
    ],
    searchTopics: ["BMW X1", "B47", "B48", "xDrive", "EGR", "compact SUV"],
  },
  {
    slug: "mercedes-cla",
    name: "Mercedes-Benz CLA",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz CLA Used Buying Guide",
    description:
      "Mercedes-Benz CLA reliability, diesel and petrol engine checks, 7G-DCT behavior, electronics, and compact saloon buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-cla"],
    score: 68,
    verdict:
      "A stylish compact Mercedes that works best with clean service records and a healthy dual-clutch gearbox. Do not let the shape distract from emissions, electronics, and suspension checks.",
    bestFor: "Buyers who want compact Mercedes style with lower running costs than larger models.",
    watchOut:
      "Avoid rough 7G-DCT behavior, AdBlue/NOx warnings, weak battery faults, accident repairs, and cheap modified examples.",
    marketPosition:
      "The CLA is often bought emotionally. The smart buy is the one with boring maintenance proof, clean diagnostics, and no hidden body damage.",
    ownershipPlan: [
      "Run a Mercedes-capable scan and battery health check before purchase.",
      "Test the 7G-DCT in traffic, reverse, hill starts, and warm restarts.",
      "Inspect tires, suspension, wheels, bumpers, and alignment because many cars live urban lives.",
    ],
    engines: [
      { label: "OM651/OM607 diesel", note: "Economical, but emissions, injector, and service evidence matter.", risk: "Medium" },
      { label: "M270/M260 petrol", note: "Inspect timing, cooling, oil leaks, misfires, and scan data.", risk: "Medium" },
      { label: "7G-DCT cars", note: "Fluid history and low-speed behavior are key buying checks.", risk: "Medium" },
      { label: "AMG variants", note: "Fast, but brakes, tires, modifications, and launch use raise risk.", risk: "Higher" },
    ],
    commonProblems: [
      "7G-DCT judder, hesitation, and service gaps.",
      "Diesel AdBlue, NOx, DPF, EGR, and injector concerns.",
      "Battery voltage, sensors, infotainment, and electrical faults.",
      "Cooling leaks, oil leaks, timing noise, and misfires on petrols.",
      "Suspension knocks, tire wear, wheel damage, and crash repair clues.",
    ],
    inspectionChecklist: [
      "Scan all modules with Mercedes-capable diagnostics.",
      "Test gearbox behavior cold, warm, in reverse, and in slow traffic.",
      "Check battery voltage, warning history, and emissions readiness.",
      "Inspect paint depth, panel gaps, wheels, tires, brakes, and suspension.",
      "Review invoices for gearbox service, brake fluid, oil, filters, and emissions work.",
    ],
    searchTopics: ["Mercedes CLA", "7G-DCT", "OM651", "M270", "AdBlue", "AMG"],
  },
  {
    slug: "mercedes-gla",
    name: "Mercedes-Benz GLA",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz GLA Used Buying Guide",
    description:
      "Mercedes-Benz GLA reliability, diesel and petrol engine checks, 7G-DCT behavior, 4Matic, electronics, and compact SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-gla"],
    score: 67,
    verdict:
      "A compact Mercedes SUV that is easiest to own when diagnostics are clean and the gearbox feels healthy. Diesel emissions, electronics, and urban wear deserve close attention.",
    bestFor: "Buyers wanting compact crossover usability with Mercedes cabin feel.",
    watchOut:
      "Avoid rough DCT shifts, AdBlue or NOx warnings, weak battery behavior, 4Matic service gaps, and cars with hard urban use.",
    marketPosition:
      "The GLA is more crossover than rugged SUV. Buy it for size and convenience, then inspect it like an A-Class with extra tire and suspension attention.",
    ownershipPlan: [
      "Run a full scan, battery test, and emissions readiness check before purchase.",
      "Test the dual-clutch gearbox in traffic and reverse rather than only on open roads.",
      "Inspect tires, suspension, wheels, parking sensors, cameras, and underbody condition.",
    ],
    engines: [
      { label: "OM651/OM607 diesel", note: "Efficient, but DPF, EGR, AdBlue, and injector data need checks.", risk: "Medium" },
      { label: "M270/M260 petrol", note: "Check cooling, timing, oil leaks, ignition, and scan data.", risk: "Medium" },
      { label: "4Matic variants", note: "Verify tire match, driveline behavior, and service evidence.", risk: "Medium" },
      { label: "AMG variants", note: "Performance use, modifications, tires, and brakes change the budget.", risk: "Higher" },
    ],
    commonProblems: [
      "7G-DCT service gaps, low-speed hesitation, and clutch behavior.",
      "Diesel emissions faults including AdBlue, NOx, DPF, and EGR warnings.",
      "Battery voltage, sensors, infotainment, and body-module faults.",
      "Cooling leaks, timing noise, oil leaks, and petrol misfires.",
      "Suspension wear, tire damage, wheel scuffs, and parking damage.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, ABS, body, parking, and emissions modules.",
      "Check DCT shifts cold and warm, including reverse and hill starts.",
      "Inspect tire match, wheel damage, brake wear, and suspension knocks.",
      "Test every screen, sensor, camera, window, seat, and climate function.",
      "Verify invoices for oil, filters, brake fluid, gearbox, and emissions repairs.",
    ],
    searchTopics: ["Mercedes GLA", "7G-DCT", "4Matic", "AdBlue", "OM651", "compact SUV"],
  },
  {
    slug: "mercedes-gle",
    name: "Mercedes-Benz GLE",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz GLE Used Buying Guide",
    description:
      "Mercedes-Benz GLE reliability, diesel engine checks, 4Matic, air suspension, electronics, gearbox behavior, and large SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-gle"],
    score: 64,
    verdict:
      "A comfortable large SUV with real capability, but neglected examples are costly. Air suspension, emissions, electronics, tires, brakes, and gearbox behavior must all be checked.",
    bestFor: "Families and long-distance drivers who want Mercedes comfort with a realistic SUV maintenance budget.",
    watchOut:
      "Avoid suspension warnings, AdBlue/NOx faults, cheap tires, rough gearbox shifts, coolant leaks, and weak-battery electronic issues.",
    marketPosition:
      "The GLE can be excellent value compared with new, but its repair exposure stays premium. Service history and diagnostics decide the deal.",
    ownershipPlan: [
      "Budget for heavy-SUV tires, brakes, suspension, gearbox, and driveline service.",
      "Use Mercedes-capable diagnostics to check emissions, air suspension, and body modules.",
      "Inspect 4Matic behavior, tire match, towing wear, and underbody condition carefully.",
    ],
    engines: [
      { label: "OM642/OM656 diesel", note: "Strong cruisers; emissions, oil leaks, cooling, and injector checks matter.", risk: "Medium" },
      { label: "OM654 diesel", note: "Efficient newer diesel; verify AdBlue, NOx, DPF, and sensor health.", risk: "Medium" },
      { label: "Petrol/hybrid variants", note: "Check cooling, charging, ignition, battery, and scan data.", risk: "Higher" },
      { label: "AMG variants", note: "Specialist inspection, tire/brake budget, and modification history are essential.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor fatigue, and ride-height faults.",
      "Diesel AdBlue, NOx, DPF, EGR, and injector-related warnings.",
      "9G/7G gearbox service uncertainty and low-speed shift concerns.",
      "Battery voltage, sensors, cameras, infotainment, and comfort electronics.",
      "Heavy tire, brake, bushing, and alignment wear.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, suspension, 4Matic, body, parking, and emissions modules.",
      "Check ride height, suspension mode changes, compressor noise, and overnight sag.",
      "Drive cold and warm to assess gearbox, steering, brakes, vibration, and cooling stability.",
      "Inspect tire match, load rating, brake wear, underbody condition, and towing hardware.",
      "Review invoices for suspension, gearbox, tires, brakes, batteries, and emissions repairs.",
    ],
    searchTopics: ["Mercedes GLE", "4Matic", "Airmatic", "OM642", "AdBlue", "9G-Tronic"],
  },
  {
    slug: "audi-a1",
    name: "Audi A1",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi A1 Used Buying Guide",
    description:
      "Audi A1 reliability, TFSI and TDI engine checks, S tronic behavior, city-car wear, timing, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-a1"],
    score: 69,
    verdict:
      "A premium small car that can be sensible when bought on condition. Engine generation, S tronic behavior, timing evidence, and urban wear matter more than badge appeal.",
    bestFor: "Drivers wanting small-car running costs with Audi cabin feel and easy city use.",
    watchOut:
      "Avoid timing noise, oil consumption, rough S tronic shifts, misfires, cheap tires, accident repairs, and patchy service history.",
    marketPosition:
      "The A1 shares plenty of small VAG logic, so it should be inspected like a Polo with a premium interior and potentially higher cosmetic expectations.",
    ownershipPlan: [
      "Confirm engine code, timing setup, and gearbox type before judging reliability.",
      "Baseline oil, filters, brake fluid, coolant checks, and diagnostic scan after purchase.",
      "Inspect for city-use damage: wheels, suspension, clutch/S tronic behavior, and repaired bumpers.",
    ],
    engines: [
      { label: "1.0 / 1.2 / 1.4 TFSI", note: "Generation matters for timing, oil use, PCV, cooling, and misfires.", risk: "Medium" },
      { label: "1.6 TDI", note: "Economical, but DPF/EGR health depends on driving profile.", risk: "Medium" },
      { label: "S tronic", note: "Check service evidence and low-speed engagement carefully.", risk: "Medium" },
      { label: "S1 / performance variants", note: "Inspect modifications, clutch, brakes, tires, and hard-use signs.", risk: "Higher" },
    ],
    commonProblems: [
      "Timing chain/belt evidence depending on engine generation.",
      "Oil consumption, PCV faults, misfires, and carbon buildup on TFSI engines.",
      "S tronic judder, service gaps, and rough low-speed behavior.",
      "Cooling leaks, thermostat behavior, and water pump issues.",
      "Wheel damage, suspension knocks, tire wear, and crash repair clues.",
    ],
    inspectionChecklist: [
      "Listen for cold-start timing rattle and check oil consumption evidence.",
      "Test clutch or S tronic behavior in traffic, reverse, and hill starts.",
      "Scan for misfires, gearbox faults, emissions readiness, and battery voltage issues.",
      "Inspect tires, wheels, brakes, suspension, paint, and panel gaps.",
      "Verify oil service, brake fluid, filters, timing, and gearbox records where applicable.",
    ],
    searchTopics: ["Audi A1", "TFSI", "TDI", "S tronic", "timing", "misfire"],
  },
  {
    slug: "audi-q3",
    name: "Audi Q3",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi Q3 Used Buying Guide",
    description:
      "Audi Q3 reliability, TFSI/TDI engine checks, S tronic, quattro/Haldex service, compact SUV wear, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-q3"],
    score: 67,
    verdict:
      "A compact Audi SUV that can be a good used buy when exact engine, gearbox, and quattro service history are verified. Shared VAG parts help, but neglect still costs.",
    bestFor: "Buyers who want compact SUV usability with Audi cabin quality and secure road feel.",
    watchOut:
      "Avoid S tronic judder, oil consumption, timing rattle, coolant leaks, neglected Haldex service, diesel emissions warnings, and cheap tires.",
    marketPosition:
      "The Q3 sits between hatchback and SUV costs. It rewards buyers who confirm the exact drivetrain and do not assume quattro service has been done.",
    ownershipPlan: [
      "Confirm engine code, gearbox type, and whether the car uses Haldex-style AWD.",
      "Baseline S tronic, Haldex, oil, filters, brake fluid, and coolant checks if records are unclear.",
      "Use scan data to check misfires, emissions readiness, gearbox faults, and AWD modules.",
    ],
    engines: [
      { label: "EA888 TFSI", note: "Inspect timing, oil consumption, PCV, cooling, and carbon buildup.", risk: "Medium" },
      { label: "2.0 TDI", note: "Strong with records; scan DPF, EGR, injectors, and NOx systems.", risk: "Medium" },
      { label: "S tronic", note: "Service intervals and low-speed behavior are key.", risk: "Medium" },
      { label: "quattro/Haldex", note: "Fluid and filter service evidence matters.", risk: "Medium" },
    ],
    commonProblems: [
      "S tronic service gaps, mechatronics symptoms, and rough engagement.",
      "EA888 timing, PCV, oil consumption, cooling leaks, and carbon buildup.",
      "Diesel DPF, EGR, NOx, and injector correction concerns.",
      "Haldex service neglect and uneven tire wear.",
      "Suspension knocks, wheel damage, parking sensors, and interior electronics.",
    ],
    inspectionChecklist: [
      "Confirm engine, gearbox, and quattro/Haldex configuration.",
      "Scan engine, gearbox, AWD, ABS, body, and emissions modules.",
      "Test reverse, crawling shifts, steady acceleration, and tight turns.",
      "Inspect coolant residue, oil leaks, tire match, brakes, and suspension wear.",
      "Review invoices for DSG/S tronic, Haldex, brake fluid, filters, and emissions repairs.",
    ],
    searchTopics: ["Audi Q3", "EA888", "2.0 TDI", "S tronic", "quattro", "Haldex"],
  },
  {
    slug: "volkswagen-arteon",
    name: "Volkswagen Arteon",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen Arteon Used Buying Guide",
    description:
      "Volkswagen Arteon reliability, TSI/TDI engine checks, DSG service history, 4Motion/Haldex notes, electronics, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-arteon"],
    score: 68,
    verdict:
      "A stylish Passat-family car that can be excellent value when DSG, engine, and 4Motion service history are clear. It is not as cheap to neglect as a basic family car.",
    bestFor: "Buyers wanting long-distance comfort, sharp styling, and VAG parts availability.",
    watchOut:
      "Avoid DSG service gaps, oil consumption, timing concerns, coolant leaks, diesel emissions warnings, Haldex neglect, and option-heavy electrical faults.",
    marketPosition:
      "The Arteon is a value play against premium saloons, but condition and drivetrain history decide whether the value is real.",
    ownershipPlan: [
      "Confirm engine code, gearbox, and 4Motion/Haldex configuration before purchase.",
      "Baseline DSG, Haldex, oil, filters, brake fluid, and coolant checks if paperwork is thin.",
      "Test all comfort, lighting, camera, parking, and driver-assistance equipment.",
    ],
    engines: [
      { label: "2.0 TDI", note: "Strong motorway option; scan DPF, EGR, NOx, and injector data.", risk: "Medium" },
      { label: "EA888 TSI", note: "Check timing, oil use, PCV, cooling, ignition, and carbon buildup.", risk: "Medium" },
      { label: "DSG", note: "Fluid service proof and low-speed behavior are essential.", risk: "Medium" },
      { label: "4Motion models", note: "Verify Haldex service, tire match, and rear axle engagement.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service neglect, mechatronics symptoms, and low-speed hesitation.",
      "Diesel EGR, DPF, NOx, AdBlue, and injector-related faults.",
      "EA888 timing, PCV, cooling module, and oil consumption concerns.",
      "Haldex service neglect on 4Motion cars.",
      "Sensors, cameras, adaptive lighting, suspension wear, and tire costs.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, AWD, ABS, body, parking, and emissions modules.",
      "Test DSG in crawling traffic, reverse, warm restarts, and steady acceleration.",
      "Check Haldex invoices, tire match, coolant residue, and oil leaks.",
      "Test infotainment, cameras, parking sensors, lights, seats, and driver aids.",
      "Review service records for DSG, Haldex, brake fluid, filters, timing, and emissions repairs.",
    ],
    searchTopics: ["Volkswagen Arteon", "DSG", "2.0 TDI", "EA888", "4Motion", "Haldex"],
  },
  {
    slug: "volkswagen-t-roc",
    name: "Volkswagen T-Roc",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    title: "Volkswagen T-Roc Used Buying Guide",
    description:
      "Volkswagen T-Roc reliability, TSI/TDI engine checks, DSG behavior, 4Motion/Haldex service, compact SUV wear, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["volkswagen-t-roc"],
    score: 69,
    verdict:
      "A practical compact crossover that is strongest with simple spec and clear service history. DSG, cooling, TSI timing/oil behavior, diesel emissions, and 4Motion service need checks.",
    bestFor: "Drivers wanting Golf-like running costs with a higher driving position and compact footprint.",
    watchOut:
      "Avoid DSG judder, coolant loss, timing noise, misfires, DPF/EGR warnings, Haldex service gaps, and hard urban wear.",
    marketPosition:
      "The T-Roc is best judged as a raised Golf-family car. Buy the clean drivetrain and paperwork, not only the crossover look.",
    ownershipPlan: [
      "Confirm engine code, DSG/manual gearbox, and 4Motion equipment before comparing cars.",
      "Baseline oil, filters, brake fluid, coolant checks, DSG/Haldex service where needed, and scan data.",
      "Inspect wheels, tires, brakes, suspension, parking damage, and interior wear from daily use.",
    ],
    engines: [
      { label: "1.0 / 1.5 TSI", note: "Good daily choices; check misfires, cooling, oil use, and software behavior.", risk: "Medium" },
      { label: "2.0 TSI", note: "Stronger performance; inspect EA888 timing, PCV, cooling, and DSG history.", risk: "Medium" },
      { label: "2.0 TDI", note: "Efficient for distance; scan DPF, EGR, NOx, and injector data.", risk: "Medium" },
      { label: "4Motion models", note: "Verify Haldex service and tire match.", risk: "Higher" },
    ],
    commonProblems: [
      "DSG service gaps, low-speed hesitation, and mechatronics symptoms.",
      "Cooling leaks, thermostat housings, water pump issues, and coolant residue.",
      "TSI misfires, PCV faults, oil consumption, and carbon buildup.",
      "Diesel EGR, DPF, NOx, and short-trip emissions problems.",
      "Suspension knocks, tire wear, wheel damage, and parking sensor faults.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, ABS, body, parking, and emissions modules.",
      "Test DSG/manual clutch behavior in traffic, reverse, and hill starts.",
      "Check coolant level, oil leaks, misfire history, and emissions readiness.",
      "Inspect tire match, wheels, brakes, suspension, and body repair signs.",
      "Verify oil, filters, brake fluid, DSG, Haldex, and timing-service records where applicable.",
    ],
    searchTopics: ["Volkswagen T-Roc", "TSI", "TDI", "DSG", "4Motion", "Haldex"],
  },
  {
    slug: "bmw-2-series",
    name: "BMW 2 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 2 Series Used Buying Guide",
    description:
      "BMW 2 Series reliability, B48/B47 checks, compact BMW wear, ZF or DCT behavior, cooling, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-2-series"],
    score: 71,
    verdict:
      "A compact BMW can be a brilliant used buy when the drivetrain is simple and service history is real. Cooling, oil leaks, tire wear, and gearbox behavior deserve more attention than trim badges.",
    bestFor: "Drivers who want a smaller BMW with sharper road feel and manageable running costs.",
    watchOut:
      "Avoid tuned cars, cheap tires, coolant residue, rough cold starts, harsh shifts, and vague oil-service records.",
    marketPosition:
      "The 2 Series is best judged by body style, engine, and gearbox. A clean mainstream car is usually safer than a modified bargain with performance promises.",
    ownershipPlan: [
      "Confirm engine code, gearbox type, and modification history before comparing prices.",
      "Baseline oil, filters, brake fluid, coolant checks, and a full diagnostic scan.",
      "Inspect tires, suspension, brakes, cooling plastics, and oil leak areas early.",
    ],
    engines: [
      { label: "B48 petrol", note: "Strong everyday choice; inspect cooling, PCV, oil leaks, and scan data.", risk: "Medium" },
      { label: "B47 diesel", note: "Efficient for distance; check DPF, EGR, and service intervals.", risk: "Medium" },
      { label: "ZF automatic", note: "Smooth when healthy; verify shift quality and service evidence.", risk: "Medium" },
      { label: "M Performance variants", note: "Inspect modifications, tires, brakes, and heat-related wear carefully.", risk: "Higher" },
    ],
    commonProblems: [
      "Cooling leaks, thermostat behavior, and water pump age.",
      "Oil leaks around common gasket and housing areas.",
      "Diesel DPF/EGR issues when used mostly for short trips.",
      "Gearbox service uncertainty and low-speed shift symptoms.",
      "Suspension wear, wheel damage, tire mismatch, and modification history.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, ABS, body, and battery-voltage history.",
      "Inspect coolant residue, oil leaks, tire match, brakes, and suspension.",
      "Test cold start, reverse engagement, traffic shifts, and full warm restart.",
      "Check service invoices for fluids, filters, brake fluid, and gearbox work.",
      "Look for tuning, intake, exhaust, wheel, and suspension modifications.",
    ],
    searchTopics: ["BMW 2 Series", "B48", "B47", "ZF 8HP", "cooling", "tuning"],
  },
  {
    slug: "bmw-x6",
    name: "BMW X6",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW X6 Used Buying Guide",
    description:
      "BMW X6 reliability, xDrive checks, diesel and petrol engine risks, air suspension, tires, cooling, and used SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["bmw-x6"],
    score: 62,
    verdict:
      "A stylish large SUV with serious repair exposure. It can be rewarding, but only if xDrive, tires, suspension, cooling, emissions, and scan data are all clean.",
    bestFor: "Buyers who want premium SUV presence and can budget for heavyweight running costs.",
    watchOut:
      "Avoid mismatched tires, suspension warnings, coolant leaks, transfer-case shudder, diesel emissions faults, and tuned examples without invoices.",
    marketPosition:
      "The X6 often looks tempting used because depreciation is heavy. Maintenance costs do not depreciate, so paperwork and diagnostics matter more than the asking price.",
    ownershipPlan: [
      "Budget like a large premium SUV owner from day one: tires, brakes, fluids, suspension, and diagnostics.",
      "Verify xDrive behavior with matched tires and a proper road test.",
      "Treat air suspension, diesel emissions, and cooling faults as major negotiation points.",
    ],
    engines: [
      { label: "N57/B57 diesel", note: "Strong torque; inspect emissions, oil leaks, cooling, and timing evidence.", risk: "Medium" },
      { label: "B58 petrol", note: "Desirable, but cooling, ignition, and oil-service history still matter.", risk: "Medium" },
      { label: "V8 petrol", note: "Performance is high and repair exposure is higher.", risk: "Higher" },
      { label: "ZF / xDrive", note: "Service proof, tire match, and transfer-case behavior are critical.", risk: "Higher" },
    ],
    commonProblems: [
      "Transfer-case shudder from tire mismatch or driveline wear.",
      "Air suspension leaks, compressor fatigue, and chassis warnings.",
      "Diesel EGR, DPF, AdBlue, and NOx-related faults.",
      "Cooling leaks, oil leaks, and heat-related engine-bay wear.",
      "Heavy tire, brake, bushing, and alignment costs.",
    ],
    inspectionChecklist: [
      "Scan every drivetrain, chassis, suspension, and body module.",
      "Check tire size, brand, tread depth, and wear on all four corners.",
      "Test tight turns, motorway acceleration, braking, and warm restart behavior.",
      "Inspect ride height after sitting and listen for compressor overwork.",
      "Review invoices for tires, brakes, suspension, gearbox, transfer case, and emissions repairs.",
    ],
    searchTopics: ["BMW X6", "xDrive", "N57", "B57", "air suspension", "transfer case"],
  },
  {
    slug: "mercedes-b-class",
    name: "Mercedes-Benz B-Class",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    title: "Mercedes-Benz B-Class Used Buying Guide",
    description:
      "Mercedes-Benz B-Class reliability, DCT behavior, compact diesel emissions, electronics, family-car wear, and used buying advice.",
    heroImage: MODEL_HERO_IMAGES["mercedes-b-class"],
    score: 68,
    verdict:
      "A practical Mercedes that works best when bought for condition, not badge appeal. DCT behavior, electronics, diesel emissions, and family-use wear need careful checks.",
    bestFor: "Drivers who want compact Mercedes comfort with more practicality than an A-Class.",
    watchOut:
      "Avoid rough DCT engagement, weak-battery faults, AdBlue/NOx warnings, coolant leaks, and tired interiors with missing service records.",
    marketPosition:
      "The B-Class is a sensible used choice when the drivetrain is simple and maintenance is documented. It should be inspected like a compact premium family car.",
    ownershipPlan: [
      "Check battery health and scan all modules because voltage issues can create misleading faults.",
      "Test DCT behavior in reverse, crawling traffic, and warm restarts.",
      "Inspect family-use wear: doors, seats, boot trim, tires, brakes, and suspension.",
    ],
    engines: [
      { label: "Petrol four-cylinder", note: "Check cooling, ignition, oil leaks, and scan data.", risk: "Medium" },
      { label: "Compact diesel", note: "Efficient when used correctly; scan DPF, EGR, AdBlue, and NOx systems.", risk: "Medium" },
      { label: "7G/8G-DCT", note: "Low-speed behavior and service evidence matter.", risk: "Medium" },
      { label: "High-option cars", note: "More sensors and comfort equipment mean more checks before purchase.", risk: "Medium" },
    ],
    commonProblems: [
      "DCT judder, delayed engagement, or adaptation complaints.",
      "Battery voltage and body-electronics faults.",
      "Diesel DPF, EGR, AdBlue, and NOx warnings.",
      "Cooling leaks, thermostat behavior, and sensor plausibility issues.",
      "Family-use tire, brake, suspension, seat, and interior wear.",
    ],
    inspectionChecklist: [
      "Run Mercedes-capable diagnostics across engine, gearbox, body, and emissions modules.",
      "Test DCT in traffic, reverse, hill starts, and warm restarts.",
      "Check battery, charging voltage, coolant level, and warning history.",
      "Inspect tires, brakes, suspension, doors, seats, and boot trim.",
      "Verify oil, filters, brake fluid, gearbox, and emissions repair invoices.",
    ],
    searchTopics: ["Mercedes B-Class", "DCT", "AdBlue", "NOx", "family car", "battery"],
  },
  {
    slug: "audi-q8",
    name: "Audi Q8",
    brand: "Audi",
    brandHref: "/brands/audi",
    title: "Audi Q8 Used Buying Guide",
    description:
      "Audi Q8 reliability, V6 TDI/TFSI checks, quattro, air suspension, electronics, tires, and large SUV buying advice.",
    heroImage: MODEL_HERO_IMAGES["audi-q8"],
    score: 63,
    verdict:
      "A high-tech luxury SUV whose used value depends on clean diagnostics and disciplined maintenance. Tires, suspension, electronics, emissions, and gearbox data are decisive.",
    bestFor: "Buyers who want flagship Audi design and comfort with a realistic premium-SUV maintenance budget.",
    watchOut:
      "Avoid air suspension warnings, cheap tires, unresolved MMI faults, AdBlue/NOx codes, rough gearbox shifts, and incomplete service history.",
    marketPosition:
      "The Q8 has luxury-car repair exposure in SUV form. A cheap example without evidence is rarely cheap after ownership starts.",
    ownershipPlan: [
      "Scan all modules before purchase, including suspension, driver assistance, infotainment, gearbox, and emissions.",
      "Budget for large tires, brakes, suspension service, and premium diagnostics.",
      "Verify gearbox, quattro, brake fluid, coolant, and emissions-related repair history.",
    ],
    engines: [
      { label: "V6 TDI", note: "Strong cruiser; check AdBlue, NOx, EGR, DPF, and injector data.", risk: "Medium" },
      { label: "V6 TFSI", note: "Inspect cooling, PCV, oil leaks, ignition, and scan data.", risk: "Medium" },
      { label: "Tiptronic / quattro", note: "Road-test for smooth shifts and driveline vibration.", risk: "Medium" },
      { label: "Air suspension", note: "Ride-height faults and compressor work can be expensive.", risk: "Higher" },
    ],
    commonProblems: [
      "Air suspension leaks, compressor fatigue, and chassis module faults.",
      "Diesel SCR, AdBlue, NOx, EGR, and DPF warnings.",
      "MMI, camera, parking, driver-assistance, and comfort-electronics faults.",
      "Cooling leaks, oil leaks, and V6 service-cost exposure.",
      "Heavy tire, brake, bushing, and alignment wear.",
    ],
    inspectionChecklist: [
      "Scan engine, gearbox, suspension, quattro, body, infotainment, and driver-assistance modules.",
      "Check ride height after sitting and cycle suspension modes.",
      "Inspect tire match, brake wear, wheel damage, coolant residue, and oil leaks.",
      "Test MMI screens, cameras, parking sensors, lighting, seats, and climate functions.",
      "Review invoices for gearbox, brake fluid, tires, suspension, battery, and emissions repairs.",
    ],
    searchTopics: ["Audi Q8", "quattro", "V6 TDI", "AdBlue", "air suspension", "MMI"],
  },
];

export function getModelPage(slug: string) {
  return modelPages.find((model) => model.slug === slug) ?? null;
}

export function getLocalizedModelPages(locale: Locale) {
  return modelPages.map((model) => translateValue(locale, model));
}

export function getLocalizedModelPage(slug: string, locale: Locale) {
  const model = getModelPage(slug);
  return model ? translateValue(locale, model) : null;
}

function includesAny(model: ModelPageData, terms: string[]) {
  const haystack = [
    model.name,
    model.brand,
    model.description,
    model.verdict,
    model.watchOut,
    model.marketPosition,
    ...model.engines.map((engine) => `${engine.label} ${engine.note}`),
    ...model.commonProblems,
    ...model.inspectionChecklist,
    ...model.searchTopics,
  ]
    .join(" ")
    .toLowerCase();

  return terms.some((term) => haystack.includes(term));
}

export function getBestUsedBuyScores(model: ModelPageData): BestUsedBuyScores {
  const isVolkswagen = model.brand === "Volkswagen";
  const isAudi = model.brand === "Audi";
  const isBmw = model.brand === "BMW";
  const isMercedes = model.brand === "Mercedes-Benz";
  const isSuv = includesAny(model, ["x1", "x3", "x5", "q3", "q5", "q7", "gla", "glc", "gle", "tiguan", "t-roc", "touareg", "suv"]);
  const isLuxury = includesAny(model, ["7 series", "s-class", "q7", "x5", "gle", "touareg", "air suspension", "luxury"]);
  const isDieselHeavy = includesAny(model, ["diesel", "tdi", "dpf", "egr", "adblue", "nox"]);
  const isCompact = includesAny(model, ["1 series", "x1", "a-class", "cla", "gla", "a1", "a3", "q3", "golf", "polo", "t-roc"]);

  return {
    reliability: model.score,
    repairCost: Math.max(45, Math.min(88, model.score + (isVolkswagen ? 8 : 0) - (isLuxury ? 9 : isSuv ? 5 : 0) - (isMercedes ? 2 : 0))),
    partsAvailability: Math.max(55, Math.min(94, 76 + (isVolkswagen ? 10 : 0) + (isBmw || isAudi ? 5 : 0) + (isCompact ? 4 : 0) - (isLuxury ? 4 : 0))),
    fuelEconomy: Math.max(48, Math.min(92, model.score + (isDieselHeavy ? 8 : 0) + (isCompact ? 8 : 0) - (isSuv ? 7 : 0) - (isLuxury ? 7 : 0))),
    resale: Math.max(52, Math.min(90, model.score + (isBmw ? 5 : 0) + (isMercedes ? 4 : 0) + (isVolkswagen ? 3 : 0) - (isLuxury ? 3 : 0))),
  };
}

export function getModelWarningSections(model: ModelPageData): ModelWarningSections {
  const diesel = includesAny(model, ["diesel", "tdi", "dpf", "egr", "adblue", "nox"]);
  const vag = model.brand === "Audi" || model.brand === "Volkswagen";
  const bmw = model.brand === "BMW";
  const mercedes = model.brand === "Mercedes-Benz";
  const suv = includesAny(model, ["x1", "x3", "x5", "q3", "q5", "q7", "gla", "glc", "gle", "tiguan", "t-roc", "touareg", "suv"]);
  const luxury = includesAny(model, ["7 series", "s-class", "q7", "x5", "gle", "touareg", "air suspension", "luxury"]);
  const compact = includesAny(model, ["1 series", "x1", "a-class", "cla", "gla", "a1", "a3", "q3", "golf", "polo", "t-roc"]);

  const engineProblems = [
    ...model.commonProblems.filter((problem) =>
      /engine|timing|chain|oil|cool|water|thermostat|egr|dpf|adblue|nox|injector|turbo|pcv|misfire|carbon/i.test(problem)
    ),
    diesel ? "Diesel emissions faults can turn a cheap car into an expensive repair if DPF, EGR, AdBlue, or NOx data is ignored." : "Petrol examples still need checks for cooling leaks, PCV faults, oil consumption, misfires, and direct-injection carbon buildup.",
  ].slice(0, 5);

  const gearboxIssues = [
    ...model.commonProblems.filter((problem) => /gearbox|zf|dsg|s tronic|7g|9g|mechatronics|clutch|flywheel|transmission/i.test(problem)),
    vag ? "On DSG/S tronic cars, missing fluid-service proof and low-speed judder should change the price immediately." : "",
    bmw ? "On ZF automatics, check cold and hot shift quality plus service evidence rather than accepting lifetime-fluid claims." : "",
    mercedes ? "On 7G/9G cars, test reverse, crawling traffic, light throttle, and warm restart behavior before trusting the gearbox." : "",
  ].filter(Boolean).slice(0, 4);

  const mileageDangerZones = [
    compact ? "60k-90k miles: inspect brakes, suspension, clutch/DSG behavior, cooling leaks, and city-use wear." : "70k-100k miles: verify gearbox service, cooling-system condition, suspension wear, and complete fluid history.",
    diesel ? "90k-130k miles: scan DPF soot load, EGR/NOx history, injector corrections, and regeneration behavior." : "80k-120k miles: check oil leaks, PCV, ignition components, coolant history, and timing-related evidence.",
    suv ? "100k+ miles: budget for tires, brakes, bushings, AWD/driveline service, and suspension work." : "120k+ miles: buy only with boring paperwork, clean scan data, and no hidden warning history.",
    luxury ? "Luxury options and air suspension can cost flagship money even when the purchase price looks cheap." : "At any mileage, a cleared fault scan with no service proof is a bigger warning than cosmetic wear.",
  ];

  const whatToCheck = [
    ...model.inspectionChecklist.slice(0, 4),
    "Ask for the exact engine code, gearbox type, service invoices, and a full diagnostic scan before paying a deposit.",
  ];

  return {
    commonEngineProblems: [...new Set(engineProblems)].slice(0, 5),
    gearboxIssues: [...new Set(gearboxIssues)].slice(0, 4),
    mileageDangerZones,
    whatToCheckBeforeBuying: [...new Set(whatToCheck)].slice(0, 5),
  };
}
