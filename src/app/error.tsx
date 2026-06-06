"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: send to logging later
    // console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] max-w-4xl mx-auto px-6 py-20 text-white">
      <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#0B1220] via-[#0F1B33] to-[#0B1220] p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative">
          <p className="text-gray-300/80 text-sm">TT AUTO’S Engineering</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-3">
            Something broke
          </h1>
          <p className="text-gray-200/90 mt-4 max-w-2xl">
            This page hit an error. You can retry, or jump back to a safe section.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => reset()}
              className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
            >
              Try again
            </button>
            <Link
              href="/insights"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Insights
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Home
            </Link>
          </div>

          <div className="mt-8 text-xs text-gray-500">
            {error?.digest ? <>Error ID: {error.digest}</> : null}
          </div>
        </div>
      </div>
    </main>
  );
}