import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "@node-rs/argon2";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function emptyThenCreate<T>(
  count: () => Promise<number>,
  create: () => Promise<T>,
  label: string,
) {
  const n = await count();
  if (n > 0) {
    console.log(`• ${label}: вже є дані (${n}) — пропускаю`);
    return;
  }
  await create();
  console.log(`• ${label}: створено заглушки`);
}

async function main() {
  // ── Адміністратор ────────────────────────────────────────────────
  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await hash(password);
  await prisma.adminUser.upsert({
    where: { login },
    update: {},
    create: { login, passwordHash, role: "owner" },
  });
  console.log(`• Адмін: ${login} / ${password}  (ЗМІНІТЬ пароль!)`);

  // ── Налаштування сайту ───────────────────────────────────────────
  const settings: { key: string; uk: string; ru: string }[] = [
    { key: "tg_manager", uk: "https://t.me/your_manager", ru: "https://t.me/your_manager" },
    { key: "tg_channel", uk: "https://t.me/your_channel", ru: "https://t.me/your_channel" },
    {
      key: "about",
      uk: "Ми — команда перформанс-маркетингу. Приводимо цільовий трафік і беремо проєкт під ключ. (Відредагуйте в адмінці → Налаштування → about)",
      ru: "Мы — команда перформанс-маркетинга. Приводим целевой трафик и берём проект под ключ. (Отредактируйте в админке → Настройки → about)",
    },
    {
      key: "price_disclaimer",
      uk: "Ціни ми навмисно не виставляли на сайті — кожен проєкт це окремий прорахунок і окремий прайс під різні випадки. Орієнтовну суму назвати могли б, але це був би хибний орієнтир для вас. Тому лишайте заявку — і ми проконсультуємо.",
      ru: "Цены мы намеренно не выставляли на сайте — каждый проект это отдельный просчёт и отдельный прайс под разные случаи. Ориентировочную сумму назвать могли бы, но это был бы ложный ориентир для вас. Поэтому оставляйте заявку — и мы проконсультируем.",
    },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, valueUk: s.uk, valueRu: s.ru },
    });
  }
  console.log("• Налаштування сайту: ok");

  // ── Hero банери (плейсменти) ─────────────────────────────────────
  await emptyThenCreate(
    () => prisma.heroBanner.count(),
    () =>
      prisma.heroBanner.createMany({
        data: (
          [
            ["tiktok", "TikTok трафік", "TikTok-трафик"],
            ["google", "Google трафік", "Google-трафик"],
            ["facebook", "Facebook трафік", "Facebook-трафик"],
            ["instagram", "Instagram трафік", "Instagram-трафик"],
            ["pinterest", "Pinterest трафік", "Pinterest-трафик"],
            ["telegram", "Telegram: TG Ads + розсилки", "Telegram: TG Ads + рассылки"],
          ] as const
        ).map(([placement, uk, ru], i) => ({
          placement,
          titleUk: uk,
          titleRu: ru,
          textUk: "Короткий опис плейсмента. Відредагуйте в адмінці → Hero банери.",
          textRu: "Краткое описание плейсмента. Отредактируйте в админке → Hero банеры.",
          order: i,
        })),
      }),
    "Hero банери",
  );

  // ── Команда ──────────────────────────────────────────────────────
  const team: [string, string][] = [
    ["Дизайнер", "Дизайнер"],
    ["Проджект-менеджер", "Проджект-менеджер"],
    ["Бізнес-аналітик", "Бизнес-аналитик"],
    ["Ризик-менеджер", "Риск-менеджер"],
    ["Таргетолог", "Таргетолог"],
    ["Таргетолог", "Таргетолог"],
    ["Таргетолог", "Таргетолог"],
    ["Google медіабаєр", "Google медиабайер"],
    ["Розробник софтів і скриптів", "Разработчик софтов и скриптов"],
    ["Вайбкодер", "Вайбкодер"],
    ["ШІ-аналітик", "ИИ-аналитик"],
  ];
  await emptyThenCreate(
    () => prisma.teamMember.count(),
    () =>
      prisma.teamMember.createMany({
        data: team.map(([uk, ru], i) => ({
          nameUk: "Учасник команди",
          nameRu: "Участник команды",
          roleUk: uk,
          roleRu: ru,
          order: i,
        })),
      }),
    "Команда",
  );

  // ── Ніші ─────────────────────────────────────────────────────────
  const white: [string, string][] = [
    ["Салони краси", "Салоны красоты"],
    ["Юридичні послуги", "Юридические услуги"],
    ["Візові послуги", "Визовые услуги"],
    ["Додатки для знайомств", "Приложения для знакомств"],
    ["Ресторани та кафе", "Рестораны и кафе"],
    ["Автосалони та пригон авто", "Автосалоны и пригон авто"],
  ];
  const grey: [string, string][] = [
    ["Ескорт", "Эскорт"],
    ["Крипта", "Крипта"],
    ["Кур'єри", "Курьеры"],
    ["Табачка", "Табачка"],
    ["Схемний трафік", "Схемный трафик"],
    ["Офіс", "Офис"],
    ["Дропи на банки", "Дропы на банки"],
  ];
  await emptyThenCreate(
    () => prisma.niche.count(),
    async () => {
      await prisma.niche.createMany({
        data: [
          ...white.map(([uk, ru], i) => ({
            type: "white" as const,
            nameUk: uk,
            nameRu: ru,
            descriptionUk: "Опис ніші заповніть в адмінці → Ніші.",
            descriptionRu: "Описание ниши заполните в админке → Ниши.",
            order: i,
          })),
          ...grey.map(([uk, ru], i) => ({
            type: "grey" as const,
            nameUk: uk,
            nameRu: ru,
            // Тексти «сірих» ніш заповнює власник самостійно.
            descriptionUk: "Опис заповніть в адмінці → Ніші (тип grey).",
            descriptionRu: "Описание заполните в админке → Ниши (тип grey).",
            order: i,
          })),
        ],
      });
    },
    "Ніші (white + grey)",
  );

  // ── Послуги ──────────────────────────────────────────────────────
  await emptyThenCreate(
    () => prisma.service.count(),
    () =>
      prisma.service.createMany({
        data: [
          {
            titleUk: "Налаштування рекламних кампаній",
            titleRu: "Настройка рекламных кампаний",
            descriptionUk: "Запуск і ведення кампаній по плейсментах. Відредагуйте в адмінці → Послуги.",
            descriptionRu: "Запуск и ведение кампаний по плейсментам. Отредактируйте в админке → Услуги.",
            icon: "01",
            order: 0,
          },
          {
            titleUk: "Креативи та контент",
            titleRu: "Креативы и контент",
            descriptionUk: "Виробництво крео під різні ніші.",
            descriptionRu: "Производство крео под разные ниши.",
            icon: "02",
            order: 1,
          },
          {
            titleUk: "Аналітика та масштабування",
            titleRu: "Аналитика и масштабирование",
            descriptionUk: "Наскрізна аналітика і вихід у плюс.",
            descriptionRu: "Сквозная аналитика и выход в плюс.",
            icon: "03",
            order: 2,
          },
        ],
      }),
    "Послуги",
  );

  // ── FAQ ──────────────────────────────────────────────────────────
  await emptyThenCreate(
    () => prisma.faqItem.count(),
    () =>
      prisma.faqItem.createMany({
        data: [
          {
            questionUk: "Скільки коштують ваші послуги?",
            questionRu: "Сколько стоят ваши услуги?",
            answerUk: "Кожен проєкт — окремий прорахунок. Лишайте заявку.",
            answerRu: "Каждый проект — отдельный просчёт. Оставляйте заявку.",
            order: 0,
          },
          {
            questionUk: "З якими плейсментами працюєте?",
            questionRu: "С какими плейсментами работаете?",
            answerUk: "TikTok, Google, Facebook, Instagram, Pinterest, Telegram.",
            answerRu: "TikTok, Google, Facebook, Instagram, Pinterest, Telegram.",
            order: 1,
          },
        ],
      }),
    "FAQ",
  );

  // ── Кейси ────────────────────────────────────────────────────────
  await emptyThenCreate(
    () => prisma.case.count(),
    () =>
      prisma.case.createMany({
        data: [
          {
            titleUk: "Кейс #1 (заглушка)",
            titleRu: "Кейс #1 (заглушка)",
            metricsUk: "ROI 180% · 30 днів",
            metricsRu: "ROI 180% · 30 дней",
            detailsUk: "Деталі кейсу заповніть в адмінці → Кейси.",
            detailsRu: "Детали кейса заполните в админке → Кейсы.",
            nicheUk: "Приклад ніші",
            nicheRu: "Пример ниши",
            tgLink: "https://t.me/your_manager",
            order: 0,
          },
        ],
      }),
    "Кейси",
  );

  // ── Новини ───────────────────────────────────────────────────────
  await emptyThenCreate(
    () => prisma.newsPost.count(),
    () =>
      prisma.newsPost.create({
        data: {
          slug: "welcome",
          titleUk: "Перша новина (заглушка)",
          titleRu: "Первая новость (заглушка)",
          bodyUk: "Текст новини редагується в адмінці → Новини.",
          bodyRu: "Текст новости редактируется в админке → Новости.",
        },
      }),
    "Новини",
  );

  console.log("\n✅ Сід завершено.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
