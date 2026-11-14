import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const allowedStatuses = new Set(["to_review","verified","changes_requested","negotiation","accepted","in_progress","delivered","rejected"]);

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) return NextResponse.json({ error: "Accès administrateur requis." }, { status: access.reason === "unauthenticated" ? 401 : 403 });
  try {
    const store = await cookies();
    const token = await getAccessToken(store);
    if (!token) return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
    const result = await callUserData("client_requests?select=id,user_id,user_email,project_id,project_title,payload,admin_status,admin_note,created_at,updated_at&order=created_at.desc&limit=100", "GET", token);
    if (!result.ok) return NextResponse.json({ error: result.status === 404 ? "La boîte de réception n’est pas encore installée." : "Impossible de charger les demandes centrales. Vérifiez la migration et les règles d’accès." }, { status: 502 });
    return NextResponse.json({ requests: Array.isArray(result.data) ? result.data : [] });
  } catch {
    return NextResponse.json({ error: "La boîte de réception est momentanément indisponible." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  const access = await getAdminAccess();
  if (!access.ok) return NextResponse.json({ error: "Accès administrateur requis." }, { status: access.reason === "unauthenticated" ? 401 : 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const value = body as Record<string, unknown>;
  if (typeof value.id !== "string" || !/^[0-9a-f-]{36}$/i.test(value.id) ||
      typeof value.status !== "string" || !allowedStatuses.has(value.status) ||
      typeof value.note !== "string" || value.note.length > 1200) {
    return NextResponse.json({ error: "Statut ou note invalide." }, { status: 400 });
  }
  try {
    const store = await cookies();
    const token = await getAccessToken(store);
    if (!token) return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
    if (value.status === "in_progress") {
      const launch = await callUserData(`client_project_launches?select=id&request_id=eq.${encodeURIComponent(value.id)}&limit=1`, "GET", token);
      if (!launch.ok) return NextResponse.json({ error: "Impossible de vérifier le lancement officiel du projet." }, { status: 502 });
      if (!Array.isArray(launch.data) || launch.data.length === 0) {
        return NextResponse.json({ error: "Utilisez le bouton « Lancer le projet » après vérification du paiement pour démarrer officiellement ce dossier." }, { status: 409 });
      }
    }
    const result = await callUserData(`client_requests?id=eq.${encodeURIComponent(value.id)}`, "PATCH", token, {
      admin_status: value.status,
      admin_note: value.note,
      updated_at: new Date().toISOString(),
    }, "return=representation");
    if (!result.ok) return NextResponse.json({ error: "La mise à jour du suivi a échoué. Vérifiez la migration et les règles d’accès." }, { status: 502 });
    return NextResponse.json({ updated: Array.isArray(result.data) && result.data.length > 0 });
  } catch {
    return NextResponse.json({ error: "La boîte de réception centrale n’est pas configurée." }, { status: 503 });
  }
}
