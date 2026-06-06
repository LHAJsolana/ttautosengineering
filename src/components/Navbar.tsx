"use client";

import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getUi, localePath, stripLocale, type Locale } from "@/lib/i18n";

type NavItem = { label: string; href: string };

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const copy = getUi(locale);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: copy.nav.insights, href: localePath(locale, "/insights") },
      { label: copy.nav.blog, href: localePath(locale, "/blog") },
      { label: copy.nav.search, href: localePath(locale, "/search") },
      { label: copy.nav.brands, href: localePath(locale, "/brands") },
      { label: copy.nav.models, href: localePath(locale, "/models") },
      { label: copy.nav.powertrains, href: localePath(locale, "/powertrains") },
      { label: copy.nav.buyingGuides, href: localePath(locale, "/buying-guides") },
      { label: copy.nav.checklist, href: localePath(locale, "/buying-checklist") },
      { label: copy.nav.reliability, href: localePath(locale, "/reliability-index") },
      { label: copy.nav.about, href: localePath(locale, "/about") },
    ],
    [copy, locale]
  );

  function isActive(href: string) {
    const currentPath = stripLocale(pathname);
    const itemPath = stripLocale(href);
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#0B1220]/95 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href={localePath(locale)} className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="TT AUTO'S Engineering"
              width={280}
              height={100}
              priority
              className="h-12 w-auto md:h-14"
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xl font-bold tracking-tight text-white md:text-2xl">
                TT AUTO&apos;S
              </div>
              <div className="-mt-0.5 text-xs text-gray-300 md:text-sm">Engineering</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative rounded-xl px-2.5 py-2 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white",
                    active ? "bg-white/5" : "",
                  ].join(" ")}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-red-500" />
                  ) : null}
                </Link>
              );
            })}
            <Link
              href={localePath(locale, "/buying-checklist")}
              className="ml-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {copy.nav.check}
            </Link>
            <LanguageSwitcher locale={locale} label={copy.language} />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSwitcher locale={locale} label={copy.language} />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
              aria-label={open ? copy.closeMenu : copy.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="text-lg leading-none">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </nav>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label={copy.closeMenu}
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 top-0 border-b border-white/10 bg-[#0B1220]">
            <div className="mx-auto max-w-6xl px-6 pb-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{copy.menu}</div>
                <button
                  aria-label={copy.closeMenu}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm transition",
                      isActive(item.href)
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href={localePath(locale, "/search")}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-red-700"
                >
                  {copy.nav.search}
                </Link>
                <Link
                  href={localePath(locale, "/brands")}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-gray-100 transition hover:bg-white/10"
                >
                  {copy.nav.browseBrands}
                </Link>
              </div>

              <p className="mt-4 text-xs text-gray-400">{copy.footer.tagline}</p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
