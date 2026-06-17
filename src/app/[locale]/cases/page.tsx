import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { PROJECTS } from "@/lib/projects";
import { getCasesByCategory, getPageBanners, pickL } from "@/lib/content";
import PageHero from "@/components/PageHero";
import CasesTabs, { type TrafficCase, type WebdevCase } from "@/components/CasesTabs";

export const dynamic = "force-dynamic";

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("cases");
  const tcommon = await getTranslations("common");

  const [whiteRows, greyRows, banners] = await Promise.all([
    getCasesByCategory("white"),
    getCasesByCategory("grey"),
    getPageBanners(),
  ]);

  const webdev: WebdevCase[] = PROJECTS.map((p) => ({
    slug: p.slug,
    title: L === "uk" ? p.titleUk : p.titleRu,
    tagline: L === "uk" ? p.taglineUk : p.taglineRu,
    category: L === "uk" ? p.categoryUk : p.categoryRu,
    year: p.year,
    accent: p.accent,
    stack: p.stack,
    metrics: p.metrics.map((m) => ({
      value: m.value,
      label: L === "uk" ? m.labelUk : m.labelRu,
    })),
    liveHost: p.liveUrl ? new URL(p.liveUrl).host : undefined,
  }));

  const toTraffic = (
    rows: Awaited<ReturnType<typeof getCasesByCategory>>,
  ): TrafficCase[] =>
    rows.map((c) => ({
      id: c.id,
      title: pickL(c, "title", L),
      niche: pickL(c, "niche", L),
      metrics: pickL(c, "metrics", L),
      details: pickL(c, "details", L),
      tgLink: c.tgLink,
      creoImageUrl: c.creoImageUrl,
      bannerUrl: c.bannerUrl,
    }));

  return (
    <>
      <PageHero
        kicker={t("title")}
        title={
          L === "uk"
            ? "Реальні платформи та трафік, які ми збудували"
            : "Реальные платформы и трафик, которые мы построили"
        }
        subtitle={
          L === "uk"
            ? "Розробка, білий і сірий трафік — усе в одному місці."
            : "Разработка, белый и серый трафик — всё в одном месте."
        }
        bannerUrl={banners.cases}
      />

      <div className="container-x pb-16">
        <CasesTabs
          webdev={webdev}
          white={toTraffic(whiteRows)}
          grey={toTraffic(greyRows)}
          banners={{
            webdev: banners["cases:webdev"],
            white: banners["cases:white"],
            grey: banners["cases:grey"],
          }}
          labels={{
            webdev: L === "uk" ? "Розробка вебсайтів" : "Разработка вебсайтов",
            white: L === "uk" ? "Білий трафік" : "Белый трафик",
            grey: L === "uk" ? "Сірий трафік" : "Серый трафик",
            learnMore: tcommon("learnMore"),
            openTg: L === "uk" ? "Перейти в Telegram" : "Перейти в Telegram",
            details: L === "uk" ? "Деталі кейсу" : "Детали кейса",
            empty:
              L === "uk"
                ? "Кейси цієї підвкладки скоро з'являться."
                : "Кейсы этой подвкладки скоро появятся.",
          }}
        />
      </div>
    </>
  );
}
