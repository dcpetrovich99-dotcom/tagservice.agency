import { getTranslations } from "next-intl/server";

export default async function Footer({
  manager,
  channel,
}: {
  manager: string;
  channel: string;
}) {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t" style={{ background: "var(--surface)" }}>
      <div className="container-x flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-display text-base font-bold">
            AGENCY<span style={{ color: "var(--brand-strong)" }}>.traffic</span>
          </div>
          <p className="text-muted mt-1 text-sm">© {year}. {t("rights")}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-muted text-xs uppercase tracking-wider">
            {t("contactsTitle")}
          </span>
          <a
            href={manager}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: "var(--brand-strong)" }}
          >
            {t("manager")} → Telegram
          </a>
          <a
            href={channel}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: "var(--brand-strong)" }}
          >
            {t("channel")} → Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
