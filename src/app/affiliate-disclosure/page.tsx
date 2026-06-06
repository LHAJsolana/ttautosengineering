import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/affiliate-disclosure";
const TITLE = "Affiliate Disclosure";
const DESCRIPTION =
  "Affiliate disclosure for TT AUTO'S Engineering, explaining affiliate links, commissions, editorial independence, and reader responsibility.";

const updatedDate = "May 30, 2026";

const sections = [
  {
    title: "Affiliate links",
    body: "Some pages on TT AUTO'S Engineering may include affiliate links to products, tools, services, marketplaces, parts suppliers, books, or other third-party websites. If you click one of these links and make a purchase or complete an action, we may earn a commission or receive referral credit.",
  },
  {
    title: "No extra cost to readers",
    body: "Affiliate commissions are typically paid by the merchant or platform and should not add extra cost to you. Pricing, availability, shipping, taxes, warranties, and product terms are controlled by the third-party seller or service provider.",
  },
  {
    title: "Editorial independence",
    body: "Affiliate relationships do not control our editorial opinions. Buying guides, reliability notes, and recommendations are intended to remain independent and focused on usefulness, ownership risk, engineering context, and reader value.",
  },
  {
    title: "Reader responsibility",
    body: "You should verify that any product, tool, service, or part is suitable for your specific vehicle, market, budget, and intended use before buying. When in doubt, consult a qualified technician or the relevant manufacturer documentation.",
  },
  {
    title: "External websites",
    body: "External websites have their own terms, privacy policies, pricing, return policies, and support processes. TT AUTO'S Engineering is not responsible for third-party claims, delays, errors, availability, or customer service.",
  },
  {
    title: "Future advertising",
    body: "This website may also use advertising networks or sponsorships in the future. Sponsored placements or ads will not change the core editorial goal: clear, practical automotive information for readers.",
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

export default function AffiliateDisclosurePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Affiliate Disclosure" }]}
      />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <p className="text-sm text-red-300 font-semibold">Transparency</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
          Affiliate Disclosure
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed max-w-3xl">
          This page explains how affiliate links may be used on {SITE_NAME} and how
          that relates to the editorial content on the website.
        </p>
        <p className="mt-4 text-sm text-gray-500">Last updated: {updatedDate}</p>
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
        <h2 className="text-2xl font-bold text-white">Questions or corrections</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          If an affiliate relationship should be clarified on a specific page, contact us
          and we will review it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Contact us
          </Link>
          <Link
            href="/terms"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 hover:bg-white/10 transition"
          >
            Terms
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 hover:bg-white/10 transition"
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </main>
  );
}
