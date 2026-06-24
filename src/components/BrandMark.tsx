import Image from "next/image";

// Реальне лого власника — паперовий літачок, вирізаний з фірмового лого
// (cyan → blue → violet, прозорий фон). Спільна мітка для Header / Footer.
// API лишився сумісним (size / className / uniqueId), щоб не чіпати виклики.

export default function BrandMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
  uniqueId?: string;
}) {
  return (
    <Image
      src="/brand-mark.png"
      width={size}
      height={size}
      alt="TAG Service"
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      draggable={false}
    />
  );
}
