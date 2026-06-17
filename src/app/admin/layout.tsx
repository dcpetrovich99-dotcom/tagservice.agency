import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, Unbounded, Montserrat } from "next/font/google";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Адмінка",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${unbounded.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
