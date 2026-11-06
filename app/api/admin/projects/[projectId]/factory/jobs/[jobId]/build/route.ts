import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// The former in-process Sandbox builder is intentionally disabled.
// All new builds must be dispatched through the authenticated GitHub Actions worker.
export async function POST() {
  return NextResponse.json({
    error: "Cette ancienne route de construction directe est désactivée. Utilisez le déclenchement contrôlé GitHub Actions depuis le tableau administrateur.",
    code: "LEGACY_FACTORY_BUILD_DISABLED",
  }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
