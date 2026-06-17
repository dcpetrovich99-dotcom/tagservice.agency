"use client";

import { motion } from "framer-motion";

// Діаграма процесу агенції: Запит → Обробка → Стратегія → (Розробка ↔ без
// розробки) → Трафік → Ліди. Вилка показує, що розробка опційна — можна
// одразу йти у трафік.

const LINE = "linear-gradient(180deg, rgba(84,216,246,0.7), rgba(124,84,236,0.55))";
const HLINE = "linear-gradient(90deg, rgba(84,216,246,0.7), rgba(124,84,236,0.55))";

function VLine() {
  return <span className="h-5 w-px" style={{ background: LINE }} aria-hidden />;
}

function Node({
  n,
  label,
  final,
}: {
  n: string;
  label: string;
  final?: boolean;
}) {
  return (
    <div
      className="flex w-full items-center gap-3 rounded-xl border px-4 py-3"
      style={{
        borderColor: final ? "var(--brand-strong)" : "rgba(255,255,255,0.12)",
        background: final
          ? "linear-gradient(120deg, rgba(49,168,255,0.18), rgba(118,103,255,0.14))"
          : "rgba(255,255,255,0.035)",
      }}
    >
      <span className="num-accent text-[11px]" style={{ color: "var(--brand-strong)" }}>
        {n}
      </span>
      <span className="text-sm font-semibold">{label}</span>
      {final && <span className="ml-auto text-base">🎯</span>}
    </div>
  );
}

export default function ProcessFlow({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  const T = {
    title: uk ? "Як ми працюємо" : "Как мы работаем",
    request: uk ? "Запит" : "Запрос",
    process: uk ? "Обробка" : "Обработка",
    strategy: uk ? "Стратегія" : "Стратегия",
    dev: uk ? "Розробка" : "Разработка",
    devNote: uk ? "за потреби" : "при необх.",
    skip: uk ? "без розробки" : "без разработки",
    traffic: uk ? "Трафік" : "Трафик",
    leads: uk ? "Ліди" : "Лиды",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="dark-panel relative mx-auto w-full max-w-[430px] rounded-[1.8rem] border border-white/10 p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-strong)" }} />
        {T.title}
      </div>

      <div className="flex flex-col items-center">
        <Node n="01" label={T.request} />
        <VLine />
        <Node n="02" label={T.process} />
        <VLine />
        <Node n="03" label={T.strategy} />

        {/* split connector */}
        <div className="relative h-6 w-full" aria-hidden>
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2" style={{ background: LINE }} />
          <span className="absolute left-1/4 right-1/4 top-3 h-px" style={{ background: HLINE }} />
          <span className="absolute left-1/4 top-3 h-3 w-px" style={{ background: LINE }} />
          <span className="absolute right-1/4 top-3 h-3 w-px" style={{ background: LINE }} />
        </div>

        {/* fork: розробка vs без розробки */}
        <div className="grid w-full grid-cols-2 gap-3">
          <div
            className="flex flex-col items-center gap-1 rounded-xl border border-dashed px-3 py-3 text-center"
            style={{ borderColor: "rgba(124,84,236,0.55)", background: "rgba(124,84,236,0.08)" }}
          >
            <span className="text-sm font-semibold">{T.dev}</span>
            <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
              {T.devNote}
            </span>
          </div>
          <div
            className="flex items-center justify-center rounded-xl border px-3 py-3 text-center"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              {T.skip}
            </span>
          </div>
        </div>

        {/* merge connector */}
        <div className="relative h-6 w-full" aria-hidden>
          <span className="absolute left-1/4 top-0 h-3 w-px" style={{ background: LINE }} />
          <span className="absolute right-1/4 top-0 h-3 w-px" style={{ background: LINE }} />
          <span className="absolute left-1/4 right-1/4 top-3 h-px" style={{ background: HLINE }} />
          <span className="absolute left-1/2 top-3 h-3 w-px -translate-x-1/2" style={{ background: LINE }} />
        </div>

        <Node n="04" label={T.traffic} />
        <VLine />
        <Node n="05" label={T.leads} final />
      </div>
    </motion.div>
  );
}
