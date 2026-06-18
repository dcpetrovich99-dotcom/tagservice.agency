/**
 * Ніші (білі + сірі) — керовані кодом. На кожному деплої повністю
 * перезаписують ніші за типом (deleteMany + createMany), тож редагувати їх
 * через адмінку немає сенсу — зміни тут.
 *
 * Картинка ніші авто-лінкується з public/uploads/source/niches/<id>.<ext>.
 *
 * СВІДОМО не включено: escort, дропи/money-mule, схемний/шахрайський трафік.
 *
 * Запуск: npm run db:seed:niches
 */
import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function imageFor(id: string): string | null {
  for (const ext of ["png", "jpg", "jpeg", "webp", "mp4", "webm"]) {
    const rel = `uploads/source/niches/${id}.${ext}`;
    if (existsSync(path.resolve("public", rel))) return `/${rel}`;
  }
  return null;
}

type NicheSeed = {
  id: string;
  type: "white" | "grey";
  nameUk: string;
  nameRu: string;
  descriptionUk: string;
  descriptionRu: string;
  order: number;
};

const NICHES: NicheSeed[] = [
  // ── Білі ──────────────────────────────────────────────────────
  {
    id: "white-salon",
    type: "white",
    nameUk: "Салони краси",
    nameRu: "Салоны красоты",
    descriptionUk:
      "Б'юті-послуги та локальний бізнес. Instagram/Meta з геотаргетом по району, офери на перше відвідування, онлайн-запис і ретеншн через розсилки. Гнучко під сезонність і завантаженість майстрів.",
    descriptionRu:
      "Бьюти-услуги и локальный бизнес. Instagram/Meta с геотаргетом по району, офферы на первое посещение, онлайн-запись и ретеншн через рассылки. Гибко под сезонность и загрузку мастеров.",
    order: 1,
  },
  {
    id: "white-legal",
    type: "white",
    nameUk: "Юридичні послуги",
    nameRu: "Юридические услуги",
    descriptionUk:
      "Адвокати, юрфірми, нотаріат. Google Search по гарячих запитах + ремаркетинг, лід-форми з кваліфікацією. Прозора аналітика по вартості клієнта й окупності.",
    descriptionRu:
      "Адвокаты, юрфирмы, нотариат. Google Search по горячим запросам + ремаркетинг, лид-формы с квалификацией. Прозрачная аналитика по стоимости клиента и окупаемости.",
    order: 2,
  },
  {
    id: "white-visa",
    type: "white",
    nameUk: "Візові послуги",
    nameRu: "Визовые услуги",
    descriptionUk:
      "Оформлення віз і супровід. Таргет + пошук, лендинги під конкретні країни, лід-форми та прогрів. Працюємо на якісних, а не «сирих» лідів.",
    descriptionRu:
      "Оформление виз и сопровождение. Таргет + поиск, лендинги под конкретные страны, лид-формы и прогрев. Работаем на качественных, а не «сырых» лидов.",
    order: 3,
  },
  {
    id: "white-dating",
    type: "white",
    nameUk: "Додатки для знайомств",
    nameRu: "Приложения для знакомств",
    descriptionUk:
      "Dating-застосунки: реєстрації, підписки, ретеншн. Креативи під різні гео, A/B-тести, оптимізація під CPI та LTV. Масштабування на гарячих звʼязках.",
    descriptionRu:
      "Dating-приложения: регистрации, подписки, ретеншн. Креативы под разные гео, A/B-тесты, оптимизация под CPI и LTV. Масштабирование на горячих связках.",
    order: 4,
  },
  {
    id: "white-resto",
    type: "white",
    nameUk: "Ресторани та кафе",
    nameRu: "Рестораны и кафе",
    descriptionUk:
      "Заклади та доставка. Геотаргет, акції, меню-промо, робота з відгуками й повторними візитами. Сезонні кампанії під трафік у зал і на доставку.",
    descriptionRu:
      "Заведения и доставка. Геотаргет, акции, меню-промо, работа с отзывами и повторными визитами. Сезонные кампании под трафик в зал и на доставку.",
    order: 5,
  },
  {
    id: "white-auto",
    type: "white",
    nameUk: "Автосалони та пригін авто",
    nameRu: "Автосалоны и пригон авто",
    descriptionUk:
      "Автосалони та пригін авто під ключ. Google Search + Meta lead-форми, калькулятори вартості, ремаркетинг. Кваліфіковані заявки, а не «холодні» кліки.",
    descriptionRu:
      "Автосалоны и пригон авто под ключ. Google Search + Meta lead-формы, калькуляторы стоимости, ремаркетинг. Квалифицированные заявки, а не «холодные» клики.",
    order: 6,
  },

  // ── Сірі (тільки легальні продукти/послуги) ──────────────────
  {
    id: "grey-crypto",
    type: "grey",
    nameUk: "Крипта",
    nameRu: "Крипта",
    descriptionUk:
      "Криптопроєкти, обмінники, біржі. TG Ads, профільні канали й чати, ретеншн у Telegram-канал. Працюємо тонко з модерацією та антибаном.",
    descriptionRu:
      "Криптопроекты, обменники, биржи. TG Ads, профильные каналы и чаты, ретеншн в Telegram-канал. Работаем тонко с модерацией и антибаном.",
    order: 1,
  },
  {
    id: "grey-couriers",
    type: "grey",
    nameUk: "Кур'єри та персонал",
    nameRu: "Курьеры и персонал",
    descriptionUk:
      "Підбір кур'єрів і лінійного персоналу. Telegram-розсилки по тематичних чатах роботи й підробітку, охоплення тисяч майданчиків, щоденний потік відгуків.",
    descriptionRu:
      "Подбор курьеров и линейного персонала. Telegram-рассылки по тематическим чатам работы и подработки, охват тысяч площадок, ежедневный поток откликов.",
    order: 2,
  },
  {
    id: "grey-tobacco",
    type: "grey",
    nameUk: "Табачка / вейпи",
    nameRu: "Табачка / вейпы",
    descriptionUk:
      "Тютюнова продукція, вейпи, стіки. Працюємо з обмеженнями рекламних кабінетів через нативні майданчики, профільні чати й розсилки.",
    descriptionRu:
      "Табачная продукция, вейпы, стики. Работаем с ограничениями рекламных кабинетов через нативные площадки, профильные чаты и рассылки.",
    order: 3,
  },
];

async function main() {
  for (const type of ["white", "grey"] as const) {
    await prisma.niche.deleteMany({ where: { type } });
    const rows = NICHES.filter((n) => n.type === type).map((n) => ({
      ...n,
      imageUrl: imageFor(n.id),
    }));
    if (rows.length) await prisma.niche.createMany({ data: rows });
    console.log(`• ${type}: ${rows.length}`);
  }
  console.log("✔ ніші оновлено");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
