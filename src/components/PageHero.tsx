import SmartMedia from "./SmartMedia";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  bannerUrl?: string | null;
};

/**
 * Заголовок вкладки з опційним CMS-банером, який перекриває праву частину
 * заголовка (editorial-overlap). Банер — зображення або відео (SmartMedia).
 * Якщо банер не заданий — рендериться звичайний заголовок.
 */
export default function PageHero({ kicker, title, subtitle, bannerUrl }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      {bannerUrl && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[68%] max-w-[760px] sm:w-[56%]">
          <SmartMedia
            src={bannerUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 68vw, 56vw"
            className="object-cover object-right"
          />
          {/* Лівий фейд у фон — щоб банер «вростав» у сторінку, а не різав текст */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--bg) 1%, color-mix(in srgb, var(--bg) 35%, transparent) 30%, transparent 55%)",
            }}
          />
        </div>
      )}

      <div className="container-x relative z-10 pb-10 pt-12 sm:pb-12 sm:pt-16">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="hero-title mt-4 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted mt-5 max-w-xl text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
