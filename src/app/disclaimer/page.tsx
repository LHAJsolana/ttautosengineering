import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/disclaimer";
const TITLE = "Disclaimer";
const DESCRIPTION =
  "Important notes about TT AUTO'S Engineering content, reliability guidance, buying advice, and editorial independence.";

const sections = [
  {
    title: "Informational content",
    body: "The articles, buying guides, reliability notes, and brand pages on this website are provided for general informational and educational purposes. They should not be treated as professional mechanical, legal, financial, insurance, or valuation advice.",
  },
  {
    title: "Vehicle condition varies",
    body: "A car's reliability depends on service history, mileage, usage, climate, repairs, inspection quality, market specification, previous ownership, and many other factors. A model or engine described as generally reliable can still have serious problems, and a model with known weaknesses can still be a good buy if it has been maintained correctly.",
  },
  {
    title: "Inspection is still essential",
    body: "Before buying, selling, repairing, or modifying a vehicle, you should arrange an independent inspection by a qualified technician and verify the vehicle's service history, diagnostic results, recalls, title status, and local legal requirements.",
  },
  {
    title: "No guarantees",
    body: "TT AUTO'S Engineering makes reasonable efforts to keep content accurate and useful, but we do not guarantee completeness, accuracy, availability, future reliability, repair cost, market value, or suitability for a specific vehicle or purchase decision.",
  },
  {
    title: "External links and affiliates",
    body: "This site may link to external websites, marketplaces, tools, or services. We are not responsible for third-party content, pricing, availability, policies, or claims. If affiliate links are used, editorial recommendations remain independent.",
  },
];

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

export default function DisclaimerPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <p className="text-sm text-red-300 font-semibold">Trust & transparency</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
          Disclaimer
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed max-w-3xl">
          TT AUTO&apos;S Engineering publishes engineering-focused automotive content to help
          readers make better-informed ownership and buying decisions. The notes below explain
          the limits of that content.
        </p>
      </section>

      <section className="mt-8 grid gap-4">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-gray-800 bg-white/[0.03] p-6 md:p-7"
          >
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-white">Corrections and contact</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          If you notice an error, outdated detail, or missing context, contact us so the
          article can be reviewed.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Contact us
          </Link>
          <Link
            href="/about"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 hover:bg-white/10 transition"
          >
            About TT AUTO&apos;S Engineering
          </Link>
        </div>
      </section>
    </main>
  );
}
