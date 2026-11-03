import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken, getCurrentUser, callUserData, isSameOrigin } from "@/lib/server/supabase-rest";
import { isModuleId, validateModulePayload } from "@/lib/factory/module-data";

export const dynamic = "force-dynamic";

function validProjectId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{3,100}$/.test(value);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string; moduleId: string }> },
) {
  try {
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return jsonError("Connexion requise.", 401);

    const { projectId, moduleId } = await context.params;
    if (!validProjectId(projectId) || !isModuleId(moduleId)) return jsonError("Projet ou module introuvable.", 404);

    const result = await callUserData(
      `project_module_data?select=project_id,module_id,payload,updated_at&project_id=eq.${encodeURIComponent(projectId)}&module_id=eq.${encodeURIComponent(moduleId)}&limit=1`,
      "GET", token,
    );
    if (!result.ok) return jsonError("Lecture des données du module impossible.", result.status === 403 ? 403 : 502);
    const row = Array.isArray(result.data) ? result.data[0] : null;
    return NextResponse.json({
      projectId, moduleId,
      payload: row && typeof row === "object" && "payload" in row ? row.payload : {},
      updatedAt: row && typeof row === "object" && "updated_at" in row ? row.updated_at : null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return jsonError("Service momentanément indisponible.", 503);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ projectId: string; moduleId: string }> },
) {
  if (!isSameOrigin(request)) return jsonError("Requête non autorisée.", 403);
  try {
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return jsonError("Connexion requise.", 401);

    const { projectId, moduleId } = await context.params;
    if (!validProjectId(projectId) || !isModuleId(moduleId)) return jsonError("Projet ou module introuvable.", 404);

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > 70_000) return jsonError("Données trop volumineuses.", 413);
    let body: unknown;
    try { body = await request.json(); } catch { return jsonError("Corps JSON invalide.", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body) ||
      !("payload" in body) || !validateModulePayload(body.payload)) {
      return jsonError("Le contenu du module doit être un objet JSON de 64 Ko maximum.", 400);
    }

    const result = await callUserData(
      "project_module_data?on_conflict=project_id,module_id",
      "POST", token,
      { project_id: projectId, module_id: moduleId, payload: body.payload, updated_by: user.id, updated_at: new Date().toISOString() },
      "resolution=merge-duplicates,return=representation",
    );
    if (!result.ok) return jsonError(
      result.status === 403 ? "Accès refusé à ce projet." : "Enregistrement des données impossible.",
      result.status === 403 ? 403 : result.status === 404 ? 409 : 502,
    );
    const row = Array.isArray(result.data) ? result.data[0] : null;
    if (!row || typeof row !== "object") return jsonError("La sauvegarde n'a pas été confirmée par la base.", 502);
    return NextResponse.json({ saved: true, projectId, moduleId, updatedAt: "updated_at" in row ? row.updated_at : null }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return jsonError("Service momentanément indisponible.", 503);
  }
}
