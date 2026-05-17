import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

const intlMiddleware = createMiddleware(routing);

const localePrefix = /^\/(uk|ru)(\/|$)/;

// Мова: cookie → cf-ipcountry (Cloudflare) → ru. UA → uk, інше → ru.
function detectLocale(req: NextRequest): "uk" | "ru" {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie === "uk" || cookie === "ru") return cookie;
  const country = (req.headers.get("cf-ipcountry") || "").toUpperCase();
  return country === "UA" ? "uk" : "ru";
}

// Анти-клон: дозволені лише канонічні хости (на проді).
function hostAllowed(host: string): boolean {
  const h = host.toLowerCase();
  if (!h) return true;
  if (h.startsWith("localhost") || h.startsWith("127.0.0.1")) return true;
  if (h.endsWith(".railway.app")) return true; // healthcheck / прев'ю Railway
  return env.allowedHosts.includes(h);
}

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const host = req.headers.get("host") || "";

  // 1. Канонічний хост (тільки prod, щоб не зламати локальну розробку)
  if (env.isProd && !hostAllowed(host)) {
    const url = nextUrl.clone();
    url.host = env.appHost;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // 2. Адмінка — окрема зона без локалі. Повна перевірка токена — у layout.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname !== "/admin/login" && !req.cookies.get("crm-auth")) {
      const url = nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. API — без локалі
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 4. Гео-редірект для шляхів без префікса локалі
  if (!localePrefix.test(pathname)) {
    const locale = detectLocale(req);
    const url = nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.redirect(url);
    res.cookies.set("locale", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  // 5. Локале-префіксні маршрути — next-intl
  const res = intlMiddleware(req);
  const current = pathname.split("/")[1];
  if (current === "uk" || current === "ru") {
    res.cookies.set("locale", current, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[^/]+$).*)",
  ],
};
