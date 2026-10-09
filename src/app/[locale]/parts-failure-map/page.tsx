import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import Link from "@/components/LocalizedLink";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getLocalizedPartsFailureItems } from "@/lib/partsFailureMap";
import { canonical, localizedPageMetadata } from "@/lib/site";

const TITLE = "Parts & Failure Map";
const DESCRIPTION =
  "A practical map of known weak parts and failure patterns on used BMW, Mercedes-Benz, Audi, and Volkswagen models.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: "/parts-failure-map",
    title: TITLE,
    description: DESCRIPTION,
  });
}

export default async function PartsFailureMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const items = getLocalizedPartsFailureItems(locale);
  const brands = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen"];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonical("/parts-failure-map", locale),
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: TITLE }]} />

      <section className="mt-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B1220] p-8 md:p-10">
        <p className="text-sm font-semibold text-red-300">Used-car systems</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
          Parts & Failure Map
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-300">
          A practical map of known weak parts and failure patterns on used BMW,
          Mercedes-Benz, Audi, and Volkswagen models.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/buying-checklist" className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">
            Check a car
          </Link>
          <Link href="/fault-codes" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10">
            Search fault codes
          </Link>
          <Link href="/how-we-evaluate-used-cars" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10">
            How we evaluate cars
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-8">
        {brands.map((brand) => {
          const brandItems = items.filter((item) => item.brand === brand);
          return (
            <div key={brand}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{brand}</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Common systems to inspect before buying.
                  </p>
                </div>
                <Link href={brandItems[0]?.brandHref ?? "/brands"} className="text-sm font-semibold text-gray-200 hover:text-white">
                  Brand hub -&gt;
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {brandItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/parts-failure-map/${item.slug}`}
                    className="group rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-red-500 hover:bg-white/[0.06]"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                      {item.system}
                    </div>
                    <h3 className="mt-2 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{item.summary}</p>
                    <div className="mt-5 text-sm font-semibold text-gray-300 group-hover:text-white">
                      Open map -&gt;
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <LeadCaptureCTA source="parts-failure-map:index" className="mt-10" />
    </main>
  );
}
