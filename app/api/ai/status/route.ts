import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = process.env.MERKORA_AI_ENABLED === "true";
  const authenticated = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
  const model = process.env.MERKORA_AI_MODEL || "deepseek/deepseek-v4.1-flash";
  return NextResponse.json({
    enabled: enabled && authenticated,
    activationRequired: !enabled,
    authenticationConfigured: authenticated,
    model: enabled && authenticated ? model : null,
    message: !enabled
      ? "L’intégration IA est prête dans le code, mais reste désactivée pour éviter tout appel facturable sans activation explicite."
      : !authenticated
        ? "L’IA est activée dans la configuration, mais aucune authentification AI Gateway n’est disponible."
        : "Le moteur IA est configuré. Chaque analyse peut entraîner un coût selon le modèle et son usage.",
  }, { headers: { "Cache-Control": "no-store" } });
}
