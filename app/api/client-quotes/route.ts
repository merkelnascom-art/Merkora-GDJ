import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const decisions = new Set(["accepted", "declined", "changes_requested", "negotiation"]);

export async function GET() {
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour consulter vos devis." }, { status: 401 });

    const [versions, responses] = await Promise.all([
      callUserData(
        `client_quote_versions?select=id,quote_id,client_user_id,version_number,snapshot,currency,total_amount,valid_until,published_at,created_at&client_user_id=eq.${encodeURIComponent(user.id)}&published_at=not.is.null&order=created_at.desc&limit=100`,
        "GET", token,
      ),
      callUserData(
        `client_quote_decisions?select=id,quote_version_id,decision,message,created_at&client_user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=200`,
        "GET", token,
      ),
    ]);
    if (!versions.ok || !responses.ok) return NextResponse.json({ error: "Impossible de charger les devis de ce compte." }, { status: 502 });
    return NextResponse.json({
      versions: Array.isArray(versions.data) ? versions.data : [],
      decisions: Array.isArray(responses.data) ? responses.data : [],
    });
  } catch {
    return NextResponse.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const value = body as Record<string, unknown>;
  if (typeof value.versionId !== "string" || !/^[0-9a-f-]{36}$/i.test(value.versionId) ||
      typeof value.decision !== "string" || !decisions.has(value.decision) ||
      typeof value.message !== "string" || value.message.length > 2000) {
    return NextResponse.json({ error: "La décision ou le commentaire est invalide." }, { status: 400 });
  }
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous à votre compte client." }, { status: 401 });

    // Match the UI rule server-side as well: one initial response per quote version.
    // RLS ensures this lookup only returns decisions belonging to the authenticated client.
    const prior = await callUserData(
      `client_quote_decisions?select=id&quote_version_id=eq.${encodeURIComponent(value.versionId)}&client_user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET", token,
    );
    if (!prior.ok) return NextResponse.json({ error: "Impossible de vérifier l’historique de réponse." }, { status: 502 });
    if (Array.isArray(prior.data) && prior.data.length > 0) {
      return NextResponse.json({ error: "Une réponse existe déjà pour cette version. Attendez une nouvelle version du devis." }, { status: 409 });
    }

    const result = await callUserData("client_quote_decisions", "POST", token, {
      quote_version_id: value.versionId,
      client_user_id: user.id,
      decision: value.decision,
      message: value.message.trim(),
    }, "return=representation");
    if (!result.ok) return NextResponse.json({
      error: result.status === 401 ? "Session expirée. Reconnectez-vous." :
        "La décision n’a pas été enregistrée. Le devis peut être expiré ou inaccessible.",
    }, { status: result.status === 401 ? 401 : 502 });
    return NextResponse.json({
      saved: true,
      message: value.decision === "accepted"
        ? "Votre accord sur cette version du devis est enregistré. Il ne confirme ni paiement ni démarrage du projet."
        : "Votre réponse est enregistrée pour cette version du devis.",
    });
  } catch {
    return NextResponse.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });
  }
}
