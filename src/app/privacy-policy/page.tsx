import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/privacy-policy";
const TITLE = "Privacy Policy";
const DESCRIPTION =
  "Privacy policy for TT AUTO'S Engineering, including contact emails, site usage data, cookies, external links, and user rights.";

const updatedDate = "May 30, 2026";

const sections = [
  {
    title: "Information you provide",
    body: "If you contact us by email, Instagram, or another channel, we may receive your name, email address, social profile, message content, vehicle details you choose to share, and any attachments or context included in your request.",
  },
  {
    title: "Information collected automatically",
    body: "Like most websites, this site may collect basic technical information such as pages visited, referring pages, approximate location, browser type, device type, and timestamps. This information helps us understand site performance, improve content, and protect the website from abuse.",
  },
  {
    title: "Cookies and similar technologies",
    body: "This site may use cookies or similar technologies for essential website functionality, analytics, performance measurement, and affiliate attribution. You can usually control cookies through your browser settings.",
  },
  {
    title: "How information is used",
    body: "We use information to respond to messages, improve articles and guides, maintain website security, understand which topics readers find useful, and manage editorial or collaboration inquiries.",
  },
  {
    title: "External links",
    body: "This website may link to external sites, social platforms, marketplaces, tools, or services. Those third parties have their own privacy practices, and TT AUTO'S Engineering is not responsible for how external websites handle data.",
  },
  {
    title: "Affiliate and advertising partners",
    body: "If this site uses affiliate links or advertising partners, those services may use cookies, referral identifiers, or similar technologies to measure traffic, conversions, or ad performance.",
  },
  {
    title: "Data retention",
    body: "We keep contact messages and related information only as long as reasonably needed to respond, maintain records, improve the site, or meet legal and operational needs.",
  },
  {
    title: "Your choices",
    body: "You can contact us to request access, correction, or deletion of personal information you have provided, subject to reasonable verification and any legal or operational requirements.",
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

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <p className="text-sm text-red-300 font-semibold">Privacy</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed max-w-3xl">
          This policy explains how {SITE_NAME} may collect, use, and protect information
          when you visit the website or contact us.
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
        <h2 className="text-2xl font-bold text-white">Contact about privacy</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          For privacy questions or requests, contact TT AUTO&apos;S Engineering through the
          contact page.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
