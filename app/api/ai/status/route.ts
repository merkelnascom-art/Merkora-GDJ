import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  const user = await getCurrentUser(await cookies());
  const enabled = configured && Boolean(user);
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

  return NextResponse.json({
    enabled,
    activationRequired: !configured,
    externalProviderDisabled: !enabled,
    model: enabled ? model : null,
    message: !configured
      ? "Gemini n'est pas configuré dans cet environnement. L'analyse locale gratuite reste disponible."
      : !user
        ? "Connectez-vous pour utiliser Gemini. Aucune analyse externe ne sera lancée sans session."
        : "Gemini est prêt. L'envoi des informations du dossier à Google nécessite votre accord explicite.",
  }, { headers: { "Cache-Control": "no-store" } });
}
