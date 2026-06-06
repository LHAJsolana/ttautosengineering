import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/about";
const TITLE = "About";
const DESCRIPTION =
  "About TT AUTO'S Engineering: German car reliability, buying guidance, technical insights, and practical ownership research.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: {
    type: "website",
    url: canonical(PATH),
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} - ${SITE_NAME}`,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-200 md:text-sm">
      {children}
    </span>
  );
}

export default function AboutPage() {
  const principles = [
    {
      title: "Engineering-first thinking",
      body: "The site explains why failures happen, not only that they happen. Timing chains, PCV systems, DSG behavior, AdBlue faults, cooling plastics, and injector data are treated as systems.",
    },
    {
      title: "Buyer-focused judgment",
      body: "Every section is built around real decisions: buy, avoid, inspect deeper, budget for repair, or ask for better service proof.",
    },
    {
      title: "Transparent limits",
      body: "The content is guidance, not a substitute for a qualified inspection. A clean article does not guarantee a clean car.",
    },
  ];

  const sections = [
    { label: "Search the library", href: "/search", primary: true },
    { label: "Technical insights", href: "/insights" },
    { label: "Buying guides", href: "/buying-guides" },
    { label: "Reliability index", href: "/reliability-index" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <div className="mb-6 flex flex-wrap gap-2">
          <Pill>German cars</Pill>
          <Pill>Reliability</Pill>
          <Pill>Buying guidance</Pill>
          <Pill>Diagnostics</Pill>
        </div>
        <p className="text-sm font-semibold text-red-300">About</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Practical technical research for German car ownership decisions
        </h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">
          TT AUTO&apos;S Engineering helps buyers and owners understand BMW,
          Mercedes-Benz, Audi, and Volkswagen reliability through technical explainers,
          buying guides, brand hubs, and search-friendly topic pages.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={[
                "rounded-2xl px-5 py-3 text-sm font-semibold transition",
                section.primary
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10",
              ].join(" ")}
            >
              {section.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {principles.map((principle) => (
          <article
            key={principle.title}
            className="rounded-3xl border border-gray-800 bg-white/[0.03] p-6"
          >
            <h2 className="text-xl font-bold text-white">{principle.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{principle.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-white">What the site is built to answer</h2>
        <div className="mt-5 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
          {[
            "What fails first on a used German car?",
            "Which service records matter before buying?",
            "When is a fault a negotiation point versus a walk-away issue?",
            "How do symptoms connect to root causes?",
            "Which brand or platform deserves deeper inspection?",
            "What topic should TT AUTO'S cover next?",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
