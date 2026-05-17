"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="h-display text-lg font-bold tracking-tight"
          style={{ color: "var(--brand-strong)" }}
          onClick={() => setOpen(false)}
        >
          AGENCY<span style={{ color: "var(--text)" }}>.traffic</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                color: isActive(item.href)
                  ? "var(--brand-strong)"
                  : "var(--text-muted)",
                background: isActive(item.href)
                  ? "var(--surface-2)"
                  : "transparent",
              }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <button
            type="button"
            aria-label="Menu"
            className="btn btn-ghost lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t lg:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium"
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
