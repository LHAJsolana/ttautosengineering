"use client";

import { useMemo, useState } from "react";
import Link from "@/components/LocalizedLink";
import type { FaultCode } from "@/lib/faultCodes";
import type { getToolCopy } from "@/lib/toolCopy";

type Copy = ReturnType<typeof getToolCopy>;

export default function FaultCodeLibrary({ codes, copy }: { codes: FaultCode[]; copy: Copy }) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const systems = [...new Set(codes.map((item) => item.system))].sort();
  const results = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return codes.filter((item) => {
      const matchesSystem = system === "all" || item.system === system;
      const text = [item.code, item.title, item.system, item.summary, ...item.symptoms, ...item.keywords].join(" ").toLowerCase();
      return matchesSystem && (!needle || text.includes(needle));
    });
  }, [codes, query, system]);

  return (
    <div>
      <div className="grid gap-3 rounded-3xl border border-white/10 bg-[#111827] p-5 md:grid-cols-[1fr_280px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchCodes} className="rounded-2xl border border-white/10 bg-[#0b1220] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-red-500" />
        <select value={system} onChange={(event) => setSystem(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-4 text-white">
          <option value="all">{copy.allSystems}</option>
          {systems.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {results.map((item) => (
          <Link key={item.code} href={`/fault-codes/${item.code.toLowerCase()}`} className="group rounded-3xl border border-white/10 bg-[#111827] p-5 transition hover:-translate-y-1 hover:border-red-500/40">
            <div className="flex items-start justify-between gap-4">
              <div><div className="font-mono text-2xl font-black text-red-300">{item.code}</div><h2 className="mt-2 font-bold text-white">{item.title}</h2></div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-gray-300">{item.severity}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">{item.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs"><span className="text-gray-500">{item.system}</span><span data-directional-icon className="font-bold text-red-300 transition group-hover:translate-x-1">-&gt;</span></div>
          </Link>
        ))}
      </div>
      {!results.length ? <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-gray-400">{copy.noResults}</p> : null}
    </div>
  );
}
