# Instagram cinematic video для агентства

Промпт для Davinci.ai / Runway / Kling / Sora — для відеокреативу 9:16,
тривалість 15–30 с, ціль: продаж послуг розробки **сайтів / SaaS / CRM**
з заявкою через біо.

> Чому ваш попередній варіант давав «хуйнб»: він був один абзац без
> структури, без кадрування, без напряму камери, без референсного стилю.
> Нижче — кожен крок розписано так, щоб генератор точно зрозумів, що
> рендерити. Якщо інструмент бере 1 промпт за раз — давайте по черзі
> кожну сцену з блоку «SHOTS» нижче.

---

## Style anchor (вставити в будь-який Davinci-промпт)

```
Aspect ratio 9:16, vertical, 4K cinematic.
Style: 2026 hyper-modern tech ad, Apple x A24 hybrid, glassmorphism,
photorealistic, premium agency look.
Color grade: cool teal-cyan shadows, warm peach highlights, deep blacks,
HDR contrast.
Lighting: volumetric god rays, soft rim light, sharp practical lights,
depth of field, bokeh.
Lenses: anamorphic 35mm, slight horizontal flares.
Texture: subtle film grain, micro chromatic aberration on edges.
No on-screen text, no UI watermarks, no people speaking to camera.
```

---

## SHOTS (склейте у Premiere/Resolve по 2–4 секунди кожен)

### 1. HOOK — 0:00–0:03
```
Slow dolly-push into a floating holographic dashboard hovering in pitch-
black space. Glass panels rotate gently in z-axis, neon-blue and violet
gradients (#1f9fe0, #6c5ce7) refract through the glass. Particles drift
like dust in a beam of light. Camera moves from wide to medium close-up.
Anamorphic lens flare on the right edge. 9:16, 4K, cinematic.
```

### 2. SAAS UI — 0:03–0:07
```
Cinematic close-up of a futuristic SaaS dashboard rotating in 3D —
charts pulsing with data, sparklines animating, KPI cards stacking like
weightless glass tiles. Camera orbits 25 degrees right while the
dashboard breathes. Reflections of teal light on glossy black surface.
Ultra-realistic, no text labels, abstract data viz. 9:16 vertical.
```

### 3. CRM CARDS — 0:07–0:11
```
Macro shot, shallow depth of field, of a CRM kanban board built from
floating frosted-glass cards. Cards slide between columns on invisible
rails. A single card pulses with a soft cyan glow as if a new lead just
arrived. Background: gradient mesh of deep indigo to magenta, soft
volumetric haze. Anamorphic 35mm, 9:16.
```

### 4. WEBSITE BUILD — 0:11–0:16
```
Time-lapse of a beautiful e-commerce landing page assembling itself —
sections snap into place from above, type animates in, product images
fade in with smooth scale-up. Browser frame is minimal glass with three
soft-glow control dots. Camera slowly pulls back to reveal the full
page on a giant floating monitor in a dark studio. Cinematic, 9:16.
```

### 5. SCALE / NETWORK — 0:16–0:21
```
Wide cinematic shot: a dark globe made of intersecting neon lines, with
glowing pulses traveling between cities. Floating UI panels orbit the
globe — TikTok, Google, Meta, Telegram visual cues (no logos). Camera
slowly cranes around the globe, anamorphic flare sweeps across. Deep
blacks, neon cyan/violet, soft volumetric atmosphere. 9:16 vertical.
```

### 6. CTA reveal — 0:21–0:25
```
Cinematic push-in onto a single glass plate floating in dark void. The
surface refracts light. Camera ends locked off, ready for end-card
overlay in Premiere. Minimal, premium, no text in render. 9:16.
```

---

## B-ROLL prompts (для пробивок між сценами)

```
1) Macro: liquid mercury rolling across a black surface in slow motion.
2) Sci-fi data particles flowing through a translucent pipe.
3) A hand reaching toward a floating UI button — only fingertips and a
   ring of soft light. Cinematic skin tones.
4) Cinematic time-lapse of city lights blooming at dusk, reflected in
   wet asphalt, anamorphic flares.
```

---

## Audio / монтаж (Premiere/Resolve)

- Темп: 110–120 BPM деталізована electronic / cinematic (Epidemic Sound:
  «modern tech ad», «cinematic future tech»).
- Кат після кожних 2–3 c (SAAS UI / CRM CARDS трохи довші, для довіри).
- Whoosh-переходи між шотами, subtle low-end impact на CTA-кадрі.
- Sound design: light glass clicks, distant hum, soft sub.

### Текст-оверлеї (накласти в монтажі, НЕ в промптах)
1. «Сайти. SaaS. CRM. Під ключ.»
2. «Запуск ≤ 3 тижні.»
3. «Залиш заявку → DM»

Шрифт: Unbounded / Manrope, weight 800, kerning -0.02em, білий з легким
glow. Тримати кадр 1.0–1.5 с кожен.

---

## Поради по якості (чому Davinci може «ригати»)

1. **Конкретика** замість «потужне круте відео». Кожен Davinci-кадр —
   окремий промпт зі стилем, рухом камери, лінзою, освітленням.
2. **9:16 у самому промпті** — «vertical 9:16, 4K» в перших словах.
3. **Без тексту в промпті** для відео-генерації. Текст накладаєте у
   монтажі — це і чіткіше виглядає, і не плутає модель.
4. **Без брендів/логотипів** — генератори частково модерують відомі
   марки, краще описувати «brand-agnostic UI mockup».
5. **Короткі сцени** по 2–4 с, не намагайтесь зробити 25 с одним
   рендером.
6. **Reference images**: якщо інструмент підтримує image-to-video,
   завантажуйте свої референси як стартовий кадр для тих сцен, де
   треба «під ваш стиль».
