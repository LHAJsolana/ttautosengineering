import nl from "@/translations/nl.json";
import ar from "@/translations/ar.json";
import type { Locale } from "@/lib/i18n";

const catalogs: Partial<Record<Locale, Record<string, string>>> = {
  nl: nl as Record<string, string>,
  ar: ar as Record<string, string>,
};

export function translateKnown(locale: Locale, value: string) {
  if (locale === "en") return value;
  return catalogs[locale]?.[value] ?? value;
}

export function translateValue<T>(locale: Locale, value: T): T {
  if (locale === "en") return value;
  if (typeof value === "string") return translateKnown(locale, value) as T;
  if (Array.isArray(value)) {
    return value.map((item) => translateValue(locale, item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        [
          "slug",
          "href",
          "brandHref",
          "heroImage",
          "image",
          "type",
          "kind",
          "risk",
        ].includes(key)
          ? item
          : translateValue(locale, item),
      ])
    ) as T;
  }
  return value;
}
