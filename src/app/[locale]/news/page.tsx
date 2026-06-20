import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getNews, getPageBanners, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/PageHero";
import SmartMedia from "@/components/SmartMedia";
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

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} bannerUrl={banners.news} />

      <div className="container-x pb-20">
        {/* Головна публікація */}
        {featured && (
          <Reveal>
            <Link
              href={`/news/${featured.slug}`}
              className="group mt-2 block overflow-hidden rounded-[1.6rem] border border-white/10 transition-transform hover:-translate-y-1"
              style={{ background: "var(--surface)" }}
            >
              {featured.coverUrl && (
                <div className="relative aspect-[21/9] w-full" style={{ background: "var(--surface-2)" }}>
                  <SmartMedia
                    src={featured.coverUrl}
                    alt={pickL(featured, "title", L)}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
                </div>
              )}
              <div className="p-7 sm:p-9">
                <span
                  className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderColor: "var(--border)", color: "var(--brand-strong)" }}
                >
                  {L === "uk" ? "Нова публікація" : "Новая публикация"}
                </span>
                <h2 className="h-display mt-4 text-2xl sm:text-3xl lg:text-4xl">
                  {pickL(featured, "title", L)}
                </h2>
                <p className="text-muted mt-3 line-clamp-2 max-w-2xl text-base leading-7">
                  {pickL(featured, "body", L).slice(0, 220)}…
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-muted text-xs">
                    {new Date(featured.publishedAt).toLocaleDateString(L)}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--brand-strong)" }}>
                    {t("readMore")} →
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Решта публікацій */}
        {rest.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <Link
                  href={`/news/${p.slug}`}
                  className="card group flex h-full flex-col overflow-hidden p-0 transition-transform hover:-translate-y-1"
                >
                  {p.coverUrl ? (
                    <div className="relative aspect-[16/9] w-full" style={{ background: "var(--surface-2)" }}>
                      <SmartMedia
                        src={p.coverUrl}
                        alt={pickL(p, "title", L)}
                        fill
                        sizes="(max-width:1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex aspect-[16/9] w-full items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(49,168,255,0.18), rgba(118,103,255,0.14))",
                      }}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                        TAG SERVICE
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-muted text-xs">
                      {new Date(p.publishedAt).toLocaleDateString(L)}
                    </span>
                    <h3 className="h-display mt-2 flex-1 text-lg leading-snug">
                      {pickL(p, "title", L)}
                    </h3>
                    <span
                      className="mt-4 inline-block text-sm font-semibold"
                      style={{ color: "var(--brand-strong)" }}
                    >
                      {t("readMore")} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-muted mt-10">
            {L === "uk"
              ? "Скоро буде перша публікація."
              : "Скоро выйдет первая публикация."}
          </p>
        )}
      </div>
    </>
  );
}
