import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RESOURCES } from "@/lib/admin-resources";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

async function count(model: string): Promise<number | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (prisma as any)[model].count();
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const counts = await Promise.all(
    RESOURCES.map(async (r) => ({ r, n: await count(r.model) })),
  );

  return (
    <AdminShell login={admin.login} title="Дашборд">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map(({ r, n }) => (
          <Link key={r.key} href={`/admin/${r.key}`} className="card p-5">
            <div className="text-muted text-sm">{r.title}</div>
            <div className="num-accent mt-2 text-3xl">
              {n === null ? "—" : n}
            </div>
          </Link>
        ))}
      </div>
      <p className="text-muted mt-6 text-sm">
        Якщо скрізь «—» — БД ще не підключена/не мігрована. Див. README →
        «Перша міграція».
      </p>
    </AdminShell>
  );
}
