import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { listIntegrationCatalog } from "@/lib/integrations/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) {
    return NextResponse.json(
      { error: access.reason === "unauthenticated" ? "Authentification requise." : "Accès administrateur requis." },
      { status: access.reason === "unauthenticated" ? 401 : 403 },
    );
  }

  return NextResponse.json(
    { integrations: listIntegrationCatalog() },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
