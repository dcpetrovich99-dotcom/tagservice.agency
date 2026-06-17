import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getNews, getPageBanners, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("news");
  const [posts, banners] = await Promise.all([getNews(), getPageBanners()]);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} bannerUrl={banners.news} />
      <div className="container-x pb-16">
      <div className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.04}>
            <Link
              href={`/news/${p.slug}`}
              className="card block h-full p-6 transition-transform hover:-translate-y-1"
            >
              <div className="text-muted text-xs">
                {new Date(p.publishedAt).toLocaleDateString(L)}
              </div>
              <h3 className="h-display mt-2 text-lg">{pickL(p, "title", L)}</h3>
              <span
                className="mt-4 inline-block text-sm font-semibold"
                style={{ color: "var(--brand-strong)" }}
              >
                {t("readMore")} →
              </span>
            </Link>
          </Reveal>
        ))}
        {posts.length === 0 && (
          <p className="text-muted">
            {L === "uk"
              ? "Новини додаються в адмінці → News."
              : "Новости добавляются в админке → News."}
          </p>
        )}
      </div>
      </div>
    </>
  );
}
