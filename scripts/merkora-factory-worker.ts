import { Sandbox } from "@vercel/sandbox";
import { generateProjectSource } from "../src/lib/factory/project-generator";
import { createProjectArchive } from "../src/lib/factory/project-archive";

const AUDIENCE = "merkora-gdj-factory";
const MAX_LOG_LENGTH = 12_000;

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Configuration worker manquante : ${name}`);
  return value;
}

function slug(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

function limit(value: string): string {
  return value.slice(-MAX_LOG_LENGTH);
}

async function getGitHubOidcToken(): Promise<string> {
  const requestUrl = required("ACTIONS_ID_TOKEN_REQUEST_URL");
  const requestToken = required("ACTIONS_ID_TOKEN_REQUEST_TOKEN");
  const separator = requestUrl.includes("?") ? "&" : "?";
  const response = await fetch(`${requestUrl}${separator}audience=${encodeURIComponent(AUDIENCE)}`, {
    headers: { Authorization: `Bearer ${requestToken}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`GitHub OIDC request failed: ${response.status}`);
  const payload = await response.json() as { value?: string };
  if (typeof payload.value !== "string" || payload.value.split(".").length !== 3) {
    throw new Error("GitHub OIDC token response is invalid.");
  }
  return payload.value;
}

async function callWorker(url: string, token: string, body: Record<string, unknown>) {
  const response = await fetch(`${url.replace(/\/$/, "")}/functions/v1/factory-worker`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : `Factory worker API failed: ${response.status}`);
  }
  return payload;
}

async function runSandbox(files: Array<{ path: string; content: string }>) {
  const sandbox = await Sandbox.create({
    token: required("VERCEL_TOKEN"),
    teamId: required("VERCEL_TEAM_ID"),
    projectId: required("VERCEL_PROJECT_ID"),
    timeout: 300_000,
    persistent: false,
    resources: { vcpus: 1 },
    networkPolicy: { allow: { "registry.npmjs.org": [] } },
  });

  try {
    await sandbox.writeFiles(files.map((file) => ({
      path: file.path,
      content: Buffer.from(file.content, "utf8"),
    })));

    const logs: string[] = [];
    const run = async (cmd: string, args: string[]) => {
      const result = await sandbox.runCommand({ cmd, args, cwd: "/vercel/sandbox" });
      const stdout = await result.stdout();
      const stderr = await result.stderr();
      logs.push([stdout, stderr].filter(Boolean).join("\n"));
      return result.exitCode;
    };

    const installExit = await run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"]);
    if (installExit !== 0) {
      return { ok: false, stage: "install", reason: "L'installation des dépendances a échoué.", logs: limit(logs.join("\n")) };
    }

    await sandbox.update({ networkPolicy: "deny-all" });

    const typecheckExit = await run("npm", ["run", "typecheck"]);
    if (typecheckExit !== 0) {
      return { ok: false, stage: "typecheck", reason: "Le contrôle TypeScript a détecté des erreurs.", logs: limit(logs.join("\n")) };
    }

    const buildExit = await run("npm", ["run", "build"]);
    if (buildExit !== 0) {
      return { ok: false, stage: "build", reason: "La compilation Next.js a échoué.", logs: limit(logs.join("\n")) };
    }

    return { ok: true, stage: "completed", reason: null, logs: limit(logs.join("\n")) };
  } finally {
    await sandbox.stop().catch(() => undefined);
  }
}

async function main() {
  const supabaseUrl = required("SUPABASE_URL");
  const projectId = required("PROJECT_ID");
  const jobId = required("JOB_ID");
  // Validate all external credentials before obtaining a job lease.
  required("VERCEL_TOKEN");
  required("VERCEL_TEAM_ID");
  required("VERCEL_PROJECT_ID");

  if (!/^[A-Za-z0-9_-]{3,100}$/.test(projectId) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(jobId)) {
    throw new Error("Project or factory job identifier is invalid.");
  }

  const token = await getGitHubOidcToken();
  const claim = await callWorker(supabaseUrl, token, { action: "claim", projectId, jobId });
  if (claim.claimed !== true || !claim.project || !claim.plan || !Array.isArray(claim.tasks)) {
    throw new Error("The factory job was not claimed with a complete approved payload.");
  }

  try {
  const project = claim.project as Record<string, unknown>;
  const plan = claim.plan as Record<string, unknown>;
  const scope = Array.isArray(plan.includedScope) ? plan.includedScope : [];
  const modules = scope.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Approved scope contains an invalid module.");
    const record = item as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title : "";
    const description = typeof record.description === "string" ? record.description : title;
    const id = typeof record.id === "string" ? slug(record.id) : slug(title);
    if (!id || !title.trim()) throw new Error("Approved scope contains an empty module identifier or title.");
    return { id, title, description: description.trim() || title };
  });

  const source = generateProjectSource({
    projectName: String(project.title ?? "Projet MerKora"),
    projectDescription: `${String(project.problem ?? "")} Objectif : ${String(project.desired_outcome ?? "")}`.slice(0, 500),
    modules,
  });
  const archive = createProjectArchive(source);
  const build = await runSandbox(source.files);

  const report = {
    schemaVersion: 1,
    projectId,
    jobId,
    planVersion: claim.planVersion,
    sourceDigest: source.digest,
    generatorVersion: source.generatorVersion,
    moduleIds: source.moduleIds,
    fileCount: source.files.length,
    result: build.ok ? "passed" : "failed",
    stage: build.stage,
    reason: build.reason,
    logs: limit(build.logs),
    generatedAt: new Date().toISOString(),
    delivery: "not_deployed_human_review_required",
    implementationLevel: "scaffold",
  };

  const completed = await callWorker(supabaseUrl, token, {
    action: "complete",
    projectId,
    jobId,
    report,
    source,
    archiveBase64: Buffer.from(archive.bytes).toString("base64"),
  });

  if (completed.completed !== true) throw new Error("The factory result was not persisted.");
  if (!build.ok) throw new Error(build.reason ?? "Factory build failed.");
  console.log("MerKora factory build completed; evidence persisted; no deployment performed.");
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "worker_execution_failed";
    try {
      await callWorker(supabaseUrl, token, {
        action: "fail", projectId, jobId, reason,
      });
    } catch {
      console.error("Worker failed after claiming the job; administrator reconciliation is required.");
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Factory worker failed.");
  process.exitCode = 1;
});
