import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, isSameOrigin } from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
type Context = { params: Promise<{ projectId: string }> };

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function digest(value: unknown): string {
  return createHash("sha256").update(canonical(value)).digest("hex");
}

export async function POST(request: Request, context: Context) {
  if (!isSameOrigin(request)) return jsonError("Origine de la requête refusée.", 403);
  const access = await getAdminAccess();
  if (!access.ok) return jsonError(access.reason === "unauthenticated" ? "Authentification requise." : "Accès administrateur requis.", access.reason === "unauthenticated" ? 401 : 403);

  let input: unknown;
  try { input = await request.json(); } catch { return jsonError("Corps JSON invalide.", 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return jsonError("Plan invalide.", 400);
  const raw = input as Record<string, unknown>;
  if (!raw.payload || typeof raw.payload !== "object" || Array.isArray(raw.payload)) return jsonError("Le contenu du plan doit être un objet JSON.", 400);
  const payload = raw.payload as Record<string, unknown>;
  const scope = payload.includedScope;
  if (!Array.isArray(scope) || scope.length === 0 || scope.length > 100) return jsonError("Le plan doit définir au moins un élément de périmètre.", 400);
  if (canonical(payload).length > 60_000) return jsonError("Le plan dépasse la taille autorisée.", 413);
  if (typeof raw.plannerVersion !== "string" || raw.plannerVersion.trim().length < 1 || raw.plannerVersion.length > 80) {
    return jsonError("Version du planificateur invalide.", 400);
  }

  const { projectId } = await context.params;
  if (!projectId || projectId.length > 160) return jsonError("Projet invalide.", 400);

  const projectResult = await callUserData<Row[]>("user_projects", "GET", {
    select: "id", id: `eq.${projectId}`, limit: "1",
  });
  if (!projectResult.ok) return jsonError("Impossible de vérifier le dossier client.", 503);
  if (!Array.isArray(projectResult.data) || !projectResult.data.length) return jsonError("Dossier introuvable.", 404);

  const previous = await callUserData<Row[]>("project_memory_plan_versions", "GET", {
    select: "version", project_id: `eq.${projectId}`, order: "version.desc", limit: "1",
  });
  if (!previous.ok) return jsonError("Impossible de lire les versions précédentes du plan.", 503);
  const lastVersion = Number(Array.isArray(previous.data) ? previous.data[0]?.version ?? 0 : 0);
  if (!Number.isSafeInteger(lastVersion) || lastVersion < 0) return jsonError("Historique de versions incohérent.", 409);

  const requestId = randomUUID();
  const version = lastVersion + 1;
  const versionedPayload = { ...payload, requestId };
  const payloadDigest = digest(versionedPayload);
  const scopeDigest = digest(scope);
  const saved = await callUserData<Row[]>("project_memory_plan_versions", "POST", { select: "id,version,payload_digest,scope_digest" }, {
    project_id: projectId,
    version,
    source_brief_version: 1,
    planner_version: raw.plannerVersion.trim(),
    payload: versionedPayload,
    payload_digest: payloadDigest,
    scope_digest: scopeDigest,
    created_by: access.user.id,
  });
  if (!saved.ok || !Array.isArray(saved.data) || !saved.data[0]) {
    return jsonError("Le plan n'a pas pu être enregistré. Vérifiez les droits et réessayez.", saved.status >= 500 ? 503 : 409);
  }

  return NextResponse.json({
    created: true,
    planId: saved.data[0].id,
    projectId,
    version,
    requestId,
    payloadDigest,
    scopeDigest,
    approvalRequired: ["client_scope", "admin_review", "execution_authorization"],
  }, { status: 201 });
}
