import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm text-gray-300/90"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, idx) => {
          const last = idx === items.length - 1;

          return (
            <li key={`${c.label}-${idx}`} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="rounded-lg px-2 py-1 text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={[
                    "px-2 py-1 rounded-lg",
                    last
                      ? "text-white bg-white/5 border border-white/10"
                      : "text-gray-300",
                  ].join(" ")}
                >
                  {c.label}
                </span>
              )}

              {!last && <span className="text-white/20">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}