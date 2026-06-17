// Векторна копія логотипу TAG SERVICE — фасетний орігамі-літачок,
// напрямок угору-праворуч, градієнт cyan → blue → violet (як у бренд-лого).
// Прозорий фон, чіткий від favicon до білборду.

export default function BrandMark({
  size = 28,
  className,
  uniqueId,
}: {
  size?: number;
  className?: string;
  uniqueId?: string;
}) {
  const id = uniqueId ?? "default";
  const gWing = `tag-wing-${id}`;
  const gBack = `tag-back-${id}`;
  const gKeel = `tag-keel-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gWing} x1="6%" y1="40%" x2="92%" y2="20%">
          <stop offset="0%" stopColor="#54d8f6" />
          <stop offset="55%" stopColor="#3f9bf0" />
          <stop offset="100%" stopColor="#4f6ff0" />
        </linearGradient>
        <linearGradient id={gBack} x1="95%" y1="10%" x2="40%" y2="80%">
          <stop offset="0%" stopColor="#5a6ff0" />
          <stop offset="100%" stopColor="#7d54ec" />
        </linearGradient>
        <linearGradient id={gKeel} x1="40%" y1="20%" x2="55%" y2="100%">
          <stop offset="0%" stopColor="#4774ef" />
          <stop offset="100%" stopColor="#7b50ec" />
        </linearGradient>
      </defs>

      {/* верхнє крило (яскрава cyan-грань) */}
      <path d="M5 28 L57 13 L33 35 Z" fill={`url(#${gWing})`} />
      {/* тонкий згин під переднім краем крила */}
      <path
        d="M5 28 L33 35 L24 38 Z"
        fill={`url(#${gWing})`}
        opacity="0.45"
      />
      {/* задне (праве) крило — violet */}
      <path d="M57 13 L44 43 L33 35 Z" fill={`url(#${gBack})`} />
      {/* кіль / корпус — носом донизу */}
      <path d="M33 35 L44 43 L27 57 Z" fill={`url(#${gKeel})`} />
    </svg>
  );
}
