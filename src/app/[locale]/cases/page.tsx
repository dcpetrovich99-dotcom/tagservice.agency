import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getCases, pickL } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import CaseCard from "@/components/CaseCard";

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
  const cases = await getCases();

  return (
    <div className="container-x section">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <CaseCard
            key={c.id}
            toggleLabel={t("detailsToggle")}
            ctaLine={t("ctaLine")}
            openLabel={tcommon("openTelegram")}
            item={{
              id: c.id,
              title: pickL(c, "title", L),
              niche: pickL(c, "niche", L),
              metrics: pickL(c, "metrics", L),
              details: pickL(c, "details", L),
              tgLink: c.tgLink,
              creoImageUrl: c.creoImageUrl,
            }}
          />
        ))}
        {cases.length === 0 && (
          <p className="text-muted">
            {L === "uk"
              ? "Кейси додаються в адмінці → Cases."
              : "Кейсы добавляются в админке → Cases."}
          </p>
        )}
      </div>
    </div>
  );
}
