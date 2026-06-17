/**
 * Знімок локальної БД (контент + медіа) → prisma/snapshot.json, готовий до
 * завантаження на прод. Медіа-файли з /uploads/<hash> (не source/) копіюються
 * у public/uploads/source/imported/ (закомічена тека), а URL переписуються —
 * щоб на проді вони віддавались статикою.
 *
 * Запуск (локально): npm run db:snapshot:dump
 */
import "dotenv/config";
import { writeFile, mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PUBLIC = path.resolve("public");
const IMPORTED_DIR = path.join(PUBLIC, "uploads", "source", "imported");
const MEDIA_FIELDS = [
  "imageUrl",
  "photoUrl",
  "coverUrl",
  "creoImageUrl",
  "bannerUrl",
];

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// Копіює локальний файл медіа у source/imported і повертає новий URL.
async function relocate(url: string): Promise<string> {
  if (!url || !url.startsWith("/uploads/")) return url;
  if (url.startsWith("/uploads/source/")) return url; // вже закомічено
  const abs = path.join(PUBLIC, url.replace(/^\//, ""));
  if (!(await exists(abs))) {
    console.warn(`  ⚠ файл відсутній: ${url}`);
    return url;
  }
  await mkdir(IMPORTED_DIR, { recursive: true });
  const base = path.basename(abs);
  await copyFile(abs, path.join(IMPORTED_DIR, base));
  return `/uploads/source/imported/${base}`;
}

async function dumpTable<T extends Record<string, unknown>>(
  rows: T[],
  label: string,
): Promise<T[]> {
  const out: T[] = [];
  for (const row of rows) {
    const r: Record<string, unknown> = { ...row };
    delete r.updatedAt;
    for (const f of MEDIA_FIELDS) {
      if (typeof r[f] === "string" && r[f]) {
        r[f] = await relocate(r[f] as string);
      }
    }
    out.push(r as T);
  }
  console.log(`• ${label}: ${out.length}`);
  return out;
}

async function main() {
  const snapshot = {
    heroBanner: await dumpTable(await prisma.heroBanner.findMany(), "heroBanner"),
    teamMember: await dumpTable(await prisma.teamMember.findMany(), "teamMember"),
    review: await dumpTable(await prisma.review.findMany(), "review"),
    niche: await dumpTable(await prisma.niche.findMany(), "niche"),
    case: await dumpTable(await prisma.case.findMany(), "case"),
    newsPost: await dumpTable(await prisma.newsPost.findMany(), "newsPost"),
    service: await dumpTable(await prisma.service.findMany(), "service"),
    faqItem: await dumpTable(await prisma.faqItem.findMany(), "faqItem"),
    siteSetting: await dumpTable(
      (await prisma.siteSetting.findMany()).filter(
        (s) => s.key !== "snapshot_loaded",
      ),
      "siteSetting",
    ),
    pageBanner: await dumpTable(await prisma.pageBanner.findMany(), "pageBanner"),
  };
  const file = path.resolve("prisma/snapshot.json");
  await writeFile(file, JSON.stringify(snapshot, null, 2));
  console.log(`\n✔ Знімок → ${file}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
