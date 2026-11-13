import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const NOTICE_VERSION = "2026-11-13-v1";
type RouteContext = { params: Promise<{ projectId: string }> };

function validProjectId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 3 && value.length <= 100 && /^[a-zA-Z0-9_-]+$/.test(value);
}

async function authorizeProject(projectId: string, userId: string, token: string) {
  return callUserData(
    `user_projects?select=id&id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    "GET",
    token,
  );
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour accéder à ce dossier." }, { status: 401 });
    const owner = await authorizeProject(projectId, user.id, token);
    if (!owner.ok || !Array.isArray(owner.data) || owner.data.length !== 1) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: owner.ok ? 404 : 502 });
    }
    const result = await callUserData(
      `project_ai_processing_consents?select=notice_version,consented_at,revoked_at&project_id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET",
      token,
    );
    if (!result.ok) return NextResponse.json({ error: "Impossible de vérifier les préférences de traitement du dossier." }, { status: 502 });
    const row = Array.isArray(result.data) ? result.data[0] : null;
    const active = Boolean(row && typeof row === "object" && "consented_at" in row &&
      typeof row.consented_at === "string" && (!("revoked_at" in row) || row.revoked_at === null));
    return NextResponse.json({ consented: active, noticeVersion: NOTICE_VERSION }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Le service est momentanément indisponible." }, { status: 502 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body) ||
      (body as Record<string, unknown>).consent !== true ||
      (body as Record<string, unknown>).noticeVersion !== NOTICE_VERSION) {
      return NextResponse.json({ error: "Une autorisation explicite et la version actuelle de l'information sont nécessaires." }, { status: 400 });
    }
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour enregistrer votre choix." }, { status: 401 });
    const owner = await authorizeProject(projectId, user.id, token);
    if (!owner.ok || !Array.isArray(owner.data) || owner.data.length !== 1) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: owner.ok ? 404 : 502 });
    }
    const now = new Date().toISOString();
    const result = await callUserData(
      "project_ai_processing_consents?on_conflict=project_id",
      "POST",
      token,
      { project_id: projectId, user_id: user.id, notice_version: NOTICE_VERSION, consented_at: now, revoked_at: null, updated_at: now },
      "resolution=merge-duplicates,return=minimal",
    );
    if (!result.ok) return NextResponse.json({ error: "Votre choix n'a pas pu être enregistré." }, { status: 502 });
    return NextResponse.json({ saved: true, consented: true, noticeVersion: NOTICE_VERSION }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Le service est momentanément indisponible." }, { status: 502 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour modifier votre choix." }, { status: 401 });
    const owner = await authorizeProject(projectId, user.id, token);
    if (!owner.ok || !Array.isArray(owner.data) || owner.data.length !== 1) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: owner.ok ? 404 : 502 });
    }
    const now = new Date().toISOString();
    const result = await callUserData(
      `project_ai_processing_consents?project_id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(user.id)}`,
      "PATCH",
      token,
      { revoked_at: now, updated_at: now },
      "return=minimal",
    );
    if (!result.ok) return NextResponse.json({ error: "Votre choix n'a pas pu être modifié." }, { status: 502 });
    return NextResponse.json({ saved: true, consented: false }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le service est momentanément indisponible." }, { status: 502 });
  }
}
