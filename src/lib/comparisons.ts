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
const bmw4 = getModel("bmw-4-series");
const cClass = getModel("mercedes-c-class");
const bmw5 = getModel("bmw-5-series");
const bmw7 = getModel("bmw-7-series");
const bmwX1 = getModel("bmw-x1");
const bmwX3 = getModel("bmw-x3");
const bmwX5 = getModel("bmw-x5");
const eClass = getModel("mercedes-e-class");
const sClass = getModel("mercedes-s-class");
const gla = getModel("mercedes-gla");
const gle = getModel("mercedes-gle");
const golf = getModel("volkswagen-golf");
const polo = getModel("volkswagen-polo");
const passat = getModel("volkswagen-passat");
const tiguan = getModel("volkswagen-tiguan");
const arteon = getModel("volkswagen-arteon");
const tRoc = getModel("volkswagen-t-roc");
const a1 = getModel("audi-a1");
const a3 = getModel("audi-a3");
const a4 = getModel("audi-a4");
const a5 = getModel("audi-a5");
const q3 = getModel("audi-q3");
const q5 = getModel("audi-q5");

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
  {
    slug: "bmw-4-series-vs-audi-a5",
    title: "BMW 4 Series vs Audi A5",
    description: "Style-led coupe and Sportback comparison covering engine risk, gearbox history, refinement, dynamics, and used-buy inspection priorities.",
    kind: "Model",
    left: bmw4.name,
    right: a5.name,
    leftHref: `/models/${bmw4.slug}`,
    rightHref: `/models/${a5.slug}`,
    leftScore: bmw4.score,
    rightScore: a5.score,
    winner: bmw4.name,
    bestUsedBuy: "4 Series for sharper dynamics with clean BMW engine history; A5 when S tronic, quattro, and EA888/TDI evidence is stronger.",
    verdict:
      "Both cars can be good used buys, but they are often bought emotionally. The better example is the one with clearer engine, gearbox, tire, and body evidence rather than the better badge or prettier spec.",
    keyDifferences: [
      "BMW risk centers on cooling, oil leaks, timing-sensitive engines, and ZF service evidence.",
      "Audi risk centers on EA888/TDI generation, S tronic service, quattro assumptions, and oil behavior.",
      "The 4 Series usually feels more rear-drive and driver-focused.",
      "The A5 usually feels more refined and secure, especially in quattro form.",
    ],
    buyerAdvice: [
      "Choose the 4 Series if cold-start, leak, and gearbox checks are clean.",
      "Choose the A5 if engine code, S tronic, and quattro/Haldex records are stronger.",
      "Inspect body, tires, brakes, and modification history carefully on either car.",
    ],
    redFlags: ["Timing rattle", "S tronic judder", "Coolant loss", "Oil consumption", "Cheap modifications"],
  },
  {
    slug: "bmw-x1-vs-audi-q3",
    title: "BMW X1 vs Audi Q3",
    description: "Compact premium SUV comparison covering drivetrain risk, diesel emissions, AWD service, gearbox behavior, and ownership cost.",
    kind: "Model",
    left: bmwX1.name,
    right: q3.name,
    leftHref: `/models/${bmwX1.slug}`,
    rightHref: `/models/${q3.slug}`,
    leftScore: bmwX1.score,
    rightScore: q3.score,
    winner: bmwX1.name,
    bestUsedBuy: "X1 for slightly stronger score and BMW petrol/diesel options; Q3 when S tronic and quattro/Haldex records are unusually complete.",
    verdict:
      "The X1 is usually the easier compact SUV buy, but a clean Q3 can beat a neglected BMW. Exact engine, gearbox behavior, tire match, and scan data decide the safer purchase.",
    keyDifferences: [
      "X1 risk focuses on xDrive tire sensitivity, EGR/DPF health, cooling, and automatic behavior.",
      "Q3 risk focuses on S tronic service, EA888/TDI issues, Haldex service, and oil behavior.",
      "BMW usually feels sharper and lighter.",
      "Audi usually feels more premium inside and more settled.",
    ],
    buyerAdvice: [
      "Check tire match and driveline vibration on AWD versions of either car.",
      "Scan diesel emissions systems before trusting a clean dashboard.",
      "Prefer the car with gearbox service proof and fewer stored module faults.",
    ],
    redFlags: ["Mismatched tires", "DPF faults", "S tronic service gap", "Coolant residue", "AWD vibration"],
  },
  {
    slug: "mercedes-gla-vs-audi-q3",
    title: "Mercedes GLA vs Audi Q3",
    description: "Compact crossover comparison for buyers choosing between Mercedes comfort and Audi/VAG drivetrain logic.",
    kind: "Model",
    left: gla.name,
    right: q3.name,
    leftHref: `/models/${gla.slug}`,
    rightHref: `/models/${q3.slug}`,
    leftScore: gla.score,
    rightScore: q3.score,
    winner: gla.name,
    bestUsedBuy: "GLA for a clean Mercedes scan and healthy DCT; Q3 when S tronic, engine code, and Haldex records are stronger.",
    verdict:
      "These are close buys. The GLA needs careful electronics and DCT checks, while the Q3 needs exact VAG engine, S tronic, and quattro/Haldex verification.",
    keyDifferences: [
      "GLA risk often comes from 7G-DCT behavior, battery voltage, electronics, and diesel emissions.",
      "Q3 risk often comes from S tronic service, EA888/TDI issues, and Haldex neglect.",
      "Mercedes usually feels more comfort-led.",
      "Audi usually offers more familiar VAG parts and shared-platform knowledge.",
    ],
    buyerAdvice: [
      "Use brand-capable diagnostics before comparing prices.",
      "Test both gearboxes in traffic, reverse, and warm restarts.",
      "Choose the car with cleaner module history, better tires, and stronger invoices.",
    ],
    redFlags: ["DCT hesitation", "S tronic judder", "AdBlue faults", "Haldex neglect", "Weak battery"],
  },
  {
    slug: "bmw-5-series-vs-mercedes-e-class",
    title: "BMW 5 Series vs Mercedes E-Class",
    description: "Executive saloon comparison covering comfort, dynamics, diesel emissions, electronics, gearbox behavior, and long-distance ownership.",
    kind: "Model",
    left: bmw5.name,
    right: eClass.name,
    leftHref: `/models/${bmw5.slug}`,
    rightHref: `/models/${eClass.slug}`,
    leftScore: bmw5.score,
    rightScore: eClass.score,
    winner: bmw5.name,
    bestUsedBuy: "5 Series for dynamics and strong ZF-equipped examples; E-Class for comfort buyers with clean Mercedes electronics and emissions scans.",
    verdict:
      "Both are strong motorway cars. The 5 Series has the score edge, but the E-Class can be the calmer ownership choice if diagnostics, battery health, and emissions systems are clean.",
    keyDifferences: [
      "BMW risk centers on cooling, oil leaks, suspension wear, ZF service, and diesel emissions.",
      "Mercedes risk centers on battery voltage, electronics, AdBlue/NOx, and 7G/9G behavior.",
      "BMW usually feels more agile.",
      "Mercedes usually feels more relaxed and comfort-focused.",
    ],
    buyerAdvice: [
      "Buy the car with better scan data and more complete fluid-service history.",
      "For diesel examples, check DPF, EGR, NOx, AdBlue, and injector data.",
      "Inspect tires, suspension, brakes, and gearbox behavior after a proper long test drive.",
    ],
    redFlags: ["AdBlue warnings", "ZF service gap", "Weak battery", "Coolant loss", "Suspension knocks"],
  },
  {
    slug: "audi-q5-vs-bmw-x3",
    title: "Audi Q5 vs BMW X3",
    description: "Premium mid-size SUV comparison covering diesel and petrol risk, AWD service, gearbox behavior, refinement, and inspection priorities.",
    kind: "Model",
    left: q5.name,
    right: bmwX3.name,
    leftHref: `/models/${q5.slug}`,
    rightHref: `/models/${bmwX3.slug}`,
    leftScore: q5.score,
    rightScore: bmwX3.score,
    winner: bmwX3.name,
    bestUsedBuy: "X3 for slightly stronger score and BMW dynamics; Q5 when quattro/S tronic and engine records are cleaner than the BMW example.",
    verdict:
      "The X3 usually wins for driver appeal, while the Q5 counters with refinement. Reliability depends on exact drivetrain, AWD service, emissions health, and gearbox evidence.",
    keyDifferences: [
      "Q5 risk focuses on S tronic, quattro/Haldex assumptions, EA888/TDI issues, and electronics.",
      "X3 risk focuses on xDrive tire match, cooling, oil leaks, ZF service, and diesel emissions.",
      "Audi usually feels more cushioned and quiet.",
      "BMW usually feels sharper and more balanced.",
    ],
    buyerAdvice: [
      "Check tire match and AWD behavior on both cars.",
      "Verify S tronic service on the Audi and ZF service on the BMW.",
      "For diesels, scan emissions systems after a full test drive.",
    ],
    redFlags: ["Mismatched tires", "Gearbox judder", "DPF load high", "Coolant leaks", "Quattro service assumptions"],
  },
  {
    slug: "mercedes-gle-vs-bmw-x5",
    title: "Mercedes GLE vs BMW X5",
    description: "Large premium SUV comparison covering air suspension, diesel emissions, AWD systems, electronics, tires, brakes, and real ownership cost.",
    kind: "Model",
    left: gle.name,
    right: bmwX5.name,
    leftHref: `/models/${gle.slug}`,
    rightHref: `/models/${bmwX5.slug}`,
    leftScore: gle.score,
    rightScore: bmwX5.score,
    winner: `${gle.name} / ${bmwX5.name}`,
    bestUsedBuy: "Choose by condition: GLE for comfort with clean Airmatic/electronics data; X5 for dynamics with clean xDrive, emissions, and suspension evidence.",
    verdict:
      "This is too close to call by badge. Both can be excellent and both can become expensive quickly. The safer buy is the one with matched tires, clean scans, strong suspension records, and no emissions warnings.",
    keyDifferences: [
      "GLE risk often centers on Airmatic, Mercedes electronics, AdBlue/NOx, and gearbox behavior.",
      "X5 risk often centers on xDrive tire sensitivity, air suspension, diesel emissions, and cooling.",
      "Mercedes usually feels more comfort-led.",
      "BMW usually feels more dynamic and planted.",
    ],
    buyerAdvice: [
      "Do not skip specialist diagnostics on either SUV.",
      "Check air suspension behavior after sitting and during mode changes.",
      "Budget for tires, brakes, suspension, gearbox, and emissions work before negotiating.",
    ],
    redFlags: ["Suspension warning", "Cheap tires", "AdBlue faults", "Transfer shudder", "Weak battery"],
  },
  {
    slug: "volkswagen-passat-vs-arteon",
    title: "Volkswagen Passat vs Arteon",
    description: "Volkswagen family and fastback comparison covering value, DSG history, TDI/TSI risk, comfort equipment, and 4Motion checks.",
    kind: "Model",
    left: passat.name,
    right: arteon.name,
    leftHref: `/models/${passat.slug}`,
    rightHref: `/models/${arteon.slug}`,
    leftScore: passat.score,
    rightScore: arteon.score,
    winner: passat.name,
    bestUsedBuy: "Passat for value and simpler ownership; Arteon when condition, spec, DSG history, and 4Motion records justify the premium.",
    verdict:
      "The Arteon is the more emotional buy, but the Passat often makes more financial sense. Both need the same core VAG checks around DSG, cooling, emissions, and engine generation.",
    keyDifferences: [
      "Passat usually gives stronger value and wider parts familiarity.",
      "Arteon offers more style and premium equipment, which adds inspection points.",
      "Both depend heavily on DSG service history.",
      "4Motion examples need Haldex service and tire matching checks.",
    ],
    buyerAdvice: [
      "Choose the Passat if you want the lower-risk value play.",
      "Choose the Arteon only when the extra equipment all works and records are complete.",
      "Scan both cars and verify DSG/Haldex invoices before buying.",
    ],
    redFlags: ["DSG service gap", "Coolant loss", "AdBlue faults", "Haldex neglect", "Faulty driver aids"],
  },
  {
    slug: "volkswagen-t-roc-vs-tiguan",
    title: "Volkswagen T-Roc vs Tiguan",
    description: "Compact crossover and family SUV comparison covering practicality, DSG, TSI/TDI risk, 4Motion service, and running cost.",
    kind: "Model",
    left: tRoc.name,
    right: tiguan.name,
    leftHref: `/models/${tRoc.slug}`,
    rightHref: `/models/${tiguan.slug}`,
    leftScore: tRoc.score,
    rightScore: tiguan.score,
    winner: tRoc.name,
    bestUsedBuy: "T-Roc for lower running cost and compact use; Tiguan when space matters and service records are stronger.",
    verdict:
      "The T-Roc is usually the easier ownership choice, while the Tiguan is the better family tool. Both are VAG platform cars, so drivetrain and service evidence matter more than SUV image.",
    keyDifferences: [
      "T-Roc is smaller, lighter, and often cheaper to run.",
      "Tiguan offers more space but brings higher tire, brake, and suspension exposure.",
      "Both need DSG, cooling, TSI/TDI, and emissions checks.",
      "4Motion versions of either need Haldex service proof.",
    ],
    buyerAdvice: [
      "Pick T-Roc if compact daily use matters more than rear-seat and boot space.",
      "Pick Tiguan if family practicality is worth the higher running budget.",
      "Use scan data and service invoices to choose between close examples.",
    ],
    redFlags: ["DSG judder", "Water-pump leaks", "DPF faults", "Haldex service gap", "Suspension knocks"],
  },
  {
    slug: "audi-a1-vs-volkswagen-polo",
    title: "Audi A1 vs Volkswagen Polo",
    description: "Premium small car comparison covering shared VAG engines, value, S tronic/DSG risk, timing evidence, and city-use wear.",
    kind: "Model",
    left: a1.name,
    right: polo.name,
    leftHref: `/models/${a1.slug}`,
    rightHref: `/models/${polo.slug}`,
    leftScore: a1.score,
    rightScore: polo.score,
    winner: polo.name,
    bestUsedBuy: "Polo for value and simpler ownership; A1 when condition, spec, and service history justify the premium.",
    verdict:
      "The Polo is usually the smarter buy because much of the mechanical logic is shared. The A1 earns its premium only when the cabin, condition, and records are genuinely better.",
    keyDifferences: [
      "Polo usually costs less to buy and maintain.",
      "A1 gives a more premium cabin but shares many drivetrain risks.",
      "Both need timing, cooling, TSI/TDI, and gearbox checks.",
      "City-use wear can matter more than mileage on both cars.",
    ],
    buyerAdvice: [
      "Compare exact engine and gearbox, not badge alone.",
      "Prefer the car with better tires, cleaner scan data, and stronger service proof.",
      "Avoid rough automated gearboxes or cars with recent cosmetic-only preparation.",
    ],
    redFlags: ["Timing noise", "DSG/S tronic judder", "Misfires", "Coolant loss", "Crash repair signs"],
  },
  {
    slug: "bmw-7-series-vs-mercedes-s-class",
    title: "BMW 7 Series vs Mercedes S-Class",
    description: "Flagship luxury saloon comparison covering air suspension, electronics, diesel and petrol risk, gearbox behavior, and inspection cost.",
    kind: "Model",
    left: bmw7.name,
    right: sClass.name,
    leftHref: `/models/${bmw7.slug}`,
    rightHref: `/models/${sClass.slug}`,
    leftScore: bmw7.score,
    rightScore: sClass.score,
    winner: sClass.name,
    bestUsedBuy: "S-Class for maximum comfort with clean Airmatic and electronics; 7 Series when BMW diagnostics, suspension, and drivetrain evidence are stronger.",
    verdict:
      "These cars should never be bought as cheap luxury shortcuts. The safer flagship is the one with specialist inspection, clean module scans, working equipment, and documented suspension and fluid work.",
    keyDifferences: [
      "7 Series risk centers on BMW electronics, air suspension, cooling, ZF service, and high-output engine costs.",
      "S-Class risk centers on Airmatic, comfort electronics, AdBlue/NOx, and option-heavy cabin systems.",
      "BMW usually feels more driver-focused.",
      "Mercedes usually feels more isolated and comfort-led.",
    ],
    buyerAdvice: [
      "Pay for specialist diagnostics before choosing either flagship.",
      "Test every luxury feature, not just engine and gearbox behavior.",
      "Budget for flagship tires, brakes, batteries, suspension, and electronics from day one.",
    ],
    redFlags: ["Air suspension sag", "Dead luxury options", "Weak battery", "AdBlue faults", "Oil leaks"],
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
