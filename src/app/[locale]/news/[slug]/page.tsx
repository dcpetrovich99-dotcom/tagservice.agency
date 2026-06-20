import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import SmartMedia from "@/components/SmartMedia";
import { isLocale } from "@/i18n/routing";
import { getNewsBySlug, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

function readingMins(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("news");
  const post = await getNewsBySlug(slug);
  if (!post || !post.isPublished) notFound();

  const body = pickL(post, "body", L);
  const mins = readingMins(body);

  return (
    <article className="container-x section">
      {/* Навігація назад */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--brand-strong)" }}
      >
        ← {t("title")}
      </Link>

      {/* Мета */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted">
          {new Date(post.publishedAt).toLocaleDateString(L, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="h-3.5 w-px bg-white/20" />
        <span className="text-muted">
          {mins} {L === "uk" ? "хв читання" : "мин чтения"}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.055] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--brand-strong)" }}>
          TAG SERVICE BLOG
        </span>
      </div>

      {/* Заголовок */}
      <h1 className="h-display mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-5xl">
        {pickL(post, "title", L)}
      </h1>

      {/* Обкладинка */}
      {post.coverUrl && (
        <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10">
          <SmartMedia
            src={post.coverUrl}
            alt={pickL(post, "title", L)}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Тіло */}
      <div
        className="blog-body mt-10 max-w-3xl text-lg leading-[1.82] text-[var(--text-muted)]"
        style={{ whiteSpace: "pre-line" }}
      >
        {body}
      </div>

      {/* CTA */}
      <div
        className="mt-14 rounded-[1.4rem] border border-white/10 p-7 sm:p-9"
        style={{
          background:
            "linear-gradient(135deg, rgba(49,168,255,0.12), rgba(118,103,255,0.08))",
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {L === "uk" ? "Хочете так само?" : "Хотите так же?"}
        </p>
        <h3 className="h-display mt-3 text-xl sm:text-2xl">
          {L === "uk"
            ? "Обговоримо ваш проєкт у Telegram"
            : "Обсудим ваш проект в Telegram"}
        </h3>
        <p className="text-muted mt-2 text-sm">
          {L === "uk"
            ? "Кейс, консультація або просто запитання — пишіть, відповідаємо швидко."
            : "Кейс, консультация или просто вопрос — пишите, отвечаем быстро."}
        </p>
        <a
          href="https://t.me/tag_support"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-5"
        >
          {L === "uk" ? "Написати @tag_support" : "Написать @tag_support"} →
        </a>
      </div>

      {/* Назад */}
      <div className="mt-10">
        <Link
          href="/news"
          className="text-sm font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          ← {L === "uk" ? "Усі публікації" : "Все публикации"}
        </Link>
      </div>
    </article>
  );
}
