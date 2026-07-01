import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { LocaleProvider } from "@/components/LocaleProvider";
import LocaleChrome from "@/components/LocaleChrome";
import { isLocale, locales } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { translateKnown } from "@/lib/translate";
import "../globals.css";

const SITE_URL = "https://ttautosengineering.com";
const SITE_NAME = "TT AUTO'S Engineering";
const GA_MEASUREMENT_ID = "G-32JMN5G1JK";
const HOME_TITLE = "German Car Reliability and Buying Guides";
const HOME_DESCRIPTION =
  "Engineering-driven reliability analysis, buying guides, model research, and technical insights for BMW, Mercedes-Benz, Audi, and Volkswagen.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const metadata = localizedPageMetadata({
    locale,
    pathname: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  });
  return {
    ...metadata,
    metadataBase: new URL(SITE_URL),
    title: {
      default: translateKnown(locale, HOME_TITLE),
      template: `%s - ${SITE_NAME}`,
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    verification: {
      google: "LsgKyxNbZ0r4LNJEmRf2MnIgKnbEOirJoYdym92nrho",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    description: translateKnown(locale, HOME_DESCRIPTION),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Used-car risk review",
    description: "Engineering-led review of used German-car reliability risks, fault patterns, and inspection priorities.",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/${locale}/how-we-evaluate-used-cars`,
    },
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0B1220] text-white antialiased`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          id="jsonld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="jsonld-risk-review-service"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />

        <LocaleProvider locale={locale}>
          <LocaleChrome locale={locale}>{children}</LocaleChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
