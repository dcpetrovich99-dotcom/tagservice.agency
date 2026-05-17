import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const host = env.appHost.includes("localhost")
    ? "http://localhost:3000"
    : `https://${env.appHost}`;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${host}/sitemap.xml`,
  };
}
