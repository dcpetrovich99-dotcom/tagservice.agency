// Реєстр реальних проєктів (для /cases і /cases/[slug]). Тримаємо як
// TS-конст (а не в адмінці) — щоб mini-demo компоненти і пояснення були
// під контролем коду, не у вигляді CMS-плейнтексту.

export type ProjectStack = string;

export type Project = {
  slug: string;
  demoKey: "batcasino" | "shebeauty" | "zukcdruk" | "igstealth";
  year: string;
  // мета для картки
  categoryUk: string;
  categoryRu: string;
  titleUk: string;
  titleRu: string;
  taglineUk: string;
  taglineRu: string;
  // акцентний колір для hero detail-сторінки
  accent: string;
  // зовнішні посилання
  liveUrl?: string;
  // тех-стек
  stack: ProjectStack[];
  // контент detail-сторінки
  problemUk: string;
  problemRu: string;
  solutionUk: string;
  solutionRu: string;
  outcomesUk: string[];
  outcomesRu: string[];
  // невеликі метрики під hero
  metrics: { value: string; labelUk: string; labelRu: string }[];
  // дисклеймер для NDA-кейсів
  noteUk?: string;
  noteRu?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "batcasino-crm",
    demoKey: "batcasino",
    year: "2026",
    categoryUk: "CRM-платформа",
    categoryRu: "CRM-платформа",
    titleUk: "BatCasino Operator CRM",
    titleRu: "BatCasino Operator CRM",
    taglineUk: "CRM для операторів казино — тікети, KPI з LiveChat, ролі, зарплати, трекінг часу.",
    taglineRu: "CRM для операторов казино — тикеты, KPI с LiveChat, роли, зарплаты, трекинг времени.",
    accent: "#6c5ce7",
    liveUrl: "https://ops.batman-casino.com",
    stack: ["Next.js", "Hono", "Drizzle", "PostgreSQL", "Railway", "iron-session"],
    problemUk:
      "Команда саппорту казино жила в Excel + Telegram. KPI вручну, тікети губились, ролі/паролі змішані, зарплати рахували пів дня.",
    problemRu:
      "Команда саппорта казино жила в Excel + Telegram. KPI вручную, тикеты терялись, роли/пароли смешаны, зарплаты считали полдня.",
    solutionUk:
      "Монорепо Next.js + Hono API + Drizzle/Postgres. Тікети v2 з rich-блоками і вкладеннями (~12МБ), KPI підтягуються з LiveChat, ролева модель з ієрархією, автокалькуляція зарплат, трекінг часу зміни.",
    solutionRu:
      "Монорепо Next.js + Hono API + Drizzle/Postgres. Тикеты v2 с rich-блоками и вложениями (~12МБ), KPI подтягиваются с LiveChat, ролевая модель с иерархией, автокалькуляция зарплат, трекинг времени смены.",
    outcomesUk: [
      "Тікет від відкриття до закриття без виходу з системи",
      "KPI оператора в реальному часі, без ручного зведення",
      "Ролі/паролі винесено з месенджерів — повний аудит-лог",
      "Зарплати: −1 робочий день у бухгалтерії",
    ],
    outcomesRu: [
      "Тикет от открытия до закрытия без выхода из системы",
      "KPI оператора в реальном времени, без ручного сведения",
      "Роли/пароли вынесены из мессенджеров — полный аудит-лог",
      "Зарплаты: −1 рабочий день у бухгалтерии",
    ],
    metrics: [
      { value: "19", labelUk: "API-роутів", labelRu: "API-роутов" },
      { value: "v2", labelUk: "Тікети", labelRu: "Тикеты" },
      { value: "RBAC", labelUk: "Ієрархія ролей", labelRu: "Иерархия ролей" },
    ],
    noteUk: "Реальний прод, доступ за NDA. Скрін UI нижче — спрощений мокап-зріз.",
    noteRu: "Реальный прод, доступ под NDA. Скрин UI ниже — упрощённый мокап-срез.",
  },
  {
    slug: "she-beauty",
    demoKey: "shebeauty",
    year: "2026",
    categoryUk: "Сайт + headless CMS",
    categoryRu: "Сайт + headless CMS",
    titleUk: "She Beauty by SL",
    titleRu: "She Beauty by SL",
    taglineUk: "Сайт салону краси у Львові: онлайн-запис, шоп косметики, лайвчат через TG-бот.",
    taglineRu: "Сайт салона красоты во Львове: онлайн-запись, шоп косметики, лайвчат через TG-бот.",
    accent: "#ff6b9a",
    liveUrl: "https://shebeauty-production.up.railway.app",
    stack: ["Next.js 16", "headless WordPress", "PostgreSQL", "MariaDB", "Python aiogram", "Railway"],
    problemUk:
      "Запис у директ Instagram, ціни в Highlights, оплата картою на номер. Нуль аналітики, нуль повторних продажів.",
    problemRu:
      "Запись в директ Instagram, цены в Highlights, оплата картой на номер. Ноль аналитики, ноль повторных продаж.",
    solutionUk:
      "Headless WP як CMS для контенту і shop (товари косметики), Next.js 16 фронт (RSC), Postgres для бронювань і чату, синк з CleverBox CRM, лайвчат → Telegram-бот мастеру напряму, лог дій у БД.",
    solutionRu:
      "Headless WP как CMS для контента и shop (товары косметики), Next.js 16 фронт (RSC), Postgres для бронирований и чата, синк с CleverBox CRM, лайвчат → Telegram-бот мастеру напрямую, лог действий в БД.",
    outcomesUk: [
      "Онлайн-запис без операторів, синк у CleverBox",
      "Шоп косметики прямо на сайті",
      "Лайвчат у Telegram мастера — без сторонніх Tawk/Intercom",
      "Editorial-дизайн «soft luxury» (Cormorant + Inter, 4:5 cards)",
    ],
    outcomesRu: [
      "Онлайн-запись без операторов, синк в CleverBox",
      "Шоп косметики прямо на сайте",
      "Лайвчат в Telegram мастера — без сторонних Tawk/Intercom",
      "Editorial-дизайн «soft luxury» (Cormorant + Inter, 4:5 cards)",
    ],
    metrics: [
      { value: "4", labelUk: "сервіси Railway", labelRu: "сервиса Railway" },
      { value: "16", labelUk: "таблиць у БД", labelRu: "таблиц в БД" },
      { value: "10+", labelUk: "CPT у WP", labelRu: "CPT в WP" },
    ],
  },
  {
    slug: "zukc-druk",
    demoKey: "zukcdruk",
    year: "2026",
    categoryUk: "Сайт + ліди",
    categoryRu: "Сайт + лиды",
    titleUk: "Друк Lviv (ЗУКЦ)",
    titleRu: "Друк Lviv (ЗУКЦ)",
    taglineUk: "Сайт друкарні з офсетним/цифровим/широкоформатним друком + лід-форма у Telegram.",
    taglineRu: "Сайт типографии с офсетной/цифровой/широкоформатной печатью + лид-форма в Telegram.",
    accent: "#33716f",
    liveUrl: "https://druklviv.com",
    stack: ["Astro", "Tailwind v4", "PHP form handler", "cPanel"],
    problemUk:
      "Старий WP-сайт із Lorem-ipsum демо-теми Olymp, +171МБ сміття WooCommerce. На головній — реальна інформація про послуги, далі нічого.",
    problemRu:
      "Старый WP-сайт с Lorem-ipsum демо-темой Olymp, +171МБ мусора WooCommerce. На главной — реальная информация об услугах, дальше ничего.",
    solutionUk:
      "Повний рефакторинг у статичний Astro-сайт. CMYK-айдентика, glassmorphism + mesh-градієнти. Промокод DRUK10 з копіюванням і поп-апом. Глобальна OrderModal. Чат-кнопка → Telegram. PHP-хендлер на cPanel шле ліди в TG-бот + email.",
    solutionRu:
      "Полный рефакторинг в статический Astro-сайт. CMYK-айдентика, glassmorphism + mesh-градиенты. Промокод DRUK10 с копированием и поп-апом. Глобальная OrderModal. Чат-кнопка → Telegram. PHP-хендлер на cPanel шлёт лиды в TG-бот + email.",
    outcomesUk: [
      "Сайт легкий (статика, миттєвий TTFB)",
      "Чисті URL без розширень (Astro file-mode + .htaccess)",
      "Заявка → Telegram-бот + email менеджера, < 1 c",
      "Розгорнуто прямо на основному домені",
    ],
    outcomesRu: [
      "Сайт лёгкий (статика, мгновенный TTFB)",
      "Чистые URL без расширений (Astro file-mode + .htaccess)",
      "Заявка → Telegram-бот + email менеджера, < 1 с",
      "Развернуто прямо на основном домене",
    ],
    metrics: [
      { value: "171→8", labelUk: "МБ ваги сайту", labelRu: "МБ веса сайта" },
      { value: "<1c", labelUk: "відповідь форми", labelRu: "ответ формы" },
      { value: "−10%", labelUk: "промокод DRUK10", labelRu: "промокод DRUK10" },
    ],
  },
  {
    slug: "ig-stealth",
    demoKey: "igstealth",
    year: "2026",
    categoryUk: "SaaS-платформа",
    categoryRu: "SaaS-платформа",
    titleUk: "IG Stealth",
    titleRu: "IG Stealth",
    taglineUk: "Платформа мас-аутрічу Instagram + Threads: мульти-акк, AI-офери, проксі, антидетект.",
    taglineRu: "Платформа масс-аутрича Instagram + Threads: мульти-акк, AI-офферы, прокси, антидетект.",
    accent: "#1f9fe0",
    stack: ["Next.js 15", "shadcn/ui", "Tweakcn", "Tremor", "Prisma", "Redis + BullMQ", "Python instagrapi"],
    problemUk:
      "Мас-аутріч у IG руками = вічний бан акаунтів, мікроскоп-аналітика, ноль автогріву і нуль look-alike.",
    problemRu:
      "Масс-аутрич в IG руками = вечный бан аккаунтов, микроскоп-аналитика, ноль автогрева и ноль look-alike.",
    solutionUk:
      "Дашборд із мульти-аккаунтом, керування проксі/антидетектом, автогрів, look-alike-аудиторія, AI-офери, авто-розсилки і авто-перемовини. Next.js + shadcn + Tweakcn-тема, Tremor-графіки. Python instagrapi-воркер на VPS (поза Railway через TOS).",
    solutionRu:
      "Дашборд с мульти-аккаунтом, управление прокси/антидетектом, автогрев, look-alike-аудитория, AI-офферы, авто-рассылки и авто-переговоры. Next.js + shadcn + Tweakcn-тема, Tremor-графики. Python instagrapi-воркер на VPS (вне Railway через TOS).",
    outcomesUk: [
      "Темна тема за замовчуванням, Geist Variable",
      "Cmd+K command palette, повна адаптивність",
      "BullMQ-черги для масштабованих розсилок",
      "Розділення Next.js / worker — TOS-safe",
    ],
    outcomesRu: [
      "Тёмная тема по умолчанию, Geist Variable",
      "Cmd+K command palette, полная адаптивность",
      "BullMQ-очереди для масштабируемых рассылок",
      "Разделение Next.js / worker — TOS-safe",
    ],
    metrics: [
      { value: "∞", labelUk: "акаунтів IG/Threads", labelRu: "аккаунтов IG/Threads" },
      { value: "AI", labelUk: "офери та чат", labelRu: "офферы и чат" },
      { value: "VPS", labelUk: "воркер окремо", labelRu: "воркер отдельно" },
    ],
    noteUk: "У dev-фазі. UI нижче — наш робочий мокап потоку.",
    noteRu: "В dev-фазе. UI ниже — наш рабочий мокап потока.",
  },
];

export const projectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug);
