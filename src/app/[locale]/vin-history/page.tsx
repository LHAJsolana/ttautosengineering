import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import LeadCaptureCTA from "@/components/LeadCaptureCTA.client";
import VinHistoryCTA from "@/components/VinHistoryCTA.client";
import { defaultLocale, isLocale, localePath, type Locale } from "@/lib/i18n";
import { localizedPageMetadata, SITE_URL } from "@/lib/site";

const SITE_NAME = "TT AUTO'S Engineering";

const copy = {
  en: {
    eyebrow: "Vehicle history + engineering context",
    title: "Check the VIN. Then check the car's real mechanical risk.",
    intro: "A vehicle-history report can reveal recorded events. TT AUTO'S Engineering helps you interpret what the model, engine, mileage, symptoms, and seller evidence mean before you buy.",
    input: { label: "Vehicle identification number (VIN)", placeholder: "17-character VIN", help: "Your VIN stays in this browser and is not sent to TT AUTO'S Engineering. You will enter it again on the provider's website.", invalid: "Enter a valid 17-character VIN without I, O, or Q.", button: "Continue to carVertical", disclosure: "Third-party service. We may earn a commission if you purchase through our referral link, at no additional cost to you." },
    reportTitle: "What a history report may help you verify",
    reportItems: ["Recorded mileage and possible inconsistencies", "Reported damage, theft, registration, or import events", "Available specifications, usage records, and historical photos"],
    engineeringTitle: "What the history report cannot replace",
    engineeringItems: ["Cold-start, diagnostic scan, leak, and gearbox checks", "Engine-family and platform-specific failure patterns", "Service-document quality and evidence-based repair budgeting"],
    steps: ["Check the VIN history", "Inspect and scan the car", "Send us the findings for an engineering risk review"],
    disclosure: "carVertical is an independent third-party provider. Data availability varies by VIN, country, and source. A clean report is not proof that a vehicle is fault-free.",
    affiliate: "Read our affiliate disclosure",
  },
  nl: {
    eyebrow: "Voertuighistorie + technische context",
    title: "Controleer het VIN. Beoordeel daarna het echte mechanische risico.",
    intro: "Een voertuighistorierapport kan geregistreerde gebeurtenissen tonen. TT AUTO'S Engineering helpt je begrijpen wat model, motor, kilometerstand, symptomen en bewijs van de verkoper betekenen vóór aankoop.",
    input: { label: "Voertuigidentificatienummer (VIN)", placeholder: "VIN van 17 tekens", help: "Je VIN blijft in deze browser en wordt niet naar TT AUTO'S Engineering gestuurd. Je voert het opnieuw in op de website van de aanbieder.", invalid: "Voer een geldig VIN van 17 tekens in zonder I, O of Q.", button: "Ga verder naar carVertical", disclosure: "Externe dienst. We kunnen een commissie ontvangen bij aankoop via onze verwijzingslink, zonder extra kosten voor jou." },
    reportTitle: "Wat een historierapport kan helpen controleren",
    reportItems: ["Geregistreerde kilometerstanden en mogelijke afwijkingen", "Gemelde schade-, diefstal-, registratie- of importgebeurtenissen", "Beschikbare specificaties, gebruiksgegevens en historische foto's"],
    engineeringTitle: "Wat een historierapport niet vervangt",
    engineeringItems: ["Koude start, diagnose, lekkage- en versnellingsbakcontrole", "Motor- en platformspecifieke faalpatronen", "Kwaliteit van onderhoudsbewijs en realistische reparatiebegroting"],
    steps: ["Controleer de VIN-historie", "Inspecteer en scan de auto", "Stuur ons de bevindingen voor een technische risicoanalyse"],
    disclosure: "carVertical is een onafhankelijke externe aanbieder. Databeschikbaarheid verschilt per VIN, land en bron. Een schoon rapport bewijst niet dat een auto foutloos is.",
    affiliate: "Lees onze affiliateverklaring",
  },
  ar: {
    eyebrow: "تاريخ السيارة + السياق الهندسي",
    title: "تحقق من رقم الهيكل، ثم قيّم المخاطر الميكانيكية الحقيقية.",
    intro: "قد يكشف تقرير تاريخ السيارة أحداثاً مسجلة. تساعدك TT AUTO'S Engineering على فهم معنى الموديل والمحرك والمسافة والأعراض وأدلة البائع قبل الشراء.",
    input: { label: "رقم تعريف السيارة (VIN)", placeholder: "رقم هيكل من 17 خانة", help: "يبقى رقم الهيكل داخل متصفحك ولا يُرسل إلى TT AUTO'S Engineering. ستدخله مرة أخرى في موقع مزود الخدمة.", invalid: "أدخل رقم هيكل صحيحاً من 17 خانة من دون I أو O أو Q.", button: "المتابعة إلى carVertical", disclosure: "خدمة من طرف ثالث. قد نحصل على عمولة عند الشراء عبر رابط الإحالة من دون تكلفة إضافية عليك." },
    reportTitle: "ما الذي قد يساعد تقرير التاريخ في التحقق منه",
    reportItems: ["قراءات المسافة المسجلة والتناقضات المحتملة", "حوادث الضرر أو السرقة أو التسجيل أو الاستيراد المبلغ عنها", "المواصفات وسجلات الاستخدام والصور التاريخية المتاحة"],
    engineeringTitle: "ما الذي لا يعوضه تقرير التاريخ",
    engineeringItems: ["فحص التشغيل البارد والتشخيص والتسريبات وناقل الحركة", "أنماط الأعطال الخاصة بالمحرك والمنصة", "جودة وثائق الصيانة وتقدير ميزانية الإصلاح بالأدلة"],
    steps: ["تحقق من تاريخ رقم الهيكل", "افحص السيارة واقرأ الأعطال", "أرسل النتائج إلينا لمراجعة المخاطر هندسياً"],
    disclosure: "carVertical مزود مستقل من طرف ثالث. يختلف توفر البيانات حسب رقم الهيكل والبلد والمصدر. التقرير النظيف لا يثبت أن السيارة خالية من الأعطال.",
    affiliate: "اقرأ إفصاح الروابط التابعة",
  },
} as const;

const PATH = "/vin-history";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  return localizedPageMetadata({ locale, pathname: PATH, title: copy[locale].title, description: copy[locale].intro });
}

export default async function VinHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;
  const t = copy[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.title,
    description: t.intro,
    url: `${SITE_URL}${localePath(locale, PATH)}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-red-950/45 via-[#111827] to-[#0b1220] p-7 md:p-12">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-600/15 blur-3xl" />
        <div className="relative grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-red-300">{t.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">{t.intro}</p>
          </div>
          <VinHistoryCTA copy={t.input} locale={locale} />
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {[[t.reportTitle, t.reportItems], [t.engineeringTitle, t.engineeringItems]].map(([title, items]) => (
          <article key={title as string} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <ul className="mt-5 grid gap-4 text-sm leading-6 text-gray-300">
              {(items as readonly string[]).map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />{item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-white/10 bg-[#111827] p-7 md:p-9">
        <div className="grid gap-4 md:grid-cols-3">
          {t.steps.map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-black/15 p-5"><span className="font-mono text-xs font-bold text-red-300">0{index + 1}</span><p className="mt-3 font-bold text-white">{step}</p></div>)}
        </div>
        <p className="mt-6 text-xs leading-6 text-gray-500">{t.disclosure}</p>
        <Link href="/affiliate-disclosure" className="mt-3 inline-flex text-sm font-semibold text-red-300 underline hover:text-red-200">{t.affiliate}</Link>
      </section>

      <LeadCaptureCTA source="vin-history" className="mt-10" />
    </main>
  );
}
