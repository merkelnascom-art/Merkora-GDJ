import { describe, expect, it, vi } from "vitest";
import { createGeminiAgentAdapter } from "./gemini-agent-adapter";
import { createAgentMissionEnvelope, type AgentMissionResult } from "./agent-mission-contract";

const mission = createAgentMissionEnvelope({
  missionId: "mission-gemini-1",
  projectId: "project-1",
  role: "cross_checker",
  objective: "Vérifier une synthèse",
  instructions: ["Repérer les incohérences", "Retourner un résultat structuré"],
});
const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: mission.missionId,
  projectId: mission.projectId,
  providerId: "gemini",
  status: "completed",
  summary: "Aucune incohérence majeure.",
  findings: [],
  artifacts: [],
  verification: { performed: ["Contrôle de cohérence"], passed: ["Contrat"], failed: [], notPerformed: [] },
  requiresHumanDecision: false,
};

function response(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Gemini agent adapter", () => {
  it("uses the server key and validates a scoped mission result", async () => {
    const fetcher = vi.fn(async () => response({
      candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] } }],
    }));
    const adapter = createGeminiAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "gemini-approved-model" },
      fetcher,
    });
    await expect(adapter.invoke({ mission, modelAlias: "reviewer", timeoutMs: 15_000 })).resolves.toEqual(result);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/models/gemini-approved-model:generateContent");
    expect(new Headers(init.headers).get("x-goog-api-key")).toBe("server-secret");
    expect(JSON.parse(String(init.body))).toMatchObject({
      generationConfig: { responseMimeType: "application/json" },
    });
  });

  it("does not call Gemini without a server key", async () => {
    const fetcher = vi.fn();
    const adapter = createGeminiAgentAdapter({
      getApiKey: () => undefined,
      models: { reviewer: "gemini-approved-model" },
      fetcher,
    });
    await expect(adapter.invoke({ mission, modelAlias: "reviewer", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects unapproved model aliases before making a request", async () => {
    const fetcher = vi.fn();
    const adapter = createGeminiAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "gemini-approved-model" },
      fetcher,
    });
    await expect(adapter.invoke({ mission, modelAlias: "unknown-model", timeoutMs: 15_000 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects results belonging to another project", async () => {
    const fetcher = vi.fn(async () => response({
      candidates: [{ content: { parts: [{ text: JSON.stringify({ ...result, projectId: "another-project" }) }] } }],
    }));
    const adapter = createGeminiAgentAdapter({
      getApiKey: () => "server-secret",
      models: { reviewer: "gemini-approved-model" },
      fetcher,
    });
    await expect(adapter.invoke({ mission, modelAlias: "reviewer", timeoutMs: 15_000 })).rejects.toThrow();
  });
});
