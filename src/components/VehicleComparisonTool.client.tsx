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
  metrics: {
    reliability: number;
    ownershipValue: number;
    usability: number;
    inspectionConfidence: number;
  };
};

type Copy = ReturnType<typeof getToolCopy>;

function scoreColor(score: number) {
  if (score >= 76) return "bg-emerald-500";
  if (score >= 66) return "bg-yellow-500";
  return "bg-red-500";
}

function ComparisonCard({ item, copy }: { item: ComparisonItem; copy: Copy }) {
  const metrics = [
    [copy.reliability, item.metrics.reliability],
    [copy.ownershipValue, item.metrics.ownershipValue],
    [copy.usability, item.metrics.usability],
    [copy.inspectionConfidence, item.metrics.inspectionConfidence],
  ] as const;

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

      <div className="mt-5 grid gap-3">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1.5 flex justify-between text-xs text-gray-400">
              <span>{label}</span><strong className="text-gray-200">{value}</strong>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full ${scoreColor(value)}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm leading-7 text-gray-300">{item.summary}</p>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.bestFor}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-400">{item.bestFor}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.keyRisks}</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          {item.problems.slice(0, 3).map((problem) => (
            <li key={problem} className="flex gap-2"><span className="text-red-400">-</span><span>{problem}</span></li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-white">{copy.inspectFirst}</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          {item.checks.slice(0, 2).map((check) => (
            <li key={check} className="flex gap-2"><span className="text-emerald-400">+</span><span>{check}</span></li>
          ))}
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
  const [thirdId, setThirdId] = useState(items[2]?.id ?? "");
  const selected = useMemo(
    () => [leftId, rightId, thirdId].map((id) => items.find((item) => item.id === id)).filter(Boolean) as ComparisonItem[],
    [items, leftId, rightId, thirdId]
  );
  const categories = [
    { key: "reliability" as const, label: copy.reliability },
    { key: "ownershipValue" as const, label: copy.ownershipValue },
    { key: "usability" as const, label: copy.usability },
    { key: "inspectionConfidence" as const, label: copy.inspectionConfidence },
  ];
  const winners = categories.map((category) => ({
    label: category.label,
    item: [...selected].sort((a, b) => b.metrics[category.key] - a.metrics[category.key])[0],
  }));
  const overall = [...selected].sort((a, b) => {
    const average = (item: ComparisonItem) =>
      Object.values(item.metrics).reduce((sum, value) => sum + value, 0) / 4;
    return average(b) - average(a);
  })[0];
  const sharedRisks = useMemo(() => {
    const usefulWords = selected.map((item) =>
      new Set(item.problems.join(" ").toLowerCase().match(/[a-z]{5,}/g) ?? [])
    );
    return [...(usefulWords[0] ?? [])]
      .filter((word) => usefulWords.slice(1).every((set) => set.has(word)))
      .slice(0, 6);
  }, [selected]);

  const fields = [
    { label: copy.firstVehicle, value: leftId, setValue: setLeftId },
    { label: copy.secondVehicle, value: rightId, setValue: setRightId },
    { label: copy.thirdVehicle, value: thirdId, setValue: setThirdId },
  ];

  return (
    <div>
      <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-3 md:p-6">
        {fields.map((field) => (
          <label key={field.label} className="grid gap-2 text-sm font-semibold text-gray-300">
            {field.label}
            <select value={field.value} onChange={(event) => field.setValue(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3.5 text-white outline-none focus:border-red-500">
              {items.map((item) => <option key={item.id} value={item.id}>{item.name} | {item.type}</option>)}
            </select>
          </label>
        ))}
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-red-300">{copy.categoryWinners}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {winners.map(({ label, item }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="mt-1 font-bold text-white">{item?.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-6">
          <p className="text-sm font-bold text-red-200">{copy.overallWinner}</p>
          <div className="mt-2 text-2xl font-black text-white">{overall?.name}</div>
          <p className="mt-4 text-xs uppercase tracking-wider text-gray-400">{copy.sharedRisks}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(sharedRisks.length ? sharedRisks : [copy.routine, copy.risk, copy.history]).map((risk) => (
              <span key={risk} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs capitalize text-gray-300">{risk}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {selected.map((item) => <ComparisonCard key={item.id} item={item} copy={copy} />)}
      </div>
    </div>
  );
}
