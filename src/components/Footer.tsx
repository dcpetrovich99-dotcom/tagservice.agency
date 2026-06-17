import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BrandMark from "./BrandMark";

const NAV = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/cases", key: "cases" },
  { href: "/white", key: "white" },
  { href: "/grey", key: "grey" },
  { href: "/news", key: "news" },
  { href: "/contacts", key: "contacts" },
] as const;

export default async function Footer({
  manager,
  channel,
}: {
  manager: string;
  channel: string;
}) {
  const t = await getTranslations("footer");
  const tnav = await getTranslations("nav");
  const tcommon = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-24 overflow-hidden border-t"
      style={{ background: "var(--surface)" }}
    >
      {/* мега-CTA */}
      <div className="container-x relative py-20 sm:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: "var(--text-muted)" }}
            >
              <span style={{ color: "var(--brand-strong)" }}>∞</span>
              <span>—</span>
              <span>start a project</span>
            </div>
            <h2 className="hero-title mt-6 text-[clamp(2.6rem,6.4vw,6.5rem)] leading-[0.95]">
              LET&apos;S BUILD
              <br />
              SOMETHING.
            </h2>
            <p
              className="text-muted mt-7 font-mono text-sm uppercase tracking-[0.22em]"
            >
              Lviv — Worldwide
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={manager}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full justify-between"
            >
              <span>{t("manager")}</span>
              <span>→</span>
            </a>
            <a
              href={channel}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full justify-between"
            >
              <span>{t("channel")}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* divider + sitemap */}
      <div className="border-t">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand col */}
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} uniqueId="footer" />
              <span
                className="font-mono text-base font-bold tracking-[0.04em]"
                style={{ color: "var(--text)" }}
              >
                TAG SERVICE
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.32em]"
                style={{ color: "var(--text-muted)" }}
              >
                AGENCY
              </span>
            </div>
            <p className="text-muted mt-4 max-w-sm text-sm">
              Performance marketing + custom dev. Тільки реальні платформи,
              тільки прозорі звіти.
            </p>
            <div
              className="text-muted mt-6 font-mono text-[11px] uppercase tracking-[0.22em]"
            >
              © {year} · TAG SERVICE / 2026
            </div>
          </div>

          {/* nav col */}
          <div>
            <div
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "var(--text-muted)" }}
            >
              navigation
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm font-medium">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
                  >
                    <span style={{ color: "var(--text-muted)" }}>·</span>
                    <span>{tnav(n.key)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contacts col */}
          <div>
            <div
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "var(--text-muted)" }}
            >
              direct
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={manager}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium"
                  style={{ color: "var(--brand-strong)" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  Telegram · {t("manager")}
                </a>
              </li>
              <li>
                <a
                  href={channel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium"
                  style={{ color: "var(--brand-strong)" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  Telegram · {t("channel")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* legal strip */}
      <div className="border-t">
        <div className="container-x flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span style={{ color: "var(--text-muted)" }}>{t("rights")}</span>
          <span
            className="font-mono uppercase tracking-[0.22em]"
            style={{ color: "var(--text-muted)" }}
          >
            built in-house · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
