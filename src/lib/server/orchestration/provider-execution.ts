import type { AgentMissionEnvelope, AgentMissionResult } from "./agent-mission-contract";

export type AgentRuntimeConnection = {
  providerId: string;
  status: "connected" | "not_configured" | "expired" | "revoked" | "error";
  capabilities: readonly string[];
};

export type AgentInvocation = {
  mission: AgentMissionEnvelope;
  /** Provider-specific model choice is resolved server-side, never trusted from a client. */
  modelAlias: string;
  /** A bounded timeout selected by server policy. */
  timeoutMs: number;
};

export type AgentInvocationOutcome =
  | { ok: true; result: AgentMissionResult; usage?: { inputTokens?: number; outputTokens?: number } }
  | { ok: false; code: "NOT_CONNECTED" | "CAPABILITY_MISSING" | "TIMEOUT" | "PROVIDER_ERROR" | "INVALID_RESULT" };

export interface AgentRuntimeAdapter {
  readonly providerId: string;
  readonly invocationCapability: string;
  invoke(input: AgentInvocation): Promise<AgentMissionResult>;
}

const MAX_TIMEOUT_MS = 120_000;
const MIN_TIMEOUT_MS = 1_000;

/**
 * Server-side dispatch boundary for real provider adapters.
 *
 * This module deliberately contains no vendor SDK, credentials, network calls,
 * persistence, or default provider implementation. An adapter must be explicitly
 * registered by the server composition root after its credentials and budget
 * policy are configured.
 */
export function createAgentRuntime(adapters: readonly AgentRuntimeAdapter[]) {
  const byProvider = new Map(adapters.map((adapter) => [adapter.providerId, adapter]));
  if (byProvider.size !== adapters.length) throw new Error("Duplicate agent provider adapter.");

  return {
    async invoke(input: {
      connection: AgentRuntimeConnection;
      mission: AgentMissionEnvelope;
      modelAlias: string;
      timeoutMs: number;
    }): Promise<AgentInvocationOutcome> {
      const adapter = byProvider.get(input.connection.providerId);
      if (!adapter || input.connection.status !== "connected") {
        return { ok: false, code: "NOT_CONNECTED" };
      }
      if (!input.connection.capabilities.includes(adapter.invocationCapability)) {
        return { ok: false, code: "CAPABILITY_MISSING" };
      }
      if (!Number.isInteger(input.timeoutMs)
        || input.timeoutMs < MIN_TIMEOUT_MS
        || input.timeoutMs > MAX_TIMEOUT_MS) {
        return { ok: false, code: "PROVIDER_ERROR" };
      }

      try {
        const result = await adapter.invoke({
          mission: input.mission,
          modelAlias: input.modelAlias,
          timeoutMs: input.timeoutMs,
        });
        if (result.missionId !== input.mission.missionId
          || result.projectId !== input.mission.projectId
          || result.providerId !== adapter.providerId) {
          return { ok: false, code: "INVALID_RESULT" };
        }
        return { ok: true, result };
      } catch {
        // Never return provider exception text: it may contain prompts or secrets.
        return { ok: false, code: "PROVIDER_ERROR" };
      }
    },
  };
}
