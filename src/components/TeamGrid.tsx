import Image from "next/image";

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

export default function TeamGrid({ members }: { members: TeamCard[] }) {
  if (members.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {members.map((m) => (
        <div key={m.id} className="card overflow-hidden">
          <div
            className="relative aspect-square w-full"
            style={{ background: "var(--surface-2)" }}
          >
            {m.photoUrl ? (
              <Image
                src={m.photoUrl}
                alt={m.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold"
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
          <div className="p-4">
            <div className="font-semibold">{m.name}</div>
            <div className="text-muted text-sm">{m.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
