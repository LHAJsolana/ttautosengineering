import { NextRequest } from "next/server";
import { createOpenGraphImage } from "@/lib/opengraph-image";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return createOpenGraphImage({
    title: searchParams.get("title") ?? undefined,
    subtitle: searchParams.get("subtitle") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
  });
}
