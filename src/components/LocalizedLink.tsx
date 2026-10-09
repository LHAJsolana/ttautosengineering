"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { isLocale, localePath } from "@/lib/i18n";

type Props = ComponentProps<typeof NextLink>;

function localizedHref(href: Props["href"], locale: ReturnType<typeof useLocale>) {
  if (typeof href !== "string") {
    const pathname = href.pathname?.toString();
    if (!pathname || !pathname.startsWith("/")) return href;
    const firstSegment = pathname.split("/")[1];
    if (isLocale(firstSegment)) return href;
    return { ...href, pathname: localePath(locale, pathname) };
  }

  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/_next") ||
    href.startsWith("/api")
  ) {
    return href;
  }

  const firstSegment = href.split("/")[1]?.split(/[?#]/)[0];
  if (isLocale(firstSegment)) return href;
  return localePath(locale, href);
}

export default function LocalizedLink({ href, ...props }: Props) {
  const locale = useLocale();
  return <NextLink href={localizedHref(href, locale)} {...props} />;
}
