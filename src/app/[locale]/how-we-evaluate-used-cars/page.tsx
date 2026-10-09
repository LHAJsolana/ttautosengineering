import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import Link from "@/components/LocalizedLink";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { canonical, localizedPageMetadata } from "@/lib/site";

const TITLE = "How We Evaluate Used Cars";
const DESCRIPTION =
  "How TT AUTO'S Engineering evaluates used BMW, Mercedes-Benz, Audi, and Volkswagen risk through diagnostics, service history, known failures, usage, and red flags.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: "/how-we-evaluate-used-cars",
    title: TITLE,
    description: DESCRIPTION,
  });
}

export default async function HowWeEvaluateUsedCarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const sections = [
    {
      title: "Diagnostics",
      text: "We treat a scan as evidence, not a verdict. Stored faults, cleared-code history, live data, readiness monitors, gearbox modules, emissions modules, and voltage health all matter.",
    },
    {
      title: "Service history",
      text: "Invoices by date and mileage are stronger than verbal claims. Oil intervals, coolant work, timing service, gearbox fluid, brake records, and emissions repairs change the real price.",
    },
    {
      title: "Engine and gearbox risk",
      text: "Every engine and gearbox family has different weak points. We connect the model to the exact powertrain before judging timing chains, cooling systems, EGR/DPF, DSG, 9G-Tronic, or ZF 8HP risk.",
    },
    {
      title: "Fault-code interpretation",
      text: "A code points to a system, not always a part. We compare codes with symptoms, live data, freeze-frame context, service records, and repeat testing after a drive.",
    },
    {
      title: "Mileage and usage risk",
      text: "Highway mileage, short-trip diesel use, missed services, tuning, towing, long idle time, and city traffic all affect risk differently.",
    },
    {
      title: "Known failure patterns",
      text: "We map common failures by brand, model, engine, gearbox, and system so buyers can inspect the right evidence before purchase.",
    },
    {
      title: "Red flags",
      text: "No cold start, missing invoices, recent code clearing, coolant loss, gearbox hesitation, emissions countdowns, uneven tires, or seller pressure can outweigh a clean-looking car.",
    },
    {
      title: "Disclaimer",
      text: "Content on this site is educational buyer guidance. It is not a guarantee, valuation, warranty, or replacement for an in-person inspection by a qualified technician.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonical("/how-we-evaluate-used-cars", locale),
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: TITLE }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B1220] p-8 md:p-10">
        <p className="text-sm font-semibold text-red-300">Trust method</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
          How we evaluate used cars
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-300">
          We look at used German cars through systems: diagnostics, service proof,
          engine-family weaknesses, gearbox behavior, known failure patterns, and
          buyer red flags.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/buying-checklist" className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">
            Open buyer checklist
          </Link>
          <Link href="/parts-failure-map" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10">
            Parts & Failure Map
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
            <h2 className="text-xl font-black text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">{section.text}</p>
          </article>
        ))}
      </section>

      <LeadCaptureCTA source="how-we-evaluate-used-cars" className="mt-10" />
    </main>
  );
}
