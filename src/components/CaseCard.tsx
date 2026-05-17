"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export type CaseItem = {
  id: string;
  title: string;
  niche: string;
  metrics: string;
  details: string;
  tgLink: string;
  creoImageUrl?: string | null;
};

export default function CaseCard({
  item,
  toggleLabel,
  ctaLine,
  openLabel,
}: {
  item: CaseItem;
  toggleLabel: string;
  ctaLine: string;
  openLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[16/9] w-full" style={{ background: "var(--surface-2)" }}>
        {item.creoImageUrl ? (
          <Image
            src={item.creoImageUrl}
            alt={item.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm font-semibold"
            style={{
              background:
                "linear-gradient(135deg,var(--brand),var(--brand-strong))",
              color: "#fff",
            }}
          >
            CREO
          </div>
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
        >
          {item.niche}
        </span>
      </div>

      <div className="p-5">
        <h3 className="h-display text-lg">{item.title}</h3>
        <div
          className="num-accent mt-2 text-xl"
          style={{ color: "var(--brand-strong)" }}
        >
          {item.metrics}
        </div>

        <button
          type="button"
          className="btn btn-ghost mt-4 w-full"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {toggleLabel} {open ? "▲" : "▼"}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="text-muted mt-4 whitespace-pre-line text-sm">
                {item.details}
              </p>
              <p className="mt-4 text-sm font-medium">{ctaLine}</p>
              <a
                href={item.tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-3 w-full"
              >
                {openLabel}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
