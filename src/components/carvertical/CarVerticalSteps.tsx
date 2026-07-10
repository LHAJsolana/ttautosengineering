import type { Locale } from "@/lib/i18n";
import { getCarVerticalCopy } from "@/lib/carVertical";

export default function CarVerticalSteps({ locale }: { locale: Locale }) {
  const copy = getCarVerticalCopy(locale);

  return (
    <section className="rounded-3xl border border-gray-800 bg-[#111827] p-7 md:p-8">
      <h2 className="text-2xl font-bold text-white">{copy.stepsTitle}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
              {index + 1}
            </span>
            <p className="mt-4 text-sm leading-6 text-gray-300">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
