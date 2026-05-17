"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type Props = { sourcePage?: string };

const BUDGETS = ["20", "50", "100", "300"] as const;

export default function QuizForm({ sourcePage = "home" }: Props) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "uk" | "ru";

  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    projectDesc: "",
    projectLinks: "",
    dailyBudget: "" as "" | (typeof BUDGETS)[number],
    hasActiveTraffic: null as null | boolean,
    contact: "",
    company: "", // honeypot
  });

  const TOTAL = 5;
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.projectDesc.trim().length >= 3;
    if (step === 2) return form.dailyBudget !== "";
    if (step === 3) return form.hasActiveTraffic !== null;
    if (step === 4) return form.contact.trim().length >= 2;
    return true;
  };

  async function submit() {
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDesc: form.projectDesc,
          projectLinks: form.projectLinks,
          dailyBudget: form.dailyBudget,
          hasActiveTraffic: form.hasActiveTraffic,
          contact: form.contact,
          company: form.company,
          locale,
          sourcePage,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("fail");
      setDone(true);
      if (data.redirect) {
        setTimeout(() => {
          window.open(data.redirect as string, "_blank", "noopener");
        }, 1200);
      }
    } catch {
      setErr(t("errorGeneric"));
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="h-display mt-3 text-xl">{t("successTitle")}</h3>
        <p className="text-muted mt-2">{t("successText")}</p>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{t("title")}</span>
          <span className="text-muted">
            {t("step")} {step + 1} {t("of")} {TOTAL}
          </span>
        </div>
        <p className="text-muted mt-1 text-sm">{t("subtitle")}</p>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((step + 1) / TOTAL) * 100}%`,
              background: "linear-gradient(90deg,var(--brand),var(--brand-strong))",
            }}
          />
        </div>
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={form.company}
        onChange={(e) => set("company", e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="min-h-[150px]"
        >
          {step === 0 && (
            <label className="block">
              <span className="mb-2 block font-medium">{t("qNiche")}</span>
              <textarea
                className="input min-h-[110px]"
                placeholder={t("qNichePlaceholder")}
                value={form.projectDesc}
                onChange={(e) => set("projectDesc", e.target.value)}
              />
            </label>
          )}

          {step === 1 && (
            <label className="block">
              <span className="mb-2 block font-medium">{t("qLinks")}</span>
              <input
                className="input"
                placeholder={t("qLinksPlaceholder")}
                value={form.projectLinks}
                onChange={(e) => set("projectLinks", e.target.value)}
              />
            </label>
          )}

          {step === 2 && (
            <div>
              <span className="mb-3 block font-medium">{t("qBudget")}</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set("dailyBudget", b)}
                    className="btn"
                    style={
                      form.dailyBudget === b
                        ? { background: "var(--brand)", color: "#fff" }
                        : {
                            background: "var(--surface-2)",
                            color: "var(--text)",
                          }
                    }
                  >
                    {t(`budget${b}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="mb-3 block font-medium">{t("qTraffic")}</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: true, l: t("trafficYes") },
                  { v: false, l: t("trafficNo") },
                ].map((o) => (
                  <button
                    key={String(o.v)}
                    type="button"
                    onClick={() => set("hasActiveTraffic", o.v)}
                    className="btn"
                    style={
                      form.hasActiveTraffic === o.v
                        ? { background: "var(--brand)", color: "#fff" }
                        : {
                            background: "var(--surface-2)",
                            color: "var(--text)",
                          }
                    }
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <label className="block">
              <span className="mb-2 block font-medium">{t("qContact")}</span>
              <input
                className="input"
                placeholder={t("qContactPlaceholder")}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
              />
            </label>
          )}
        </motion.div>
      </AnimatePresence>

      {err && (
        <p className="mt-3 text-sm" style={{ color: "#e23b3b" }}>
          {err}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={step === 0 || sending}
          style={{ opacity: step === 0 ? 0.4 : 1 }}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          {t("back")}
        </button>

        {step < TOTAL - 1 ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canNext()}
            style={{ opacity: canNext() ? 1 : 0.5 }}
            onClick={() => setStep((s) => s + 1)}
          >
            {t("next")}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canNext() || sending}
            style={{ opacity: !canNext() || sending ? 0.5 : 1 }}
            onClick={submit}
          >
            {sending ? t("submitting") : t("submit")}
          </button>
        )}
      </div>
    </div>
  );
}
