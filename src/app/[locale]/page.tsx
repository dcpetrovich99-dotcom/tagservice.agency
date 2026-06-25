import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import {
  getFaq,
  getHeroBanners,
  getNews,
  getReviews,
  getSettings,
  getTeam,
  getPageBanners,
  pickL,
  setting,
} from "@/lib/content";
import { PROJECTS } from "@/lib/projects";
import { Link } from "@/i18n/navigation";
import HeroSection from "@/components/HeroSection";
import Manifesto from "@/components/Manifesto";
import ServicesMatrix from "@/components/ServicesMatrix";
import StatsStrip from "@/components/StatsStrip";
import SitesGrid from "@/components/SitesGrid";
import Marquee from "@/components/Marquee";
import TeamGrid from "@/components/TeamGrid";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import QuizForm from "@/components/QuizForm";
import Reveal from "@/components/Reveal";
import ProcessFlow from "@/components/ProcessFlow";
import LeadModal from "@/components/LeadModal";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("home");
  const tp = await getTranslations("placements");
  const tn = await getTranslations("news");
  const ts = await getTranslations("sections");
  const tcommon = await getTranslations("common");

  const [banners, team, reviews, news, faq, settings, pageBanners] =
    await Promise.all([
      getHeroBanners(),
      getTeam(),
      getReviews(),
      getNews(3),
      getFaq(),
      getSettings(),
      getPageBanners(),
    ]);

  const heroItems = banners.map((banner) => ({
    placement: tp(banner.placement),
    title: pickL(banner, "title", L),
    text: pickL(banner, "text", L),
    imageUrl: banner.imageUrl,
  }));

  const services = [
    {
      id: "traffic",
      num: "01",
      title: "Traffic",
      description:
        L === "uk"
          ? "Запускаємо, тестуємо і масштабуємо paid traffic без хаосу: структура, гіпотези, антибан-процеси, звітність."
          : "Запускаем, тестируем и масштабируем paid traffic без хаоса: структура, гипотезы, антибан-процессы, отчетность.",
      details: ["TikTok", "Google", "Meta", "Telegram Ads", "Pinterest"],
      image: "/uploads/source/services/service-campaigns.png",
    },
    {
      id: "websites",
      num: "02",
      title: "Websites",
      description:
        L === "uk"
          ? "Лендінги, мультісторінкові сайти, квізи й конверсійні сторінки, які готові приймати трафік з першого дня."
          : "Лендинги, многостраничные сайты, квизы и конверсионные страницы, которые готовы принимать трафик с первого дня.",
      details: ["Landing pages", "Quiz funnels", "SEO pages", "A/B tests"],
      image: "/uploads/source/services/service-creative.png",
    },
    {
      id: "platforms",
      num: "03",
      title: "Platforms",
      description:
        L === "uk"
          ? "CRM, адмін-панелі, SaaS, кабінети клієнта, ролі, аналітика, деплой. Не просто дизайн, а система з базою даних."
          : "CRM, админ-панели, SaaS, кабинеты клиента, роли, аналитика, деплой. Не просто дизайн, а система с базой данных.",
      details: ["CRM", "Admin panel", "Telegram Mini Apps", "SaaS", "Dashboards"],
      image: "/uploads/source/services/service-platforms.png",
    },
    {
      id: "automation",
      num: "04",
      title: "Automation",
      description:
        L === "uk"
          ? "Зʼєднуємо заявки, Telegram, CRM, callback, таблиці, аналітику й внутрішні процеси в одну робочу лінію."
          : "Соединяем заявки, Telegram, CRM, callback, таблицы, аналитику и внутренние процессы в одну рабочую линию.",
      details: ["Bots", "Lead routing", "RBAC", "Exports", "Webhooks"],
      image: "/uploads/source/services/service-leadgen.png",
    },
    {
      id: "creative",
      num: "05",
      title: "Creative",
      description:
        L === "uk"
          ? "Концепти, сценарії, статика, відео, UGC-механіки й креативні пакети під тести в рекламних кабінетах."
          : "Концепты, сценарии, статика, видео, UGC-механики и креативные пакеты под тесты в рекламных кабинетах.",
      details: ["Scripts", "Static ads", "Video ads", "UGC", "Design systems"],
      image: "/uploads/source/services/service-analytics.png",
    },
  ];

  const homepageFaq = [
    {
      id: "home-process",
      q:
        L === "uk"
          ? "Як проходить запуск проєкту з TAG SERVICE?"
          : "Как проходит запуск проекта с TAG SERVICE?",
      a:
        L === "uk"
          ? "1. Ви залишаєте заявку і коротко описуєте нішу.\n2. Ми уточнюємо гео, продукт, бюджет, обмеження та ціль.\n3. Збираємо логіку воронки: реклама, сайт або платформа, CRM, аналітика.\n4. Готуємо план запуску, потрібні матеріали і реалістичний прогноз.\n5. Після погодження запускаємо роботу і ведемо вас по етапах."
          : "1. Вы оставляете заявку и коротко описываете нишу.\n2. Мы уточняем гео, продукт, бюджет, ограничения и цель.\n3. Собираем логику воронки: реклама, сайт или платформа, CRM, аналитика.\n4. Готовим план запуска, нужные материалы и реалистичный прогноз.\n5. После согласования запускаем работу и ведем вас по этапам.",
    },
    {
      id: "home-team",
      q:
        L === "uk"
          ? "Хто конкретно буде займатись моїм проєктом?"
          : "Кто конкретно будет заниматься моим проектом?",
      a:
        L === "uk"
          ? "Проєкт не висить на одній людині. У роботу заходить мінімум 5 ролей: project manager, performance-спеціаліст, дизайнер/креативник, аналітик і технічний спеціаліст. Якщо потрібна розробка, підключаємо dev-напрям: сайт, CRM, адмінку, Telegram-боти, інтеграції та автоматизації."
          : "Проект не висит на одном человеке. В работу заходит минимум 5 ролей: project manager, performance-специалист, дизайнер/креативщик, аналитик и технический специалист. Если нужна разработка, подключаем dev-направление: сайт, CRM, админку, Telegram-боты, интеграции и автоматизации.",
    },
    {
      id: "home-estimate",
      q:
        L === "uk"
          ? "Чому на сайті немає фіксованих цін?"
          : "Почему на сайте нет фиксированных цен?",
      a:
        L === "uk"
          ? "Тому що одна й та сама послуга може мати зовсім різну складність. Наприклад, лендинг для салону краси, CRM для відділу продажів і Telegram Mini App для заявки — це різні обсяги, строки, ризики й команда. Ми можемо назвати “від” суму, але вона часто дає неправильний орієнтир. Нормальний прайс з’являється після короткого брифу."
          : "Потому что одна и та же услуга может иметь совершенно разную сложность. Например, лендинг для салона красоты, CRM для отдела продаж и Telegram Mini App для заявки — это разные объемы, сроки, риски и команда. Мы можем назвать сумму “от”, но она часто дает неправильный ориентир. Нормальный прайс появляется после короткого брифа.",
    },
    {
      id: "home-assets",
      q:
        L === "uk"
          ? "Що потрібно від мене для старту?"
          : "Что нужно от меня для старта?",
      a:
        L === "uk"
          ? "Мінімум: ніша, гео, що продаєте, який бюджет готові тестувати, які канали вже пробували і що вийшло. Якщо є брендбук, креативи, сайт, CRM або приклади конкурентів — це прискорить роботу. Якщо нічого немає, ми зберемо структуру з нуля."
          : "Минимум: ниша, гео, что продаете, какой бюджет готовы тестировать, какие каналы уже пробовали и что получилось. Если есть брендбук, креативы, сайт, CRM или примеры конкурентов — это ускорит работу. Если ничего нет, мы соберем структуру с нуля.",
    },
    {
      id: "home-reporting",
      q:
        L === "uk"
          ? "Як я буду розуміти, що робота реально рухається?"
          : "Как я буду понимать, что работа реально движется?",
      a:
        L === "uk"
          ? "Ми фіксуємо етапи і показуємо не просто “активність”, а конкретні артефакти: структура воронки, креативи, запущені кампанії, заявки, таблиці, CRM-статуси, аналітика, висновки по тестах. Для технічних задач показуємо демо, staging або готовий модуль."
          : "Мы фиксируем этапы и показываем не просто “активность”, а конкретные артефакты: структура воронки, креативы, запущенные кампании, заявки, таблицы, CRM-статусы, аналитика, выводы по тестам. Для технических задач показываем демо, staging или готовый модуль.",
    },
    {
      id: "home-grey-white",
      q:
        L === "uk"
          ? "Ви працюєте тільки з білими нішами чи також із сірими?"
          : "Вы работаете только с белыми нишами или также с серыми?",
      a:
        L === "uk"
          ? "Ми розділяємо підходи. Для білих ніш робимо чисту упаковку, прозору аналітику і стабільні рекламні кабінети. Для сірих ніш окремо оцінюємо ризики, модерацію, креативи, прогрів, технічні обмеження і процеси безпеки. У будь-якому випадку спочатку дивимось, чи можемо дати вам адекватну систему, а не просто “залити бюджет”."
          : "Мы разделяем подходы. Для белых ниш делаем чистую упаковку, прозрачную аналитику и стабильные рекламные кабинеты. Для серых ниш отдельно оцениваем риски, модерацию, креативы, прогрев, технические ограничения и процессы безопасности. В любом случае сначала смотрим, можем ли дать вам адекватную систему, а не просто “залить бюджет”.",
    },
  ];

  const faqItems = [
    ...homepageFaq,
    ...faq.map((item) => ({
      id: item.id,
      q: pickL(item, "question", L),
      a: pickL(item, "answer", L),
    })),
  ];

  return (
    <>
      <HeroSection
        items={heroItems}
        eyebrow="01 — PERFORMANCE × DEVELOPMENT"
        headlinePre={L === "uk" ? "Ми будуємо" : "Мы строим"}
        headlineHover={L === "uk" ? "системи" : "системы"}
        headlinePost={L === "uk" ? ", а не просто запускаємо рекламу." : ", а не просто запускаем рекламу."}
        systemsTags={[
          "CRM",
          "RBAC",
          "SaaS",
          "Telegram bots",
          "Landing pages",
          "Analytics",
        ]}
        subtitle={
          L === "uk"
            ? "Трафік. Платформи. CRM. Одна команда для всього стеку."
            : "Трафик. Платформы. CRM. Одна команда для всего стека."
        }
        ctaConsult={L === "uk" ? "Обговорити проєкт" : "Обсудить проект"}
        ctaCases={L === "uk" ? "Подивитися кейси" : "Посмотреть кейсы"}
        hrefContacts={`/${L}/contacts`}
        hrefCases={`/${L}/cases`}
        bannerUrl={pageBanners.home}
        ccLabels={{
          campaigns: "Campaigns",
          platforms: "Platforms",
          clients: "Active clients",
          uptime: "Uptime",
        }}
      />

      <Marquee
        items={[
          "Performance Marketing",
          "Web Development",
          "CRM & SaaS",
          "Telegram Bots",
          "Creative Production",
          "Analytics",
          "Lead Generation",
          "Automation",
        ]}
      />

      <Manifesto
        locale={L}
        eyebrow="Manifesto"
        statement={
          L === "uk"
            ? "Ми створюємо повноцінні екосистеми,"
            : "Мы создаем полноценные экосистемы,"
        }
        emphasis={
          L === "uk"
            ? "в які ця реклама приходить."
            : "в которые эта реклама приходит."
        }
        pillars={[
          {
            num: "Traffic",
            titleUk: "Traffic",
            titleRu: "Traffic",
            textUk: "Платний трафік, креативи, кабінети, аналітика, масштабування.",
            textRu: "Платный трафик, креативы, кабинеты, аналитика, масштабирование.",
          },
          {
            num: "Development",
            titleUk: "Development",
            titleRu: "Development",
            textUk: "Сайти, CRM, SaaS, Telegram Mini Apps, адмінки й бази даних.",
            textRu: "Сайты, CRM, SaaS, Telegram Mini Apps, админки и базы данных.",
          },
          {
            num: "Automation",
            titleUk: "Automation",
            titleRu: "Automation",
            textUk: "Ліди, ролі, звіти, боти, маршрутизація заявок і внутрішні процеси.",
            textRu: "Лиды, роли, отчеты, боты, маршрутизация заявок и внутренние процессы.",
          },
        ]}
      />

      <StatsStrip
        items={[
          {
            value: "7",
            label: L === "uk" ? "років на ринку" : "лет на рынке",
          },
          {
            value: "555+",
            label:
              L === "uk"
                ? "успішних проєктів та сайтів"
                : "успешных проектов и сайтов",
          },
          {
            value: "5",
            label:
              L === "uk"
                ? "людей одночасно займаються вашим проєктом"
                : "человек одновременно занимаются вашим проектом",
          },
          {
            value: "3+млн$",
            label:
              L === "uk"
                ? "прибутку наших клієнтів"
                : "прибыли наших клиентов",
          },
        ]}
      />

      <section className="section container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span className="text-[var(--brand-strong)]">01</span> —{" "}
              {ts("aboutKicker")}
            </div>
            <h2 className="h-display mt-6 text-4xl sm:text-6xl">
              <span className="text-gradient">{t("aboutTitle")}</span>
            </h2>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--text-muted)]">
              {setting(
                settings,
                "about",
                L,
                L === "uk"
                  ? "TAG SERVICE — це tech-партнер для запуску трафіку, платформ і CRM. Ми працюємо на стику performance-маркетингу, розробки, креативу й аналітики: спочатку будуємо систему, потім заводимо в неї трафік."
                  : "TAG SERVICE — tech-партнер для запуска трафика, платформ и CRM. Мы работаем на стыке performance-маркетинга, разработки, креатива и аналитики: сначала строим систему, потом заводим в нее трафик.",
              )}
            </p>
            {/* Desktop: кнопка під текстом «хто ми» (на мобайлі ховаємо — вона під діаграмою). */}
            <LeadModal
              label={L === "uk" ? "Отримати консультацію" : "Получить консультацию"}
              sourcePage="home-about"
              className="btn btn-primary mt-8 hidden lg:inline-flex"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ProcessFlow locale={L} />
          </Reveal>

          {/* Mobile: кнопка одразу під діаграмою (контейнер lg:hidden, щоб на десктопі не лишати порожню комірку грід). */}
          <div className="lg:hidden">
            <Reveal delay={0.15}>
              <LeadModal
                label={L === "uk" ? "Отримати консультацію" : "Получить консультацию"}
                sourcePage="home-about"
                className="btn btn-primary mt-2 inline-flex w-full justify-center"
                arrow={false}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <ServicesMatrix
        kicker={L === "uk" ? "Послуги" : "Услуги"}
        heading={
          L === "uk"
            ? "Один стек: трафік, продукт, автоматизація."
            : "Один стек: трафик, продукт, автоматизация."
        }
        items={services}
      />

      {team.length > 0 && (
        <section id="team" className="section container-x">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
            <span className="text-[var(--brand-strong)]">03</span> —{" "}
            {L === "uk" ? "Команда" : "Команда"}
          </div>
          <h2 className="h-display mt-6 text-4xl sm:text-6xl">{t("teamTitle")}</h2>
          <div className="mt-10">
            <TeamGrid
              members={team.map((member) => ({
                id: member.id,
                name: pickL(member, "name", L),
                role: pickL(member, "role", L),
                photoUrl: member.photoUrl,
              }))}
            />
          </div>
        </section>
      )}

      <SitesGrid
        heading={ts("sitesHeading")}
        kicker={ts("sitesKicker")}
        placeholderNote={ts("sitesPlaceholder")}
      />

      <section className="section container-x">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span className="text-[var(--brand-strong)]">04</span> — Cases
            </div>
            <h2 className="h-display mt-6 max-w-3xl text-4xl sm:text-6xl">
              {L === "uk"
                ? "Кейси без зайвого шуму: гео, термін, результат."
                : "Кейсы без лишнего шума: гео, срок, результат."}
            </h2>
          </div>
          <Link href="/cases" className="btn btn-ghost hidden shrink-0 sm:inline-flex">
            {t("viewAllCases")}
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/cases/${project.slug}`}
              className="card block min-h-[310px] p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-white/12 bg-white/[0.055] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  NDA CASE
                </span>
                <span className="font-mono text-xs text-[var(--brand-strong)]">
                  {project.year}
                </span>
              </div>
              <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {L === "uk" ? project.categoryUk : project.categoryRu}
              </div>
              <h3 className="h-display mt-3 text-2xl">
                {L === "uk" ? project.titleUk : project.titleRu}
              </h3>
              <div className="mt-8 grid grid-cols-3 gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <span>14 days</span>
                <span>218 leads</span>
                <span>live</span>
              </div>
              <span className="mt-8 inline-block text-sm font-bold text-[var(--brand-strong)]">
                {L === "uk" ? "Відкрити кейс" : "Открыть кейс"} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section container-x">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
            <span className="text-[var(--brand-strong)]">05</span> —{" "}
            {L === "uk" ? "Відгуки" : "Отзывы"}
          </div>
          <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t("reviewsTitle")}</h2>
          <div className="mt-10">
            <Reviews items={reviews.map((review) => ({ id: review.id, imageUrl: review.imageUrl }))} />
          </div>
        </section>
      )}

      <section className="section container-x">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="kicker">{tcommon("ctaConsult")}</span>
            <h2 className="h-display mt-5 text-4xl sm:text-6xl">
              {L === "uk"
                ? "Почнемо з короткого бріфу."
                : "Начнем с короткого брифа."}
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              {L === "uk"
                ? "Розкажіть про нішу, бюджет і поточний трафік — ми підкажемо, яку систему варто будувати першою."
                : "Расскажите о нише, бюджете и текущем трафике — мы подскажем, какую систему стоит строить первой."}
            </p>
          </div>
          <QuizForm sourcePage="home" />
        </div>
      </section>

      {news.length > 0 && (
        <section className="section container-x">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
                <span className="text-[var(--brand-strong)]">06</span> — News
              </div>
              <h2 className="h-display mt-6 text-4xl sm:text-5xl">
                {t("newsTeaserTitle")}
              </h2>
            </div>
            <Link href="/news" className="btn btn-ghost hidden shrink-0 sm:inline-flex">
              {t("viewAllNews")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {news.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="card block p-5">
                <div className="text-xs text-[var(--text-muted)]">
                  {new Date(post.publishedAt).toLocaleDateString(L)}
                </div>
                <div className="h-display mt-3 text-xl">{pickL(post, "title", L)}</div>
                <span className="mt-5 inline-block text-sm font-semibold text-[var(--brand-strong)]">
                  {tn("readMore")} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="section container-x">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span className="text-[var(--brand-strong)]">07</span> — FAQ
            </div>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t("faqTitle")}</h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <Faq
              items={faqItems}
            />
          </div>
        </section>
      )}
    </>
  );
}
