import CarVerticalCTA from "@/components/carvertical/CarVerticalCTA";
import type { Locale } from "@/lib/i18n";
import { getCarVerticalCopy } from "@/lib/carVertical";

export default function CarVerticalBanner({ locale }: { locale: Locale }) {
  const copy = getCarVerticalCopy(locale);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-12">
      <div className="rounded-3xl border border-white/10 bg-[#111827] p-7 shadow-2xl shadow-black/20 md:p-8">
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-red-300">{copy.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">{copy.subtitle}</p>
            <div className="mt-6">
              <CarVerticalCTA locale={locale} />
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-5 text-gray-500">{copy.disclosure}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
            {copy.cards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />
                  <h3 className="font-bold text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
