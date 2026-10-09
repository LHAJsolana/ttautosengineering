import type { Metadata } from "next";
import ToolPageHero from "@/components/ToolPageHero";
import MoroccoCustomsCalculator from "@/components/MoroccoCustomsCalculator.client";
import { JsonLd } from "@/components/JsonLd";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { canonical, localizedPageMetadata } from "@/lib/site";

const PATH = "/morocco-customs";

const copy = {
  en: {
    title: "Moroccan Vehicle Customs Calculator",
    description:
      "Calculate Moroccan vehicle import duties using live information from the official MCV simulator.",
    eyebrow: "Live MCV tool",
    noteTitle: "Official-source calculation",
    note:
      "This tool operates the Moroccan Customs MCV simulator in a server-side browser session. It does not use stored customs amounts or local valuation tables.",
  },
  fr: {
    title: "Calculateur de douane automobile Maroc",
    description:
      "Calculez les droits d'importation d'un vehicule au Maroc avec les informations en direct du simulateur officiel MCV.",
    eyebrow: "Outil MCV en direct",
    noteTitle: "Calcul depuis la source officielle",
    note:
      "Cet outil pilote le simulateur MCV des Douanes marocaines dans une session navigateur cote serveur. Il n'utilise pas de montants stockes ni de bareme local.",
  },
  nl: {
    title: "Marokkaanse voertuig-douanecalculator",
    description:
      "Bereken Marokkaanse invoerrechten voor voertuigen met live informatie uit de officiele MCV-simulator.",
    eyebrow: "Live MCV-tool",
    noteTitle: "Berekening uit officiele bron",
    note:
      "Deze tool bedient de Marokkaanse MCV-simulator in een server-side browsersessie. Er worden geen opgeslagen bedragen of lokale waardetabellen gebruikt.",
  },
  ar: {
    title: "حاسبة جمارك السيارات في المغرب",
    description:
      "احسب رسوم استيراد السيارات في المغرب باستخدام بيانات مباشرة من محاكي MCV الرسمي.",
    eyebrow: "أداة MCV مباشرة",
    noteTitle: "حساب من المصدر الرسمي",
    note:
      "تستخدم هذه الأداة محاكي الجمارك المغربي MCV عبر جلسة متصفح على الخادم. لا تعتمد على مبالغ مخزنة أو جداول محلية.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const t = copy[locale];
  return localizedPageMetadata({
    locale,
    pathname: PATH,
    title: t.title,
    description: t.description,
  });
}

export default async function MoroccoCustomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const t = copy[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: canonical(PATH, locale),
    description: t.description,
    provider: {
      "@type": "Organization",
      name: "TT AUTO'S Engineering",
    },
    isAccessibleForFree: true,
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <JsonLd data={jsonLd} />
      <ToolPageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        links={[{ label: "Official MCV", href: "https://www.douane.gov.ma/mcv/#/view?pageId=2" }]}
      />

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
        <p className="text-sm font-semibold text-red-300">{t.noteTitle}</p>
        <p className="mt-2 max-w-4xl leading-7 text-gray-300">{t.note}</p>
      </section>

      <section className="mt-8">
        <MoroccoCustomsCalculator locale={locale} />
      </section>
    </main>
  );
}

