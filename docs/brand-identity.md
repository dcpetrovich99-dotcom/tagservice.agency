# Brand identity — performance + dev agency

> Робочий документ айдентики. Спирається на реальну дизайн-систему сайту
> (`src/app/globals.css`, шрифти, ритм секцій). Можна використати як ТЗ
> для дизайнера лого або як seed для AI-генератора (DALL·E, Midjourney,
> Ideogram).

---

## 1. Brand essence

### Хто ми
Студія перформанс-маркетингу **та** кастомного дев-у. Більшість агенцій
продає рекламу — ми продаємо систему: трафік + платформа, на яку він
ллється. Один підрядник на весь стек, від крео до CRM.

### Position one-liner
**UA:** «Трафік. Платформи. Звіти. Без AI-приколів.»
**RU:** «Трафик. Платформы. Отчёты. Без AI-приколов.»
**EN:** «Traffic, platforms, receipts. No fluff.»

### Brand promise (3 reasons to choose)
1. **Реальні платформи**, не лендоси-на-конструкторі (CRM, SaaS, лід-системи з БД)
2. **Прозорі звіти** з продакшн-доменами, не «скриншот у ТГ»
3. **In-house creative + dev** — одна команда, один контракт, одна точка відповідальності

### Personality (вісі)
- Confident *(не «довіряємо вашій інтуїції»; ми знаємо що працює)*
- Modern *(2026, без декоративних плюшок)*
- Premium *(великі шрифти, повітря, мономо-деталі)*
- Technical *(числа, відсотки, мономо-моноширинні дані)*
- Honest *(NDA-кейси марковані, без «X+ % ROI» у вакуумі)*

### Anti-personality (чого уникаємо)
- Стокове AI-clipart («smiling people in front of laptops»)
- Bro-marketing copy («масштабуй свій бізнес сьогодні»)
- Crypto-стиль neon-кіч, racing-tema, gamification
- Емоджі замість аргументів

### Tone of voice
- Коротко. Конкретно. З числами де можна.
- Мономо-деталі (`v2`, `RBAC`, `4.2×`) як вкраплення в editorial-копії
- Легка іронія дозволена («ми не продаємо рекламу — ми продаємо результат»)
- Білінгва UK / RU паритетно; англомовні технічні терміни не локалізуємо

---

## 2. Naming

Брендова частина сайту зараз — плейсхолдер `AGENCY.studio` /
`AGENCY.traffic`. Перед продакшн-деплоєм потрібна реальна назва.

### Що шукаємо
- 1-2 склади, легко вимовляється UA/RU/EN
- Не зайнято в `.com` або хоча б `.studio` / `.agency`
- Не конфліктує з існуючими агенціями (`agency.com` — табу)
- Без буквальних слів «traffic», «marketing», «ads» — нагадує
  калькулятор-агенцію

### Патерни (приклади-напрямки, не остаточні)
| Тип | Приклади | Чому |
|---|---|---|
| Геометричні абстракти | **Axis**, **Vector**, **Loop** | короткі, чисті, легко лого-візуалізуються |
| Технічно-фізичні | **Quanta**, **Lumen**, **Vector7** | відсилка до точності, вимірюваності |
| Тире/punkt-стиль | **Slash**, **Stop**, **Hush** | модно, easy-to-remember, як у tech-команд |
| Прикметник + точка | **Solid.**, **Plain.**, **Mid.** | clean, типографічно сильно |

> Якщо вже є робоча назва — напишіть, переписую брендбук під неї за
> 1 ітерацію.

---

## 3. Color palette

Базується на CSS-токенах сайту. Не вигадка — реально працює в коді.

### Primary
| Token | HEX | RGB | Призначення |
|---|---|---|---|
| `--brand` | **#1F9FE0** | 31, 159, 224 | основний акцент, CTA-кнопки, посилання |
| `--brand-strong` | **#0F7FB5** | 15, 127, 181 | text-gradient, мономо-числа, рамки активних |

### Accents (mood, не CTA)
| Token | HEX | Призначення |
|---|---|---|
| `--accent` | **#6C5CE7** | violet — innovation/AI-блоки |
| `--accent-2` | **#00C2A8** | mint — конверсії/SaaS-блоки |
| `--accent-3` | **#FF6B9A** | pink — креатив/lifestyle-блоки |

### Neutrals (light theme)
| Token | HEX | Призначення |
|---|---|---|
| `--bg` | **#EEF4FB** | сторінка |
| `--surface` | **#FFFFFF** | картки, header glass |
| `--surface-2` | **#EAF2FB** | секунд. поверхні |
| `--text` | **#0E1B2C** | основний текст |
| `--text-muted` | **#5A7088** | мономо-айбров, описи |
| `--border` | **#D6E6F3** | хейрлайн-лінії, рамки |

### Dark mood (для `/grey` сторінки + Manifesto-сендвіч)
| Token | HEX | Призначення |
|---|---|---|
| `--bg` | **#0A0E14** | сторінка |
| `--surface` | **#121A25** | картки |
| `--surface-2` | **#18222F** | секунд. |
| `--text` | **#E8EEF6** | текст |
| `--text-muted` | **#8AA0B8** | мономо-деталі |

### Gradient lockup (для hero-title і CTA)
Лінія: **115°** → `var(--brand-strong) 0%` → `var(--accent) 45%` →
`var(--brand) 75%` → `var(--accent-2) 100%`. Уникати на тілі тексту —
тільки для display-headlines і центрпіс-обʼєктів.

---

## 4. Typography system

### Display / hero
**Unbounded** (Google Fonts), weight **700–800**, letter-spacing **-0.03em**.
Тільки для headlines `clamp(2.4rem, 7.4vw, 9.5rem)`. Кириличний підмножина
обовʼязкова — у нас UA / RU копія.

```css
.hero-title { font-family: var(--font-unbounded); font-weight: 800; }
```

### Display / sections
**Manrope**, weight **700–800**, letter-spacing **-0.02em**, для h2/h3
у секціях (`.h-display`).

### Body
**Manrope**, weight **400–500**, line-height **1.55**, text-base/lg.

### Mono / numerals
**Montserrat** в `tabular-nums` — для статистики, нумерації секцій
(`01 / 05`), мономо-айбровів.

### Eyebrow / kicker (фірмовий патерн)
Унікальний типографічний паттерн сайту — використовувати **скрізь**:
```
[• ACCENT_DOT] [03] [—] [SECTION NAME]
font: Montserrat / Manrope, 11px, uppercase, letter-spacing: 0.28em
color: var(--text-muted), nubeer accent var(--brand-strong)
```

### Хибне використання
- ❌ Display-шрифт у боді (Unbounded на тілі — нечитабельно)
- ❌ Letter-spacing > 0.32em на eyebrows (розпадається)
- ❌ Italic Unbounded — він не має валідного italic (псує)

---

## 5. Logo concepts (3 напрямки)

Це не «фінал» — це 3 валідні концепти. Кожен описаний так, щоб або
сам згенерувати в AI, або кинути дизайнеру брифом.

### A · Pure wordmark *(Cyrclo-style)*
> Назва — це весь логотип. Без іконки.

**Конструкція:** all-caps, Unbounded 800, letter-spacing `-0.045em`,
оптично вирівняно (`I` та `J` штовхати ближче). Одна літера —
**аномалія**: замінена на геометричний знак (точка, мікродіагональ,
крапка), стає brand-mark і працює як favicon / app icon.

**Приклад (текстовий):**
```
A X I S.        ←  wordmark
    ▘           ←  аномалія в точці (favicon)
```

**Color variants:**
- Primary: `--text` (#0E1B2C) на світлому
- Inverted: white на `--bg` темному
- Accent: gradient lockup ТІЛЬКИ для splash / hero

**Pros:** масштабується від favicon до білборду без втрат. Brand = name.
**Cons:** треба сильна типографічна екзекуція. Без сильної назви — мертво.

**Brief для AI / дизайнера:**
> Custom wordmark for an agency named «[NAME]». All-caps. Modern bold sans-serif (Unbounded weight 800). Tight optical kerning. Replace one letter or insert a single geometric anomaly: a thick dot, a notch, or a 45° slash. Monochrome. Vector. No effects. Minimal premium tech aesthetic. Magazine cover quality.

---

### B · Monogram + wordmark *(Scalora-style)*

**Конструкція:** геометрична іконка + word lockup. Іконка — один знак
зі строгої сітки 6×6 або кола з вирізами. Лучше геометрія, ніж літера-
монограма (літера обмежує до англ. читання).

**Приклади знаків:**
- Подвоєне коло з вирізаним сегментом (loop / infinity-half)
- Дві паралельні діагоналі різної товщини (axis)
- Квадрат з відсіченим кутом (block / start)

**Lockup horizontal:**
```
◉ ━━━ AGENCY.studio
```
Висота знаку = висота `x` у wordmark.

**Variants:**
- horizontal lockup (для header / footer)
- stacked (для квадратних коробок)
- standalone mark (для favicon, social avatar, watermark)

**Pros:** іконка живе самостійно (TG-стікер, аватар, кнопка). Більше
впізнаваності за час.
**Cons:** два візуальні елементи = два, які треба памʼятати.

**Brief:**
> Minimal geometric monogram for a 2026 performance marketing agency.
> Built on a 6×6 grid, single shape, NOT a letter monogram. Suggested
> motifs: looping arc with a single break, two intersecting axes of
> different weight, a square with one corner sliced at 45 degrees.
> Solid fill, no outlines. Monochrome. Vector. Pair with all-caps
> Unbounded 800 wordmark on the right.

---

### C · Kinetic mark *(X-Axis-style)*

**Конструкція:** іконка має **N станів** — анімується. Працює в моушн-
ідентичності (відео, hero, loading). Статичний фрейм — лиш «обкладинка».

**Концепт:** вертикальна лінія, що в анімації розщеплюється на 2 → 3 →
6 (як плейсменти), потім збирається назад. На статиці — 3 паралельні
лінії різної довжини зі sliced-out gap по центру.

**Pros:** **дуже** standout, OWN-able (немає схожого в перформанс-нішах).
Природньо стелиться на наш scroll-hijack / hero centerpiece.
**Cons:** треба моушн-версію в DAW і експорт SVG-стейтів. Більше праці.

**Brief:**
> Kinetic logo mark for a marketing × dev agency. Static frame:
> three parallel vertical lines of varied lengths, centred, with a
> single horizontal gap slicing across at the same height. Lines are
> solid, no outlines. Monochrome. Pair with all-caps Unbounded 800
> wordmark below. Provide three additional states: 1-line collapsed,
> 6-line splayed, mid-transition with offset weights — for use in
> motion identity.

---

## 6. Construction & specs

### Clearspace
Мін. відступ навколо лого = висота літери `x` у wordmark. На білбордах
і preview-зображеннях — × 2.

### Min sizes
| Контекст | Мін. розмір |
|---|---|
| Favicon | 16 × 16 px (іконка only, без wordmark) |
| Web header | 80 px по висоті wordmark |
| Mobile splash | 64 px іконка |
| Print | 8 mm по короткій стороні |

### Variants required
1. **Primary** — full color на світлому
2. **Mono dark** — `--text` на світлому
3. **Mono light** — white на темному / зображенні
4. **Knockout** — вирізана зі фону без жодного fill

Файли потрібні в **SVG** (для веба, як ресс-незалежне), **PNG @2x** і
**@3x** (для соцмереж), **PDF** (для друку).

### Wrong uses
- ❌ Стиснення / розтяг (`object-fit: cover`)
- ❌ Outline / stroke версія
- ❌ Реколор у не-палітрові кольори
- ❌ Тінь / shadow / glow за замовчуванням
- ❌ Розтаскування символу і wordmark
- ❌ Поворот / нахил
- ❌ Лого поверх AI-фото без контрастного оверлею
- ❌ Версія «лого з прозорістю 50%»

---

## 7. Visual elements

### Iconography
- Стиль: **stroke 1.5px**, скруглені кінці (`stroke-linecap: round`),
  ширина іконки 24/32/48
- Бібліотека за замовчуванням: **Lucide** (для сайту і дашбордів)
- Власні іконки малюємо на тій же 24-сітці

### Photography / illustration
**Editorial-портрети команди:** черно-білі за замовчуванням, на ховері
кольорові, портретна аспект 4:5, soft cinematic rim-light, no smiling-into-
camera. Без логотипів одягу. Уже працює в `TeamGrid.tsx`.

**Product / hero visuals:** абстрактні скляні скульптури, ribbons of
light, gradient meshes — БЕЗ телефонів, AppUI, людей, текстових
оверлеїв. Уже працює в `HeroSection.tsx` (центрпіс).

**News covers:** мінімалістичний editorial illustration. Один сильний
візуальний образ + лаконічний фон. Уже працює в `news-*.png`.

**Reviews:** реалістичні TG-скріни (vertical 9:16), темний UI, тільки
короткий відгук + час. Уже працює в `review-*.png`.

### Motion language
- Easing: **`cubic-bezier(0.2, 0.7, 0.2, 1)`** для входу карток
- Durations: 220ms (мікро), 500ms (reveal), 900ms (hero)
- Параллакс: **тільки subtle** (transform translate +-10px) — без
  агресивного скейлу
- Scroll-hijack: дозволено максимум **1** блок на сторінку (зараз — Послуги)
- Зіткнення «всі анімуються одночасно» = ❌. Use `stagger 0.05–0.08`.

### Layout grid
- Container max-width: **1180px** (CSS-токен `.container-x`)
- Padding-inline: **1.25rem** мобайл, **1.5rem** десктоп
- Vertical rhythm: `clamp(3rem, 7vw, 6rem)` між секціями
- Колонки: 12-col на десктопі, 4-col на мобайл

---

## 8. Tone — copywriting prompts

Якщо потрібно сгенерувати копі — використовуйте ці constraint-и в промпті:

```
Tone constraint:
- Direct, confident, NO buzzwords («synergy», «leverage», «transform»)
- Use specific numbers and product names (TikTok, Telegram Ads, ROAS)
- Mix Cyrillic with English tech terms (CRM, RBAC, SLA, ROAS)
- Slight irony allowed: «ми не [generic], ми [specific]»
- Avoid em-dashes substituting hyphens. Use real em-dash `—`.
- Avoid AI-marker phrases: «in today's fast-paced world», «unlock potential»
- Length: micro-copy = 5-8 words, sub-copy = 1-2 sentences, body = 3-5 sentences max
- Bilingual UA/RU: same structure, не дослівний переклад
```

---

## 9. Applications

### Веб (вже працює)
Сайт `agency-site` — еталон інтерпретації цієї айдентики. Будь-яке
нове виношення (новий лендос, landing-під-кампанію) повинно
перевикористовувати:
- глобальні токени (`globals.css`)
- шрифт-стек (`@/components/Footer.tsx` show font setup)
- ритм нумерації секцій (`01 — name` мономо-eyebrow)

### Соцмережі
**Telegram-канал:** аватар = standalone mark (варіант B/C), не wordmark.
Темний фон, акцент `--brand`. Cover з KENBURN-абстрактом.

**Instagram (якщо буде):** grid у трьох темах — case studies (cyclo-
style mono), team (grayscale editorial), abstract (центрпіс-arts). НЕ
текстові плитки.

### Друк / merch
**Бізнес-карти:** 85 × 55 mm, mono-print. Лого зверху ліворуч, дані
знизу праворуч мономо. Папір — матовий чорний з spot UV на лого.

**Підпис в email:**
```
[mark] AGENCY.studio
Performance marketing + custom dev
↗ t.me/[manager]
```

### Анімація / відео
Дотримуватись motion-language (розділ 7). Для відеоконтенту — див.
`docs/instagram-video-prompt.md`.

---

## 10. Roadmap після затвердження лого

1. Експортувати **5 версій** (full color, mono dark, mono light, knockout,
   monochrome stamp) у SVG / PNG @2x / @3x / PDF
2. Замінити placeholder `AGENCY.studio` у `Header.tsx`, `Footer.tsx`
3. Згенерувати **favicon-set** (16/32/96/192/512) і `apple-touch-icon`
4. Оновити `metadata.openGraph` у `[locale]/layout.tsx` з новим OG-зображенням (1200×630)
5. Додати **анімовану версію** як `<motion.svg>` в `Header.tsx` (на hover state)
6. Експортувати **Telegram-аватар** (512×512 з safe-area)
7. Версія для **тіньової теми** (dark hero — окремо протестувати контраст)

---

## Швидкий чек-аркуш (для дизайнера логотипу)

Якщо дизайнер прийшов з варіантом — пройти 8 пунктів:

- [ ] Читається при висоті 80 px на сайті?
- [ ] Працює favicon 16×16 БЕЗ wordmark?
- [ ] Монохромна версія читається?
- [ ] На білому І на темному (без додаткового obvodу)?
- [ ] Векторні SVG-файли без bitmap-залежностей?
- [ ] Не плутається з відомими брендами в трафік-/SaaS-нішах?
- [ ] Не використовує сток-симвоніку (rocket, lightning bolt, growth arrow)?
- [ ] Чи зберігає сенс при ротації +-15°? (тест на «що це таке з ходу»)

Якщо всі 8 — yes, лого готове в продакшн.
