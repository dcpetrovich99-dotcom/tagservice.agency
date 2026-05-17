import { defineRouting } from "next-intl/routing";

// Дві мови. defaultLocale = ru: якщо гео НЕ Україна — російська.
// Гео-логіка (UA → uk) реалізована в middleware.
export const routing = defineRouting({
  locales: ["uk", "ru"],
  defaultLocale: "ru",
  localePrefix: "always",
  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (routing.locales as readonly string[]).includes(x);
}
