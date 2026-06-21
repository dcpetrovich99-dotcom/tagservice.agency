import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getSettings, setting } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import ServicesHero from "@/components/ServicesHero";
import ServicesCarousel from "@/components/ServicesCarousel";
import LeadCalculator from "@/components/LeadCalculator";

export const dynamic = "force-dynamic";

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
      </section>
    </div>
  );
}
