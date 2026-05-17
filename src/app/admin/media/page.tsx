import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import MediaUploader from "@/components/admin/MediaUploader";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const admin = await requireAdmin();

  let assets: { id: string; url: string }[] = [];
  try {
    assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  } catch {
    assets = [];
  }

  return (
    <AdminShell login={admin.login} title="Медіа">
      <MediaUploader />

      <h2 className="h-display mt-8 text-lg">Завантажені файли</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {assets.map((a) => (
          <div key={a.id} className="card overflow-hidden">
            <div
              className="relative aspect-square"
              style={{ background: "var(--surface-2)" }}
            >
              <Image
                src={a.url}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <input
              className="input rounded-none border-0 text-xs"
              readOnly
              value={a.url}
            />
          </div>
        ))}
        {assets.length === 0 && (
          <p className="text-muted col-span-full text-sm">Поки порожньо.</p>
        )}
      </div>
    </AdminShell>
  );
}
