import type { McvCalculationResult, McvMoneyField } from "@/lib/mcv/types";

const moneyPattern = /(\d[\d\s\u00a0.,]*)\s*(?:DH|DHS|MAD)\b/i;

const fieldAliases: Record<string, string[]> = {
  "Valeur a l'etat neuf": [
    "Valeur a l'etat neuf",
    "Valeur \u00e0 l'\u00e9tat neuf",
    "Valeur \u00c3\u00a0 l'\u00c3\u00a9tat neuf",
  ],
  "Valeur taxable": ["Valeur taxable"],
  "Droits d'importation": ["Droits d'importation"],
  TVA: ["TVA"],
  "Taxe parafiscale": ["Taxe parafiscale"],
  "Droit de timbre proportionnel": ["Droit de timbre proportionnel"],
  "Montant total des droits et des taxes": ["Montant total des droits et des taxes"],
};

export function parseMad(raw: string): number | null {
  const match = raw.match(moneyPattern);
  if (!match) return null;
  const normalized = match[1].replace(/[\s\u00a0.]/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value) : null;
}

function fieldFromText(label: string, text: string): McvMoneyField | null {
  for (const alias of fieldAliases[label] ?? [label]) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = text.match(
      new RegExp(`${escaped}[\\s\\S]{0,240}?(\\d[\\d\\s\\u00a0.,]*\\s*(?:DH|DHS|MAD)\\b)`, "i")
    );
    if (!match) continue;
    const amountMad = parseMad(match[1]);
    if (amountMad === null) continue;
    return { label, amountMad, raw: match[1].trim() };
  }
  return null;
}

export function extractResultFromText(
  text: string,
  vehicle: McvCalculationResult["vehicle"]
): McvCalculationResult {
  const labels = [
    "Valeur a l'etat neuf",
    "Valeur taxable",
    "Droits d'importation",
    "TVA",
    "Taxe parafiscale",
    "Droit de timbre proportionnel",
    "Montant total des droits et des taxes",
  ];
  const fields = labels
    .map((label) => fieldFromText(label, text))
    .filter((field): field is McvMoneyField => field !== null);
  const total = fields.find((field) => /Montant total/i.test(field.label)) ?? null;

  if (!total || total.amountMad <= 0) {
    throw new Error("Could not extract a valid MCV total amount.");
  }

  const consultationLabel = text.match(/Consultation du[^\n]+/)?.[0]?.trim();

  return {
    status: "success",
    sourceUrl: "https://www.douane.gov.ma/mcv/#/view?pageId=2",
    calculatedAt: new Date().toISOString(),
    consultationLabel,
    vehicle,
    fields,
    total,
    warnings: [
      "Official MCV simulations are indicative and may differ from the final customs administration assessment.",
    ],
  };
}
