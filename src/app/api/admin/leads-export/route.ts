import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function cell(v: unknown): string {
  const s =
    v instanceof Date ? v.toISOString() : v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let leads: Record<string, unknown>[] = [];
  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    leads = [];
  }

  const cols = [
    "createdAt",
    "status",
    "niche",
    "projectDesc",
    "projectLinks",
    "dailyBudget",
    "hasActiveTraffic",
    "contact",
    "locale",
    "sourcePage",
  ];
  const header = cols.join(",");
  const body = leads
    .map((l) => cols.map((c) => cell(l[c])).join(","))
    .join("\n");
  const csv = "﻿" + header + "\n" + body; // BOM для Excel

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}
