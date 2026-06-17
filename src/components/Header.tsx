"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";
import BrandMark from "./BrandMark";

const NAV = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/cases", key: "cases" },
  { href: "/white", key: "white" },
  { href: "/grey", key: "grey" },
  { href: "/news", key: "news" },
  { href: "/contacts", key: "contacts" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-[background,border-color,box-shadow] duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 11, 24, 0.72)"
          : "linear-gradient(180deg, rgba(5,11,24,0.62), rgba(5,11,24,0))",
        backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(176,218,255,0.14)"
          : "1px solid transparent",
      }}
    >
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <BrandMark size={30} uniqueId="header" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] font-bold tracking-[0.06em] text-white">
              TAG SERVICE
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)] sm:inline">
              AGENCY
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              style={{
                color: isActive(item.href)
                  ? "var(--text)"
                  : "var(--text-muted)",
              }}
            >
              {t(item.key)}
              <span
                className="absolute bottom-1 left-3 h-px transition-all duration-300 group-hover:w-[calc(100%-24px)]"
                style={{
                  width: isActive(item.href) ? "calc(100% - 24px)" : "0px",
                  background: "var(--brand-strong)",
                }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <button
            type="button"
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/[0.055] lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-5">
              <span
                className="absolute left-0 top-0 h-px w-5 bg-white transition-transform"
                style={{
                  transform: open ? "translateY(7px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-0 top-2 h-px w-5 bg-white transition-opacity"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-5 bg-white transition-transform"
                style={{
                  transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#061020]/92 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col px-5 py-2 sm:px-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold"
                style={{
                  color: isActive(item.href)
                    ? "var(--brand-strong)"
                    : "var(--text)",
                }}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
