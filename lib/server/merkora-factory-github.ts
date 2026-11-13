import { sign } from "node:crypto";

const API = "https://api.github.com";
const OWNER = "merkelnascom-art";
const REPOSITORY = "Merkora-GDJ";
const WORKFLOW = "merkora-factory-worker.yml";
const WORKFLOW_REF = "feature/merkora-factory-unified-runtime";

type DispatchResult =
  | { ok: true; runRequested: true }
  | { ok: false; reason: "not_configured" | "invalid_configuration" | "github_rejected" | "network_error" };

function base64url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function appJwt(appId: string, privateKeyValue: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId }));
  const unsigned = `${header}.${payload}`;
  const privateKey = privateKeyValue.replace(/\\n/g, "\n");
  const signature = sign("RSA-SHA256", Buffer.from(unsigned), privateKey).toString("base64url");
  return `${unsigned}.${signature}`;
}

async function githubRequest(url: string, token: string, body?: unknown): Promise<Response> {
  return fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });
}

export type GitHubAppVerificationResult =
  | { ok: true; workflowActive: true }
  | { ok: false; reason: "not_configured" | "invalid_configuration" | "installation_token_rejected" | "workflow_access_rejected" | "invalid_installation_token_response" | "insufficient_permissions" | "workflow_unavailable" | "network_error"; httpStatus?: number };

/**
 * Read-only connectivity check: mint a short-lived installation token and
 * inspect the configured workflow. It never dispatches a run or claims a job.
 */
export async function verifyMerkoraGitHubApp(): Promise<GitHubAppVerificationResult> {
  const appId = process.env.MERKORA_GITHUB_APP_ID;
  const installationId = process.env.MERKORA_GITHUB_APP_INSTALLATION_ID;
  const privateKey = process.env.MERKORA_GITHUB_APP_PRIVATE_KEY;
  if (!appId || !installationId || !privateKey) return { ok: false, reason: "not_configured" };
  if (!/^\d+$/.test(appId) || !/^\d+$/.test(installationId) || privateKey.length < 100) {
    return { ok: false, reason: "invalid_configuration" };
  }

  try {
    const jwt = appJwt(appId, privateKey);
    const tokenResponse = await githubRequest(
      `${API}/app/installations/${installationId}/access_tokens`,
      jwt,
      { permissions: { actions: "write" } },
    );
    if (!tokenResponse.ok) return { ok: false, reason: "installation_token_rejected", httpStatus: tokenResponse.status };

    const tokenData: unknown = await tokenResponse.json();
    if (!tokenData || typeof tokenData !== "object") return { ok: false, reason: "invalid_installation_token_response" };
    const token = (tokenData as { token?: unknown }).token;
    const permissions = (tokenData as { permissions?: unknown }).permissions;
    if (typeof token !== "string" || !token) return { ok: false, reason: "invalid_installation_token_response" };
    if (!permissions || typeof permissions !== "object" ||
        (permissions as { actions?: unknown }).actions !== "write") {
      return { ok: false, reason: "insufficient_permissions" };
    }

    const workflowResponse = await githubRequest(
      `${API}/repos/${OWNER}/${REPOSITORY}/actions/workflows/${WORKFLOW}`,
      token,
    );
    if (!workflowResponse.ok) return { ok: false, reason: "workflow_access_rejected", httpStatus: workflowResponse.status };
    const workflowData: unknown = await workflowResponse.json();
    if (!workflowData || typeof workflowData !== "object" ||
        (workflowData as { state?: unknown }).state !== "active" ||
        (workflowData as { path?: unknown }).path !== `.github/workflows/${WORKFLOW}`) {
      return { ok: false, reason: "workflow_unavailable" };
    }
    return { ok: true, workflowActive: true };
  } catch {
    return { ok: false, reason: "network_error" };
  }
}

export async function dispatchMerkoraFactoryWorkflow(
  projectId: string,
  jobId: string,
): Promise<DispatchResult> {
  const appId = process.env.MERKORA_GITHUB_APP_ID;
  const installationId = process.env.MERKORA_GITHUB_APP_INSTALLATION_ID;
  const privateKey = process.env.MERKORA_GITHUB_APP_PRIVATE_KEY;
  if (!appId || !installationId || !privateKey) return { ok: false, reason: "not_configured" };
  if (!/^\d+$/.test(appId) || !/^\d+$/.test(installationId) || privateKey.length < 100) {
    return { ok: false, reason: "invalid_configuration" };
  }

  try {
    const jwt = appJwt(appId, privateKey);
    const tokenResponse = await githubRequest(
      `${API}/app/installations/${installationId}/access_tokens`,
      jwt,
      { permissions: { actions: "write" } },
    );
    if (!tokenResponse.ok) return { ok: false, reason: "github_rejected" };
    const tokenData: unknown = await tokenResponse.json();
    if (!tokenData || typeof tokenData !== "object" ||
      typeof (tokenData as { token?: unknown }).token !== "string") {
      return { ok: false, reason: "github_rejected" };
    }
    const installationToken = (tokenData as { token: string }).token;

    const dispatchResponse = await githubRequest(
      `${API}/repos/${OWNER}/${REPOSITORY}/actions/workflows/${WORKFLOW}/dispatches`,
      installationToken,
      { ref: WORKFLOW_REF, inputs: { project_id: projectId, job_id: jobId } },
    );
    if (dispatchResponse.status !== 204) return { ok: false, reason: "github_rejected" };
    return { ok: true, runRequested: true };
  } catch {
    return { ok: false, reason: "network_error" };
  }
}
