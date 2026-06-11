"use client";

import { useMemo, useState } from "react";
import type { getToolCopy } from "@/lib/toolCopy";

type Copy = ReturnType<typeof getToolCopy>;
type CostModel = { slug: string; name: string; score: number };

const format = new Intl.NumberFormat("en", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function OwnershipCostCalculator({ models, copy }: { models: CostModel[]; copy: Copy }) {
  const [slug, setSlug] = useState(models[0]?.slug ?? "");
  const [age, setAge] = useState(8);
  const [distance, setDistance] = useState(15000);
  const [history, setHistory] = useState("partial");
  const [usage, setUsage] = useState("mixed");
  const model = models.find((item) => item.slug === slug) ?? models[0];

  const estimate = useMemo(() => {
    const scoreRisk = (100 - (model?.score ?? 70)) / 30;
    const ageFactor = 1 + Math.max(0, age - 4) * 0.055;
    const distanceFactor = 0.72 + distance / 30000;
    const historyFactor = history === "good" ? 0.88 : history === "poor" ? 1.38 : 1.08;
    const usageFactor = usage === "city" ? 1.14 : usage === "highway" ? 0.92 : 1;
    const routine = 430 * ageFactor * Math.min(1.35, distanceFactor);
    const wear = 390 * distanceFactor * usageFactor;
    const reserve = 520 * (0.72 + scoreRisk) * ageFactor * historyFactor;
    const total = routine + wear + reserve;
    return {
      routine: Math.round(routine / 25) * 25,
      wear: Math.round(wear / 25) * 25,
      reserve: Math.round(reserve / 25) * 25,
      low: Math.round(total * 0.82 / 50) * 50,
      high: Math.round(total * 1.28 / 50) * 50,
    };
  }, [age, distance, history, model?.score, usage]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.model}
            <select value={slug} onChange={(event) => setSlug(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white outline-none focus:border-red-500">
              {models.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>
          <label className="grid gap-3 text-sm font-semibold text-gray-300">
            <span className="flex justify-between"><span>{copy.vehicleAge}</span><strong className="text-white">{age}</strong></span>
            <input type="range" min="2" max="20" value={age} onChange={(event) => setAge(Number(event.target.value))} className="accent-red-500" />
          </label>
          <label className="grid gap-3 text-sm font-semibold text-gray-300">
            <span className="flex justify-between"><span>{copy.annualDistance}</span><strong className="text-white">{distance.toLocaleString()} km</strong></span>
            <input type="range" min="5000" max="40000" step="1000" value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="accent-red-500" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.history}
            <select value={history} onChange={(event) => setHistory(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="good">{copy.good}</option><option value="partial">{copy.partial}</option><option value="poor">{copy.poor}</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-gray-300">{copy.usage}
            <select value={usage} onChange={(event) => setUsage(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              <option value="mixed">{copy.mixed}</option><option value="city">{copy.city}</option><option value="highway">{copy.highway}</option>
            </select>
          </label>
        </div>
      </section>
      <aside className="rounded-3xl border border-red-500/20 bg-[linear-gradient(145deg,#111c32,#180d18)] p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-300">{copy.annualEstimate}</p>
        <div className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{format.format(estimate.low)}–{format.format(estimate.high)}</div>
        <p className="mt-2 text-sm text-gray-400">{format.format(estimate.low / 12)}–{format.format(estimate.high / 12)} {copy.monthly}</p>
        <div className="mt-8 grid gap-4">
          {[
            [copy.routine, estimate.routine, "bg-emerald-500"],
            [copy.wear, estimate.wear, "bg-yellow-500"],
            [copy.reserve, estimate.reserve, "bg-red-500"],
          ].map(([label, value, color]) => {
            const amount = Number(value);
            return <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-4 text-sm"><span className="font-semibold text-gray-300">{label}</span><strong className="text-white">{format.format(amount)}</strong></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${color}`} style={{ width: `${Math.min(100, amount / 16)}%` }} /></div>
            </div>;
          })}
        </div>
        <p className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-gray-400">{copy.estimateNote}</p>
      </aside>
    </div>
  );
}
