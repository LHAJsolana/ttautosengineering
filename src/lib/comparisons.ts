import type { Locale } from "@/lib/i18n";
import { modelPages } from "@/lib/models";
import { powertrains } from "@/lib/powertrains";
import { translateValue } from "@/lib/translate";

type ComparisonKind = "Model" | "Engine" | "Cross-brand";

export type DirectComparisonData = {
  slug: string;
  title: string;
  description: string;
  kind: ComparisonKind;
  left: string;
  right: string;
  leftHref: string;
  rightHref: string;
  leftScore: number;
  rightScore: number;
  winner: string;
  bestUsedBuy: string;
  verdict: string;
  keyDifferences: string[];
  buyerAdvice: string[];
  redFlags: string[];
};

function getModel(slug: string) {
  const model = modelPages.find((item) => item.slug === slug);
  if (!model) throw new Error(`Missing comparison model: ${slug}`);
  return model;
}

function getPowertrain(slug: string) {
  const powertrain = powertrains.find((item) => item.slug === slug);
  if (!powertrain) throw new Error(`Missing comparison powertrain: ${slug}`);
  return powertrain;
}

const b47 = getPowertrain("bmw-b47");
const b48 = getPowertrain("bmw-b48");
const n47 = getPowertrain("bmw-n47");
const om651 = getPowertrain("mercedes-om651");
const bmw3 = getModel("bmw-3-series");
const cClass = getModel("mercedes-c-class");
const golf = getModel("volkswagen-golf");
const a3 = getModel("audi-a3");
const a4 = getModel("audi-a4");

export const directComparisons: DirectComparisonData[] = [
  {
    slug: "bmw-b47-vs-b48",
    title: "BMW B47 vs B48",
    description: "BMW diesel vs petrol used-buy comparison covering reliability, running cost, inspection risk, and ownership fit.",
    kind: "Engine",
    left: b47.name,
    right: b48.name,
    leftHref: `/powertrains/${b47.slug}`,
    rightHref: `/powertrains/${b48.slug}`,
    leftScore: b47.score,
    rightScore: b48.score,
    winner: b48.name,
    bestUsedBuy: "B48 for lower emissions complexity and fewer diesel-use-pattern risks; B47 for high-mileage motorway use with clean EGR/DPF evidence.",
    verdict:
      "The B48 is usually the easier private used buy because cooling, oil, PCV, and ignition issues are simpler to inspect than diesel emissions health. The B47 still makes sense for long-distance drivers who can keep the DPF healthy.",
    keyDifferences: [
      "B47 is stronger on fuel economy and torque for motorway mileage.",
      "B48 avoids DPF, EGR cooler, NOx, and diesel short-trip exposure.",
      "B47 purchase quality depends heavily on EGR campaign history and DPF scan data.",
      "B48 inspection should focus on cooling leaks, PCV behavior, misfires, and oil seepage.",
    ],
    buyerAdvice: [
      "Pick B47 only when the car has regular long runs and verified emissions health.",
      "Pick B48 when you want lower diagnostic uncertainty and mostly mixed urban driving.",
      "For either engine, shorten oil intervals and inspect coolant loss before buying.",
    ],
    redFlags: ["Coolant loss", "Stored emissions faults", "Rough cold idle", "Oil leaks", "Seller refuses scan"],
  },
  {
    slug: "bmw-n47-vs-b47",
    title: "BMW N47 vs B47",
    description: "BMW diesel generation comparison focused on timing-chain risk, emissions systems, maintenance evidence, and safer used buys.",
    kind: "Engine",
    left: n47.name,
    right: b47.name,
    leftHref: `/powertrains/${n47.slug}`,
    rightHref: `/powertrains/${b47.slug}`,
    leftScore: n47.score,
    rightScore: b47.score,
    winner: b47.name,
    bestUsedBuy: "B47, unless the N47 has unusually strong timing-chain evidence, oil history, and cold-start behavior.",
    verdict:
      "The B47 is the safer default because it improves the biggest N47 ownership concern. The N47 can still work, but only as a documented car bought with timing-chain risk priced in.",
    keyDifferences: [
      "N47 risk is dominated by rear-mounted timing-chain condition and repair evidence.",
      "B47 is generally improved but still needs emissions and cooling checks.",
      "N47 cheap purchase prices can disappear quickly if chain work is needed.",
      "B47 usually gives better inspection confidence for normal buyers.",
    ],
    buyerAdvice: [
      "Do not buy an N47 without true cold-start listening and timing paperwork.",
      "Scan both engines for DPF, EGR, glow, injector, and boost faults.",
      "Treat vague oil-service history as a serious negotiation point.",
    ],
    redFlags: ["Chain rattle", "Long oil intervals", "DPF warnings", "Smoke under load", "No timing evidence"],
  },
  {
    slug: "mercedes-om651-vs-om654",
    title: "Mercedes OM651 vs OM654",
    description: "Mercedes diesel comparison for C-Class, E-Class, and GLC buyers deciding between older proven diesel and newer emissions complexity.",
    kind: "Engine",
    left: om651.name,
    right: "Mercedes-Benz OM654",
    leftHref: `/powertrains/${om651.slug}`,
    rightHref: "/search?q=OM654",
    leftScore: om651.score,
    rightScore: 72,
    winner: "Mercedes-Benz OM654",
    bestUsedBuy: "OM654 for newer, efficient cars with clean emissions data; OM651 for cheaper cars with exceptional service records and no hidden warnings.",
    verdict:
      "The OM654 is the stronger modern choice when diagnostic data is clean. The OM651 can still be durable, but older examples need careful injector, timing, emissions, and battery-voltage checks.",
    keyDifferences: [
      "OM651 has more age-related risk and a wider spread of ownership quality.",
      "OM654 is newer and efficient but still depends on NOx, AdBlue, DPF, and sensor health.",
      "OM651 value is strongest when records are unusually complete.",
      "OM654 purchase risk rises sharply if emissions warnings have been cleared recently.",
    ],
    buyerAdvice: [
      "Use Mercedes-capable diagnostics, not only generic OBD.",
      "Verify no AdBlue countdown, NOx history, or repeated emissions repairs.",
      "Check battery health before trusting electronic fault patterns.",
    ],
    redFlags: ["AdBlue countdown", "NOx faults", "Injector correction issues", "Weak battery", "Incomplete service records"],
  },
  {
    slug: "audi-20-tdi-vs-bmw-b47",
    title: "Audi 2.0 TDI vs BMW B47",
    description: "Cross-brand diesel comparison for buyers choosing between Audi/VW 2.0 TDI cars and BMW B47-powered models.",
    kind: "Cross-brand",
    left: "Audi 2.0 TDI",
    right: b47.name,
    leftHref: "/search?q=Audi%202.0%20TDI",
    rightHref: `/powertrains/${b47.slug}`,
    leftScore: 70,
    rightScore: b47.score,
    winner: b47.name,
    bestUsedBuy: "BMW B47 when emissions and cooling are clean; Audi 2.0 TDI when DSG history and diesel emissions data are stronger than the BMW example.",
    verdict:
      "Both can be sensible diesel buys. The better car is usually the one with clearer service evidence, cleaner scan data, and better gearbox history rather than the badge with the higher reputation.",
    keyDifferences: [
      "Audi 2.0 TDI buying risk often comes with DSG/S tronic service and VAG emissions systems.",
      "BMW B47 risk centers on EGR/DPF health, coolant loss, and BMW-specific service history.",
      "Audi may offer stronger parts availability across VAG platforms.",
      "BMW B47 cars often feel stronger dynamically but can cost more to baseline.",
    ],
    buyerAdvice: [
      "Choose by scan report and service proof, not badge.",
      "Verify DSG/S tronic fluid history on the Audi.",
      "Verify EGR campaign, DPF loading, and coolant stability on the BMW.",
    ],
    redFlags: ["No gearbox invoice", "DPF load high", "EGR/NOx faults", "Coolant residue", "Rough low-speed shifts"],
  },
  {
    slug: "vw-golf-vs-audi-a3",
    title: "Volkswagen Golf vs Audi A3",
    description: "Compact VAG comparison covering value, premium feel, shared engines, DSG risk, and practical used-buy logic.",
    kind: "Model",
    left: golf.name,
    right: a3.name,
    leftHref: `/models/${golf.slug}`,
    rightHref: `/models/${a3.slug}`,
    leftScore: golf.score,
    rightScore: a3.score,
    winner: golf.name,
    bestUsedBuy: "Golf for value and parts availability; A3 for premium cabin feel when service history is clearly better.",
    verdict:
      "The Golf is usually the smarter value buy because much of the engineering is shared. The A3 earns its premium only when condition, specification, and service proof are stronger.",
    keyDifferences: [
      "Golf usually gives better purchase value and simpler parts pricing.",
      "A3 offers a more premium cabin and badge, but shares many drivetrain risks.",
      "Both need engine-code, DSG, Haldex, and emissions checks where fitted.",
      "A3 can hide expensive neglect behind a nicer interior.",
    ],
    buyerAdvice: [
      "Compare exact engine and gearbox, not just Golf vs A3 badges.",
      "Prefer the car with DSG/Haldex invoices and cleaner scan data.",
      "Avoid modified or hard-used examples unless maintenance proof is excellent.",
    ],
    redFlags: ["DSG judder", "Water-pump leaks", "Oil consumption", "Misfires", "Cheap tires"],
  },
  {
    slug: "bmw-3-series-vs-mercedes-c-class",
    title: "BMW 3 Series vs Mercedes C-Class",
    description: "Executive saloon comparison for buyers choosing between BMW dynamics and Mercedes comfort.",
    kind: "Model",
    left: bmw3.name,
    right: cClass.name,
    leftHref: `/models/${bmw3.slug}`,
    rightHref: `/models/${cClass.slug}`,
    leftScore: bmw3.score,
    rightScore: cClass.score,
    winner: bmw3.name,
    bestUsedBuy: "3 Series for drivers prioritizing dynamics with verified engine history; C-Class for comfort buyers with clean electronics and emissions checks.",
    verdict:
      "The 3 Series is usually the sharper driver’s car, while the C-Class is the calmer comfort choice. Reliability depends less on badge and more on engine family, gearbox behavior, scan quality, and service proof.",
    keyDifferences: [
      "BMW risk often centers on cooling, oil leaks, timing-sensitive diesels, and ZF service proof.",
      "Mercedes risk often centers on AdBlue/NOx, battery voltage, electronics, and 7G/9G behavior.",
      "BMW is usually more rewarding to drive.",
      "Mercedes often feels more relaxed and comfort-focused.",
    ],
    buyerAdvice: [
      "Choose the BMW if cold-start, leak, and gearbox checks are clean.",
      "Choose the Mercedes if full module diagnostics show clean emissions and electronics.",
      "Avoid either car when warning lights or service gaps are explained away casually.",
    ],
    redFlags: ["Coolant loss", "AdBlue faults", "Gearbox jolts", "Oil leaks", "Weak battery"],
  },
  {
    slug: "audi-a4-vs-bmw-3-series",
    title: "Audi A4 vs BMW 3 Series",
    description: "Premium saloon comparison covering drivetrain risk, refinement, dynamics, quattro assumptions, and used-buy inspection priorities.",
    kind: "Model",
    left: a4.name,
    right: bmw3.name,
    leftHref: `/models/${a4.slug}`,
    rightHref: `/models/${bmw3.slug}`,
    leftScore: a4.score,
    rightScore: bmw3.score,
    winner: bmw3.name,
    bestUsedBuy: "3 Series for dynamics and slightly stronger score; A4 when exact engine, S tronic, and quattro service proof are excellent.",
    verdict:
      "The 3 Series has the edge as a driver’s used buy, but a clean A4 can be a better ownership choice than a neglected BMW. Exact engine and gearbox matter more than brand preference.",
    keyDifferences: [
      "Audi A4 risk depends heavily on EA888/TDI generation, S tronic history, and quattro type.",
      "BMW 3 Series risk depends on engine family, cooling, oil leaks, timing, and ZF service proof.",
      "Audi usually feels more refined and secure.",
      "BMW usually feels sharper and more balanced.",
    ],
    buyerAdvice: [
      "Confirm Audi engine and gearbox codes before comparing.",
      "Check BMW cold start, leaks, and ZF behavior before negotiating.",
      "Choose the car with the stronger paper trail and cleaner scan.",
    ],
    redFlags: ["S tronic service gap", "Timing rattle", "Oil consumption", "Coolant leaks", "Quattro service assumptions"],
  },
];

export function getDirectComparison(slug: string) {
  return directComparisons.find((comparison) => comparison.slug === slug) ?? null;
}

export function getLocalizedDirectComparisons(locale: Locale) {
  return directComparisons.map((comparison) => translateValue(locale, comparison));
}

export function getLocalizedDirectComparison(slug: string, locale: Locale) {
  const comparison = getDirectComparison(slug);
  return comparison ? translateValue(locale, comparison) : null;
}
