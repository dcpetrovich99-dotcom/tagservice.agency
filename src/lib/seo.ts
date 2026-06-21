import { env } from "./env";

// Канонічний домен сайту. На проді став APP_HOST=tagservice.agency.
export const SITE_URL =
  env.appHost && !env.appHost.includes("localhost")
    ? `https://${env.appHost.replace(/^https?:\/\//, "")}`
    : "https://tagservice.agency";

export const SITE_NAME = "TAG Service";

// Профілі/соцмережі для sameAs (structured data). Онови за наявності.
export const SAME_AS = ["https://t.me/tag_support"];

type Locale = "uk" | "ru";

// Локалізовані SEO-тексти. Акцент: Україна, маркетингове агентство, трафік, реклама.
export const SEO: Record<
  Locale,
  { title: string; description: string; keywords: string[]; ogLocale: string }
> = {
  uk: {
    title:
      "TAG Service — маркетингове агентство: трафік, реклама, лідогенерація в Україні",
    description:
      "Маркетингове агентство TAG Service: налаштування реклами та трафіку під ключ — Google Ads, Meta (Instagram/Facebook), Telegram Ads, лідогенерація, SMM, CRM, лендінги й сайти. Працюємо по всій Україні. Прорахунок лідів за 3 секунди.",
    keywords: [
      "маркетингове агентство",
      "маркетингове агентство Україна",
      "таргетована реклама",
      "налаштування реклами",
      "трафік",
      "лідогенерація",
      "залучення клієнтів",
      "Google Ads Україна",
      "реклама Instagram",
      "реклама Facebook",
      "Meta Ads",
      "Telegram Ads",
      "контекстна реклама",
      "таргет",
      "SMM просування",
      "діджитал агенція",
      "performance marketing",
      "реклама під ключ",
      "замовити рекламу",
      "ліди",
    ],
    ogLocale: "uk_UA",
  },
  ru: {
    title:
      "TAG Service — маркетинговое агентство: трафик, реклама, лидогенерация в Украине",
    description:
      "Маркетинговое агентство TAG Service: настройка рекламы и трафика под ключ — Google Ads, Meta (Instagram/Facebook), Telegram Ads, лидогенерация, SMM, CRM, лендинги и сайты. Работаем по всей Украине. Расчёт лидов за 3 секунды.",
    keywords: [
      "маркетинговое агентство",
      "маркетинговое агентство Украина",
      "таргетированная реклама",
      "настройка рекламы",
      "трафик",
      "лидогенерация",
      "привлечение клиентов",
      "Google Ads Украина",
      "реклама Instagram",
      "реклама Facebook",
      "Meta Ads",
      "Telegram Ads",
      "контекстная реклама",
      "таргет",
      "SMM продвижение",
      "диджитал агентство",
      "performance marketing",
      "реклама под ключ",
      "заказать рекламу",
      "лиды",
    ],
    ogLocale: "ru_RU",
  },
};

// Абсолютний URL для зображення/сторінки.
export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Дефолтне OG-зображення (банер із горами вже є у public).
export const OG_IMAGE = abs("/services-hero.png");

// Хелпер метаданих для окремої сторінки (canonical + OG + hreflang).
export function pageMetadata(
  locale: Locale,
  opts: { title: string; description: string; path: string },
) {
  const url = `${SITE_URL}/${locale}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: {
        uk: `${SITE_URL}/uk${opts.path}`,
        ru: `${SITE_URL}/ru${opts.path}`,
        "x-default": `${SITE_URL}/uk${opts.path}`,
      },
    },
    openGraph: {
      type: "website" as const,
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      url,
      locale: SEO[locale].ogLocale,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE],
    },
  };
}

// JSON-LD: організація + сайт + профіль послуг. Вставляється в <head>.
export function organizationJsonLd(locale: Locale) {
  const s = SEO[locale];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: abs("/icon.svg"),
        image: OG_IMAGE,
        description: s.description,
        slogan:
          locale === "uk"
            ? "Підкорюємо усі вершини маркетингу"
            : "Покоряем все вершины маркетинга",
        sameAs: SAME_AS,
        areaServed: [
          { "@type": "Country", name: "Ukraine" },
          { "@type": "Country", name: "Україна" },
        ],
        knowsAbout: s.keywords,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          url: "https://t.me/tag_support",
          availableLanguage: ["uk", "ru"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: locale === "uk" ? "uk-UA" : "ru-RU",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
