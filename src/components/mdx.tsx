// src/components/mdx.tsx
import React from "react";
import Link from "@/components/LocalizedLink";

/**
 * Clean MDX component mapping for next-mdx-remote/rsc compileMDX.
 * - Premium publication defaults
 * - Engineering callouts: <Callout type="tip|warn|danger|note" title="...">...</Callout>
 * - <KpiGrid> and <Kpi> for quick spec blocks
 */

type CalloutType = "note" | "tip" | "warn" | "danger";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const styles: Record<
    CalloutType,
    { badge: string; box: string; title: string; icon: string }
  > = {
    note: {
      icon: "🧾",
      badge: "Note",
      box: "border-gray-700 bg-white/5",
      title: "text-white",
    },
    tip: {
      icon: "✅",
      badge: "Tip",
      box: "border-emerald-500/30 bg-emerald-500/10",
      title: "text-emerald-100",
    },
    warn: {
      icon: "⚠️",
      badge: "Watch",
      box: "border-amber-500/30 bg-amber-500/10",
      title: "text-amber-100",
    },
    danger: {
      icon: "🛑",
      badge: "Risk",
      box: "border-red-500/35 bg-red-500/10",
      title: "text-red-100",
    },
  };

  const s = styles[type];

  return (
    <div className={cx("my-8 rounded-2xl border p-5", s.box)}>
      <div className="flex items-start gap-3">
        <div className="mt-[2px] text-lg leading-none">{s.icon}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "text-[11px] px-2 py-1 rounded-full border border-white/10 bg-black/20 text-gray-200"
              )}
            >
              {s.badge}
            </span>
            {title ? (
              <div className={cx("font-semibold", s.title)}>{title}</div>
            ) : null}
          </div>
          <div className="mt-2 text-sm leading-relaxed text-gray-200/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="my-8 grid md:grid-cols-3 gap-4">{children}</div>;
}

export function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
      {hint ? <div className="mt-2 text-xs text-gray-400">{hint}</div> : null}
    </div>
  );
}

function MdxA(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        {...props}
        target={props.target ?? "_blank"}
        rel={props.rel ?? "nofollow noopener noreferrer"}
      />
    );
  }

  // Internal links use Next <Link />
  return (
    <Link href={href} className={props.className}>
      {props.children}
    </Link>
  );
}

function MdxPre(props: React.HTMLAttributes<HTMLPreElement>) {
  return <pre {...props} className={cx("not-prose", props.className)} />;
}

function MdxCode(props: React.HTMLAttributes<HTMLElement>) {
  return <code {...props} className={cx(props.className)} />;
}

function MdxTable(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto">
      <table {...props} />
    </div>
  );
}

function MdxHr() {
  return <hr className="my-10 border-white/10" />;
}

function MdxBlockquote(props: React.BlockquoteHTMLAttributes<HTMLElement>) {
  return (
    <blockquote
      {...props}
      className={cx(
        "my-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4",
        props.className
      )}
    />
  );
}

function MdxH2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cx(
        "mt-12 border-t border-white/10 pt-8 text-3xl font-extrabold tracking-tight text-white",
        props.className
      )}
    />
  );
}

function MdxH3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cx("mt-8 text-xl font-bold text-white", props.className)}
    />
  );
}

function MdxP(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cx("text-[17px] leading-8 text-gray-300", props.className)}
    />
  );
}

function MdxUl(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={cx("my-6 space-y-3 rounded-2xl border border-gray-800 bg-white/[0.03] p-5", props.className)}
    />
  );
}

function MdxOl(props: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      {...props}
      className={cx("my-6 space-y-3 rounded-2xl border border-gray-800 bg-white/[0.03] p-5", props.className)}
    />
  );
}

function MdxLi(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} className={cx("pl-1 leading-7 text-gray-300", props.className)} />;
}

/**
 * Component map to pass into compileMDX({ components })
 */
export const mdxComponents = {
  // Custom blocks
  Callout,
  KpiGrid,
  Kpi,

  // Element overrides
  a: MdxA,
  pre: MdxPre,
  code: MdxCode,
  table: MdxTable,
  hr: MdxHr,
  blockquote: MdxBlockquote,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
};
