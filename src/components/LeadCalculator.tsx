"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

// ─── Niche data ──────────────────────────────────────────────────────────────

type Niche = {
  key: string;
  uk: string;
  ru: string;
  cplMin: number;
  cplMax: number;
  unitUk: string;
  unitRu: string;
  type: "white" | "grey";
};

const WHITE: Niche[] = [
  { key: "beauty",      uk: "Б'юті / салони краси", ru: "Бьюти / салоны красоты",     cplMin: 1,  cplMax: 2,  unitUk: "запис",       unitRu: "запись",        type: "white" },
  { key: "realestate",  uk: "Нерухомість",           ru: "Недвижимость",                cplMin: 5,  cplMax: 7,  unitUk: "лід",          unitRu: "лид",           type: "white" },
  { key: "tourism",     uk: "Туристичні послуги",    ru: "Туристические услуги",        cplMin: 4,  cplMax: 5,  unitUk: "переписка",   unitRu: "переписка",     type: "white" },
  { key: "agency",      uk: "Агентство",             ru: "Агентство",                   cplMin: 6,  cplMax: 8,  unitUk: "лід",          unitRu: "лид",           type: "white" },
  { key: "horeca",      uk: "HoReCa",                ru: "HoReCa",                      cplMin: 1,  cplMax: 2,  unitUk: "переписка",   unitRu: "переписка",     type: "white" },
  { key: "auto",        uk: "Пригін авто",           ru: "Пригон авто",                 cplMin: 3,  cplMax: 4,  unitUk: "лід",          unitRu: "лид",           type: "white" },
  { key: "other-w",     uk: "Інше",                  ru: "Другое",                      cplMin: 0,  cplMax: 0,  unitUk: "",             unitRu: "",              type: "white" },
];

// ─── Geo data (множник до CPL) ──────────────────────────────────────────────

type Geo = { key: string; uk: string; ru: string; mult: number };

const GEOS: Geo[] = [
  { key: "ua", uk: "Україна",    ru: "Украина",    mult: 1 },
  { key: "ru", uk: "Росія",      ru: "Россия",     mult: 1.1 },
  { key: "kz", uk: "Казахстан",  ru: "Казахстан",  mult: 0.9 },
  { key: "eu", uk: "Європа (ЄС)", ru: "Европа (ЕС)", mult: 1.8 },
];

const GREY: Niche[] = [
  { key: "crypto",      uk: "Крипта",                ru: "Крипта",                      cplMin: 1,    cplMax: 2,  unitUk: "підписник",   unitRu: "подписчик",     type: "grey" },
  { key: "tgchannel",   uk: "TG-канали",             ru: "TG-каналы",                   cplMin: 0.5,  cplMax: 1,  unitUk: "підписник",   unitRu: "подписчик",     type: "grey" },
  { key: "binary",      uk: "Бінарка",               ru: "Бинарка",                     cplMin: 17,   cplMax: 20, unitUk: "лід-форма",   unitRu: "лид-форма",     type: "grey" },
  { key: "finance",     uk: "Фінка",                 ru: "Финка",                       cplMin: 12,   cplMax: 20, unitUk: "лід-форма",   unitRu: "лид-форма",     type: "grey" },
  { key: "hr",          uk: "Набір працівників",     ru: "Набор сотрудников",           cplMin: 25,   cplMax: 30, unitUk: "співбесіда",  unitRu: "собеседование", type: "grey" },
  { key: "exchange",    uk: "Обмін валют",           ru: "Обмен валют",                 cplMin: 1,    cplMax: 2,  unitUk: "підписник",   unitRu: "подписчик",     type: "grey" },
  { key: "office",      uk: "Офіс (набір)",          ru: "Офис (набор)",                cplMin: 45,   cplMax: 50, unitUk: "вихід",       unitRu: "выход",         type: "grey" },
  { key: "tobacco",     uk: "Табачка",               ru: "Табачка",                     cplMin: 1,    cplMax: 2,  unitUk: "переписка",   unitRu: "переписка",     type: "grey" },
  { key: "other-g",     uk: "Інше",                  ru: "Другое",                      cplMin: 0,    cplMax: 0,  unitUk: "",             unitRu: "",              type: "grey" },
];

// ─── Similar case stories ──────────────────────────────────────────────────

type CaseStory = {
  niche: string;
  budgetLabel: string;
  leadsLabel: string;
  dealsLabel: string;
  roi: string;
};

const STORIES: CaseStory[] = [
  { niche: "Пригін авто",        budgetLabel: "€1 500/міс",  leadsLabel: "387 лідів",      dealsLabel: "6 угод",       roi: "520%" },
  { niche: "Крипто-обмінник",    budgetLabel: "$1 200/міс",  leadsLabel: "720 підписників", dealsLabel: "44 угоди",     roi: "390%" },
  { niche: "TG-канал (крипта)",  budgetLabel: "$400/міс",    leadsLabel: "1 100 підписн.",  dealsLabel: "—",            roi: "−" },
  { niche: "Салон краси",        budgetLabel: "$300/міс",    leadsLabel: "210 записів",     dealsLabel: "186 відвідувань", roi: "870%" },
  { niche: "Нерухомість",        budgetLabel: "$900/міс",    leadsLabel: "164 ліди",        dealsLabel: "3 угоди",      roi: "1 240%" },
  { niche: "HoReCa",             budgetLabel: "$600/міс",    leadsLabel: "540 переписок",   dealsLabel: "280 відвідувань", roi: "430%" },
  { niche: "Візові послуги",     budgetLabel: "$500/міс",    leadsLabel: "142 ліди",        dealsLabel: "8 продажів",   roi: "4 525%" },
];

function pickStory(niche: Niche): CaseStory {
  const map: Record<string, number> = {
    beauty: 3, realestate: 4, horeca: 5, auto: 0, crypto: 1, tgchannel: 2, tourism: 6,
  };
  return STORIES[map[niche.key] ?? Math.floor(Math.random() * STORIES.length)];
}

// ─── Loading messages ─────────────────────────────────────────────────────

const LOADING_UK = ["Рахуємо ваш результат…", "Аналізуємо нішу…", "Шукаємо кейси…"];
const LOADING_RU = ["Считаем ваш результат…", "Анализируем нишу…", "Ищем кейсы…"];

// ─── State machine ────────────────────────────────────────────────────────

type Step = "select" | "loading" | "result" | "confirm" | "contact" | "success";

export default function LeadCalculator() {
  const locale = useLocale() as "uk" | "ru";
  const uk = locale === "uk";

  const [nicheTab, setNicheTab] = useState<"white" | "grey">("white");
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [geo, setGeo] = useState<Geo>(GEOS[0]);
  const [budget, setBudget] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [tgInput, setTgInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loadingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const budgetNum = parseFloat(budget) || 0;
  const monthly = budgetNum * 30;
  // Ефективний CPL з урахуванням гео-множника.
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const cplMin = selectedNiche ? round2(selectedNiche.cplMin * geo.mult) : 0;
  const cplMax = selectedNiche ? round2(selectedNiche.cplMax * geo.mult) : 0;
  const leadsMin = cplMax > 0 ? Math.round(monthly / cplMax) : 0;
  const leadsMax = cplMin > 0 ? Math.round(monthly / cplMin) : 0;
  const unitStr = selectedNiche
    ? (uk ? selectedNiche.unitUk : selectedNiche.unitRu)
    : "";
  const story = selectedNiche ? pickStory(selectedNiche) : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleNicheSelect(n: Niche) {
    if (n.key === "other-w" || n.key === "other-g") {
      setShowOtherModal(true);
      return;
    }
    setSelectedNiche(n);
  }

  function handleCalculate() {
    if (!selectedNiche || !budget || budgetNum <= 0) return;
    setStep("loading");
    setLoadingIdx(0);
    const msgs = uk ? LOADING_UK : LOADING_RU;
    let idx = 0;
    loadingRef.current = setInterval(() => {
      idx = (idx + 1) % msgs.length;
      setLoadingIdx(idx);
    }, 900);
    setTimeout(() => {
      if (loadingRef.current) clearInterval(loadingRef.current);
      setStep("result");
      // Прокрутка з відступом під шапку — детерміновано, щоб на мобайлі не кидало у футер.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = resultRef.current;
          if (!el) return;
          const y = el.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top: y, behavior: "smooth" });
        }),
      );
    }, 3000);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/calc-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: uk ? selectedNiche?.uk : selectedNiche?.ru,
          nicheType: selectedNiche?.type,
          geo: geo.uk,
          dailyBudget: budgetNum,
          monthlyBudget: monthly,
          leadsMin,
          leadsMax,
          unit: unitStr,
          tg: tgInput,
          phone: phoneInput,
          locale,
        }),
      });
      setStep("success");
    } catch {
      setStep("success"); // best-effort
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep("select");
    setSelectedNiche(null);
    setGeo(GEOS[0]);
    setBudget("");
    setTgInput("");
    setPhoneInput("");
    setLoadingIdx(0);
  }

  const niches = nicheTab === "white" ? WHITE : GREY;
  const loadingMsgs = uk ? LOADING_UK : LOADING_RU;
  const canCalc = selectedNiche && budgetNum > 0;

  return (
    <div id="calculator">
      {/* ── Separator bar ──────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center py-10 text-center"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(49,168,255,0.14) 30%, rgba(118,103,255,0.14) 70%, transparent)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent)]">
          <div className="h-full w-full border-t border-dashed border-white/10" />
        </div>
        <div className="relative px-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--brand-strong)]">
            {uk ? "Давайте порахуємо" : "Давайте посчитаем"}
          </div>
          <h2 className="h-display mt-2 text-2xl sm:text-3xl lg:text-4xl">
            {uk
              ? "Скільки лідів ми могли б вам принести?"
              : "Сколько лидов мы могли бы вам принести?"}
          </h2>
          <p className="text-muted mt-2 text-sm">
            {uk
              ? "Введіть нішу і бюджет — отримайте орієнтовний прорахунок за 3 секунди."
              : "Введите нишу и бюджет — получите ориентировочный расчёт за 3 секунды."}
          </p>
        </div>
      </div>

      {/* ── Calculator card ─────────────────────────────────────────────────── */}
      <div className="container-x pb-20">
        <div className="mx-auto max-w-2xl">
          {/* SELECT step */}
          {(step === "select" || step === "confirm") && (
            <motion.div
              className="card overflow-hidden p-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Niche tabs */}
              <div className="flex border-b border-white/10">
                {(["white", "grey"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setNicheTab(t); setSelectedNiche(null); }}
                    className="flex-1 py-3.5 text-sm font-semibold transition-colors"
                    style={{
                      background:
                        nicheTab === t
                          ? "linear-gradient(90deg, rgba(49,168,255,0.16), rgba(118,103,255,0.12))"
                          : "transparent",
                      color: nicheTab === t ? "var(--text)" : "var(--text-muted)",
                      borderBottom: nicheTab === t ? "2px solid var(--brand-strong)" : "2px solid transparent",
                    }}
                  >
                    {t === "white"
                      ? (uk ? "Біла ніша" : "Белая ниша")
                      : (uk ? "Сіра ніша" : "Серая ниша")}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {/* Niche selector */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {uk ? "Оберіть нішу" : "Выберите нишу"}
                  </span>
                  <select
                    className="input"
                    style={{ color: "var(--text)" }}
                    value={selectedNiche?.key ?? ""}
                    onChange={(e) => {
                      const n = niches.find((n) => n.key === e.target.value);
                      if (n) handleNicheSelect(n);
                    }}
                  >
                    <option value="" disabled style={{ background: "#0e1a2d", color: "#edf7ff" }}>
                      {uk ? "— оберіть нішу —" : "— выберите нишу —"}
                    </option>
                    {niches.map((n) => (
                      <option key={n.key} value={n.key} style={{ background: "#0e1a2d", color: "#edf7ff" }}>
                        {uk ? n.uk : n.ru}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Geo selector */}
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium">
                    {uk ? "Гео (регіон трафіку)" : "Гео (регион трафика)"}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {GEOS.map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setGeo(g)}
                        className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
                        style={{
                          background:
                            geo.key === g.key
                              ? "linear-gradient(90deg, rgba(49,168,255,0.18), rgba(118,103,255,0.14))"
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            geo.key === g.key ? "var(--brand-strong)" : "rgba(255,255,255,0.10)",
                          color: geo.key === g.key ? "var(--text)" : "var(--text-muted)",
                        }}
                      >
                        {uk ? g.uk : g.ru}
                      </button>
                    ))}
                  </div>
                </label>

                {/* CPL hint */}
                {selectedNiche && cplMin > 0 && (
                  <motion.div
                    className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-muted">
                      {uk ? "Орієнтовна ціна " : "Ориентировочная цена "}
                      {uk ? selectedNiche.unitUk : selectedNiche.unitRu}
                      {uk ? " у " : " в "}
                      {uk ? geo.uk : geo.ru}
                      {": "}
                    </span>
                    <span className="font-bold" style={{ color: "var(--brand-strong)" }}>
                      ${cplMin}–${cplMax}
                    </span>
                  </motion.div>
                )}

                {/* Budget input */}
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium">
                    {uk
                      ? "Орієнтовний рекламний бюджет на день"
                      : "Ориентировочный рекламный бюджет в день"}
                  </span>
                  <div className="relative">
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-bold"
                      style={{ color: "var(--brand-strong)" }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="100000"
                      step="1"
                      className="input pl-9"
                      placeholder={uk ? "напр. 20" : "напр. 20"}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ""))}
                    />
                  </div>
                  <span className="text-muted mt-1.5 block text-xs">
                    {uk
                      ? "Вкажіть суму у доларах, яку готові витрачати на рекламу щодня"
                      : "Укажите сумму в долларах, которую готовы тратить на рекламу в день"}
                  </span>
                </label>

                {/* Calculate button */}
                <motion.button
                  type="button"
                  onClick={handleCalculate}
                  disabled={!canCalc}
                  className="btn btn-primary mt-6 w-full"
                  style={{ opacity: canCalc ? 1 : 0.45 }}
                  whileHover={canCalc ? { scale: 1.02 } : {}}
                  whileTap={canCalc ? { scale: 0.98 } : {}}
                >
                  {uk ? "Порахувати ліди →" : "Посчитать лиды →"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* LOADING step */}
          {step === "loading" && (
            <motion.div
              className="card flex flex-col items-center gap-5 p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Прогрес-крапки замість пропелера */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--brand-strong)" }}
                    animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
                    transition={{
                      duration: 1.1,
                      delay: d * 0.18,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingIdx}
                  className="text-lg font-medium"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {loadingMsgs[loadingIdx]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULT step */}
          {step === "result" && selectedNiche && (
            <motion.div
              ref={resultRef}
              className="flex scroll-mt-28 flex-col gap-5 pt-3 sm:pt-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Result card */}
              <div
                className="card overflow-hidden p-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(49,168,255,0.12), rgba(118,103,255,0.08))",
                }}
              >
                <div className="border-b border-white/10 px-7 py-5 sm:px-9">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--brand-strong)]">
                    {uk ? "Ваш результат" : "Ваш результат"}
                  </div>
                  <h2 className="h-display mt-3 text-4xl sm:text-5xl">
                    {leadsMin}–{leadsMax}{" "}
                    <span className="text-2xl" style={{ color: "var(--brand-strong)" }}>
                      {unitStr}/міс
                    </span>
                  </h2>
                  <p className="text-muted mt-2 text-sm">
                    {uk ? "при бюджеті" : "при бюджете"} ${budgetNum}/
                    {uk ? "день" : "день"} ≈ ${monthly.toLocaleString()}/
                    {uk ? "місяць" : "месяц"} · {uk ? "гео" : "гео"} {uk ? geo.uk : geo.ru}
                  </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-white/10 px-7 py-4 sm:px-9">
                  <div className="pr-4 text-center">
                    <div className="num-accent text-xl" style={{ color: "var(--brand-strong)" }}>
                      ${cplMin}–${cplMax}
                    </div>
                    <div className="text-muted mt-1 text-[10px] uppercase tracking-wide">
                      CPL
                    </div>
                  </div>
                  <div className="px-4 text-center">
                    <div className="num-accent text-xl" style={{ color: "var(--accent-2)" }}>
                      30
                    </div>
                    <div className="text-muted mt-1 text-[10px] uppercase tracking-wide">
                      {uk ? "днів" : "дней"}
                    </div>
                  </div>
                  <div className="pl-4 text-center">
                    <div className="num-accent text-xl" style={{ color: "var(--accent)" }}>
                      {leadsMin}–{leadsMax}
                    </div>
                    <div className="text-muted mt-1 text-[10px] uppercase tracking-wide">
                      {unitStr}
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar case */}
              {story && (
                <div
                  className="card p-6"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {uk ? "Схожий кейс" : "Похожий кейс"}
                  </div>
                  <h3 className="h-display mt-2 text-xl">{story.niche}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
                    {[
                      { label: uk ? "Бюджет" : "Бюджет", val: story.budgetLabel },
                      { label: uk ? "Результат" : "Результат", val: story.leadsLabel },
                      { label: "ROI", val: story.roi === "−" ? "—" : story.roi },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl border border-white/10 p-3 text-center">
                        <div className="num-accent text-base" style={{ color: "var(--brand-strong)" }}>
                          {m.val}
                        </div>
                        <div className="text-muted mt-1 text-[10px] uppercase tracking-wide">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Animated CTA button */}
              <div className="text-center">
                <p className="text-muted mb-4 text-sm">
                  {uk ? "Хочете такі ж або кращі результати?" : "Хотите такие же или лучше результаты?"}
                </p>
                <PulseCTAButton
                  label={uk ? "Хочу такий же результат →" : "Хочу такой же результат →"}
                  onClick={() => setStep("confirm")}
                />
                <button
                  type="button"
                  className="mt-3 block w-full text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                  onClick={reset}
                >
                  {uk ? "← Змінити нішу або бюджет" : "← Изменить нишу или бюджет"}
                </button>
              </div>
            </motion.div>
          )}

          {/* CONFIRM / CONTACT / SUCCESS — винесено у fly-out модалку нижче */}
        </div>
      </div>

      {/* "Other niche" modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showOtherModal && (
              <motion.div
                className="fixed inset-0 z-[160] flex items-center justify-center px-4"
                style={{ background: "rgba(3,6,14,0.72)", backdropFilter: "blur(10px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOtherModal(false)}
              >
                <motion.div
                  className="card w-full max-w-md p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-3xl">💬</div>
                  <h3 className="h-display mt-4 text-xl">
                    {uk ? "Вашої ніші немає в списку?" : "Вашей ниши нет в списке?"}
                  </h3>
                  <p className="text-muted mt-3 text-sm">
                    {uk
                      ? "Напишіть нам напряму — проконсультуємо і надамо прорахунок під вашу нішу."
                      : "Напишите нам напрямую — проконсультируем и предоставим расчёт под вашу нишу."}
                  </p>
                  <a
                    href="https://t.me/tag_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-6 w-full"
                  >
                    {uk ? "Написати @tag_support →" : "Написать @tag_support →"}
                  </a>
                  <button
                    type="button"
                    className="mt-3 text-sm text-[var(--text-muted)]"
                    onClick={() => setShowOtherModal(false)}
                  >
                    {uk ? "Закрити" : "Закрыть"}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Fly-out форма заявки → Telegram */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {(step === "confirm" || step === "contact" || step === "success") &&
              selectedNiche && (
                <motion.div
                  className="fixed inset-0 z-[160] flex items-center justify-center px-4 py-8"
                  style={{ background: "rgba(3,6,14,0.74)", backdropFilter: "blur(10px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setStep(step === "success" ? "select" : "result")}
                >
                  <motion.div
                    className="card w-full max-w-md overflow-hidden p-7 sm:p-8"
                    style={{ transformPerspective: 1000 }}
                    initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: 40, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Закрити */}
                    <button
                      type="button"
                      aria-label="close"
                      className="absolute right-4 top-4 text-xl text-[var(--text-muted)] hover:text-[var(--text)]"
                      onClick={() => setStep(step === "success" ? "select" : "result")}
                    >
                      ×
                    </button>

                    {/* CONFIRM */}
                    {step === "confirm" && (
                      <>
                        <h3 className="h-display text-xl">
                          {uk ? "Ми правильно зрозуміли?" : "Мы правильно поняли?"}
                        </h3>
                        <div className="mt-4 space-y-2">
                          <Row label={uk ? "Ніша" : "Ниша"} val={uk ? selectedNiche.uk : selectedNiche.ru} />
                          <Row label={uk ? "Тип" : "Тип"} val={selectedNiche.type === "white" ? (uk ? "Біла" : "Белая") : (uk ? "Сіра" : "Серая")} />
                          <Row label={uk ? "Гео" : "Гео"} val={uk ? geo.uk : geo.ru} />
                          <Row label={uk ? "Бюджет/день" : "Бюджет/день"} val={`$${budgetNum}`} />
                          <Row label={uk ? "Бюджет/місяць" : "Бюджет/месяц"} val={`$${monthly.toLocaleString()}`} />
                          <Row label={uk ? "Прогноз" : "Прогноз"} val={`${leadsMin}–${leadsMax} ${unitStr}/міс`} accent />
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <button type="button" className="btn btn-primary" onClick={() => setStep("contact")}>
                            {uk ? "Так, все вірно" : "Да, всё верно"}
                          </button>
                          <button type="button" className="btn btn-ghost" onClick={reset}>
                            {uk ? "Змінити" : "Изменить"}
                          </button>
                        </div>
                      </>
                    )}

                    {/* CONTACT */}
                    {step === "contact" && (
                      <>
                        <h3 className="h-display text-xl">
                          {uk ? "Куди надсилати прорахунок?" : "Куда отправить расчёт?"}
                        </h3>
                        <p className="text-muted mt-2 text-sm">
                          {uk
                            ? "Вкажіть Telegram або телефон — ми напишемо вручну й уточнимо деталі."
                            : "Укажите Telegram или телефон — напишем вручную и уточним детали."}
                        </p>
                        <div className="mt-5 flex flex-col gap-4">
                          <label className="block">
                            <span className="mb-1 block text-sm font-medium">Telegram</span>
                            <input
                              className="input"
                              placeholder="@username"
                              value={tgInput}
                              onChange={(e) => setTgInput(e.target.value)}
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-sm font-medium">
                              {uk ? "Телефон" : "Телефон"}
                            </span>
                            <input
                              className="input"
                              placeholder="+380…"
                              type="tel"
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary mt-6 w-full"
                          disabled={(!tgInput && !phoneInput) || submitting}
                          style={{ opacity: (!tgInput && !phoneInput) || submitting ? 0.5 : 1 }}
                          onClick={handleSubmit}
                        >
                          {submitting
                            ? uk
                              ? "Відправляємо…"
                              : "Отправляем…"
                            : uk
                              ? "Відправити заявку →"
                              : "Отправить заявку →"}
                        </button>
                      </>
                    )}

                    {/* SUCCESS */}
                    {step === "success" && (
                      <div className="text-center">
                        <div className="text-4xl">🎯</div>
                        <h3 className="h-display mt-4 text-2xl">
                          {uk ? "Заявку прийнято!" : "Заявка принята!"}
                        </h3>
                        <p className="text-muted mt-3">
                          {uk
                            ? "Ми вже бачимо ваш запит і зв'яжемось найближчим часом."
                            : "Мы уже видим ваш запрос и свяжемся в ближайшее время."}
                        </p>
                        <p className="mt-2 text-sm" style={{ color: "var(--brand-strong)" }}>
                          {uk
                            ? "А поки — перегляньте наші кейси та побачте результати нашої роботи."
                            : "А пока — посмотрите наши кейсы и увидите результаты нашей работы."}
                        </p>
                        <Link href="/cases" className="btn btn-primary mt-6">
                          {uk ? "Переглянути кейси →" : "Посмотреть кейсы →"}
                        </Link>
                        <button
                          type="button"
                          className="mt-3 block w-full text-sm text-[var(--text-muted)]"
                          onClick={reset}
                        >
                          {uk ? "← Новий прорахунок" : "← Новый расчёт"}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Row({
  label,
  val,
  accent,
}: {
  label: string;
  val: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/8 px-4 py-2.5">
      <span className="text-muted text-sm">{label}</span>
      <span
        className="text-sm font-semibold"
        style={{ color: accent ? "var(--brand-strong)" : "var(--text)" }}
      >
        {val}
      </span>
    </div>
  );
}

function PulseCTAButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold text-white"
      style={{
        background: "linear-gradient(115deg, var(--brand-strong), var(--accent))",
      }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(120,215,255,0.45)",
          "0 0 0 12px rgba(120,215,255,0)",
          "0 0 0 0 rgba(120,215,255,0)",
        ],
      }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );
}
