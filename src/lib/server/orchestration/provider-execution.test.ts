import { describe, expect, it, vi } from "vitest";
import { createAgentRuntime, type AgentRuntimeAdapter } from "./provider-execution";
import { createAgentMissionEnvelope, type AgentMissionResult } from "./agent-mission-contract";

const mission = createAgentMissionEnvelope({
  missionId: "m-1",
  projectId: "p-1",
  role: "analyst",
  objective: "Analyser le besoin",
  instructions: ["Produire une synthèse"],
});

const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: "m-1",
  projectId: "p-1",
  providerId: "openai",
  status: "completed",
  summary: "Analyse terminée",
  findings: [],
  artifacts: [],
  verification: { performed: ["Contrôle du périmètre"], passed: ["Périmètre"], failed: [], notPerformed: [] },
  requiresHumanDecision: false,
};

function adapter(invoke = vi.fn(async () => result)): AgentRuntimeAdapter {
  return { providerId: "openai", invocationCapability: "models.generate", invoke };
}

describe("provider execution boundary", () => {
  it("invokes only a connected provider with the required capability", async () => {
    const invoke = vi.fn(async () => result);
    const runtime = createAgentRuntime([adapter(invoke)]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
      mission, modelAlias: "balanced", timeoutMs: 30_000,
    });
    expect(outcome).toEqual({ ok: true, result });
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("blocks disconnected providers without invoking them", async () => {
    const invoke = vi.fn(async () => result);
    const runtime = createAgentRuntime([adapter(invoke)]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "not_configured", capabilities: ["models.generate"] },
      mission, modelAlias: "balanced", timeoutMs: 30_000,
    });
    expect(outcome).toEqual({ ok: false, code: "NOT_CONNECTED" });
    expect(invoke).not.toHaveBeenCalled();
  });

  it("blocks missing capabilities", async () => {
    const runtime = createAgentRuntime([adapter()]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "connected", capabilities: [] },
      mission, modelAlias: "balanced", timeoutMs: 30_000,
    });
    expect(outcome).toEqual({ ok: false, code: "CAPABILITY_MISSING" });
  });

  it("rejects results returned for another project or provider", async () => {
    const bad = { ...result, projectId: "other-project" };
    const runtime = createAgentRuntime([adapter(vi.fn(async () => bad))]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
      mission, modelAlias: "balanced", timeoutMs: 30_000,
    });
    expect(outcome).toEqual({ ok: false, code: "INVALID_RESULT" });
  });

  it("sanitizes provider exceptions", async () => {
    const runtime = createAgentRuntime([adapter(vi.fn(async () => { throw new Error("secret-key leaked"); }))]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
      mission, modelAlias: "balanced", timeoutMs: 30_000,
    });
    expect(outcome).toEqual({ ok: false, code: "PROVIDER_ERROR" });
    expect(JSON.stringify(outcome)).not.toContain("secret-key");
  });

  it("rejects timeouts outside server policy", async () => {
    const invoke = vi.fn(async () => result);
    const runtime = createAgentRuntime([adapter(invoke)]);
    const outcome = await runtime.invoke({
      connection: { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
      mission, modelAlias: "balanced", timeoutMs: 500_000,
    });
    expect(outcome).toEqual({ ok: false, code: "PROVIDER_ERROR" });
    expect(invoke).not.toHaveBeenCalled();
  });
});
