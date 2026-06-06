export const SITE_URL = "https://ttautosengineering.com";

import { defaultLocale, locales, localePath, type Locale } from "@/lib/i18n";

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
