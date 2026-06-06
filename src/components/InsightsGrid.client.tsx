"use client";

import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { useMemo, useState } from "react";
import { slugifyTaxonomy } from "@/lib/taxonomy";

export type InsightGridItem = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    updated?: string;
    brand?: string;
    image?: string;
    category?: string;
    platform?: string;
    risk?: string[];
    featured?: boolean;
    priority?: number;
  };
  meta?: { excerpt?: string; wordCount?: number; readingMinutes?: number };
};

function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[11px] px-2 py-1 rounded-full border border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 hover:border-gray-500 transition"
    >
      {children}
    </Link>
  );
}

function taxonomyPills(p: InsightGridItem) {
  const pills: Array<{ label: string; href: string }> = [];

  if (p.frontmatter.category) {
    pills.push({
      label: p.frontmatter.category,
      href: `/insights/category/${slugifyTaxonomy(p.frontmatter.category)}`,
    });
  }
  if (p.frontmatter.platform) {
    pills.push({
      label: p.frontmatter.platform,
      href: `/insights/platform/${slugifyTaxonomy(p.frontmatter.platform)}`,
    });
  }

  if (p.frontmatter.risk?.length) {
    for (const r of p.frontmatter.risk.slice(0, 2)) {
      // If you haven't created /insights/risk route yet, keep this as query:
      pills.push({
        label: r,
        href: `/insights?q=${encodeURIComponent(r)}`,
      });
      // If you DO create the route later, switch to:
      // href: `/insights/risk/${slugifyTaxonomy(r)}`
    }
  }

  return pills.slice(0, 4);
}

export default function InsightsGridClient({
  items,
  pageSize = 12,
}: {
  items: InsightGridItem[];
  pageSize?: number;
}) {
  const [visible, setVisible] = useState(pageSize);

  const shown = useMemo(() => items.slice(0, visible), [items, visible]);
  const canLoadMore = visible < items.length;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {shown.map((p) => {
          const dateLabel = p.frontmatter.updated ?? p.frontmatter.date;
          const img = p.frontmatter.image ?? null;
          const pills = taxonomyPills(p);
          const brand = p.frontmatter.brand ?? "";

          return (
            <div
              key={p.slug}
              className="group bg-[#111827] rounded-2xl border border-gray-800 hover:border-red-500 hover:bg-white/5 transition overflow-hidden"
            >
              <div className="p-6 flex gap-5">
                <div className="flex-1 min-w-0">
                  {/* Pills row (all are links, safe now) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.frontmatter.featured ? (
                      <span className="text-[11px] px-2 py-1 rounded-full border border-red-500/50 bg-red-500/10 text-red-100">
                        Editor’s Pick
                      </span>
                    ) : null}

                    {brand ? (
                      <PillLink href={`/insights?brand=${encodeURIComponent(brand)}`}>
                        {brand}
                      </PillLink>
                    ) : null}

                    {pills.map((t) => (
                      <PillLink key={`${t.href}-${t.label}`} href={t.href}>
                        {t.label}
                      </PillLink>
                    ))}
                  </div>

                  {/* Title link (main click target) */}
                  <h3 className="text-white text-xl font-semibold leading-snug mt-3">
                    <Link
                      href={`/insights/${p.slug}`}
                      className="hover:text-white underline decoration-transparent hover:decoration-red-500/70 transition"
                    >
                      {p.frontmatter.title}
                    </Link>
                  </h3>

                  <p className="text-gray-300 mt-2">{p.frontmatter.description}</p>

                  {p.meta?.excerpt ? (
                    <p className="text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3">
                      {p.meta.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                    <span>{dateLabel}</span>
                    {p.meta ? (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>{p.meta.readingMinutes ?? 1} min read</span>
                        <span className="text-gray-600">•</span>
                        <span>{(p.meta.wordCount ?? 0).toLocaleString()} words</span>
                      </>
                    ) : null}
                  </div>

                  {/* Read link */}
                  <div className="text-sm text-gray-200 mt-6">
                    <Link
                      href={`/insights/${p.slug}`}
                      className="group-hover:text-white transition"
                    >
                      Read →
                    </Link>
                  </div>
                </div>

                {/* Thumb */}
                <div className="hidden sm:block relative w-[160px] shrink-0">
                  <div className="relative h-[140px] rounded-2xl overflow-hidden border border-gray-800 bg-white/5">
                    <Image
                      src={img ?? "/opengraph-image"}
                      alt={p.frontmatter.title}
                      fill
                      sizes="160px"
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 ? null : (
        <div className="mt-10 flex items-center justify-center">
          {canLoadMore ? (
            <button
              onClick={() => setVisible((v) => Math.min(v + pageSize, items.length))}
              className="rounded-2xl border border-gray-700 bg-white/5 text-gray-100 px-6 py-3 text-sm hover:bg-white/10 transition"
            >
              Load more ({Math.min(visible + pageSize, items.length)}/{items.length})
            </button>
          ) : (
            <div className="text-xs text-gray-500">You’ve reached the end of the list.</div>
          )}
        </div>
      )}
    </>
  );
}
