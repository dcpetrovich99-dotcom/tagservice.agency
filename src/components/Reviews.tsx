import Image from "next/image";

export default function Reviews({
  items,
}: {
  items: { id: string; imageUrl: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div
      className="flex snap-x gap-4 overflow-x-auto pb-4"
      style={{ scrollbarWidth: "thin" }}
    >
      {items.map((r) => (
        <div
          key={r.id}
          className="card relative shrink-0 snap-start overflow-hidden"
          style={{ width: 260 }}
        >
          <Image
            src={r.imageUrl}
            alt="Відгук клієнта"
            width={260}
            height={460}
            className="h-auto w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
