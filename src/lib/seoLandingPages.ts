import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type SeoLandingPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  brand: string;
  brandHref: string;
  intro: string;
  commonProblems: string[];
  symptoms: string[];
  checksBeforeBuying: string[];
  relatedFaultCodes: string[];
  relatedModels: { label: string; href: string }[];
  relatedPowertrains: { label: string; href: string }[];
  relatedComparisons: { label: string; href: string }[];
  relatedGuides: { label: string; href: string }[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "bmw-320d-f30-reliability",
    title: "BMW 320d F30 Reliability",
    metaTitle: "BMW 320d F30 reliability, common problems, and buying checks",
    metaDescription:
      "BMW 320d F30 reliability guide covering B47/N47 risks, timing history, EGR/DPF faults, gearbox checks, fault codes, and used-car buying red flags.",
    brand: "BMW",
    brandHref: "/brands/bmw",
    intro:
      "The F30 320d can be a strong used BMW when the exact engine, service history, emissions health, and gearbox behavior are verified before purchase.",
    commonProblems: [
      "N47 timing-chain noise on earlier cars and poor service history.",
      "B47 EGR cooler, DPF loading, and sensor-related emissions faults.",
      "Oil leaks around filter housing, valve cover, or turbo oil lines.",
      "Automatic gearbox shudder or delayed engagement when fluid service is ignored.",
    ],
    symptoms: [
      "Rattle on cold start or at the rear of the engine bay.",
      "Reduced power, smoke, or frequent DPF regeneration.",
      "Coolant smell, oil residue, or uneven idle.",
      "Harsh 2-3 shifts, vibration on lock-up, or delayed reverse.",
    ],
    checksBeforeBuying: [
      "Confirm whether the car uses N47 or B47 and check invoices by mileage/date.",
      "Scan engine, gearbox, ABS, and emissions modules before and after the test drive.",
      "Inspect EGR, DPF readiness, boost data, coolant level, and oil leak evidence.",
      "Budget for fluids, filters, thermostat/cooling work, and any missing gearbox service.",
    ],
    relatedFaultCodes: ["P0016", "P0299", "P0401", "P2002", "P2458", "P0700"],
    relatedModels: [{ label: "BMW 3 Series", href: "/models/bmw-3-series" }],
    relatedPowertrains: [
      { label: "BMW N47", href: "/powertrains/bmw-n47" },
      { label: "BMW B47", href: "/powertrains/bmw-b47" },
      { label: "ZF 8HP", href: "/powertrains/zf-8hp" },
    ],
    relatedComparisons: [{ label: "BMW N47 vs B47", href: "/compare/bmw-n47-vs-b47" }],
    relatedGuides: [
      { label: "Used-car checklist", href: "/buying-checklist" },
      { label: "BMW red flags article", href: "/blog/seven-red-flags-before-buying-used-german-car" },
    ],
  },
  {
    slug: "mercedes-c220d-w205-common-problems",
    title: "Mercedes C220d W205 Common Problems",
    metaTitle: "Mercedes C220d W205 common problems and used buying checks",
    metaDescription:
      "Mercedes C220d W205 buyer guide covering OM651/OM654 issues, AdBlue/NOx faults, 9G-Tronic checks, suspension, diagnostics, and service-history red flags.",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    intro:
      "A W205 C220d is often durable when maintained, but diesel emissions hardware, electrical health, and gearbox behavior decide the real ownership cost.",
    commonProblems: [
      "NOx sensor and AdBlue faults on diesel cars.",
      "OM651 timing-chain noise on neglected examples.",
      "DPF/EGR faults from short-trip usage or poor maintenance.",
      "9G-Tronic calibration issues, harsh shifts, or overdue fluid service.",
    ],
    symptoms: [
      "Countdown warning, AdBlue range warning, or check-engine light.",
      "Chain rattle at cold start, rough idle, or diesel knock.",
      "Low-speed shift bump, hesitation, or vibration when warm.",
      "Battery warnings, sensor faults, or intermittent electrical behavior.",
    ],
    checksBeforeBuying: [
      "Scan with Mercedes-capable diagnostics, not only a generic OBD reader.",
      "Check NOx, AdBlue, DPF soot/load, EGR, and SCR readiness data.",
      "Review gearbox fluid service and test low-speed downshifts when warm.",
      "Confirm service records, recall/campaign history, and battery condition.",
    ],
    relatedFaultCodes: ["P2002", "P0401", "P204F", "P20EE", "P0700", "U0100"],
    relatedModels: [{ label: "Mercedes C-Class", href: "/models/mercedes-c-class" }],
    relatedPowertrains: [
      { label: "Mercedes OM651", href: "/powertrains/mercedes-om651" },
      { label: "Mercedes 9G-Tronic", href: "/powertrains/mercedes-9g-tronic" },
    ],
    relatedComparisons: [{ label: "OM651 vs OM654", href: "/compare/mercedes-om651-vs-om654" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "audi-a4-20-tdi-buying-guide",
    title: "Audi A4 2.0 TDI Buying Guide",
    metaTitle: "Audi A4 2.0 TDI buying guide, faults, and inspection checks",
    metaDescription:
      "Audi A4 2.0 TDI used buying guide covering EGR/DPF faults, S tronic behavior, timing belt history, cooling leaks, and diagnostic red flags.",
    brand: "Audi",
    brandHref: "/brands/audi",
    intro:
      "The Audi A4 2.0 TDI rewards careful buyers who verify timing service, emissions condition, S tronic history, and long-drive usage before purchase.",
    commonProblems: [
      "DPF loading and EGR flow faults after city-heavy use.",
      "Cooling leaks from water pump, thermostat, or plastic housings.",
      "Timing belt overdue or undocumented on belt-driven diesel variants.",
      "S tronic clutch/mechatronic complaints when service history is weak.",
    ],
    symptoms: [
      "Fan running after short trips, limp mode, smoke, or poor boost response.",
      "Coolant loss, sweet smell, or residue around the front of the engine.",
      "Clutch judder, delayed drive, or harsh low-speed shifts.",
      "No invoices for belt, water pump, DSG/S tronic oil, or filters.",
    ],
    checksBeforeBuying: [
      "Verify engine code, timing interval, and invoices for belt/water pump service.",
      "Scan DPF soot, EGR flow, boost pressure, and gearbox modules.",
      "Test from cold through full warm-up, including stop-start city driving.",
      "Inspect coolant system, oil leaks, turbo pipes, and undertray residue.",
    ],
    relatedFaultCodes: ["P0299", "P0401", "P2002", "P2458", "P0700", "P0730"],
    relatedModels: [{ label: "Audi A4", href: "/models/audi-a4" }],
    relatedPowertrains: [{ label: "VAG DQ250 DSG", href: "/powertrains/vag-dq250-dsg" }],
    relatedComparisons: [{ label: "Audi A4 vs BMW 3 Series", href: "/compare/audi-a4-vs-bmw-3-series" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "vw-golf-7-dsg-problems",
    title: "VW Golf 7 DSG Problems",
    metaTitle: "VW Golf 7 DSG problems, symptoms, and used buying checks",
    metaDescription:
      "VW Golf 7 DSG guide covering mechatronic symptoms, clutch judder, service history, DQ250/DQ200 checks, fault codes, and buying red flags.",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    intro:
      "Golf 7 DSG reliability depends heavily on the exact gearbox, fluid history, previous driving style, and whether early mechatronic symptoms are ignored.",
    commonProblems: [
      "Mechatronic pressure or selector faults.",
      "Clutch judder, hesitation, or rough take-up in traffic.",
      "Overdue DSG oil service on wet-clutch units.",
      "Battery/voltage issues creating misleading gearbox warnings.",
    ],
    symptoms: [
      "Delayed reverse, clunk from stop, or flashing gear indicator.",
      "Harsh 1-2 or 2-1 shifts when hot.",
      "Shudder while parking or creeping uphill.",
      "Stored transmission control codes even if the dashboard is clear.",
    ],
    checksBeforeBuying: [
      "Identify DQ200, DQ250, or another DSG variant before judging risk.",
      "Scan gearbox adaptations, clutch data, pressure faults, and voltage history.",
      "Drive cold and fully warm in stop-start traffic, not only on a fast road.",
      "Ask for DSG fluid invoices where the gearbox requires service.",
    ],
    relatedFaultCodes: ["P0700", "P0730", "P0715", "P0750", "P0868", "U0100"],
    relatedModels: [{ label: "Volkswagen Golf", href: "/models/volkswagen-golf" }],
    relatedPowertrains: [{ label: "VAG DQ250 DSG", href: "/powertrains/vag-dq250-dsg" }],
    relatedComparisons: [{ label: "VW Golf vs Audi A3", href: "/compare/vw-golf-vs-audi-a3" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "bmw-b47-engine-problems",
    title: "BMW B47 Engine Problems",
    metaTitle: "BMW B47 engine problems, symptoms, and buying checks",
    metaDescription:
      "BMW B47 engine problems guide covering EGR cooler risk, DPF issues, timing clues, oil leaks, boost faults, fault codes, and used-car inspection steps.",
    brand: "BMW",
    brandHref: "/brands/bmw",
    intro:
      "The B47 is generally stronger than the N47, but EGR/DPF health, boost control, cooling condition, and service intervals still decide buyer risk.",
    commonProblems: [
      "EGR cooler problems and recall/campaign history.",
      "DPF loading or frequent regeneration from short trips.",
      "Boost leaks, actuator issues, or sensor-related limp mode.",
      "Oil leaks and cooling-system residue as mileage rises.",
    ],
    symptoms: [
      "Limp mode, reduced power, smoke, or boost-pressure codes.",
      "Coolant loss, EGR odor, or evidence of emissions-system work.",
      "Rough idle, hesitation, or repeated DPF warnings.",
      "Missing oil-change invoices or long intervals.",
    ],
    checksBeforeBuying: [
      "Check BMW campaign/recall history for the EGR cooler.",
      "Scan DPF soot/load, EGR command, boost pressure, and sensor data.",
      "Inspect coolant level, EGR area, turbo hoses, and oil leak points.",
      "Prefer cars with consistent oil service and regular longer drives.",
    ],
    relatedFaultCodes: ["P0299", "P0234", "P0401", "P2002", "P2458", "P0128"],
    relatedModels: [
      { label: "BMW 3 Series", href: "/models/bmw-3-series" },
      { label: "BMW 5 Series", href: "/models/bmw-5-series" },
    ],
    relatedPowertrains: [{ label: "BMW B47", href: "/powertrains/bmw-b47" }],
    relatedComparisons: [
      { label: "BMW N47 vs B47", href: "/compare/bmw-n47-vs-b47" },
      { label: "BMW B47 vs B48", href: "/compare/bmw-b47-vs-b48" },
    ],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "mercedes-9g-tronic-reliability",
    title: "Mercedes 9G-Tronic Reliability",
    metaTitle: "Mercedes 9G-Tronic reliability, symptoms, and buying checks",
    metaDescription:
      "Mercedes 9G-Tronic reliability guide covering shift behavior, fluid service, adaptation issues, fault codes, diagnostics, and used-car inspection checks.",
    brand: "Mercedes-Benz",
    brandHref: "/brands/mercedes-benz",
    intro:
      "The 9G-Tronic can be smooth and durable, but low-speed behavior, fluid history, software/adaptation state, and electrical health need checking.",
    commonProblems: [
      "Harsh low-speed downshifts or delayed engagement.",
      "Overdue transmission fluid service on high-mileage cars.",
      "Adaptation or software issues after repairs or weak battery events.",
      "Torque-converter shudder or vibration under light load.",
    ],
    symptoms: [
      "Bump into gear, flare between gears, or hesitation when hot.",
      "Vibration at steady speed or lock-up feel under gentle throttle.",
      "Transmission warning after voltage problems.",
      "No gearbox service proof despite high mileage.",
    ],
    checksBeforeBuying: [
      "Test the car cold and warm in traffic, hills, reverse, and light throttle.",
      "Scan TCU faults, adaptation data, voltage history, and engine torque faults.",
      "Ask for fluid/filter service proof or budget for preventive service.",
      "Separate engine misfire/boost issues from true gearbox faults.",
    ],
    relatedFaultCodes: ["P0700", "P0730", "P0715", "P0741", "P0868", "U0100"],
    relatedModels: [
      { label: "Mercedes C-Class", href: "/models/mercedes-c-class" },
      { label: "Mercedes E-Class", href: "/models/mercedes-e-class" },
    ],
    relatedPowertrains: [{ label: "Mercedes 9G-Tronic", href: "/powertrains/mercedes-9g-tronic" }],
    relatedComparisons: [{ label: "BMW 5 Series vs Mercedes E-Class", href: "/compare/bmw-5-series-vs-mercedes-e-class" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "audi-ea888-water-pump-issues",
    title: "Audi EA888 Water Pump Issues",
    metaTitle: "Audi EA888 water pump issues, symptoms, and buying checks",
    metaDescription:
      "Audi EA888 water pump and thermostat housing guide covering coolant leaks, overheating clues, fault codes, repair cost risk, and used-car inspection checks.",
    brand: "Audi",
    brandHref: "/brands/audi",
    intro:
      "EA888 water pump and thermostat housing leaks are common enough that every used Audi TFSI buyer should inspect cooling evidence before purchase.",
    commonProblems: [
      "Plastic water pump or thermostat housing leakage.",
      "Coolant smell, residue, or repeated top-ups.",
      "Thermostat regulation faults and slow warm-up.",
      "Secondary damage from overheating or ignored coolant loss.",
    ],
    symptoms: [
      "Pink/white crust, sweet smell, or low coolant warning.",
      "Temperature instability or heater output changes.",
      "Puddles after parking or dampness under intake-side components.",
      "Seller says it only needs a small top-up.",
    ],
    checksBeforeBuying: [
      "Inspect around the pump/thermostat housing with a light after the test drive.",
      "Check coolant level cold and hot, pressure behavior, and scan temperature data.",
      "Ask whether pump, thermostat, coolant, and any hoses were replaced together.",
      "Avoid cars driven while overheating or with mixed/incorrect coolant.",
    ],
    relatedFaultCodes: ["P0128", "P0118", "P0171", "P0300", "P0301", "P0302"],
    relatedModels: [
      { label: "Audi A4", href: "/models/audi-a4" },
      { label: "Audi A3", href: "/models/audi-a3" },
    ],
    relatedPowertrains: [{ label: "VAG EA888", href: "/powertrains/vag-ea888" }],
    relatedComparisons: [{ label: "Audi A4 vs BMW 3 Series", href: "/compare/audi-a4-vs-bmw-3-series" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
  {
    slug: "volkswagen-dsg-mechatronic-problems",
    title: "Volkswagen DSG Mechatronic Problems",
    metaTitle: "Volkswagen DSG mechatronic problems, symptoms, and buying checks",
    metaDescription:
      "Volkswagen DSG mechatronic problems guide covering symptoms, fault codes, DQ200/DQ250 differences, service checks, and used-car buying red flags.",
    brand: "Volkswagen",
    brandHref: "/brands/volkswagen",
    intro:
      "DSG mechatronic risk is manageable only when the exact gearbox, service history, fault memory, and test-drive behavior are checked properly.",
    commonProblems: [
      "Hydraulic pressure, selector, or solenoid faults.",
      "Clutch adaptation issues or judder in traffic.",
      "Overdue fluid service on wet-clutch DSG variants.",
      "Voltage and battery issues confusing gearbox diagnosis.",
    ],
    symptoms: [
      "Flashing PRNDS/gear indicator or transmission warning.",
      "Delayed engagement, harsh shift, or failsafe mode.",
      "Shudder when moving off or parking.",
      "Codes stored in TCU even after the dashboard is cleared.",
    ],
    checksBeforeBuying: [
      "Identify gearbox code and service requirements before viewing.",
      "Scan the TCU, not just engine OBD codes.",
      "Drive in stop-start traffic until fully warm and test reverse repeatedly.",
      "Treat missing DSG service proof as a negotiation cost or walk-away signal.",
    ],
    relatedFaultCodes: ["P0700", "P0730", "P0715", "P0750", "P0868", "U0100"],
    relatedModels: [
      { label: "Volkswagen Golf", href: "/models/volkswagen-golf" },
      { label: "Volkswagen Passat", href: "/models/volkswagen-passat" },
    ],
    relatedPowertrains: [{ label: "VAG DQ250 DSG", href: "/powertrains/vag-dq250-dsg" }],
    relatedComparisons: [{ label: "VW Golf vs Audi A3", href: "/compare/vw-golf-vs-audi-a3" }],
    relatedGuides: [{ label: "Used-car checklist", href: "/buying-checklist" }],
  },
];

export function getSeoLandingPage(slug: string, locale: Locale = "en") {
  const page = seoLandingPages.find((item) => item.slug === slug);
  return page ? translateValue(locale, page) : undefined;
}

export function getLocalizedSeoLandingPages(locale: Locale) {
  return translateValue(locale, seoLandingPages);
}
