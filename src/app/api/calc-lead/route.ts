import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// In-memory rate-limit (на інстанс): 5 заявок / 10 хв з IP.
const hits = new Map<string, { n: number; ts: number }>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { n: 1, ts: now });
    return false;
  }
  rec.n += 1;
  return rec.n > LIMIT;
}

const calcSchema = z.object({
  niche: z.string().min(1).max(120),
  nicheType: z.enum(["white", "grey"]),
  geo: z.string().max(40).default(""),
  dailyBudget: z.number().positive().max(1_000_000),
  monthlyBudget: z.number().nonnegative().max(30_000_000),
  leadsMin: z.number().int().nonnegative(),
  leadsMax: z.number().int().nonnegative(),
  unit: z.string().max(40).default(""),
  tg: z.string().max(120).default(""),
  phone: z.string().max(40).default(""),
  locale: z.enum(["uk", "ru"]),
});

function summary(d: z.infer<typeof calcSchema>): string {
  return [
    "🧮 Заявка з калькулятора лідів",
    `Ніша: ${d.niche} (${d.nicheType === "white" ? "біла" : "сіра"})`,
    `Гео: ${d.geo || "—"}`,
    `Бюджет/день: $${d.dailyBudget}  •  /міс: $${d.monthlyBudget.toLocaleString()}`,
    `Прогноз: ${d.leadsMin}–${d.leadsMax} ${d.unit}/міс`,
    `Telegram: ${d.tg || "—"}`,
    `Телефон: ${d.phone || "—"}`,
    `Мова: ${d.locale}`,
  ].join("\n");
}

async function notify(text: string): Promise<void> {
  if (!env.telegramBotToken || !env.telegramChatId) {
    console.error(
      "[calc-lead] заявку НЕ надіслано: відсутні TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID у середовищі",
    );
    return;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.telegramChatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      console.error(
        `[calc-lead] sendMessage ${res.status}: ${await res.text().catch(() => "")}`,
      );
    }
  } catch (e) {
    // best-effort: не блокуємо користувача
    console.error("[calc-lead] sendMessage помилка мережі:", e);
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad" }, { status: 400 });
  }

  const parsed = calcSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }
  const d = parsed.data;

  // Потрібен хоч один контакт.
  if (!d.tg && !d.phone) {
    return NextResponse.json({ ok: false, error: "contact" }, { status: 422 });
  }

  // Best-effort у БД (Lead-модель спільна з квіз-формою).
  try {
    await prisma.lead.create({
      data: {
        niche: `${d.niche} (${d.nicheType})`,
        projectDesc: `Калькулятор: ${d.niche}, гео ${d.geo || "—"} — прогноз ${d.leadsMin}–${d.leadsMax} ${d.unit}/міс`,
        projectLinks: null,
        dailyBudget: `$${d.dailyBudget}`,
        hasActiveTraffic: false,
        contact: [d.tg, d.phone].filter(Boolean).join(" / "),
        locale: d.locale,
        sourcePage: "calculator",
      },
    });
  } catch {
    /* користувача не блокуємо */
  }

  await notify(summary(d));

  return NextResponse.json({ ok: true });
}
