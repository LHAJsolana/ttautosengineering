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

export const modelPages: ModelPageData[] = [
  {
    slug: "bmw-3-series",
    name: "BMW 3 Series",
    brand: "BMW",
    brandHref: "/brands/bmw",
    title: "BMW 3 Series Used Buying Guide",
    description:
      "BMW 3 Series reliability, engine risks, common problems, and pre-purchase checks for used buyers.",
    heroImage:
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1628711957321-c85a8042763f?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1748607247405-b775d7c778b9?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1652890058094-a3fe8ead30fa?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1635990716619-7710162ea073?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1559167628-9394a8576f33?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1753477300510-441dc5054d5b?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1717711081688-985a7a3e6a9f?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1741479897627-d98ff167f115?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1566347287154-891d2eb25984?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1760550999996-111eadbac7f6?auto=format&fit=crop&w=1800&q=80",
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
