import { calculateMcv } from "@/lib/mcv/client";
import type { GarageChatRequest } from "@/lib/ai/types";
import type { McvApiResult, McvBeneficiaryType, McvCalculationRequest } from "@/lib/mcv/types";

const beneficiaryTypes = ["AUTRE", "MRE", "MRED", "PBS"] as const;

export type GarageMcvToolResult =
  | McvApiResult
  | { status: "missing_fields"; message: string; missingFields: string[] };

function textFromRequest(request: GarageChatRequest) {
  return [
    ...(request.messages ?? []).map((message) => message.content),
    request.vehicle?.brand,
    request.vehicle?.model,
    request.vehicle?.year,
    request.vehicle?.engine,
    request.vehicle?.market,
  ]
    .filter(Boolean)
    .join("\n");
}

export function hasMcvIntent(request: GarageChatRequest) {
  return /\b(morocco|maroc|douane|customs|import dut|mcv|dedouanement|dédouanement)\b/i.test(textFromRequest(request));
}

function clean(value: unknown, max = 180) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function extract(patterns: RegExp[], text: string) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }
  return "";
}

export function buildMcvRequest(request: GarageChatRequest): McvCalculationRequest | GarageMcvToolResult {
  const text = textFromRequest(request);
  const toolInput = request.tools?.mcv ?? {};
  const vehicle = request.vehicle ?? {};

  const manufacturer =
    clean(toolInput.manufacturer) ||
    clean(vehicle.brand) ||
    extract([/\bmanufacturer\s*[:=-]\s*([^\n,;]+)/i, /\bbrand\s*[:=-]\s*([^\n,;]+)/i, /\b(mercedes|bmw|audi|volkswagen|vw)\b/i], text);
  const model =
    clean(toolInput.model) ||
    clean(vehicle.model) ||
    extract([/\bofficial model\s*[:=-]\s*([^\n;]+)/i, /\bmodel\s*[:=-]\s*([^\n;]+)/i, /\bmodel\s+([^\n,;]+)/i], text);
  const vehicleType =
    clean(toolInput.vehicleType, 80) ||
    extract([
      /\bvehicle type\s*[:=-]\s*([A-Z0-9 -]{2,20})/i,
      /\bvehicle type\s+([A-Z0-9 -]{2,20})/i,
      /\btype\s*[:=-]\s*([A-Z0-9 -]{2,20})/i,
    ], text);
  const firstRegistrationDate =
    clean(toolInput.firstRegistrationDate, 20) ||
    extract([/\bfirst registration(?: date)?\s*[:=-]\s*(\d{2}\/\d{2}\/\d{4})/i, /\b(\d{2}\/\d{2}\/\d{4})\b/], text);
  const beneficiaryCandidate =
    clean(toolInput.beneficiaryType, 10).toUpperCase() ||
    extract([/\bbeneficiary(?: type)?\s*[:=-]\s*(AUTRE|MRE|MRED|PBS)\b/i, /\b(AUTRE|MRE|MRED|PBS)\b/i], text).toUpperCase();
  const beneficiaryType = beneficiaryTypes.includes(beneficiaryCandidate as McvBeneficiaryType)
    ? (beneficiaryCandidate as McvBeneficiaryType)
    : undefined;

  const missingFields = [
    !manufacturer && "manufacturer",
    !model && "official model",
    !vehicleType && "official vehicle type/code",
    !firstRegistrationDate && "first registration date in DD/MM/YYYY",
    !beneficiaryType && "beneficiary type: AUTRE, MRE, MRED, or PBS",
  ].filter((field): field is string => Boolean(field));

  if (missingFields.length) {
    return {
      status: "missing_fields",
      missingFields,
      message:
        "I can run the official MCV simulation only after you provide every required official field. Missing: " +
        missingFields.join(", "),
    };
  }

  if (!beneficiaryType) {
    return {
      status: "missing_fields",
      missingFields: ["beneficiary type: AUTRE, MRE, MRED, or PBS"],
      message: "I can run the official MCV simulation only after you provide a valid beneficiary type.",
    };
  }

  return {
    manufacturer,
    model,
    vehicleType,
    firstRegistrationDate,
    beneficiaryType,
  };
}

export async function runMcvTool(request: GarageChatRequest): Promise<GarageMcvToolResult | undefined> {
  if (!hasMcvIntent(request)) return undefined;
  const mcvRequest = buildMcvRequest(request);
  if ("status" in mcvRequest) return mcvRequest;
  return calculateMcv(mcvRequest);
}
