"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocalizedLink";
import { useLocale } from "@/components/LocaleProvider";

type LeadCaptureCTAProps = {
  source?: string;
  compact?: boolean;
  className?: string;
};

const brands = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Other"];
const gearboxes = ["Automatic", "Manual", "DSG / S tronic", "ZF 8HP", "9G-Tronic", "Not sure"];

const copy = {
  en: {
    eyebrow: "Buyer help", title: "Request a used-car risk review",
    intro: "Send us the model, year, engine and mileage. We'll help identify the main risks before you buy.",
    benefits: ["Known engine and gearbox weak points.", "Fault codes and symptoms to verify.", "Inspection questions before negotiation."],
    disclaimer: "This is buyer guidance, not a remote mechanical inspection or a guarantee. Always verify the car in person with diagnostics and service records.",
    received: "Request received", receivedText: "Thanks. TT AUTO'S Engineering will review the vehicle details and reply through your preferred contact method.", another: "Send another request",
    brand: "Brand", selectBrand: "Select brand", model: "Model", year: "Year", engine: "Engine", mileage: "Mileage", gearbox: "Gearbox", selectGearbox: "Select gearbox", market: "Country / market", vin: "Optional VIN", question: "Your question", questionPlaceholder: "What worries you about this car?", contact: "Email / contact method", contactPlaceholder: "Email, WhatsApp, or preferred contact",
    consentBefore: "I agree that these vehicle and contact details may be used to respond to this request. See the", privacy: "privacy policy", consentAfter: "for details.", sending: "Sending request...", submit: "Request risk review", genericError: "Unable to send your request. Please try again.", honeypot: "Leave this field empty", other: "Other", notSure: "Not sure",
  },
  nl: {
    eyebrow: "Hulp bij aankoop", title: "Vraag een risicoanalyse voor een occasion aan",
    intro: "Stuur ons model, bouwjaar, motor en kilometerstand. We helpen de belangrijkste risico's vóór aankoop te herkennen.",
    benefits: ["Bekende zwakke punten van motor en versnellingsbak.", "Foutcodes en symptomen om te controleren.", "Inspectievragen vóór de onderhandeling."],
    disclaimer: "Dit is aankoopadvies, geen mechanische keuring op afstand of garantie. Controleer de auto altijd ter plaatse met diagnose en onderhoudshistorie.",
    received: "Aanvraag ontvangen", receivedText: "Bedankt. TT AUTO'S Engineering beoordeelt de voertuiggegevens en reageert via je voorkeursmethode.", another: "Nog een aanvraag sturen",
    brand: "Merk", selectBrand: "Kies een merk", model: "Model", year: "Bouwjaar", engine: "Motor", mileage: "Kilometerstand", gearbox: "Versnellingsbak", selectGearbox: "Kies een versnellingsbak", market: "Land / markt", vin: "Optioneel VIN", question: "Je vraag", questionPlaceholder: "Waar maak je je zorgen over bij deze auto?", contact: "E-mail / contactmethode", contactPlaceholder: "E-mail, WhatsApp of gewenste contactmethode",
    consentBefore: "Ik ga ermee akkoord dat deze voertuig- en contactgegevens worden gebruikt om op deze aanvraag te reageren. Zie het", privacy: "privacybeleid", consentAfter: "voor meer informatie.", sending: "Aanvraag verzenden...", submit: "Risicoanalyse aanvragen", genericError: "De aanvraag kon niet worden verzonden. Probeer het opnieuw.", honeypot: "Laat dit veld leeg", other: "Anders", notSure: "Niet zeker",
  },
  ar: {
    eyebrow: "مساعدة المشتري", title: "اطلب مراجعة مخاطر سيارة مستعملة",
    intro: "أرسل لنا الموديل والسنة والمحرك والمسافة المقطوعة، وسنساعدك في تحديد أهم المخاطر قبل الشراء.",
    benefits: ["نقاط ضعف المحرك وناقل الحركة المعروفة.", "رموز الأعطال والأعراض التي يجب التحقق منها.", "أسئلة الفحص قبل التفاوض."],
    disclaimer: "هذه إرشادات للمشتري وليست فحصاً ميكانيكياً عن بُعد أو ضماناً. افحص السيارة دائماً شخصياً مع التشخيص وسجلات الصيانة.",
    received: "تم استلام الطلب", receivedText: "شكراً. سيراجع فريق TT AUTO'S Engineering تفاصيل السيارة ويرد عبر وسيلة الاتصال المفضلة لديك.", another: "إرسال طلب آخر",
    brand: "العلامة", selectBrand: "اختر العلامة", model: "الموديل", year: "السنة", engine: "المحرك", mileage: "المسافة المقطوعة", gearbox: "ناقل الحركة", selectGearbox: "اختر ناقل الحركة", market: "البلد / السوق", vin: "رقم الهيكل اختياري", question: "سؤالك", questionPlaceholder: "ما الذي يقلقك في هذه السيارة؟", contact: "البريد / وسيلة الاتصال", contactPlaceholder: "البريد الإلكتروني أو واتساب أو وسيلة مفضلة",
    consentBefore: "أوافق على استخدام بيانات السيارة والاتصال للرد على هذا الطلب. راجع", privacy: "سياسة الخصوصية", consentAfter: "للتفاصيل.", sending: "جارٍ إرسال الطلب...", submit: "اطلب مراجعة المخاطر", genericError: "تعذر إرسال طلبك. حاول مرة أخرى.", honeypot: "اترك هذا الحقل فارغاً", other: "أخرى", notSure: "غير متأكد",
  },
} as const;

function trackLeadEvent(name: string, source: string, locale: string) {
  const detail = { event: name, source, locale };
  window.dispatchEvent(new CustomEvent("ttautos:analytics", { detail }));
  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, string>> };
  analyticsWindow.dataLayer?.push(detail);
}

export default function LeadCaptureCTA({
  source = "site",
  compact = false,
  className = "",
}: LeadCaptureCTAProps) {
  const locale = useLocale();
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileSiteKey || document.querySelector('script[data-ttautos-turnstile]')) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.ttautosTurnstile = "true";
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    trackLeadEvent("lead_submit_started", source, locale);

    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form).entries()), locale };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(locale === "en" ? (result.error ?? t.genericError) : t.genericError);
      form.reset();
      setStatus("success");
      trackLeadEvent("lead_submit_succeeded", source, locale);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : t.genericError
      );
      setStatus("error");
      trackLeadEvent("lead_submit_failed", source, locale);
    }
  }

  return (
    <section
      className={[
        "rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-950/35 via-[#111827] to-[#0B1220] p-6 shadow-2xl shadow-red-950/10 md:p-8",
        className,
      ].join(" ")}
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-red-300">{t.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            {t.title}
          </h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            {t.intro}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-gray-300">
            {t.benefits.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-gray-500">
            {t.disclaimer}
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-bold text-white">{t.received}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              {t.receivedText}
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
            >
              {t.another}
            </button>
          </div>
        ) : (
          <form
            className={compact ? "grid gap-3 md:grid-cols-2" : "grid gap-4 md:grid-cols-2"}
            onSubmit={submitLead}
          >
            <input type="hidden" name="source" value={source} />
            <input type="hidden" name="locale" value={locale} />
            <label className="hidden" aria-hidden="true">
              {t.honeypot}
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.brand}
              <select
                name="brand"
                required
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-400"
              >
                <option value="">{t.selectBrand}</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand === "Other" ? t.other : brand}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.model}
              <input
                name="model"
                required
                placeholder="320d F30, C220d W205..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.year}
              <input
                name="year"
                inputMode="numeric"
                placeholder="2018"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.engine}
              <input
                name="engine"
                placeholder="B47, OM651, EA888..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.mileage}
              <input
                name="mileage"
                placeholder="150,000 km"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.gearbox}
              <select
                name="gearbox"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-red-400"
              >
                <option value="">{t.selectGearbox}</option>
                {gearboxes.map((gearbox) => (
                  <option key={gearbox} value={gearbox}>{gearbox === "Not sure" ? t.notSure : gearbox}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.market}
              <input
                name="market"
                placeholder="Morocco, Germany, Netherlands..."
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {t.vin}
              <input
                name="vin"
                placeholder="VIN if available"
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300 md:col-span-2">
              {t.question}
              <textarea
                name="question"
                rows={compact ? 3 : 4}
                placeholder={t.questionPlaceholder}
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300 md:col-span-2">
              {t.contact}
              <input
                name="contact"
                required
                placeholder={t.contactPlaceholder}
                className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-400"
              />
            </label>
            <label className="flex items-start gap-3 text-xs leading-5 text-gray-400 md:col-span-2">
              <input
                type="checkbox"
                name="consent"
                value="yes"
                required
                className="mt-1 h-4 w-4 accent-red-600"
              />
              <span>
                {t.consentBefore}{" "}
                <Link href="/privacy-policy" className="text-gray-200 underline hover:text-white">
                  {t.privacy}
                </Link>{" "}
                {t.consentAfter}
              </span>
            </label>
            {status === "error" ? (
              <p role="alert" className="text-sm text-red-300 md:col-span-2">
                {error}
              </p>
            ) : null}
            {turnstileSiteKey ? (
              <div
                className="cf-turnstile md:col-span-2"
                data-sitekey={turnstileSiteKey}
                data-theme="dark"
                data-action="lead-submit"
              />
            ) : null}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60 md:col-span-2"
            >
              {status === "submitting" ? t.sending : t.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
