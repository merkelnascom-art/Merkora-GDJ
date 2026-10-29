import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    enabled: false,
    activationRequired: true,
    externalProviderDisabled: true,
    model: null,
    message: "Mode zéro dépense activé : aucun fournisseur IA externe ne sera appelé. Les recommandations locales restent disponibles.",
  }, { headers: { "Cache-Control": "no-store" } });
}
