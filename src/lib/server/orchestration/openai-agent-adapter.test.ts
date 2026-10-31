import { describe, expect, it, vi } from "vitest";
import { createOpenAIAgentAdapter } from "./openai-agent-adapter";
import { createAgentMissionEnvelope, type AgentMissionResult } from "./agent-mission-contract";

const mission = createAgentMissionEnvelope({
  missionId: "mission-openai-1",
  projectId: "project-1",
  role: "analyst",
  objective: "Analyser le besoin du client",
  instructions: ["Identifier les besoins", "Retourner une synthèse structurée"],
});

const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: mission.missionId,
  projectId: mission.projectId,
  providerId: "openai",
  status: "completed",
  summary: "Le besoin est clarifié.",
  findings: [],
  artifacts: [],
  verification: { performed: ["Validation du format"], passed: ["Contrat"], failed: [], notPerformed: [] },
  requiresHumanDecision: false,
};

function response(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("OpenAI agent adapter", () => {
  it("sends a bounded mission through the server-side OpenAI API and validates the result", async () => {
    const fetcher = vi.fn(async () => response({
      choices: [{ message: { content: JSON.stringify(result) } }],
    }));
    const adapter = createOpenAIAgentAdapter({
      getApiKey: () => "server-secret",
      models: { balanced: "gpt-model-approved" },
      fetcher,
    });

    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "openai" }, mission, modelAlias: "balanced", timeoutMs: 15_000 })).resolves.toEqual(result);
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer server-secret");
    expect(JSON.parse(String(init.body))).toMatchObject({
      model: "gpt-model-approved",
      response_format: { type: "json_object" },
    });
  });

  it("refuses to call OpenAI when no server key is configured", async () => {
    const fetcher = vi.fn();
    const adapter = createOpenAIAgentAdapter({
      getApiKey: () => undefined,
      models: { balanced: "gpt-model-approved" },
      fetcher,
    });

    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "openai" }, mission, modelAlias: "balanced", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("refuses model aliases not present in the server allowlist", async () => {
    const fetcher = vi.fn();
    const adapter = createOpenAIAgentAdapter({
      getApiKey: () => "server-secret",
      models: { balanced: "gpt-model-approved" },
      fetcher,
    });

    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "openai" }, mission, modelAlias: "client-selected-model", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects malformed or cross-project provider results", async () => {
    const invalid = { ...result, projectId: "another-project" };
    const fetcher = vi.fn(async () => response({
      choices: [{ message: { content: JSON.stringify(invalid) } }],
    }));
    const adapter = createOpenAIAgentAdapter({
      getApiKey: () => "server-secret",
      models: { balanced: "gpt-model-approved" },
      fetcher,
    });

    await expect(adapter.invoke({ connection: { connectionId: "connection_1", owner: { type: "organization", id: "merkora-gdj" }, providerId: "openai" }, mission, modelAlias: "balanced", timeoutMs: 15_000 })).rejects.toThrow();
  });
});
