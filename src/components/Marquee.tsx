export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <div
      className="marquee border-y py-3"
      style={{
        background: "color-mix(in srgb, var(--surface) 55%, transparent)",
      }}
    >
      <div className="marquee__track">
        {row.map((it, i) => (
          <span
            key={i}
            className="marquee__item"
            style={{ color: "var(--text)" }}
          >
            <span className="marquee__dot" />
            <span>{it}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
