import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { getSettings, getPageBanners, contacts } from "@/lib/content";
import { managerHref } from "@/lib/telegram";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import QuizForm from "@/components/QuizForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const L = (isLocale(locale) ? locale : "ru") as "uk" | "ru";
  return pageMetadata(L, {
    path: "/contacts",
    title:
      L === "uk"
        ? "Контакти — замовити рекламу та трафік"
        : "Контакты — заказать рекламу и трафик",
    description:
      L === "uk"
        ? "Звʼяжіться з маркетинговим агентством TAG Service: залиште заявку на трафік, рекламу та лідогенерацію. Відповідаємо швидко у Telegram."
        : "Свяжитесь с маркетинговым агентством TAG Service: оставьте заявку на трафик, рекламу и лидогенерацию. Отвечаем быстро в Telegram.",
  });
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contacts");
  const [settings, banners] = await Promise.all([getSettings(), getPageBanners()]);
  const c = contacts(settings);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} bannerUrl={banners.contacts} />
      <div className="container-x pb-16">
      <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
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
    </>
  );
}
