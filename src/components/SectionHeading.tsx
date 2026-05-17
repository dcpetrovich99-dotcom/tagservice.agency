export default function SectionHeading({
  kicker,
  title,
  subtitle,
  center,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker && <span className="badge">{kicker}</span>}
      <h2 className="h-display mt-3 text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="text-muted mt-3 text-base">{subtitle}</p>}
    </div>
  );
}
