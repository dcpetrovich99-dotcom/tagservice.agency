import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Montserrat, Noto_Sans } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const noto = Noto_Sans({ subsets: ["latin", "cyrillic"], variable: "--font-noto" });
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
      className={`${inter.variable} ${noto.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
