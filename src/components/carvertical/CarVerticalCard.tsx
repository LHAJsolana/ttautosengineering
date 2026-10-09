import CarVerticalCTA from "@/components/carvertical/CarVerticalCTA";
import type { Locale } from "@/lib/i18n";
import { getCarVerticalCopy, type CarVerticalUrlType } from "@/lib/carVertical";

export default function CarVerticalCard({
  locale,
  type = "general",
  compact = false,
}: {
  locale: Locale;
  type?: CarVerticalUrlType;
  compact?: boolean;
}) {
  const copy = getCarVerticalCopy(locale);

  return (
    <aside className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#111827] via-[#0f1726] to-[#0B1220] p-6 shadow-xl shadow-black/15">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-black text-white">
        {compact ? copy.shortTitle : copy.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-300">
        {compact ? copy.compactDescription : copy.description}
      </p>
      {!compact ? (
        <div className="mt-5 grid gap-3">
          {copy.cards.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-bold text-white">{item.title}</div>
              <p className="mt-1 text-xs leading-5 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}
      <CarVerticalCTA
        locale={locale}
        type={type}
        label={compact ? copy.reportCta : copy.cta}
        className="mt-5 w-full"
      />
      <p className="mt-4 text-xs leading-5 text-gray-500">{copy.disclosure}</p>
    </aside>
  );
}
