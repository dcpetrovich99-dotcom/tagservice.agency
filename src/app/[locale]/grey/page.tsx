import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getNiches, getPageBanners, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/PageHero";
import NicheCard from "@/components/NicheCard";
import Reveal from "@/components/Reveal";

const TG = "https://t.me/tag_support";

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
  const [niches, banners] = await Promise.all([getNiches("grey"), getPageBanners()]);

  return (
    <div
      data-theme="grey"
      style={{
        background:
          "radial-gradient(800px 400px at 80% 0%, rgba(58,166,221,0.10), transparent 60%), var(--bg)",
        color: "var(--text)",
      }}
    >
      <PageHero
        kicker={tcommon("ctaConsult")}
        title={t("title")}
        subtitle={t("subtitle")}
        bannerUrl={banners.grey}
      />
      <div className="container-x pb-16">
        <div className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {niches.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.04}>
              <NicheCard
                name={pickL(n, "name", L)}
                description={pickL(n, "description", L)}
                imageUrl={n.imageUrl}
                tgLabel={L === "uk" ? "Обговорити в Telegram" : "Обсудить в Telegram"}
                tgHref={TG}
              />
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
