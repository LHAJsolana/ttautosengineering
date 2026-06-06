"use client";

import Link from "@/components/LocalizedLink";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ContentTranslator from "@/components/ContentTranslator.client";
import { getUi, localePath, type Locale } from "@/lib/i18n";

function FooterLink({
  locale,
  href,
  children,
}: {
  locale: Locale;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="block text-gray-400 hover:text-white" href={localePath(locale, href)}>
      <ContentTranslator locale={locale}>{children}</ContentTranslator>
    </Link>
  );
}

function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  const siteName = "TT AUTO'S Engineering";

  return (
    <footer className="mt-16 border-t border-gray-800">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="text-lg font-semibold text-white">{siteName}</div>
            <p className="mt-3 leading-relaxed text-gray-400">{copy.footer.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["BMW", "Mercedes-Benz", "Audi", "Volkswagen"].map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-gray-700 bg-white/5 px-2.5 py-1 text-xs text-gray-300"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <div className="mb-3 font-semibold text-gray-200">{copy.footer.explore}</div>
              <div className="space-y-2">
                <FooterLink locale={locale} href="/insights">{copy.nav.insights}</FooterLink>
                <FooterLink locale={locale} href="/search">{copy.nav.search}</FooterLink>
                <FooterLink locale={locale} href="/brands">{copy.nav.brands}</FooterLink>
                <FooterLink locale={locale} href="/buying-guides">{copy.nav.buyingGuides}</FooterLink>
                <FooterLink locale={locale} href="/reliability-index">{copy.nav.reliability}</FooterLink>
              </div>
            </div>

            <div>
              <div className="mb-3 font-semibold text-gray-200">{copy.footer.company}</div>
              <div className="space-y-2">
                <FooterLink locale={locale} href="/about">{copy.nav.about}</FooterLink>
                <FooterLink locale={locale} href="/contact">{copy.footer.contact}</FooterLink>
                <FooterLink locale={locale} href="/disclaimer">{copy.footer.disclaimer}</FooterLink>
              </div>
            </div>

            <div>
              <div className="mb-3 font-semibold text-gray-200">{copy.footer.trust}</div>
              <div className="space-y-2">
                <FooterLink locale={locale} href="/privacy-policy">{copy.footer.privacy}</FooterLink>
                <FooterLink locale={locale} href="/terms">{copy.footer.terms}</FooterLink>
                <FooterLink locale={locale} href="/affiliate-disclosure">{copy.footer.affiliate}</FooterLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-800 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteName}. {copy.footer.rights}
          </p>
          <p className="text-xs text-gray-500">{copy.footer.affiliateNote}</p>
        </div>
      </div>
    </footer>
  );
}

export default function LocaleChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <>
      <Navbar locale={locale} />
      <ContentTranslator locale={locale}>{children}</ContentTranslator>
      <SiteFooter locale={locale} />
    </>
  );
}
