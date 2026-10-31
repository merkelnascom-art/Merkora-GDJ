import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };
type Row = Record<string, unknown>;
const APPROVAL_KINDS = ["client_scope", "admin_review", "execution_authorization"] as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TASKS = [
  { task_key: "prepare_specification", dependencies: [], evidence_required: true },
  { task_key: "generate_application", dependencies: ["prepare_specification"], evidence_required: true },
  { task_key: "run_tests", dependencies: ["generate_application"], evidence_required: true },
  { task_key: "review_security", dependencies: ["run_tests"], evidence_required: true },
  { task_key: "prepare_delivery", dependencies: ["review_security"], evidence_required: true },
] as const;

function jsonError(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function POST(request: Request, context: RouteContext) {
  if (!isSameOrigin(request)) return jsonError("Origine de la requête refusée.", 403);

  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("Corps JSON invalide.", 400); }
  if (!body || typeof body !== "object") return jsonError("Requête invalide.", 400);
  const input = body as Record<string, unknown>;
  if (!Number.isSafeInteger(input.planVersion) || (input.planVersion as number) < 1
    || typeof input.correlationId !== "string" || !UUID_RE.test(input.correlationId)) {
    return jsonError("planVersion ou correlationId invalide.", 400);
  }

  const access = await getAdminAccess();
  if (!access.ok) return jsonError(access.reason === "unauthenticated" ? "Authentification requise." : "Accès administrateur requis.", access.reason === "unauthenticated" ? 401 : 403);
  const token = await getAccessToken();
  if (!token) return jsonError("Session expirée.", 401);

  const { projectId } = await context.params;
  if (!projectId || projectId.length > 160) return jsonError("Projet invalide.", 400);

  const planResult = await callUserData<Row[]>(
    "project_memory_plan_versions", "GET",
    { select: "project_id,version,source_brief_version,payload,payload_digest,scope_digest", project_id: `eq.${projectId}`, version: `eq.${input.planVersion}`, limit: "1" },
  );
  if (!planResult.ok) return jsonError("Impossible de vérifier le plan du projet.", planResult.status >= 500 ? 503 : 403);
  const plan = Array.isArray(planResult.data) ? planResult.data[0] : null;
  if (!plan || typeof plan.payload_digest !== "string" || typeof plan.scope_digest !== "string") {
    return jsonError("Version du plan introuvable ou invalide.", 404);
  }

  const approvalResult = await callUserData<Row[]>(
    "project_memory_approvals", "GET",
    {
      select: "id,approval_kind,decision,plan_digest,scope_digest,request_id,ai_processing_consent",
      project_id: `eq.${projectId}`, plan_version: `eq.${input.planVersion}`,
      plan_digest: `eq.${plan.payload_digest}`, scope_digest: `eq.${plan.scope_digest}`,
      decision: "eq.approved",
    },
  );
  if (!approvalResult.ok) return jsonError("Impossible de vérifier les approbations.", approvalResult.status >= 500 ? 503 : 403);
  const approvals = Array.isArray(approvalResult.data) ? approvalResult.data : [];
  const approvedByKind = new Map<string, Row>();
  for (const approval of approvals) {
    if (typeof approval.approval_kind === "string" && !approvedByKind.has(approval.approval_kind)) {
      approvedByKind.set(approval.approval_kind, approval);
    }
  }
  const missingApprovals = APPROVAL_KINDS.filter((kind) => !approvedByKind.has(kind));
  if (missingApprovals.length) return jsonError("Les trois approbations exactes sont requises avant la mise en file.", 409, { missingApprovals });

  const duplicateResult = await callUserData<Row[]>(
    "project_factory_jobs", "GET",
    { select: "id,status", project_id: `eq.${projectId}`, correlation_id: `eq.${input.correlationId}`, limit: "1" },
  );
  if (!duplicateResult.ok) return jsonError("Impossible de vérifier les demandes déjà enregistrées.", duplicateResult.status >= 500 ? 503 : 403);
  const duplicate = Array.isArray(duplicateResult.data) ? duplicateResult.data[0] : null;
  if (duplicate) return jsonError("Cette demande a déjà été enregistrée.", 409, { jobId: duplicate.id });

  const approvalIds = APPROVAL_KINDS.map((kind) => approvedByKind.get(kind)?.id).filter((id): id is string => typeof id === "string");
  if (approvalIds.length !== APPROVAL_KINDS.length) return jsonError("Les identifiants des approbations sont incomplets.", 409);
  const requestId = APPROVAL_KINDS.map((kind) => approvedByKind.get(kind)?.request_id).find((id) => typeof id === "string") ?? null;

  const jobResult = await callUserData<Row[]>(
    "project_factory_jobs", "POST", { select: "id,status" },
    {
      project_id: projectId,
      plan_version: input.planVersion,
      plan_digest: plan.payload_digest,
      scope_digest: plan.scope_digest,
      status: "queued",
      manifest: { taskKeys: TASKS.map((task) => task.task_key), executionStarted: false },
      requested_by: access.user.id,
      authorized_by: access.user.id,
      approval_ids: approvalIds,
      correlation_id: input.correlationId,
      ...(requestId ? { request_id: requestId } : {}),
    },
  );
  if (!jobResult.ok) {
    return jsonError(jobResult.status === 409 ? "Une demande identique est déjà en cours." : "Impossible de créer la demande de fabrication.", jobResult.status === 409 ? 409 : jobResult.status >= 500 ? 503 : 403);
  }
  const job = Array.isArray(jobResult.data) ? jobResult.data[0] : null;
  if (!job || typeof job.id !== "string") return jsonError("La demande a été acceptée mais son identifiant n'a pas été retourné. Vérification administrateur nécessaire.", 502);

  const taskRows = TASKS.map((task) => ({
    job_id: job.id,
    project_id: projectId,
    task_key: task.task_key,
    state: "not_started",
    dependencies: task.dependencies,
    evidence_required: task.evidence_required,
    external_side_effect: false,
    result_is_known: true,
  }));
  const tasksResult = await callUserData<Row[]>("project_factory_tasks", "POST", { select: "id" }, taskRows);
  if (!tasksResult.ok || !Array.isArray(tasksResult.data) || tasksResult.data.length !== TASKS.length) {
    // Keep a visible, recoverable record instead of deleting the job or hiding a partial failure.
    await callUserData("project_factory_jobs", "PATCH", { id: `eq.${job.id}` }, {
      status: "blocked",
      manifest: { taskKeys: TASKS.map((task) => task.task_key), executionStarted: false, provisioningError: "task_creation_incomplete" },
    });
    return jsonError("La demande existe mais ses tâches n'ont pas toutes été créées. Elle a été bloquée pour reprise administrative.", 502, { jobId: job.id });
  }

  return NextResponse.json({
    created: true,
    jobId: job.id,
    status: "queued",
    taskCount: tasksResult.data.length,
    executionStarted: false,
  });
}
