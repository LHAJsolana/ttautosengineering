import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { powertrains } from "@/lib/powertrains";
import { canonical } from "@/lib/site";

const TITLE = "Engine and Gearbox Library";
const DESCRIPTION =
  "Research German car engines and gearboxes by reliability risk, common faults, applications, service priorities, and pre-purchase checks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/powertrains") },
  openGraph: {
    type: "website",
    url: canonical("/powertrains"),
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function PowertrainsPage() {
  const engines = powertrains.filter((item) => item.kind === "Engine");
  const gearboxes = powertrains.filter((item) => item.kind === "Gearbox");

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Powertrains" }]} />

      <section className="mt-6 overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
        <div className="relative min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=80"
            alt="Engine and gearbox technical library"
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/88 to-[#0B1220]/30" />
          <div className="relative max-w-3xl p-8 md:p-12">
            <p className="text-sm font-semibold text-red-300">Technical Database</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Engine and gearbox library
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-200">
              Identify the exact powertrain before judging a car. Each profile turns common
              reputation into practical checks, service priorities, and model connections.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/models"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-700"
              >
                Browse model guides
              </Link>
              <Link
                href="/buying-checklist"
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm transition hover:bg-white/15"
              >
                Run risk checker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {[
        { title: "Engines", description: "Petrol and diesel families to identify before buying.", items: engines },
        { title: "Gearboxes", description: "Automatic and dual-clutch units where service proof changes the risk.", items: gearboxes },
      ].map((section) => (
        <section key={section.title} className="mt-12">
          <h2 className="text-3xl font-bold">{section.title}</h2>
          <p className="mt-2 text-gray-400">{section.description}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={`/powertrains/${item.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] transition hover:border-red-500 md:grid-cols-[190px_1fr]"
              >
                <div className="relative min-h-52 bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 190px"
                    className="object-cover opacity-85 transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>{item.fuel}</span>
                    <span>{item.years}</span>
                    <span>{item.score}/100</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold">{item.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.brands.map((brand) => (
                      <span
                        key={brand}
                        className="rounded-full border border-gray-700 bg-white/5 px-2.5 py-1 text-xs text-gray-200"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 text-sm font-semibold text-gray-200">
                    Open technical profile -&gt;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
