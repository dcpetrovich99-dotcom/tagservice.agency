import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — маркетингове агентство`,
    short_name: SITE_NAME,
    description:
      "Трафік, реклама та лідогенерація під ключ. Google Ads, Meta, Telegram Ads, SMM, CRM.",
    start_url: "/",
    display: "standalone",
    background_color: "#050b18",
    theme_color: "#050b18",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
