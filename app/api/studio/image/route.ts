import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

// MerKora's zero-expense mode: never call an external image provider from this route.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  return NextResponse.json({
    error: "La génération d’images IA externe est désactivée pour respecter le mode zéro dépense. Utilisez la maquette interactive gratuite.",
    code: "ZERO_EXPENSE_MODE",
  }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
