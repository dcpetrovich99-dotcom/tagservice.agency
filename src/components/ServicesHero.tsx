"use client";

import { motion } from "framer-motion";

const CHIPS = [
  { label: "Платний трафік", x: "8%", y: "18%", d: 0 },
  { label: "TG Ads", x: "22%", y: "38%", d: 0.08 },
  { label: "Meta Ads", x: "6%", y: "56%", d: 0.16 },
  { label: "Google Ads", x: "28%", y: "62%", d: 0.04 },
  { label: "TG-розсилки", x: "48%", y: "14%", d: 0.12 },
  { label: "Авто-коментинг", x: "55%", y: "44%", d: 0.06 },
  { label: "Лендінги та сайти", x: "65%", y: "22%", d: 0.2 },
  { label: "CRM-системи", x: "72%", y: "58%", d: 0.1 },
  { label: "Telegram Bot", x: "82%", y: "36%", d: 0.18 },
  { label: "Креативи", x: "38%", y: "72%", d: 0.14 },
  { label: "Відео-крео", x: "56%", y: "76%", d: 0.08 },
  { label: "SMM", x: "80%", y: "68%", d: 0.22 },
  { label: "Під ключ", x: "16%", y: "78%", d: 0.3 },
];

export default function ServicesHero({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  return (
    <section className="relative isolate h-[520px] w-full overflow-hidden sm:h-[580px] lg:h-[640px]">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #020818 0%, #050f26 35%, #071835 65%, #0a1f3c 100%)",
        }}
      />

      {/* Stars layer */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 55 }).map((_, i) => (
          <circle
            key={i}
            cx={`${(i * 137.5) % 100}%`}
            cy={`${(i * 79.3) % 55}%`}
            r={(i % 3 === 0 ? 1.2 : 0.7)}
            fill={`rgba(180,230,255,${0.15 + (i % 4) * 0.12})`}
          />
        ))}
      </svg>

      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-[10%] top-[8%] h-64 w-64 rounded-full bg-[rgba(49,168,255,0.20)] blur-[90px]" />
      <div className="pointer-events-none absolute right-[15%] top-[5%] h-80 w-80 rounded-full bg-[rgba(118,103,255,0.18)] blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[5%] left-[40%] h-56 w-56 rounded-full bg-[rgba(40,230,195,0.12)] blur-[80px]" />

      {/* SVG Mountains */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a6e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#050b18" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e4d8c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#050b18" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mtn-front" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#31a8ff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1a5ca8" stopOpacity="1" />
            <stop offset="100%" stopColor="#050b18" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mtn-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8e8ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#31a8ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far range */}
        <path
          d="M0,200 L80,160 L180,190 L280,130 L380,170 L480,110 L580,150 L680,90 L780,140 L880,100 L980,145 L1080,85 L1180,130 L1280,95 L1380,140 L1440,120 L1440,320 L0,320 Z"
          fill="url(#mtn-far)"
        />

        {/* Mid range */}
        <path
          d="M0,240 L60,200 L140,230 L240,170 L340,210 L440,155 L560,195 L660,145 L760,185 L860,150 L960,185 L1060,140 L1160,175 L1260,150 L1360,180 L1440,160 L1440,320 L0,320 Z"
          fill="url(#mtn-mid)"
        />

        {/* Front range (brand cyan tops) */}
        <path
          d="M0,290 L70,250 L160,275 L260,220 L360,260 L460,205 L560,248 L660,200 L760,242 L860,208 L960,245 L1060,198 L1160,238 L1260,210 L1360,248 L1440,230 L1440,320 L0,320 Z"
          fill="url(#mtn-front)"
        />

        {/* Snow caps — tallest peaks */}
        <path
          d="M460,205 L480,218 L500,205 Z"
          fill="url(#mtn-snow)"
          opacity="0.85"
        />
        <path
          d="M660,200 L678,213 L696,200 Z"
          fill="url(#mtn-snow)"
          opacity="0.8"
        />
        <path
          d="M1060,198 L1078,212 L1096,198 Z"
          fill="url(#mtn-snow)"
          opacity="0.85"
        />
        <path
          d="M280,220 L296,232 L312,220 Z"
          fill="url(#mtn-snow)"
          opacity="0.7"
        />
      </svg>

      {/* Floating service chips */}
      {CHIPS.map((c, i) => (
        <motion.span
          key={c.label}
          className="absolute hidden rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-50/80 backdrop-blur-md md:inline-block"
          style={{ left: c.x, top: c.y }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: c.d + 0.3 }}
        >
          {c.label}
        </motion.span>
      ))}

      {/* Central headline */}
      <div className="absolute inset-x-0 top-0 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--brand-strong)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TAG SERVICE AGENCY
        </motion.div>
        <motion.h1
          className="hero-title mt-4 text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.96]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.1 }}
        >
          {uk ? "Все що потрібно" : "Всё что нужно"}
          <br />
          <span
            style={{
              backgroundImage:
                "linear-gradient(115deg, var(--brand-strong), var(--accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {uk ? "для росту бізнесу" : "для роста бизнеса"}
          </span>
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-base text-[var(--text-muted)] sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {uk
            ? "Трафік, платформи, автоматизація — одна команда для всього стеку."
            : "Трафик, платформы, автоматизация — одна команда для всего стека."}
        </motion.p>
      </div>
    </section>
  );
}
