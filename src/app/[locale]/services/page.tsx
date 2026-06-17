import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getServices, getSettings, getPageBanners, pickL, setting } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

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
  const [services, settings, banners] = await Promise.all([
    getServices(),
    getSettings(),
    getPageBanners(),
  ]);

  return (
    <>
      <PageHero
        kicker={tcommon("ctaConsult")}
        title={t("title")}
        subtitle={t("subtitle")}
        bannerUrl={banners.services}
      />
      <div className="container-x pb-16">
      <div className="mt-2 grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.05}>
            <div className="card h-full p-6">
              <div
                className="num-accent text-sm"
                style={{ color: "var(--brand-strong)" }}
              >
                {s.icon || `0${i + 1}`}
              </div>
              <h3 className="h-display mt-2 text-xl">{pickL(s, "title", L)}</h3>
              <p className="text-muted mt-3 whitespace-pre-line">
                {pickL(s, "description", L)}
              </p>
            </div>
          </Reveal>
        ))}
        {services.length === 0 && (
          <p className="text-muted">
            {L === "uk"
              ? "Послуги додаються в адмінці → Services."
              : "Услуги добавляются в админке → Services."}
          </p>
        )}
      </div>

      <div className="card surface-2 mt-12 p-8">
        <p className="whitespace-pre-line text-base">
          {setting(settings, "price_disclaimer", L, t("priceNoteFallback"))}
        </p>
        <Link href="/contacts" className="btn btn-primary mt-5">
          {tcommon("ctaConsult")}
        </Link>
      </div>
      </div>
    </>
  );
}
