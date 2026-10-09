import type { Locale } from "@/lib/i18n";
import { getCarVerticalCopy, getCarVerticalUrl, type CarVerticalUrlType } from "@/lib/carVertical";

type Tone = "primary" | "secondary";

export default function CarVerticalCTA({
  locale,
  type = "vin",
  vin,
  source,
  label,
  tone = "primary",
  className = "",
}: {
  locale: Locale;
  type?: CarVerticalUrlType;
  vin?: string;
  source?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}) {
  const copy = getCarVerticalCopy(locale);
  const toneClass =
    tone === "primary"
      ? "bg-red-600 text-white shadow-lg shadow-red-950/25 hover:bg-red-500"
      : "border border-white/10 bg-white/[0.06] text-gray-100 hover:bg-white/[0.1]";

  return (
    <a
      href={getCarVerticalUrl({ type, vin, source })}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={copy.aria}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${toneClass} ${className}`}
    >
      {label ?? copy.cta}
    </a>
  );
}
