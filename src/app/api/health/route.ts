import { NextResponse } from "next/server";

// Легкий healthcheck для Railway: жодних звернень до БД,
// миттєва 200 — чіткий сигнал «застосунок піднявся».
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    { status: "ok", ts: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export function HEAD() {
  return new Response(null, { status: 200 });
}
