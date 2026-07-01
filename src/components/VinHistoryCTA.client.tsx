"use client";

import { useState } from "react";

type Copy = {
  label: string;
  placeholder: string;
  help: string;
  invalid: string;
  button: string;
  disclosure: string;
};

export default function VinHistoryCTA({
  copy,
  locale,
  destination,
}: {
  copy: Copy;
  locale: string;
  destination: string;
}) {
  const [vin, setVin] = useState("");
  const [error, setError] = useState("");

  function continueToHistory() {
    const normalized = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) {
      setError(copy.invalid);
      return;
    }

    setError("");
    window.dataLayer?.push({
      event: "vin_history_outbound",
      source: "vin-history-page",
      locale,
    });
    window.open(destination, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-3xl border border-red-500/25 bg-[#0b1220]/85 p-6 shadow-2xl shadow-black/20 md:p-8">
      <label className="grid gap-2 text-sm font-semibold text-gray-200">
        {copy.label}
        <input
          value={vin}
          onChange={(event) => setVin(event.target.value.toUpperCase().slice(0, 17))}
          placeholder={copy.placeholder}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          aria-invalid={Boolean(error)}
          className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 font-mono text-base tracking-wider text-white outline-none placeholder:text-gray-600 focus:border-red-400"
        />
      </label>
      <p className="mt-2 text-xs leading-5 text-gray-500">{copy.help}</p>
      {error ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}
      <button
        type="button"
        onClick={continueToHistory}
        className="mt-5 w-full rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-500"
      >
        {copy.button}
      </button>
      <p className="mt-4 text-xs leading-5 text-gray-500">{copy.disclosure}</p>
    </div>
  );
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}
