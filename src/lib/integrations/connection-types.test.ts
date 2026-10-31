import { describe, expect, it } from "vitest";
import type { IntegrationConnectionMetadata, IntegrationConnectionStatus } from "./connection-types";

describe("integration connection lifecycle contract", () => {
  it("supports every explicit lifecycle state", () => {
    const statuses: IntegrationConnectionStatus[] = [
      "not_configured",
      "ready_to_connect",
      "pending_authorization",
      "connected",
      "expired",
      "error",
      "revoked",
    ];
    expect(new Set(statuses).size).toBe(7);
  });

  it("models safe metadata without requiring credential material", () => {
    const metadata: IntegrationConnectionMetadata = {
      providerId: "github",
      owner: { type: "organization", id: "merkora" },
      status: "connected",
      grantedCapabilities: ["repositories.read"],
      createdAt: "2026-10-31T12:00:00.000Z",
      updatedAt: "2026-10-31T12:00:00.000Z",
      lastVerifiedAt: "2026-10-31T12:00:00.000Z",
      safeErrorCode: null,
    };
    expect(metadata).not.toHaveProperty("token");
    expect(metadata).not.toHaveProperty("secret");
    expect(metadata).not.toHaveProperty("credentials");
  });
});
