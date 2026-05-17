import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { getSettings, contacts } from "@/lib/content";
import { managerDeepLink, notifyTelegram } from "@/lib/telegram";

export const runtime = "nodejs";

// Простенький in-memory rate-limit (на інстанс): 5 заявок / 10 хв з IP.
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

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 422 },
    );
  }
  const d = parsed.data;

  // Honeypot заповнено → бот. Прикидаємось успіхом, нічого не зберігаємо.
  const settings = await getSettings();
  const manager = contacts(settings).manager;
  if (d.company && d.company.length > 0) {
    return NextResponse.json({
      ok: true,
      redirect: managerDeepLink(manager, { ...d, projectLinks: d.projectLinks }),
    });
  }

  const leadData = {
    niche: d.projectDesc.slice(0, 120),
    projectDesc: d.projectDesc,
    projectLinks: d.projectLinks || null,
    dailyBudget: d.dailyBudget,
    hasActiveTraffic: d.hasActiveTraffic,
    contact: d.contact,
    locale: d.locale,
    sourcePage: d.sourcePage,
  };

  // Зберігаємо best-effort: якщо БД недоступна — все одно даємо лінк на ТГ.
  try {
    await prisma.lead.create({ data: leadData });
  } catch {
    /* лог пропускаємо; користувача не блокуємо */
  }

  await notifyTelegram({ ...leadData });

  return NextResponse.json({
    ok: true,
    redirect: managerDeepLink(manager, leadData),
  });
}
