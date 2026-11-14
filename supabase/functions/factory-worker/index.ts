import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.9.6";
import {
  isPlannedSpecialistWorkflowManifest,
  isTrustedGitHubWorkflowClaims,
  readSpecialistWorkflowManifest,
} from "./identity.ts";

const AUDIENCE = "merkora-gdj-factory";
const ISSUER = "https://token.actions.githubusercontent.com";
const BUCKET = "merkora-factory-artifacts";
const JWKS = createRemoteJWKSet(new URL("https://token.actions.githubusercontent.com/.well-known/jwks"));

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("non_finite_number");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
  }
  throw new TypeError("unsupported_json_value");
}
async function sha256(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function isProjectId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{3,100}$/.test(value);
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function rows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}
function safeLog(value: unknown): string {
  return typeof value === "string" ? value.slice(-12_000) : "";
}
function validGeneratedSource(value: unknown): value is {
  generatorVersion: string; digest: string; moduleIds: string[];
  files: Array<{ path: string; content: string }>;
} {
  if (!isRecord(value) || typeof value.generatorVersion !== "string" ||
      typeof value.digest !== "string" || !/^[a-f0-9]{64}$/.test(value.digest) ||
      !Array.isArray(value.moduleIds) || !Array.isArray(value.files) ||
      value.files.length < 6 || value.files.length > 200) return false;
  const seen = new Set<string>();
  let totalBytes = 0;
  for (const file of value.files) {
    if (!isRecord(file) || typeof file.path !== "string" || typeof file.content !== "string") return false;
    const path = file.path;
    if (!path || path.length > 240 || path.startsWith("/") || path.includes("\\") ||
        !/^[a-zA-Z0-9._/-]+$/.test(path) ||
        path.split("/").some((part) => !part || part === "." || part === "..") ||
        seen.has(path)) return false;
    seen.add(path);
    totalBytes += new TextEncoder().encode(file.content).byteLength;
    if (totalBytes > 1_000_000) return false;
  }
  return ["package.json", "tsconfig.json", "README.md", "src/app/layout.tsx", "src/app/globals.css", "src/app/page.tsx"]
    .every((path) => seen.has(path));
}
function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
async function verifyGitHubIdentity(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([A-Za-z0-9._~-]+)$/.exec(authorization);
  if (!match) throw new Error("missing_worker_identity");
  const { payload } = await jwtVerify(match[1], JWKS, {
    issuer: ISSUER, audience: AUDIENCE, algorithms: ["RS256"],
  });
  const p = payload as Record<string, unknown>;
  if (!isTrustedGitHubWorkflowClaims(p)) throw new Error("worker_identity_not_authorized");
  return { runId: String(p.run_id), runAttempt: String(p.run_attempt), sha: String(p.sha ?? "") };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let identity: { runId: string; runAttempt: string; sha: string };
  try { identity = await verifyGitHubIdentity(request); }
  catch { return json({ error: "invalid_worker_identity" }, 401); }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!isRecord(parsed)) return json({ error: "invalid_payload" }, 400);
    body = parsed;
  } catch { return json({ error: "invalid_json" }, 400); }

  const action = body.action;
  if (!["verify", "claim", "complete", "fail"].includes(String(action)) ||
      !isProjectId(body.projectId) || !isUuid(body.jobId)) {
    return json({ error: "unsupported_action_or_invalid_identifiers" }, 400);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "worker_backend_not_configured" }, 503);
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: job, error: jobError } = await admin
    .from("project_factory_jobs")
    .select("id,project_id,status,plan_version,plan_digest,scope_digest,approval_ids,correlation_id,manifest,requested_by,authorized_by")
    .eq("id", body.jobId).eq("project_id", body.projectId).maybeSingle();
  if (jobError || !job) return json({ error: "factory_job_not_found" }, 404);

  // A claimed run can report a safe failure without leaving the job indefinitely in building.
  if (action === "fail") {
    if (job.status !== "building" || !isRecord(job.manifest) ||
        job.manifest.workerRunId !== identity.runId ||
        job.manifest.workerRunAttempt !== identity.runAttempt ||
        typeof body.reason !== "string" || !body.reason.trim()) {
      return json({ error: "factory_job_claim_mismatch" }, 409);
    }
    const { data: tasks, error: tasksError } = await admin
      .from("project_factory_tasks").select("id,task_key")
      .eq("job_id", job.id).eq("project_id", job.project_id);
    if (tasksError || !tasks) return json({ error: "factory_tasks_unavailable" }, 503);
    for (const task of tasks) {
      const state = task.task_key === "prepare_specification" ? "failed" : "blocked";
      const { error } = await admin.from("project_factory_tasks")
        .update({ state, last_error_safe: body.reason.slice(0, 500), updated_at: new Date().toISOString() })
        .eq("id", task.id).eq("job_id", job.id);
      if (error) return json({ error: "factory_task_failure_persistence_failed" }, 503);
    }
    const failureManifest = {
      ...job.manifest,
      failureStage: "worker_execution",
      failureReasonSafe: body.reason.slice(0, 500),
      workerFailedAt: new Date().toISOString(),
    };
    const { data: failedJob, error: failError } = await admin
      .from("project_factory_jobs")
      .update({ status: "failed", manifest: failureManifest, updated_at: new Date().toISOString() })
      .eq("id", job.id).eq("project_id", job.project_id).eq("status", "building")
      .select("id,status").maybeSingle();
    if (failError || !failedJob) return json({ error: "factory_failure_status_persistence_failed" }, 503);
    const { error: eventError } = await admin.from("project_memory_events").insert({
      project_id: job.project_id, event_type: "task_failed",
      actor_user_id: null, actor_role: "system", correlation_id: job.correlation_id,
      plan_version: job.plan_version, task_key: "prepare_specification",
      summary: "Le worker a signalé un échec avant la fin de la fabrication.",
      payload: { githubRunId: identity.runId, reason: body.reason.slice(0, 500) },
    });
    if (eventError) return json({ error: "factory_failure_audit_failed", status: "failed" }, 503);
    return json({ completed: true, status: "failed" });
  }

  // Completion is bound to the exact workflow run that atomically claimed this job.
  if (action === "complete") {
    if (job.status !== "building" || !isRecord(job.manifest) ||
        job.manifest.workerRunId !== identity.runId ||
        job.manifest.workerRunAttempt !== identity.runAttempt) {
      return json({ error: "factory_job_claim_mismatch" }, 409);
    }
    const report = body.report;
    const source = body.source;
    const archiveBase64 = body.archiveBase64;
    if (!isRecord(report) || !validGeneratedSource(source) ||
        typeof archiveBase64 !== "string" || archiveBase64.length < 100 ||
        archiveBase64.length > 3_000_000 ||
        report.projectId !== job.project_id || report.jobId !== job.id ||
        report.sourceDigest !== source.digest ||
        !["passed", "failed"].includes(String(report.result)) ||
        !["completed", "install", "typecheck", "build", "sandbox"].includes(String(report.stage))) {
      return json({ error: "invalid_factory_result" }, 400);
    }
    const actualSourceDigest = await sha256({
      generatorVersion: source.generatorVersion,
      files: source.files,
    });
    if (actualSourceDigest !== source.digest) return json({ error: "source_digest_mismatch" }, 409);

    const archiveBytes = decodeBase64(archiveBase64);
    if (archiveBytes.byteLength > 2_000_000) return json({ error: "source_archive_too_large" }, 413);
    const archiveBuffer = archiveBytes.buffer.slice(
      archiveBytes.byteOffset, archiveBytes.byteOffset + archiveBytes.byteLength,
    ) as ArrayBuffer;
    const archiveHash = await crypto.subtle.digest("SHA-256", archiveBuffer);
    const archiveDigest = Array.from(new Uint8Array(archiveHash), (b) => b.toString(16).padStart(2, "0")).join("");
    const reportPayload = {
      ...report,
      logs: safeLog(report.logs),
      implementationLevel: "scaffold",
      delivery: "not_deployed_human_review_required",
      archiveDigest,
    };
    const reportDigest = await sha256(reportPayload);
    const basePath = `${job.project_id}/${job.id}`;
    const sourcePath = `${basePath}/source-${source.digest}.tar.gz`;
    const sourceManifestPath = `${basePath}/source-${source.digest}.json`;
    const reportPath = `${basePath}/build-report-${reportDigest}.json`;

    const [archiveUpload, manifestUpload, reportUpload] = await Promise.all([
      admin.storage.from(BUCKET).upload(sourcePath, archiveBytes, {
        contentType: "application/gzip", upsert: true,
      }),
      admin.storage.from(BUCKET).upload(sourceManifestPath, JSON.stringify(source), {
        contentType: "application/json", upsert: true,
      }),
      admin.storage.from(BUCKET).upload(reportPath, JSON.stringify(reportPayload), {
        contentType: "application/json", upsert: true,
      }),
    ]);
    if (archiveUpload.error || manifestUpload.error || reportUpload.error) {
      return json({ error: "factory_artifact_storage_failed" }, 503);
    }

    const { data: tasks, error: tasksError } = await admin
      .from("project_factory_tasks")
      .select("id,task_key,state")
      .eq("job_id", job.id).eq("project_id", job.project_id);
    if (tasksError || !tasks || tasks.length !== 5) return json({ error: "factory_tasks_incomplete" }, 409);
    const taskByKey = new Map(tasks.map((task) => [task.task_key, task]));
    const requiredKeys = [
      "prepare_specification", "generate_application", "run_quality_checks",
      "repair_and_retest", "human_delivery_review",
    ];
    if (requiredKeys.some((key) => !taskByKey.has(key))) return json({ error: "factory_task_set_invalid" }, 409);

    const actorId = job.authorized_by ?? job.requested_by;
    if (!isUuid(actorId)) return json({ error: "factory_actor_missing" }, 409);
    const passed = report.result === "passed";
    const taskStates = passed
      ? [
          ["prepare_specification", "completed"],
          ["generate_application", "completed"],
          ["run_quality_checks", "completed"],
          ["repair_and_retest", "completed"],
          ["human_delivery_review", "ready"],
        ] as const
      : [
          ["prepare_specification", "completed"],
          ["generate_application", "completed"],
          ["run_quality_checks", "failed"],
          ["repair_and_retest", "blocked"],
          ["human_delivery_review", "blocked"],
        ] as const;

    const evidence = [
      {
        job_id: job.id, project_id: job.project_id,
        task_id: taskByKey.get("generate_application")?.id,
        evidence_type: "artifact", storage_path: `storage://${BUCKET}/${sourcePath}`,
        content_digest: source.digest,
        metadata: { sourceManifestPath, generatorVersion: source.generatorVersion, fileCount: source.files.length, moduleIds: source.moduleIds },
        created_by: actorId,
      },
      {
        job_id: job.id, project_id: job.project_id,
        task_id: taskByKey.get("run_quality_checks")?.id,
        evidence_type: "test_result", storage_path: `storage://${BUCKET}/${reportPath}`,
        content_digest: reportDigest,
        metadata: { result: report.result, stage: report.stage },
        created_by: actorId,
      },
    ];
    const { error: evidenceError } = await admin.from("project_factory_evidence").insert(evidence);
    if (evidenceError) return json({ error: "factory_evidence_persistence_failed" }, 503);

    for (const [key, state] of taskStates) {
      const task = taskByKey.get(key);
      if (!task) return json({ error: "factory_task_missing", taskKey: key }, 409);
      const { error } = await admin.from("project_factory_tasks")
        .update({ state, updated_at: new Date().toISOString() })
        .eq("id", task.id).eq("job_id", job.id);
      if (error) return json({ error: "factory_task_state_persistence_failed", taskKey: key }, 503);
    }

    const finalManifest = {
      ...job.manifest,
      sourcePath, sourceManifestPath, reportPath,
      sourceDigest: source.digest, reportDigest, archiveDigest,
      generatorVersion: source.generatorVersion,
      generatedFileCount: source.files.length,
      generatedModuleIds: source.moduleIds,
      buildResult: passed ? "passed" : "failed",
      buildStage: report.stage,
      buildLogs: safeLog(report.logs),
      implementationLevel: "scaffold",
      fullBusinessLogicImplementationPending: true,
      deployment: "not_started",
      deliveryRequiresHumanReview: true,
    };
    const finalStatus = passed ? "awaiting_approval" : "failed";
    const { data: updatedJob, error: updateError } = await admin
      .from("project_factory_jobs")
      .update({ status: finalStatus, manifest: finalManifest, updated_at: new Date().toISOString() })
      .eq("id", job.id).eq("project_id", job.project_id).eq("status", "building")
      .select("id,status").maybeSingle();
    if (updateError || !updatedJob) return json({ error: "factory_final_status_persistence_failed" }, 503);

    const { error: eventError } = await admin.from("project_memory_events").insert({
      project_id: job.project_id,
      event_type: passed ? "evidence_recorded" : "task_failed",
      actor_user_id: null,
      actor_role: "system",
      correlation_id: job.correlation_id,
      plan_version: job.plan_version,
      task_key: passed ? "human_delivery_review" : "run_quality_checks",
      summary: passed
        ? "Le squelette applicatif a été généré et compilé dans un Sandbox isolé ; la logique métier complète et la livraison restent en attente."
        : "La compilation du squelette applicatif a échoué ; les journaux et artefacts sont conservés pour correction.",
      payload: { sourceDigest: source.digest, reportDigest, buildStage: report.stage, githubRunId: identity.runId },
    });
    if (eventError) return json({ error: "factory_audit_event_persistence_failed", status: finalStatus }, 503);

    return json({
      completed: true,
      status: finalStatus,
      buildPassed: passed,
      deployed: false,
      humanReviewRequired: true,
      implementationLevel: "scaffold",
      sourceDigest: source.digest,
      reportDigest,
    });
  }

  if (job.status !== "queued") return json({ error: "factory_job_not_queued" }, 409);

  const { data: project, error: projectError } = await admin
    .from("user_projects").select("id,user_id,title,category,problem,desired_outcome")
    .eq("id", job.project_id).maybeSingle();
  if (projectError || !project) return json({ error: "project_not_found" }, 404);

  const { data: plans, error: planError } = await admin
    .from("project_memory_plan_versions")
    .select("version,payload,payload_digest,scope_digest")
    .eq("project_id", job.project_id).eq("version", job.plan_version).limit(1);
  const plan = plans?.[0];
  if (planError || !plan || plan.payload_digest !== job.plan_digest || plan.scope_digest !== job.scope_digest ||
      await sha256(plan.payload) !== job.plan_digest ||
      !isRecord(plan.payload) || !Array.isArray(plan.payload.includedScope) ||
      plan.payload.includedScope.length < 1 || plan.payload.includedScope.length > 30 ||
      await sha256(plan.payload.includedScope) !== job.scope_digest) {
    return json({ error: "approved_plan_digest_mismatch_or_empty_scope" }, 409);
  }

  const ids = Array.isArray(job.approval_ids) ? job.approval_ids : [];
  const { data: approvals, error: approvalError } = await admin
    .from("project_memory_approvals")
    .select("id,approval_kind,decision,actor_role,plan_digest,scope_digest")
    .eq("project_id", job.project_id).eq("plan_version", job.plan_version).in("id", ids);
  if (approvalError) return json({ error: "approval_check_failed" }, 503);
  const valid = (kind: string) => (approvals ?? []).some((a) =>
    a.approval_kind === kind && a.decision === "approved" && a.actor_role === "admin" &&
    a.plan_digest === job.plan_digest && a.scope_digest === job.scope_digest
  );
  // Internal factory execution requires only the two exact administrative approvals.
  // Customer scope approval and external-AI consent are separate workflows and are
  // deliberately not prerequisites for this local, isolated build worker.
  if (!valid("admin_review") || !valid("execution_authorization")) {
    return json({ error: "required_admin_approvals_missing" }, 409);
  }

  const { data: requests, error: requestError } = await admin
    .from("client_requests").select("id,user_id")
    .eq("project_id", job.project_id).eq("user_id", project.user_id);
  if (requestError || !requests?.length) return json({ error: "commercial_request_not_found" }, 409);
  const requestIds = requests.map((r) => r.id);
  const { data: launches, error: launchError } = await admin
    .from("client_project_launches")
    .select("id,request_id,client_user_id,required_amount,confirmed_amount_at_launch")
    .in("request_id", requestIds).eq("client_user_id", project.user_id);
  if (launchError || !launches?.length || !launches.some((l) =>
    Number(l.required_amount) > 0 &&
    Number(l.confirmed_amount_at_launch) >= Number(l.required_amount)
  )) return json({ error: "commercial_launch_or_payment_not_confirmed" }, 409);

  if (isPlannedSpecialistWorkflowManifest(job.manifest)) {
    const specialistWorkflow = readSpecialistWorkflowManifest(
      job.manifest,
      job.project_id,
      job.plan_version,
    );
    if (!specialistWorkflow) {
      return json({ error: "specialist_workflow_manifest_invalid" }, 409);
    }

    // The manifest is materialized only after the real project approvals,
    // exact plan digests, explicit AI consent and confirmed payment passed.
    if (action === "verify") {
      return json({
        authorized: true,
        jobId: job.id,
        status: "queued",
        eligible: true,
        executionEngine: "specialist_mission_ledger",
        specialistWorkflow,
        githubRunId: identity.runId,
      });
    }

    const { data: initialized, error: initializationError } = await admin.rpc(
      "initialize_factory_specialist_missions",
      { p_job_id: job.id, p_project_id: job.project_id },
    );
    if (initializationError || !initialized) {
      return json({ error: "specialist_mission_initialization_failed" }, 503);
    }

    // No provider call or mission lease is allowed until a durable, approved
    // AI budget reservation is attached to this exact workflow.
    const workflowRecord = isRecord(job.manifest) && isRecord(job.manifest.specialistWorkflow)
      ? job.manifest.specialistWorkflow
      : {};
    const budgetReservationId = typeof workflowRecord.budgetReservationId === "string"
      ? workflowRecord.budgetReservationId.trim()
      : "";
    if (!budgetReservationId) {
      return json({
        claimed: false,
        specialistWorkflow: true,
        initialized: true,
        workflowId: specialistWorkflow.workflowId,
        missionCount: initialized.missionCount,
        reason: "specialist_budget_reservation_required",
        sandboxStarted: false,
        providerCallsPerformed: false,
      });
    }

    return json({
      claimed: false,
      specialistWorkflow: true,
      initialized: true,
      workflowId: specialistWorkflow.workflowId,
      missionCount: initialized.missionCount,
      reason: "specialist_runtime_activation_pending",
      sandboxStarted: false,
      providerCallsPerformed: false,
    });
  }

  if (action === "verify") {
    return json({
      authorized: true, jobId: job.id, status: "queued", eligible: true,
      githubRunId: identity.runId, next: "eligible_for_isolated_sandbox_claim",
    });
  }

  const { data: tasks, error: tasksError } = await admin
    .from("project_factory_tasks")
    .select("id,task_key,state,external_side_effect")
    .eq("job_id", job.id).eq("project_id", job.project_id);
  if (tasksError || !tasks || tasks.length !== 5) return json({ error: "factory_tasks_incomplete" }, 409);
  const taskKeys = [
    "prepare_specification", "generate_application", "run_quality_checks",
    "repair_and_retest", "human_delivery_review",
  ];
  if (taskKeys.some((key) => !tasks.some((task) => task.task_key === key && task.state === "not_started")) ||
      tasks.some((task) => task.task_key === "human_delivery_review" && task.external_side_effect !== true)) {
    return json({ error: "factory_task_set_invalid" }, 409);
  }

  const manifest = {
    ...job.manifest,
    workerRunId: identity.runId,
    workerRunAttempt: identity.runAttempt,
    workerCommitSha: identity.sha,
    workerClaimedAt: new Date().toISOString(),
    executionEngine: "github-actions-vercel-sandbox",
  };
  const { data: claimed, error: claimError } = await admin
    .from("project_factory_jobs")
    .update({ status: "building", manifest, updated_at: new Date().toISOString() })
    .eq("id", job.id).eq("project_id", job.project_id).eq("status", "queued")
    .select("id,status").maybeSingle();
  if (claimError || !claimed) return json({ error: "factory_job_claim_conflict" }, 409);

  const firstTask = tasks.find((task) => task.task_key === "prepare_specification");
  if (!firstTask) return json({ error: "factory_initial_task_missing" }, 409);
  const { error: taskUpdateError } = await admin.from("project_factory_tasks")
    .update({ state: "in_progress", updated_at: new Date().toISOString() })
    .eq("id", firstTask.id).eq("state", "not_started");
  if (taskUpdateError) {
    await admin.from("project_factory_jobs")
      .update({ status: "queued", manifest: job.manifest, updated_at: new Date().toISOString() })
      .eq("id", job.id).eq("status", "building");
    return json({ error: "factory_task_claim_failed" }, 503);
  }

  const { error: eventError } = await admin.from("project_memory_events").insert({
    project_id: job.project_id,
    event_type: "task_started",
    actor_user_id: null,
    actor_role: "system",
    correlation_id: job.correlation_id,
    plan_version: job.plan_version,
    task_key: "prepare_specification",
    summary: "Le worker GitHub Actions a réservé le travail et démarre la fabrication isolée.",
    payload: { githubRunId: identity.runId, githubRunAttempt: identity.runAttempt, engine: "github-actions-vercel-sandbox" },
  });
  if (eventError) {
    await admin.from("project_factory_tasks")
      .update({ state: "failed", last_error_safe: "Événement de réservation non enregistré.", updated_at: new Date().toISOString() })
      .eq("id", firstTask.id).eq("job_id", job.id);
    await admin.from("project_factory_jobs")
      .update({
        status: "failed",
        manifest: { ...manifest, failureStage: "claim_audit_event" },
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id).eq("status", "building");
    return json({ error: "factory_claim_audit_failed" }, 503);
  }

  return json({
    claimed: true,
    jobId: job.id,
    planVersion: job.plan_version,
    project: {
      id: project.id, title: project.title, problem: project.problem,
      desired_outcome: project.desired_outcome, category: project.category,
    },
    plan: plan.payload,
    tasks: tasks.map((task) => ({ id: task.id, taskKey: task.task_key, state: task.state })),
  });
});
