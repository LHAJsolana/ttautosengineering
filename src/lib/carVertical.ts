import type { Locale } from "@/lib/i18n";

export type CarVerticalUrlType = "vin" | "general";
export type CarVerticalUrlOptions = {
  type?: CarVerticalUrlType;
  vin?: string;
  source?: string;
};

const fallbackVinUrl =
  "https://www.carvertical.deal/28JBKCS/5NWWWN/?source_id=AFF&sub1=ttautosengineering";
const fallbackGeneralUrl =
  "https://www.carvertical.deal/28JBKCS/5NWWWN/?uid=40&source_id=AFF&sub1=ttautosengineering";
const sampleVin = "WAUZZZF45GA010438";

export function normalizeVin(vin?: string) {
  const normalized = vin?.trim().toUpperCase() ?? "";
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalized) ? normalized : undefined;
}

function warnMissingEnv(name: string) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[carVertical] ${name} is not configured. Using the approved fallback affiliate URL.`);
  }
}

function configuredBaseUrl(type: CarVerticalUrlType) {
  if (type === "general") {
    if (!process.env.NEXT_PUBLIC_CARVERTICAL_GENERAL_URL) warnMissingEnv("NEXT_PUBLIC_CARVERTICAL_GENERAL_URL");
    return process.env.NEXT_PUBLIC_CARVERTICAL_GENERAL_URL || fallbackGeneralUrl;
  }

  if (!process.env.NEXT_PUBLIC_CARVERTICAL_VIN_URL) warnMissingEnv("NEXT_PUBLIC_CARVERTICAL_VIN_URL");
  return process.env.NEXT_PUBLIC_CARVERTICAL_VIN_URL || fallbackVinUrl;
}

export function getCarVerticalUrl(options: CarVerticalUrlOptions = {}) {
  const type = options.type ?? "vin";
  const baseUrl = configuredBaseUrl(type);
  const normalizedVin = normalizeVin(options.vin);

  try {
    const url = new URL(baseUrl);
    const source = options.source?.trim();

    if (source) url.searchParams.set("source", source);

    // carVertical supplied a no-VIN example containing a sample VIN in sub3.
    // Keep affiliate params intact, but never send the sample VIN unless a real,
    // validated VIN is explicitly provided. Confirm with carVertical whether VIN
    // should remain in sub3 or move to a dedicated VIN parameter after approval.
    if (url.searchParams.get("sub3") === sampleVin && !normalizedVin) {
      url.searchParams.delete("sub3");
    }

    if (normalizedVin) {
      url.searchParams.set("sub3", normalizedVin);
    }

    return url.toString();
  } catch {
    return type === "general" ? fallbackGeneralUrl : fallbackVinUrl;
  }
}

type CarVerticalCopy = {
  eyebrow: string;
  title: string;
  shortTitle: string;
  metadataTitle: string;
  metadataDescription: string;
  subtitle: string;
  description: string;
  compactDescription: string;
  cta: string;
  secondaryCta: string;
  completeCta: string;
  reportCta: string;
  aria: string;
  disclosure: string;
  cards: { title: string; description: string }[];
  stepsTitle: string;
  faqTitle: string;
  steps: string[];
  facts: string[];
  faq: { question: string; answer: string }[];
};

export const carVerticalCopy: Record<Locale, CarVerticalCopy> = {
  en: {
    eyebrow: "Vehicle history",
    title: "Check a Vehicle's History Before You Buy",
    shortTitle: "Verify the history before buying",
    metadataTitle: "Vehicle History Check Before Buying a Used German Car | TT AUTO'S Engineering",
    metadataDescription:
      "Learn why checking vehicle history is one of the most important steps before buying any used German vehicle.",
    subtitle: "Avoid hidden accident damage, mileage fraud and ownership surprises.",
    description:
      "A vehicle-history report may help you compare the seller's story with mileage records, ownership data, accident signals, theft records, import/export history, and finance context.",
    compactDescription:
      "Before viewing or negotiating, a history report can provide useful context alongside a physical inspection, diagnostic scan, and service-record review.",
    cta: "Check Vehicle History",
    secondaryCta: "Verify Before Buying",
    completeCta: "Complete Your Inspection",
    reportCta: "View Vehicle History Report",
    aria: "Open carVertical vehicle history check in a new tab",
    disclosure:
      "TT AUTO'S Engineering may earn a commission if you purchase through selected partner links. This never affects our editorial independence or recommendations.",
    cards: [
      {
        title: "Mileage verification",
        description: "Compare odometer claims with available history signals before you trust the asking price.",
      },
      {
        title: "Accident history",
        description: "Check for damage records that may explain paintwork, panel gaps, steering pull, or unusual tire wear.",
      },
      {
        title: "Ownership records",
        description: "Use ownership and registration context to ask better questions before you travel to inspect.",
      },
    ],
    stepsTitle: "Use it as one layer of the inspection",
    faqTitle: "FAQ",
    steps: [
      "Run the history check before committing to a viewing or deposit.",
      "Compare the report with invoices, seller claims, and diagnostic scan data.",
      "Use any mismatch as a reason to ask for proof, negotiate, or walk away.",
    ],
    facts: [
      "Mileage fraud",
      "Hidden accident repairs",
      "Ownership history",
      "Import/export records",
      "Theft records",
      "Finance records",
    ],
    faq: [
      {
        question: "Does a vehicle-history report replace an inspection?",
        answer:
          "No. It can provide useful background, but it should be combined with a physical inspection, diagnostic scan, test drive, and service-record review.",
      },
      {
        question: "Can a clean report guarantee a perfect car?",
        answer:
          "No. A clean report is helpful context, not a guarantee. Mechanical wear, hidden repairs, poor servicing, and recent faults still need independent checks.",
      },
      {
        question: "When should I check the history?",
        answer:
          "Ideally before paying a deposit or travelling far to view the car, especially if mileage, import status, ownership, or accident history affects the price.",
      },
    ],
  },
  nl: {
    eyebrow: "Voertuighistorie",
    title: "Controleer de voertuighistorie voordat je koopt",
    shortTitle: "Verifieer de historie voor aankoop",
    metadataTitle: "Voertuighistorie controleren voor aankoop van een gebruikte Duitse auto | TT AUTO'S Engineering",
    metadataDescription:
      "Lees waarom het controleren van de voertuighistorie een belangrijke stap is voordat je een gebruikte Duitse auto koopt.",
    subtitle: "Vermijd verborgen schade, kilometerfraude en eigendomsverrassingen.",
    description:
      "Een voertuighistorierapport kan helpen om het verhaal van de verkoper te vergelijken met kilometerstanden, eigendomsgegevens, schadesignalen, diefstalregistraties, import/exporthistorie en financieringsinformatie.",
    compactDescription:
      "Voor bezichtiging of onderhandeling kan een historierapport nuttige context geven naast inspectie, diagnose en onderhoudsfacturen.",
    cta: "Controleer voertuighistorie",
    secondaryCta: "Verifieer voor aankoop",
    completeCta: "Maak je inspectie compleet",
    reportCta: "Bekijk voertuighistorierapport",
    aria: "Open carVertical voertuighistoriecontrole in een nieuw tabblad",
    disclosure:
      "TT AUTO'S Engineering kan een commissie ontvangen als je via geselecteerde partnerlinks koopt. Dit beinvloedt nooit onze redactionele onafhankelijkheid of aanbevelingen.",
    cards: [
      {
        title: "Kilometercontrole",
        description: "Vergelijk de opgegeven kilometerstand met beschikbare historiesignalen voordat je de prijs vertrouwt.",
      },
      {
        title: "Schadehistorie",
        description: "Controleer schadesignalen die lakwerk, paneelnaden, stuurtrek of vreemde bandenslijtage kunnen verklaren.",
      },
      {
        title: "Eigendomshistorie",
        description: "Gebruik registratie- en eigendomscontext om betere vragen te stellen voordat je gaat kijken.",
      },
    ],
    stepsTitle: "Gebruik het als een laag van de inspectie",
    faqTitle: "Veelgestelde vragen",
    steps: [
      "Controleer de historie voordat je een bezichtiging of aanbetaling vastlegt.",
      "Vergelijk het rapport met facturen, verkopersclaims en diagnosegegevens.",
      "Gebruik afwijkingen om bewijs te vragen, te onderhandelen of weg te lopen.",
    ],
    facts: [
      "Kilometerfraude",
      "Verborgen schadeherstel",
      "Eigendomshistorie",
      "Import/exportgegevens",
      "Diefstalregistraties",
      "Financieringsgegevens",
    ],
    faq: [
      {
        question: "Vervangt een voertuighistorierapport een inspectie?",
        answer:
          "Nee. Het kan nuttige achtergrond geven, maar combineer het met fysieke inspectie, diagnose, proefrit en onderhoudshistorie.",
      },
      {
        question: "Garandeert een schoon rapport een perfecte auto?",
        answer:
          "Nee. Een schoon rapport is context, geen garantie. Slijtage, verborgen reparaties, slecht onderhoud en recente storingen moeten nog worden gecontroleerd.",
      },
      {
        question: "Wanneer controleer ik de historie?",
        answer:
          "Bij voorkeur voordat je een aanbetaling doet of ver reist, vooral als kilometerstand, importstatus, eigendom of schadehistorie de prijs beinvloedt.",
      },
    ],
  },
  ar: {
    eyebrow: "تاريخ السيارة",
    title: "تحقق من تاريخ السيارة قبل الشراء",
    shortTitle: "تحقق من التاريخ قبل الشراء",
    metadataTitle: "فحص تاريخ السيارة قبل شراء سيارة ألمانية مستعملة | TT AUTO'S Engineering",
    metadataDescription:
      "تعرّف لماذا يعد فحص تاريخ السيارة خطوة مهمة قبل شراء أي سيارة ألمانية مستعملة.",
    subtitle: "تجنب أضرار الحوادث المخفية، والتلاعب بالعداد، ومفاجآت الملكية.",
    description:
      "قد يساعد تقرير تاريخ السيارة في مقارنة كلام البائع مع بيانات العداد، وسجل الملكية، وإشارات الحوادث، وسجلات السرقة، والاستيراد أو التصدير، والتمويل.",
    compactDescription:
      "قبل المعاينة أو التفاوض، يمكن أن يمنحك تقرير التاريخ سياقا مفيدا بجانب الفحص الفعلي، والتشخيص، ومراجعة سجل الصيانة.",
    cta: "تحقق من تاريخ السيارة",
    secondaryCta: "تحقق قبل الشراء",
    completeCta: "أكمل فحصك",
    reportCta: "عرض تقرير تاريخ السيارة",
    aria: "افتح فحص تاريخ السيارة من carVertical في تبويب جديد",
    disclosure:
      "قد تحصل TT AUTO'S Engineering على عمولة إذا اشتريت عبر روابط شركاء مختارة. هذا لا يؤثر أبدا على استقلاليتنا التحريرية أو توصياتنا.",
    cards: [
      {
        title: "التحقق من العداد",
        description: "قارن قراءة العداد المعلنة مع إشارات التاريخ المتاحة قبل الثقة بالسعر.",
      },
      {
        title: "تاريخ الحوادث",
        description: "تحقق من سجلات الضرر التي قد تفسر الطلاء، أو فراغات الألواح، أو انحراف المقود، أو تآكل الإطارات.",
      },
      {
        title: "سجل الملكية",
        description: "استخدم سياق التسجيل والملكية لطرح أسئلة أفضل قبل السفر لمعاينة السيارة.",
      },
    ],
    stepsTitle: "استخدمه كطبقة واحدة من الفحص",
    faqTitle: "الأسئلة الشائعة",
    steps: [
      "افحص التاريخ قبل الالتزام بمعاينة أو دفع عربون.",
      "قارن التقرير مع الفواتير، وكلام البائع، وبيانات التشخيص.",
      "استخدم أي اختلاف لطلب دليل، أو التفاوض، أو الانسحاب.",
    ],
    facts: [
      "تلاعب العداد",
      "إصلاحات حوادث مخفية",
      "سجل الملكية",
      "سجلات الاستيراد والتصدير",
      "سجلات السرقة",
      "سجلات التمويل",
    ],
    faq: [
      {
        question: "هل يغني تقرير تاريخ السيارة عن الفحص؟",
        answer:
          "لا. يمكن أن يوفر خلفية مفيدة، لكنه يجب أن يكون مع الفحص الفعلي، والتشخيص، وتجربة القيادة، ومراجعة سجل الصيانة.",
      },
      {
        question: "هل يضمن التقرير النظيف سيارة مثالية؟",
        answer:
          "لا. التقرير النظيف سياق مفيد وليس ضمانا. ما زالت الأعطال الحديثة، وسوء الصيانة، والتآكل، والإصلاحات المخفية تحتاج إلى فحص مستقل.",
      },
      {
        question: "متى يجب أن أتحقق من التاريخ؟",
        answer:
          "يفضل قبل دفع عربون أو السفر لمسافة بعيدة، خصوصا إذا كانت المسافة، أو الاستيراد، أو الملكية، أو الحوادث تؤثر في السعر.",
      },
    ],
  },
};

export function getCarVerticalCopy(locale: Locale) {
  return carVerticalCopy[locale];
}
