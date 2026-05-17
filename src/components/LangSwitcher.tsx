"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const LOCALES = [
  { code: "uk", label: "УКР" },
  { code: "ru", label: "РУ" },
] as const;

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(code: "uk" | "ru") {
    if (code === locale) return;
    startTransition(() => {
      // next-intl сам виставить cookie `locale` (див. routing.localeCookie)
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border"
      role="group"
      aria-label="Language"
      data-pending={pending}
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchTo(l.code)}
          aria-pressed={locale === l.code}
          className="px-3 py-1.5 text-sm font-semibold transition-colors"
          style={
            locale === l.code
              ? { background: "var(--brand)", color: "#fff" }
              : { background: "var(--surface)", color: "var(--text-muted)" }
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
