/**
 * AI-наповнення зображеннями через OpenAI Images API (gpt-image-1).
 *
 * Запуск:
 *   npm run ai:fill -- --dry-run        # лише показати, що буде, без витрат
 *   npm run ai:fill                     # згенерувати все з манифеста
 *   npm run ai:fill -- --only hero      # тільки hero банери
 *   npm run ai:fill -- --only team
 *   npm run ai:fill -- --only sites
 *   npm run ai:fill -- --quality medium # low | medium | high (default: medium)
 *
 * Ключ читається з process.env.OPENAI_API_KEY (.env).
 * НЕ передавайте ключ як аргумент і не вставляйте в чат.
 */
import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./public/uploads");
const BRAND_HINT =
  "color palette: deep blue #1f9fe0, violet #6c5ce7, mint #00c2a8, pink #ff6b9a; 2026 cinematic, ultra-modern, agency-tier, premium aesthetic, no text overlays";

type SizePreset = "square" | "landscape" | "portrait";
type Quality = "low" | "medium" | "high";
type Target =
  | { kind: "heroBanner"; placement: string }
  | { kind: "teamByOrder"; order: number }
  | { kind: "siteMockup"; tag: string; saveAsKey: string }
  | { kind: "filesystem"; subdir: string; filename: string };

type ManifestItem = {
  id: string; // людиночитаний ідентифікатор
  prompt: string;
  size: SizePreset;
  target: Target;
};

// ── Хелпери ────────────────────────────────────────────────────────
function dim(s: string) {
  return process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s;
}
function ok(s: string) {
  return process.stdout.isTTY ? `\x1b[32m${s}\x1b[0m` : s;
}
function err(s: string) {
  return process.stdout.isTTY ? `\x1b[31m${s}\x1b[0m` : s;
}

function sizeFor(s: SizePreset): string {
  return s === "landscape"
    ? "1536x1024"
    : s === "portrait"
      ? "1024x1536"
      : "1024x1024";
}

async function generateImage(
  prompt: string,
  size: SizePreset,
  quality: Quality,
): Promise<Buffer> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY не задано. Додайте новий ключ у .env, потім перезапустіть.",
    );
  }
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: sizeFor(size),
      quality,
      n: 1,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    data: { b64_json: string }[];
  };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI повернув порожню відповідь");
  return Buffer.from(b64, "base64");
}

async function saveBufferAsPng(buf: Buffer, base: string): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const safe = base.replace(/[^a-z0-9-_]/gi, "-").slice(0, 60);
  const name = `${safe}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}.png`;
  await writeFile(path.join(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}

async function persistMediaAsset(url: string, alt: string) {
  try {
    await prisma.mediaAsset.create({
      data: { url, type: "image", alt: alt.slice(0, 120) },
    });
  } catch {
    /* best-effort */
  }
}

// ── Манифест: що генеруємо ─────────────────────────────────────────
const PLACEMENT_HINTS: Record<string, string> = {
  tiktok:
    "vertical streaks of fast neon light slicing through dark space, kinetic motion blur, hot pink and cyan accents",
  google:
    "abstract data field with glowing dotted matrix forming gentle waves, cool sterile clarity, mint and blue accents",
  facebook:
    "stacked translucent rectangles drifting in deep blue space, soft cyan gradient, quiet corporate feel",
  instagram:
    "abstract rings of warm gradient light blooming around a soft glass orb, magenta-to-amber arcs, vibrant",
  pinterest:
    "soft mood-board of layered torn paper textures rendered as floating glass plates, warm peach and rose tones",
  telegram:
    "abstract folded glass shape gliding through dark blue space leaving a trail of light, minimal clean motion",
};

const MANIFEST: ManifestItem[] = [
  // Hero банери (6 плейсментів) — горизонтальні
  ...Object.entries(PLACEMENT_HINTS).map(([placement, hint]) => ({
    id: `hero-${placement}`,
    prompt: `Premium 3D cinematic abstract studio shot. ${hint}. Soft volumetric beams, dust particles, deep dramatic studio lighting, photoreal CGI, magazine-cover quality. Pure abstract composition — absolutely no phones, no UI panels, no app screens, no logos, no text, no human figures. Wide landscape orientation. ${BRAND_HINT}.`,
    size: "landscape" as const,
    target: { kind: "heroBanner" as const, placement },
  })),

  // Команда: 11 нейрофото портретів (по order 0..10)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `team-${i}`,
    prompt: `Photoreal portrait of a creative marketing professional in a modern 2026 agency office, varied ethnicity and style, confident relaxed pose, soft cinematic lighting, shallow depth of field, bokeh background, neutral attire, no visible logos, premium magazine quality.`,
    size: "square" as const,
    target: { kind: "teamByOrder" as const, order: i },
  })),

  // Hero centerpiece — преміум 3D-обʼєкт справа від headline (Cyrclo-style)
  {
    id: "hero-centerpiece",
    prompt: `Premium hero centerpiece for a 2026 performance-marketing & dev agency. A single hyper-modern abstract sculpture floating in studio space — layered glass and chrome ribbons twisting through each other forming a tall vertical shape, refracting prismatic light, soft volumetric beams, subtle particle haze. Deep dramatic studio lighting, photoreal CGI, magazine-cover quality. Color story: deep blue #1f9fe0, violet #6c5ce7 highlights, mint #00c2a8 accents, soft pink #ff6b9a edge. Vertical portrait composition with negative space at top. No text, no UI elements, no logos, no phones. Ultra-premium agency aesthetic.`,
    size: "portrait" as const,
    target: {
      kind: "filesystem" as const,
      subdir: "hero",
      filename: "hero-centerpiece.png",
    },
  },

  // Service-stages для горизонтального scroll-блоку «Послуги»
  ...[
    {
      slug: "creative",
      hint: "Abstract product imagery for creative production / brand assets: floating glass tiles, brushes of light, frozen ink in mid-air, layered 3D shapes",
    },
    {
      slug: "campaigns",
      hint: "Abstract product imagery for performance marketing campaigns: floating dashboard panels with glowing data streams, particle flow indicating audience targeting, deep field cinematic light",
    },
    {
      slug: "analytics",
      hint: "Abstract product imagery for analytics and scaling: glass charts and KPI tiles floating in dark space, gradient lines of growth, holographic dashboard fragments",
    },
    {
      slug: "leadgen",
      hint: "Abstract product imagery for lead-gen funnels and CRM systems: stylized abstract user pipeline rendered as floating glass cards connected by light, soft volumetric beams",
    },
    {
      slug: "platforms",
      hint: "Abstract product imagery for custom SaaS and CRM platforms: layered glass UI panes assembled in 3D space with subtle code/data motifs, depth of field, premium tech feel",
    },
  ].map(({ slug, hint }) => ({
    id: `service-${slug}`,
    prompt: `Premium 3D cinematic abstract product visual. ${hint}. ${BRAND_HINT}.`,
    size: "landscape" as const,
    target: {
      kind: "filesystem" as const,
      subdir: "services",
      filename: `service-${slug}.png`,
    },
  })),

  // Bento «Сайти, які ми робимо» (6 ніш)
  ...[
    { tag: "E-commerce", key: "ecom" },
    { tag: "Landing", key: "landing" },
    { tag: "SaaS", key: "saas" },
    { tag: "Beauty", key: "beauty" },
    { tag: "Auto", key: "auto" },
    { tag: "Restaurant", key: "resto" },
  ].map(({ tag, key }) => ({
    id: `site-${key}`,
    prompt: `Premium abstract product visual representing a ${tag} brand website experience — NO real text or letters anywhere in the image. Show a stylized website mockup hint: layered glass UI cards with abstract shapes instead of words (use only gentle wavy lines, dots, soft rectangles where text would be), inside a minimal browser frame with three small soft dots in the top-left. Render every text region as elegant horizontal placeholder bars (no letters, no readable strings). Ultra-modern 2026 agency-tier design, photoreal CGI, depth of field. ${BRAND_HINT}.`,
    size: "landscape" as const,
    target: { kind: "siteMockup" as const, tag, saveAsKey: key },
  })),

  // News covers (3 шт, landscape) — для blog-постів
  ...[
    {
      slug: "tiktok-bans",
      hint: "abstract editorial illustration about TikTok account bans, broken neon thread severing in dark space, magenta and cyan tension",
    },
    {
      slug: "google-pmax",
      hint: "abstract editorial illustration about Google Performance Max automation, glowing mesh nodes self-assembling, sterile blue tech mood",
    },
    {
      slug: "telegram-ads",
      hint: "abstract editorial illustration about Telegram Ads growing share, paper-thin glass shapes flying upward leaving cyan trails",
    },
  ].map(({ slug, hint }) => ({
    id: `news-${slug}`,
    prompt: `Editorial cover artwork, ${hint}. Premium magazine cover quality, no text, no logos, photoreal CGI, depth of field. ${BRAND_HINT}.`,
    size: "landscape" as const,
    target: {
      kind: "filesystem" as const,
      subdir: "news",
      filename: `news-${slug}.png`,
    },
  })),

  // Review screenshots (4 шт, portrait) — стилізовані TG-скріни
  ...[0, 1, 2, 3].map((i) => ({
    id: `review-${i}`,
    prompt: `A stylized fake screenshot of a Telegram chat showing a short positive client testimonial in Ukrainian or Russian about working with a performance marketing & dev agency. Mobile portrait composition, dark Telegram UI, time stamp visible, blue accents, one chat bubble of 2-3 short sentences. Use realistic Cyrillic text praising results like ROI / launches / platform delivery. No logos, no real brand names except generic "@agency" handle. Render as if a real phone screenshot. ${BRAND_HINT}.`,
    size: "portrait" as const,
    target: {
      kind: "filesystem" as const,
      subdir: "reviews",
      filename: `review-${i}.png`,
    },
  })),
];

// ── Парсинг CLI ─────────────────────────────────────────────────────
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const DRY = process.argv.includes("--dry-run");
const ONLY = arg("only"); // hero | team | sites
const QUALITY = (arg("quality") as Quality | undefined) ?? "medium";

function matchesOnly(item: ManifestItem): boolean {
  if (!ONLY) return true;
  if (ONLY.startsWith("id:")) return item.id === ONLY.slice(3);
  if (ONLY === "hero") return item.target.kind === "heroBanner";
  if (ONLY === "team") return item.target.kind === "teamByOrder";
  if (ONLY === "sites") return item.target.kind === "siteMockup";
  if (ONLY === "services")
    return item.target.kind === "filesystem" && item.target.subdir === "services";
  if (ONLY === "news")
    return item.target.kind === "filesystem" && item.target.subdir === "news";
  if (ONLY === "reviews")
    return item.target.kind === "filesystem" && item.target.subdir === "reviews";
  return true;
}

// Орієнтовна вартість (грубо, на момент написання): low ~$0.011, medium ~$0.042,
// high ~$0.167 за 1024x1024; landscape/portrait ~×1.5.
const COST: Record<Quality, number> = { low: 0.011, medium: 0.042, high: 0.167 };
function estCost(item: ManifestItem): number {
  return COST[QUALITY] * (item.size === "square" ? 1 : 1.5);
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  const items = MANIFEST.filter(matchesOnly);
  const total = items.reduce((s, it) => s + estCost(it), 0);

  console.log(
    `\n${ok("AI-наповнення")} | quality=${QUALITY} | ${items.length} зображень | ~$${total.toFixed(2)} (груба оцінка)\n`,
  );
  console.log(dim("Манифест:"));
  for (const it of items) {
    console.log(`  ${it.id.padEnd(18)} ${it.size.padEnd(10)} ${it.target.kind}`);
  }

  if (DRY) {
    console.log(`\n${dim("(--dry-run, нічого не генеруємо)")}\n`);
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error(
      `\n${err("✕ OPENAI_API_KEY не знайдено в .env.")}\nДодайте новий ключ у .env і запустіть ще раз.\n`,
    );
    process.exit(1);
  }

  let done = 0;
  for (const it of items) {
    process.stdout.write(`→ ${it.id} ... `);
    try {
      const buf = await generateImage(it.prompt, it.size, QUALITY);
      // filesystem-кейс зберігається в гілці нижче, не дублюємо запис
      const url =
        it.target.kind === "filesystem"
          ? `/uploads/source/${it.target.subdir}/${it.target.filename}`
          : await saveBufferAsPng(buf, it.id);
      if (it.target.kind !== "filesystem") {
        await persistMediaAsset(url, it.prompt);
      }

      // Прив'язка до сутностей
      if (it.target.kind === "heroBanner") {
        await prisma.heroBanner.updateMany({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          where: { placement: it.target.placement as any },
          data: { imageUrl: url },
        });
      } else if (it.target.kind === "teamByOrder") {
        const row = await prisma.teamMember.findFirst({
          where: { order: it.target.order },
        });
        if (row) {
          await prisma.teamMember.update({
            where: { id: row.id },
            data: { photoUrl: url },
          });
        }
      } else if (it.target.kind === "siteMockup") {
        // Поки що бенто-сітка хардкод у компоненті — лише зберігаємо URL.
      } else if (it.target.kind === "filesystem") {
        // зберігаємо у public/uploads/source/<subdir>/<filename> щоб
        // компоненти могли підхопити напряму через fs.existsSync
        const dir = path.resolve(
          process.env.UPLOAD_DIR ?? "./public/uploads",
          "source",
          it.target.subdir,
        );
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, it.target.filename), buf);
        const target = `/uploads/source/${it.target.subdir}/${it.target.filename}`;
        await persistMediaAsset(target, it.prompt);
      }

      console.log(ok(`ok ${url}`));
      done += 1;
    } catch (e) {
      console.log(err(`fail ${e instanceof Error ? e.message : String(e)}`));
    }
  }

  console.log(`\n${ok("✓ Згенеровано:")} ${done}/${items.length}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
