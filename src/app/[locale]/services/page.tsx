import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getSettings, setting } from "@/lib/content";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import ServicesHero from "@/components/ServicesHero";
import ServicesCarousel from "@/components/ServicesCarousel";
import LeadCalculator from "@/components/LeadCalculator";
import Faq from "@/components/Faq";

// SEO-FAQ для сторінки послуг (видимий акордеон + FAQPage JSON-LD).
const FAQ: Record<"uk" | "ru", { id: string; q: string; a: string }[]> = {
  uk: [
    { id: "what", q: "Які послуги надає TAG Service?", a: "Налаштування реклами й трафіку під ключ: Google Ads, Meta (Instagram/Facebook), Telegram Ads, лідогенерація, SMM, CRM, лендінги та сайти. Можемо вести як окремий напрям, так і весь маркетинг під ключ." },
    { id: "price", q: "Скільки коштує реклама та ваші послуги?", a: "Бюджет залежить від ніші, гео та цілей. На сторінці є калькулятор: вкажіть нішу й денний бюджет — за 3 секунди покажемо орієнтовний прогноз лідів. Точну вартізь робіт узгоджуємо після короткого брифу." },
    { id: "geo", q: "З якими гео ви працюєте?", a: "Україна, Європа (ЄС), Казахстан та інші регіони. Для кожного гео враховуємо свою вартість ліда — це теж видно в калькуляторі." },
    { id: "speed", q: "Як швидко будуть перші ліди?", a: "Зазвичай перші заявки йдуть у перші 1–3 дні після запуску кампаній. Перший тиждень — це тести й оптимізація зв'язок під вашу нішу." },
    { id: "niches", q: "З якими нішами працюєте?", a: "Білі ніші (б'юті, нерухомість, HoReCa, туризм, авто, послуги) та сірі (крипта, обмінники, фінанси тощо). Підбираємо канал трафіку під специфіку ніші." },
  ],
  ru: [
    { id: "what", q: "Какие услуги предоставляет TAG Service?", a: "Настройка рекламы и трафика под ключ: Google Ads, Meta (Instagram/Facebook), Telegram Ads, лидогенерация, SMM, CRM, лендинги и сайты. Ведём как отдельное направление, так и весь маркетинг под ключ." },
    { id: "price", q: "Сколько стоит реклама и ваши услуги?", a: "Бюджет зависит от ниши, гео и целей. На странице есть калькулятор: укажите нишу и дневной бюджет — за 3 секунды покажем ориентировочный прогноз лидов. Точную стоимость работ согласуем после короткого брифа." },
    { id: "geo", q: "С какими гео вы работаете?", a: "Украина, Европа (ЕС), Казахстан и другие регионы. Для каждого гео учитываем свою стоимость лида — это тоже видно в калькуляторе." },
    { id: "speed", q: "Как быстро будут первые лиды?", a: "Обычно первые заявки идут в первые 1–3 дня после запуска кампаний. Первая неделя — тесты и оптимизация связок под вашу нишу." },
    { id: "niches", q: "С какими нишами работаете?", a: "Белые ниши (бьюти, недвижимость, HoReCa, туризм, авто, услуги) и серые (крипта, обменники, финансы и т.д.). Подбираем канал трафика под специфику ниши." },
  ],
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const L = (isLocale(locale) ? locale : "ru") as "uk" | "ru";
  return pageMetadata(L, {
    path: "/services",
    title:
      L === "uk"
        ? "Послуги: трафік, реклама та лідогенерація під ключ"
        : "Услуги: трафик, реклама и лидогенерация под ключ",
    description:
      L === "uk"
        ? "Налаштування реклами й трафіку: Google Ads, Meta (Instagram/Facebook), Telegram Ads, SMM, CRM, лендінги. Порахуйте, скільки лідів ми принесемо за ваш бюджет — за 3 секунди."
        : "Настройка рекламы и трафика: Google Ads, Meta (Instagram/Facebook), Telegram Ads, SMM, CRM, лендинги. Посчитайте, сколько лидов мы принесём за ваш бюджет — за 3 секунды.",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("services");
  const tcommon = await getTranslations("common");
  const settings = await getSettings();

  return (
    <div className="relative">
      {/* Hero пришпилений знизу — наступні блоки накладаються зверху (паралакс). */}
      <div className="sticky top-0 z-0">
        <ServicesHero locale={L} />
      </div>

      {/* Детальні послуги — опаковий блок, що «наїжджає» на банер. */}
      <section className="relative z-10 -mt-8 rounded-t-[2rem] bg-[var(--bg)] shadow-[0_-24px_60px_rgba(0,0,0,0.55)] sm:-mt-12 sm:rounded-t-[2.5rem]">
        <ServicesCarousel locale={L} />

        {/* Дисклеймер про ціни — по центру */}
        <div className="container-x pb-16">
          <div className="card surface-2 mx-auto max-w-3xl p-8 text-center">
            <p className="whitespace-pre-line text-base">
              {setting(settings, "price_disclaimer", L, t("priceNoteFallback"))}
            </p>
            <Link href="/contacts" className="btn btn-primary mx-auto mt-6">
              {tcommon("ctaConsult")}
            </Link>
          </div>
        </div>
      </section>

      {/* Калькулятор — ще один блок, що накладається зверху. */}
      <section className="relative z-20 -mt-8 rounded-t-[2rem] bg-[var(--bg)] shadow-[0_-24px_60px_rgba(0,0,0,0.55)] sm:-mt-12 sm:rounded-t-[2.5rem]">
        <LeadCalculator />

        {/* FAQ — видимий + FAQPage/Breadcrumb JSON-LD для розширених сніпетів Google. */}
        <div className="container-x pb-16">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                faqJsonLd(FAQ[L].map(({ q, a }) => ({ q, a }))),
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                breadcrumbJsonLd(L, [
                  { name: L === "uk" ? "Головна" : "Главная", path: "" },
                  { name: L === "uk" ? "Послуги" : "Услуги", path: "/services" },
                ]),
              ),
            }}
          />
          <h2 className="h-display mb-8 text-center text-2xl sm:text-3xl">
            {L === "uk" ? "Часті запитання" : "Частые вопросы"}
          </h2>
          <div className="mx-auto max-w-3xl">
            <Faq items={FAQ[L]} />
          </div>
        </div>
      </section>
    </div>
  );
}
