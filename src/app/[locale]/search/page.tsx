import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";
import { getSearchIndex, searchSite, type SearchType } from "@/lib/search";

const SITE_NAME = "TT AUTO'S Engineering";
const PATH = "/search";
const TITLE = "Search";
const DESCRIPTION =
  "Search TT AUTO'S Engineering for German car reliability topics, buying guides, technical insights, brands, engines, and symptoms.";

const types: Array<"All" | SearchType> = [
  "All",
  "Insight",
  "Blog",
  "Powertrain",
  "Guide",
  "Brand",
  "Page",
];
const quickSearches = [
  "DSG",
  "N47",
  "AdBlue",
  "EA888",
  "misfire",
  "oil leak",
  "timing chain",
  "Haldex",
  "NOx sensor",
  "ZF 8HP",
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

function TypeLink({
  type,
  q,
  selected,
}: {
  type: string;
  q: string;
  selected: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type !== "All") params.set("type", type);
  const href = params.toString() ? `/search?${params}` : "/search";
  const active = selected === type;

  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "border-red-500 bg-red-600 text-white"
          : "border-gray-700 bg-white/5 text-gray-200 hover:border-gray-500 hover:bg-white/10",
      ].join(" ")}
    >
      {type}
    </Link>
  );
}

function ResultBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
      {children}
    </span>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string; type?: string };
}) {
  const q = (searchParams?.q ?? "").trim();
  const selectedType = types.includes(searchParams?.type as SearchType)
    ? searchParams?.type ?? "All"
    : "All";
  const results = searchSite(q, selectedType);
  const totalItems = getSearchIndex().length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-10">
        <p className="text-sm font-semibold text-red-300">Search the library</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
          Find reliability topics fast
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">
          Search across {totalItems} technical insights, blog posts, brand hubs, buying
          guides, and reliability pages by symptom, engine, gearbox, brand, or system.
        </p>

        <form action="/search" className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search DSG, N47, misfire, AdBlue, oil leak..."
            className="min-h-14 rounded-2xl border border-gray-700 bg-[#0B1220] px-5 text-white outline-none transition placeholder:text-gray-500 focus:border-red-500"
          />
          {selectedType !== "All" ? <input type="hidden" name="type" value={selectedType} /> : null}
          <button
            type="submit"
            className="rounded-2xl bg-red-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Search
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {quickSearches.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:border-gray-500 hover:text-white"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Browse all"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {q ? `Showing matches for "${q}".` : "Start with a popular topic or browse by type."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <TypeLink key={type} type={type} q={q} selected={selectedType} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {results.slice(0, q ? 36 : 18).map((result) => (
            <Link
              key={`${result.type}-${result.href}`}
              href={result.href}
              className="group grid gap-4 rounded-3xl border border-gray-800 bg-[#111827] p-4 transition hover:border-red-500 md:grid-cols-[160px_1fr]"
            >
              <div className="relative min-h-36 overflow-hidden rounded-2xl bg-white/5">
                {result.image ? (
                  <Image
                    src={result.image}
                    alt={result.title}
                    fill
                    sizes="160px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-36 items-center justify-center bg-[#0B1220] text-3xl font-extrabold text-gray-600">
                    TT
                  </div>
                )}
              </div>
              <div className="min-w-0 p-1">
                <div className="flex flex-wrap gap-2">
                  <ResultBadge>{result.type}</ResultBadge>
                  {result.brand ? <ResultBadge>{result.brand}</ResultBadge> : null}
                  {result.category ? <ResultBadge>{result.category}</ResultBadge> : null}
                  {result.platform ? <ResultBadge>{result.platform}</ResultBadge> : null}
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white">
                  {result.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {result.description}
                </p>
                <div className="mt-5 text-sm font-semibold text-gray-200 group-hover:text-white">
                  Open result -&gt;
                </div>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-gray-800 bg-[#111827] p-7">
            <h3 className="text-xl font-bold">No exact match yet</h3>
            <p className="mt-2 text-gray-400">
              Try a broader term like diesel, timing chain, gearbox, BMW, Audi, or oil.
              You can also request a topic through the contact page.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Request a topic
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
