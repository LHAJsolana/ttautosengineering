import CarVerticalCTA from "@/components/carvertical/CarVerticalCTA";
import type { Locale } from "@/lib/i18n";
import { getCarVerticalCopy, type CarVerticalUrlType } from "@/lib/carVertical";

export default function CarVerticalInline({
  locale,
  type = "vin",
  compact = false,
}: {
  locale: Locale;
  type?: CarVerticalUrlType;
  compact?: boolean;
}) {
  const copy = getCarVerticalCopy(locale);

  return (
    <aside className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-bold text-white">{copy.shortTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            {compact ? copy.compactDescription : copy.description}
          </p>
        </div>
        <CarVerticalCTA
          locale={locale}
          type={type}
          label={compact ? copy.secondaryCta : copy.completeCta}
          className="shrink-0"
        />
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-gray-500">
        {copy.disclosure}
      </p>
    </aside>
  );
}
