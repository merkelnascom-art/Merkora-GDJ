import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  const user = await getCurrentUser(await cookies());
  const enabled = configured && Boolean(user);

  return NextResponse.json({
    enabled,
    activationRequired: !configured,
    message: !configured
      ? "Le moteur d'analyse approfondie n'est pas configuré dans cet environnement. La pré-analyse locale reste disponible."
      : !user
        ? "Connectez-vous pour accéder aux analyses approfondies. Vos dossiers locaux restent disponibles."
        : "Le moteur d'analyse approfondie est prêt pour les dossiers dont le traitement assisté a été autorisé.",
  }, { headers: { "Cache-Control": "no-store" } });
}
