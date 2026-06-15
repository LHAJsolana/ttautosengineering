"use client";

import { useMemo, useState } from "react";
import type { getToolCopy } from "@/lib/toolCopy";

type Copy = ReturnType<typeof getToolCopy>;
type CostModel = { slug: string; name: string; score: number };
type Currency = "EUR" | "GBP" | "USD" | "MAD";

const currencyRates: Record<Currency, number> = { EUR: 1, GBP: 0.86, USD: 1.08, MAD: 10.75 };
const regionFactors = { independent: 0.82, mixed: 1, dealer: 1.35 };

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "MAD" ? "fr-MA" : "en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value * currencyRates[currency]);
}

export default function OwnershipCostCalculator({ models, copy }: { models: CostModel[]; copy: Copy }) {
  const [slug, setSlug] = useState(models[0]?.slug ?? "");
  const [age, setAge] = useState(8);
  const [distance, setDistance] = useState(15000);
  const [history, setHistory] = useState("partial");
  const [usage, setUsage] = useState("mixed");
  const [fuel, setFuel] = useState("petrol");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [region, setRegion] = useState<keyof typeof regionFactors>("mixed");
  const model = models.find((item) => item.slug === slug) ?? models[0];

  const estimate = useMemo(() => {
    const scoreRisk = (100 - (model?.score ?? 70)) / 30;
    const ageFactor = 1 + Math.max(0, age - 4) * 0.055;
    const distanceFactor = 0.72 + distance / 30000;
    const historyFactor = history === "good" ? 0.88 : history === "poor" ? 1.38 : 1.08;
    const usageFactor = usage === "city" ? 1.14 : usage === "highway" ? 0.92 : 1;
    const fuelFactor = fuel === "diesel" ? (usage === "city" ? 1.22 : 1.04) : fuel === "hybrid" ? 1.08 : 1;
    const labor = regionFactors[region];
    const routine = 430 * ageFactor * Math.min(1.35, distanceFactor) * labor;
    const wear = 390 * distanceFactor * usageFactor * labor;
    const reserve = 520 * (0.72 + scoreRisk) * ageFactor * historyFactor * fuelFactor * labor;
    const expected = routine + wear + reserve;
    return {
      routine: Math.round(routine / 25) * 25,
      wear: Math.round(wear / 25) * 25,
      reserve: Math.round(reserve / 25) * 25,
      best: Math.round(expected * 0.72 / 50) * 50,
      expected: Math.round(expected / 50) * 50,
      worst: Math.round(expected * 1.48 / 50) * 50,
    };
  }, [age, distance, fuel, history, model?.score, region, usage]);

  const reasons = [
    age > 10 ? `${age} ${copy.vehicleAge.toLowerCase()}` : null,
    distance > 22000 ? `${distance.toLocaleString()} km ${copy.annualDistance.toLowerCase()}` : null,
    history === "poor" ? copy.poor : history === "good" ? copy.good : copy.partial,
    usage === "city" && fuel === "diesel" ? `${copy.city} + ${copy.diesel}` : copy[usage as "mixed" | "city" | "highway"],
  ].filter(Boolean);

  const scenarios = [
    [copy.bestCase, estimate.best, "bg-emerald-500"],
    [copy.expected, estimate.expected, "bg-yellow-500"],
    [copy.worstCase, estimate.worst, "bg-red-500"],
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-gray-300 sm:col-span-2">{copy.model}
            <select value={slug} onChange={(event) => setSlug(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white outline-none focus:border-red-500">
              {models.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.currency}
            <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              {(["EUR", "GBP", "USD", "MAD"] as Currency[]).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.region}
            <select value={region} onChange={(event) => setRegion(event.target.value as keyof typeof regionFactors)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="independent">{copy.independentSpecialist}</option>
              <option value="mixed">{copy.mixedWorkshop}</option>
              <option value="dealer">{copy.mainDealer}</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.fuelType}
            <select value={fuel} onChange={(event) => setFuel(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="petrol">{copy.petrol}</option><option value="diesel">{copy.diesel}</option><option value="hybrid">{copy.hybrid}</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.history}
            <select value={history} onChange={(event) => setHistory(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="good">{copy.good}</option><option value="partial">{copy.partial}</option><option value="poor">{copy.poor}</option>
            </select>
          </label>
          <label className="grid gap-3 text-sm font-semibold text-gray-300 sm:col-span-2">
            <span className="flex justify-between"><span>{copy.vehicleAge}</span><strong className="text-white">{age}</strong></span>
            <input type="range" min="2" max="20" value={age} onChange={(event) => setAge(Number(event.target.value))} className="accent-red-500" />
          </label>
          <label className="grid gap-3 text-sm font-semibold text-gray-300 sm:col-span-2">
            <span className="flex justify-between"><span>{copy.annualDistance}</span><strong className="text-white">{distance.toLocaleString()} km</strong></span>
            <input type="range" min="5000" max="40000" step="1000" value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="accent-red-500" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300 sm:col-span-2">{copy.usage}
            <select value={usage} onChange={(event) => setUsage(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="mixed">{copy.mixed}</option><option value="city">{copy.city}</option><option value="highway">{copy.highway}</option>
            </select>
          </label>
        </div>
      </section>

      <aside className="rounded-3xl border border-red-500/20 bg-[linear-gradient(145deg,#111c32,#180d18)] p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-300">{copy.annualEstimate}</p>
        <div className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{money(estimate.expected, currency)}</div>
        <p className="mt-2 text-sm text-gray-400">{money(estimate.expected / 12, currency)} {copy.monthly}</p>

        <div className="mt-8 grid gap-4">
          {scenarios.map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-4 text-sm"><span className="font-semibold text-gray-300">{label}</span><strong className="text-white">{money(value, currency)}</strong></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${color}`} style={{ width: `${Math.min(100, (value / estimate.worst) * 100)}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[[copy.routine, estimate.routine], [copy.wear, estimate.wear], [copy.reserve, estimate.reserve]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="mt-1 text-sm font-bold text-white">{money(Number(value), currency)}</div>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between"><h3 className="font-bold text-white">{copy.fiveYear}</h3><strong className="text-red-200">{money(estimate.expected * 5.32, currency)}</strong></div>
          <div className="mt-4 flex h-20 items-end gap-2">
            {[1, 1.04, 1.09, 1.14, 1.2].map((factor, index) => (
              <div key={factor} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-gradient-to-t from-red-700 to-red-400" style={{ height: `${38 + index * 9}px` }} />
                <span className="text-[10px] text-gray-500">Y{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-bold text-white">{copy.whyEstimate}</h3>
          <div className="mt-3 flex flex-wrap gap-2">{reasons.map((reason) => <span key={reason} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300">{reason}</span>)}</div>
        </section>
        <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-gray-400">{copy.estimateNote}</p>
      </aside>
    </div>
  );
}
