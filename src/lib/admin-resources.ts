// Реєстр ресурсів адмінки. Додаючи поле сюди — воно автоматично
// з'являється у формах і списках (узагальнений CRUD).

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "datetime";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
};

export type Resource = {
  key: string; // сегмент URL: /admin/<key>
  model: string; // акцесор Prisma
  title: string;
  idField?: string; // default "id"
  readOnly?: boolean; // leads — лише перегляд/статус
  listColumns: { name: string; label: string }[];
  fields: Field[];
};

const PLACEMENTS = [
  "tiktok",
  "google",
  "facebook",
  "instagram",
  "pinterest",
  "telegram",
].map((v) => ({ value: v, label: v }));

const BANNER_SLOTS = [
  { value: "home", label: "Головна — hero-банер" },
  { value: "services", label: "Послуги — hero-банер" },
  { value: "cases", label: "Кейси — hero-банер" },
  { value: "white", label: "Білий трафік — hero-банер" },
  { value: "grey", label: "Сірий трафік — hero-банер" },
  { value: "news", label: "Новини — hero-банер" },
  { value: "contacts", label: "Контакти — hero-банер" },
  { value: "cases:webdev", label: "Кейси · підвкладка Розробка — бічний банер" },
  { value: "cases:white", label: "Кейси · підвкладка Білий трафік — бічний банер" },
  { value: "cases:grey", label: "Кейси · підвкладка Сірий трафік — бічний банер" },
];

export const RESOURCES: Resource[] = [
  {
    key: "banners",
    model: "pageBanner",
    title: "Банери вкладок",
    listColumns: [
      { name: "slot", label: "Слот" },
      { name: "isActive", label: "Активний" },
    ],
    fields: [
      {
        name: "slot",
        label: "Слот (де показувати)",
        type: "select",
        required: true,
        options: BANNER_SLOTS,
      },
      {
        name: "imageUrl",
        label: "Банер (зображення або відео)",
        type: "image",
        help: "Перекриває частину заголовка вкладки. Завантажити файл — у розділі «Медіа».",
      },
      { name: "isActive", label: "Активний", type: "boolean" },
    ],
  },
  {
    key: "hero",
    model: "heroBanner",
    title: "Hero банери (плейсменти)",
    listColumns: [
      { name: "placement", label: "Плейсмент" },
      { name: "titleUk", label: "Заголовок (UK)" },
      { name: "order", label: "№" },
    ],
    fields: [
      { name: "placement", label: "Плейсмент", type: "select", required: true, options: PLACEMENTS },
      { name: "titleUk", label: "Заголовок (укр)", type: "text", required: true },
      { name: "titleRu", label: "Заголовок (рос)", type: "text", required: true },
      { name: "textUk", label: "Текст (укр)", type: "textarea", required: true },
      { name: "textRu", label: "Текст (рос)", type: "textarea", required: true },
      { name: "imageUrl", label: "Фон-зображення", type: "image" },
      { name: "order", label: "Порядок", type: "number" },
      { name: "isActive", label: "Активний", type: "boolean" },
    ],
  },
  {
    key: "team",
    model: "teamMember",
    title: "Команда",
    listColumns: [
      { name: "nameUk", label: "Ім'я (UK)" },
      { name: "roleUk", label: "Роль (UK)" },
      { name: "order", label: "№" },
    ],
    fields: [
      { name: "nameUk", label: "Ім'я (укр)", type: "text", required: true },
      { name: "nameRu", label: "Ім'я (рос)", type: "text", required: true },
      { name: "roleUk", label: "Роль (укр)", type: "text", required: true },
      { name: "roleRu", label: "Роль (рос)", type: "text", required: true },
      { name: "photoUrl", label: "Фото (нейро-фото)", type: "image" },
      { name: "order", label: "Порядок", type: "number" },
    ],
  },
  {
    key: "reviews",
    model: "review",
    title: "Відгуки (скріни ТГ)",
    listColumns: [
      { name: "authorUk", label: "Автор" },
      { name: "order", label: "№" },
    ],
    fields: [
      { name: "imageUrl", label: "Скріншот з Telegram", type: "image", required: true },
      { name: "authorUk", label: "Підпис (укр)", type: "text" },
      { name: "authorRu", label: "Підпис (рос)", type: "text" },
      { name: "order", label: "Порядок", type: "number" },
    ],
  },
  {
    key: "niches",
    model: "niche",
    title: "Ніші (білі / сірі)",
    listColumns: [
      { name: "type", label: "Тип" },
      { name: "nameUk", label: "Назва (UK)" },
      { name: "order", label: "№" },
    ],
    fields: [
      {
        name: "type",
        label: "Тип",
        type: "select",
        required: true,
        options: [
          { value: "white", label: "white (білий)" },
          { value: "grey", label: "grey (сірий)" },
        ],
      },
      { name: "nameUk", label: "Назва (укр)", type: "text", required: true },
      { name: "nameRu", label: "Назва (рос)", type: "text", required: true },
      { name: "descriptionUk", label: "Опис (укр)", type: "textarea", required: true },
      { name: "descriptionRu", label: "Опис (рос)", type: "textarea", required: true },
      { name: "order", label: "Порядок", type: "number" },
    ],
  },
  {
    key: "cases",
    model: "case",
    title: "Кейси (трафік)",
    listColumns: [
      { name: "category", label: "Підвкладка" },
      { name: "titleUk", label: "Назва (UK)" },
      { name: "nicheUk", label: "Ніша" },
      { name: "order", label: "№" },
    ],
    fields: [
      {
        name: "category",
        label: "Підвкладка кейсів",
        type: "select",
        required: true,
        options: [
          { value: "white", label: "Білий трафік" },
          { value: "grey", label: "Сірий трафік" },
        ],
        help: "Web-dev кейси (розробка) керуються у коді, не тут.",
      },
      { name: "titleUk", label: "Назва (укр)", type: "text", required: true },
      { name: "titleRu", label: "Назва (рос)", type: "text", required: true },
      { name: "creoImageUrl", label: "Крео-зображення", type: "image" },
      {
        name: "bannerUrl",
        label: "Бічний банер кейса (опційно)",
        type: "image",
        help: "Зображення/відео збоку від кейса.",
      },
      { name: "metricsUk", label: "Цифри на банері (укр)", type: "text", required: true },
      { name: "metricsRu", label: "Цифри на банері (рос)", type: "text", required: true },
      { name: "detailsUk", label: "Деталі кейсу (укр)", type: "textarea", required: true },
      { name: "detailsRu", label: "Деталі кейсу (рос)", type: "textarea", required: true },
      { name: "nicheUk", label: "Ніша (укр)", type: "text", required: true },
      { name: "nicheRu", label: "Ніша (рос)", type: "text", required: true },
      { name: "tgLink", label: "Лінк у Telegram", type: "text", required: true },
      { name: "order", label: "Порядок", type: "number" },
      { name: "isPublished", label: "Опубліковано", type: "boolean" },
    ],
  },
  {
    key: "news",
    model: "newsPost",
    title: "Новини",
    listColumns: [
      { name: "titleUk", label: "Заголовок (UK)" },
      { name: "slug", label: "Slug" },
    ],
    fields: [
      { name: "slug", label: "Slug (лат., унікальний)", type: "text", required: true, help: "напр. tiktok-ban-update" },
      { name: "titleUk", label: "Заголовок (укр)", type: "text", required: true },
      { name: "titleRu", label: "Заголовок (рос)", type: "text", required: true },
      { name: "bodyUk", label: "Текст (укр)", type: "textarea", required: true },
      { name: "bodyRu", label: "Текст (рос)", type: "textarea", required: true },
      { name: "coverUrl", label: "Обкладинка", type: "image" },
      { name: "isPublished", label: "Опубліковано", type: "boolean" },
      { name: "publishedAt", label: "Дата публікації", type: "datetime" },
    ],
  },
  {
    key: "services",
    model: "service",
    title: "Послуги",
    listColumns: [
      { name: "titleUk", label: "Назва (UK)" },
      { name: "order", label: "№" },
    ],
    fields: [
      { name: "titleUk", label: "Назва (укр)", type: "text", required: true },
      { name: "titleRu", label: "Назва (рос)", type: "text", required: true },
      { name: "descriptionUk", label: "Опис (укр)", type: "textarea", required: true },
      { name: "descriptionRu", label: "Опис (рос)", type: "textarea", required: true },
      { name: "icon", label: "Іконка/номер", type: "text" },
      { name: "order", label: "Порядок", type: "number" },
    ],
  },
  {
    key: "faq",
    model: "faqItem",
    title: "FAQ",
    listColumns: [{ name: "questionUk", label: "Питання (UK)" }, { name: "order", label: "№" }],
    fields: [
      { name: "questionUk", label: "Питання (укр)", type: "text", required: true },
      { name: "questionRu", label: "Питання (рос)", type: "text", required: true },
      { name: "answerUk", label: "Відповідь (укр)", type: "textarea", required: true },
      { name: "answerRu", label: "Відповідь (рос)", type: "textarea", required: true },
      { name: "order", label: "Порядок", type: "number" },
    ],
  },
  {
    key: "settings",
    model: "siteSetting",
    title: "Налаштування сайту",
    idField: "key",
    listColumns: [{ name: "key", label: "Ключ" }, { name: "valueUk", label: "Значення (UK)" }],
    fields: [
      {
        name: "key",
        label: "Ключ",
        type: "text",
        required: true,
        help: "tg_manager, tg_channel, price_disclaimer, about",
      },
      { name: "valueUk", label: "Значення (укр)", type: "textarea", required: true },
      { name: "valueRu", label: "Значення (рос)", type: "textarea", required: true },
    ],
  },
  {
    key: "leads",
    model: "lead",
    title: "Заявки з квізу",
    readOnly: true,
    listColumns: [
      { name: "createdAt", label: "Дата" },
      { name: "niche", label: "Ніша/проєкт" },
      { name: "dailyBudget", label: "Бюджет" },
      { name: "contact", label: "Контакт" },
      { name: "status", label: "Статус" },
    ],
    fields: [
      {
        name: "status",
        label: "Статус",
        type: "select",
        options: [
          { value: "new", label: "new" },
          { value: "contacted", label: "contacted" },
          { value: "closed", label: "closed" },
        ],
      },
    ],
  },
];

export const resourceByKey = (k: string) =>
  RESOURCES.find((r) => r.key === k);
