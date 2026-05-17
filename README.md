# Сайт рекламного агентства (UK/RU)

Багатосторінковий двомовний сайт із власною адмін-панеллю. Дані — у
PostgreSQL (не JSON). Стек: **Next.js 15 (App Router, TS)** · **Prisma 7**
· **PostgreSQL** · **Tailwind v4** · **Framer Motion** · **next-intl**.

---

## 1. Локальний запуск

Потрібні Node.js 20+ та PostgreSQL.

```powershell
npm install
# .env вже є; впишіть DATABASE_URL і AUTH_SECRET
npx prisma migrate dev --name init   # створює таблиці
npm run db:seed                      # заглушки контенту + адмін
npm run dev                          # http://localhost:3000
```

Якщо немає локального Postgres — найпростіше:

```powershell
npx prisma dev        # локальний Postgres від Prisma (окреме вікно)
# скопіюйте виданий URL у .env → DATABASE_URL, потім migrate/seed
```

Згенеруйте секрет для сесій адмінки:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

і впишіть у `.env` → `AUTH_SECRET`.

---

## 2. Структура

```
src/
  middleware.ts            гео (cf-ipcountry → uk/ru), cookie locale,
                           canonical-host (анти-клон), захист /admin
  i18n/                    routing / navigation / request (next-intl)
  app/
    [locale]/              публічний сайт: page(головна), services, cases,
                           white, grey, news, news/[slug], contacts
    admin/                 адмін-панель (login, дашборд, [resource] CRUD, media)
    api/lead               приймання заявок з квізу
    api/admin/*            upload, leads-export (тільки для адміна)
  components/              UI: Hero, Quiz, Cases, Faq, Reviews, Team…
  lib/                     db, auth, content, telegram, validation,
                           admin-resources, admin-actions
messages/uk.json|ru.json   статичні UI-підписи (контент — у БД)
prisma/schema.prisma       моделі БД
prisma/seed.ts             заглушки контенту
```

Мова на всіх сторінках: маршрути `/(uk|ru)/...`. Перший візит без
cookie → визначення за заголовком `cf-ipcountry` (його дає Cloudflare):
**UA → українська, інше → російська**. Перемикач у шапці змінює мову і
запам'ятовує її (cookie `locale`).

---

## 3. Як редагувати контент вручну (адмінка)

Відкрийте **`/admin`**, увійдіть. Кожен розділ зліва — окремий список з
кнопкою **«+ Додати»** і формою редагування. Для кожного запису є **два
мовні поля** (укр і рос) — заповнюйте обидва.

| Що на сайті | Розділ адмінки | Ключові поля |
|---|---|---|
| Банери-плейсменти в hero головної | **Hero банери** | плейсмент, заголовок UK/RU, текст UK/RU, фон-зображення, порядок, активний |
| Блок «про нас», тексти головної | **Налаштування сайту** → ключ `about` | значення UK/RU |
| Команда (нейро-фото) | **Команда** | ім'я UK/RU, роль UK/RU, фото, порядок |
| Відгуки (скріни ТГ) | **Відгуки** | зображення-скрін, підпис, порядок |
| Сторінка «Білий трафік» | **Ніші** (тип `white`) | назва UK/RU, опис UK/RU, порядок |
| Сторінка «Сірий трафік» | **Ніші** (тип `grey`) | назва UK/RU, опис UK/RU, порядок |
| Кейси | **Кейси** | назва, крео-фото, цифри UK/RU, деталі UK/RU, ніша, лінк ТГ, порядок |
| Новини | **Новини** | slug, заголовок UK/RU, текст UK/RU, обкладинка, дата |
| Послуги | **Послуги** | назва UK/RU, опис UK/RU, іконка/номер, порядок |
| FAQ на головній | **FAQ** | питання UK/RU, відповідь UK/RU, порядок |
| Контакти ТГ, дисклеймер цін | **Налаштування сайту** → `tg_manager`, `tg_channel`, `price_disclaimer` | значення UK/RU |
| Заявки з квізу | **Заявки** | перегляд, зміна статусу, **Експорт CSV** |

**Порядок** (`order`) — менше число = вище на сторінці. **Зображення**:
завантажте файл у розділі **Медіа**, скопіюйте виданий URL і вставте в
поле фото/обкладинки/крео.

Ключі `Налаштувань`, які читає сайт: `tg_manager`, `tg_channel`,
`about`, `price_disclaimer`.

### Перший адмін / зміна пароля

`npm run db:seed` створює адміна `admin / admin12345` (або значення з
`ADMIN_LOGIN` / `ADMIN_PASSWORD` в `.env`). **Обов'язково змініть
пароль**: задайте `ADMIN_PASSWORD`, видаліть рядок у таблиці `AdminUser`
через `npm run db:studio` і виконайте `npm run db:seed` повторно (або
створіть нового адміна прямо у Studio з argon2-хешем).

### Резервне редагування (Prisma Studio)

```powershell
npm run db:studio   # веб-таблиця всіх таблиць БД
```

---

## 4. Безпека та захист від клонування

- **Cookie `crm-auth`** захищає тільки `/admin`. У cookie — випадковий
  токен (не userId), у БД лише його SHA-256. Прапори: `HttpOnly`
  (не вкрасти через XSS), `Secure`, `SameSite=Strict`, `Path=/admin`.
- Server Actions Next.js мають вбудований CSRF-захист (звіряння
  Origin/Host). Логін має rate-limit + лок-аут.
- **Анти-клон** (`next.config.ts` + `middleware.ts`):
  - `Content-Security-Policy: frame-ancestors 'none'` + `X-Frame-Options: DENY`
    → сайт не вбудувати в iframe на чужому домені;
  - **canonical-host guard**: на проді запит із чужим `Host`
    редіректиться на ваш домен (ламає proxy-дзеркала);
  - `Strict-Transport-Security`, `X-Content-Type-Options`,
    `Referrer-Policy`, `Permissions-Policy`.
- `/admin` і `/api` закриті в `robots.txt` і `noindex`.

### Cloudflare (рекомендовано, перед Railway)

1. Домен у Cloudflare, DNS-проксі (помаранчева хмара) на Railway.
2. **SSL/TLS → Full (strict)**.
3. **Scrape Shield → Hotlink Protection: On**.
4. **Security → Bots: Block AI scrapers**; за потреби Rate Limiting.
5. **Origin lock**: Transform Rule додає секретний заголовок; на Railway
   відсікайте запити без нього (або Cloudflare Tunnel) — щоб origin не
   відкривався напряму.
6. Заповніть `APP_HOST` і `APP_ALLOWED_HOSTS` у Variables вашим доменом.

> Повністю «некопійованим» публічний HTML зробити неможливо, але це
> блокує реальні практики: iframe-вбудову, proxy-дзеркала, hotlink,
> масовий скрапінг. Адмінка й заявки закриті повністю.

---

## 5. Деплой на Railway

1. Створіть проєкт на Railway → **Add PostgreSQL**.
2. **Deploy from GitHub** або Railway CLI.
3. **Variables** сервісу:
   - `DATABASE_URL` → `${{Postgres.DATABASE_URL}}`
   - `AUTH_SECRET` → довгий випадковий рядок
   - `APP_HOST`, `APP_ALLOWED_HOSTS` → ваш домен
   - `NEXT_PUBLIC_TG_MANAGER`, (опц.) `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - `UPLOAD_DIR=/data/uploads` + змонтуйте **Volume** на `/data/uploads`
4. Збірка `npm run build`, запуск `npm start`.
5. Після першого деплою:
   ```
   railway run npm run db:migrate
   railway run npm run db:seed
   ```
6. Підключіть Cloudflare (розділ 4) і змініть пароль адміна.

---

## 6. Команди

| Команда | Дія |
|---|---|
| `npm run dev` | локальний запуск |
| `npm run build` | prisma generate + production build |
| `npm start` | прод-сервер |
| `npm run db:migrate:dev` | створити/застосувати міграцію (локально) |
| `npm run db:migrate` | застосувати міграції (прод) |
| `npm run db:seed` | заглушки контенту + адмін |
| `npm run db:studio` | редагування БД у таблиці |
