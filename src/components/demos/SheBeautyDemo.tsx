// Спрощений мокап-зріз сайту She Beauty (онлайн-запис + шоп).
export default function SheBeautyDemo() {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ background: "#fbf6f1", color: "#2a1e1a", borderColor: "#e8dccd" }}
    >
      {/* browser chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5 text-xs"
        style={{ background: "#f5ece1", borderColor: "#e8dccd", color: "#8a7666" }}
      >
        <span className="size-2.5 rounded-full" style={{ background: "#ff6b9a" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#ffd166" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#00c2a8" }} />
        <span className="ml-3">shebeauty.lviv.ua</span>
      </div>

      <div className="grid h-[460px] grid-cols-[1fr_280px]">
        {/* hero / content */}
        <div className="overflow-hidden p-7">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#a87f60" }}>
            She Beauty by SL · Львів, вул. Вузька 3
          </div>
          <h3
            className="mt-3 text-3xl font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#2a1e1a" }}
          >
            Тиха <em style={{ color: "#a8624a" }}>розкіш</em>
            <br />
            у твоєму ритмі
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: "#5b463c" }}>
            Авторський догляд за волоссям, макіяж, манікюр. Усе як ти любиш —
            з кавою, музикою і годиною лише для себе.
          </p>

          {/* services tags */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {["Hair", "Color", "Makeup", "Brows", "Manicure"].map((s) => (
              <span
                key={s}
                className="rounded-full border px-3 py-1"
                style={{ borderColor: "#d8c4a8", color: "#7a5a48" }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* mini gallery */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              "linear-gradient(135deg,#d8b4a0,#a87f60)",
              "linear-gradient(135deg,#a87f60,#6b4a3a)",
              "linear-gradient(135deg,#e8c8b0,#c89878)",
            ].map((g, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-lg"
                style={{ background: g }}
              />
            ))}
          </div>
        </div>

        {/* booking widget */}
        <aside
          className="border-l p-5 text-sm"
          style={{ borderColor: "#e8dccd", background: "#f5ece1" }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#a87f60" }}>
            онлайн-запис
          </div>
          <div className="mt-2 font-bold" style={{ color: "#2a1e1a" }}>
            Обрати майстра
          </div>

          {[
            { name: "Соломія", role: "Hair / Color", color: "#a8624a" },
            { name: "Лоля", role: "Makeup / Brows", color: "#c87a5a" },
          ].map((m, i) => (
            <div
              key={i}
              className="mt-3 rounded-lg border p-3"
              style={{ borderColor: "#e8dccd", background: "#fff" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-6 rounded-full"
                  style={{ background: m.color }}
                />
                <span className="text-sm font-bold">{m.name}</span>
              </div>
              <div className="mt-1 text-[10px]" style={{ color: "#8a7666" }}>
                {m.role}
              </div>
            </div>
          ))}

          <div className="mt-4 text-[10px] uppercase" style={{ color: "#a87f60" }}>
            найближчий слот
          </div>
          <div className="mt-1 text-sm font-bold">пт, 12:30</div>
          <button
            className="mt-3 w-full rounded-md py-2.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: "#2a1e1a", color: "#fbf6f1" }}
          >
            записатись
          </button>
          <div className="mt-3 text-[10px]" style={{ color: "#8a7666" }}>
            або напишіть нам у Telegram — мастер відповість сам
          </div>
        </aside>
      </div>
    </div>
  );
}
