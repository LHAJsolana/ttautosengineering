"use client";

import { useMemo, useState } from "react";
import Link from "@/components/LocalizedLink";
import type { getToolCopy } from "@/lib/toolCopy";

export type ComparisonItem = {
  id: string;
  name: string;
  type: string;
  score: number;
  risk: string;
  summary: string;
  bestFor: string;
  problems: string[];
  checks: string[];
  href: string;
};

type Copy = ReturnType<typeof getToolCopy>;

function scoreColor(score: number) {
  if (score >= 76) return "bg-emerald-500";
  if (score >= 66) return "bg-yellow-500";
  return "bg-red-500";
}

function ComparisonCard({ item, copy }: { item: ComparisonItem; copy: Copy }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#111827] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-300">{item.type}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{item.name}</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center">
          <div className="text-2xl font-black text-white">{item.score}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">/ 100</div>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${scoreColor(item.score)}`} style={{ width: `${item.score}%` }} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="text-xs uppercase tracking-wider text-gray-500">{copy.score}</div>
          <div className="mt-1 font-bold text-white">{item.score}/100</div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="text-xs uppercase tracking-wider text-gray-500">{copy.risk}</div>
          <div className="mt-1 font-bold text-white">{item.risk}</div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-gray-300">{item.summary}</p>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.bestFor}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">{item.bestFor}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.keyRisks}</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          {item.problems.slice(0, 4).map((problem) => <li key={problem} className="flex gap-2"><span className="text-red-400">•</span><span>{problem}</span></li>)}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.inspectFirst}</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          {item.checks.slice(0, 3).map((check) => <li key={check} className="flex gap-2"><span className="text-emerald-400">✓</span><span>{check}</span></li>)}
        </ul>
      </div>
      <Link href={item.href} className="mt-7 inline-flex rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white transition hover:border-red-500/50 hover:bg-red-500/10">
        {copy.viewGuide} <span data-directional-icon className="ms-2">-&gt;</span>
      </Link>
    </article>
  );
}

export default function VehicleComparisonTool({ items, copy }: { items: ComparisonItem[]; copy: Copy }) {
  const [leftId, setLeftId] = useState(items[0]?.id ?? "");
  const [rightId, setRightId] = useState(items[1]?.id ?? "");
  const left = useMemo(() => items.find((item) => item.id === leftId) ?? items[0], [items, leftId]);
  const right = useMemo(() => items.find((item) => item.id === rightId) ?? items[1] ?? items[0], [items, rightId]);

  return (
    <div>
      <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-2 md:p-6">
        {[
          { label: copy.firstVehicle, value: leftId, setValue: setLeftId },
          { label: copy.secondVehicle, value: rightId, setValue: setRightId },
        ].map((field) => (
          <label key={field.label} className="grid gap-2 text-sm font-semibold text-gray-300">
            {field.label}
            <select value={field.value} onChange={(event) => field.setValue(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white outline-none focus:border-red-500">
              {items.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.type}</option>)}
            </select>
          </label>
        ))}
      </div>
      {left && right ? <div className="mt-6 grid gap-6 lg:grid-cols-2"><ComparisonCard item={left} copy={copy} /><ComparisonCard item={right} copy={copy} /></div> : null}
    </div>
  );
}
