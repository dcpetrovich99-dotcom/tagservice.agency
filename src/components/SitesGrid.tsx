import fs from "node:fs";
import path from "node:path";
import Reveal from "./Reveal";

type Site = {
  key: string;
  tag: string;
  name: string;
  domain: string;
  span: "sm" | "md" | "lg";
  grad: string;
};

const SITES: Site[] = [
  {
    key: "ecom",
    tag: "E-commerce",
    name: "Plejcholder Store",
    domain: "yourshop.example",
    span: "lg",
    grad: "linear-gradient(135deg,#1f9fe0,#6c5ce7)",
  },
  {
    key: "landing",
    tag: "Landing",
    name: "Campaign LP",
    domain: "promo.example",
    span: "sm",
    grad: "linear-gradient(135deg,#00c2a8,#1f9fe0)",
  },
  {
    key: "saas",
    tag: "SaaS",
    name: "App Dashboard",
    domain: "app.example",
    span: "md",
    grad: "linear-gradient(135deg,#6c5ce7,#ff6b9a)",
  },
  {
    key: "beauty",
    tag: "Beauty",
    name: "Beauty Studio",
    domain: "studio.example",
    span: "sm",
    grad: "linear-gradient(135deg,#ff6b9a,#ffd166)",
  },
  {
    key: "auto",
    tag: "Auto",
    name: "Auto Import",
    domain: "auto.example",
    span: "md",
    grad: "linear-gradient(135deg,#0f7fb5,#0e1b2c)",
  },
  {
    key: "resto",
    tag: "Restaurant",
    name: "Resto Booking",
    domain: "resto.example",
    span: "sm",
    grad: "linear-gradient(135deg,#00c2a8,#6c5ce7)",
  },
];

// Якщо у public/uploads/source/sites/site-<key>.{png|jpg|jpeg|webp} є файл —
// беремо його як фон картки; інакше градієнт.
function findSiteImage(key: string): string | null {
  const dir = path.join(process.cwd(), "public", "uploads", "source", "sites");
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const file = `site-${key}.${ext}`;
    if (fs.existsSync(path.join(dir, file))) {
      return `/uploads/source/sites/${file}`;
    }
  }
  return null;
}

function spanClass(s: Site["span"]) {
  if (s === "lg") return "sm:col-span-2 sm:row-span-2";
  if (s === "md") return "sm:col-span-2";
  return "";
}

export default function SitesGrid({
  heading,
  kicker,
  placeholderNote,
}: {
  heading: string;
  kicker: string;
  placeholderNote: string;
}) {
  return (
    <section className="container-x section">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="kicker">{kicker}</span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl">{heading}</h2>
        </div>
        <span className="text-muted text-sm">{placeholderNote}</span>
      </div>

      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {SITES.map((s, i) => (
          <Reveal key={i} delay={i * 0.05} className={spanClass(s.span)}>
            <div className="card group relative h-full overflow-hidden">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span
                  className="ml-2 truncate text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {s.domain}
                </span>
              </div>
              <div
                className="relative flex h-[calc(100%-38px)] items-end p-5"
                style={(() => {
                  const img = findSiteImage(s.key);
                  return img
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.55) 100%), url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : { background: s.grad };
                })()}
              >
                <span
                  className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {s.tag}
                </span>
                <div>
                  <div
                    className="num-accent text-xs"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {String(i + 1).padStart(2, "0")} / placeholder
                  </div>
                  <div
                    className="h-display mt-1 text-xl sm:text-2xl"
                    style={{ color: "#fff" }}
                  >
                    {s.name}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
