"use client";

import { useEffect, useState } from "react";
import GarageChat from "@/components/ai-garage/GarageChat.client";
import { localePath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    open: "Open AI Garage",
    close: "Close",
    label: "AI Garage",
    badge: "Coming Soon",
    title: "Your car. A new intelligence.",
    body: "Voice guidance, fault-code help, photo understanding, comparisons, and Morocco import assistance are being prepared.",
    cta: "Discover what's coming",
  },
  fr: {
    open: "Ouvrir AI Garage",
    close: "Fermer",
    label: "AI Garage",
    badge: "Bientot",
    title: "Votre voiture. Une nouvelle intelligence.",
    body: "Aide vocale, codes defaut, analyse photo, comparaisons et assistance import Maroc sont en preparation.",
    cta: "Decouvrir",
  },
  nl: {
    open: "Open AI Garage",
    close: "Sluiten",
    label: "AI Garage",
    badge: "Binnenkort",
    title: "Jouw auto. Nieuwe intelligentie.",
    body: "Voice guidance, storingscodehulp, foto-inzicht, vergelijkingen en Marokko-importhulp zijn in voorbereiding.",
    cta: "Ontdek meer",
  },
  ar: {
    open: "افتح AI Garage",
    close: "إغلاق",
    label: "AI Garage",
    badge: "قريبا",
    title: "سيارتك. ذكاء جديد.",
    body: "إرشاد صوتي، مساعدة أكواد الأعطال، فهم الصور، المقارنات ومساعدة استيراد المغرب قيد التحضير.",
    cta: "اكتشف القادم",
  },
} as const;

export default function GarageFloatingWidget({
  locale,
  publicEnabled,
}: {
  locale: Locale;
  publicEnabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="fixed bottom-5 end-5 z-50">
      {open && (
        <div className="mb-3 max-h-[min(620px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#060a12] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <a className="text-sm font-bold text-white hover:text-red-200" href={localePath(locale, "/ai-garage")}>
              {t.open}
            </a>
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:text-white" type="button" onClick={() => setOpen(false)}>
              {t.close}
            </button>
          </div>
          {publicEnabled ? (
            <div className="h-[560px]">
              <GarageChat locale={locale} compact />
            </div>
          ) : (
            <div className="p-5">
              <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-red-100">
                {t.badge}
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight text-white">{t.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">{t.body}</p>
              <div className="mt-5 flex h-14 items-center gap-1.5" aria-hidden="true">
                {[18, 32, 44, 26, 52, 36, 22, 46, 30].map((height, index) => (
                  <span key={`${height}-${index}`} className="w-1.5 rounded-full bg-red-400/70" style={{ height }} />
                ))}
              </div>
              <a
                href={localePath(locale, "/ai-garage")}
                className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-500"
              >
                {t.cta}
              </a>
            </div>
          )}
        </div>
      )}
      <button
        className="rounded-full border border-red-300/40 bg-red-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-red-400"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {t.label}
      </button>
    </div>
  );
}
