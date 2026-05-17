"use server";

// Next.js Server Actions мають вбудований CSRF-захист (звіряння Origin/Host),
// тож окремий CSRF-токен не потрібен. Усі мутації — лише після requireAdmin().

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "./db";
import {
  createSession,
  destroySession,
  requireAdmin,
  verifyPassword,
  loginThrottled,
  noteLoginFail,
  resetLogin,
} from "./auth";
import { resourceByKey, type Resource } from "./admin-resources";

type State = { error?: string };

export async function loginAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const login = String(formData.get("login") || "").trim();
  const password = String(formData.get("password") || "");

  const h = await headers();
  const ip =
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const key = `${ip}:${login}`;

  if (loginThrottled(key)) {
    return { error: "Забагато спроб. Спробуйте за 15 хвилин." };
  }
  if (!login || !password) {
    return { error: "Введіть логін і пароль." };
  }

  let ok = false;
  let userId = "";
  try {
    const user = await prisma.adminUser.findUnique({ where: { login } });
    if (user && (await verifyPassword(user.passwordHash, password))) {
      ok = true;
      userId = user.id;
    }
  } catch {
    return { error: "База даних недоступна. Перевірте DATABASE_URL." };
  }

  if (!ok) {
    noteLoginFail(key);
    return { error: "Невірний логін або пароль." };
  }

  resetLogin(key);
  await createSession(userId, {
    userAgent: h.get("user-agent") || undefined,
    ip,
  });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

function buildData(resource: Resource, formData: FormData, isCreate: boolean) {
  const data: Record<string, unknown> = {};
  for (const f of resource.fields) {
    if (resource.readOnly && f.name !== "status") continue;
    const raw = formData.get(f.name);

    if (f.type === "boolean") {
      data[f.name] = raw === "on" || raw === "true";
      continue;
    }
    if (f.type === "number") {
      const s = String(raw ?? "").trim();
      data[f.name] = s === "" ? 0 : Number(s);
      continue;
    }
    if (f.type === "datetime") {
      const s = String(raw ?? "").trim();
      if (s) data[f.name] = new Date(s);
      else if (!isCreate) data[f.name] = new Date();
      continue;
    }
    const s = raw == null ? "" : String(raw);
    if (s === "" && !f.required) {
      data[f.name] = null;
    } else {
      data[f.name] = s;
    }
  }
  return data;
}

export async function saveResource(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("__resource") || "");
  const id = String(formData.get("__id") || "");
  const resource = resourceByKey(key);
  if (!resource) redirect("/admin");

  const idField = resource.idField ?? "id";
  const isCreate = id === "new";
  if (resource.readOnly && isCreate) redirect(`/admin/${key}`);

  const data = buildData(resource, formData, isCreate);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];

  if (isCreate) {
    await model.create({ data });
  } else {
    await model.update({ where: { [idField]: id }, data });
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${key}`);
}

export async function deleteResource(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("__resource") || "");
  const id = String(formData.get("__id") || "");
  const resource = resourceByKey(key);
  if (!resource) redirect("/admin");

  const idField = resource.idField ?? "id";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];
  await model.delete({ where: { [idField]: id } });

  revalidatePath("/", "layout");
  redirect(`/admin/${key}`);
}
