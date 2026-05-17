import type { ReactNode } from "react";

// Кореневий layout-«прохідник». Реальні <html>/<body> рендерять
// сегментні layout-и: [locale]/layout.tsx (публічний сайт) та
// admin/layout.tsx (адмінка). Так локаль коректно потрапляє в lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
