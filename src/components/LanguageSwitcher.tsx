"use client";

import { usePathname, useRouter } from "next/navigation";
import { isLocale, locales, stripLocale, type Locale } from "@/lib/i18n";

const languageNames: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
  ar: "AR",
};

export default function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: string) {
    if (!isLocale(nextLocale)) return;
    const path = stripLocale(pathname);
    router.push(`/${nextLocale}${path === "/" ? "" : path}${window.location.search}`);
  }

  return (
    <label className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-gray-300">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={locale}
        onChange={(event) => changeLocale(event.target.value)}
        className="cursor-pointer bg-transparent text-xs font-semibold text-white outline-none"
      >
        {locales.map((item) => (
          <option key={item} value={item} className="bg-[#0B1220] text-white">
            {languageNames[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
