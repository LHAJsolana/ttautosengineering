export const locales = ["en", "nl", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (!isLocale(segments[1])) return pathname;
  return `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
}

export const ui = {
  en: {
    language: "Language",
    menu: "Menu",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    fallbackNotice:
      "Some technical articles are still shown in English while this translation is being prepared.",
    nav: {
      insights: "Insights",
      blog: "Blog",
      search: "Search",
      brands: "Brands",
      models: "Models",
      powertrains: "Powertrains",
      buyingHub: "Buying Hub",
      buyingGuides: "Buying Guides",
      checklist: "Checklist",
      reliability: "Reliability Index",
      tools: "Tools",
      vehicleHistory: "Vehicle History",
      about: "About",
      check: "Check",
      browseBrands: "Browse Brands",
    },
    footer: {
      description:
        "Reliability insights, buying guides, and engineering explainers for German cars, built for real ownership decisions.",
      explore: "Explore",
      company: "Company",
      trust: "Trust",
      contact: "Contact",
      disclaimer: "Disclaimer",
      privacy: "Privacy Policy",
      terms: "Terms",
      affiliate: "Affiliate Disclosure",
      rights: "All rights reserved.",
      affiliateNote:
        "TT AUTO'S Engineering may earn a commission if you purchase through selected partner links. This never affects our editorial independence or recommendations.",
      tagline: "Built for engineering-first reliability analysis and buyer guidance.",
    },
  },
  nl: {
    language: "Taal",
    menu: "Menu",
    closeMenu: "Menu sluiten",
    openMenu: "Menu openen",
    fallbackNotice:
      "Sommige technische artikelen worden nog in het Engels getoond terwijl de Nederlandse vertaling wordt voorbereid.",
    nav: {
      insights: "Inzichten",
      blog: "Blog",
      search: "Zoeken",
      brands: "Merken",
      models: "Modellen",
      powertrains: "Motoren & bakken",
      buyingHub: "Koophub",
      buyingGuides: "Koopgidsen",
      checklist: "Checklist",
      reliability: "Betrouwbaarheid",
      tools: "Tools",
      vehicleHistory: "Voertuighistorie",
      about: "Over ons",
      check: "Controleer",
      browseBrands: "Bekijk merken",
    },
    footer: {
      description:
        "Betrouwbaarheidsinzichten, koopgidsen en technische uitleg over Duitse auto's voor echte eigendomsbeslissingen.",
      explore: "Ontdekken",
      company: "Bedrijf",
      trust: "Vertrouwen",
      contact: "Contact",
      disclaimer: "Disclaimer",
      privacy: "Privacybeleid",
      terms: "Voorwaarden",
      affiliate: "Affiliateverklaring",
      rights: "Alle rechten voorbehouden.",
      affiliateNote:
        "TT AUTO'S Engineering kan een commissie ontvangen als je via geselecteerde partnerlinks koopt. Dit beinvloedt nooit onze redactionele onafhankelijkheid of aanbevelingen.",
      tagline: "Gebouwd voor technische betrouwbaarheidsanalyse en aankoopadvies.",
    },
  },
  ar: {
    language: "اللغة",
    menu: "القائمة",
    closeMenu: "إغلاق القائمة",
    openMenu: "فتح القائمة",
    fallbackNotice:
      "تُعرض بعض المقالات التقنية باللغة الإنجليزية مؤقتاً إلى حين اكتمال الترجمة العربية.",
    nav: {
      insights: "التحليلات",
      blog: "المدونة",
      search: "البحث",
      brands: "العلامات",
      models: "الموديلات",
      powertrains: "المحركات والنواقل",
      buyingHub: "مركز الشراء",
      buyingGuides: "أدلة الشراء",
      checklist: "قائمة الفحص",
      reliability: "مؤشر الاعتمادية",
      tools: "الأدوات",
      vehicleHistory: "تاريخ السيارة",
      about: "من نحن",
      check: "افحص",
      browseBrands: "تصفح العلامات",
    },
    footer: {
      description:
        "تحليلات الاعتمادية وأدلة الشراء والشروحات الهندسية للسيارات الألمانية لاتخاذ قرارات ملكية أفضل.",
      explore: "استكشف",
      company: "الشركة",
      trust: "الثقة",
      contact: "تواصل معنا",
      disclaimer: "إخلاء المسؤولية",
      privacy: "سياسة الخصوصية",
      terms: "الشروط",
      affiliate: "إفصاح الروابط التابعة",
      rights: "جميع الحقوق محفوظة.",
      affiliateNote:
        "قد تحصل TT AUTO'S Engineering على عمولة إذا اشتريت عبر روابط شركاء مختارة. هذا لا يؤثر أبدا على استقلاليتنا التحريرية أو توصياتنا.",
      tagline: "تحليل هندسي للاعتمادية وإرشادات عملية للمشترين.",
    },
  },
} as const;

export function getUi(locale: Locale) {
  return ui[locale];
}
