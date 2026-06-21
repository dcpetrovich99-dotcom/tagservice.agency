import { SERVICE_ITEMS } from "./serviceItems";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

export default function ServicesDetail({ locale }: { locale: "uk" | "ru" }) {
  const uk = locale === "uk";
  return (
    <div className="container-x py-16 sm:py-20">
      <Reveal>
        <div className="text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--brand-strong)]">
            {uk ? "Що ми робимо" : "Что мы делаем"}
          </div>
          <h2 className="h-display mt-2 text-2xl sm:text-3xl lg:text-4xl">
            {uk ? "Повний стек послуг під ваш ріст" : "Полный стек услуг под ваш рост"}
          </h2>
          <p className="text-muted mx-auto mt-3 max-w-2xl text-sm sm:text-base">
            {uk
              ? "Натисніть будь-яку послугу в банері зверху — і ми підсвітимо її тут."
              : "Нажмите любую услугу в баннере сверху — и мы подсветим её здесь."}
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SERVICE_ITEMS.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 0.06}>
            <div
              id={`svc-${s.id}`}
              className="card svc-card h-full scroll-mt-28 p-6 transition-colors sm:p-7"
            >
              <div
                className="num-accent text-sm"
                style={{ color: "var(--brand-strong)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="h-display mt-2 text-xl">
                {uk ? s.titleUk : s.titleRu}
              </h3>
              <p className="text-muted mt-3 leading-relaxed">
                {uk ? s.descUk : s.descRu}
              </p>
              <Link
                href="/contacts"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: "var(--brand-strong)" }}
              >
                {uk ? "Замовити" : "Заказать"} →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
