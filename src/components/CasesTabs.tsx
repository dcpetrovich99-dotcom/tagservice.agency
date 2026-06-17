"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import SmartMedia from "./SmartMedia";

export type WebdevCase = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  accent: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  liveHost?: string;
};

export type TrafficCase = {
  id: string;
  title: string;
  niche: string;
  metrics: string;
  details: string;
  tgLink: string;
  creoImageUrl?: string | null;
  bannerUrl?: string | null;
};

type TabKey = "webdev" | "white" | "grey";

type Props = {
  webdev: WebdevCase[];
  white: TrafficCase[];
  grey: TrafficCase[];
  banners: { webdev?: string; white?: string; grey?: string };
  labels: {
    webdev: string;
    white: string;
    grey: string;
    learnMore: string;
    openTg: string;
    details: string;
    empty: string;
  };
};

export default function CasesTabs({ webdev, white, grey, banners, labels }: Props) {
  const [tab, setTab] = useState<TabKey>("webdev");

  const TABS: { key: TabKey; label: string }[] = [
    { key: "webdev", label: labels.webdev },
    { key: "white", label: labels.white },
    { key: "grey", label: labels.grey },
  ];

  const sideBanner = banners[tab];

  return (
    <div className="mt-2">
      {/* перемикач підвкладок */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tb) => {
          const active = tb.key === tab;
          return (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{
                background: active
                  ? "linear-gradient(120deg, var(--brand), var(--brand-strong))"
                  : "var(--surface-2)",
                color: active ? "#fff" : "var(--text-muted)",
              }}
            >
              {tb.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-6"
            >
              {tab === "webdev" &&
                webdev.map((p) => <WebdevCard key={p.slug} p={p} learnMore={labels.learnMore} />)}

              {tab !== "webdev" &&
                (tab === "white" ? white : grey).map((c) => (
                  <TrafficCard
                    key={c.id}
                    c={c}
                    detailsLabel={labels.details}
                    openTg={labels.openTg}
                  />
                ))}

              {tab !== "webdev" && (tab === "white" ? white : grey).length === 0 && (
                <div className="card p-8 text-center">
                  <p className="text-muted">{labels.empty}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* бічний банер підвкладки (CMS slot cases:<tab>) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {sideBanner ? (
              <div className="relative aspect-[3/5] w-full overflow-hidden rounded-[1.6rem] border border-white/10">
                <SmartMedia src={sideBanner} alt="" fill sizes="300px" className="object-cover" />
              </div>
            ) : (
              <div className="dark-panel grid aspect-[3/5] w-full place-items-center rounded-[1.6rem] border border-dashed border-white/12 p-6 text-center">
                <span className="text-muted font-mono text-[11px] uppercase tracking-[0.2em]">
                  банер підвкладки
                  <br />
                  (CMS → Банери вкладок)
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function WebdevCard({ p, learnMore }: { p: WebdevCase; learnMore: string }) {
  return (
    <Link href={`/cases/${p.slug}`} className="card group block overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative flex flex-col justify-between p-7 sm:p-9">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
              <span style={{ color: p.accent }}>{p.year}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>{p.category}</span>
            </div>
            <h2 className="h-display mt-4 text-3xl sm:text-4xl lg:text-5xl">{p.title}</h2>
            <p className="text-muted mt-3 max-w-md text-base">{p.tagline}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {p.stack.slice(0, 5).map((s) => (
              <span
                key={s}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {s}
              </span>
            ))}
            <span
              className="ml-auto inline-flex items-center gap-1 text-sm font-bold"
              style={{ color: p.accent }}
            >
              {learnMore} →
            </span>
          </div>
        </div>
        <div
          className="relative flex flex-col justify-between p-7 sm:p-9"
          style={{
            background: `linear-gradient(135deg, ${p.accent}14, transparent 60%)`,
            borderLeft: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {p.metrics.map((m, mi) => (
              <div key={mi}>
                <div className="num-accent text-3xl" style={{ color: p.accent }}>
                  {m.value}
                </div>
                <div className="text-muted mt-1 text-xs uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
          {p.liveHost && (
            <div className="mt-6 flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full" style={{ background: "#22c55e" }} />
              <span className="font-mono" style={{ color: "var(--text-muted)" }}>
                {p.liveHost}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function TrafficCard({
  c,
  detailsLabel,
  openTg,
}: {
  c: TrafficCase;
  detailsLabel: string;
  openTg: string;
}) {
  const [open, setOpen] = useState(false);
  const hasBanner = !!c.bannerUrl;

  return (
    <div className="card overflow-hidden p-0">
      <div className={hasBanner ? "grid gap-0 sm:grid-cols-[1fr_200px]" : ""}>
        <div className="min-w-0">
          {c.creoImageUrl && (
            <div className="relative aspect-[16/9] w-full" style={{ background: "var(--surface-2)" }}>
              <SmartMedia
                src={c.creoImageUrl}
                alt={c.title}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
              <span
                className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
              >
                {c.niche}
              </span>
            </div>
          )}

          <div className="p-5 sm:p-6">
            {!c.creoImageUrl && (
              <span
                className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
              >
                {c.niche}
              </span>
            )}
            <h3 className="h-display text-xl">{c.title}</h3>
            <div className="num-accent mt-2 text-xl" style={{ color: "var(--brand-strong)" }}>
              {c.metrics}
            </div>

            {c.details && (
              <button
                type="button"
                className="btn btn-ghost mt-4 w-full"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {detailsLabel} {open ? "▲" : "▼"}
              </button>
            )}

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-muted mt-4 whitespace-pre-line text-sm">{c.details}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {c.tgLink && (
              <a
                href={c.tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-4 w-full"
              >
                {openTg}
              </a>
            )}
          </div>
        </div>

        {hasBanner && (
          <div className="relative min-h-[180px] border-t border-white/10 sm:border-l sm:border-t-0">
            <SmartMedia
              src={c.bannerUrl as string}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
