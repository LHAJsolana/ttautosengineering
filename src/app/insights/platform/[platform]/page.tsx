// src/app/insights/platform/[platform]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { canonical } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";
import InsightsGridClient from "@/components/InsightsGrid.client";
import { unslugifyTaxonomy, matchesTaxonomy } from "@/lib/taxonomy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform } = await params;
  const title = `${unslugifyTaxonomy(platform)} — Platform Insights`;
  const description =
    "Engineering notes grouped by platform: failure modes, diagnostics signals, and what to check.";

  const path = `/insights/platform/${platform}`;

  return {
    title,
    description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      type: "website",
      url: canonical(path),
      title,
      description,
      images: [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function PlatformArchivePage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform } = await params;

  const all = getAllInsights();
  const filtered = all.filter((p) => matchesTaxonomy(p.frontmatter.platform, platform));

  const label = unslugifyTaxonomy(platform);

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-white">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: `Platform: ${label}` },
        ]}
      />

      <section className="mt-6 mb-10">
        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8">
          <p className="text-gray-300/80 text-sm">Platform archive</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{label}</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            All insights tagged with this platform. Use these clusters to build deep,
            engineering-first understanding.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/insights"
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-5 py-3 text-sm hover:bg-white/10 transition"
            >
              Back to Insights
            </Link>
          </div>
        </div>
      </section>

      {filtered.length > 0 ? (
        <InsightsGridClient items={filtered} pageSize={12} />
      ) : (
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
          <p className="text-gray-200 font-semibold">No posts yet for this platform.</p>
          <p className="text-gray-400 mt-1 text-sm">
            Add <code className="px-1 py-0.5 rounded bg-white/10">platform</code> in MDX
            frontmatter and you’re good.
          </p>
        </div>
      )}
    </main>
  );
}
