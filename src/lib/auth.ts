import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";
import { prisma } from "./db";
import { env } from "./env";

const COOKIE = "crm-auth";
const SESSION_DAYS = 7;

export async function hashPassword(pw: string): Promise<string> {
  return argonHash(pw); // argon2id за замовчуванням
}

export async function verifyPassword(
  hashStr: string,
  pw: string,
): Promise<boolean> {
  try {
    return await argonVerify(hashStr, pw);
  } catch {
    return false;
  }
}

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

/**
 * Створює сесію та ставить cookie `crm-auth`.
 * У cookie — ВИПАДКОВИЙ непрогнозований токен (не userId, не дані).
 * У БД зберігається лише його SHA-256 → навіть дамп БД не дає доступу,
 * HttpOnly не дає вкрасти його через XSS/JS, SameSite=Strict — через CSRF.
 */
export async function createSession(
  adminUserId: string,
  meta?: { userAgent?: string; ip?: string },
) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);

  await prisma.session.create({
    data: {
      adminUserId,
      tokenHash: sha256(token),
      userAgent: meta?.userAgent?.slice(0, 300),
      ip: meta?.ip?.slice(0, 64),
      expiresAt,
    },
  });

  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    // path "/" — щоб cookie слалось і на /admin/*, і на /api/admin/* (інакше
    // API-роути аплоаду/експорту не бачать сесію → 401 unauthorized).
    path: "/",
    expires: expiresAt,
  });
}

export type CurrentAdmin = {
  id: string;
  login: string;
  role: string;
};

/** Валідовує cookie проти БД. null → не автентифікований. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: sha256(token) },
      include: { adminUser: true },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return {
      id: session.adminUser.id,
      login: session.adminUser.login,
      role: session.adminUser.role,
    };
  } catch {
    return null;
  }
}

/** Серверний гард: редіректить на /admin/login, якщо токен невалідний. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function destroySession() {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (token) {
    try {
      await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
    } catch {
      /* ignore */
    }
  }
  c.set(COOKIE, "", { path: "/", maxAge: 0 });
}

// ── Rate-limit спроб входу (in-memory, на інстанс) ──────────────────
const attempts = new Map<string, { n: number; ts: number }>();
const LOGIN_WINDOW = 15 * 60 * 1000;
const LOGIN_MAX = 8;

export function loginThrottled(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.ts > LOGIN_WINDOW) {
    attempts.set(key, { n: 0, ts: now });
    return false;
  }
  return rec.n >= LOGIN_MAX;
}

export function noteLoginFail(key: string) {
  const rec = attempts.get(key) ?? { n: 0, ts: Date.now() };
  rec.n += 1;
  attempts.set(key, rec);
}

export function resetLogin(key: string) {
  attempts.delete(key);
}
