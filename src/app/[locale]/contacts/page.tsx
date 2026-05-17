import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getSettings, contacts } from "@/lib/content";
import { managerHref } from "@/lib/telegram";
import SectionHeading from "@/components/SectionHeading";
import QuizForm from "@/components/QuizForm";

export const dynamic = "force-dynamic";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contacts");
  const settings = await getSettings();
  const c = contacts(settings);

  return (
    <div className="container-x section">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <a
            href={managerHref(c.manager)}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <span className="font-semibold">{t("manager")}</span>
            <span style={{ color: "var(--brand-strong)" }}>Telegram →</span>
          </a>
          <a
            href={managerHref(c.channel)}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <span className="font-semibold">{t("channel")}</span>
            <span style={{ color: "var(--brand-strong)" }}>Telegram →</span>
          </a>
        </div>

        <QuizForm sourcePage="contacts" />
      </div>
    </div>
  );
}
