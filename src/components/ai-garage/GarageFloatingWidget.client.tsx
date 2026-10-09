"use client";

import { useEffect, useState } from "react";
import GarageChat from "@/components/ai-garage/GarageChat.client";
import { localePath, type Locale } from "@/lib/i18n";

export default function GarageFloatingWidget({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

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
        <div className="mb-3 h-[620px] w-[min(420px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#060a12] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <a className="text-sm font-bold text-white hover:text-red-200" href={localePath(locale, "/ai-garage")}>
              Open AI Garage
            </a>
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:text-white" type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <GarageChat locale={locale} compact />
        </div>
      )}
      <button
        className="rounded-full border border-red-300/40 bg-red-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-red-400"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        AI Garage
      </button>
    </div>
  );
}
