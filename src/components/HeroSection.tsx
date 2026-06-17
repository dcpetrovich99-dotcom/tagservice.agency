"use client";

import { motion } from "framer-motion";
import type { HeroItem } from "./HeroBanners";
import GlassImageCarousel from "./GlassImageCarousel";
import LeadModal from "./LeadModal";
import SmartMedia from "./SmartMedia";

type Props = {
  items: HeroItem[];
  eyebrow: string;
  headlinePre: string;
  headlineHover: string;
  headlinePost: string;
  systemsTags: string[];
  subtitle: string;
  ctaConsult: string;
  ctaCases: string;
  hrefContacts: string;
  hrefCases: string;
  bannerUrl?: string | null;
  ccLabels: {
    campaigns: string;
    platforms: string;
    clients: string;
    uptime: string;
  };
};

export default function HeroSection({
  items,
  eyebrow,
  headlinePre,
  headlineHover,
  headlinePost,
  systemsTags,
  subtitle,
  ctaConsult,
  ctaCases,
  hrefCases,
  bannerUrl,
}: Props) {
  return (
    <section className="relative isolate min-h-[calc(100dvh-64px)] overflow-hidden pb-12 pt-5 sm:pt-6 lg:pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[5%] top-[13%] h-72 w-72 rounded-full bg-[rgba(49,168,255,0.18)] blur-[96px]" />
        <div className="absolute right-[-4%] top-[0%] h-[46rem] w-[46rem] rounded-full bg-[rgba(118,103,255,0.18)] blur-[130px]" />
        <div className="absolute bottom-[-24%] right-[18%] h-[34rem] w-[34rem] rounded-full bg-[rgba(40,230,195,0.12)] blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1580px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-12 xl:px-16">
        <div className="relative z-10">
          {bannerUrl && (
            <motion.div
              className="pointer-events-none absolute -top-2 right-0 z-20 hidden h-40 w-[44%] max-w-[300px] overflow-hidden rounded-2xl border border-white/12 shadow-2xl md:block"
              initial={{ opacity: 0, y: -10, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <SmartMedia src={bannerUrl} alt="" fill sizes="300px" className="object-cover" />
            </motion.div>
          )}
          <motion.div
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: "var(--text-muted)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative grid place-items-center text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/55" />
            </span>
            <span>{eyebrow}</span>
          </motion.div>

          <motion.h1
            className="hero-title mt-5 max-w-[820px] text-[clamp(2.18rem,4.7vw,5.15rem)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.05 }}
          >
            {headlinePre}{" "}
            <span className="group relative inline-block">
              <span
                className="bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, var(--brand-strong), var(--accent))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {headlineHover}
              </span>
              <span className="pointer-events-none absolute left-0 top-full z-20 mt-4 grid min-w-[min(88vw,520px)] grid-cols-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:grid-cols-3">
                {systemsTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-50 backdrop-blur-xl"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </span>
            {headlinePost}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.16 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.24 }}
          >
            <LeadModal label={ctaConsult} sourcePage="hero" />
            <a href={hrefCases} className="btn btn-ghost">
              {ctaCases}
            </a>
          </motion.div>

        </div>

        <motion.div
          className="relative mx-auto mt-6 block w-full min-w-0 md:mt-0"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: [0.2, 0.7, 0.2, 1],
          }}
        >
          <GlassImageCarousel items={items} />
        </motion.div>
      </div>
    </section>
  );
}
