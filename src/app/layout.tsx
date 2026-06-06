import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import LocaleChrome from "@/components/LocaleChrome";
import "./globals.css";

const SITE_URL = "https://ttautosengineering.com";
const SITE_NAME = "TT AUTO'S Engineering";
const SITE_DESCRIPTION =
  "Precision analysis of German automotive engineering. Reliability insights, buying guides, and technical expertise for BMW, Mercedes-Benz, Audi, and Volkswagen.";
const GA_MEASUREMENT_ID = "G-32JMN5G1JK";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      en: `${SITE_URL}/en`,
      nl: `${SITE_URL}/nl`,
      ar: `${SITE_URL}/ar`,
      "x-default": `${SITE_URL}/en`,
    },
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
  openGraph: {
    type: "website",
    url: `${SITE_URL}/en`,
    title: SITE_NAME,
    description:
      "Engineering-driven analysis of German cars: reliability, buying guides, and technical insights.",
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Engineering-driven analysis of German cars: reliability, buying guides, and technical insights.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "LsgKyxNbZ0r4LNJEmRf2MnIgKnbEOirJoYdym92nrho",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/en`,
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "nl", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/en/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0B1220] text-white antialiased`}
      >
        <Script id="locale-document" strategy="beforeInteractive">
          {`
            (function () {
              var locale = location.pathname.split('/')[1];
              if (!['en', 'nl', 'ar'].includes(locale)) locale = 'en';
              document.documentElement.lang = locale;
              document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
            })();
          `}
        </Script>
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

        <LocaleChrome>{children}</LocaleChrome>
      </body>
    </html>
  );
}
