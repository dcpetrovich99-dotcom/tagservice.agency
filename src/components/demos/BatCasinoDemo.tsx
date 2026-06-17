// Спрощений мокап-зріз UI BatCasino Operator CRM (не реальні дані).
export default function BatCasinoDemo() {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ background: "#0e1320", color: "#e8eef8", borderColor: "#1e2840" }}
    >
      {/* browser chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5 text-xs"
        style={{ background: "#0a0f1a", borderColor: "#1e2840", color: "#6b7c97" }}
      >
        <span className="size-2.5 rounded-full" style={{ background: "#ff6b9a" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#ffd166" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#00c2a8" }} />
        <span className="ml-3">ops.batman-casino.com</span>
      </div>

      <div className="grid h-[460px] grid-cols-[200px_1fr]">
        {/* sidebar */}
        <aside className="border-r p-4 text-sm" style={{ borderColor: "#1e2840" }}>
          <div className="mb-5 font-bold" style={{ color: "#6c5ce7" }}>
            BAT/OPS
          </div>
          <nav className="flex flex-col gap-1">
            {[
              ["▣", "Тікети", true],
              ["⌗", "Гравці", false],
              ["◐", "KPI", false],
              ["▤", "Зарплати", false],
              ["⊟", "Зміни", false],
              ["⚙", "Ролі", false],
            ].map(([icon, label, active], i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md px-2 py-1.5"
                style={{
                  background: active ? "#1a2440" : "transparent",
                  color: active ? "#fff" : "#8aa0c0",
                }}
              >
                <span style={{ color: active ? "#6c5ce7" : "#5b6f8e" }}>
                  {icon as string}
                </span>
                <span>{label as string}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* main */}
        <div className="overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: "#6b7c97" }}>
                Дашборд оператора
              </div>
              <div className="text-lg font-bold">Мої тікети — у роботі</div>
            </div>
            <div className="text-xs" style={{ color: "#6b7c97" }}>
              Зміна: 5г 12хв · KPI 94%
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { v: "47", l: "у роботі" },
              { v: "12", l: "новi" },
              { v: "318", l: "закрито 24h" },
              { v: "94%", l: "SLA" },
            ].map((k, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{ background: "#131a2c", border: "1px solid #1e2840" }}
              >
                <div className="text-xl font-bold tabular-nums" style={{ color: "#fff" }}>
                  {k.v}
                </div>
                <div className="text-[10px] uppercase" style={{ color: "#6b7c97" }}>
                  {k.l}
                </div>
              </div>
            ))}
          </div>

          {/* ticket list */}
          <div
            className="mt-4 overflow-hidden rounded-lg"
            style={{ background: "#131a2c", border: "1px solid #1e2840" }}
          >
            <div
              className="grid grid-cols-[60px_1fr_120px_70px] gap-2 px-3 py-2 text-[10px] uppercase"
              style={{ color: "#6b7c97", background: "#0a0f1a" }}
            >
              <span>#</span>
              <span>Тема</span>
              <span>Гравець</span>
              <span>SLA</span>
            </div>
            {[
              { id: "T-9821", t: "Виведення затрималось — Bitcoin", p: "player_7421", s: "2m" },
              { id: "T-9820", t: "Не приходить код підтвердження", p: "kuk@gmx.com", s: "12m" },
              { id: "T-9819", t: "Запит на зміну ліміту", p: "player_9982", s: "28m" },
              { id: "T-9818", t: "Питання про бонус 200%", p: "@svetik77", s: "1h" },
              { id: "T-9817", t: "Технічна помилка слот Sweet Bonanza", p: "player_1230", s: "1h" },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_1fr_120px_70px] items-center gap-2 border-t px-3 py-2 text-xs"
                style={{ borderColor: "#1e2840" }}
              >
                <span className="font-mono" style={{ color: "#6c5ce7" }}>
                  {row.id}
                </span>
                <span className="truncate">{row.t}</span>
                <span className="font-mono" style={{ color: "#8aa0c0" }}>
                  {row.p}
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-center font-bold tabular-nums"
                  style={{
                    background:
                      i === 0 ? "#ff6b9a22" : i === 1 ? "#ffd16622" : "#00c2a822",
                    color: i === 0 ? "#ff6b9a" : i === 1 ? "#ffd166" : "#00c2a8",
                  }}
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
