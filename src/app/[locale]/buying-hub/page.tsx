import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import CarVerticalInline from "@/components/carvertical/CarVerticalInline";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { canonical, localizedPageMetadata, SITE_URL } from "@/lib/site";
import { faultCodes } from "@/lib/faultCodes";
import { modelPages } from "@/lib/models";
import { modelYears } from "@/lib/modelYears";
import { directComparisons } from "@/lib/comparisons";

const PATH = "/buying-hub";
const SITE_NAME = "TT AUTO'S Engineering";

const copy = {
  en: {
    title: "Used German Car Buying Hub",
    metadataTitle: "Used German Car Buying Hub | TT AUTO'S Engineering",
    description:
      "Start here before buying a used BMW, Mercedes-Benz, Audi, Volkswagen, Porsche, MINI, Skoda, or SEAT. Check history, reliability, fault codes, maintenance costs, and model risk in one buyer workflow.",
    eyebrow: "Buyer workflow",
    intro:
      "A clean advert is not enough. Use this hub to move from first interest to final inspection with the right checks in the right order.",
    primaryCta: "Start with the checklist",
    secondaryCta: "Compare models",
    quickTitle: "What are you checking today?",
    workflowTitle: "A safer buying sequence",
    workflowIntro:
      "Use the tools together. A history report, scan result, physical inspection, and service evidence are strongest when they agree with each other.",
    routes: [
      {
        title: "I found a car online",
        body: "Shortlist the model, year, engine, gearbox, mileage, and seller story before visiting.",
        href: "/buying-checklist",
        label: "Open checklist",
      },
      {
        title: "I want to verify the history",
        body: "Review mileage, accident signals, ownership records, import/export context, and other available records.",
        href: "/vehicle-history",
        label: "Check history",
      },
      {
        title: "I have a warning light or scan code",
        body: "Decode the fault, understand likely causes, and decide whether it changes the buying risk.",
        href: "/fault-codes",
        label: "Decode fault codes",
      },
      {
        title: "I am choosing between models",
        body: "Compare reliability risks, known failure patterns, ownership costs, and inspection priorities.",
        href: "/compare",
        label: "Compare cars",
      },
    ],
    steps: [
      {
        number: "01",
        title: "Shortlist the right car",
        body: "Start with the model guide, model-year data, and reliability index. Avoid cars where the engine, gearbox, mileage, and price do not make sense together.",
        href: "/models",
      },
      {
        number: "02",
        title: "Check the story",
        body: "Ask for service records, invoices, MOT or inspection history, VIN details, and ownership context. Gaps are not always fatal, but they should change the price or the decision.",
        href: "/vehicle-history",
      },
      {
        number: "03",
        title: "Scan and inspect",
        body: "Read all modules, not only generic engine codes. Compare freeze-frame data, warning lights, service evidence, tyres, brakes, leaks, and test-drive behaviour.",
        href: "/fault-codes",
      },
      {
        number: "04",
        title: "Price the risk",
        body: "Use the maintenance calculator and known failure map to estimate what the car may need next. A cheap German car can become expensive quickly if ignored faults are already visible.",
        href: "/maintenance-cost",
      },
    ],
    signalsTitle: "Strong buying signals",
    riskTitle: "Walk-away signals",
    signals: [
      "Cold start matches the seller's claims",
      "Service records match mileage and age",
      "No unresolved high-severity fault codes",
      "Gearbox shifts consistently hot and cold",
      "History report supports the ownership story",
      "Price reflects known model-year risks",
    ],
    risks: [
      "Seller blocks diagnostics or inspection",
      "Freshly cleared codes without explanation",
      "Mileage story conflicts with records",
      "Repeated overheating, DPF, timing, or gearbox faults",
      "Oil leaks hidden by recent cleaning",
      "Pressure to buy before checks are complete",
    ],
    stats: {
      faultCodes: "fault codes covered",
      models: "model guides",
      years: "model-year checks",
      comparisons: "comparisons",
    },
    finalTitle: "Complete the checks before you buy",
    finalBody:
      "Use the hub as a decision filter. If the advert, history, scan data, inspection, and test drive do not line up, slow down or walk away.",
  },
  nl: {
    title: "Koophub voor gebruikte Duitse auto's",
    metadataTitle: "Koophub voor gebruikte Duitse auto's | TT AUTO'S Engineering",
    description:
      "Begin hier voordat je een gebruikte BMW, Mercedes-Benz, Audi, Volkswagen, Porsche, MINI, Skoda of SEAT koopt. Controleer historie, betrouwbaarheid, foutcodes, onderhoudskosten en modelrisico in één aankoopproces.",
    eyebrow: "Aankoopproces",
    intro:
      "Een nette advertentie is niet genoeg. Gebruik deze hub om van eerste interesse naar eindinspectie te gaan met de juiste controles in de juiste volgorde.",
    primaryCta: "Start met de checklist",
    secondaryCta: "Vergelijk modellen",
    quickTitle: "Wat wil je vandaag controleren?",
    workflowTitle: "Een veiliger aankoopproces",
    workflowIntro:
      "Gebruik de tools samen. Een historierapport, scanresultaat, fysieke inspectie en onderhoudsbewijs zijn het sterkst wanneer ze hetzelfde verhaal vertellen.",
    routes: [
      {
        title: "Ik heb online een auto gevonden",
        body: "Noteer model, bouwjaar, motor, versnellingsbak, kilometerstand en het verhaal van de verkoper voordat je gaat kijken.",
        href: "/buying-checklist",
        label: "Open checklist",
      },
      {
        title: "Ik wil de historie controleren",
        body: "Bekijk kilometerstand, schadesignalen, eigendomsgegevens, import/exportcontext en andere beschikbare gegevens.",
        href: "/vehicle-history",
        label: "Controleer historie",
      },
      {
        title: "Ik heb een storingslampje of foutcode",
        body: "Decodeer de fout, begrijp waarschijnlijke oorzaken en bepaal of dit het aankooprisico verandert.",
        href: "/fault-codes",
        label: "Decodeer foutcodes",
      },
      {
        title: "Ik twijfel tussen modellen",
        body: "Vergelijk betrouwbaarheidsrisico's, bekende zwakke punten, eigendomskosten en inspectiepunten.",
        href: "/compare",
        label: "Vergelijk auto's",
      },
    ],
    steps: [
      {
        number: "01",
        title: "Kies de juiste auto",
        body: "Begin met de modelgids, bouwjaarinfo en betrouwbaarheidsindex. Vermijd auto's waarbij motor, bak, kilometerstand en prijs niet logisch samenkomen.",
        href: "/models",
      },
      {
        number: "02",
        title: "Controleer het verhaal",
        body: "Vraag naar onderhoudsboekjes, facturen, keuringen, VIN-gegevens en eigendomshistorie. Gaten zijn niet altijd fataal, maar ze moeten de prijs of beslissing beïnvloeden.",
        href: "/vehicle-history",
      },
      {
        number: "03",
        title: "Scan en inspecteer",
        body: "Lees alle modules uit, niet alleen generieke motorcodes. Vergelijk freeze-frame data, lampjes, onderhoudsbewijs, banden, remmen, lekkages en proefritgedrag.",
        href: "/fault-codes",
      },
      {
        number: "04",
        title: "Prijs het risico",
        body: "Gebruik de onderhoudscalculator en failure map om in te schatten wat de auto binnenkort kan nodig hebben. Een goedkope Duitse auto kan snel duur worden.",
        href: "/maintenance-cost",
      },
    ],
    signalsTitle: "Sterke koopsignalen",
    riskTitle: "Signalen om weg te lopen",
    signals: [
      "Koude start past bij het verhaal van de verkoper",
      "Onderhoudsbewijs past bij kilometerstand en leeftijd",
      "Geen onopgeloste foutcodes met hoge ernst",
      "Versnellingsbak schakelt consistent warm en koud",
      "Historierapport ondersteunt het eigendomsverhaal",
      "Prijs houdt rekening met bekende bouwjaarrisico's",
    ],
    risks: [
      "Verkoper weigert diagnose of inspectie",
      "Recent gewiste codes zonder uitleg",
      "Kilometerstand botst met beschikbare records",
      "Herhaalde oververhitting, DPF-, timing- of bakfouten",
      "Olielekkages verborgen door recente reiniging",
      "Druk om te kopen voordat controles klaar zijn",
    ],
    stats: {
      faultCodes: "foutcodes behandeld",
      models: "modelgidsen",
      years: "bouwjaarchecks",
      comparisons: "vergelijkingen",
    },
    finalTitle: "Rond de controles af voordat je koopt",
    finalBody:
      "Gebruik de hub als beslisfilter. Als advertentie, historie, scandata, inspectie en proefrit niet overeenkomen, vertraag of loop weg.",
  },
  ar: {
    title: "مركز شراء السيارات الألمانية المستعملة",
    metadataTitle: "مركز شراء السيارات الألمانية المستعملة | TT AUTO'S Engineering",
    description:
      "ابدأ من هنا قبل شراء BMW أو Mercedes-Benz أو Audi أو Volkswagen مستعملة. افحص التاريخ، الاعتمادية، أكواد الأعطال، تكاليف الصيانة ومخاطر الموديل في مسار واحد.",
    eyebrow: "مسار المشتري",
    intro:
      "الإعلان الجميل لا يكفي. استخدم هذا المركز للانتقال من الاهتمام الأول إلى الفحص النهائي بترتيب واضح.",
    primaryCta: "ابدأ بقائمة الفحص",
    secondaryCta: "قارن الموديلات",
    quickTitle: "ماذا تريد أن تفحص اليوم؟",
    workflowTitle: "تسلسل شراء أكثر أماناً",
    workflowIntro:
      "استخدم الأدوات معاً. تقرير التاريخ، نتيجة الفحص، المعاينة الفعلية وسجلات الصيانة تكون أقوى عندما تحكي القصة نفسها.",
    routes: [
      {
        title: "وجدت سيارة على الإنترنت",
        body: "حدد الموديل، السنة، المحرك، ناقل الحركة، الكيلومترات وقصة البائع قبل الزيارة.",
        href: "/buying-checklist",
        label: "افتح قائمة الفحص",
      },
      {
        title: "أريد التحقق من تاريخ السيارة",
        body: "راجع الكيلومترات، إشارات الحوادث، سجلات الملكية، الاستيراد والتصدير والبيانات المتاحة.",
        href: "/vehicle-history",
        label: "افحص التاريخ",
      },
      {
        title: "لدي لمبة تحذير أو كود عطل",
        body: "افهم الكود، الأسباب المحتملة، وهل يغير ذلك مخاطر الشراء.",
        href: "/fault-codes",
        label: "فسر الأكواد",
      },
      {
        title: "أقارن بين سيارات",
        body: "قارن مخاطر الاعتمادية، الأعطال المعروفة، تكاليف الملكية وأولويات الفحص.",
        href: "/compare",
        label: "قارن السيارات",
      },
    ],
    steps: [
      {
        number: "01",
        title: "اختر السيارة المناسبة",
        body: "ابدأ بدليل الموديل، بيانات السنة ومؤشر الاعتمادية. تجنب سيارة لا يتوافق فيها المحرك، الجير، الكيلومترات والسعر.",
        href: "/models",
      },
      {
        number: "02",
        title: "تحقق من القصة",
        body: "اطلب سجلات الصيانة، الفواتير، الفحوصات، بيانات VIN وسياق الملكية. الفجوات ليست دائماً قاتلة، لكنها يجب أن تؤثر على السعر أو القرار.",
        href: "/vehicle-history",
      },
      {
        number: "03",
        title: "افحص بالكمبيوتر وعاين",
        body: "اقرأ كل الوحدات وليس أكواد المحرك العامة فقط. قارن البيانات، اللمبات، الصيانة، الإطارات، الفرامل، التسريبات وسلوك التجربة.",
        href: "/fault-codes",
      },
      {
        number: "04",
        title: "قدّر المخاطر",
        body: "استخدم حاسبة الصيانة وخريطة الأعطال لتقدير ما قد تحتاجه السيارة لاحقاً. السيارة الألمانية الرخيصة قد تصبح مكلفة بسرعة.",
        href: "/maintenance-cost",
      },
    ],
    signalsTitle: "إشارات شراء جيدة",
    riskTitle: "إشارات للانسحاب",
    signals: [
      "التشغيل البارد يطابق كلام البائع",
      "سجلات الصيانة تناسب العمر والكيلومترات",
      "لا توجد أكواد خطيرة غير محلولة",
      "ناقل الحركة يعمل بثبات بارداً وساخناً",
      "تقرير التاريخ يدعم قصة الملكية",
      "السعر يعكس مخاطر سنة الموديل",
    ],
    risks: [
      "البائع يرفض الفحص أو التشخيص",
      "أكواد ممسوحة حديثاً بلا تفسير",
      "قصة الكيلومترات تخالف السجلات",
      "أعطال متكررة في الحرارة أو DPF أو التوقيت أو الجير",
      "تسريبات زيت مخفية بتنظيف حديث",
      "ضغط للشراء قبل اكتمال الفحوصات",
    ],
    stats: {
      faultCodes: "كود عطل مغطى",
      models: "دليل موديل",
      years: "فحص سنة موديل",
      comparisons: "مقارنة",
    },
    finalTitle: "أكمل الفحوصات قبل الشراء",
    finalBody:
      "استخدم هذا المركز كفلتر قرار. إذا لم تتطابق الإعلانات والتاريخ وبيانات الفحص والمعاينة والتجربة، تمهل أو انسحب.",
  },
} satisfies Record<Locale, {
  title: string;
  metadataTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  quickTitle: string;
  workflowTitle: string;
  workflowIntro: string;
  routes: Array<{ title: string; body: string; href: string; label: string }>;
  steps: Array<{ number: string; title: string; body: string; href: string }>;
  signalsTitle: string;
  riskTitle: string;
  signals: string[];
  risks: string[];
  stats: { faultCodes: string; models: string; years: string; comparisons: string };
  finalTitle: string;
  finalBody: string;
}>;

function getCopy(locale: Locale) {
  return copy[locale];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const page = getCopy(locale);
  return localizedPageMetadata({
    locale,
    pathname: PATH,
    title: page.metadataTitle,
    description: page.description,
  });
}

function Arrow() {
  return (
    <span data-directional-icon className="text-red-300 transition group-hover:translate-x-1">
      -&gt;
    </span>
  );
}

export default async function BuyingHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const page = getCopy(locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/", locale) },
      { "@type": "ListItem", position: 2, name: page.title, item: canonical(PATH, locale) },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.metadataTitle,
    description: page.description,
    url: canonical(PATH, locale),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-transparent.png` },
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.workflowTitle,
    itemListElement: page.steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.title,
      url: canonical(step.href, locale),
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 text-white md:py-16">
      <JsonLd data={[breadcrumbJsonLd, collectionJsonLd, itemListJsonLd]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title }]} />

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-2xl shadow-black/25">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(239,68,68,0.2),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(148,163,184,0.12),transparent_26%),linear-gradient(135deg,#111827,#050914)]" />
          <div className="relative grid gap-8 p-7 md:grid-cols-[1.15fr_0.85fr] md:p-10 lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-300">
                {page.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                {page.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300 md:text-lg">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/buying-checklist"
                  className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-500"
                >
                  {page.primaryCta}
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-gray-100 transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
                >
                  {page.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="grid content-start gap-3 rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-3xl font-black text-white">{faultCodes.length}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-400">{page.stats.faultCodes}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-3xl font-black text-white">{modelPages.length}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-400">{page.stats.models}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-3xl font-black text-white">{modelYears.length}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-400">{page.stats.years}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-3xl font-black text-white">{directComparisons.length}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-400">{page.stats.comparisons}</div>
                </div>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                {page.workflowIntro}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-black text-white">{page.quickTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {page.routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-white/[0.05]"
            >
              <h3 className="text-xl font-bold text-white">{route.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">{route.body}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                {route.label}
                <Arrow />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-6 md:p-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-white">{page.workflowTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-gray-400">{page.workflowIntro}</p>
        </div>
        <div className="mt-7 grid gap-4">
          {page.steps.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="group grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-red-500/35 hover:bg-white/[0.07] md:grid-cols-[80px_1fr_auto] md:items-center"
            >
              <div className="font-mono text-2xl font-black text-red-300">{step.number}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-400">{step.body}</p>
              </div>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 md:p-7">
          <h2 className="text-2xl font-black text-white">{page.signalsTitle}</h2>
          <ul className="mt-5 space-y-3">
            {page.signals.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-gray-300">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-red-500/25 bg-red-500/[0.07] p-6 md:p-7">
          <h2 className="text-2xl font-black text-white">{page.riskTitle}</h2>
          <ul className="mt-5 space-y-3">
            {page.risks.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-gray-300">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-8">
        <CarVerticalInline locale={locale} />
      </div>

      <section className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-7 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
          TT AUTO&apos;S Engineering
        </p>
        <h2 className="mt-3 text-3xl font-black text-white">{page.finalTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">{page.finalBody}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/buying-checklist"
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            {page.primaryCta}
          </Link>
          <Link
            href="/vehicle-history"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
          >
            {page.routes[1].label}
          </Link>
        </div>
      </section>
    </main>
  );
}
