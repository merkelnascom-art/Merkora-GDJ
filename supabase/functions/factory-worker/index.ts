import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.9.6";
import { isTrustedGitHubWorkflowClaims } from "./identity.ts";

const AUDIENCE = "merkora-gdj-factory";
const ISSUER = "https://token.actions.githubusercontent.com";
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

async function verifyGitHubIdentity(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([A-Za-z0-9._~-]+)$/.exec(authorization);
  if (!match) throw new Error("missing_worker_identity");
  const { payload } = await jwtVerify(match[1], JWKS, {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["RS256"],
  });
  const p = payload as Record<string, unknown>;
  if (!isTrustedGitHubWorkflowClaims(p)) {
    throw new Error("worker_identity_not_authorized");
  }
  return { runId: p.run_id, runAttempt: p.run_attempt, sha: String(p.sha ?? "") };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let identity: { runId: string; runAttempt: string; sha: string };
  try {
    identity = await verifyGitHubIdentity(request);
  } catch {
    return json({ error: "invalid_worker_identity" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "invalid_payload" }, 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (body.action !== "verify" || !isProjectId(body.projectId) || !isUuid(body.jobId)) {
    return json({ error: "unsupported_action_or_invalid_identifiers" }, 400);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "worker_backend_not_configured" }, 503);
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Read-only eligibility checks before the atomic compare-and-set claim.
  const { data: job, error: jobError } = await admin
    .from("project_factory_jobs")
    .select("id,project_id,status,plan_version,plan_digest,scope_digest,approval_ids,correlation_id")
    .eq("id", body.jobId).eq("project_id", body.projectId).maybeSingle();
  if (jobError || !job) return json({ error: "factory_job_not_found" }, 404);
  if (job.status !== "queued") return json({ error: "factory_job_not_queued" }, 409);

  const { data: project, error: projectError } = await admin
    .from("user_projects").select("id,user_id").eq("id", job.project_id).maybeSingle();
  if (projectError || !project) return json({ error: "project_not_found" }, 404);

  const { data: plans, error: planError } = await admin
    .from("project_memory_plan_versions")
    .select("version,payload,payload_digest,scope_digest")
    .eq("project_id", job.project_id).eq("version", job.plan_version).limit(1);
  const plan = plans?.[0];
  if (planError || !plan || plan.payload_digest !== job.plan_digest || plan.scope_digest !== job.scope_digest ||
      await sha256(plan.payload) !== job.plan_digest ||
      !Array.isArray((plan.payload as Record<string, unknown>).includedScope) ||
      await sha256((plan.payload as Record<string, unknown>).includedScope) !== job.scope_digest) {
    return json({ error: "approved_plan_digest_mismatch" }, 409);
  }

  const ids = Array.isArray(job.approval_ids) ? job.approval_ids : [];
  const { data: approvals, error: approvalError } = await admin
    .from("project_memory_approvals")
    .select("id,approval_kind,decision,plan_digest,scope_digest,ai_processing_consent")
    .eq("project_id", job.project_id).eq("plan_version", job.plan_version)
    .in("id", ids);
  if (approvalError) return json({ error: "approval_check_failed" }, 503);
  const valid = (kind: string) => (approvals ?? []).some((a) =>
    a.approval_kind === kind && a.decision === "approved" &&
    a.plan_digest === job.plan_digest && a.scope_digest === job.scope_digest
  );
  const clientConsent = (approvals ?? []).some((a) =>
    a.approval_kind === "client_scope" && a.decision === "approved" &&
    a.ai_processing_consent === true && a.plan_digest === job.plan_digest &&
    a.scope_digest === job.scope_digest
  );
  if (!valid("client_scope") || !valid("admin_review") ||
      !valid("execution_authorization") || !clientConsent) {
    return json({ error: "required_approvals_or_ai_consent_missing" }, 409);
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

  // Verification is intentionally read-only. The worker must not claim or
  // advance a job until the isolated Vercel Sandbox execution stage is connected.
  return json({
    authorized: true,
    jobId: job.id,
    status: "queued",
    eligible: true,
    githubRunId: identity.runId,
    next: "sandbox_execution_not_enabled",
  });
});
