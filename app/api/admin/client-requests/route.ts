import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const allowedStatuses = new Set(["to_review","verified","changes_requested","negotiation","accepted","in_progress","delivered","rejected"]);

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("ADMIN_INBOX_NOT_CONFIGURED");
  return { url, key };
}

async function adminRequest(path: string, method: "GET" | "PATCH", body?: unknown) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(method === "PATCH" ? { Prefer: "return=representation" } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) return NextResponse.json({ error: "Accès administrateur requis." }, { status: access.reason === "unauthenticated" ? 401 : 403 });
  try {
    const { response, data } = await adminRequest("client_requests?select=id,user_id,user_email,project_id,project_title,payload,admin_status,admin_note,created_at,updated_at&order=created_at.desc&limit=100", "GET");
    if (!response.ok) return NextResponse.json({ error: "Impossible de charger les demandes centrales." }, { status: 502 });
    return NextResponse.json({ requests: Array.isArray(data) ? data : [] });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error && error.message === "ADMIN_INBOX_NOT_CONFIGURED"
        ? "Configuration requise : la clé serveur Supabase n’est pas configurée pour l’aperçu. Aucun secret ne doit être ajouté au code."
        : "La boîte de réception est momentanément indisponible.",
    }, { status: 503 });
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
    const { response, data } = await adminRequest(`client_requests?id=eq.${encodeURIComponent(value.id)}`, "PATCH", {
      admin_status: value.status,
      admin_note: value.note,
      updated_at: new Date().toISOString(),
    });
    if (!response.ok) return NextResponse.json({ error: "La mise à jour du suivi a échoué." }, { status: 502 });
    return NextResponse.json({ updated: Array.isArray(data) && data.length > 0 });
  } catch {
    return NextResponse.json({ error: "La boîte de réception centrale n’est pas configurée." }, { status: 503 });
  }
}
