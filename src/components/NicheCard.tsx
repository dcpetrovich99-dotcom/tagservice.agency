import SmartMedia from "./SmartMedia";

type Props = {
  name: string;
  description: string;
  imageUrl?: string | null;
  tgLabel: string;
  tgHref: string;
};

// Картка ніші: картинка (опційно) + назва + детальний опис + кнопка в Telegram.
export default function NicheCard({
  name,
  description,
  imageUrl,
  tgLabel,
  tgHref,
}: Props) {
  return (
    <div className="card flex h-full flex-col overflow-hidden p-0">
      {imageUrl && (
        <div
          className="relative aspect-[16/10] w-full"
          style={{ background: "var(--surface-2)" }}
        >
          <SmartMedia
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width:1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="h-display text-lg">{name}</h3>
        {description && (
          <p className="text-muted mt-3 flex-1 whitespace-pre-line text-sm leading-6">
            {description}
          </p>
        )}
        <a
          href={tgHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "var(--brand-strong)" }}
        >
          {tgLabel} →
        </a>
      </div>
    </div>
  );
}
