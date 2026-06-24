"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Діаграма процесу агенції: Запит → Обробка → Стратегія → (Розробка ↔ без
// розробки) → Трафік → Ліди. Вилка показує, що розробка опційна — можна
// одразу йти у трафік. Картки — об'ємний glassmorphism, з'єднані анімованими
// «ланцюжками» (криві SVG з рухомим імпульсом).

const STROKE_FROM = "rgba(120,215,255,0.85)";
const STROKE_TO = "rgba(124,84,236,0.7)";

const GLASS =
  "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))";
const RAISE =
  "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.04), 0 16px 34px -22px rgba(2,8,20,0.95), 0 5px 14px -9px rgba(0,0,0,0.6)";

type IconKey = "request" | "process" | "strategy" | "dev" | "skip" | "traffic" | "leads";

function Icon({ k }: { k: IconKey }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (k) {
    case "request":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
        </svg>
      );
    case "process":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "strategy":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    case "dev":
      return (
        <svg {...common}>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      );
    case "skip":
      return (
        <svg {...common}>
          <path d="M5 5v14M19 5v14M5 12l8-6v12l-8-6Z" />
        </svg>
      );
    case "traffic":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M17 8h4v4" />
        </svg>
      );
    case "leads":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3.2" />
          <path d="m17 11 2 2 4-4" />
        </svg>
      );
  }
}

function Node({
  n,
  title,
  subtitle,
  icon,
  final,
}: {
  n: string;
  title: string;
  subtitle: string;
  icon: IconKey;
  final?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 lg:py-2.5"
      style={{
        background: final
          ? "linear-gradient(120deg, rgba(49,168,255,0.22), rgba(118,103,255,0.16))"
          : GLASS,
        border: `1px solid ${
          final
            ? "color-mix(in srgb, var(--brand-strong) 55%, transparent)"
            : "var(--glass-border)"
        }`,
        boxShadow: final
          ? `${RAISE}, 0 0 34px -6px rgba(120,215,255,0.5)`
          : RAISE,
      }}
    >
      <span
        className="grid h-9 w-10 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold tabular-nums"
        style={{
          background: "linear-gradient(135deg, var(--brand-strong), var(--accent))",
          color: "#05101e",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 14px -8px rgba(120,215,255,0.7)",
        }}
      >
        {n}
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold leading-tight">{title}</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-muted)]">
          {subtitle}
        </div>
      </div>

      <span
        className="shrink-0 transition-colors"
        style={{ color: final ? "var(--brand-strong)" : "rgba(138,164,192,0.7)" }}
      >
        <Icon k={icon} />
      </span>
    </motion.div>
  );
}

// Вертикальний «ланцюжок» з рухомим імпульсом. Висота адаптивна (нижча на
// десктопі, щоб діаграма вміщалась в екран); анімація у відсотках, тож не
// залежить від конкретної висоти.
function VChain() {
  return (
    <div
      className="relative my-1 h-6 w-[2px] overflow-visible rounded-full lg:my-0.5 lg:h-3.5"
      style={{ background: `linear-gradient(180deg, ${STROKE_FROM}, ${STROKE_TO})` }}
      aria-hidden
    >
      <motion.span
        className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
        style={{
          background: "var(--brand-strong)",
          boxShadow: "0 0 10px 2px rgba(120,215,255,0.85)",
        }}
        initial={{ top: "-20%", opacity: 0 }}
        animate={{ top: ["-20%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
      />
    </div>
  );
}

// Розгалуження / злиття — криві SVG з анімованим «потоком» по лінії.
function ForkChain({ merge = false }: { merge?: boolean }) {
  const paths = merge
    ? ["M25 2 C25 22 50 18 50 34 L50 42", "M75 2 C75 22 50 18 50 34"]
    : ["M50 2 L50 8 C50 26 25 22 25 42", "M50 8 C50 26 75 22 75 42"];
  return (
    <svg
      className="my-0.5 h-11 w-full lg:h-7"
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="forkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={STROKE_FROM} />
          <stop offset="100%" stopColor={STROKE_TO} />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path
            d={d}
            fill="none"
            stroke="url(#forkGrad)"
            strokeWidth={1.6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.55}
          />
          <motion.path
            d={d}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth={1.8}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="5 13"
            initial={{ strokeDashoffset: 18 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.25 }}
          />
        </g>
      ))}
    </svg>
  );
}

function ForkCard({
  title,
  subtitle,
  badge,
  icon,
  dashed,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  icon: IconKey;
  dashed?: boolean;
}): ReactNode {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="flex flex-col gap-1.5 rounded-2xl px-3.5 py-3.5 text-center lg:gap-1 lg:py-2.5"
      style={{
        background: dashed ? "rgba(124,84,236,0.10)" : GLASS,
        border: dashed
          ? "1px dashed color-mix(in srgb, var(--accent) 60%, transparent)"
          : "1px solid var(--glass-border)",
        boxShadow: RAISE,
      }}
    >
      <span
        className="mx-auto"
        style={{ color: dashed ? "var(--accent)" : "rgba(138,164,192,0.8)" }}
      >
        <Icon k={icon} />
      </span>
      <span className="text-[13.5px] font-semibold leading-tight">{title}</span>
      <span className="text-[10.5px] leading-snug text-[var(--text-muted)]">
        {subtitle}
      </span>
      {badge && (
        <span
          className="mx-auto rounded-full px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em]"
          style={{
            background: "color-mix(in srgb, var(--accent) 22%, transparent)",
            color: "color-mix(in srgb, var(--brand-strong) 70%, #fff)",
          }}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );
}

export default function ProcessFlow({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  const T = {
    title: uk ? "Як ми працюємо" : "Как мы работаем",
    steps: uk
      ? [
          { n: "01", t: "Запит", s: "Ви лишаєте заявку — ми вивчаємо нішу й мету", i: "request" as const },
          { n: "02", t: "Обробка", s: "Аналізуємо ринок, конкурентів і вашу воронку", i: "process" as const },
          { n: "03", t: "Стратегія", s: "План каналів, бюджетів і KPI під результат", i: "strategy" as const },
        ]
      : [
          { n: "01", t: "Запрос", s: "Вы оставляете заявку — мы изучаем нишу и цель", i: "request" as const },
          { n: "02", t: "Обработка", s: "Анализируем рынок, конкурентов и вашу воронку", i: "process" as const },
          { n: "03", t: "Стратегия", s: "План каналов, бюджетов и KPI под результат", i: "strategy" as const },
        ],
    dev: {
      t: uk ? "Розробка" : "Разработка",
      s: uk ? "Сайт чи сервіс під трафік" : "Сайт или сервис под трафик",
      badge: uk ? "за потреби" : "при необх.",
    },
    skip: {
      t: uk ? "Без розробки" : "Без разработки",
      s: uk ? "Вже є посадкова — йдемо в трафік" : "Уже есть посадочная — в трафик",
    },
    traffic: {
      n: "04",
      t: uk ? "Трафік" : "Трафик",
      s: uk ? "Запускаємо рекламу й оптимізуємо звʼязки" : "Запускаем рекламу и оптимизируем связки",
    },
    leads: {
      n: "05",
      t: uk ? "Ліди" : "Лиды",
      s: uk ? "Стабільний потік заявок і продажів" : "Стабильный поток заявок и продаж",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="dark-panel relative mx-auto w-full max-w-[440px] rounded-[1.9rem] p-6 sm:p-7 lg:max-w-none lg:p-5"
    >
      <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)] lg:mb-4">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-strong)" }} />
        {T.title}
      </div>

      <div className="flex flex-col items-center">
        <Node n={T.steps[0].n} title={T.steps[0].t} subtitle={T.steps[0].s} icon={T.steps[0].i} />
        <VChain />
        <Node n={T.steps[1].n} title={T.steps[1].t} subtitle={T.steps[1].s} icon={T.steps[1].i} />
        <VChain />
        <Node n={T.steps[2].n} title={T.steps[2].t} subtitle={T.steps[2].s} icon={T.steps[2].i} />

        <ForkChain />

        <div className="grid w-full grid-cols-2 items-stretch gap-3">
          <ForkCard title={T.dev.t} subtitle={T.dev.s} badge={T.dev.badge} icon="dev" dashed />
          <ForkCard title={T.skip.t} subtitle={T.skip.s} icon="skip" />
        </div>

        <ForkChain merge />

        <Node n={T.traffic.n} title={T.traffic.t} subtitle={T.traffic.s} icon="traffic" />
        <VChain />
        <Node n={T.leads.n} title={T.leads.t} subtitle={T.leads.s} icon="leads" final />
      </div>
    </motion.div>
  );
}
