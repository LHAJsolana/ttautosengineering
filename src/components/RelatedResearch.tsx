import Link from "@/components/LocalizedLink";

export type ResearchLink = {
  label: string;
  href: string;
  note?: string;
  badge?: string;
};

type RelatedResearchProps = {
  title?: string;
  description?: string;
  items: ResearchLink[];
  className?: string;
};

export default function RelatedResearch({
  title = "Continue your research",
  description = "Move from brand context to exact model, powertrain, fault-code, and buying-checklist evidence.",
  items,
  className = "",
}: RelatedResearchProps) {
  const visibleItems = items.filter((item, index, array) => {
    return item.href && array.findIndex((candidate) => candidate.href === item.href) === index;
  });

  if (visibleItems.length === 0) return null;

  return (
    <section className={["rounded-3xl border border-gray-800 bg-[#111827] p-6 md:p-7", className].join(" ")}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-300">Related research</p>
          <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">{description}</p>
        </div>
        <Link
          href="/buying-checklist"
          className="inline-flex w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10"
        >
          Used-car checklist
        </Link>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-red-500 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold leading-snug text-white">{item.label}</h3>
              {item.badge ? (
                <span className="shrink-0 rounded-full border border-gray-700 px-2 py-1 text-[11px] text-gray-300">
                  {item.badge}
                </span>
              ) : null}
            </div>
            {item.note ? (
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.note}</p>
            ) : null}
            <div className="mt-4 text-sm font-semibold text-gray-300 group-hover:text-white">
              Open -&gt;
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
