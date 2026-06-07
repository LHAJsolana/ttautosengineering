"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isLocale, locales, stripLocale, type Locale } from "@/lib/i18n";

const languageNames: Record<
  Locale,
  { short: string; native: string; description: string }
> = {
  en: { short: "EN", native: "English", description: "International" },
  nl: { short: "NL", native: "Nederlands", description: "Nederlandse versie" },
  ar: { short: "AR", native: "العربية", description: "النسخة العربية" },
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function changeLocale(nextLocale: string) {
    if (!isLocale(nextLocale)) return;
    const path = stripLocale(pathname);
    setOpen(false);
    router.push(`/${nextLocale}${path === "/" ? "" : path}${window.location.search}`);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:border-white/20 hover:bg-white/10"
      >
        <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-red-500/15 px-1.5 text-[11px] font-extrabold tracking-wider text-red-200">
          {languageNames[locale].short}
        </span>
        <span className="hidden sm:inline">{languageNames[locale].native}</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>

      {open ? (
        <div className="absolute end-0 top-[calc(100%+0.65rem)] z-[70] w-72 overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/98 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="px-3 pb-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              {label}
            </p>
            <p className="mt-1 text-xs text-gray-500">EN / NL / AR</p>
          </div>
          <div className="grid gap-1">
            {locales.map((item) => {
              const active = item === locale;
              const language = languageNames[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeLocale(item)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition",
                    active
                      ? "bg-red-500/12 text-white"
                      : "text-gray-300 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-10 items-center justify-center rounded-xl text-xs font-extrabold tracking-wider",
                      active ? "bg-red-600 text-white" : "bg-white/[0.06] text-gray-300",
                    ].join(" ")}
                  >
                    {language.short}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{language.native}</span>
                    <span className="mt-0.5 block text-xs text-gray-500">
                      {language.description}
                    </span>
                  </span>
                  {active ? (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-red-300">
                      <path
                        d="m4 10.5 3.5 3.5L16 5.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
