import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { PROJECTS, projectBySlug } from "@/lib/projects";
import { Link } from "@/i18n/navigation";
import { DEMOS } from "@/components/demos";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const p = projectBySlug(slug);
  if (!p) notFound();

  const Demo = DEMOS[p.demoKey];
  const title = L === "uk" ? p.titleUk : p.titleRu;
  const tagline = L === "uk" ? p.taglineUk : p.taglineRu;
  const category = L === "uk" ? p.categoryUk : p.categoryRu;
  const problem = L === "uk" ? p.problemUk : p.problemRu;
  const solution = L === "uk" ? p.solutionUk : p.solutionRu;
  const outcomes = L === "uk" ? p.outcomesUk : p.outcomesRu;
  const note = L === "uk" ? p.noteUk : p.noteRu;

  const related = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(700px 350px at 80% 0%, ${p.accent}33, transparent 60%), radial-gradient(500px 250px at 0% 50%, ${p.accent}22, transparent 60%)`,
          }}
        />
        <div className="container-x pt-12 pb-10 sm:pt-16">
          <Link
            href="/cases"
            className="text-sm font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            ← {L === "uk" ? "Усі кейси" : "Все кейсы"}
          </Link>

          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest">
                <span style={{ color: p.accent }}>{p.year}</span>
                <span style={{ color: "var(--text-muted)" }}>·</span>
                <span style={{ color: "var(--text-muted)" }}>{category}</span>
              </div>
              <h1 className="hero-title mt-5 text-5xl sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              <p className="text-muted mt-5 max-w-xl text-lg">{tagline}</p>
            </div>

            <div className="flex flex-wrap items-end gap-x-8 gap-y-4 lg:justify-end">
              {p.metrics.map((m, i) => (
                <div key={i}>
                  <div className="num-accent text-4xl" style={{ color: p.accent }}>
                    {m.value}
                  </div>
                  <div className="text-muted mt-1 text-xs uppercase tracking-wider">
                    {L === "uk" ? m.labelUk : m.labelRu}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {L === "uk" ? "Відкрити продакшн" : "Открыть продакшн"} ↗
              </a>
            )}
            <Link href="/contacts" className="btn btn-ghost">
              {L === "uk"
                ? "Хочу таку платформу"
                : "Хочу такую платформу"}
            </Link>
            <div className="ml-auto flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="container-x pb-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {L === "uk" ? "міні-демо інтерфейсу" : "мини-демо интерфейса"}
          </div>
          {note && (
            <div className="text-xs italic" style={{ color: "var(--text-muted)" }}>
              {note}
            </div>
          )}
        </div>
        <Demo />
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="container-x section">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div
              className="num-accent text-sm uppercase tracking-widest"
              style={{ color: p.accent }}
            >
              01 — {L === "uk" ? "Проблема" : "Проблема"}
            </div>
            <h2 className="h-display mt-3 text-2xl sm:text-3xl">
              {L === "uk" ? "Що було" : "Что было"}
            </h2>
            <p className="text-muted mt-4 whitespace-pre-line text-base">
              {problem}
            </p>
          </div>
          <div>
            <div
              className="num-accent text-sm uppercase tracking-widest"
              style={{ color: p.accent }}
            >
              02 — {L === "uk" ? "Рішення" : "Решение"}
            </div>
            <h2 className="h-display mt-3 text-2xl sm:text-3xl">
              {L === "uk" ? "Що ми зробили" : "Что мы сделали"}
            </h2>
            <p className="text-muted mt-4 whitespace-pre-line text-base">
              {solution}
            </p>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="container-x section">
        <div
          className="num-accent text-sm uppercase tracking-widest"
          style={{ color: p.accent }}
        >
          03 — {L === "uk" ? "Що отримали" : "Что получили"}
        </div>
        <h2 className="h-display mt-3 text-2xl sm:text-3xl">
          {L === "uk" ? "Результати" : "Результаты"}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {outcomes.map((o, i) => (
            <div
              key={i}
              className="card flex items-start gap-4 p-6"
            >
              <span
                className="num-accent shrink-0 text-2xl"
                style={{ color: p.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base">{o}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x section">
        <div
          className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: `linear-gradient(135deg, ${p.accent}1a, transparent 60%)`,
          }}
        >
          <div>
            <div className="text-lg font-bold">
              {L === "uk"
                ? "У вас схожа задача? Обговоримо ваш проєкт."
                : "У вас похожая задача? Обсудим ваш проект."}
            </div>
            <div className="text-muted mt-1 text-sm">
              {L === "uk"
                ? "Прорахунок під ваш стек і ніша — за 24 год."
                : "Просчёт под ваш стек и ниша — за 24 ч."}
            </div>
          </div>
          <Link href="/contacts" className="btn btn-primary">
            {L === "uk" ? "Залишити заявку" : "Оставить заявку"} →
          </Link>
        </div>
      </section>

      {/* RELATED */}
      <section className="container-x section">
        <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {L === "uk" ? "інші кейси" : "другие кейсы"}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/cases/${r.slug}`}
              className="card block p-6"
            >
              <div className="text-xs font-mono uppercase tracking-widest" style={{ color: r.accent }}>
                {r.year}
              </div>
              <div className="h-display mt-2 text-lg">
                {L === "uk" ? r.titleUk : r.titleRu}
              </div>
              <div className="text-muted mt-2 line-clamp-2 text-sm">
                {L === "uk" ? r.taglineUk : r.taglineRu}
              </div>
              <span
                className="mt-4 inline-flex text-xs font-bold"
                style={{ color: r.accent }}
              >
                {L === "uk" ? "Подивитись" : "Посмотреть"} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
