import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PROJECTS } from "@/lib/projects";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const LOCALES = ["uk", "ru"] as const;

// Статичні розділи сайту (без локального префікса).
const STATIC_PATHS = ["", "/services", "/cases", "/white", "/grey", "/news", "/contacts"];

// hreflang-альтернативи для кожного шляху.
function alternatesFor(path: string): Record<string, string> {
  return {
    uk: `${SITE_URL}/uk${path}`,
    ru: `${SITE_URL}/ru${path}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Статичні сторінки × обидві локалі.
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : path === "/services" ? 0.9 : 0.7,
        alternates: { languages: alternatesFor(path) },
      });
    }
  }

  // Кейси (web-dev) — статичні слаги з коду.
  for (const p of PROJECTS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/cases/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: alternatesFor(`/cases/${p.slug}`) },
      });
    }
  }

  // Новини/блог — слаги з БД (best-effort).
  try {
    const posts = await prisma.newsPost.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    for (const post of posts) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${locale}/news/${post.slug}`,
          lastModified: post.publishedAt,
          changeFrequency: "monthly",
          priority: 0.5,
          alternates: { languages: alternatesFor(`/news/${post.slug}`) },
        });
      }
    }
  } catch {
    // БД недоступна під час білда — повертаємо хоча б статичні маршрути.
  }

  return entries;
}
