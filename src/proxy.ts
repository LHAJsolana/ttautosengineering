import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;
const SITE_URL = "https://ttautosengineering.com";

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("tt-locale")?.value;
  if (isLocale(saved)) return saved;

  const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (accepted.includes("nl")) return "nl";
  if (accepted.includes("ar")) return "ar";
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/site.webmanifest" ||
    pathname === "/opengraph-image" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const localeSegment = segments[1];

  if (isLocale(localeSegment)) {
    const response = NextResponse.next();
    const localizedPath = `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
    const links = [
      `<${SITE_URL}${pathname}>; rel="canonical"`,
      ...(["en", "nl", "ar"] as Locale[]).map(
        (locale) =>
          `<${SITE_URL}/${locale}${localizedPath === "/" ? "" : localizedPath}>; rel="alternate"; hreflang="${locale}"`
      ),
      `<${SITE_URL}/en${localizedPath === "/" ? "" : localizedPath}>; rel="alternate"; hreflang="x-default"`,
    ];
    response.headers.set("Link", links.join(", "));
    response.cookies.set("tt-locale", localeSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
