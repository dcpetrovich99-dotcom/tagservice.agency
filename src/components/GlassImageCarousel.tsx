"use client";

import { useEffect, useMemo, useRef } from "react";
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

// Картки тепер квадратніші + з фізичною товщиною (≈ 3-4 мм на екрані).
const CARD_W = 290;
const CARD_H = 320;
const CARD_RADIUS = 22;
// Товщина «плити» картки. Набирається стосом тонких силуетів, тому
// заокруглені кути не «вилазять» по краях, як було б у плоских гранях.
const DEPTH = 18;
const RIM_LAYERS = 12;

/**
 * 3D-центрифуга з карток. Не слайдшоу — обертається безперервно по колу.
 * Mouse-move прискорює/сповільнює обертання залежно від положення курсора
 * по X. Кожна картка — обʼємна плита: лицьова грань + дзеркальна задня +
 * стос силуетів між ними, що формує товстий бічний кант.
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
  const N = slides.length;
  const angleStep = 360 / Math.max(N, 1);
  const radius = useMemo(() => {
    const r = CARD_W / 2 / Math.tan(Math.PI / Math.max(N, 3));
    return Math.max(r, 260);
  }, [N]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0.12);
  const targetVelocityRef = useRef(0.12);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      // Мʼякший lerp → плавніший розгін/гальмування при русі карток.
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
      className="relative mx-auto h-[460px] w-full max-w-[760px] select-none sm:h-[520px]"
      style={{ perspective: "1500px", perspectiveOrigin: "50% 50%" }}
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
              {/* бічний кант (товщина) — стос силуетів між гранями */}
              {Array.from({ length: RIM_LAYERS }).map((_, layer) => {
                const z =
                  -DEPTH / 2 + (DEPTH * layer) / (RIM_LAYERS - 1);
                const shade = 0.55 - (layer / (RIM_LAYERS - 1)) * 0.4;
                return (
                  <div
                    key={layer}
                    className="absolute inset-0"
                    style={{
                      borderRadius: CARD_RADIUS,
                      transform: `translateZ(${z}px)`,
                      background: `linear-gradient(150deg, rgba(150,190,245,${shade}), rgba(8,14,32,0.96))`,
                    }}
                  />
                );
              })}

              {/* лицьова грань */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `translateZ(${DEPTH / 2}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <Face item={item} fallback={fallback} priority={i < 4} />
              </div>

              {/* дзеркальна задня грань */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotateY(180deg) translateZ(${DEPTH / 2}px) scaleX(-1)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <Face item={item} fallback={fallback} mirrored />
              </div>
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
  mirrored,
  priority,
}: {
  item: CarouselItem;
  fallback: string;
  mirrored?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden border"
      style={{
        borderRadius: CARD_RADIUS,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(155%)",
        WebkitBackdropFilter: "blur(24px) saturate(155%)",
        borderColor: "rgba(176,218,255,0.18)",
        boxShadow: mirrored
          ? "0 30px 80px -50px rgba(0,0,0,0.85)"
          : "0 36px 100px -45px rgba(49,168,255,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        filter: mirrored ? "brightness(0.42) saturate(1.35)" : "none",
        opacity: mirrored ? 0.68 : 1,
      }}
    >
      <div className="absolute inset-0">
        {item.imageUrl ? (
          <SmartMedia
            src={item.imageUrl}
            alt=""
            fill
            sizes="300px"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ background: fallback }} />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,17,0.05),rgba(3,7,17,0.78))]" />

      <div className="absolute inset-x-5 bottom-5">
        <h3 className="h-display text-2xl text-white">{item.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-cyan-50/70">
          {item.text}
        </p>
      </div>
    </div>
  );
}
