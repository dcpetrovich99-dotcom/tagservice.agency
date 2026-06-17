import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resourceByKey, type Field } from "@/lib/admin-resources";
import { saveResource, deleteResource } from "@/lib/admin-actions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

function dtLocal(v: unknown): string {
  if (!v) return "";
  const d = new Date(v as string);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours(),
  )}:${p(d.getMinutes())}`;
}

function FieldInput({
  f,
  value,
}: {
  f: Field;
  value: unknown;
}) {
  const common = "input";
  if (f.type === "textarea")
    return (
      <textarea
        name={f.name}
        className={`${common} min-h-[120px]`}
        defaultValue={(value as string) ?? ""}
      />
    );
  if (f.type === "boolean")
    return (
      <input
        type="checkbox"
        name={f.name}
        defaultChecked={Boolean(value)}
        className="h-5 w-5"
      />
    );
  if (f.type === "select")
    return (
      <select
        name={f.name}
        className={common}
        defaultValue={(value as string) ?? f.options?.[0]?.value ?? ""}
      >
        {f.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  if (f.type === "datetime")
    return (
      <input
        type="datetime-local"
        name={f.name}
        className={common}
        defaultValue={dtLocal(value)}
      />
    );
  if (f.type === "number")
    return (
      <input
        type="number"
        name={f.name}
        className={common}
        defaultValue={value === null || value === undefined ? 0 : Number(value)}
      />
    );
  // text / image (URL)
  return (
    <input
      type="text"
      name={f.name}
      className={common}
      defaultValue={(value as string) ?? ""}
    />
  );
}

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const admin = await requireAdmin();
  const { resource: key, id } = await params;
  const resource = resourceByKey(key);
  if (!resource) notFound();

  const idField = resource.idField ?? "id";
  const isCreate = id === "new";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];

  let record: Record<string, unknown> | null = null;
  if (!isCreate) {
    try {
      record = await model.findUnique({
        where: { [idField]: decodeURIComponent(id) },
      });
    } catch {
      record = null;
    }
    if (!record) notFound();
  }

  return (
    <AdminShell
      login={admin.login}
      title={`${resource.title} — ${isCreate ? "новий запис" : "редагування"}`}
    >
      <div className="mb-4">
        <Link
          href={`/admin/${key}`}
          className="text-sm font-semibold"
          style={{ color: "var(--brand-strong)" }}
        >
          ← До списку
        </Link>
      </div>

      {/* Перегляд повного запису для read-only (заявки) */}
      {resource.readOnly && record && (
        <div className="card mb-5 p-5 text-sm">
          <dl className="grid gap-2 sm:grid-cols-2">
            {Object.entries(record).map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="whitespace-pre-line">
                  {v instanceof Date
                    ? v.toLocaleString("uk-UA")
                    : String(v ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <form action={saveResource} className="card max-w-2xl p-6">
        <input type="hidden" name="__resource" value={key} />
        <input type="hidden" name="__id" value={isCreate ? "new" : id} />

        <div className="flex flex-col gap-5">
          {resource.fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1 block text-sm font-medium">
                {f.label}
                {f.required && (
                  <span style={{ color: "#e23b3b" }}> *</span>
                )}
              </span>
              <FieldInput f={f} value={record?.[f.name]} />
              {f.help && (
                <span className="text-muted mt-1 block text-xs">{f.help}</span>
              )}
              {f.type === "image" && (
                <span className="text-muted mt-1 block text-xs">
                  Вставте URL зображення або відео (mp4/webm — програється як
                  гіф). Завантажити файл і отримати URL — у розділі «Медіа».
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button type="submit" className="btn btn-primary">
            Зберегти
          </button>
        </div>
      </form>

      {!isCreate && !resource.readOnly && (
        <form action={deleteResource} className="mt-4">
          <input type="hidden" name="__resource" value={key} />
          <input type="hidden" name="__id" value={id} />
          <button
            type="submit"
            className="btn btn-ghost"
            style={{ color: "#e23b3b" }}
          >
            Видалити запис
          </button>
        </form>
      )}
    </AdminShell>
  );
}
