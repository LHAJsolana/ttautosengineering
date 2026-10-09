import { faultCodes } from "@/lib/faultCodes";
import { localePath, type Locale } from "@/lib/i18n";
import { searchSite, type SearchResult } from "@/lib/search";
import type { GarageAction, GarageCitation, GarageVehicleContext } from "@/lib/ai/types";

export type GarageRetrievalResult = {
  context: string;
  citations: GarageCitation[];
  actions: GarageAction[];
  safetyNotice?: string;
};

function uniqueByHref(items: GarageCitation[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function tokens(value: string) {
  return normalize(value).split(" ").filter((token) => token.length >= 2);
}

function garageRank(item: SearchResult, query: string) {
  const queryTokens = tokens(query);
  const haystack = normalize(
    [
      item.title,
      item.description,
      item.type,
      item.brand,
      item.category,
      item.platform,
      ...item.keywords,
    ]
      .filter(Boolean)
      .join(" ")
  );

  let score = item.score;
  for (const token of queryTokens) {
    if (/^p[0-9a-f]{4}$/i.test(token) && haystack.includes(token)) score += 80;
    if (/^(om651|om654|n47|b47|b48|ea888|dq250|zf|8hp|9g|dsg)$/i.test(token) && haystack.includes(token)) {
      score += 45;
    }
    if (/^(bmw|mercedes|benz|audi|volkswagen|vw)$/i.test(token) && haystack.includes(token)) score += 24;
    if (haystack.includes(token)) score += 2;
  }

  const strongTokens = queryTokens.filter((token) =>
    /^(bmw|mercedes|benz|audi|volkswagen|vw|om651|om654|n47|b47|b48|ea888|dq250|zf|8hp|9g|dsg|p[0-9a-f]{4})$/i.test(token)
  );
  const missingStrong = strongTokens.filter((token) => !haystack.includes(token));
  score -= missingStrong.length * 18;
  return score;
}

function hasCustomsIntent(query: string) {
  return /\b(morocco|maroc|douane|customs|import dut|mcv|dedouanement|dédouanement)\b/i.test(query);
}

function detectSafetyNotice(query: string) {
  if (/\b(brake|brakes|steering|fire|smoke|overheat|overheating|oil pressure|no oil|燃|frein|direction|surchauffe)\b/i.test(query)) {
    return "Safety note: if the car has braking, steering, fire, heavy smoke, overheating, or oil-pressure symptoms, stop driving and arrange professional inspection before continuing diagnostics.";
  }
  return undefined;
}

function vehicleLine(vehicle?: GarageVehicleContext) {
  if (!vehicle) return "";
  const parts = [vehicle.year, vehicle.brand, vehicle.model, vehicle.engine, vehicle.mileage, vehicle.market]
    .map((item) => item?.trim())
    .filter(Boolean);
  return parts.length ? `Vehicle context: ${parts.join(" | ")}` : "";
}

export function retrieveGarageContext(query: string, locale: Locale, vehicle?: GarageVehicleContext): GarageRetrievalResult {
  const searchQuery = [query, vehicleLine(vehicle)].filter(Boolean).join(" ");
  const siteResults = searchSite(searchQuery, undefined, locale)
    .map((item) => ({ item, garageScore: garageRank(item, searchQuery) }))
    .filter(({ garageScore }) => garageScore > 0)
    .sort((a, b) => b.garageScore - a.garageScore || b.item.score - a.item.score)
    .map(({ item }) => item)
    .slice(0, 7);
  const normalizedQuery = normalize(searchQuery);
  const exactFaults = faultCodes
    .filter((fault) => normalizedQuery.includes(fault.code.toLowerCase()))
    .slice(0, 3);

  const citations = uniqueByHref([
    ...exactFaults.map((fault) => ({
      title: `${fault.code}: ${fault.title}`,
      href: localePath(locale, `/fault-codes/${fault.code.toLowerCase()}`),
      type: "Fault Code",
    })),
    ...siteResults.map((result) => ({
      title: result.title,
      href: localePath(locale, result.href),
      type: result.type,
    })),
  ]).slice(0, 6);

  const actions: GarageAction[] = [];
  if (hasCustomsIntent(query)) {
    actions.push({
      label: "Open live Morocco customs calculator",
      href: localePath(locale, "/morocco-customs"),
    });
  }
  if (/\b(compare|versus|vs\.?|better buy|which should i buy)\b/i.test(query)) {
    actions.push({ label: "Open comparison tool", href: localePath(locale, "/compare") });
  }
  if (/\b(vin|history|accident|mileage rollback|stolen|finance)\b/i.test(query)) {
    actions.push({ label: "Check vehicle history", href: localePath(locale, "/vehicle-history") });
  }

  const contextBlocks = [
    vehicleLine(vehicle),
    ...exactFaults.map(
      (fault) =>
        `Fault ${fault.code}: ${fault.title}. Summary: ${fault.summary}. Likely causes: ${fault.likelyCauses.join(", ")}. Symptoms: ${fault.symptoms.join(", ")}.`
    ),
    ...siteResults.map(
      (result, index) =>
        `Source ${index + 1}: ${result.title} (${result.type}) at ${localePath(locale, result.href)}. ${result.description}`
    ),
  ].filter(Boolean);

  return {
    context: contextBlocks.join("\n"),
    citations,
    actions,
    safetyNotice: detectSafetyNotice(query),
  };
}
