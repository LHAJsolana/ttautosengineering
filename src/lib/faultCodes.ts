import type { Locale } from "@/lib/i18n";
import { translateValue } from "@/lib/translate";

export type FaultCode = {
  code: string;
  title: string;
  system: string;
  severity: "Low" | "Medium" | "High";
  summary: string;
  symptoms: string[];
  likelyCauses: string[];
  firstChecks: string[];
  warning: string;
  keywords: string[];
};

export const faultCodes: FaultCode[] = [
  {
    code: "P0016",
    title: "Crankshaft / camshaft timing correlation",
    system: "Engine timing",
    severity: "High",
    summary: "The ECU sees the crankshaft and camshaft signals outside their expected relationship.",
    symptoms: ["Long cranking", "Rough running", "Reduced power", "Cold-start rattle"],
    likelyCauses: ["Stretched or incorrectly installed timing drive", "Cam or crank sensor signal fault", "Oil-pressure or variable-timing control issue"],
    firstChecks: ["Confirm oil level and correct oil specification", "Read freeze-frame and manufacturer-specific timing values", "Inspect timing mechanically before replacing sensors"],
    warning: "Continued driving can risk internal engine damage when mechanical timing is genuinely incorrect.",
    keywords: ["timing chain", "camshaft", "crankshaft", "cold start"],
  },
  {
    code: "P0087",
    title: "Fuel rail pressure too low",
    system: "Fuel delivery",
    severity: "High",
    summary: "Measured fuel pressure fell below the pressure requested by the engine controller.",
    symptoms: ["Hard starting", "Hesitation", "Stalling", "Reduced-power mode"],
    likelyCauses: ["Restricted fuel supply", "Weak low- or high-pressure pump", "Injector leak-off", "Pressure sensor or control-valve fault"],
    firstChecks: ["Compare requested and actual pressure", "Check filter and low-pressure supply", "Perform injector return-flow testing where applicable"],
    warning: "High-pressure fuel systems require correct equipment and safe workshop procedures.",
    keywords: ["fuel pressure", "rail pressure", "injector", "pump"],
  },
  {
    code: "P0101",
    title: "Mass-air-flow signal range / performance",
    system: "Air metering",
    severity: "Medium",
    summary: "Airflow reported by the MAF sensor does not agree with the ECU's calculated operating conditions.",
    symptoms: ["Poor response", "Smoke", "Uneven idle", "Fuel-economy change"],
    likelyCauses: ["Air leak after the sensor", "Contaminated or failed MAF", "EGR flow problem", "Boost or intake restriction"],
    firstChecks: ["Inspect intake hoses and clamps", "Compare MAF data with expected values", "Check EGR and boost plausibility before replacing the sensor"],
    warning: "A MAF code often describes a system plausibility problem, not automatically a failed MAF sensor.",
    keywords: ["MAF", "air flow", "intake leak", "EGR"],
  },
  {
    code: "P0171",
    title: "System too lean, bank 1",
    system: "Fuel mixture",
    severity: "Medium",
    summary: "Fuel trim has reached a lean threshold because the ECU is adding more fuel than expected.",
    symptoms: ["Rough idle", "Hesitation", "Whistling noise", "Misfires"],
    likelyCauses: ["Vacuum or PCV leak", "Low fuel pressure", "Incorrect airflow reading", "Exhaust leak before the oxygen sensor"],
    firstChecks: ["Review short- and long-term fuel trims", "Smoke-test the intake", "Check PCV operation and fuel pressure"],
    warning: "Use trim behavior at idle and under load to separate air leaks from fuel-delivery faults.",
    keywords: ["lean", "fuel trim", "vacuum leak", "PCV"],
  },
  {
    code: "P0234",
    title: "Turbocharger overboost condition",
    system: "Turbocharging",
    severity: "High",
    summary: "Boost pressure exceeded the ECU's permitted target for the operating condition.",
    symptoms: ["Reduced-power mode", "Abrupt power loss", "Boost surge", "Engine warning light"],
    likelyCauses: ["Sticking turbo vanes or wastegate", "Faulty boost-control valve", "Restricted vacuum control", "Incorrect pressure signal"],
    firstChecks: ["Compare requested and actual boost", "Inspect vacuum lines and actuator travel", "Check charge-pressure sensor plausibility"],
    warning: "Do not continue repeated full-load testing until boost control is understood.",
    keywords: ["overboost", "turbo", "wastegate", "boost control"],
  },
  {
    code: "P0299",
    title: "Turbocharger underboost condition",
    system: "Turbocharging",
    severity: "Medium",
    summary: "The engine did not produce the boost pressure requested by the controller.",
    symptoms: ["Low power", "Hissing under load", "Smoke", "Reduced-power mode"],
    likelyCauses: ["Split charge hose or intercooler leak", "Actuator or vacuum fault", "Worn turbocharger", "EGR or exhaust restriction"],
    firstChecks: ["Pressure- or smoke-test the charge system", "Log requested versus actual boost", "Check actuator command and movement"],
    warning: "Confirm leaks and control faults before condemning the turbocharger.",
    keywords: ["underboost", "turbo", "charge hose", "intercooler"],
  },
  {
    code: "P0300",
    title: "Random / multiple-cylinder misfire",
    system: "Combustion",
    severity: "High",
    summary: "Misfires are occurring across more than one cylinder or without one consistent cylinder pattern.",
    symptoms: ["Shaking idle", "Flashing warning light", "Poor acceleration", "Fuel smell"],
    likelyCauses: ["Ignition faults", "Air or fuel imbalance", "Injector problems", "Mechanical compression issue"],
    firstChecks: ["Stop heavy driving if the warning lamp flashes", "Read cylinder-specific counters", "Check plugs, coils, trims, injectors, and compression logically"],
    warning: "Active misfire can overheat and damage the catalytic converter.",
    keywords: ["misfire", "coil", "spark plug", "injector"],
  },
  {
    code: "P0401",
    title: "Exhaust-gas recirculation flow insufficient",
    system: "EGR",
    severity: "Medium",
    summary: "Measured or inferred EGR flow is lower than the controller expects.",
    symptoms: ["Engine warning light", "Reduced power", "Knock or harsh combustion", "Emissions fault"],
    likelyCauses: ["Carbon-blocked EGR passages", "Sticking EGR valve", "Sensor plausibility fault", "Vacuum or actuator problem"],
    firstChecks: ["Command the EGR while monitoring airflow", "Inspect passages and cooler for restriction", "Verify pressure and temperature sensors"],
    warning: "Cleaning only the valve may not fix blocked passages or a failed control system.",
    keywords: ["EGR", "carbon", "emissions", "air flow"],
  },
  {
    code: "P0420",
    title: "Catalyst efficiency below threshold, bank 1",
    system: "Emissions",
    severity: "Medium",
    summary: "Upstream and downstream oxygen-sensor behavior suggests insufficient catalyst oxygen-storage performance.",
    symptoms: ["Engine warning light", "Possible sulfur smell", "Usually little drivability change"],
    likelyCauses: ["Aged or damaged catalyst", "Long-term misfire or mixture fault", "Exhaust leak", "Biased oxygen sensor"],
    firstChecks: ["Repair mixture and misfire faults first", "Check for exhaust leaks", "Review live upstream/downstream sensor behavior"],
    warning: "Replacing the catalyst without correcting the cause can lead to another failure.",
    keywords: ["catalyst", "oxygen sensor", "emissions", "exhaust"],
  },
  {
    code: "P2002",
    title: "Diesel particulate filter efficiency below threshold",
    system: "DPF",
    severity: "High",
    summary: "The ECU calculates that particulate-filter performance is below its required threshold.",
    symptoms: ["DPF warning", "Frequent regeneration", "Reduced power", "Higher fuel use"],
    likelyCauses: ["Ash-loaded or damaged DPF", "Differential-pressure sensor fault", "Exhaust leak", "Underlying soot-production problem"],
    firstChecks: ["Read soot and ash estimates", "Check pressure values with engine off and under load", "Inspect temperature sensors and regeneration history"],
    warning: "Forced regeneration is unsafe when loading, oil level, or temperature-sensor data is not understood.",
    keywords: ["DPF", "diesel", "soot", "regeneration"],
  },
  {
    code: "P2015",
    title: "Intake-manifold runner position range / performance",
    system: "Intake control",
    severity: "Medium",
    summary: "The intake-runner position signal is outside the range expected by the controller.",
    symptoms: ["Warning light", "Flat low-speed response", "Uneven running", "Occasional reduced power"],
    likelyCauses: ["Worn linkage or stop", "Carbon-restricted swirl flaps", "Actuator fault", "Position-sensor fault"],
    firstChecks: ["Inspect linkage movement", "Run actuator output tests", "Check for carbon restriction and wiring faults"],
    warning: "The correct repair depends heavily on the exact engine and manifold design.",
    keywords: ["intake runner", "swirl flap", "manifold", "actuator"],
  },
  {
    code: "P20EE",
    title: "SCR NOx catalyst efficiency below threshold",
    system: "AdBlue / SCR",
    severity: "High",
    summary: "The SCR system is not reducing NOx emissions as effectively as the ECU expects.",
    symptoms: ["AdBlue warning", "Engine light", "Possible restart countdown", "No obvious drivability symptom"],
    likelyCauses: ["Biased NOx sensor", "Incorrect AdBlue dosing", "Poor fluid quality", "Exhaust leak or aged SCR catalyst"],
    firstChecks: ["Read upstream and downstream NOx values", "Verify dosing and fluid quality", "Check temperature data and related faults"],
    warning: "Parts substitution is expensive; diagnose the complete SCR system before replacement.",
    keywords: ["SCR", "AdBlue", "NOx", "diesel emissions"],
  },
  {
    code: "P2201",
    title: "NOx sensor circuit range / performance",
    system: "NOx sensing",
    severity: "High",
    summary: "A NOx sensor signal or its controller behavior is outside the expected operating range.",
    symptoms: ["Engine or AdBlue warning", "Restart countdown on some vehicles", "Emissions-system messages"],
    likelyCauses: ["Failed NOx sensor or control module", "Wiring or connector heat damage", "Exhaust leak", "Incorrect temperature or dosing behavior"],
    firstChecks: ["Identify the exact sensor position", "Inspect wiring near the exhaust", "Compare sensor values after correct warm-up"],
    warning: "Manufacturer-specific subcodes are essential because several NOx sensors may be fitted.",
    keywords: ["NOx sensor", "AdBlue", "SCR", "wiring"],
  },
  {
    code: "P2453",
    title: "DPF differential-pressure sensor range / performance",
    system: "DPF sensing",
    severity: "Medium",
    summary: "The pressure signal used to calculate DPF restriction is implausible or outside range.",
    symptoms: ["DPF warning", "Regeneration problems", "Reduced power", "Incorrect soot estimate"],
    likelyCauses: ["Blocked, split, or reversed pressure hoses", "Failed pressure sensor", "Wiring fault", "Severely restricted filter"],
    firstChecks: ["Check key-on engine-off pressure value", "Inspect both pressure hoses", "Compare pressure at idle and raised speed"],
    warning: "A bad pressure signal can mislead regeneration strategy and soot-load calculations.",
    keywords: ["DPF pressure", "sensor", "hose", "regeneration"],
  },
  {
    code: "P2463",
    title: "Diesel particulate filter soot accumulation",
    system: "DPF",
    severity: "High",
    summary: "Calculated soot loading has reached a level that requires diagnosis before normal operation can continue.",
    symptoms: ["Reduced power", "DPF warning", "Regeneration inhibited", "Cooling fans running"],
    likelyCauses: ["Repeated interrupted regeneration", "Thermostat or sensor fault", "EGR/injector/boost issue increasing soot", "Restricted or ash-loaded DPF"],
    firstChecks: ["Check calculated soot and ash load", "Find why regeneration failed", "Inspect oil level before any regeneration procedure"],
    warning: "Do not force regeneration solely from the code; excessive loading can create a fire or turbo risk.",
    keywords: ["DPF blocked", "soot", "regeneration", "diesel"],
  },
  {
    code: "U0100",
    title: "Lost communication with engine control module",
    system: "Vehicle network",
    severity: "High",
    summary: "One or more modules stopped receiving expected messages from the engine controller.",
    symptoms: ["No start", "Multiple warning lights", "Intermittent shutdown", "Many network codes"],
    likelyCauses: ["Low system voltage", "Power or ground loss at the ECU", "CAN wiring fault", "Module or gateway issue"],
    firstChecks: ["Test battery voltage and charging health", "Check ECU powers and grounds", "Map which modules can and cannot communicate"],
    warning: "A network code does not by itself prove that the engine ECU has failed.",
    keywords: ["CAN bus", "communication", "ECU", "battery"],
  },
];

export function getFaultCode(code: string) {
  return faultCodes.find((item) => item.code.toLowerCase() === code.toLowerCase());
}

export function getLocalizedFaultCodes(locale: Locale) {
  return faultCodes.map((item) => ({
    ...translateValue(locale, item),
    code: item.code,
  }));
}

export function getLocalizedFaultCode(code: string, locale: Locale) {
  const item = getFaultCode(code);
  return item ? { ...translateValue(locale, item), code: item.code } : undefined;
}
