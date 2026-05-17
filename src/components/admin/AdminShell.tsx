import type { ReactNode } from "react";
import Link from "next/link";
import { RESOURCES } from "@/lib/admin-resources";
import { logoutAction } from "@/lib/admin-actions";

export default function AdminShell({
  children,
  login,
  title,
}: {
  children: ReactNode;
  login: string;
  title: string;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside
        className="hidden w-64 shrink-0 border-r p-4 lg:block"
        style={{ background: "var(--surface)" }}
      >
        <Link href="/admin" className="h-display block text-lg font-bold">
          CMS<span style={{ color: "var(--brand-strong)" }}>.panel</span>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            🏠 Дашборд
          </Link>
          {RESOURCES.map((r) => (
            <Link
              key={r.key}
              href={`/admin/${r.key}`}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {r.title}
            </Link>
          ))}
          <Link
            href="/admin/media"
            className="rounded-lg px-3 py-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Медіа (завантаження)
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-14 items-center justify-between border-b px-5"
          style={{ background: "var(--surface)" }}
        >
          <div className="font-semibold">{title}</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">{login}</span>
            <form action={logoutAction}>
              <button className="btn btn-ghost" type="submit">
                Вийти
              </button>
            </form>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
