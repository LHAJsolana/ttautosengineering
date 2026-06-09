import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import LocaleChrome from "@/components/LocaleChrome";
import { isLocale, locales } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";
import { translateKnown } from "@/lib/translate";

const SITE_NAME = "TT AUTO'S Engineering";
const HOME_TITLE = "German Car Reliability and Buying Guides";
const HOME_DESCRIPTION =
  "Engineering-driven reliability analysis, buying guides, model research, and technical insights for BMW, Mercedes-Benz, Audi, and Volkswagen.";

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
    title: {
      default: translateKnown(locale, HOME_TITLE),
      template: `%s - ${SITE_NAME}`,
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

  return (
    <LocaleProvider locale={locale}>
      <LocaleChrome locale={locale}>{children}</LocaleChrome>
    </LocaleProvider>
  );
}
