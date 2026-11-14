import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
type Context = { params: Promise<{ projectId: string; version: string }> };
const KINDS = new Set(["client_scope", "admin_review", "execution_authorization"]);

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request, context: Context) {
  if (!isSameOrigin(request)) return error("Origine de la requête refusée.", 403);
  let input: unknown;
  try { input = await request.json(); } catch { return error("Corps JSON invalide.", 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return error("Approbation invalide.", 400);

  const body = input as Record<string, unknown>;
  if (typeof body.approvalKind !== "string" || !KINDS.has(body.approvalKind)) return error("Type d'approbation invalide.", 400);
  if (typeof body.comment !== "string" || body.comment.length > 2000) return error("Commentaire invalide.", 400);
  if (typeof body.aiProcessingConsent !== "boolean") return error("Le consentement au traitement IA doit être explicite.", 400);

  const { projectId, version: rawVersion } = await context.params;
  const version = Number(rawVersion);
  if (!projectId || projectId.length > 160 || !Number.isSafeInteger(version) || version < 1) return error("Projet ou version invalide.", 400);

  const user = await getCurrentUser();
  if (!user) return error("Authentification requise.", 401);
  const admin = await getAdminAccess();
  const isAdmin = admin.ok;
  const kind = body.approvalKind;
  if (kind !== "client_scope" && !isAdmin) return error("Cette validation est réservée à l'administrateur.", 403);

  const planResult = await callUserData<Row[]>("project_memory_plan_versions", "GET", {
    select: "version,payload_digest,scope_digest,payload",
    project_id: `eq.${projectId}`, version: `eq.${version}`, limit: "1",
  });
  if (!planResult.ok) return error("Impossible de vérifier le plan.", 503);
  const plan = Array.isArray(planResult.data) ? planResult.data[0] : null;
  if (!plan || typeof plan.payload_digest !== "string" || typeof plan.scope_digest !== "string") return error("Plan introuvable.", 404);

  if (!isAdmin) {
    const projectResult = await callUserData<Row[]>("user_projects", "GET", {
      select: "id", id: `eq.${projectId}`, limit: "1",
    });
    if (!projectResult.ok || !Array.isArray(projectResult.data) || !projectResult.data.length) return error("Vous n'êtes pas autorisé à valider ce projet.", 403);
  }

  const payload = plan.payload && typeof plan.payload === "object" ? plan.payload as Record<string, unknown> : {};
  const requestId = payload.requestId;
  if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return error("Référence de demande absente du plan.", 409);
  }

  const existing = await callUserData<Row[]>("project_memory_approvals", "GET", {
    select: "id,decision", project_id: `eq.${projectId}`, plan_version: `eq.${version}`,
    approval_kind: `eq.${kind}`, request_id: `eq.${requestId}`, limit: "1",
  });
  if (!existing.ok) return error("Impossible de vérifier les validations existantes.", 503);
  if (Array.isArray(existing.data) && existing.data.length) return error("Cette validation a déjà été enregistrée.", 409);

  const inserted = await callUserData<Row[]>("project_memory_approvals", "POST", { select: "id,approval_kind,decision,created_at" }, {
    project_id: projectId,
    plan_version: version,
    approval_kind: kind,
    decision: "approved",
    plan_digest: plan.payload_digest,
    scope_digest: plan.scope_digest,
    actor_user_id: user.id,
    actor_role: isAdmin ? "admin" : "client",
    comment: body.comment.trim(),
    request_id: requestId,
    ai_processing_consent: body.aiProcessingConsent,
  });
  if (!inserted.ok || !Array.isArray(inserted.data) || !inserted.data[0]) {
    return error("La validation n'a pas pu être enregistrée.", inserted.status >= 500 ? 503 : 409);
  }
  return NextResponse.json({ approved: true, approval: inserted.data[0] }, { status: 201 });
}
