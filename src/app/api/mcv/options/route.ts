import { NextRequest, NextResponse } from "next/server";
import { getMcvOptions } from "@/lib/mcv/client";

export const runtime = "nodejs";
export const maxDuration = 60;

function clean(value: string | null, max = 120) {
  return value?.trim().slice(0, max) || undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  try {
    const result = await getMcvOptions({
      manufacturer: clean(searchParams.get("manufacturer")),
      modelQuery: clean(searchParams.get("modelQuery"), 180),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        manufacturers: [],
        models: [],
        vehicleTypes: [],
        error: "Official MCV options are unavailable right now.",
      },
      { status: 502 }
    );
  }
}

