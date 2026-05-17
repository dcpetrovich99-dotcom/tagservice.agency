"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type HeroItem = {
  placement: string;
  title: string;
  text: string;
  imageUrl?: string | null;
};

export default function HeroBanners({ items }: { items: HeroItem[] }) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 4800);
    return () => clearInterval(id);
  }, [n]);

  if (n === 0) return null;
  const cur = items[i];

  return (
    <div
      className="relative overflow-hidden rounded-3xl border"
      style={{ minHeight: 380, boxShadow: "var(--shadow)" }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          style={{
            background: cur.imageUrl
              ? `center/cover no-repeat url(${cur.imageUrl})`
              : "linear-gradient(135deg, var(--brand), var(--brand-strong))",
          }}
        />
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,30,48,0.15), rgba(8,30,48,0.55))",
        }}
      />

      <div className="relative flex min-h-[380px] items-end p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="glass max-w-xl rounded-2xl p-6"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            style={{ color: "#fff" }}
          >
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              {cur.placement}
            </span>
            <h2 className="h-display mt-3 text-2xl sm:text-3xl">{cur.title}</h2>
            <p className="mt-2 text-sm opacity-90">{cur.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <div className="absolute bottom-4 right-5 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className="h-2 rounded-full transition-all"
              style={{
                width: idx === i ? 22 : 8,
                background:
                  idx === i ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
