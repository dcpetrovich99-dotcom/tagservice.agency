"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SmartMedia from "./SmartMedia";

type CarouselItem = {
  placement: string;
  title: string;
  text: string;
  imageUrl?: string | null;
};

const FALLBACKS = [
  "linear-gradient(135deg, rgba(49,168,255,0.36), rgba(118,103,255,0.24), rgba(40,230,195,0.16))",
  "linear-gradient(135deg, rgba(255,111,170,0.32), rgba(118,103,255,0.25), rgba(49,168,255,0.18))",
  "linear-gradient(135deg, rgba(40,230,195,0.26), rgba(49,168,255,0.23), rgba(118,103,255,0.2))",
];

const PLACEHOLDERS: CarouselItem[] = [
  {
    placement: "Traffic",
    title: "Hero image placeholder",
    text: "Upload image in admin → Hero banners.",
  },
  {
    placement: "Websites",
    title: "Glass card placeholder",
    text: "Use 16:10 or 4:3 images for best crop.",
  },
  {
    placement: "CRM",
    title: "Product visual placeholder",
    text: "Cards rotate automatically.",
  },
];

const CARD_RADIUS = 22;

/**
 * 3D-центрифуга з карток — однакова на десктопі й мобайлі. На мобайлі
 * "compact": менші картки/зображення, тонший кант, БЕЗ backdrop-filter
 * (саме анімований blur на рухомих картках вішав мобільні GPU).
 */
export default function GlassImageCarousel({
  items,
}: {
  items: CarouselItem[];
}) {
  const slides = useMemo<CarouselItem[]>(
    () => (items.length > 0 ? items : PLACEHOLDERS),
    [items],
  );

  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return <Carousel3D slides={slides} compact={compact} />;
}

function Carousel3D({
  slides,
  compact,
}: {
  slides: CarouselItem[];
  compact: boolean;
}) {
  const CARD_W = compact ? 168 : 290;
  const CARD_H = compact ? 214 : 320;
  const DEPTH = compact ? 8 : 16;
  const minRadius = compact ? 150 : 260;
  const perspective = compact ? 1050 : 1500;

  const N = slides.length;
  const angleStep = 360 / Math.max(N, 1);
  const radius = useMemo(() => {
    const r = CARD_W / 2 / Math.tan(Math.PI / Math.max(N, 3));
    return Math.max(r, minRadius);
  }, [N, CARD_W, minRadius]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0.12);
  const targetVelocityRef = useRef(0.12);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      velocityRef.current +=
        (targetVelocityRef.current - velocityRef.current) * 0.055;
      rotationRef.current += velocityRef.current;
      if (spinnerRef.current) {
        spinnerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (compact) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    targetVelocityRef.current = 0.12 + px * 2.2;
  }

  function onMouseLeave() {
    targetVelocityRef.current = 0.12;
  }

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto w-full select-none ${
        compact ? "h-[300px] max-w-[420px]" : "h-[460px] max-w-[760px] sm:h-[520px]"
      }`}
      style={{ perspective: `${perspective}px`, perspectiveOrigin: "50% 50%" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_45%_28%,rgba(49,168,255,0.24),transparent_38%),radial-gradient(circle_at_70%_70%,rgba(118,103,255,0.22),transparent_42%)] blur-2xl" />

      <div
        className="pointer-events-none absolute bottom-[-2%] left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(49,168,255,0.18), transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      <div
        ref={spinnerRef}
        className="absolute left-1/2 top-1/2"
        style={{
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {slides.map((item, i) => {
          const fallback = FALLBACKS[i % FALLBACKS.length];
          const slideAngle = i * angleStep;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: -CARD_W / 2,
                top: -CARD_H / 2,
                transformStyle: "preserve-3d",
                transform: `rotateY(${slideAngle}deg) translateZ(${radius}px)`,
              }}
            >
              {/* Лицьова сторона — ціле зображення-картка. */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `translateZ(${DEPTH / 2}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <Face item={item} fallback={fallback} compact={compact} priority={i < 4} />
              </div>

              {/* Тильна сторона — одна суцільна темна плита (без зайвих шарів,
                  щоб не було z-fighting/мерехтіння). */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotateY(180deg) translateZ(${DEPTH / 2}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  borderRadius: CARD_RADIUS,
                  background:
                    "linear-gradient(150deg, rgba(22,32,58,0.95), rgba(8,14,32,0.98))",
                  border: "1px solid rgba(176,218,255,0.12)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Face({
  item,
  fallback,
  compact,
  priority,
}: {
  item: CarouselItem;
  fallback: string;
  compact: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden border"
      style={{
        borderRadius: CARD_RADIUS,
        // Суцільний непрозорий фон (без backdrop-filter — саме анімований blur
        // на рухомих картках і давав мерехтіння). Зображення все одно перекриває.
        background: "rgba(10,16,34,0.98)",
        borderColor: "rgba(176,218,255,0.20)",
        boxShadow: compact
          ? "0 18px 50px -30px rgba(49,168,255,0.5)"
          : "0 36px 100px -45px rgba(49,168,255,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        // стабілізуємо растеризацію шару при 3D-обертанні → менше «гри» пікселів
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-0">
        {item.imageUrl ? (
          <SmartMedia
            src={item.imageUrl}
            alt=""
            fill
            // Віддаємо помітно більшу роздільність, ніж фізичний розмір картки
            // (супер-семплінг) — текст/лого на зображеннях лишаються чіткими
            // і не мерехтять при повороті. Якість висока, без сильного стиску.
            sizes={compact ? "360px" : "640px"}
            quality={95}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ background: fallback }} />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,17,0.05),rgba(3,7,17,0.78))]" />

      <div className={compact ? "absolute inset-x-3 bottom-3" : "absolute inset-x-5 bottom-5"}>
        <h3 className={compact ? "h-display text-base text-white" : "h-display text-2xl text-white"}>
          {item.title}
        </h3>
        <p
          className={
            compact
              ? "mt-1 line-clamp-2 text-[11px] leading-4 text-cyan-50/70"
              : "mt-2 line-clamp-2 text-sm leading-6 text-cyan-50/70"
          }
        >
          {item.text}
        </p>
      </div>
    </div>
  );
}
