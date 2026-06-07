"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "@/components/LocalizedLink";
import { useLocale } from "@/components/LocaleProvider";
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

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

function taxonomyPills(post: InsightGridItem) {
  const pills: Array<{ label: string; href: string }> = [];
  if (post.frontmatter.category) {
    pills.push({
      label: post.frontmatter.category,
      href: `/insights/category/${slugifyTaxonomy(post.frontmatter.category)}`,
    });
  }
  if (post.frontmatter.platform) {
    pills.push({
      label: post.frontmatter.platform,
      href: `/insights/platform/${slugifyTaxonomy(post.frontmatter.platform)}`,
    });
  }
  for (const risk of post.frontmatter.risk?.slice(0, 2) ?? []) {
    pills.push({ label: risk, href: `/insights?q=${encodeURIComponent(risk)}` });
  }
  return pills.slice(0, 4);
}

const cardCopy = {
  en: {
    editorsPick: "Editor's Pick",
    minRead: "min read",
    words: "words",
    read: "Read insight",
    loadMore: "Load more",
    end: "You have reached the end of the list.",
  },
  nl: {
    editorsPick: "Keuze van de redactie",
    minRead: "min lezen",
    words: "woorden",
    read: "Lees inzicht",
    loadMore: "Meer laden",
    end: "Je hebt het einde van de lijst bereikt.",
  },
  ar: {
    editorsPick: "اختيار المحرر",
    minRead: "دقائق قراءة",
    words: "كلمة",
    read: "اقرأ التحليل",
    loadMore: "تحميل المزيد",
    end: "لقد وصلت إلى نهاية القائمة.",
  },
} as const;

export default function InsightsGridClient({
  items,
  pageSize = 12,
}: {
  items: InsightGridItem[];
  pageSize?: number;
}) {
  const locale = useLocale();
  const copy = cardCopy[locale];
  const [visible, setVisible] = useState(pageSize);
  const shown = useMemo(() => items.slice(0, visible), [items, visible]);
  const canLoadMore = visible < items.length;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((post) => {
          const dateLabel = post.frontmatter.updated ?? post.frontmatter.date;
          const pills = taxonomyPills(post);
          const brand = post.frontmatter.brand;

          return (
            <article
              key={post.slug}
              className="group relative flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/20"
            >
              <span className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-red-600 via-red-400 to-amber-300 transition duration-500 group-hover:scale-x-100" />

              <Link href={`/insights/${post.slug}`} className="relative block h-52 overflow-hidden">
                <Image
                  src={post.frontmatter.image ?? "/opengraph-image"}
                  alt={post.frontmatter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/15 to-transparent" />
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                  {brand ? (
                    <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {brand}
                    </span>
                  ) : <span />}
                  <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-gray-200 backdrop-blur">
                    {post.meta?.readingMinutes ?? 1} {copy.minRead}
                  </span>
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {post.frontmatter.featured ? (
                    <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-100">
                      {copy.editorsPick}
                    </span>
                  ) : null}
                  {pills.map((pill) => (
                    <PillLink key={`${pill.href}-${pill.label}`} href={pill.href}>
                      {pill.label}
                    </PillLink>
                  ))}
                </div>

                <h3 className="mt-4 text-xl font-bold leading-snug text-white md:text-2xl">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="transition group-hover:text-red-100"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
                  {post.frontmatter.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/[0.07] pt-5 text-xs text-gray-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{dateLabel}</span>
                    {post.meta?.wordCount ? (
                      <>
                        <span className="text-gray-700">/</span>
                        <span>{post.meta.wordCount.toLocaleString(locale)} {copy.words}</span>
                      </>
                    ) : null}
                  </div>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="inline-flex shrink-0 items-center gap-2 font-bold text-gray-200 transition group-hover:text-red-300"
                  >
                    {copy.read}
                    <span data-directional-icon aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {items.length > 0 ? (
        <div className="mt-10 flex items-center justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((value) => Math.min(value + pageSize, items.length))}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-100 transition hover:border-red-400/50 hover:bg-red-500/15"
            >
              {copy.loadMore} ({Math.min(visible + pageSize, items.length)}/{items.length})
            </button>
          ) : (
            <p className="text-xs text-gray-500">{copy.end}</p>
          )}
        </div>
      ) : null}
    </>
  );
}
