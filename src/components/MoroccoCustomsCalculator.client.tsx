"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { McvApiResult, McvBeneficiaryType, McvOption } from "@/lib/mcv/types";

type FormState = {
  manufacturer: string;
  model: string;
  vehicleType: string;
  firstRegistrationDate: string;
  beneficiaryType: McvBeneficiaryType;
};

type Copy = {
  fields: Record<keyof FormState, string>;
  placeholders: Pick<FormState, "manufacturer" | "model" | "vehicleType" | "firstRegistrationDate">;
  beneficiary: Record<McvBeneficiaryType, string>;
  steps: [string, string, string];
  introTitle: string;
  introBody: string;
  officialOptions: string;
  loadOptions: string;
  loadingOptions: string;
  noOptions: string;
  selectOfficial: string;
  next: string;
  back: string;
  calculate: string;
  calculating: string;
  retry: string;
  startAnother: string;
  editDetails: string;
  results: string;
  total: string;
  source: string;
  calculatedAt: string;
  breakdown: string;
  selectedVehicle: string;
  warnings: string;
  copySummary: string;
  copied: string;
  printSummary: string;
  validationTitle: string;
  required: string;
  ambiguity: string;
  errorTitle: string;
  disclaimer: string;
  helper: Record<
    "nature" | "genre" | "manufacturer" | "model" | "vehicleType" | "firstRegistrationDate" | "beneficiaryType",
    string
  >;
};

const copy: Record<Locale, Copy> = {
  en: {
    fields: {
      manufacturer: "Manufacturer",
      model: "Official model",
      vehicleType: "Official vehicle type / code",
      firstRegistrationDate: "First registration date",
      beneficiaryType: "Beneficiary category",
    },
    placeholders: {
      manufacturer: "MERCEDES",
      model: "C 220D /AMG LINE/ 4MATIC (TYPE AF)",
      vehicleType: "AF0EB",
      firstRegistrationDate: "DD/MM/YYYY",
    },
    beneficiary: {
      AUTRE: "Common law customs clearance",
      MRE: "MRE aged 60+",
      MRED: "MRE returning definitively to Morocco",
      PBS: "Person with specific needs",
    },
    steps: ["Select vehicle", "Confirm details", "Official result"],
    introTitle: "Guided official-source simulation",
    introBody:
      "Use official MCV labels where possible. The calculator never stores or invents customs values.",
    officialOptions: "Official MCV options",
    loadOptions: "Load official MCV options",
    loadingOptions: "Loading official options...",
    noOptions: "No official option matched this search. Try the exact MCV wording.",
    selectOfficial: "Use official option",
    next: "Continue",
    back: "Back",
    calculate: "Run official simulation",
    calculating: "Running the official MCV simulation...",
    retry: "Retry",
    startAnother: "Start another calculation",
    editDetails: "Edit details",
    results: "Official MCV result",
    total: "Estimated customs total",
    source: "Official source",
    calculatedAt: "Retrieved at",
    breakdown: "Tax breakdown returned by MCV",
    selectedVehicle: "Selected vehicle",
    warnings: "Important limitations",
    copySummary: "Copy summary",
    copied: "Copied",
    printSummary: "Print / save PDF",
    validationTitle: "Check the required fields",
    required: "Required",
    ambiguity: "Choose the exact official option, then run the simulation again.",
    errorTitle: "No customs amount was generated",
    disclaimer:
      "Results come from the official Moroccan Customs MCV simulator and are indicative. Final assessment may differ. TT AUTO'S Engineering is not affiliated with the customs administration.",
    helper: {
      nature: "Vehicle nature is fixed to passenger automobile for this calculator.",
      genre: "Genre is selected inside the official MCV flow as automobile.",
      manufacturer: "Use the official MCV brand spelling when possible, for example MERCEDES or BMW.",
      model: "Use the full official model label. Trim and body/type notes can matter.",
      vehicleType: "The technical type code distinguishes variants with different official valuations. Do not guess it.",
      firstRegistrationDate: "Use the first registration date from vehicle documents. It is not the same as model year.",
      beneficiaryType: "Choose the customs beneficiary category that applies to the importer.",
    },
  },
  fr: {
    fields: {
      manufacturer: "Marque",
      model: "Modele officiel",
      vehicleType: "Type / code officiel",
      firstRegistrationDate: "Date de premiere mise en circulation",
      beneficiaryType: "Categorie de beneficiaire",
    },
    placeholders: {
      manufacturer: "MERCEDES",
      model: "C 220D /AMG LINE/ 4MATIC (TYPE AF)",
      vehicleType: "AF0EB",
      firstRegistrationDate: "JJ/MM/AAAA",
    },
    beneficiary: {
      AUTRE: "Dedouanement droit commun",
      MRE: "MRE age de 60 ans et plus",
      MRED: "MRE retour definitif au Maroc",
      PBS: "Personne a besoins specifiques",
    },
    steps: ["Choisir le vehicule", "Confirmer les details", "Resultat officiel"],
    introTitle: "Simulation guidee depuis la source officielle",
    introBody:
      "Utilisez les libelles officiels MCV quand c'est possible. Le calculateur ne stocke ni n'invente aucun montant.",
    officialOptions: "Options officielles MCV",
    loadOptions: "Charger les options MCV officielles",
    loadingOptions: "Chargement des options officielles...",
    noOptions: "Aucune option officielle ne correspond. Essayez le libelle MCV exact.",
    selectOfficial: "Utiliser l'option officielle",
    next: "Continuer",
    back: "Retour",
    calculate: "Lancer la simulation officielle",
    calculating: "Simulation MCV officielle en cours...",
    retry: "Reessayer",
    startAnother: "Nouveau calcul",
    editDetails: "Modifier les details",
    results: "Resultat officiel MCV",
    total: "Total douanier estime",
    source: "Source officielle",
    calculatedAt: "Recupere le",
    breakdown: "Detail des taxes retourne par MCV",
    selectedVehicle: "Vehicule selectionne",
    warnings: "Limites importantes",
    copySummary: "Copier le resume",
    copied: "Copie",
    printSummary: "Imprimer / enregistrer PDF",
    validationTitle: "Verifiez les champs obligatoires",
    required: "Obligatoire",
    ambiguity: "Choisissez l'option officielle exacte, puis relancez la simulation.",
    errorTitle: "Aucun montant de douane n'a ete genere",
    disclaimer:
      "Les resultats proviennent du simulateur officiel MCV de l'Administration des Douanes marocaines et sont indicatifs. L'evaluation finale peut differer. TT AUTO'S Engineering n'est pas affilie a l'administration douaniere.",
    helper: {
      nature: "La nature du vehicule est fixee sur automobile pour ce calculateur.",
      genre: "Le genre est selectionne dans le parcours officiel MCV comme automobile.",
      manufacturer: "Utilisez l'orthographe officielle MCV, par exemple MERCEDES ou BMW.",
      model: "Utilisez le libelle complet du modele officiel. La finition et le type peuvent compter.",
      vehicleType: "Le code type technique distingue des variantes avec des valeurs officielles differentes. Ne le devinez pas.",
      firstRegistrationDate: "Utilisez la date de premiere mise en circulation des papiers du vehicule, pas l'annee-modele.",
      beneficiaryType: "Choisissez la categorie de beneficiaire douanier applicable a l'importateur.",
    },
  },
  nl: {
    fields: {
      manufacturer: "Merk",
      model: "Officieel model",
      vehicleType: "Officieel voertuigtype / code",
      firstRegistrationDate: "Datum eerste inschrijving",
      beneficiaryType: "Begunstigdecategorie",
    },
    placeholders: {
      manufacturer: "MERCEDES",
      model: "C 220D /AMG LINE/ 4MATIC (TYPE AF)",
      vehicleType: "AF0EB",
      firstRegistrationDate: "DD/MM/JJJJ",
    },
    beneficiary: {
      AUTRE: "Normale inklaring",
      MRE: "MRE 60 jaar of ouder",
      MRED: "MRE definitieve terugkeer naar Marokko",
      PBS: "Persoon met specifieke behoeften",
    },
    steps: ["Voertuig kiezen", "Details bevestigen", "Officieel resultaat"],
    introTitle: "Begeleide simulatie uit officiele bron",
    introBody:
      "Gebruik waar mogelijk officiele MCV-labels. De calculator bewaart of verzint geen douanebedragen.",
    officialOptions: "Officiele MCV-opties",
    loadOptions: "Officiele MCV-opties laden",
    loadingOptions: "Officiele opties laden...",
    noOptions: "Geen officiele optie gevonden. Probeer de exacte MCV-benaming.",
    selectOfficial: "Gebruik officiele optie",
    next: "Verder",
    back: "Terug",
    calculate: "Start officiele simulatie",
    calculating: "Officiele MCV-simulatie wordt uitgevoerd...",
    retry: "Opnieuw proberen",
    startAnother: "Nieuwe berekening",
    editDetails: "Details aanpassen",
    results: "Officieel MCV-resultaat",
    total: "Geschat douanetotaal",
    source: "Officiele bron",
    calculatedAt: "Opgehaald op",
    breakdown: "Belastingdetails teruggegeven door MCV",
    selectedVehicle: "Gekozen voertuig",
    warnings: "Belangrijke beperkingen",
    copySummary: "Samenvatting kopieren",
    copied: "Gekopieerd",
    printSummary: "Print / bewaar als PDF",
    validationTitle: "Controleer de verplichte velden",
    required: "Verplicht",
    ambiguity: "Kies de exacte officiele optie en start de simulatie opnieuw.",
    errorTitle: "Er is geen douanebedrag gegenereerd",
    disclaimer:
      "Resultaten komen uit de officiele Marokkaanse MCV-simulator en zijn indicatief. De definitieve beoordeling kan afwijken. TT AUTO'S Engineering is niet verbonden aan de douaneadministratie.",
    helper: {
      nature: "Voertuignatuur staat voor deze calculator vast op personenauto.",
      genre: "Genre wordt in de officiele MCV-flow als automobile geselecteerd.",
      manufacturer: "Gebruik waar mogelijk de officiele MCV-merknaam, bijvoorbeeld MERCEDES of BMW.",
      model: "Gebruik het volledige officiele modellabel. Uitvoering en typevermelding kunnen meetellen.",
      vehicleType: "De technische typecode onderscheidt varianten met verschillende officiele waarden. Raad die code niet.",
      firstRegistrationDate: "Gebruik de eerste registratiedatum uit de voertuigdocumenten, niet alleen het modeljaar.",
      beneficiaryType: "Kies de douanecategorie die voor de importeur geldt.",
    },
  },
  ar: {
    fields: {
      manufacturer: "الشركة المصنعة",
      model: "الموديل الرسمي",
      vehicleType: "نوع / رمز السيارة الرسمي",
      firstRegistrationDate: "تاريخ أول تسجيل",
      beneficiaryType: "فئة المستفيد",
    },
    placeholders: {
      manufacturer: "MERCEDES",
      model: "C 220D /AMG LINE/ 4MATIC (TYPE AF)",
      vehicleType: "AF0EB",
      firstRegistrationDate: "DD/MM/YYYY",
    },
    beneficiary: {
      AUTRE: "التخليص وفق القانون العام",
      MRE: "مغربي مقيم بالخارج عمره 60 سنة أو أكثر",
      MRED: "عودة نهائية إلى المغرب",
      PBS: "شخص ذو احتياجات خاصة",
    },
    steps: ["اختيار السيارة", "تأكيد التفاصيل", "النتيجة الرسمية"],
    introTitle: "محاكاة موجهة من المصدر الرسمي",
    introBody:
      "استعمل تسميات MCV الرسمية قدر الإمكان. الحاسبة لا تخزن ولا تخترع أي مبالغ جمركية.",
    officialOptions: "خيارات MCV الرسمية",
    loadOptions: "تحميل خيارات MCV الرسمية",
    loadingOptions: "يتم تحميل الخيارات الرسمية...",
    noOptions: "لم يتم العثور على خيار رسمي مطابق. جرّب تسمية MCV الدقيقة.",
    selectOfficial: "استخدم الخيار الرسمي",
    next: "متابعة",
    back: "رجوع",
    calculate: "تشغيل المحاكاة الرسمية",
    calculating: "يتم تشغيل محاكاة MCV الرسمية...",
    retry: "إعادة المحاولة",
    startAnother: "حساب جديد",
    editDetails: "تعديل التفاصيل",
    results: "نتيجة MCV الرسمية",
    total: "إجمالي جمركي تقديري",
    source: "المصدر الرسمي",
    calculatedAt: "وقت الجلب",
    breakdown: "تفاصيل الرسوم التي أرجعها MCV",
    selectedVehicle: "السيارة المختارة",
    warnings: "تنبيهات مهمة",
    copySummary: "نسخ الملخص",
    copied: "تم النسخ",
    printSummary: "طباعة / حفظ PDF",
    validationTitle: "تحقق من الحقول المطلوبة",
    required: "مطلوب",
    ambiguity: "اختر الخيار الرسمي الدقيق ثم أعد تشغيل المحاكاة.",
    errorTitle: "لم يتم إنشاء أي مبلغ جمركي",
    disclaimer:
      "النتائج مأخوذة من محاكي MCV الرسمي للجمارك المغربية وهي إرشادية فقط. قد يختلف التقييم النهائي. TT AUTO'S Engineering غير تابعة لإدارة الجمارك.",
    helper: {
      nature: "طبيعة المركبة ثابتة هنا كسيارة ركاب.",
      genre: "يتم اختيار النوع داخل مسار MCV الرسمي كسيارة.",
      manufacturer: "استعمل اسم العلامة كما يظهر في MCV مثل MERCEDES أو BMW.",
      model: "استعمل تسمية الموديل الرسمية كاملة. الفئة وملاحظات النوع قد تؤثر.",
      vehicleType: "رمز النوع التقني يميز النسخ ذات القيم الرسمية المختلفة. لا تخمنه.",
      firstRegistrationDate: "استعمل تاريخ أول تسجيل في وثائق السيارة، وليس سنة الموديل فقط.",
      beneficiaryType: "اختر فئة المستفيد الجمركية المناسبة للمستورد.",
    },
  },
};

const initialForm: FormState = {
  manufacturer: "MERCEDES",
  model: "C 220D /AMG LINE/ 4MATIC (TYPE AF)",
  vehicleType: "",
  firstRegistrationDate: "01/01/2022",
  beneficiaryType: "AUTRE",
};

function uniqueOptions(options: McvOption[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = option.label.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatMad(value: number) {
  return `${value.toLocaleString("fr-MA")} MAD`;
}

function Stepper({ step, labels }: { step: number; labels: Copy["steps"] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3" aria-label="Calculation steps">
      {labels.map((label, index) => {
        const active = step === index + 1;
        const complete = step > index + 1;
        return (
          <li
            key={label}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              active
                ? "border-red-400/50 bg-red-500/15 text-white"
                : complete
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/[0.03] text-gray-400"
            }`}
          >
            <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
            <span className="ms-2 font-bold">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-gray-500">{children}</p>;
}

function FormField({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper: string;
  required?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-200">
      <span className="flex items-center justify-between gap-3">
        {label}
        {required ? <span className="text-xs font-medium text-red-200">{required}</span> : null}
      </span>
      {children}
      <HelpText>{helper}</HelpText>
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function OptionList({
  title,
  options,
  empty,
  onSelect,
}: {
  title: string;
  options: McvOption[];
  empty: string;
  onSelect: (option: McvOption) => void;
}) {
  if (!options.length) {
    return <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-400">{empty}</p>;
  }

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{title}</p>
      <div className="grid max-h-64 gap-2 overflow-y-auto pe-1">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option)}
            className="min-h-11 rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-start text-sm text-gray-200 transition hover:border-red-400/50 hover:bg-white/[0.06] focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
          >
            <span className="font-bold text-white">{option.label}</span>
            {option.valueNew ? <span className="ms-2 text-xs text-gray-500">{formatMad(option.valueNew)}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MoroccoCustomsCalculator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "options" | "submitting">("idle");
  const [result, setResult] = useState<McvApiResult | null>(null);
  const [validation, setValidation] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [manufacturers, setManufacturers] = useState<McvOption[]>([]);
  const [models, setModels] = useState<McvOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<McvOption[]>([]);

  const busy = status !== "idle";
  const dateValid = /^\d{2}\/\d{2}\/\d{4}$/.test(form.firstRegistrationDate.trim());
  const canContinueVehicle = Boolean(form.manufacturer.trim() && form.model.trim());
  const canCalculate = canContinueVehicle && Boolean(form.vehicleType.trim() && dateValid);

  const datalistOptions = useMemo(
    () => ({
      manufacturers: uniqueOptions(manufacturers).slice(0, 80),
      models: uniqueOptions(models).slice(0, 80),
      vehicleTypes: uniqueOptions(vehicleTypes).slice(0, 80),
    }),
    [manufacturers, models, vehicleTypes]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setValidation([]);
    if (key === "manufacturer") {
      setModels([]);
      setVehicleTypes([]);
    }
    if (key === "model") setVehicleTypes([]);
  }

  function validateStep(nextStep = step) {
    const messages: string[] = [];
    if (nextStep >= 2 && !form.manufacturer.trim()) messages.push(`${t.fields.manufacturer}: ${t.required}`);
    if (nextStep >= 2 && !form.model.trim()) messages.push(`${t.fields.model}: ${t.required}`);
    if (nextStep >= 3 && !form.vehicleType.trim()) messages.push(`${t.fields.vehicleType}: ${t.required}`);
    if (nextStep >= 3 && !dateValid) messages.push(`${t.fields.firstRegistrationDate}: DD/MM/YYYY`);
    setValidation(messages);
    return messages.length === 0;
  }

  async function loadOptions() {
    setStatus("options");
    setValidation([]);
    try {
      const params = new URLSearchParams();
      if (form.manufacturer.trim()) params.set("manufacturer", form.manufacturer.trim());
      if (form.model.trim()) params.set("modelQuery", form.model.trim());
      const response = await fetch(`/api/mcv/options?${params}`);
      const payload = (await response.json()) as { manufacturers?: McvOption[]; models?: McvOption[]; vehicleTypes?: McvOption[] };
      setManufacturers(uniqueOptions(payload.manufacturers ?? []));
      setModels(uniqueOptions(payload.models ?? []));
      setVehicleTypes(uniqueOptions(payload.vehicleTypes ?? []));
    } catch {
      setResult({
        status: "error",
        code: "MCV_UNAVAILABLE",
        message: "Official MCV options are unavailable right now.",
      });
    } finally {
      setStatus("idle");
    }
  }

  function continueToDetails() {
    if (!validateStep(2)) return;
    setStep(2);
  }

  async function calculate() {
    if (!validateStep(3)) return;
    setStep(3);
    setStatus("submitting");
    setResult(null);
    try {
      const response = await fetch("/api/mcv/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as McvApiResult;
      setResult(payload);
      if (payload.status === "error" && payload.options?.length) {
        setVehicleTypes(uniqueOptions(payload.options));
      }
    } catch {
      setResult({
        status: "error",
        code: "MCV_UNAVAILABLE",
        message: "The official MCV service could not be reached.",
      });
    } finally {
      setStatus("idle");
    }
  }

  function reset() {
    setForm(initialForm);
    setStep(1);
    setResult(null);
    setValidation([]);
    setCopied(false);
    setModels([]);
    setVehicleTypes([]);
  }

  async function copyResult() {
    if (!result || result.status !== "success") return;
    const summary = [
      "TT AUTO'S Engineering MCV simulation summary",
      `${t.total}: ${formatMad(result.total.amountMad)}`,
      `${t.selectedVehicle}: ${result.vehicle.manufacturer} ${result.vehicle.model} (${result.vehicle.vehicleType})`,
      `${t.fields.firstRegistrationDate}: ${result.vehicle.firstRegistrationDate}`,
      `${t.fields.beneficiaryType}: ${result.vehicle.beneficiaryType}`,
      `${t.calculatedAt}: ${result.calculatedAt}`,
      `${t.source}: ${result.sourceUrl}`,
      t.disclaimer,
    ].join("\n");
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-5">
          <p className="text-sm font-semibold text-red-300">{t.introTitle}</p>
          <p className="mt-2 text-sm leading-6 text-gray-400">{t.introBody}</p>
          <div className="mt-5">
            <Stepper step={step} labels={t.steps} />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-sm font-bold text-white">MCV context</p>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Vehicle nature</dt>
              <dd className="text-gray-300">{t.helper.nature}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Genre</dt>
              <dd className="text-gray-300">{t.helper.genre}</dd>
            </div>
          </dl>
        </div>
      </aside>

      <div className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-black/20 md:p-7">
        <div aria-live="polite" className="sr-only">
          {busy ? (status === "options" ? t.loadingOptions : t.calculating) : ""}
        </div>

        {validation.length ? (
          <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4" role="alert">
            <p className="text-sm font-bold text-red-100">{t.validationTitle}</p>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-red-100/85">
              {validation.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t.fields.manufacturer} helper={t.helper.manufacturer} required={t.required}>
                <TextInput
                  value={form.manufacturer}
                  placeholder={t.placeholders.manufacturer}
                  list="mcv-manufacturers"
                  onFocus={() => {
                    if (!manufacturers.length && !busy) void loadOptions();
                  }}
                  onChange={(event) => update("manufacturer", event.target.value)}
                />
              </FormField>
              <FormField label={t.fields.model} helper={t.helper.model} required={t.required}>
                <TextInput
                  value={form.model}
                  placeholder={t.placeholders.model}
                  list="mcv-models"
                  disabled={!form.manufacturer.trim()}
                  onChange={(event) => update("model", event.target.value)}
                />
              </FormField>
            </div>
            <datalist id="mcv-manufacturers">
              {datalistOptions.manufacturers.map((option) => <option key={option.label} value={option.label} />)}
            </datalist>
            <datalist id="mcv-models">
              {datalistOptions.models.map((option) => <option key={option.label} value={option.label} />)}
            </datalist>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void loadOptions()}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30 disabled:cursor-wait disabled:opacity-60"
              >
                {status === "options" ? t.loadingOptions : t.loadOptions}
              </button>
              <button
                type="button"
                disabled={!canContinueVehicle || busy}
                onClick={continueToDetails}
                className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.next}
              </button>
            </div>

            <OptionList
              title={t.officialOptions}
              options={datalistOptions.models}
              empty={t.noOptions}
              onSelect={(option) => update("model", option.label)}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t.fields.vehicleType} helper={t.helper.vehicleType} required={t.required}>
                <TextInput
                  value={form.vehicleType}
                  placeholder={t.placeholders.vehicleType}
                  list="mcv-vehicle-types"
                  disabled={!form.model.trim()}
                  onChange={(event) => update("vehicleType", event.target.value)}
                />
              </FormField>
              <FormField label={t.fields.firstRegistrationDate} helper={t.helper.firstRegistrationDate} required={t.required}>
                <TextInput
                  value={form.firstRegistrationDate}
                  placeholder={t.placeholders.firstRegistrationDate}
                  inputMode="numeric"
                  onChange={(event) => update("firstRegistrationDate", event.target.value)}
                />
              </FormField>
              <label className="block text-sm font-semibold text-gray-200 md:col-span-2">
                <span className="flex items-center justify-between gap-3">
                  {t.fields.beneficiaryType}
                  <span className="text-xs font-medium text-red-200">{t.required}</span>
                </span>
                <select
                  value={form.beneficiaryType}
                  onChange={(event) => update("beneficiaryType", event.target.value as McvBeneficiaryType)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                >
                  {(["AUTRE", "MRE", "MRED", "PBS"] as McvBeneficiaryType[]).map((value) => (
                    <option key={value} value={value}>
                      {t.beneficiary[value]}
                    </option>
                  ))}
                </select>
                <HelpText>{t.helper.beneficiaryType}</HelpText>
              </label>
            </div>
            <datalist id="mcv-vehicle-types">
              {datalistOptions.vehicleTypes.map((option) => <option key={option.label} value={option.label} />)}
            </datalist>

            <OptionList
              title={t.fields.vehicleType}
              options={datalistOptions.vehicleTypes}
              empty={t.noOptions}
              onSelect={(option) => update("vehicleType", option.label)}
            />

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStep(1)} className="min-h-12 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                {t.back}
              </button>
              <button type="button" disabled={busy} onClick={() => void loadOptions()} className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30 disabled:cursor-wait disabled:opacity-60">
                {status === "options" ? t.loadingOptions : t.loadOptions}
              </button>
              <button type="button" disabled={!canCalculate || busy} onClick={() => void calculate()} className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30 disabled:cursor-not-allowed disabled:opacity-50">
                {t.calculate}
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            {busy ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6">
                <p className="text-sm font-semibold text-red-200">{t.calculating}</p>
                <h2 className="mt-2 text-2xl font-black text-white">MCV</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
                  The official website can be slow. This step only completes after a validated MCV result is extracted.
                </p>
              </div>
            ) : result?.status === "success" ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <p className="text-sm font-semibold text-emerald-100">{t.results}</p>
                  <h2 className="mt-2 text-5xl font-black tracking-tight text-white">
                    {formatMad(result.total.amountMad)}
                  </h2>
                  <p className="mt-2 text-sm text-emerald-50/80">{t.total}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{t.selectedVehicle}</p>
                    <p className="mt-2 text-sm text-white">{result.vehicle.manufacturer} {result.vehicle.model}</p>
                    <p className="mt-1 text-sm text-gray-400">{result.vehicle.vehicleType} | {result.vehicle.firstRegistrationDate} | {result.vehicle.beneficiaryType}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{t.source}</p>
                    <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm font-bold text-red-200 hover:text-red-100">
                      {result.sourceUrl}
                    </a>
                    <p className="mt-2 text-sm text-gray-400">{t.calculatedAt}: {new Date(result.calculatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {result.fields.length ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-bold text-white">{t.breakdown}</p>
                    <dl className="mt-4 grid gap-3">
                      {result.fields.map((field) => (
                        <div key={field.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-0 last:pb-0">
                          <dt className="text-gray-400">{field.label}</dt>
                          <dd className="font-bold text-white">{field.raw.replace(/DH/i, "MAD")}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-sm font-bold text-amber-100">{t.warnings}</p>
                  <ul className="mt-2 list-disc space-y-1 ps-5 text-sm leading-6 text-amber-50/85">
                    {[...result.warnings, t.disclaimer].map((warning) => <li key={warning}>{warning}</li>)}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={reset} className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {t.startAnother}
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="min-h-12 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {t.editDetails}
                  </button>
                  <button type="button" onClick={() => void copyResult()} className="min-h-12 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {copied ? t.copied : t.copySummary}
                  </button>
                  <button type="button" onClick={() => window.print()} className="min-h-12 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {t.printSummary}
                  </button>
                </div>
              </div>
            ) : result?.status === "error" ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-6" role="alert">
                  <p className="text-sm font-semibold text-red-200">{result.code}</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{t.errorTitle}</h2>
                  <p className="mt-3 leading-7 text-gray-300">{result.message}</p>
                  {result.options?.length ? <p className="mt-3 text-sm text-gray-400">{t.ambiguity}</p> : null}
                </div>
                {result.options?.length ? (
                  <OptionList
                    title={t.fields.vehicleType}
                    options={result.options}
                    empty={t.noOptions}
                    onSelect={(option) => {
                      update("vehicleType", option.label);
                      setStep(2);
                    }}
                  />
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => void calculate()} className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {t.retry}
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="min-h-12 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/30">
                    {t.editDetails}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-red-300">MCV</p>
                <h2 className="mt-2 text-2xl font-black text-white">{t.results}</h2>
                <p className="mt-3 leading-7 text-gray-400">{t.disclaimer}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
