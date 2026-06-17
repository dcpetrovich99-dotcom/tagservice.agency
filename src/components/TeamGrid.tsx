import SmartMedia from "./SmartMedia";

export type TeamCard = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Компактна горизонтальна карусель команди (auto-scroll, пауза на hover).
// Не великий грід — оглядова стрічка на всю ширину блоку.
export default function TeamGrid({ members }: { members: TeamCard[] }) {
  if (members.length === 0) return null;

  // Достатньо елементів, щоб стрічка заповнила ширину й безшовно зациклилась.
  const base =
    members.length >= 6
      ? members
      : Array.from({ length: Math.ceil(6 / members.length) }).flatMap(
          () => members,
        );
  const row = [...base, ...base];

  return (
    <div className="marquee py-2">
      <div className="marquee__track" style={{ animationDuration: "42s" }}>
        {row.map((m, i) => (
          <figure
            key={`${m.id}-${i}`}
            className="group flex w-[150px] shrink-0 flex-col items-center text-center"
          >
            <div
              className="relative h-[120px] w-[120px] overflow-hidden rounded-full border border-white/10"
              style={{ background: "var(--surface-2)" }}
            >
              {m.photoUrl ? (
                <SmartMedia
                  src={m.photoUrl}
                  alt={m.name}
                  fill
                  sizes="120px"
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--brand),var(--brand-strong))",
                    color: "#fff",
                  }}
                >
                  {initials(m.name) || "★"}
                </div>
              )}
            </div>
            <figcaption className="mt-3">
              <div className="h-display text-base leading-tight">{m.name}</div>
              <div
                className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--text-muted)" }}
              >
                {m.role}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
