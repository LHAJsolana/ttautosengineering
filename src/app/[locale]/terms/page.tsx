import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/terms";
const TITLE = "Terms";
const DESCRIPTION =
  "Terms of use for TT AUTO'S Engineering, including website use, content limitations, external links, intellectual property, and contact details.";

const updatedDate = "May 30, 2026";

const sections = [
  {
    title: "Acceptance of terms",
    body: "By using this website, you agree to these terms. If you do not agree with them, you should stop using the website.",
  },
  {
    title: "Website content",
    body: "TT AUTO'S Engineering publishes automotive articles, buying guides, reliability notes, brand pages, and related content for informational purposes. Content may be changed, updated, removed, or corrected at any time.",
  },
  {
    title: "No professional advice",
    body: "The website does not provide professional mechanical, legal, financial, insurance, valuation, or safety advice. You remain responsible for decisions involving vehicle purchases, repairs, modifications, inspections, or ownership costs.",
  },
  {
    title: "Permitted use",
    body: "You may use the site for personal, non-commercial reading and research. You may not misuse the website, attempt to disrupt its operation, scrape it at abusive volume, copy content for competing publication, or use it for unlawful activity.",
  },
  {
    title: "Intellectual property",
    body: "Unless otherwise stated, site text, layout, branding, and original content belong to TT AUTO'S Engineering. You may quote short excerpts with clear attribution and a link back to the original page.",
  },
  {
    title: "External links",
    body: "The website may include links to external websites, platforms, products, services, or social media pages. We do not control third-party websites and are not responsible for their content, policies, pricing, availability, or claims.",
  },
  {
    title: "Affiliate links and advertising",
    body: "Some links may be affiliate links or advertising placements. If you purchase through those links, we may earn a commission or receive attribution without additional cost to you. Editorial content remains independent.",
  },
  {
    title: "Limitation of liability",
    body: "To the fullest extent permitted by law, TT AUTO'S Engineering is not liable for losses, costs, damages, or decisions resulting from use of the website, reliance on content, third-party links, or unavailable services.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the website after changes are posted means you accept the updated terms.",
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

export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <p className="text-sm text-red-300 font-semibold">Website terms</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
          Terms of Use
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed max-w-3xl">
          These terms explain the basic rules for using {SITE_NAME}, including how the
          content may be used and the limits of responsibility for automotive decisions.
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
        <h2 className="text-2xl font-bold text-white">Related pages</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          These pages explain privacy handling and the limits of technical and buying-guide
          content in more detail.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/privacy-policy"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 hover:bg-white/10 transition"
          >
            Disclaimer
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 hover:bg-white/10 transition"
          >
            Contact
          </Link>
        </div>
      </section>
    </main>
  );
}
