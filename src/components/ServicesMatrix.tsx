"use client";

import { useState } from "react";
import Image from "next/image";

type ServiceItem = {
  id: string;
  num: string;
  title: string;
  description: string;
  details: string[];
  image: string;
};

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
          <p className="mt-5 max-w-md text-[var(--text-muted)]">
            Наводьте на напрямок: справа змінюється об'єкт і список того, що
            реально входить у роботу.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
        </div>
      </div>
    </section>
  );
}
