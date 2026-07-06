"use client";

import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getUi, localePath, stripLocale, type Locale } from "@/lib/i18n";

type NavItem = { label: string; href: string };

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
    </svg>
  );
}

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
      { label: copy.nav.tools, href: localePath(locale, "/tools") },
      { label: copy.nav.buyingGuides, href: localePath(locale, "/buying-guides") },
      { label: "Parts Map", href: localePath(locale, "/parts-failure-map") },
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080f1d]/95 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center gap-4 px-4 sm:px-6">
          <Link
            href={localePath(locale)}
            className="group flex min-w-0 items-center gap-3"
            aria-label="TT AUTO'S Engineering"
          >
            <div className="relative h-12 w-[132px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg shadow-red-950/20 sm:w-[154px]">
              <Image
                src="/logo-transparent.png"
                alt=""
                fill
                priority
                sizes="154px"
                className="scale-[1.38] object-cover transition duration-300 group-hover:scale-[1.44]"
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="whitespace-nowrap text-lg font-black tracking-[-0.03em] text-white">
                TT AUTO&apos;S
              </div>
              <div className="mt-0.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] text-red-300">
                Engineering
              </div>
            </div>
          </Link>

          <div className="ms-auto hidden items-center gap-5 lg:flex">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <span>{locale === "nl" ? "Technische kennisbank" : locale === "ar" ? "منصة هندسية للسيارات" : "Automotive engineering intelligence"}</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-gray-300">
              BMW · Mercedes · Audi · VW
            </span>
          </div>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <Link
              href={localePath(locale, "/buying-checklist")}
              className="hidden rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-500 sm:inline-flex"
            >
              {copy.nav.check}
            </Link>
            <LanguageSwitcher locale={locale} label={copy.language} />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/10 lg:hidden"
              aria-label={open ? copy.closeMenu : copy.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <nav className="mx-auto flex h-14 max-w-[1440px] items-center gap-1 overflow-x-auto px-6">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative flex h-10 shrink-0 items-center rounded-xl px-3.5 text-[13px] font-semibold transition",
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white",
                ].join(" ")}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                ) : null}
              </Link>
            );
          })}
          <div className="ms-auto flex shrink-0 items-center gap-2 ps-4 text-[11px] text-gray-500">
            <span>EN</span><span className="text-red-400">/</span><span>NL</span><span className="text-red-400">/</span><span>AR</span>
          </div>
        </nav>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-[75px] z-50 border-b border-white/10 bg-[#0b1322]/98 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{copy.menu}</p>
                <p className="mt-0.5 text-xs text-gray-500">{copy.footer.tagline}</p>
              </div>
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-200">
                TT AUTO&apos;S
              </span>
            </div>
            <div className="grid max-h-[60vh] gap-2 overflow-y-auto sm:grid-cols-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                    isActive(item.href)
                      ? "border-red-500/40 bg-red-500/10 text-white"
                      : "border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span data-directional-icon className="text-red-300">-&gt;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
