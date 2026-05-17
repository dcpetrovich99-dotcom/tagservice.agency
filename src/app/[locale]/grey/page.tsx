import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getNiches, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function GreyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("grey");
  const tcommon = await getTranslations("common");
  const niches = await getNiches("grey");

  return (
    <div
      data-theme="grey"
      style={{
        background:
          "radial-gradient(800px 400px at 80% 0%, rgba(58,166,221,0.10), transparent 60%), var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="container-x section">
        <span className="badge">{tcommon("ctaConsult")}</span>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">{t("title")}</h1>
        <p className="text-muted mt-4 max-w-2xl text-lg">{t("subtitle")}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {niches.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.04}>
              <div
                className="card h-full p-6"
                style={{
                  background:
                    "linear-gradient(180deg, var(--surface), var(--surface-2))",
                }}
              >
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
                ? "Ніші додаються в адмінці → Niches (тип grey). Тексти заповнюєте ви."
                : "Ниши добавляются в админке → Niches (тип grey). Тексты заполняете вы."}
            </p>
          )}
        </div>

        <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-medium">{t("subtitle")}</p>
          <Link href="/contacts" className="btn btn-primary">
            {tcommon("ctaConsult")}
          </Link>
        </div>
      </div>
    </div>
  );
}
