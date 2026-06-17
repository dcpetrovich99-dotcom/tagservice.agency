import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const MAX_IMAGE = 6 * 1024 * 1024; // 6 MB
const MAX_VIDEO = 50 * 1024 * 1024; // 50 MB (інлайн-відео як «гіф»)

const ALLOWED_IMAGE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const ALLOWED_VIDEO: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }

  const isVideo = file.type in ALLOWED_VIDEO;
  const ext = isVideo ? ALLOWED_VIDEO[file.type] : ALLOWED_IMAGE[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "only jpg/png/webp/gif or mp4/webm/mov" },
      { status: 415 },
    );
  }

  const max = isVideo ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > max) {
    return NextResponse.json(
      { error: isVideo ? "too large (max 50MB)" : "too large (max 6MB)" },
      { status: 413 },
    );
  }

  const dir = path.resolve(env.uploadDir);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);

  // Публічний URL виводимо з UPLOAD_DIR: локально ./public/uploads → /uploads,
  // на проді ./public/media (Railway Volume) → /media. Так волюм для аплоадів
  // не перекриває закомічену public/uploads/source/.
  const rel = path
    .relative(path.resolve("public"), dir)
    .split(path.sep)
    .join("/");
  const base = rel && !rel.startsWith("..") ? `/${rel}` : "/uploads";
  const url = `${base}/${name}`;
  try {
    await prisma.mediaAsset.create({
      data: {
        url,
        type: isVideo ? "video" : "image",
        alt: file.name.slice(0, 120),
      },
    });
  } catch {
    /* запис у БД best-effort */
  }

  return NextResponse.json({ ok: true, url, type: isVideo ? "video" : "image" });
}
