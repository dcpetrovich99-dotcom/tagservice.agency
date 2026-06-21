"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SERVICE_ITEMS } from "./serviceItems";

// Детерміновані позиції мерехтливих зірок (без гідрейшн-розбіжностей).
const STARS = Array.from({ length: 70 }).map((_, i) => ({
  cx: (i * 137.508) % 100,
  cy: (i * 41.3) % 62,
  r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6,
  dur: 1.8 + ((i * 7) % 26) / 10, // 1.8–4.4с
  delay: ((i * 13) % 30) / 10, // 0–3с
}));

function Sparkle({ left, top }: { left: string; top: string }) {
  return (
    <motion.svg
      className="pointer-events-none absolute hidden md:block"
      style={{ left, top, transform: "translate(-22%, -38%)" }}
      width="76"
      height="76"
      viewBox="0 0 100 100"
      aria-hidden
      initial={{ opacity: 0.4, scale: 0.85 }}
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.05, 0.85] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="spark-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#9fe2ff" />
          <stop offset="100%" stopColor="rgba(120,215,255,0)" />
        </radialGradient>
      </defs>
      <path
        d="M50 6 C53 38 62 47 94 50 C62 53 53 62 50 94 C47 62 38 53 6 50 C38 47 47 38 50 6 Z"
        fill="url(#spark-g)"
      />
    </motion.svg>
  );
}

export default function ServicesHero({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  return (
    <section className="relative isolate h-[520px] w-full overflow-hidden sm:h-[600px] lg:h-[660px]">
      {/* Фото-фон (нічні гори) */}
      <Image
        src="/services-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "50% 62%" }}
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

      {/* Комета — пролітає раз на ~5с (і на мобайлі теж) */}
      <motion.div
        className="pointer-events-none absolute left-[-12%] top-[6%] block"
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ x: ["0vw", "120vw"], y: ["0vh", "26vh"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2,
          times: [0, 0.1, 0.85, 1],
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeIn",
        }}
      >
        <div className="relative">
          {/* Хвіст */}
          <div
            className="absolute right-2 top-1/2 h-[2px] w-40 -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(159,226,255,0) 0%, rgba(159,226,255,0.75) 80%, #ffffff 100%)",
            }}
          />
          {/* Голова */}
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "#ffffff", boxShadow: "0 0 16px 4px rgba(159,226,255,0.9)" }}
          />
        </div>
      </motion.div>

      {/* Glow-орби в тон бренду */}
      <div className="pointer-events-none absolute left-[12%] top-[10%] h-64 w-64 rounded-full bg-[rgba(120,215,255,0.16)] blur-[100px]" />
      <div className="pointer-events-none absolute right-[14%] top-[6%] h-80 w-80 rounded-full bg-[rgba(118,103,255,0.16)] blur-[120px]" />

      {/* Великі зірки під обраними чіпами */}
      {SERVICE_ITEMS.filter((s) => s.big).map((s) => (
        <Sparkle key={s.id} left={s.x} top={s.y} />
      ))}

      {/* Плаваючі чіпи послуг → лінк на свою секцію нижче */}
      {SERVICE_ITEMS.map((s, i) => (
        <motion.a
          key={s.id}
          href={`#svc-${s.id}`}
          className="absolute z-20 hidden cursor-pointer rounded-full border border-white/15 bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-50/90 backdrop-blur-md transition-colors hover:border-[var(--brand-strong)] hover:text-white hover:bg-black/60 md:inline-block"
          style={{ left: s.x, top: s.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + (i % 7) * 0.04 }}
        >
          {uk ? s.chipUk : s.chipRu}
        </motion.a>
      ))}

      {/* Чіпи для мобайлу — компактний кластер по центру внизу банера */}
      <motion.div
        className="absolute inset-x-0 bottom-4 z-20 flex flex-wrap items-center justify-center gap-1.5 px-5 md:hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        {SERVICE_ITEMS.map((s) => (
          <a
            key={s.id}
            href={`#svc-${s.id}`}
            className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-cyan-50/90 backdrop-blur-md active:border-[var(--brand-strong)]"
          >
            {uk ? s.chipUk : s.chipRu}
          </a>
        ))}
      </motion.div>

      {/* Головний блок */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--brand-strong)] sm:text-[11px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TAG SERVICE AGENCY
        </motion.div>
        <motion.h1
          className="mt-3 max-w-[20rem] text-[clamp(1.5rem,5.4vw,4rem)] font-extrabold leading-[1.06] text-[var(--text)] sm:mt-4 sm:max-w-4xl"
          style={{ textShadow: "0 2px 30px rgba(3,7,17,0.9)" }}
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
          className="mt-4 max-w-[18rem] text-sm text-[var(--text)]/85 sm:mt-5 sm:max-w-xl sm:text-lg"
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
          className="btn btn-primary pointer-events-auto mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {uk ? "Порахувати ліди ↓" : "Посчитать лиды ↓"}
        </motion.a>
      </div>
    </section>
  );
}
