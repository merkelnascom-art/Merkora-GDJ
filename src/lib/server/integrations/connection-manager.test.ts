import { describe, expect, it, vi } from "vitest";
import { createConnectionManager } from "./connection-manager";
import type { ProviderAdapter } from "./provider-adapter";

function adapter(overrides: Partial<ProviderAdapter> = {}): ProviderAdapter {
  return {
    providerId: "github",
    capabilities: ["repositories.read"],
    verify: vi.fn(async () => ({ ok: true as const })),
    revoke: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe("connection manager", () => {
  it("keeps organization, user and customer connections isolated", async () => {
    const manager = createConnectionManager([adapter()]);
    const org = { type: "organization" as const, id: "merkora-gdj" };
    const customer = { type: "customer" as const, id: "customer-1" };

    await manager.register(org, "github");
    await manager.register(customer, "github");

    expect(manager.getStatus(org, "github")?.owner).toEqual(org);
    expect(manager.getStatus(customer, "github")?.owner).toEqual(customer);
    expect(manager.getStatus(org, "github")?.owner).not.toEqual(customer);
  });

  it("only allows a verified connected integration to be used", async () => {
    const manager = createConnectionManager([adapter()]);
    const owner = { type: "organization" as const, id: "merkora-gdj" };

    await manager.register(owner, "github");
    expect(manager.canUse(owner, "github")).toBe(false);

    await manager.verify(owner, "github");
    expect(manager.canUse(owner, "github")).toBe(true);
  });

  it("redacts provider failure details and marks the connection as error", async () => {
    const manager = createConnectionManager([
      adapter({ verify: vi.fn(async () => ({ ok: false as const, code: "invalid_token", message: "secret-token-value" })) }),
    ]);
    const owner = { type: "organization" as const, id: "merkora-gdj" };

    await manager.register(owner, "github");
    await expect(manager.verify(owner, "github")).rejects.toThrow("Connection verification failed");
    expect(manager.getStatus(owner, "github")?.safeErrorCode).toBe("invalid_token");
    expect(JSON.stringify(manager.getStatus(owner, "github"))).not.toContain("secret-token-value");
  });

  it("revokes a connection and prevents further use", async () => {
    const provider = adapter();
    const manager = createConnectionManager([provider]);
    const owner = { type: "organization" as const, id: "merkora-gdj" };

    await manager.register(owner, "github");
    await manager.verify(owner, "github");
    await manager.revoke(owner, "github");

    expect(manager.canUse(owner, "github")).toBe(false);
    expect(manager.getStatus(owner, "github")?.status).toBe("revoked");
    expect(provider.revoke).toHaveBeenCalledOnce();
  });

  it("rejects unknown providers", async () => {
    const manager = createConnectionManager([]);
    await expect(
      manager.register({ type: "organization", id: "merkora-gdj" }, "unknown"),
    ).rejects.toThrow("Unknown integration provider");
  });
});
