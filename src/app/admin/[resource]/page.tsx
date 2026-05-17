import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resourceByKey } from "@/lib/admin-resources";
import { deleteResource } from "@/lib/admin-actions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

function fmt(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (v instanceof Date) return v.toLocaleString("uk-UA");
  if (typeof v === "boolean") return v ? "✓" : "✗";
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const admin = await requireAdmin();
  const { resource: key } = await params;
  const resource = resourceByKey(key);
  if (!resource) notFound();

  const idField = resource.idField ?? "id";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];

  let rows: Record<string, unknown>[] = [];
  let dbError = false;
  try {
    const orderBy =
      resource.model === "lead"
        ? { createdAt: "desc" as const }
        : resource.fields.some((f) => f.name === "order")
          ? { order: "asc" as const }
          : undefined;
    rows = await model.findMany(orderBy ? { orderBy } : {});
  } catch {
    dbError = true;
  }

  return (
    <AdminShell login={admin.login} title={resource.title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="h-display text-xl">{resource.title}</h1>
        <div className="flex gap-2">
          {resource.key === "leads" && (
            <a className="btn btn-ghost" href="/api/admin/leads-export">
              Експорт CSV
            </a>
          )}
          {!resource.readOnly && (
            <Link href={`/admin/${key}/new`} className="btn btn-primary">
              + Додати
            </Link>
          )}
        </div>
      </div>

      {dbError && (
        <p className="text-muted">
          БД недоступна. Перевірте DATABASE_URL і виконайте міграцію (README).
        </p>
      )}

      {!dbError && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                {resource.listColumns.map((c) => (
                  <th key={c.name} className="p-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const rid = String(row[idField]);
                return (
                  <tr key={rid} className="border-b">
                    {resource.listColumns.map((c) => (
                      <td key={c.name} className="p-3">
                        {fmt(row[c.name])}
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/${key}/${encodeURIComponent(rid)}`}
                          className="btn btn-ghost"
                        >
                          {resource.readOnly ? "Перегляд" : "Редагувати"}
                        </Link>
                        <form action={deleteResource}>
                          <input type="hidden" name="__resource" value={key} />
                          <input type="hidden" name="__id" value={rid} />
                          <button
                            className="btn btn-ghost"
                            type="submit"
                            style={{ color: "#e23b3b" }}
                          >
                            Видалити
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    className="text-muted p-4"
                    colSpan={resource.listColumns.length + 1}
                  >
                    Поки порожньо. Натисніть «Додати».
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
