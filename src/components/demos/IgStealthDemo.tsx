// Спрощений мокап-зріз дашборду IG Stealth (мас-аутріч IG/Threads).
export default function IgStealthDemo() {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ background: "#080a0f", color: "#e8eef8", borderColor: "#171b26" }}
    >
      {/* browser chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5 text-xs"
        style={{ background: "#05070b", borderColor: "#171b26", color: "#5b6f8e" }}
      >
        <span className="size-2.5 rounded-full" style={{ background: "#ff6b9a" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#ffd166" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#00c2a8" }} />
        <span className="ml-3 font-mono">app.igstealth.io</span>
      </div>

      <div className="grid h-[460px] grid-cols-[68px_1fr]">
        {/* mini sidebar with icons */}
        <aside
          className="flex flex-col items-center gap-3 border-r py-5"
          style={{ borderColor: "#171b26", background: "#05070b" }}
        >
          {["⌘", "⊞", "✦", "⌗", "⚙"].map((g, i) => (
            <div
              key={i}
              className="grid size-9 place-items-center rounded-md text-sm"
              style={{
                background: i === 1 ? "#1f9fe022" : "transparent",
                color: i === 1 ? "#1f9fe0" : "#5b6f8e",
                border: i === 1 ? "1px solid #1f9fe044" : "1px solid transparent",
              }}
            >
              {g}
            </div>
          ))}
        </aside>

        {/* main */}
        <div className="overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#5b6f8e" }}>
                кампанія
              </div>
              <div className="text-lg font-bold">EU Beauty · IG + Threads</div>
            </div>
            <button
              className="rounded-md border px-3 py-1.5 text-[11px] font-bold"
              style={{ background: "#1f9fe0", color: "#fff", borderColor: "#1f9fe0" }}
            >
              ▶ запустити аутріч
            </button>
          </div>

          {/* stats strip */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { v: "146", l: "акаунтів", c: "#1f9fe0" },
              { v: "12 480", l: "повідомлень / день", c: "#6c5ce7" },
              { v: "4.8%", l: "відповіді", c: "#00c2a8" },
              { v: "0.2%", l: "бани", c: "#ff6b9a" },
            ].map((k, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{ background: "#0c111a", border: "1px solid #171b26" }}
              >
                <div className="text-lg font-bold tabular-nums" style={{ color: k.c }}>
                  {k.v}
                </div>
                <div className="text-[10px] uppercase" style={{ color: "#5b6f8e" }}>
                  {k.l}
                </div>
              </div>
            ))}
          </div>

          {/* chart placeholder */}
          <div
            className="mt-3 rounded-lg p-4"
            style={{ background: "#0c111a", border: "1px solid #171b26" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase" style={{ color: "#5b6f8e" }}>
                відповіді / 7 днів
              </div>
              <div className="text-[10px] font-mono" style={{ color: "#1f9fe0" }}>
                +27% WoW
              </div>
            </div>
            <svg viewBox="0 0 300 80" className="mt-2 w-full">
              <defs>
                <linearGradient id="ig-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f9fe0" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1f9fe0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 L40,52 L80,48 L120,40 L160,42 L200,30 L240,24 L300,12 L300,80 L0,80 Z"
                fill="url(#ig-area)"
              />
              <path
                d="M0,60 L40,52 L80,48 L120,40 L160,42 L200,30 L240,24 L300,12"
                fill="none"
                stroke="#1f9fe0"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* accounts list */}
          <div
            className="mt-3 overflow-hidden rounded-lg"
            style={{ background: "#0c111a", border: "1px solid #171b26" }}
          >
            <div
              className="grid grid-cols-[24px_1fr_70px_70px] gap-3 px-3 py-2 text-[10px] uppercase"
              style={{ color: "#5b6f8e", background: "#05070b" }}
            >
              <span />
              <span>акаунт</span>
              <span>проксі</span>
              <span>стан</span>
            </div>
            {[
              { n: "@beauty.eu.shop", p: "DE-residential", s: "warming", c: "#ffd166" },
              { n: "@nordic.skincare", p: "NO-residential", s: "active", c: "#00c2a8" },
              { n: "@parisbeauty.club", p: "FR-residential", s: "active", c: "#00c2a8" },
              { n: "@aesthetic.lab", p: "IT-residential", s: "warming", c: "#ffd166" },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[24px_1fr_70px_70px] items-center gap-3 border-t px-3 py-2 text-xs"
                style={{ borderColor: "#171b26" }}
              >
                <span className="size-2 rounded-full" style={{ background: row.c }} />
                <span className="font-mono">{row.n}</span>
                <span className="font-mono text-[10px]" style={{ color: "#8aa0c0" }}>
                  {row.p}
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-center text-[10px] font-bold uppercase"
                  style={{ color: row.c, background: row.c + "22" }}
                >
                  {row.s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
