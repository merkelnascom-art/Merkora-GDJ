import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(),
  isSameOrigin: vi.fn(), uploadUserStorageObject: vi.fn(),
}));
vi.mock("@/lib/factory/vercel-project-sandbox", () => ({ createVercelProjectSandbox: vi.fn() }));
vi.mock("@/lib/factory/project-sandbox-runner", () => ({ runProjectBuildInSandbox: vi.fn() }));
vi.mock("@/lib/ai-provider", () => ({ requestAiGatewayCompletion: vi.fn() }));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin, uploadUserStorageObject } from "@/lib/server/supabase-rest";
import { createVercelProjectSandbox } from "@/lib/factory/vercel-project-sandbox";
import { runProjectBuildInSandbox } from "@/lib/factory/project-sandbox-runner";
import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { createProjectMemoryDigest } from "@/lib/factory/project-memory-digest";
import { POST } from "./route";

const user = { id: "admin-1", email: "merkelnascom@gmail.com", fullName: "Admin" };
const planPayload = {
  includedScope: [{ id: "attendance", title: "Présences", description: "Pointage des arrivées." }],
  aiImplementationConsent: false,
  acceptanceCriteria: ["L’administrateur peut consulter les présences."],
  confirmedConstraints: [],
  openQuestions: [],
};
const plan = {
  version: 3, payload: planPayload,
  payload_digest: createProjectMemoryDigest(planPayload),
  scope_digest: createProjectMemoryDigest(planPayload.includedScope),
  source_brief_version: 2,
};
const approvals = ["client_scope", "admin_review", "execution_authorization"].map((approval_kind, index) => ({
  id: `approval-${index + 1}`, approval_kind, decision: "approved",
  plan_digest: plan.payload_digest, scope_digest: plan.scope_digest,
}));
const job = {
  id: "b2c3d4e5-f678-4123-8abc-1234567890ab",
  status: "queued", plan_version: 3, plan_digest: plan.payload_digest,
  scope_digest: plan.scope_digest, approval_ids: ["approval-1", "approval-2", "approval-3"],
  correlation_id: "c2c3d4e5-f678-4123-8abc-1234567890ab", manifest: {},
};
const project = { id: "MK-PROJECT-001", title: "Aéro Service", problem: "Suivre les retards.", desired_outcome: "Gérer les présences." };
const tasks = [
  "prepare_specification", "generate_application", "run_quality_checks",
  "repair_and_retest", "human_delivery_review",
].map((task_key, index) => ({
  id: `task-${index + 1}`, task_key, state: "not_started",
  external_side_effect: task_key === "human_delivery_review",
}));
const context = { params: Promise.resolve({ projectId: project.id, jobId: job.id }) };
function request() {
  return new Request(`https://merkora.test/api/admin/projects/${project.id}/factory/jobs/${job.id}/build`, {
    method: "POST", headers: { origin: "https://merkora.test", "content-type": "application/json" }, body: "{}",
  });
}

beforeEach(() => {
  planPayload.aiImplementationConsent = false;
  plan.payload_digest = createProjectMemoryDigest(planPayload);
  job.plan_digest = plan.payload_digest;
  approvals.forEach((approval) => { approval.plan_digest = plan.payload_digest; });
  delete process.env.AI_GATEWAY_API_KEY;
  delete process.env.MERKORA_IMPLEMENTATION_MODEL;
  vi.mocked(requestAiGatewayCompletion).mockReset();
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("token");
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user });
  vi.mocked(runProjectBuildInSandbox).mockResolvedValue({
    ok: true, stage: "completed", digest: "d".repeat(64), logs: "build passed",
  });
  vi.mocked(createVercelProjectSandbox).mockResolvedValue({} as never);
  vi.mocked(uploadUserStorageObject).mockResolvedValue({ ok: true, status: 200, data: {} });
  vi.mocked(callUserData).mockImplementation(async (path, method) => {
    if (method === "GET" && path.startsWith("project_factory_jobs?select")) return { ok: true, status: 200, data: [job] };
    if (method === "GET" && path.startsWith("project_memory_plan_versions?select")) return { ok: true, status: 200, data: [plan] };
    if (method === "GET" && path.startsWith("project_memory_approvals?select")) return { ok: true, status: 200, data: approvals };
    if (method === "GET" && path.startsWith("user_projects?select")) return { ok: true, status: 200, data: [project] };
    if (method === "GET" && path.startsWith("project_factory_tasks?select")) return { ok: true, status: 200, data: tasks };
    if (method === "PATCH" && path.includes("status=eq.queued")) return { ok: true, status: 200, data: [{ ...job, status: "building" }] };
    if (method === "POST" && path === "project_factory_evidence") return { ok: true, status: 201, data: [
      { id: "evidence-1" }, { id: "evidence-2" }, { id: "evidence-3" }, { id: "evidence-4" },
    ] };
    return { ok: true, status: 200, data: [] };
  });
});
afterEach(() => vi.clearAllMocks());

describe("POST factory job build", () => {
  it("builds the approved modules in a sandbox, saves artifacts, and waits for human delivery review", async () => {
    const response = await POST(request(), context);
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ status: "awaiting_approval", executionStarted: true, deployed: false, humanReviewRequired: true });
    expect(runProjectBuildInSandbox).toHaveBeenCalledOnce();
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
    expect(uploadUserStorageObject).toHaveBeenCalledTimes(3);
    expect(vi.mocked(callUserData).mock.calls.some(([path, method]) =>
      method === "PATCH" && String(path).includes("status=eq.queued"))).toBe(true);
  });

  it("calls the implementation model only when consent is part of the exact approved plan", async () => {
    planPayload.aiImplementationConsent = true;
    const consentDigest = createProjectMemoryDigest(planPayload);
    plan.payload_digest = consentDigest;
    job.plan_digest = consentDigest;
    approvals.forEach((approval) => { approval.plan_digest = consentDigest; });
    process.env.AI_GATEWAY_API_KEY = "unit-test-key";
    process.env.MERKORA_IMPLEMENTATION_MODEL = "unit-test-model";
    vi.mocked(requestAiGatewayCompletion).mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "Ajoute une première vue des présences.",
        openQuestions: [],
        files: [{
          path: "src/app/modules/attendance/page.tsx",
          content: "export default function Page() { return <main>Présences</main>; }",
        }],
      }) } }],
    }), { status: 200 }));

    const response = await POST(request(), context);
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(requestAiGatewayCompletion).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      implementationLevel: "ai_patch",
      fullBusinessLogicImplementationPending: true,
    });
  });

  it("does not claim or execute a job without all exact approvals", async () => {
    vi.mocked(callUserData).mockImplementation(async (path, method) => {
      if (method === "GET" && path.startsWith("project_factory_jobs?select")) return { ok: true, status: 200, data: [job] };
      if (method === "GET" && path.startsWith("project_memory_plan_versions?select")) return { ok: true, status: 200, data: [plan] };
      if (method === "GET" && path.startsWith("project_memory_approvals?select")) return { ok: true, status: 200, data: approvals.slice(0, 2) };
      return { ok: true, status: 200, data: [] };
    });
    const response = await POST(request(), context);
    expect(response.status).toBe(409);
    expect(runProjectBuildInSandbox).not.toHaveBeenCalled();
    expect(uploadUserStorageObject).not.toHaveBeenCalled();
  });

  it("rejects non-administrators before reading or claiming jobs", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(request(), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
    expect(runProjectBuildInSandbox).not.toHaveBeenCalled();
  });

  it("does not execute a job that is no longer queued", async () => {
    vi.mocked(callUserData).mockImplementation(async (path, method) => {
      if (method === "GET" && path.startsWith("project_factory_jobs?select")) return { ok: true, status: 200, data: [{ ...job, status: "building" }] };
      return { ok: true, status: 200, data: [] };
    });
    const response = await POST(request(), context);
    expect(response.status).toBe(409);
    expect(runProjectBuildInSandbox).not.toHaveBeenCalled();
  });
});
