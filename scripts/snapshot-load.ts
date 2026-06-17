/**
 * Завантажує prisma/snapshot.json у БД (прод). Запускається у preDeploy на
 * Railway, де DATABASE_URL (internal) доступний. Одноразово: маркер-сеттінг
 * "snapshot_loaded" блокує повторний запуск, щоб не затирати правки, зроблені
 * пізніше через прод-адмінку.
 *
 * Запуск: npm run db:snapshot:load
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MARKER = "snapshot_loaded";

async function main() {
  const already = await prisma.siteSetting.findUnique({ where: { key: MARKER } });
  if (already) {
    console.log("• snapshot: вже завантажено — пропускаю");
    return;
  }

  const file = path.resolve("prisma/snapshot.json");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snap: Record<string, any[]> = JSON.parse(await readFile(file, "utf8"));

  // newsPost.publishedAt → Date
  for (const n of snap.newsPost ?? []) {
    if (n.publishedAt) n.publishedAt = new Date(n.publishedAt);
  }

  // Послідовність: спершу чистимо, потім вставляємо (між контент-таблицями
  // немає FK, тож порядок не критичний).
  const tables: [string, () => Promise<unknown>, () => Promise<unknown>][] = [
    ["heroBanner", () => prisma.heroBanner.deleteMany(), () => prisma.heroBanner.createMany({ data: snap.heroBanner ?? [] })],
    ["teamMember", () => prisma.teamMember.deleteMany(), () => prisma.teamMember.createMany({ data: snap.teamMember ?? [] })],
    ["review", () => prisma.review.deleteMany(), () => prisma.review.createMany({ data: snap.review ?? [] })],
    ["niche", () => prisma.niche.deleteMany(), () => prisma.niche.createMany({ data: snap.niche ?? [] })],
    ["case", () => prisma.case.deleteMany(), () => prisma.case.createMany({ data: snap.case ?? [] })],
    ["newsPost", () => prisma.newsPost.deleteMany(), () => prisma.newsPost.createMany({ data: snap.newsPost ?? [] })],
    ["service", () => prisma.service.deleteMany(), () => prisma.service.createMany({ data: snap.service ?? [] })],
    ["faqItem", () => prisma.faqItem.deleteMany(), () => prisma.faqItem.createMany({ data: snap.faqItem ?? [] })],
    ["pageBanner", () => prisma.pageBanner.deleteMany(), () => prisma.pageBanner.createMany({ data: snap.pageBanner ?? [] })],
  ];

  for (const [label, del, create] of tables) {
    await del();
    const data = snap[label] ?? [];
    if (data.length) await create();
    console.log(`• ${label}: ${data.length}`);
  }

  // siteSetting + маркер
  await prisma.siteSetting.deleteMany();
  if ((snap.siteSetting ?? []).length) {
    await prisma.siteSetting.createMany({ data: snap.siteSetting });
  }
  await prisma.siteSetting.upsert({
    where: { key: MARKER },
    create: { key: MARKER, valueUk: "1", valueRu: "1" },
    update: {},
  });
  console.log(`• siteSetting: ${(snap.siteSetting ?? []).length} (+ marker)`);
  console.log("✔ snapshot завантажено");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
