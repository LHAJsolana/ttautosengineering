import Link from "@/components/LocalizedLink";
import { localePath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    badge: "Coming Soon",
    eyebrow: "TT AUTO'S AI GARAGE",
    title: "YOUR CAR. A NEW INTELLIGENCE.",
    intro:
      "A strange noise? A warning light? Soon, you will be able to talk to your car's personal AI expert before the repair guesswork starts.",
    cta: "Discover What's Coming",
    customs: "Use the live Morocco Customs Calculator",
    status: "Private pre-launch mode",
    previews: [
      ["Voice AI", "Ask questions naturally and get structured automotive guidance."],
      ["Mechanical diagnosis", "Translate symptoms, scan codes, and service history into next checks."],
      ["Fault-code assistance", "Understand OBD codes without jumping straight to part replacement."],
      ["Photo understanding", "Preview support for visual clues such as leaks, wear, warnings, and dashboard messages."],
      ["Vehicle comparisons", "Compare ownership risk, powertrains, model years, and buyer tradeoffs."],
      ["Moroccan customs help", "Guide import questions toward the live official-source MCV calculator."],
    ],
  },
  fr: {
    badge: "Bientot disponible",
    eyebrow: "TT AUTO'S AI GARAGE",
    title: "VOTRE VOITURE. UNE NOUVELLE INTELLIGENCE.",
    intro:
      "Un bruit étrange ? Un voyant au tableau de bord ? Bientot, vous pourrez parler a l'expert IA personnel de votre voiture avant de remplacer des pieces au hasard.",
    cta: "Decouvrir ce qui arrive",
    customs: "Utiliser le calculateur de douane Maroc",
    status: "Mode pre-lancement prive",
    previews: [
      ["IA vocale", "Posez vos questions naturellement et recevez une aide automobile structuree."],
      ["Diagnostic mecanique", "Reliez symptomes, codes defaut et historique d'entretien aux bons controles."],
      ["Aide codes defaut", "Comprenez les codes OBD sans conclure trop vite a une piece defectueuse."],
      ["Analyse photo", "Apercu d'aide visuelle pour fuites, usure, voyants et messages tableau de bord."],
      ["Comparaisons vehicules", "Comparez risques, moteurs, annees-modele et compromis d'achat."],
      ["Aide douane Maroc", "Oriente les questions d'import vers le calculateur MCV officiel en direct."],
    ],
  },
  nl: {
    badge: "Binnenkort",
    eyebrow: "TT AUTO'S AI GARAGE",
    title: "JOUW AUTO. NIEUWE INTELLIGENTIE.",
    intro:
      "Een vreemd geluid? Een waarschuwingslampje? Binnenkort praat je met de persoonlijke AI-expert van je auto voordat het giswerk begint.",
    cta: "Ontdek wat eraan komt",
    customs: "Gebruik de live Marokko-douanecalculator",
    status: "Prive pre-launchmodus",
    previews: [
      ["Voice AI", "Stel vragen natuurlijk en krijg gestructureerde autotechnische begeleiding."],
      ["Mechanische diagnose", "Verbind symptomen, scan codes en onderhoudshistorie met de juiste controles."],
      ["Storingscodehulp", "Begrijp OBD-codes zonder direct onderdelen te vervangen."],
      ["Foto-inzicht", "Preview voor visuele signalen zoals lekkage, slijtage, lampjes en dashboardmeldingen."],
      ["Voertuigvergelijkingen", "Vergelijk risico, aandrijflijnen, modeljaren en aankoopkeuzes."],
      ["Marokko-importhulp", "Stuurt importvragen naar de live officiele MCV-calculator."],
    ],
  },
  ar: {
    badge: "قريبا",
    eyebrow: "TT AUTO'S AI GARAGE",
    title: "سيارتك. ذكاء جديد.",
    intro:
      "صوت غريب؟ ضوء تحذير؟ قريبا ستتمكن من التحدث مع خبير ذكاء اصطناعي خاص بسيارتك قبل البدء في التخمين.",
    cta: "اكتشف القادم",
    customs: "استخدم حاسبة جمارك المغرب المباشرة",
    status: "وضع ما قبل الإطلاق الخاص",
    previews: [
      ["ذكاء صوتي", "اسأل بشكل طبيعي واحصل على إرشاد منظم حول السيارة."],
      ["تشخيص ميكانيكي", "اربط الأعراض وأكواد الفحص وسجل الصيانة بالخطوات التالية."],
      ["مساعدة أكواد الأعطال", "افهم أكواد OBD دون القفز مباشرة إلى تغيير القطع."],
      ["فهم الصور", "معاينة لدعم الإشارات المرئية مثل التسريبات والتآكل ورسائل لوحة القيادة."],
      ["مقارنات السيارات", "قارن المخاطر والمحركات وسنوات الموديل وقرارات الشراء."],
      ["مساعدة جمارك المغرب", "توجيه أسئلة الاستيراد إلى حاسبة MCV الرسمية المباشرة."],
    ],
  },
} as const;

function Waveform() {
  return (
    <div className="flex h-24 items-center justify-center gap-1.5" aria-hidden="true">
      {[32, 48, 72, 42, 88, 58, 34, 66, 96, 52, 38, 74, 44, 60].map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-2 rounded-full bg-gradient-to-t from-red-600 via-red-300 to-white/80 shadow-[0_0_18px_rgba(239,68,68,0.35)]"
          style={{ height }}
        />
      ))}
    </div>
  );
}

export default function AIGarageComingSoon({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#090f1a] shadow-2xl shadow-black/30">
        <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10">
          <div>
            <span className="inline-flex rounded-full border border-red-400/35 bg-red-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-red-100">
              {t.badge}
            </span>
            <p className="mt-7 text-sm font-bold uppercase tracking-[0.28em] text-gray-400">{t.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">{t.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ai-garage-preview"
                className="inline-flex min-h-12 items-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300/40"
              >
                {t.cta}
              </a>
              <Link
                href={localePath(locale, "/morocco-customs")}
                className="inline-flex min-h-12 items-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-gray-100 transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-red-300/30"
              >
                {t.customs}
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-red-400/20 bg-gradient-to-b from-red-500/10 to-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-white">Voice interface</div>
              <div className="rounded-full border border-red-300/30 bg-red-500/15 px-3 py-1 text-xs font-bold text-red-100">
                {t.status}
              </div>
            </div>
            <Waveform />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-300/40 bg-red-500/15 text-2xl text-red-100 shadow-[0_0_45px_rgba(239,68,68,0.22)]">
              <span className="text-[10px] font-black tracking-[0.22em]" aria-hidden="true">MIC</span>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-garage-preview" className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {t.previews.map(([title, body]) => (
          <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="mb-5 h-1.5 w-16 rounded-full bg-red-500" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
