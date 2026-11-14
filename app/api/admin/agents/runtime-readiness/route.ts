import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { inspectConfiguredProviderRuntime } from "@/lib/server/orchestration/provider-runtime-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminAccess();
  if (!admin.ok) {
    return NextResponse.json(
      { error: "Accès administrateur refusé." },
      { status: admin.reason === "unauthenticated" ? 401 : 403 },
      );
  }

  const readiness = inspectConfiguredProviderRuntime(process.env);
  return NextResponse.json(readiness, {
    headers: { "Cache-Control": "no-store" },
  });
}
