import {
  canUseIntegrationConnection,
  type IntegrationConnectionMetadata,
  type IntegrationConnectionOwner,
} from "../../integrations/connection-types";
import type { ProviderAdapter } from "./provider-adapter";

function ownerKey(owner: IntegrationConnectionOwner, providerId: string): string {
  return [owner.type, owner.id, providerId].join(":");
}

function safeCode(value: string): string {
  return /^[a-z0-9_.-]{1,64}$/i.test(value) ? value : "provider_error";
}

/**
 * Volatile lifecycle registry for tests and local orchestration only.
 * This deliberately does not persist credentials or connection state.
 * Replace its store with an approved durable repository before production use.
 */
export function createConnectionManager(adapters: readonly ProviderAdapter[]) {
  const providers = new Map(adapters.map((adapter) => [adapter.providerId, adapter]));
  const connections = new Map<string, IntegrationConnectionMetadata>();

  function getStatus(owner: IntegrationConnectionOwner, providerId: string) {
    return connections.get(ownerKey(owner, providerId)) ?? null;
  }

  function requireProvider(providerId: string): ProviderAdapter {
    const provider = providers.get(providerId);
    if (!provider) throw new Error("Unknown integration provider");
    return provider;
  }

  function requireConnection(owner: IntegrationConnectionOwner, providerId: string) {
    const current = getStatus(owner, providerId);
    if (!current) throw new Error("Integration connection not found");
    return current;
  }

  return {
    async register(owner: IntegrationConnectionOwner, providerId: string) {
      const provider = requireProvider(providerId);
      const now = new Date().toISOString();
      const metadata: IntegrationConnectionMetadata = {
        providerId,
        owner: { ...owner },
        status: "ready_to_connect",
        grantedCapabilities: [...provider.capabilities],
        createdAt: now,
        updatedAt: now,
        lastVerifiedAt: null,
        safeErrorCode: null,
      };
      connections.set(ownerKey(owner, providerId), metadata);
      return metadata;
    },

    getStatus,

    canUse(owner: IntegrationConnectionOwner, providerId: string) {
      const metadata = getStatus(owner, providerId);
      return metadata ? canUseIntegrationConnection(metadata) : false;
    },

    async verify(owner: IntegrationConnectionOwner, providerId: string) {
      const provider = requireProvider(providerId);
      const current = requireConnection(owner, providerId);
      if (current.status === "revoked") {
        throw new Error("Revoked integration connections cannot be verified");
      }

      const now = new Date().toISOString();
      const result = await provider.verify();
      if (!result.ok) {
        const failed: IntegrationConnectionMetadata = {
          ...current,
          status: "error",
          updatedAt: now,
          lastVerifiedAt: now,
          safeErrorCode: safeCode(result.code),
        };
        connections.set(ownerKey(owner, providerId), failed);
        throw new Error("Connection verification failed");
      }

      const verified: IntegrationConnectionMetadata = {
        ...current,
        status: "connected",
        updatedAt: now,
        lastVerifiedAt: now,
        safeErrorCode: null,
      };
      connections.set(ownerKey(owner, providerId), verified);
      return verified;
    },

    async revoke(owner: IntegrationConnectionOwner, providerId: string) {
      const provider = requireProvider(providerId);
      const current = requireConnection(owner, providerId);
      await provider.revoke();
      const revoked: IntegrationConnectionMetadata = {
        ...current,
        status: "revoked",
        updatedAt: new Date().toISOString(),
        safeErrorCode: null,
      };
      connections.set(ownerKey(owner, providerId), revoked);
      return revoked;
    },
  };
}
