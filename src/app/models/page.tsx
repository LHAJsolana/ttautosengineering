import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { modelPages } from "@/lib/models";
import { canonical } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/models";
const TITLE = "Model Buying Guides";
const DESCRIPTION =
  "Model-specific used buying guides for BMW, Mercedes-Benz, Audi, and Volkswagen buyers.";

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

export default function ModelsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Models" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-8 md:p-12">
        <p className="text-sm font-semibold text-red-300">Model Guides</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Used German car model pages
        </h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">
          Start with the exact model buyers search for, then drill into engines, common
          problems, inspection priorities, ownership plans, reliability score, and related technical insights.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/buying-checklist"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Run risk checker
          </Link>
          <Link
            href="/search"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-100 transition hover:bg-white/10"
          >
            Search all topics
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modelPages.map((model) => (
          <Link
            key={model.slug}
            href={`/models/${model.slug}`}
            className="group overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] transition hover:border-red-500 hover:bg-white/5"
          >
            <div className="relative h-56 bg-white/5">
              <Image
                src={model.heroImage}
                alt={model.name}
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-red-300">{model.brand}</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{model.name}</h2>
                </div>
                <span className="rounded-full border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-200">
                  {model.score}/100
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{model.description}</p>
              <div className="mt-6 text-sm font-semibold text-gray-200 group-hover:text-white">
                Open model guide -&gt;
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
