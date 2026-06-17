// Темна «сендвіч»-секція між блоками — як у Cyrclo / Scalora.
// Велике впевнене твердження + 3 принципи / 3 цифри.

type Props = {
  eyebrow: string;
  statement: string;
  emphasis: string;
  pillars: { num: string; titleUk: string; titleRu: string; textUk: string; textRu: string }[];
  locale: "uk" | "ru";
};

export default function Manifesto({
  eyebrow,
  statement,
  emphasis,
  pillars,
  locale,
}: Props) {
  return (
    <section
      className="relative isolate overflow-hidden"
      data-theme="grey"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* subtle accent glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 280px at 80% 30%, color-mix(in srgb, var(--brand) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="container-x relative py-24 sm:py-32">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--brand-strong)" }}>00</span>
          <span>—</span>
          <span>{eyebrow}</span>
        </div>

        <h2 className="h-display mt-8 max-w-5xl text-[clamp(2.2rem,5.6vw,5rem)] leading-[1.02]">
          {statement}{" "}
          <span
            className="italic"
            style={{
              backgroundImage:
                "linear-gradient(110deg, var(--brand-strong), var(--accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontStyle: "italic",
            }}
          >
            {emphasis}
          </span>
        </h2>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={i} className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <div
                className="num-accent text-xs uppercase tracking-widest"
                style={{ color: "var(--brand-strong)" }}
              >
                {p.num}
              </div>
              <div className="mt-3 text-lg font-bold">
                {locale === "uk" ? p.titleUk : p.titleRu}
              </div>
              <p className="text-muted mt-2 text-sm">
                {locale === "uk" ? p.textUk : p.textRu}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
