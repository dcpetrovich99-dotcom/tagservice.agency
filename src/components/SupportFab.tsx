"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

// Плаваюча кнопка-«лайвчат» → перехід у Telegram-підтримку @tag_support.
const SUPPORT_URL = "https://t.me/tag_support";

export default function SupportFab() {
  const uk = useLocale() === "uk";
  const label = uk ? "Напишіть нам" : "Напишите нам";

  return (
    <motion.a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group pointer-events-auto fixed bottom-5 right-5 z-[120] flex items-center gap-0 overflow-hidden rounded-full text-white shadow-[0_14px_36px_-10px_rgba(49,168,255,0.8)] sm:bottom-7 sm:right-7"
      style={{ background: "linear-gradient(135deg, #229ED9, #2ab2ff)" }}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Пульсуюче кільце */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full"
        animate={{ boxShadow: [
          "0 0 0 0 rgba(42,178,255,0.55)",
          "0 0 0 12px rgba(42,178,255,0)",
          "0 0 0 0 rgba(42,178,255,0)",
        ] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Іконка Telegram */}
      <span className="relative flex h-14 w-14 items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.94 4.3 18.9 19.06c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.95.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.73 13.2l-4.64-1.45c-1.01-.31-1.03-1.01.21-1.5l18.13-6.99c.84-.31 1.58.19 1.31 1.04Z" />
        </svg>
      </span>
      {/* Підпис — розкривається на ховер (десктоп) */}
      <span className="relative hidden max-w-0 whitespace-nowrap pr-0 text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-[180px] group-hover:pr-5 group-hover:opacity-100 sm:inline">
        {label}
      </span>
    </motion.a>
  );
}
