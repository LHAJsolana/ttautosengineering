import { NextRequest, NextResponse } from "next/server";
import { calculateMcv } from "@/lib/mcv/client";
import type { McvCalculationRequest } from "@/lib/mcv/types";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_BODY_BYTES = 8_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 6;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function clean(value: unknown, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "Request body is too large." },
      { status: 413 }
    );
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        status: "error",
        code: "CONCURRENCY_LIMIT",
        message: "Too many MCV requests. Please wait before trying again.",
      },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = await calculateMcv({
    manufacturer: clean(payload.manufacturer),
    model: clean(payload.model, 180),
    vehicleType: clean(payload.vehicleType, 120),
    firstRegistrationDate: clean(payload.firstRegistrationDate, 20),
    beneficiaryType: clean(payload.beneficiaryType, 10) as McvCalculationRequest["beneficiaryType"],
  });

  const status =
    result.status === "success"
      ? 200
      : result.code === "VALIDATION_ERROR"
        ? 400
        : result.code === "AMBIGUOUS_MODEL" || result.code === "AMBIGUOUS_TYPE" || result.code === "VEHICLE_NOT_FOUND"
          ? 409
          : result.code === "CONCURRENCY_LIMIT"
            ? 429
            : 502;
  return NextResponse.json(result, { status });
}

