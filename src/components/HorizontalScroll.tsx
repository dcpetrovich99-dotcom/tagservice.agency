"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

type Slide = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  icon?: ReactNode;
  image?: string;
};

/**
 * Scroll-hijack: поки користувач крутить сторінку вниз, сам блок
 * залишається на місці, а слайди їдуть горизонтально. Виходить
 * «перегортування блоку, не сторінки».
 */
export default function HorizontalScroll({
  heading,
  kicker,
  slides,
}: {
  heading: string;
  kicker: string;
  slides: Slide[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Скільки треба зсунути горизонтально, щоб показати всі слайди.
  // Кожна картка ~88vw + gap; зсуваємо так, щоб остання повністю вийшла.
  const distance = `-${Math.max(0, slides.length - 1) * 78}vw`;
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["2vw", distance]);

  // Висота секції: на одну картку = 100vh, +25vh на «вхід/вихід»
  const sectionVh = 100 + slides.length * 70;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="container-x pt-14">
          <span className="kicker">{kicker}</span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl">{heading}</h2>
        </div>

        <motion.div
          className="mt-10 flex h-[calc(100dvh-220px)] items-stretch gap-6 pl-[6vw] pr-[6vw] will-change-transform"
          style={{ x }}
        >
          {slides.map((s, i) => (
            <article
              key={s.id}
              className="card relative grid w-[88vw] shrink-0 grid-rows-[1fr_auto] overflow-hidden sm:w-[78vw] lg:w-[62vw] lg:grid-cols-[1fr_1.1fr] lg:grid-rows-1"
            >
              {/* LEFT — content */}
              <div className="relative flex flex-col justify-between p-7 sm:p-9 lg:p-10">
                <div className="flex items-center justify-between">
                  <span
                    className="num-accent text-3xl"
                    style={{ color: "var(--brand-strong)" }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.kicker}
                  </span>
                </div>
                <div>
                  <h3 className="h-display text-3xl sm:text-4xl lg:text-5xl">
                    {s.title}
                  </h3>
                  <p className="text-muted mt-4 max-w-xl text-base sm:text-lg">
                    {s.text}
                  </p>
                </div>
              </div>

              {/* RIGHT — stage image */}
              <div
                className="relative overflow-hidden"
                style={{
                  background: s.image
                    ? `center/cover no-repeat url(${s.image})`
                    : "linear-gradient(135deg, var(--brand), var(--accent))",
                  borderLeft: "1px solid var(--border)",
                  minHeight: 240,
                }}
              >
                <span
                  className="orb anim-orb"
                  style={{
                    top: "30%",
                    right: "-15%",
                    width: 260,
                    height: 260,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </article>
          ))}
        </motion.div>

        {/* підказка */}
        <div
          className="pointer-events-none absolute bottom-6 right-6 hidden text-xs sm:block"
          style={{ color: "var(--text-muted)" }}
        >
          ↓ крутіть, блок перегортається ←
        </div>
      </div>
    </section>
  );
}
