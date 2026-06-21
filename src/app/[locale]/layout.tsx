import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Manrope, Unbounded, Montserrat } from "next/font/google";
import { isLocale } from "@/i18n/routing";
import { getSettings, contacts } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SupportFab from "@/components/SupportFab";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

// Без generateStaticParams: контент керується через БД/адмінку,
// тому сторінки рендеряться динамічно (свіжі дані щозапиту).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();
  const settings = await getSettings();
  const c = contacts(settings);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${unbounded.variable} ${montserrat.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {process.env.DISABLE_PRELOADER !== "1" && <Preloader />}
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer manager={c.manager} channel={c.channel} />
          </div>
          <SupportFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
