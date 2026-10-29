import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

// Absolute zero-expense policy: no external AI provider is called in this phase.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  return NextResponse.json({
    error: "Mode zéro dépense : l’analyse par IA externe est désactivée. Vous pouvez continuer avec les pistes de solution locales, sans appel à un fournisseur payant.",
    code: "ZERO_EXPENSE_MODE",
    fallbackAvailable: true,
  }, {
    status: 503,
    headers: { "Cache-Control": "no-store" },
  });
}
