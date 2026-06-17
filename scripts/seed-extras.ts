/**
 * Створює/оновлює: 3 NewsPost (з cover-ами) + 4 Review (з TG-screen images).
 * Файли мають уже лежати у public/uploads/source/news/ та .../reviews/.
 *
 * Запуск: npm run db:seed:extras
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const NEWS = [
  {
    slug: "tiktok-bans-2026",
    coverFile: "news-tiktok-bans.png",
    titleUk: "TikTok-бани літа 2026: що змінилось у антифрод-системі",
    titleRu: "TikTok-баны лета 2026: что изменилось в антифрод-системе",
    bodyUk:
      "Останні два тижні аккаунт-фарм у TikTok став помітно нестабільнішим: модерація почала ретельніше валідувати поведінкові сигнали в першу годину після створення. Розповідаємо, які антибан-практики ще працюють: прогрів через UGC-перегляди, унікальні fingerprint-проксі під регіон, повільне нарощування рекламного бюджету.",
    bodyRu:
      "Последние две недели аккаунт-фарм в TikTok стал заметно нестабильнее: модерация начала тщательнее валидировать поведенческие сигналы в первый час после создания. Рассказываем, какие антибан-практики ещё работают: прогрев через UGC-просмотры, уникальные fingerprint-прокси под регион, медленное наращивание рекламного бюджета.",
  },
  {
    slug: "google-pmax-shifts-2026",
    coverFile: "news-google-pmax.png",
    titleUk: "Google Performance Max: ШІ-таргетинг навчився Cyrillic-аудиторій",
    titleRu: "Google Performance Max: ИИ-таргетинг научился Cyrillic-аудиториям",
    bodyUk:
      "До червня 2026 PMax відверто провалювався на UA/RU нішах через мовну невизначеність. Тепер автотаргетинг розрізняє регіони і подачу — ROAS у наших білих нішах виріс у середньому на 38%. Розбираємо, як готувати фід і креативи під новий алгоритм.",
    bodyRu:
      "До июня 2026 PMax откровенно проваливался на UA/RU нишах из-за языковой неопределённости. Теперь автотаргетинг различает регионы и подачу — ROAS в наших белых нишах вырос в среднем на 38%. Разбираем, как готовить фид и креативы под новый алгоритм.",
  },
  {
    slug: "telegram-ads-2026",
    coverFile: "news-telegram-ads.png",
    titleUk: "Telegram Ads: ставки впали, поріг входу — теж",
    titleRu: "Telegram Ads: ставки упали, порог входа — тоже",
    bodyUk:
      "Telegram Ads нарешті відкрив self-serve кабінет із порогом $10 та мінімальною CPM від €0.5. Сегментуємо по каналах та інтересах, дотягуємо retention через TG-розсилки. На пілотних запусках у CIS-аудиторії — CPL у 3-4× нижчий за Meta при тому ж бюджеті.",
    bodyRu:
      "Telegram Ads наконец открыл self-serve кабинет с порогом $10 и минимальной CPM от €0.5. Сегментируем по каналам и интересам, дотягиваем retention через TG-рассылки. На пилотных запусках в CIS-аудитории — CPL в 3-4× ниже Meta при том же бюджете.",
  },
];

const REVIEW_COUNT = 4;

function fileExists(rel: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

async function main() {
  // ── News ────────────────────────────────────────────────────────
  console.log("\n• Новини:");
  for (const n of NEWS) {
    const coverPath = `/uploads/source/news/${n.coverFile}`;
    const hasFile = fileExists(coverPath);
    await prisma.newsPost.upsert({
      where: { slug: n.slug },
      update: {
        titleUk: n.titleUk,
        titleRu: n.titleRu,
        bodyUk: n.bodyUk,
        bodyRu: n.bodyRu,
        coverUrl: hasFile ? coverPath : null,
        isPublished: true,
      },
      create: {
        slug: n.slug,
        titleUk: n.titleUk,
        titleRu: n.titleRu,
        bodyUk: n.bodyUk,
        bodyRu: n.bodyRu,
        coverUrl: hasFile ? coverPath : null,
        isPublished: true,
      },
    });
    console.log(`  ${hasFile ? "✓" : "·"} ${n.slug}${hasFile ? "" : " (без cover)"}`);
  }

  // ── Reviews ─────────────────────────────────────────────────────
  console.log("\n• Відгуки:");
  // повністю заміняємо seed-набір
  const existing = await prisma.review.findMany();
  for (let i = 0; i < REVIEW_COUNT; i++) {
    const filePath = `/uploads/source/reviews/review-${i}.png`;
    if (!fileExists(filePath)) {
      console.log(`  · review-${i}.png відсутній — пропуск`);
      continue;
    }
    const row = existing[i];
    if (row) {
      await prisma.review.update({
        where: { id: row.id },
        data: { imageUrl: filePath, order: i },
      });
      console.log(`  ✓ оновлено #${i}`);
    } else {
      await prisma.review.create({
        data: { imageUrl: filePath, order: i },
      });
      console.log(`  ✓ створено #${i}`);
    }
  }

  console.log("\n✅ seed-extras завершено.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
