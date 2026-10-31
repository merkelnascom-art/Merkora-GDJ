import {
  validateAgentMissionResult,
  type AgentMissionEnvelope,
  type AgentMissionResult,
} from "./agent-mission-contract";
import type { AgentInvocation, AgentRuntimeAdapter } from "./provider-execution";

type GeminiGenerateContentPayload = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: unknown }>;
    };
  }>;
};

type GeminiAgentAdapterOptions = {
  getApiKey: () => string | undefined;
  models: Readonly<Record<string, string>>;
  fetcher?: typeof fetch;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMissionResult(content: unknown, mission: AgentMissionEnvelope): AgentMissionResult {
  if (typeof content !== "string" || content.length === 0 || content.length > 24_000) {
    throw new Error("Gemini returned an invalid mission payload.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Gemini returned an invalid mission payload.");
  }
  if (!isRecord(parsed) || parsed.providerId !== "gemini") {
    throw new Error("Gemini returned an invalid mission payload.");
  }
  return validateAgentMissionResult(
    { missionId: mission.missionId, projectId: mission.projectId },
    parsed,
  );
}

/** Server-only Gemini adapter. The API key and model allowlist are never client-controlled. */
export function createGeminiAgentAdapter(
  options: GeminiAgentAdapterOptions,
): AgentRuntimeAdapter {
  const fetcher = options.fetcher ?? fetch;
  return {
    providerId: "gemini",
    invocationCapability: "models.generate",
    async invoke(input: AgentInvocation): Promise<AgentMissionResult> {
      const apiKey = options.getApiKey()?.trim();
      if (!apiKey) throw new Error("Gemini server credential is not configured.");
      const model = options.models[input.modelAlias];
      if (!model || !/^[A-Za-z0-9._-]{1,120}$/.test(model)) {
        throw new Error("Gemini model alias is not approved.");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), input.timeoutMs);
      try {
        const response = await fetcher(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
          {
            method: "POST",
            headers: {
              "x-goog-api-key": apiKey,
              "content-type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: {
                parts: [{
                  text: [
                    "You are a specialized agent operating inside MerKora GDJ.",
                    "Return only one JSON object matching the AgentMissionResult contract.",
                    "Do not reveal private chain-of-thought; provide concise findings and verifiable conclusions only.",
                    "Never claim tests, actions, artifacts, or deployments that you did not perform.",
                    "Use status blocked or failed when you cannot complete the mission.",
                    "The providerId must be gemini.",
                  ].join(" "),
                }],
              },
              contents: [{ role: "user", parts: [{ text: JSON.stringify(input.mission) }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2_000,
                responseMimeType: "application/json",
              },
            }),
          },
        );
        if (!response.ok) throw new Error("Gemini request failed.");
        const payload: unknown = await response.json();
        if (!isRecord(payload) || !Array.isArray(payload.candidates)) {
          throw new Error("Gemini returned an invalid response.");
        }
        const completion = payload as GeminiGenerateContentPayload;
        const parts = completion.candidates?.[0]?.content?.parts ?? [];
        const textContent = parts.map((part) => part.text).find((part) => typeof part === "string");
        return parseMissionResult(textContent, input.mission);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
