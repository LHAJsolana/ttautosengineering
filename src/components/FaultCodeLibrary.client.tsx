"use client";

import { useMemo, useState } from "react";
import Link from "@/components/LocalizedLink";
import type { FaultCode } from "@/lib/faultCodes";
import type { getToolCopy } from "@/lib/toolCopy";

type Copy = ReturnType<typeof getToolCopy>;

function repairBand(item: FaultCode) {
  if (item.severity === "High") return "EUR 180 - 2,500+";
  if (item.severity === "Medium") return "EUR 90 - 1,200";
  return "EUR 60 - 450";
}

export default function FaultCodeLibrary({ codes, copy }: { codes: FaultCode[]; copy: Copy }) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const systems = [...new Set(codes.map((item) => item.system))].sort();
  const results = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return codes.filter((item) => {
      const matchesSystem = system === "all" || item.system === system;
      const matchesSeverity = severity === "all" || item.severity === severity;
      const text = [item.code, item.title, item.system, item.summary, ...item.symptoms, ...item.keywords].join(" ").toLowerCase();
      return matchesSystem && matchesSeverity && (!needle || text.includes(needle));
    });
  }, [codes, query, severity, system]);
  const selected = selectedCodes.map((code) => codes.find((item) => item.code === code)).filter(Boolean) as FaultCode[];
  const urgent = selected.filter((item) => item.severity === "High");
  const sharedSystems = [...new Set(selected.map((item) => item.system))];
  const firstDirection = selected
    .flatMap((item) => item.firstChecks)
    .filter((item, index, values) => values.indexOf(item) === index)
    .slice(0, 5);

  function toggleCode(code: string) {
    setSelectedCodes((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code].slice(-5)
    );
  }

  return (
    <div>
      <div className="grid gap-3 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-[1fr_240px_200px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchCodes} className="rounded-2xl border border-white/10 bg-[#0b1220] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-red-500" />
        <select value={system} onChange={(event) => setSystem(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-4 text-white">
          <option value="all">{copy.allSystems}</option>
          {systems.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-4 text-white">
          <option value="all">{copy.risk}</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
        </select>
      </div>

      {selected.length ? (
        <section className="mt-6 rounded-3xl border border-red-500/25 bg-[linear-gradient(145deg,rgba(127,29,29,0.3),#111827)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-red-300">{copy.combinedDiagnosis}</p>
              <h2 className="mt-2 text-2xl font-black text-white">{selected.map((item) => item.code).join(" + ")}</h2>
            </div>
            <button type="button" onClick={() => setSelectedCodes([])} className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white hover:bg-white/10">{copy.clearSelection}</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-gray-500">{copy.urgentCodes}</div>
              <div className="mt-2 text-xl font-black text-white">{urgent.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-gray-500">{copy.monitorCodes}</div>
              <div className="mt-2 text-xl font-black text-white">{selected.length - urgent.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-gray-500">{copy.allSystems}</div>
              <div className="mt-2 text-sm font-bold text-white">{sharedSystems.join(", ")}</div>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-bold text-white">{copy.firstChecks}</h3>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                {firstDirection.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
              </ol>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <h3 className="font-bold text-amber-100">{copy.important}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">{urgent[0]?.warning ?? copy.codeDisclaimer}</p>
            </div>
          </div>
        </section>
      ) : (
        <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">{copy.selectCodes}</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {results.map((item) => {
          const active = selectedCodes.includes(item.code);
          return (
            <article key={item.code} className={`rounded-3xl border bg-[#111827] p-5 transition ${active ? "border-red-500 bg-red-500/[0.06]" : "border-white/10 hover:border-red-500/40"}`}>
              <div className="flex items-start justify-between gap-4">
                <div><div className="font-mono text-2xl font-black text-red-300">{item.code}</div><h2 className="mt-2 font-bold text-white">{item.title}</h2></div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-gray-300">{item.severity}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-400">{item.summary}</p>
              <div className="mt-4 rounded-xl bg-black/20 px-3 py-2 text-xs text-gray-400">
                {copy.repairRange}: <strong className="text-gray-200">{repairBand(item)}</strong>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <button type="button" onClick={() => toggleCode(item.code)} className={`rounded-xl px-4 py-2 text-xs font-bold transition ${active ? "bg-red-600 text-white" : "border border-white/10 bg-white/[0.05] text-gray-200 hover:bg-white/10"}`}>
                  {active ? copy.selectedCodes : copy.selectCodes}
                </button>
                <Link href={`/fault-codes/${item.code.toLowerCase()}`} className="text-xs font-bold text-red-300">{copy.viewGuide} <span data-directional-icon>-&gt;</span></Link>
              </div>
            </article>
          );
        })}
      </div>
      {!results.length ? <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-gray-400">{copy.noResults}</p> : null}
    </div>
  );
}
