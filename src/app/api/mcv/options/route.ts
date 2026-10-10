import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function clean(value: string | null, max = 120) {
  return value?.trim().slice(0, max) || undefined;
}

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

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        manufacturers: [],
        models: [],
        vehicleTypes: [],
        error: "Too many MCV option requests. Please wait before trying again.",
      },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "600" } }
    );
  }

  const { searchParams } = request.nextUrl;
  try {
    const { getMcvOptions } = await import("@/lib/mcv/client");
    const result = await getMcvOptions({
      manufacturer: clean(searchParams.get("manufacturer")),
      modelQuery: clean(searchParams.get("modelQuery"), 180),
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      {
        manufacturers: [],
        models: [],
        vehicleTypes: [],
        error: "Official MCV options are unavailable right now. No customs amount was generated.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}

