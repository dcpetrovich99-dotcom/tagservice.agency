import "server-only";
import { prisma } from "./db";
import { env } from "./env";

type Locale = "uk" | "ru";

// Будь-який збій БД (немає підключення / ще не мігровано) → безпечний
// фолбек, щоб сайт рендерився і збирався без живої бази.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/** Локалізований вибір поля: pickL(obj, "title", locale) → obj.titleUk|titleRu */
export function pickL<T extends Record<string, unknown>>(
  obj: T,
  base: string,
  locale: Locale,
): string {
  const key = base + (locale === "uk" ? "Uk" : "Ru");
  return String(obj[key] ?? "");
}

export type SettingsMap = Record<string, { uk: string; ru: string }>;

export const getSettings = (): Promise<SettingsMap> =>
  safe(async () => {
    const rows = await prisma.siteSetting.findMany();
    const map: SettingsMap = {};
    for (const r of rows) map[r.key] = { uk: r.valueUk, ru: r.valueRu };
    return map;
  }, {});

export function setting(
  map: SettingsMap,
  key: string,
  locale: Locale,
  fallback = "",
): string {
  const v = map[key];
  if (!v) return fallback;
  return (locale === "uk" ? v.uk : v.ru) || fallback;
}

/** Контакти ТГ із налаштувань або з env як дефолт. */
export function contacts(map: SettingsMap) {
  return {
    manager: setting(map, "tg_manager", "uk", env.tgManager),
    channel: setting(map, "tg_channel", "uk", env.tgManager),
  };
}

export const getHeroBanners = () =>
  safe(
    () =>
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    [] as Awaited<ReturnType<typeof prisma.heroBanner.findMany>>,
  );

export const getTeam = () =>
  safe(
    () => prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.teamMember.findMany>>,
  );

export const getReviews = () =>
  safe(
    () => prisma.review.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.review.findMany>>,
  );

export const getNiches = (type: "white" | "grey") =>
  safe(
    () =>
      prisma.niche.findMany({
        where: { type },
        orderBy: { order: "asc" },
      }),
    [] as Awaited<ReturnType<typeof prisma.niche.findMany>>,
  );

export const getCases = (limit?: number) =>
  safe(
    () =>
      prisma.case.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
        ...(limit ? { take: limit } : {}),
      }),
    [] as Awaited<ReturnType<typeof prisma.case.findMany>>,
  );

export const getNews = (limit?: number) =>
  safe(
    () =>
      prisma.newsPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        ...(limit ? { take: limit } : {}),
      }),
    [] as Awaited<ReturnType<typeof prisma.newsPost.findMany>>,
  );

export const getNewsBySlug = (slug: string) =>
  safe(() => prisma.newsPost.findUnique({ where: { slug } }), null);

export const getServices = () =>
  safe(
    () => prisma.service.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.service.findMany>>,
  );

export const getFaq = () =>
  safe(
    () => prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.faqItem.findMany>>,
  );
