import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Manrope, Unbounded, Montserrat } from "next/font/google";
import { isLocale } from "@/i18n/routing";
import { getSettings, contacts } from "@/lib/content";
import { SEO, SITE_NAME, SITE_URL, OG_IMAGE, organizationJsonLd } from "@/lib/seo";
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
  const L = (isLocale(locale) ? locale : "ru") as "uk" | "ru";
  const s = SEO[L];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: s.title,
      template: `%s · ${SITE_NAME}`,
    },
    description: s.description,
    keywords: s.keywords,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "marketing",
    alternates: {
      canonical: `${SITE_URL}/${L}`,
      languages: {
        uk: `${SITE_URL}/uk`,
        ru: `${SITE_URL}/ru`,
        "x-default": `${SITE_URL}/uk`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: s.title,
      description: s.description,
      url: `${SITE_URL}/${L}`,
      locale: s.ogLocale,
      alternateLocale: L === "uk" ? "ru_RU" : "uk_UA",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: { icon: "/icon.svg" },
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
        {/* Structured data — Organization / WebSite / ProfessionalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              organizationJsonLd(isLocale(locale) ? locale : "ru"),
            ),
          }}
        />
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
