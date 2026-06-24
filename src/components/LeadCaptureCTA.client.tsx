"use client";

import { useState } from "react";

type LeadCaptureCTAProps = {
  source?: string;
  compact?: boolean;
  className?: string;
};

const brands = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Other"];
const gearboxes = ["Automatic", "Manual", "DSG / S tronic", "ZF 8HP", "9G-Tronic", "Not sure"];

export default function LeadCaptureCTA({
  source = "site",
  compact = false,
  className = "",
}: LeadCaptureCTAProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      className={[
        "rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-950/35 via-[#111827] to-[#0B1220] p-6 shadow-2xl shadow-red-950/10 md:p-8",
        className,
      ].join(" ")}
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-red-300">Buyer help</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            Request a used-car risk review
          </h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Send us the model, year, engine and mileage. We&apos;ll help identify the
            main risks before you buy.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-gray-300">
            {[
              "Known engine and gearbox weak points.",
              "Fault codes and symptoms to verify.",
              "Inspection questions before negotiation.",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-gray-500">
            This is buyer guidance, not a remote mechanical inspection or a guarantee.
            Always verify the car in person with diagnostics and service records.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-bold text-white">Request prepared</h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              The form is ready for backend/email integration. For now, send these
              details through the contact page so TT AUTO&apos;S can review the risk.
            </p>
            <a
              href="mailto:contact@ttautosengineering.com?subject=Used-car%20risk%20review%20request"
              className="mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Send by email
            </a>
          </div>
        ) : (
          <form
            className={compact ? "grid gap-3 md:grid-cols-2" : "grid gap-4 md:grid-cols-2"}
            onSubmit={(event) => {
              event.preventDefault();
              // TODO: Connect this placeholder submission to an email, CRM, or API route.
              setSubmitted(true);
            }}
          >
            <input type="hidden" name="source" value={source} />
            <label className="grid gap-2 text-sm text-gray-300">
              Brand
              <select
                name="brand"
                required
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-400"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Model
              <input
                name="model"
                required
                placeholder="320d F30, C220d W205..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Year
              <input
                name="year"
                inputMode="numeric"
                placeholder="2018"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Engine
              <input
                name="engine"
                placeholder="B47, OM651, EA888..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Mileage
              <input
                name="mileage"
                placeholder="150,000 km"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Gearbox
              <select
                name="gearbox"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-400"
              >
                <option value="">Select gearbox</option>
                {gearboxes.map((gearbox) => (
                  <option key={gearbox}>{gearbox}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Country / market
              <input
                name="market"
                placeholder="Morocco, Germany, Netherlands..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Optional VIN
              <input
                name="vin"
                placeholder="VIN if available"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300 md:col-span-2">
              User question
              <textarea
                name="question"
                rows={compact ? 3 : 4}
                placeholder="What worries you about this car?"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300 md:col-span-2">
              Email / contact method
              <input
                name="contact"
                required
                placeholder="Email, WhatsApp, or preferred contact"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 md:col-span-2"
            >
              Prepare risk review request
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
