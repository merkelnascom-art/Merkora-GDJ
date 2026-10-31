import { describe, expect, it, vi } from "vitest";
import { createAgentMissionEnvelope, type AgentMissionResult } from "./agent-mission-contract";
import { executeAgentCollaboration } from "./agent-collaboration-executor";
import type { AgentCollaborationPlan } from "./agent-collaboration";
import type { AgentRuntimeAdapter } from "./provider-execution";

const mission = createAgentMissionEnvelope({
  missionId: "mission-analyst",
  projectId: "project-1",
  role: "analyst",
  objective: "Analyser le besoin",
  instructions: ["Produire une synthèse"],
});
const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: mission.missionId,
  projectId: mission.projectId,
  providerId: "openai",
  status: "completed",
  summary: "Besoin analysé.",
  findings: [],
  artifacts: [],
  verification: { performed: ["Validation du contrat"], passed: ["Périmètre"], failed: [], notPerformed: [] },
  requiresHumanDecision: false,
};
const plan: AgentCollaborationPlan = {
  projectId: "project-1",
  assignments: [{ role: "analyst", providerId: "openai", capability: "models.generate" }],
  blockedRoles: [],
};
const connection = {
  connectionId: "connection-1",
  owner: { type: "organization" as const, id: "merkora-gdj" },
  providerId: "openai",
  status: "connected" as const,
  capabilities: ["models.generate"],
};
function adapter(invoke = vi.fn(async () => result)): AgentRuntimeAdapter {
  return { providerId: "openai", invocationCapability: "models.generate", invoke };
}
function input(overrides: Partial<Parameters<typeof executeAgentCollaboration>[0]> = {}) {
  return {
    plan,
    adapters: [adapter()],
    connections: [connection],
    missions: { analyst: mission },
    modelAliases: { openai: "balanced" },
    timeoutMs: 15_000,
    authorize: vi.fn(async () => true),
    reserveBudget: vi.fn(async () => true),
    ...overrides,
  };
}

describe("agent collaboration executor", () => {
  it("invokes a planned mission only after authorization and budget reservation", async () => {
    const invoke = vi.fn(async () => result);
    const authorize = vi.fn(async () => true);
    const reserveBudget = vi.fn(async () => true);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      authorize,
      reserveBudget,
    }));
    expect(output.completedResults).toEqual([result]);
    expect(output.blockedRoles).toEqual([]);
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(reserveBudget).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("never invokes a provider when authorization is denied", async () => {
    const invoke = vi.fn(async () => result);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      authorize: vi.fn(async () => false),
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "NOT_AUTHORIZED" });
    expect(invoke).not.toHaveBeenCalled();
  });

  it("never invokes a provider when budget reservation fails", async () => {
    const invoke = vi.fn(async () => result);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      reserveBudget: vi.fn(async () => false),
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "BUDGET_NOT_RESERVED" });
    expect(invoke).not.toHaveBeenCalled();
  });

  it("does not reserve budget when a provider is disconnected", async () => {
    const reserveBudget = vi.fn(async () => true);
    const invoke = vi.fn(async () => result);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      connections: [{ ...connection, status: "revoked" as const }],
      reserveBudget,
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "NOT_CONNECTED" });
    expect(reserveBudget).not.toHaveBeenCalled();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("does not reserve budget when no approved model alias exists", async () => {
    const reserveBudget = vi.fn(async () => true);
    const invoke = vi.fn(async () => result);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      modelAliases: {},
      reserveBudget,
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "PROVIDER_ERROR" });
    expect(reserveBudget).not.toHaveBeenCalled();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("blocks missions that do not belong to the plan project or role", async () => {
    const invoke = vi.fn(async () => result);
    const wrongMission = createAgentMissionEnvelope({
      missionId: "mission-wrong",
      projectId: "other-project",
      role: "analyst",
      objective: "Analyse",
      instructions: ["Analyse"],
    });
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      missions: { analyst: wrongMission },
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "PROJECT_SCOPE_MISMATCH" });
    expect(invoke).not.toHaveBeenCalled();
  });

  it("blocks missing mission envelopes instead of guessing", async () => {
    const invoke = vi.fn(async () => result);
    const output = await executeAgentCollaboration(input({
      adapters: [adapter(invoke)],
      missions: {},
    }));
    expect(output.invocations[0].outcome).toEqual({ ok: false, code: "MISSION_MISSING" });
    expect(invoke).not.toHaveBeenCalled();
  });
});
