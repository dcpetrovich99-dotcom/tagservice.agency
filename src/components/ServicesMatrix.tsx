"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type ServiceItem = {
  id: string;
  num: string;
  title: string;
  description: string;
  details: string[];
  image: string;
};

// «Живий» брендовий шар поверх картинки напрямку: діагональний відблиск,
// тонка сітка й сяйво — щоб AI-рендер виглядав інтегрованим у наш стиль.
function LiveOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,215,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(120,215,255,0.5) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 32%, rgba(120,215,255,0.16) 46%, rgba(124,84,236,0.10) 54%, transparent 66%)",
          backgroundSize: "260% 100%",
        }}
        animate={{ backgroundPositionX: ["130%", "-30%"] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.1 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(420px 200px at 85% 12%, rgba(49,168,255,0.20), transparent 60%)",
        }}
        aria-hidden
      />
      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-50/90 backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--brand-strong)" }} />
        live
      </span>
    </>
  );
}

function Panel({ current }: { current: ServiceItem }) {
  return (
    <div className="dark-panel min-h-[520px] rounded-[2rem] p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
        <Image
          key={current.image}
          src={current.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover opacity-90 transition-opacity duration-500"
        />
        <LiveOverlay />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-transparent" />
      </div>
      <div className="mt-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--brand-strong)]">
          {current.num} / {current.id}
        </div>
        <h3 className="h-display mt-3 text-3xl">{current.title}</h3>
        <p className="mt-4 text-[var(--text-muted)]">{current.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {current.details.map((detail) => (
            <span
              key={detail}
              className="rounded-full border border-white/12 bg-white/[0.055] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-50/85"
            >
              {detail}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesMatrix({
  kicker,
  heading,
  items,
}: {
  kicker: string;
  heading: string;
  items: ServiceItem[];
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <section className="section container-x">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
            <span className="text-[var(--brand-strong)]">02</span> — {kicker}
          </div>
          <h2 className="h-display mt-6 max-w-xl text-4xl sm:text-5xl">
            {heading}
          </h2>

          {/* Брендоване intro-відео замість тексту-підказки. */}
          <div className="dark-panel relative mt-7 overflow-hidden rounded-2xl border border-white/10">
            <video
              className="aspect-video w-full object-cover"
              src="/intro-banner.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b18]/70 via-transparent to-transparent" />
          </div>
        </div>

        {/* Десктоп: список з наведенням + жива панель справа. */}
        <div className="hidden gap-6 lg:grid xl:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[1.6rem] border border-white/10">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="group grid w-full grid-cols-[72px_1fr] items-center gap-4 border-b border-white/10 px-5 py-5 text-left transition-colors last:border-b-0 hover:bg-white/[0.055]"
                style={{
                  background:
                    index === active
                      ? "linear-gradient(90deg, rgba(49,168,255,0.14), rgba(255,255,255,0.035))"
                      : "rgba(255,255,255,0.018)",
                }}
              >
                <span
                  className="font-mono text-sm uppercase tracking-[0.24em]"
                  style={{ color: index === active ? "var(--brand-strong)" : "var(--text-muted)" }}
                >
                  {item.num}
                </span>
                <span className="h-display text-2xl text-[var(--text)] sm:text-3xl">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          <Panel current={current} />
        </div>

        {/* Мобайл: випадний список (accordion) — кожен напрямок розгортається на місці. */}
        <div className="flex flex-col gap-3 lg:hidden">
          {items.map((item) => (
            <details
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] open:bg-white/[0.04]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-4">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] group-open:text-[var(--brand-strong)]">
                  {item.num}
                </span>
                <span className="h-display flex-1 text-xl">{item.title}</span>
                <span
                  className="text-lg leading-none transition-transform group-open:rotate-45"
                  style={{ color: "var(--brand-strong)" }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-4 pb-5">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-90"
                  />
                  <LiveOverlay />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-transparent" />
                </div>
                <p className="mt-4 text-sm text-[var(--text-muted)]">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-white/12 bg-white/[0.055] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-50/85"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
