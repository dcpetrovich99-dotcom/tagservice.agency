import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getNiches, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function WhitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("white");
  const tcommon = await getTranslations("common");
  const niches = await getNiches("white");

  return (
    <div className="container-x section">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {niches.map((n, i) => (
          <Reveal key={n.id} delay={i * 0.04}>
            <div className="card h-full p-6">
              <h3 className="h-display text-lg">{pickL(n, "name", L)}</h3>
              <p className="text-muted mt-3 whitespace-pre-line text-sm">
                {pickL(n, "description", L)}
              </p>
            </div>
          </Reveal>
        ))}
        {niches.length === 0 && (
          <p className="text-muted">
            {L === "uk"
              ? "Ніші додаються в адмінці → Niches (тип white)."
              : "Ниши добавляются в админке → Niches (тип white)."}
          </p>
        )}
      </div>

      <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-medium">{tcommon("ctaConsult")}</p>
        <Link href="/contacts" className="btn btn-primary">
          {tcommon("ctaConsult")}
        </Link>
      </div>
    </div>
  );
}
