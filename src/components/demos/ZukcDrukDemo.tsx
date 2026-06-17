// Спрощений мокап-зріз сайту друкарні ЗУКЦ (druklviv.com).
export default function ZukcDrukDemo() {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ background: "#0e1f1e", color: "#e8f5f4", borderColor: "#1d3433" }}
    >
      {/* browser chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5 text-xs"
        style={{ background: "#0a1716", borderColor: "#1d3433", color: "#7da8a4" }}
      >
        <span className="size-2.5 rounded-full" style={{ background: "#cf2e2e" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#fbb102" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#45afe2" }} />
        <span className="ml-3">druklviv.com</span>
      </div>

      <div className="relative overflow-hidden p-7">
        {/* promo strip */}
        <div
          className="mb-5 flex items-center justify-between rounded-lg px-4 py-2.5 text-xs"
          style={{ background: "#fbb10222", color: "#fbb102" }}
        >
          <span className="font-bold">DRUK10 — −10% на перше замовлення</span>
          <span className="font-mono opacity-60">скопіювати ↗</span>
        </div>

        {/* hero */}
        <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#45afe2" }}>
          Львівська друкарня · з 2014 року
        </div>
        <h3 className="mt-2 text-2xl font-bold leading-tight">
          Офсетний, цифровий <br />
          і широкоформатний друк
        </h3>
        <p className="mt-3 max-w-md text-sm" style={{ color: "#a8c4c2" }}>
          Тираж від 50 до 50 000. Калькуляція в день звернення, друк за 24-72 год.
        </p>

        {/* services tiles */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { tag: "offset", title: "Офсетний", c: "#45afe2", desc: "великі тиражі" },
            { tag: "digital", title: "Цифровий", c: "#cf2e2e", desc: "малі тиражі, швидко" },
            { tag: "wide", title: "Широкоформатний", c: "#fbb102", desc: "банери, штендери" },
          ].map((s) => (
            <div
              key={s.tag}
              className="rounded-lg border p-3"
              style={{ background: "#13302e", borderColor: "#1d3433" }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: s.c }}
              >
                {s.tag}
              </div>
              <div className="mt-1 font-bold">{s.title}</div>
              <div className="mt-1 text-[10px]" style={{ color: "#7da8a4" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* order CTA */}
        <div
          className="mt-5 flex items-center justify-between rounded-lg p-4"
          style={{ background: "#13302e", border: "1px solid #1d3433" }}
        >
          <div>
            <div className="text-[10px] uppercase" style={{ color: "#7da8a4" }}>
              швидкий прорахунок
            </div>
            <div className="text-sm font-bold">Замовити з промокодом DRUK10</div>
          </div>
          <button
            className="rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider"
            style={{ background: "#45afe2", color: "#0e1f1e" }}
          >
            замовити
          </button>
        </div>

        {/* floating chat */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold"
          style={{ background: "#45afe2", color: "#0e1f1e" }}
        >
          <span>✦</span>
          <span>чат з менеджером</span>
        </div>
      </div>
    </div>
  );
}
