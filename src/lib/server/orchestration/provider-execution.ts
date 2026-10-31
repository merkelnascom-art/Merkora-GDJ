import {
  validateAgentMissionResult,
  type AgentMissionEnvelope,
  type AgentMissionResult,
} from "./agent-mission-contract";

export type AgentConnectionOwner = { type: "organization" | "user" | "customer"; id: string };

export type AgentRuntimeConnection = {
  connectionId: string;
  owner: AgentConnectionOwner;
  providerId: string;
  status: "connected" | "not_configured" | "expired" | "revoked" | "error";
  capabilities: readonly string[];
};

export type AgentInvocation = {
  connection: Pick<AgentRuntimeConnection, "connectionId" | "owner" | "providerId">;
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
 * Provider output is untrusted and revalidated here even if an adapter also
 * validates it. Adapters must be explicitly registered by the server root.
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

      let rawResult: unknown;
      try {
        rawResult = await adapter.invoke({
          connection: {
            connectionId: input.connection.connectionId,
            owner: input.connection.owner,
            providerId: input.connection.providerId,
          },
          mission: input.mission,
          modelAlias: input.modelAlias,
          timeoutMs: input.timeoutMs,
        });
      } catch (error) {
        // Never return provider exception text: it may contain prompts or secrets.
        if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
          return { ok: false, code: "TIMEOUT" };
        }
        return { ok: false, code: "PROVIDER_ERROR" };
      }

      try {
        const result = validateAgentMissionResult(
          { missionId: input.mission.missionId, projectId: input.mission.projectId },
          rawResult,
        );
        if (result.providerId !== adapter.providerId) {
          return { ok: false, code: "INVALID_RESULT" };
        }
        return { ok: true, result };
      } catch {
        return { ok: false, code: "INVALID_RESULT" };
      }
    },
  };
}
