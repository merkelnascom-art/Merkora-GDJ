import { Sandbox } from "@vercel/sandbox";
import type { ProjectSandbox, ProjectSandboxOptions } from "./project-sandbox-runner";

/**
 * Creates a disposable Vercel Firecracker microVM for generated customer code.
 * The runner never injects application secrets into this sandbox.
 */
export async function createVercelProjectSandbox(
  options: ProjectSandboxOptions,
): Promise<ProjectSandbox> {
  const sandbox = await Sandbox.create(options);
  return {
    writeFiles: async (files) => { await sandbox.writeFiles(files); },
    runCommand: async (input) => sandbox.runCommand(input),
    update: async (input) => { await sandbox.update(input); },
    stop: async () => { await sandbox.stop(); },
  };
}
