import { describe, expect, it, vi } from "vitest";
import { generateProjectSource } from "./project-generator";
import { runProjectBuildInSandbox, type ProjectSandbox } from "./project-sandbox-runner";

function source() {
  return generateProjectSource({
    projectName: "Gestion RH",
    projectDescription: "Gérer les équipes.",
    modules: [{ id: "staff", title: "Personnel", description: "Profils employés." }],
  });
}

function fakeSandbox(exitCodes: number[] = [0, 0, 0]) {
  let index = 0;
  const sandbox: ProjectSandbox = {
    writeFiles: vi.fn().mockResolvedValue(undefined),
    runCommand: vi.fn().mockImplementation(async () => {
      const exitCode = exitCodes[index++] ?? 0;
      return { exitCode, stdout: async () => "ok", stderr: async () => "" };
    }),
    update: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  };
  return sandbox;
}

describe("runProjectBuildInSandbox", () => {
  it("installs, locks down network, typechecks, builds, and always stops the sandbox", async () => {
    const sandbox = fakeSandbox();
    const createSandbox = vi.fn().mockResolvedValue(sandbox);
    const result = await runProjectBuildInSandbox(source(), createSandbox);

    expect(result).toMatchObject({ ok: true, stage: "completed" });
    expect(createSandbox).toHaveBeenCalledWith({
      timeout: 300_000,
      persistent: false,
      resources: { vcpus: 1 },
      networkPolicy: { allow: { "registry.npmjs.org": [] } },
    });
    expect(sandbox.writeFiles).toHaveBeenCalledOnce();
    expect(sandbox.update).toHaveBeenCalledWith({ networkPolicy: "deny-all" });
    expect(sandbox.runCommand).toHaveBeenNthCalledWith(1, {
      cmd: "npm", args: ["install", "--ignore-scripts", "--no-audit", "--no-fund"], cwd: "/vercel/sandbox",
    });
    expect(sandbox.runCommand).toHaveBeenNthCalledWith(2, {
      cmd: "npm", args: ["run", "typecheck"], cwd: "/vercel/sandbox",
    });
    expect(sandbox.runCommand).toHaveBeenNthCalledWith(3, {
      cmd: "npm", args: ["run", "build"], cwd: "/vercel/sandbox",
    });
    expect(sandbox.stop).toHaveBeenCalledOnce();
  });

  it("never creates a sandbox for a tampered source manifest", async () => {
    const generated = source();
    generated.files[0].content += "tampered";
    const createSandbox = vi.fn();
    const result = await runProjectBuildInSandbox(generated, createSandbox);
    expect(result).toMatchObject({ ok: false, stage: "validation", reason: "digest_mismatch" });
    expect(createSandbox).not.toHaveBeenCalled();
  });

  it("does not run build steps after a failed dependency installation", async () => {
    const sandbox = fakeSandbox([1]);
    const result = await runProjectBuildInSandbox(source(), vi.fn().mockResolvedValue(sandbox));
    expect(result).toMatchObject({ ok: false, stage: "install" });
    expect(sandbox.update).not.toHaveBeenCalled();
    expect(sandbox.runCommand).toHaveBeenCalledOnce();
    expect(sandbox.stop).toHaveBeenCalledOnce();
  });

  it("does not compile after a failed TypeScript check", async () => {
    const sandbox = fakeSandbox([0, 1]);
    const result = await runProjectBuildInSandbox(source(), vi.fn().mockResolvedValue(sandbox));
    expect(result).toMatchObject({ ok: false, stage: "typecheck" });
    expect(sandbox.runCommand).toHaveBeenCalledTimes(2);
    expect(sandbox.stop).toHaveBeenCalledOnce();
  });

  it("stops the sandbox after a build failure", async () => {
    const sandbox = fakeSandbox([0, 0, 1]);
    const result = await runProjectBuildInSandbox(source(), vi.fn().mockResolvedValue(sandbox));
    expect(result).toMatchObject({ ok: false, stage: "build" });
    expect(sandbox.stop).toHaveBeenCalledOnce();
  });
});
