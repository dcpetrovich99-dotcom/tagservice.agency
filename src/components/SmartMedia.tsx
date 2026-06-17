import Image from "next/image";

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

/** true, якщо URL вказує на відео-файл (рендеримо як «гіф»). */
export function isVideoUrl(url?: string | null): boolean {
  return !!url && VIDEO_RE.test(url);
}

type Props = {
  src: string;
  alt?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

/**
 * Уніфікований медіа-елемент. Для зображень — next/image.
 * Для відео — інлайн <video> у режимі «гіф»: autoplay + loop + muted +
 * playsInline, без контролів (просто крутиться, без кнопки play).
 */
export default function SmartMedia({
  src,
  alt = "",
  fill,
  sizes,
  width,
  height,
  priority,
  className,
}: Props) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
        className={className}
        style={
          fill
            ? {
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
              }
            : { width: width ? `${width}px` : "100%", height: "auto" }
        }
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      className={className}
    />
  );
}
