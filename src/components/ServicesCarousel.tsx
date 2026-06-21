"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SERVICE_ITEMS } from "./serviceItems";

const ICONS: Record<string, string> = {
  "paid-traffic": "🚀",
  "tg-ads": "📣",
  google: "🔎",
  meta: "📸",
  "static-creo": "🖼️",
  turnkey: "🗝️",
  "tg-bot": "🤖",
  "tg-blast": "✉️",
  crm: "🗂️",
  "auto-comment": "💬",
  "motion-creo": "🎬",
  landing: "🌐",
  smm: "✨",
};

// Перше речення опису — короткий текст на картці.
function shortDesc(text: string): string {
  const m = text.match(/^[^.!?]*[.!?]/);
  return (m ? m[0] : text).trim();
}

const N = SERVICE_ITEMS.length;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function ServicesCarousel({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => setActive((a) => mod(a + dir, N)), []);

  // Автообертання — повільне, з паузою на наведення/взаємодію.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => mod(a + 1, N)), 5000);
    return () => clearInterval(t);
  }, [paused]);

  // Синхронізація з чіпами банера: #svc-<id> → активна картка + скрол сюди.
  useEffect(() => {
    function fromHash() {
      const h = window.location.hash.replace("#svc-", "");
      const idx = SERVICE_ITEMS.findIndex((s) => s.id === h);
      if (idx >= 0) {
        setActive(idx);
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Клавіатура ←/→
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      ref={sectionRef}
      id="services-carousel"
      className="container-x scroll-mt-24 py-16 sm:py-20"
    >
      <div className="text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--brand-strong)]">
          {uk ? "Що ми робимо" : "Что мы делаем"}
        </div>
        <h2 className="h-display mt-2 text-2xl sm:text-3xl lg:text-4xl">
          {uk ? "Повний стек послуг під ваш ріст" : "Полный стек услуг под ваш рост"}
        </h2>
        <p className="text-muted mx-auto mt-3 max-w-2xl text-sm sm:text-base">
          {uk
            ? "Гортайте свайпом, стрілками або тапніть послугу в банері зверху."
            : "Листайте свайпом, стрелками или тапните услугу в баннере сверху."}
        </p>
      </div>

      {/* 3D-сцена */}
      <div
        className="relative mt-10 select-none"
        style={{ perspective: "1500px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="relative mx-auto h-[380px] w-full max-w-3xl sm:h-[400px]"
          style={{ transformStyle: "preserve-3d" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            if (info.offset.x < -55 || info.velocity.x < -350) go(1);
            else if (info.offset.x > 55 || info.velocity.x > 350) go(-1);
            setPaused(false);
          }}
        >
          {SERVICE_ITEMS.map((s, i) => {
            // Кругова відстань від активної (для зацикленого коверфлоу).
            let off = i - active;
            if (off > N / 2) off -= N;
            if (off < -N / 2) off += N;
            const abs = Math.abs(off);
            const visible = abs <= 2;
            return (
              <motion.button
                key={s.id}
                type="button"
                aria-label={uk ? s.titleUk : s.titleRu}
                onClick={() => (off === 0 ? null : setActive(i))}
                className="absolute left-1/2 top-1/2 w-[280px] sm:w-[340px]"
                animate={{
                  x: `calc(-50% + ${off * 58}%)`,
                  y: "-50%",
                  rotateY: off * -34,
                  z: -abs * 140,
                  scale: 1 - Math.min(abs, 2) * 0.14,
                  opacity: visible ? (abs === 0 ? 1 : abs === 1 ? 0.92 : 0.55) : 0,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 20 - abs,
                  pointerEvents: visible ? "auto" : "none",
                  cursor: off === 0 ? "default" : "pointer",
                }}
              >
                <Card item={s} uk={uk} activeCard={off === 0} idx={i} />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Стрілки */}
        <button
          type="button"
          aria-label="prev"
          onClick={() => go(-1)}
          className="absolute left-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-lg text-white backdrop-blur-md transition-colors hover:border-[var(--brand-strong)] sm:left-2"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="next"
          onClick={() => go(1)}
          className="absolute right-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-lg text-white backdrop-blur-md transition-colors hover:border-[var(--brand-strong)] sm:right-2"
        >
          ›
        </button>
      </div>

      {/* Точки-індикатори */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        {SERVICE_ITEMS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={uk ? s.titleUk : s.titleRu}
            onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === active ? 26 : 8,
              background:
                i === active ? "var(--brand-strong)" : "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  item,
  uk,
  activeCard,
  idx,
}: {
  item: (typeof SERVICE_ITEMS)[number];
  uk: boolean;
  activeCard: boolean;
  idx: number;
}) {
  return (
    <div
      className="relative h-[340px] rounded-3xl border border-white/12 p-7 text-left sm:h-[360px]"
      style={{
        background:
          "linear-gradient(160deg, rgba(16,29,49,0.96), rgba(8,16,31,0.98))",
        // Імітація товщини картки 0,2–0,5 мм (екструдоване ребро) + м'яка тінь.
        boxShadow: [
          "0 1px 0 rgba(120,215,255,0.35)",
          "1px 2px 0 rgba(120,215,255,0.18)",
          "2px 3px 0 rgba(118,103,255,0.16)",
          "3px 4px 0 rgba(118,103,255,0.10)",
          activeCard
            ? "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(120,215,255,0.4)"
            : "0 18px 44px rgba(0,0,0,0.5)",
        ].join(", "),
      }}
    >
      {/* Глянцевий відблиск */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(120% 60% at 12% 8%, rgba(255,255,255,0.10), transparent 55%)",
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-3xl">{ICONS[item.id] ?? "•"}</span>
        <span
          className="num-accent text-sm"
          style={{ color: "var(--brand-strong)" }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="h-display mt-4 text-xl sm:text-2xl">
        {uk ? item.titleUk : item.titleRu}
      </h3>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        {shortDesc(uk ? item.descUk : item.descRu)}
      </p>
      {activeCard && (
        <Link
          href="/contacts"
          className="absolute bottom-7 left-7 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: "var(--brand-strong)" }}
        >
          {uk ? "Замовити" : "Заказать"} →
        </Link>
      )}
    </div>
  );
}
