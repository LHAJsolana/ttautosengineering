export const SITE_URL = "https://ttautosengineering.com";

import type { Metadata } from "next";
import { defaultLocale, locales, localePath, type Locale } from "@/lib/i18n";
import { translateKnown } from "@/lib/translate";

const SITE_NAME = "TT AUTO'S Engineering";
const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  nl: "nl_NL",
  ar: "ar_AR",
};

export function canonical(pathname: string, locale: Locale = defaultLocale) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${localePath(locale, clean)}`;
}

export function localizedAlternates(pathname: string, locale: Locale) {
  return {
    canonical: canonical(pathname, locale),
    languages: {
      ...Object.fromEntries(
        locales.map((item) => [item, canonical(pathname, item)])
      ),
      "x-default": canonical(pathname, "en"),
    },
  };
}

export function localizedPageMetadata({
  locale,
  pathname,
  title,
  description,
  image = "/opengraph-image",
  type = "website",
  noIndex = false,
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const localizedTitle = translateKnown(locale, title);
  const localizedDescription = translateKnown(locale, description);
  const pageUrl = canonical(pathname, locale);
  const socialTitle = `${localizedTitle} - ${SITE_NAME}`;
  const socialImage = new URL(image, SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    title: localizedTitle,
    description: localizedDescription,
    alternates: localizedAlternates(pathname, locale),
    openGraph: {
      type,
      url: pageUrl,
      title: socialTitle,
      description: localizedDescription,
      siteName: SITE_NAME,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
      images: [{ url: socialImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: localizedDescription,
      images: [socialImage],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}
