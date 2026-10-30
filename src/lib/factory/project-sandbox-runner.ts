import { validateGeneratedProjectSource } from "./validate-generated-source";
import type { GeneratedProjectSource } from "./project-generator";

export type SandboxCommandResult = {
  exitCode: number;
  stdout(): Promise<string>;
  stderr(): Promise<string>;
};
export type ProjectSandbox = {
  writeFiles(files: Array<{ path: string; content: Buffer }>): Promise<void>;
  runCommand(input: { cmd: string; args: string[]; cwd: string }): Promise<SandboxCommandResult>;
  update(input: { networkPolicy: "deny-all" }): Promise<void>;
  stop(): Promise<void>;
};
export type ProjectSandboxOptions = {
  timeout: number;
  persistent: false;
  resources: { vcpus: 1 };
  networkPolicy: { allow: { "registry.npmjs.org": [] } };
};

export type ProjectBuildResult =
  | { ok: true; stage: "completed"; digest: string; logs: string }
  | { ok: false; stage: "validation" | "install" | "typecheck" | "build" | "sandbox"; reason: string; logs: string };

type SandboxFactory = (options: ProjectSandboxOptions) => Promise<ProjectSandbox>;

const MAX_LOG_LENGTH = 12_000;
function limitLog(value: string): string {
  return value.slice(-MAX_LOG_LENGTH);
}

async function command(
  sandbox: ProjectSandbox,
  cmd: string,
  args: string[],
): Promise<{ ok: boolean; logs: string }> {
  const result = await sandbox.runCommand({ cmd, args, cwd: "/vercel/sandbox" });
  const stdout = await result.stdout();
  const stderr = await result.stderr();
  return { ok: result.exitCode === 0, logs: limitLog([stdout, stderr].filter(Boolean).join("\n")) };
}

/**
 * Installs and builds generated code in a disposable Firecracker sandbox.
 * No credentials are passed into the VM. Network access is restricted to the
 * package registry during installation, then completely disabled for checks.
 */
export async function runProjectBuildInSandbox(
  source: GeneratedProjectSource,
  createSandbox: SandboxFactory,
): Promise<ProjectBuildResult> {
  const validation = validateGeneratedProjectSource(source);
  if (!validation.ok) {
    return { ok: false, stage: "validation", reason: validation.reason, logs: "" };
  }

  let sandbox: ProjectSandbox | null = null;
  try {
    sandbox = await createSandbox({
      timeout: 300_000,
      persistent: false,
      resources: { vcpus: 1 },
      networkPolicy: { allow: { "registry.npmjs.org": [] } },
    });

    await sandbox.writeFiles(source.files.map((file) => ({
      path: file.path,
      content: Buffer.from(file.content, "utf8"),
    })));

    const install = await command(sandbox, "npm", [
      "install", "--ignore-scripts", "--no-audit", "--no-fund",
    ]);
    if (!install.ok) {
      return { ok: false, stage: "install", reason: "L'installation des dépendances a échoué.", logs: install.logs };
    }

    await sandbox.update({ networkPolicy: "deny-all" });

    const typecheck = await command(sandbox, "npm", ["run", "typecheck"]);
    if (!typecheck.ok) {
      return { ok: false, stage: "typecheck", reason: "Le contrôle TypeScript a détecté des erreurs.", logs: typecheck.logs };
    }

    const build = await command(sandbox, "npm", ["run", "build"]);
    if (!build.ok) {
      return { ok: false, stage: "build", reason: "La compilation de l'application a échoué.", logs: build.logs };
    }

    return {
      ok: true, stage: "completed", digest: source.digest,
      logs: limitLog([install.logs, typecheck.logs, build.logs].filter(Boolean).join("\n")),
    };
  } catch {
    return { ok: false, stage: "sandbox", reason: "L'environnement de compilation isolé est indisponible.", logs: "" };
  } finally {
    if (sandbox) {
      try { await sandbox.stop(); } catch { /* best-effort cleanup; no sandbox is reused */ }
    }
  }
}
