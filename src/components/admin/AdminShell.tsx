import type { ReactNode } from "react";
import Link from "next/link";
import { RESOURCES } from "@/lib/admin-resources";
import { logoutAction } from "@/lib/admin-actions";

const NAV = [
  { href: "/admin", label: "🏠 Дашборд" },
  ...RESOURCES.map((r) => ({ href: `/admin/${r.key}`, label: r.title })),
  { href: "/admin/media", label: "🖼️ Медіа (завантаження)" },
];

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
      {/* Десктоп: бічне меню (прокручується) */}
      <aside
        className="sticky top-0 hidden h-dvh w-64 shrink-0 overflow-y-auto border-r p-4 lg:block"
        style={{ background: "var(--surface)" }}
      >
        <Link href="/admin" className="h-display block text-lg font-bold">
          CMS<span className="text-gradient">.panel</span>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ color: "var(--text)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b px-5 glass"
        >
          <div className="truncate font-bold">{title}</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted hidden sm:inline">{login}</span>
            <form action={logoutAction}>
              <button className="btn btn-ghost" type="submit">
                Вийти
              </button>
            </form>
          </div>
        </header>

        {/* Мобільна навігація: горизонтальний скрол з усіма розділами */}
        <nav
          className="flex gap-2 overflow-x-auto border-b p-3 lg:hidden"
          style={{ background: "var(--surface)" }}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="btn btn-ghost shrink-0 whitespace-nowrap text-xs"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
