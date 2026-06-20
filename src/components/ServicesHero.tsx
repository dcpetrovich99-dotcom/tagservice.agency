"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const CHIPS = [
  { label: "Платний трафік", x: "8%", y: "20%", d: 0 },
  { label: "TG Ads", x: "24%", y: "40%", d: 0.08 },
  { label: "Meta Ads", x: "6%", y: "58%", d: 0.16 },
  { label: "Google Ads", x: "30%", y: "64%", d: 0.04 },
  { label: "TG-розсилки", x: "50%", y: "16%", d: 0.12 },
  { label: "Авто-коментинг", x: "57%", y: "46%", d: 0.06 },
  { label: "Лендінги та сайти", x: "67%", y: "24%", d: 0.2 },
  { label: "CRM-системи", x: "74%", y: "60%", d: 0.1 },
  { label: "Telegram Bot", x: "84%", y: "38%", d: 0.18 },
  { label: "Креативи", x: "40%", y: "74%", d: 0.14 },
  { label: "Відео-крео", x: "58%", y: "78%", d: 0.08 },
  { label: "SMM", x: "82%", y: "70%", d: 0.22 },
  { label: "Під ключ", x: "16%", y: "80%", d: 0.3 },
];

// Детерміновані позиції мерехтливих зірок (без гідрейшн-розбіжностей).
const STARS = Array.from({ length: 70 }).map((_, i) => ({
  cx: (i * 137.508) % 100,
  cy: (i * 41.3) % 62,
  r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6,
  dur: 1.8 + ((i * 7) % 26) / 10, // 1.8–4.4с
  delay: ((i * 13) % 30) / 10, // 0–3с
}));

export default function ServicesHero({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  return (
    <section className="relative isolate h-[540px] w-full overflow-hidden sm:h-[600px] lg:h-[660px]">
      {/* Фото-фон (нічні гори) */}
      <Image
        src="/services-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Темна вуаль під тему сайту + плавний перехід у фон сторінки */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,7,17,0.55) 0%, rgba(3,7,17,0.30) 38%, rgba(3,7,17,0.62) 78%, var(--bg) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 8%, transparent 40%, rgba(3,7,17,0.55) 100%)",
        }}
      />

      {/* Мерехтливі зірки */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={`${s.cx}%`}
            cy={`${s.cy}%`}
            r={s.r}
            fill="rgba(200,235,255,0.95)"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 0.95, 0.15] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Glow-орби в тон бренду */}
      <div className="pointer-events-none absolute left-[12%] top-[10%] h-64 w-64 rounded-full bg-[rgba(120,215,255,0.16)] blur-[100px]" />
      <div className="pointer-events-none absolute right-[14%] top-[6%] h-80 w-80 rounded-full bg-[rgba(118,103,255,0.16)] blur-[120px]" />

      {/* Плаваючі чіпи послуг */}
      {CHIPS.map((c) => (
        <motion.span
          key={c.label}
          className="absolute hidden rounded-full border border-white/15 bg-black/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-50/85 backdrop-blur-md md:inline-block"
          style={{ left: c.x, top: c.y }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: c.d + 0.3 }}
        >
          {c.label}
        </motion.span>
      ))}

      {/* Головний блок */}
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
          className="mt-4 max-w-4xl text-[clamp(1.9rem,5vw,4rem)] font-extrabold leading-[1.04] text-[var(--text)]"
          style={{ textShadow: "0 2px 30px rgba(3,7,17,0.85)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.1 }}
        >
          {uk ? "Ми підкорюємо усі " : "Мы покоряем все "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(115deg, #fff, var(--brand-strong) 55%, var(--accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {uk ? "вершини маркетингу" : "вершины маркетинга"}
          </span>
          <br />
          {uk ? "і приносимо " : "и приносим "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(115deg, var(--accent), var(--accent-2))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {uk ? "космічні результати" : "космические результаты"}
          </span>
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-base text-[var(--text)]/85 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {uk
            ? "Трафік, платформи, автоматизація — одна команда для всього стеку зростання."
            : "Трафик, платформы, автоматизация — одна команда для всего стека роста."}
        </motion.p>
        <motion.a
          href="#calculator"
          className="btn btn-primary mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {uk ? "Порахувати ліди →" : "Посчитать лиды →"}
        </motion.a>
      </div>
    </section>
  );
}
