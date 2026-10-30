import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { applyProjectCodePatch, buildProjectImplementationPrompt, parseProjectCodePatchResponse } from "@/lib/factory/implementation-agent";
import { createProjectArchive } from "@/lib/factory/project-archive";
import { createProjectMemoryDigest } from "@/lib/factory/project-memory-digest";
import { validateGeneratedProjectSource } from "@/lib/factory/validate-generated-source";
import { createVercelProjectSandbox } from "@/lib/factory/vercel-project-sandbox";
import { runProjectBuildInSandbox } from "@/lib/factory/project-sandbox-runner";
import { getAdminAccess } from "@/lib/server/admin-access";
import {
  callUserData, downloadUserStorageObject, getAccessToken, getCurrentUser,
  isSameOrigin, uploadUserStorageObject,
} from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET = "merkora-factory-artifacts";
const REQUIRED_APPROVALS = ["client_scope", "admin_review", "execution_authorization"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function rows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}
function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function safeProjectId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{3,100}$/.test(value);
}
function slug(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}
function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}
function safeLog(value: string): string {
  return value.slice(-12_000);
}
async function patchJob(projectId: string, jobId: string, token: string, body: Record<string, unknown>) {
  return callUserData(
    `project_factory_jobs?id=eq.${encodeURIComponent(jobId)}&project_id=eq.${encodeURIComponent(projectId)}`,
    "PATCH", token, body, "return=representation",
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  let claimed: { projectId: string; jobId: string; token: string; manifest: Record<string, unknown> } | null = null;
  let finalized = false;
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });

  try {
    const store = await cookies();
    const [user, token, admin] = await Promise.all([
      getCurrentUser(store), getAccessToken(store), getAdminAccess(),
    ]);
    if (!user || !token) return NextResponse.json({ error: "Connexion administrateur requise." }, { status: 401 });
    if (!admin.ok) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 403 });

    const body = await request.json().catch(() => null);
    if (!isRecord(body) || body.confirmAiSpend !== true) {
      return NextResponse.json({ error: "Confirmez explicitement l'appel IA et sa consommation éventuelle de crédits." }, { status: 400 });
    }
    if (process.env.MERKORA_AI_ENABLED !== "true") {
      return NextResponse.json({
        error: "Le mode zéro dépense est actif. Aucun appel IA externe n'a été effectué.",
        code: "AI_DISABLED",
      }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const model = process.env.MERKORA_CODEGEN_MODEL?.trim() ?? "";
    const credential = process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim() || "";
    if (!/^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._:-]*$/i.test(model) || !credential) {
      return NextResponse.json({
        error: "Le modèle ou l'authentification AI Gateway n'est pas configuré côté serveur.",
        code: "AI_NOT_CONFIGURED",
      }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const { projectId, jobId } = await context.params;
    if (!safeProjectId(projectId) || !isUuid(jobId)) {
      return NextResponse.json({ error: "Projet ou travail introuvable." }, { status: 404 });
    }

    const jobResult = await callUserData(
      `project_factory_jobs?select=id,status,plan_version,plan_digest,scope_digest,approval_ids,correlation_id,manifest&project_id=eq.${encodeURIComponent(projectId)}&id=eq.${encodeURIComponent(jobId)}&limit=1`,
      "GET", token,
    );
    if (!jobResult.ok) return NextResponse.json({ error: "Lecture du travail impossible." }, { status: 502 });
    const job = rows(jobResult.data)[0];
    if (!job || job.status !== "awaiting_approval" || !Number.isSafeInteger(job.plan_version) ||
      typeof job.plan_digest !== "string" || typeof job.scope_digest !== "string" ||
      !Array.isArray(job.approval_ids) || !isRecord(job.manifest) ||
      job.manifest.fullBusinessLogicImplementationPending !== true ||
      typeof job.manifest.sourceManifestPath !== "string" ||
      typeof job.manifest.sourceDigest !== "string") {
      return NextResponse.json({ error: "Ce travail n'est pas prêt pour une implémentation métier assistée." }, { status: 409 });
    }

    const planResult = await callUserData(
      `project_memory_plan_versions?select=version,payload,payload_digest,scope_digest&project_id=eq.${encodeURIComponent(projectId)}&version=eq.${job.plan_version}&limit=1`,
      "GET", token,
    );
    if (!planResult.ok) return NextResponse.json({ error: "Lecture du plan approuvé impossible." }, { status: 502 });
    const plan = rows(planResult.data)[0];
    if (!plan || !isRecord(plan.payload) || !Array.isArray(plan.payload.includedScope) ||
      createProjectMemoryDigest(plan.payload) !== job.plan_digest ||
      plan.payload_digest !== job.plan_digest ||
      createProjectMemoryDigest(plan.payload.includedScope) !== job.scope_digest ||
      plan.scope_digest !== job.scope_digest) {
      return NextResponse.json({ error: "Le plan ne correspond plus aux empreintes approuvées." }, { status: 409 });
    }

    const approvalResult = await callUserData(
      `project_memory_approvals?select=id,approval_kind,decision,plan_digest,scope_digest&project_id=eq.${encodeURIComponent(projectId)}&plan_version=eq.${job.plan_version}`,
      "GET", token,
    );
    if (!approvalResult.ok) return NextResponse.json({ error: "Vérification des validations impossible." }, { status: 502 });
    const approvalIds = new Set(job.approval_ids.filter((id): id is string => typeof id === "string"));
    const exactApprovals = rows(approvalResult.data).filter((approval) =>
      approval.decision === "approved" && approval.plan_digest === job.plan_digest &&
      approval.scope_digest === job.scope_digest && typeof approval.id === "string" &&
      approvalIds.has(approval.id));
    const missing = REQUIRED_APPROVALS.filter((kind) =>
      !exactApprovals.some((approval) => approval.approval_kind === kind));
    if (missing.length) return NextResponse.json({ error: "Les validations exactes sont incomplètes.", missingApprovals: missing }, { status: 409 });

    const projectResult = await callUserData(
      `user_projects?select=id,title,problem,desired_outcome&id=eq.${encodeURIComponent(projectId)}&limit=1`,
      "GET", token,
    );
    if (!projectResult.ok) return NextResponse.json({ error: "Lecture du projet impossible." }, { status: 502 });
    const project = rows(projectResult.data)[0];
    if (!project || typeof project.title !== "string" ||
      typeof project.problem !== "string" || typeof project.desired_outcome !== "string") {
      return NextResponse.json({ error: "Le dossier client est incomplet." }, { status: 409 });
    }

    const claim = await callUserData(
      `project_factory_jobs?id=eq.${encodeURIComponent(jobId)}&project_id=eq.${encodeURIComponent(projectId)}&status=eq.awaiting_approval`,
      "PATCH", token, { status: "building", updated_at: new Date().toISOString() }, "return=representation",
    );
    if (!claim.ok) return NextResponse.json({ error: "Impossible de réserver l'étape d'implémentation IA." }, { status: 502 });
    if (rows(claim.data).length !== 1) return NextResponse.json({ error: "Une autre exécution a déjà pris ce travail." }, { status: 409 });
    claimed = { projectId, jobId, token, manifest: job.manifest };

    const sourceDownload = await downloadUserStorageObject(BUCKET, job.manifest.sourceManifestPath, token);
    if (!sourceDownload.ok || !sourceDownload.data) throw new Error("SOURCE_MANIFEST_UNAVAILABLE");
    const sourceCandidate = JSON.parse(new TextDecoder().decode(sourceDownload.data)) as unknown;
    if (!isRecord(sourceCandidate) || sourceCandidate.digest !== job.manifest.sourceDigest) {
      throw new Error("SOURCE_MANIFEST_MISMATCH");
    }
    const sourceValidation = validateGeneratedProjectSource(sourceCandidate);
    if (!sourceValidation.ok) throw new Error("SOURCE_MANIFEST_INVALID");

    const modules = plan.payload.includedScope.map((item) => {
      if (!isRecord(item) || typeof item.id !== "string" ||
        typeof item.title !== "string" || typeof item.description !== "string") return null;
      return { id: slug(item.id) || slug(item.title), title: item.title, description: item.description.trim() || item.title };
    });
    if (modules.some((item) => item === null)) throw new Error("INVALID_APPROVED_MODULES");

    const constraints = Array.isArray(plan.payload.confirmedConstraints)
      ? plan.payload.confirmedConstraints.flatMap((item) =>
          isRecord(item) && typeof item.key === "string" && typeof item.value === "string"
            ? [{ key: item.key, value: item.value }] : [])
      : [];
    const prompt = buildProjectImplementationPrompt({
      projectName: project.title,
      projectDescription: `${project.problem} Objectif : ${project.desired_outcome}`.slice(0, 1000),
      planVersion: Number(job.plan_version),
      planDigest: job.plan_digest,
      modules: modules as Array<{ id: string; title: string; description: string }>,
      confirmedConstraints: constraints,
      acceptanceCriteria: strings(plan.payload.acceptanceCriteria),
      openQuestions: strings(plan.payload.openQuestions),
    });

    const aiResponse = await requestAiGatewayCompletion({
      apiKey: credential, model, messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt },
      ], maxTokens: 6000, timeoutMs: 45_000,
    });
    if (!aiResponse.ok) {
      await patchJob(projectId, jobId, token, {
        status: "awaiting_approval",
        manifest: { ...job.manifest, aiImplementationLastAttempt: { status: "provider_error", httpStatus: aiResponse.status, model } },
        updated_at: new Date().toISOString(),
      });
      finalized = true;
      return NextResponse.json({ error: "Le fournisseur IA n'a pas pu traiter la demande. Aucun changement de code n'a été appliqué.", code: "AI_PROVIDER_ERROR" }, { status: 502 });
    }

    const gatewayPayload: unknown = await aiResponse.json().catch(() => null);
    const choices = isRecord(gatewayPayload) && Array.isArray(gatewayPayload.choices) ? gatewayPayload.choices : [];
    const message = choices.length && isRecord(choices[0]) && isRecord(choices[0].message) ? choices[0].message : null;
    const parsed = parseProjectCodePatchResponse(message?.content);
    if (!parsed.ok) {
      await patchJob(projectId, jobId, token, {
        status: "awaiting_approval",
        manifest: { ...job.manifest, aiImplementationLastAttempt: { status: "patch_rejected", reason: parsed.reason, model } },
        updated_at: new Date().toISOString(),
      });
      finalized = true;
      return NextResponse.json({ error: "La réponse IA n'a pas respecté le contrat de code sécurisé. Aucun changement n'a été appliqué.", code: "AI_PATCH_REJECTED", reason: parsed.reason }, { status: 422 });
    }

    if (parsed.patch.openQuestions.length > 0) {
      const blockedManifest = {
        ...job.manifest, implementationStatus: "needs_clarification",
        implementationOpenQuestions: parsed.patch.openQuestions,
        implementationSummary: parsed.patch.summary, aiModel: model,
      };
      await patchJob(projectId, jobId, token, {
        status: "blocked", manifest: blockedManifest, updated_at: new Date().toISOString(),
      });
      await callUserData("project_memory_events", "POST", token, {
        project_id: projectId, event_type: "task_blocked", actor_user_id: user.id,
        actor_role: "admin", correlation_id: job.correlation_id, plan_version: job.plan_version,
        task_key: "generate_application",
        summary: "L'agent d'implémentation a demandé des précisions au lieu d'inventer des règles métier.",
        payload: { questions: parsed.patch.openQuestions, model },
      }, "return=minimal");
      finalized = true;
      return NextResponse.json({ error: "Des précisions métier sont nécessaires avant de poursuivre.", code: "IMPLEMENTATION_NEEDS_CLARIFICATION", questions: parsed.patch.openQuestions }, { status: 409 });
    }

    const applied = applyProjectCodePatch(sourceCandidate as never, parsed.patch);
    const nextSource = applied.source;
    const archive = createProjectArchive(nextSource);
    const sourceManifestPath = `${projectId}/${jobId}/source-${nextSource.digest}.json`;
    const sourcePath = `${projectId}/${jobId}/source-${nextSource.digest}.tar.gz`;
    const manifestUpload = await uploadUserStorageObject(BUCKET, sourceManifestPath, JSON.stringify(nextSource), token);
    const archiveUpload = manifestUpload.ok
      ? await uploadUserStorageObject(BUCKET, sourcePath, archive.bytes, token, archive.contentType)
      : { ok: false, status: 502, data: null };
    if (!manifestUpload.ok || !archiveUpload.ok) throw new Error("IMPLEMENTED_SOURCE_UPLOAD_FAILED");

    const build = await runProjectBuildInSandbox(nextSource, createVercelProjectSandbox);
    const report = {
      schemaVersion: 1, projectId, jobId, planVersion: job.plan_version,
      sourceDigest: nextSource.digest, previousSourceDigest: sourceCandidate.digest,
      patchSummary: applied.summary, aiModel: model,
      result: build.ok ? "passed" : "failed", stage: build.stage,
      reason: build.ok ? null : build.reason, logs: safeLog(build.logs),
      generatedAt: new Date().toISOString(), deployment: "not_started",
      implementationLevel: "business_logic_candidate",
    };
    const reportDigest = createProjectMemoryDigest(report);
    const reportPath = `${projectId}/${jobId}/implementation-report-${reportDigest}.json`;
    const reportUpload = await uploadUserStorageObject(BUCKET, reportPath, JSON.stringify(report), token);
    if (!reportUpload.ok) throw new Error("IMPLEMENTATION_REPORT_UPLOAD_FAILED");

    const taskResult = await callUserData(
      `project_factory_tasks?select=id,task_key&project_id=eq.${encodeURIComponent(projectId)}&job_id=eq.${encodeURIComponent(jobId)}`,
      "GET", token,
    );
    if (!taskResult.ok) throw new Error("FACTORY_TASKS_UNAVAILABLE");
    const taskByKey = new Map(rows(taskResult.data).map((task) => [task.task_key, task]));
    const evidencePayload: Array<Record<string, unknown>> = [
      {
        job_id: jobId, project_id: projectId, task_id: taskByKey.get("generate_application")?.id,
        evidence_type: "artifact", storage_path: `storage://${BUCKET}/${sourcePath}`,
        content_digest: nextSource.digest,
        metadata: { generatorVersion: nextSource.generatorVersion, fileCount: nextSource.files.length, implementationLevel: "business_logic_candidate", patchSummary: applied.summary, sourceManifestPath },
        created_by: user.id,
      },
      {
        job_id: jobId, project_id: projectId, task_id: taskByKey.get("run_quality_checks")?.id,
        evidence_type: "test_result", storage_path: `storage://${BUCKET}/${reportPath}`,
        content_digest: reportDigest, metadata: { result: build.ok ? "passed" : "failed", stage: build.stage },
        created_by: user.id,
      },
      {
        job_id: jobId, project_id: projectId, task_id: taskByKey.get("repair_and_retest")?.id,
        evidence_type: "review", storage_path: `storage://${BUCKET}/${reportPath}`,
        content_digest: reportDigest, metadata: { retestPassed: build.ok, patchSummary: applied.summary },
        created_by: user.id,
      },
    ];
    const evidence = await callUserData("project_factory_evidence", "POST", token, evidencePayload, "return=representation");
    if (!evidence.ok || rows(evidence.data).length !== evidencePayload.length) throw new Error("IMPLEMENTATION_EVIDENCE_FAILED");

    const taskStates = [
      { key: "generate_application", state: "completed" },
      { key: "run_quality_checks", state: build.ok ? "completed" : "failed" },
      { key: "repair_and_retest", state: build.ok ? "completed" : "blocked" },
      { key: "human_delivery_review", state: build.ok ? "ready" : "blocked" },
    ];
    for (const item of taskStates) {
      const task = taskByKey.get(item.key);
      if (!task || typeof task.id !== "string") throw new Error("FACTORY_TASK_MISSING");
      const updated = await callUserData(
        `project_factory_tasks?id=eq.${encodeURIComponent(task.id)}&job_id=eq.${encodeURIComponent(jobId)}`,
        "PATCH", token, { state: item.state, updated_at: new Date().toISOString() }, "return=representation",
      );
      if (!updated.ok) throw new Error("FACTORY_TASK_UPDATE_FAILED");
    }

    const finalStatus = build.ok ? "awaiting_approval" : "failed";
    const finalManifest = {
      ...job.manifest, sourcePath, sourceManifestPath, reportPath,
      sourceDigest: nextSource.digest, reportDigest,
      implementationLevel: "business_logic_candidate",
      implementationStatus: build.ok ? "candidate_ready_for_human_review" : "build_failed",
      implementationSummary: applied.summary, aiModel: model,
      aiImplementationConfirmedBy: user.id,
      fullBusinessLogicImplementationPending: true,
      deployment: "not_started", deliveryRequiresHumanReview: true,
      buildResult: build.ok ? "passed" : "failed",
    };
    const finalJob = await patchJob(projectId, jobId, token, {
      status: finalStatus, manifest: finalManifest, updated_at: new Date().toISOString(),
    });
    if (!finalJob.ok) throw new Error("FINAL_JOB_UPDATE_FAILED");
    finalized = true;

    const event = await callUserData("project_memory_events", "POST", token, {
      project_id: projectId, event_type: build.ok ? "evidence_recorded" : "task_failed",
      actor_user_id: user.id, actor_role: "admin", correlation_id: job.correlation_id,
      plan_version: job.plan_version, task_key: build.ok ? "human_delivery_review" : "run_quality_checks",
      summary: build.ok
        ? "Une version candidate de la logique métier a été générée et compilée ; revue humaine obligatoire."
        : "La compilation de la version candidate a échoué ; les preuves sont conservées pour correction.",
      payload: { sourceDigest: nextSource.digest, reportDigest, aiModel: model, evidenceIds: rows(evidence.data).map((item) => item.id) },
    }, "return=minimal");
    if (!event.ok) return NextResponse.json({ error: "La version candidate est enregistrée, mais l'événement d'audit doit être réconcilié." }, { status: 502 });

    return NextResponse.json({
      status: finalStatus, implementationLevel: "business_logic_candidate",
      buildPassed: build.ok, deployed: false, humanReviewRequired: true,
      fullBusinessLogicImplementationPending: true,
      sourceDigest: nextSource.digest, reportDigest, fileCount: nextSource.files.length,
      message: build.ok
        ? "La logique métier candidate a été générée et compilée. Une revue humaine reste obligatoire avant livraison."
        : "La génération a été compilée avec des erreurs. Le code et le rapport sont conservés pour correction.",
    }, { status: build.ok ? 200 : 422, headers: { "Cache-Control": "no-store" } });
  } catch {
    if (claimed && !finalized) {
      try {
        await patchJob(claimed.projectId, claimed.jobId, claimed.token, {
          status: "failed",
          manifest: { ...claimed.manifest, implementationStatus: "worker_failed" },
          updated_at: new Date().toISOString(),
        });
      } catch { /* preserve the job for administrator reconciliation */ }
    }
    return NextResponse.json({ error: "L'agent d'implémentation n'a pas pu terminer. Aucun déploiement n'a été lancé." }, { status: 502 });
  }
}
