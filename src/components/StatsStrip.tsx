"use client";

import { motion } from "framer-motion";

type Stat = { value: string; label: string };

export default function StatsStrip({ items }: { items: Stat[] }) {
  return (
    <section className="section w-full px-4 sm:px-8 lg:px-12">
      <div className="card mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-0 overflow-hidden p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-4 xl:p-10">
        {items.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="min-w-0 px-5 py-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:px-7 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div
              className="stat-num whitespace-nowrap"
              style={{
                fontSize:
                  s.value.length > 3
                    ? "clamp(3.35rem, 5.1vw, 5.4rem)"
                    : undefined,
                letterSpacing: s.value.length > 3 ? "-0.06em" : undefined,
              }}
            >
              {s.value}
            </div>
            <div className="text-muted mt-3 max-w-[260px] text-base leading-6">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
