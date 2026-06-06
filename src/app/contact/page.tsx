import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/contact";
const TITLE = "Contact";
const DESCRIPTION =
  "Contact TT AUTO'S Engineering for model requests, buying-guide suggestions, reliability topics, and collaboration inquiries.";

const EMAIL = "contact.tt.engineering@gmail.com";
const INSTAGRAM_URL =
  "https://www.instagram.com/tt___autos?igsh=MXg4YzRudnEwNDBmeA%3D%3D&utm_source=qr";

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

function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 text-gray-200">
      {children}
    </span>
  );
}

export default function ContactPage() {
  const mailtoHref =
    `mailto:${EMAIL}` +
    "?subject=" +
    encodeURIComponent("TT AUTO'S Engineering inquiry") +
    "&body=" +
    encodeURIComponent(
      `Hi TT AUTO'S Engineering,\n\nI want to contact you about:\n- Topic:\n- Brand / model:\n- Year / engine:\n\nMessage:\n\nThanks.`
    );

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: "Contact", item: canonical(PATH) },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonical(PATH),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: canonical("/").replace(/\/$/, ""),
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: EMAIL,
      contactType: "editorial inquiries",
    },
    sameAs: [INSTAGRAM_URL],
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <JsonLd data={[breadcrumbsJsonLd, contactPageJsonLd]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="mt-6 mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827]">
          <div className="relative min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=80"
              alt="Contact TT AUTO'S Engineering"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/82 to-[#0B1220]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

            <div className="relative p-8 md:p-12 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Pill>Model requests</Pill>
                <Pill>Buying questions</Pill>
                <Pill>Reliability topics</Pill>
                <Pill>Collaboration</Pill>
              </div>

              <p className="text-gray-300/80 text-sm">Contact</p>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
                Send a model, question, or topic request
              </h1>
              <p className="text-gray-200/90 mt-4 leading-relaxed">
                Reach out for model-specific buying guide requests, reliability topics,
                corrections, collaboration ideas, or German car ownership questions.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href={mailtoHref}
                  className="rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Email us
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/10 text-gray-100 px-5 py-3 text-sm hover:bg-white/15 transition"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
          <h2 className="text-white text-2xl font-bold">Direct contact</h2>
          <p className="text-gray-300 mt-2">
            Use email for detailed requests and Instagram for quick updates or messages.
          </p>

          <div className="mt-6 grid gap-4">
            <a
              href={mailtoHref}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-red-500 hover:bg-white/10 transition"
            >
              <div className="text-xs text-gray-400">Email</div>
              <div className="text-white font-semibold mt-1 break-all">{EMAIL}</div>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-red-500 hover:bg-white/10 transition"
            >
              <div className="text-xs text-gray-400">Instagram</div>
              <div className="text-white font-semibold mt-1">@tt___autos</div>
            </a>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
          <h2 className="text-white text-2xl font-bold">What to include</h2>
          <p className="text-gray-300 mt-2">
            The more specific the request, the easier it is to prioritize a useful answer or article.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-gray-300">
            {[
              "Brand, model, year, engine, gearbox, and mileage range.",
              "Country or market if the car specification changes by region.",
              "The decision you are trying to make: buy, avoid, diagnose, or compare.",
              "Any symptoms, fault codes, service history notes, or inspection findings.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500/80 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/buying-guides"
              className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-4 py-3 text-sm hover:bg-white/10 transition"
            >
              Buying guides
            </Link>
            <Link
              href="/reliability-index"
              className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-4 py-3 text-sm hover:bg-white/10 transition"
            >
              Reliability index
            </Link>
            <Link
              href="/brands"
              className="rounded-2xl border border-white/10 bg-white/5 text-gray-100 px-4 py-3 text-sm hover:bg-white/10 transition"
            >
              Brand hubs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
