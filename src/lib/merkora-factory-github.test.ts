import { afterEach, describe, expect, it, vi } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { verifyMerkoraGitHubApp } from "../../lib/server/merkora-factory-github";

const { privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

describe("verifyMerkoraGitHubApp", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("exchanges the app JWT and verifies the exact workflow without dispatching it", async () => {
    vi.stubEnv("MERKORA_GITHUB_APP_ID", "5627977");
    vi.stubEnv("MERKORA_GITHUB_APP_INSTALLATION_ID", "178929095");
    vi.stubEnv("MERKORA_GITHUB_APP_PRIVATE_KEY", privateKey);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        token: "temporary-installation-token",
        permissions: { actions: "write" },
      }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 123,
        name: "MerKora factory worker",
        state: "active",
        path: ".github/workflows/merkora-factory-worker.yml",
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyMerkoraGitHubApp()).resolves.toEqual({
      ok: true,
      workflowActive: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.github.com/app/installations/178929095/access_tokens",
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.github.com/repos/merkelnascom-art/Merkora-GDJ/actions/workflows/merkora-factory-worker.yml",
    );
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain("workflow_dispatch");
  });

  it("rejects an installation token without actions write permission", async () => {
    vi.stubEnv("MERKORA_GITHUB_APP_ID", "5627977");
    vi.stubEnv("MERKORA_GITHUB_APP_INSTALLATION_ID", "178929095");
    vi.stubEnv("MERKORA_GITHUB_APP_PRIVATE_KEY", privateKey);
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({
      token: "temporary-token",
      permissions: { actions: "read" },
    }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyMerkoraGitHubApp()).resolves.toEqual({
      ok: false,
      reason: "insufficient_permissions",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reports missing configuration without making a network request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyMerkoraGitHubApp()).resolves.toEqual({
      ok: false,
      reason: "not_configured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
