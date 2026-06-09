import type { Metadata } from "next";
import { defaultLocale, isLocale } from "@/lib/i18n";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import BuyingChecklistTool from "@/components/BuyingChecklistTool.client";
import { localizedPageMetadata } from "@/lib/site";

const PATH = "/buying-checklist";
const TITLE = "Used German Car Risk Checker";
const DESCRIPTION =
  "Interactive used German car buying checklist and risk checker for BMW, Mercedes-Benz, Audi, and Volkswagen.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: PATH,
    title: TITLE,
    description: DESCRIPTION,
  });
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-gray-100 md:text-sm">
      {children}
    </span>
  );
}

export default function BuyingChecklistPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Buying Checklist" }]} />

      <section className="mt-6 mb-10 overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
        <div className="relative min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1800&q=80"
            alt="Pre-purchase inspection tools"
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/86 to-[#0B1220]/35" />
          <div className="relative p-8 md:p-12">
            <div className="mb-6 flex flex-wrap gap-2">
              <Pill>Interactive tool</Pill>
              <Pill>Pre-purchase risk</Pill>
              <Pill>BMW / Mercedes / Audi / VW</Pill>
            </div>
            <p className="text-sm font-semibold text-red-300">Buying Checklist</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Used German Car Risk Checker
            </h1>
            <p className="mt-5 max-w-3xl leading-relaxed text-gray-200">
              Score the car before you buy it. Use service proof, scan results,
              cold-start behavior, leaks, gearbox feel, mileage, and seller transparency
              to estimate ownership risk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#checker"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Start checker
              </a>
              <Link
                href="/search?q=pre%20purchase"
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-gray-100 transition hover:bg-white/15"
              >
                Search buying topics
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="checker">
        <BuyingChecklistTool />
      </section>
    </main>
  );
}
