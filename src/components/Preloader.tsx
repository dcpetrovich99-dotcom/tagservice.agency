"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Брендований прелоадер на ~2с: літачок «злітає», лого проявляється,
// прогрес-смужка заповнюється, далі шторка їде вгору. Показується один
// раз за повне завантаження сторінки (живе в layout, монтується раз).
export default function Preloader() {
  const [show, setShow] = useState(true);
  const logoRef = useRef<HTMLVideoElement | null>(null);

  // Пришвидшуємо анімацію лого (відео 4с → за ~2с прелоадера встигає більше).
  useEffect(() => {
    if (logoRef.current) logoRef.current.playbackRate = 1.7;
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2000);
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "#05060a" }}
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(63,155,240,0.16),transparent_60%)] blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="relative h-44 w-44 sm:h-52 sm:w-52"
            >
              {/* Анімований неоновий літачок. Фон відео — чорний, тож
                  mix-blend-screen робить його прозорим (лишається лише сяйво). */}
              <video
                ref={logoRef}
                className="h-full w-full object-contain"
                style={{
                  mixBlendMode: "screen",
                  WebkitMaskImage:
                    "radial-gradient(circle, black 48%, rgba(0,0,0,0.72) 62%, transparent 78%)",
                  maskImage:
                    "radial-gradient(circle, black 48%, rgba(0,0,0,0.72) 62%, transparent 78%)",
                }}
                src="/brand-motion.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            </motion.div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold tracking-[0.08em] text-white">
                TAG SERVICE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]">
                AGENCY
              </span>
            </div>

            <div className="mt-1 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #54d8f6, #4f6ff0, #7d54ec)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.85, ease: [0.3, 0.1, 0.2, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
