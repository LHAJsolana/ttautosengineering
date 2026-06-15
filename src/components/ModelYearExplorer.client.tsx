"use client";

import { useMemo, useState } from "react";
import Link from "@/components/LocalizedLink";
import type { ModelYearData } from "@/lib/modelYears";
import type { getToolCopy } from "@/lib/toolCopy";

type Copy = ReturnType<typeof getToolCopy>;

export default function ModelYearExplorer({ years, copy }: { years: ModelYearData[]; copy: Copy }) {
  const models = [...new Set(years.map((item) => item.model))].sort();
  const [model, setModel] = useState("all");
  const [leftSlug, setLeftSlug] = useState(years[0]?.slug ?? "");
  const [rightSlug, setRightSlug] = useState(years[1]?.slug ?? "");
  const filtered = useMemo(
    () => years.filter((item) => model === "all" || item.model === model),
    [model, years]
  );
  const left = years.find((item) => item.slug === leftSlug) ?? years[0];
  const right = years.find((item) => item.slug === rightSlug) ?? years[1] ?? years[0];
  const strongest = [...filtered].sort((a, b) => b.score - a.score)[0];

  return (
    <div>
      <section className="grid gap-4 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-bold text-gray-300">{copy.modelFilter}
          <select value={model} onChange={(event) => setModel(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
            <option value="all">{copy.allModels}</option>{models.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">
          <div className="text-xs text-emerald-200">{copy.strongestYear}</div>
          <div className="mt-1 font-black text-white">{strongest?.year} {strongest?.model} | {strongest?.score}/100</div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-[#111827] p-6">
        <h2 className="text-xl font-black text-white">{copy.timeline}</h2>
        <div className="mt-5 grid gap-4">
          {[...filtered].sort((a, b) => a.year - b.year).map((item) => (
            <Link key={item.slug} href={`/model-years/${item.slug}`} className="grid items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[190px_1fr_70px]">
              <div><div className="font-black text-white">{item.year} {item.model}</div><div className="text-xs text-gray-500">{item.generation}</div></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={item.score >= 76 ? "h-full bg-emerald-500" : item.score >= 70 ? "h-full bg-yellow-500" : "h-full bg-red-500"} style={{ width: `${item.score}%` }} /></div>
              <div className="text-end text-lg font-black text-white">{item.score}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-red-500/20 bg-[linear-gradient(145deg,#111827,#190e18)] p-6">
        <h2 className="text-xl font-black text-white">{copy.compareYears}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[{ value: leftSlug, set: setLeftSlug }, { value: rightSlug, set: setRightSlug }].map((field, index) => (
            <select key={index} value={field.value} onChange={(event) => field.set(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white">
              {years.map((item) => <option key={item.slug} value={item.slug}>{item.year} {item.model}</option>)}
            </select>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[left, right].map((item) => item && (
            <div key={item.slug} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between"><h3 className="font-black text-white">{item.year} {item.model}</h3><strong className="text-2xl text-red-200">{item.score}</strong></div>
              <p className="mt-3 text-sm leading-6 text-gray-400">{item.verdict}</p>
              <Link href={`/model-years/${item.slug}`} className="mt-4 inline-flex text-xs font-bold text-red-300">{copy.viewGuide} <span data-directional-icon className="ms-2">-&gt;</span></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {filtered.map((item) => (
          <Link key={item.slug} href={`/model-years/${item.slug}`} className="group rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-red-500/40">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-red-300">{item.year} | {item.generation}</p><h2 className="mt-2 text-2xl font-black text-white">{item.model}</h2></div>
              <div className="rounded-2xl bg-white/[0.05] px-4 py-3 text-center"><strong className="text-xl text-white">{item.score}</strong><div className="text-[10px] text-gray-500">/100</div></div>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-400">{item.verdict}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
