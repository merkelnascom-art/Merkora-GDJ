import { describe, expect, it, vi } from "vitest";
import { createAnthropicAgentAdapter } from "./anthropic-agent-adapter";
import { createAgentMissionEnvelope, type AgentMissionResult } from "./agent-mission-contract";

const mission = createAgentMissionEnvelope({
  missionId: "mission-anthropic-1",
  projectId: "project-1",
  role: "reviewer",
  objective: "Examiner une proposition",
  instructions: ["Identifier les risques", "Retourner un résultat structuré"],
});
const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: mission.missionId,
  projectId: mission.projectId,
  providerId: "anthropic",
  status: "completed",
  summary: "La proposition est cohérente.",
  findings: [],
  artifacts: [],
  verification: { performed: ["Contrat"], passed: ["Format"], failed: [], notPerformed: [] },
  requiresHumanDecision: false,
};

function response(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Anthropic agent adapter", () => {
  it("uses the server credential and validates the mission result", async () => {
    const fetcher = vi.fn(async () => response({
      content: [{ type: "text", text: JSON.stringify(result) }],
    }));
    const adapter = createAnthropicAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "claude-model-approved" },
      fetcher,
    });

    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "anthropic" }, mission, modelAlias: "reviewer", timeoutMs: 15_000 })).resolves.toEqual(result);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(new Headers(init.headers).get("x-api-key")).toBe("server-secret");
    expect(JSON.parse(String(init.body))).toMatchObject({ model: "claude-model-approved", max_tokens: 2_000 });
  });

  it("does not call Anthropic without a configured server key", async () => {
    const fetcher = vi.fn();
    const adapter = createAnthropicAgentAdapter({
      getApiKey: () => undefined,
      models: { reviewer: "claude-model-approved" },
      fetcher,
    });
    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "anthropic" }, mission, modelAlias: "reviewer", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects client-selected models outside the server allowlist", async () => {
    const fetcher = vi.fn();
    const adapter = createAnthropicAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "claude-model-approved" },
      fetcher,
    });
    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "anthropic" }, mission, modelAlias: "unapproved", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects a result for another project", async () => {
    const fetcher = vi.fn(async () => response({
      content: [{ type: "text", text: JSON.stringify({ ...result, projectId: "other-project" }) }],
    }));
    const adapter = createAnthropicAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "claude-model-approved" },
      fetcher,
    });
    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "anthropic" }, mission, modelAlias: "reviewer", timeoutMs: 15_000 })).rejects.toThrow();
  });
});
