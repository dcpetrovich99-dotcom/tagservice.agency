import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import {
  getHeroBanners,
  getTeam,
  getReviews,
  getCases,
  getNews,
  getFaq,
  getSettings,
  pickL,
  setting,
} from "@/lib/content";
import { Link } from "@/i18n/navigation";
import HeroBanners from "@/components/HeroBanners";
import SectionHeading from "@/components/SectionHeading";
import TeamGrid from "@/components/TeamGrid";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import CaseCard from "@/components/CaseCard";
import QuizForm from "@/components/QuizForm";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const PLACEMENTS = [
  "tiktok",
  "google",
  "facebook",
  "instagram",
  "pinterest",
  "telegram",
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("home");
  const tp = await getTranslations("placements");
  const tc = await getTranslations("cases");
  const tn = await getTranslations("news");
  const tcommon = await getTranslations("common");

  const [banners, team, reviews, cases, news, faq, settings] =
    await Promise.all([
      getHeroBanners(),
      getTeam(),
      getReviews(),
      getCases(3),
      getNews(3),
      getFaq(),
      getSettings(),
    ]);

  const heroItems = banners.map((b) => ({
    placement: tp(b.placement),
    title: pickL(b, "title", L),
    text: pickL(b, "text", L),
    imageUrl: b.imageUrl,
  }));

  return (
    <>
      {/* HERO */}
      <section className="container-x pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="badge">{t("heroKicker")}</span>
            <h1 className="h-display mt-4 text-4xl sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="text-muted mt-4 max-w-xl text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contacts" className="btn btn-primary">
                {tcommon("ctaConsult")}
              </Link>
              <Link href="/cases" className="btn btn-ghost">
                {t("viewAllCases")}
              </Link>
            </div>
          </div>
          <div className="anim-float">
            {heroItems.length > 0 ? (
              <HeroBanners items={heroItems} />
            ) : (
              <div
                className="flex items-center justify-center rounded-3xl border p-10 text-center"
                style={{
                  minHeight: 380,
                  background:
                    "linear-gradient(135deg,var(--brand),var(--brand-strong))",
                  color: "#fff",
                }}
              >
                <div>
                  <div className="h-display text-2xl">TikTok · Google · FB</div>
                  <div className="h-display text-2xl">
                    Instagram · Pinterest · Telegram
                  </div>
                  <p className="mt-3 text-sm opacity-80">
                    {tcommon("loading")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section container-x">
        <Reveal>
          <SectionHeading title={t("aboutTitle")} />
          <p className="text-muted mt-5 max-w-3xl whitespace-pre-line text-lg">
            {setting(
              settings,
              "about",
              L,
              L === "uk"
                ? "Ми — команда перформанс-маркетингу. Приводимо цільовий трафік і беремо проєкт під ключ: від креативів і налаштування до аналітики й масштабування. Текст редагується в адмінці → Settings → ключ «about»."
                : "Мы — команда перформанс-маркетинга. Приводим целевой трафик и берём проект под ключ: от креативов и настройки до аналитики и масштабирования. Текст редактируется в админке → Settings → ключ «about».",
            )}
          </p>
        </Reveal>
      </section>

      {/* PLACEMENTS */}
      <section className="section container-x">
        <SectionHeading title={t("placementsTitle")} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PLACEMENTS.map((p, idx) => (
            <Reveal key={p} delay={idx * 0.05}>
              <div className="card flex h-full flex-col gap-2 p-6">
                <span
                  className="num-accent text-sm"
                  style={{ color: "var(--brand-strong)" }}
                >
                  0{idx + 1}
                </span>
                <span className="h-display text-lg">{tp(p)}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM */}
      {team.length > 0 && (
        <section className="section container-x">
          <SectionHeading title={t("teamTitle")} />
          <div className="mt-8">
            <TeamGrid
              members={team.map((m) => ({
                id: m.id,
                name: pickL(m, "name", L),
                role: pickL(m, "role", L),
                photoUrl: m.photoUrl,
              }))}
            />
          </div>
        </section>
      )}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="section container-x">
          <SectionHeading title={t("reviewsTitle")} />
          <div className="mt-8">
            <Reviews
              items={reviews.map((r) => ({ id: r.id, imageUrl: r.imageUrl }))}
            />
          </div>
        </section>
      )}

      {/* QUIZ */}
      <section className="section container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <SectionHeading
            kicker={tcommon("ctaConsult")}
            title={t("heroTitle")}
            subtitle={t("heroSubtitle")}
          />
          <QuizForm sourcePage="home" />
        </div>
      </section>

      {/* CASES TEASER */}
      {cases.length > 0 && (
        <section className="section container-x">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading title={t("casesTeaserTitle")} />
            <Link
              href="/cases"
              className="btn btn-ghost hidden shrink-0 sm:inline-flex"
            >
              {t("viewAllCases")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <CaseCard
                key={c.id}
                toggleLabel={tc("detailsToggle")}
                ctaLine={tc("ctaLine")}
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
          </div>
        </section>
      )}

      {/* NEWS TEASER */}
      {news.length > 0 && (
        <section className="section container-x">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading title={t("newsTeaserTitle")} />
            <Link
              href="/news"
              className="btn btn-ghost hidden shrink-0 sm:inline-flex"
            >
              {t("viewAllNews")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {news.map((p) => (
              <Link
                key={p.id}
                href={`/news/${p.slug}`}
                className="card block p-5 transition-transform hover:-translate-y-1"
              >
                <div className="text-muted text-xs">
                  {new Date(p.publishedAt).toLocaleDateString(L)}
                </div>
                <div className="h-display mt-2 text-lg">
                  {pickL(p, "title", L)}
                </div>
                <span
                  className="mt-3 inline-block text-sm font-semibold"
                  style={{ color: "var(--brand-strong)" }}
                >
                  {tn("readMore")} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="section container-x">
          <SectionHeading title={t("faqTitle")} center />
          <div className="mx-auto mt-8 max-w-3xl">
            <Faq
              items={faq.map((f) => ({
                id: f.id,
                q: pickL(f, "question", L),
                a: pickL(f, "answer", L),
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
