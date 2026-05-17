import "server-only";
import { env } from "./env";
import { BUDGET_LABEL } from "./validation";

/** Приводить "@nick" | "nick" | "https://t.me/nick" → "nick". */
function tgUsername(raw: string): string {
  let s = (raw || "").trim();
  s = s.replace(/^https?:\/\/t\.me\//i, "");
  s = s.replace(/^@/, "");
  s = s.split(/[/?#]/)[0];
  return s;
}

export function managerHref(raw: string): string {
  const u = tgUsername(raw);
  return u ? `https://t.me/${u}` : raw || env.tgManager;
}

export type LeadLike = {
  projectDesc: string;
  projectLinks?: string | null;
  dailyBudget: string;
  hasActiveTraffic: boolean;
  contact: string;
  locale: string;
  sourcePage: string;
};

function summary(lead: LeadLike): string {
  const yes = lead.locale === "uk" ? "Так" : "Да";
  const no = lead.locale === "uk" ? "Ні" : "Нет";
  return [
    "🆕 Нова заявка з сайту",
    `Ніша/проєкт: ${lead.projectDesc}`,
    `Посилання: ${lead.projectLinks || "—"}`,
    `Бюджет/день: ${BUDGET_LABEL[lead.dailyBudget] ?? lead.dailyBudget}`,
    `Активний трафік: ${lead.hasActiveTraffic ? yes : no}`,
    `Контакт: ${lead.contact}`,
    `Мова/сторінка: ${lead.locale} / ${lead.sourcePage}`,
  ].join("\n");
}

/** Дип-лінк менеджера з префілл-текстом заявки. */
export function managerDeepLink(managerRaw: string, lead: LeadLike): string {
  const base = managerHref(managerRaw);
  const text = encodeURIComponent(summary(lead));
  return `${base}?text=${text}`;
}

/** Опційне сповіщення у чат/канал через бота (мовчки no-op без токена). */
export async function notifyTelegram(lead: LeadLike): Promise<void> {
  if (!env.telegramBotToken || !env.telegramChatId) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.telegramChatId,
          text: summary(lead),
          disable_web_page_preview: true,
        }),
      },
    );
  } catch {
    // best-effort: не блокуємо користувача, якщо сповіщення не пройшло
  }
}
