/**
 * Імпорт зображень з public/uploads/source/ у БД.
 * Сканує підтеки hero/ team/ sites/, прив'язує до сутностей за іменем файлу.
 *
 * Імена:
 *   hero/hero-<placement>.png  → HeroBanner(placement=<placement>).imageUrl
 *   team/team-<N>.png          → TeamMember(order=<N>).photoUrl
 *   sites/site-<key>.png       → MediaAsset (бенто читає файл напряму)
 *
 * Запуск: npm run import:sources
 */
import "dotenv/config";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROOT = path.resolve("public/uploads/source");
const VALID = /\.(png|jpe?g|webp)$/i;
const PLACEMENTS = new Set([
  "tiktok",
  "google",
  "facebook",
  "instagram",
  "pinterest",
  "telegram",
]);

function ok(s: string) {
  return process.stdout.isTTY ? `\x1b[32m${s}\x1b[0m` : s;
}
function dim(s: string) {
  return process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s;
}
function err(s: string) {
  return process.stdout.isTTY ? `\x1b[31m${s}\x1b[0m` : s;
}

async function listFiles(dir: string): Promise<string[]> {
  try {
    const items = await readdir(dir);
    const out: string[] = [];
    for (const name of items) {
      if (!VALID.test(name)) continue;
      const full = path.join(dir, name);
      const s = await stat(full);
      if (s.isFile()) out.push(name);
    }
    return out.sort();
  } catch {
    return [];
  }
}

async function upsertAsset(url: string, alt: string) {
  // дедуп за url
  const exists = await prisma.mediaAsset.findFirst({ where: { url } });
  if (exists) return;
  await prisma.mediaAsset.create({
    data: { url, type: "image", alt: alt.slice(0, 120) },
  });
}

async function main() {
  console.log(`\n${ok("Імпорт source/")} → БД\n`);

  // ── HERO ───────────────────────────────────────────────────────
  const heroFiles = await listFiles(path.join(ROOT, "hero"));
  console.log(dim(`hero/ : ${heroFiles.length} файл(ів)`));
  for (const f of heroFiles) {
    const m = f.match(/^hero-([a-z]+)\./i);
    const placement = m?.[1]?.toLowerCase();
    if (!placement || !PLACEMENTS.has(placement)) {
      console.log(`  ${err("skip")} ${f} (не розпізнано плейсмент)`);
      continue;
    }
    const url = `/uploads/source/hero/${f}`;
    const upd = await prisma.heroBanner.updateMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { placement: placement as any },
      data: { imageUrl: url },
    });
    await upsertAsset(url, `hero ${placement}`);
    console.log(`  ${ok("→")} ${f} → HeroBanner(${placement}) [${upd.count}]`);
  }

  // ── TEAM ───────────────────────────────────────────────────────
  const teamFiles = await listFiles(path.join(ROOT, "team"));
  console.log(dim(`\nteam/ : ${teamFiles.length} файл(ів)`));
  for (const f of teamFiles) {
    const m = f.match(/^team-(\d+)\./i);
    const order = m ? Number(m[1]) : null;
    if (order === null) {
      console.log(`  ${err("skip")} ${f} (не розпізнано порядок)`);
      continue;
    }
    const row = await prisma.teamMember.findFirst({ where: { order } });
    if (!row) {
      console.log(`  ${err("skip")} ${f} (немає TeamMember з order=${order})`);
      continue;
    }
    const url = `/uploads/source/team/${f}`;
    await prisma.teamMember.update({
      where: { id: row.id },
      data: { photoUrl: url },
    });
    await upsertAsset(url, `team ${order}`);
    console.log(`  ${ok("→")} ${f} → TeamMember[order=${order}]`);
  }

  // ── SITES ──────────────────────────────────────────────────────
  const siteFiles = await listFiles(path.join(ROOT, "sites"));
  console.log(dim(`\nsites/ : ${siteFiles.length} файл(ів)`));
  for (const f of siteFiles) {
    const url = `/uploads/source/sites/${f}`;
    await upsertAsset(url, `site mockup`);
    console.log(`  ${ok("→")} ${f} (SitesGrid читає файл напряму)`);
  }

  console.log(`\n${ok("✓ Готово.")}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
