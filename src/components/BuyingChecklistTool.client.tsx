"use client";

import Link from "@/components/LocalizedLink";
import { useMemo, useState } from "react";
import { brandNames } from "@/lib/brands";

type Choice = {
  label: string;
  value: number;
  note: string;
};

type Field = {
  id: string;
  label: string;
  choices: Choice[];
};

const fields: Field[] = [
  {
    id: "service",
    label: "Service history",
    choices: [
      { label: "Full invoices", value: 0, note: "Strong proof" },
      { label: "Partial records", value: 10, note: "Verify gaps" },
      { label: "No proof", value: 24, note: "Price in catch-up work" },
    ],
  },
  {
    id: "scan",
    label: "Diagnostic scan",
    choices: [
      { label: "Clean full scan", value: 0, note: "Good baseline" },
      { label: "Minor stored faults", value: 8, note: "Needs context" },
      { label: "No scan / warning lights", value: 22, note: "High uncertainty" },
    ],
  },
  {
    id: "coldStart",
    label: "Cold start",
    choices: [
      { label: "Smooth", value: 0, note: "No obvious concern" },
      { label: "Brief noise", value: 8, note: "Inspect closely" },
      { label: "Rattle / smoke / rough", value: 22, note: "Do not ignore" },
    ],
  },
  {
    id: "leaks",
    label: "Oil or coolant leaks",
    choices: [
      { label: "Dry engine bay", value: 0, note: "Still inspect underside" },
      { label: "Light sweating", value: 7, note: "Negotiate if common" },
      { label: "Active leaks / coolant loss", value: 22, note: "Repair risk" },
    ],
  },
  {
    id: "gearbox",
    label: "Gearbox behavior",
    choices: [
      { label: "Smooth all conditions", value: 0, note: "Best sign" },
      { label: "Slight hesitation", value: 9, note: "Check service proof" },
      { label: "Jerks / flares / warnings", value: 24, note: "Expensive risk" },
    ],
  },
  {
    id: "mileage",
    label: "Mileage and use",
    choices: [
      { label: "Low with proof", value: 2, note: "Still age-check fluids" },
      { label: "Average", value: 6, note: "Normal wear expected" },
      { label: "High / unknown use", value: 14, note: "History matters more" },
    ],
  },
  {
    id: "seller",
    label: "Seller behavior",
    choices: [
      { label: "Transparent", value: 0, note: "Good signal" },
      { label: "Some gaps", value: 8, note: "Ask better questions" },
      { label: "Pressure / vague answers", value: 18, note: "Walk-away signal" },
    ],
  },
];

const defaults = Object.fromEntries(fields.map((field) => [field.id, 0]));

function riskBand(score: number) {
  if (score < 28) {
    return {
      label: "Lower risk",
      color: "text-emerald-300",
      bar: "bg-emerald-500",
      summary:
        "The car has encouraging signals, but still needs a cold inspection, full scan, and paperwork check.",
    };
  }
  if (score < 62) {
    return {
      label: "Medium risk",
      color: "text-yellow-300",
      bar: "bg-yellow-500",
      summary:
        "There are enough concerns to slow down. Verify service proof, scan results, leaks, and gearbox behavior before negotiating.",
    };
  }
  return {
    label: "High risk",
    color: "text-red-300",
    bar: "bg-red-500",
    summary:
      "This car needs a professional inspection and a repair budget before purchase. If the seller cannot prove the story, walk away.",
  };
}

export default function BuyingChecklistTool() {
  const [answers, setAnswers] = useState<Record<string, number>>(defaults);
  const [brand, setBrand] = useState("BMW");
  const [fuel, setFuel] = useState("Diesel");

  const score = useMemo(
    () => Object.values(answers).reduce((sum, value) => sum + value, 0),
    [answers]
  );
  const band = riskBand(score);
  const percent = Math.min(100, Math.round((score / 146) * 100));

  const topRisks = fields
    .map((field) => {
      const value = answers[field.id] ?? 0;
      const choice = field.choices.find((item) => item.value === value);
      return { field, value, choice };
    })
    .filter((item) => item.value >= 10)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const related = [
    { label: "Service history", href: "/search?q=service%20history" },
    { label: fuel === "Diesel" ? "Diesel emissions" : "PCV and oil use", href: fuel === "Diesel" ? "/search?q=AdBlue" : "/search?q=PCV" },
    { label: `${brand} topics`, href: `/search?q=${encodeURIComponent(brand)}` },
    { label: "Gearbox checks", href: "/search?q=gearbox" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-gray-800 bg-[#111827] p-6 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-gray-300">
            Brand
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="rounded-2xl border border-gray-700 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-500"
            >
              {brandNames.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-gray-300">
            Fuel type
            <select
              value={fuel}
              onChange={(event) => setFuel(event.target.value)}
              className="rounded-2xl border border-gray-700 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-500"
            >
              {["Diesel", "Petrol", "Hybrid"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          {fields.map((field) => (
            <div key={field.id} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-white">{field.label}</h2>
                <span className="text-xs text-gray-500">Choose one</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {field.choices.map((choice) => {
                  const active = answers[field.id] === choice.value;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [field.id]: choice.value }))
                      }
                      className={[
                        "rounded-2xl border p-3 text-left transition",
                        active
                          ? "border-red-500 bg-red-600/15"
                          : "border-gray-800 bg-white/[0.025] hover:border-gray-600",
                      ].join(" ")}
                    >
                      <span className="block text-sm font-semibold text-white">{choice.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-400">
                        {choice.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="lg:sticky lg:top-28 h-fit rounded-3xl border border-gray-800 bg-[#111827] p-6 md:p-7">
        <p className="text-sm font-semibold text-red-300">Risk estimate</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <div className={`text-3xl font-extrabold ${band.color}`}>{band.label}</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{band.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-white">{score}</div>
            <div className="text-xs text-gray-500">risk points</div>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div className={`h-full ${band.bar}`} style={{ width: `${percent}%` }} />
        </div>

        <div className="mt-7">
          <h3 className="font-semibold text-white">Inspect first</h3>
          <div className="mt-3 grid gap-3">
            {(topRisks.length ? topRisks : fields.slice(0, 3).map((field) => ({ field, value: 0, choice: field.choices[0] }))).map(
              (item) => (
                <div key={item.field.id} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">{item.field.label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-gray-400">
                    {item.choice?.note}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-7">
          <h3 className="font-semibold text-white">Related reading</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-gray-700 bg-white/5 px-3 py-2 text-xs text-gray-200 transition hover:border-gray-500 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <h3 className="font-semibold text-white">Walk away if</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            The seller refuses a scan, hides service records, explains away warning lights,
            or pressures you before a proper cold inspection.
          </p>
        </div>
      </aside>
    </div>
  );
}
