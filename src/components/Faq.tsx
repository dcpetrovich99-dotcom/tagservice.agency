"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq({
  items,
}: {
  items: { id: string; q: string; a: string }[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className="card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              onClick={() => setOpen(isOpen ? null : it.id)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold">{it.q}</span>
              <span
                className="shrink-0 text-xl transition-transform"
                style={{
                  color: "var(--brand-strong)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-muted px-5 pb-5">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
