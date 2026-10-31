import { describe, expect, it } from "vitest";
import { getProviderWorkspaces, listWorkspaceProviders, MERKORA_WORKSPACES } from "./workspace-map";

describe("integration workspace mapping", () => {
  it("assigns core engineering tools to administration and the project factory", () => {
    for (const id of ["github", "vercel", "supabase", "netlify", "render"]) {
      expect(getProviderWorkspaces(id)).toEqual(["admin", "fabrique"]);
    }
  });

  it("keeps visual and media tools in their dedicated workspaces", () => {
    expect(getProviderWorkspaces("figma")).toContain("studio_visuel");
    expect(getProviderWorkspaces("magicpath")).toContain("studio_visuel");
    expect(getProviderWorkspaces("runway")).toEqual(["creation_media"]);
    expect(getProviderWorkspaces("capcut")).toEqual(["creation_media"]);
  });

  it("does not map unknown tools to a workspace", () => {
    expect(getProviderWorkspaces("unknown")).toEqual([]);
  });

  it("provides a reverse lookup for every workspace", () => {
    for (const workspace of MERKORA_WORKSPACES) {
      expect(listWorkspaceProviders(workspace).length).toBeGreaterThan(0);
    }
  });
});

  // Inbound assistants use the same scoped client/copot workspace access path.
  it("maps external assistants to client and copilot spaces", () => {
    expect(getProviderWorkspaces("chatgpt-mcp")).toEqual(["client", "assistant"]);
    expect(getProviderWorkspaces("claude-mcp")).toEqual(["client", "assistant"]);
  });

  it("keeps all catalog integrations assigned to a known workspace", async () => {
    const { listIntegrationCatalog } = await import("./catalog");
    const known = new Set<string>(MERKORA_WORKSPACES);
    for (const integration of listIntegrationCatalog()) {
      const assigned = getProviderWorkspaces(integration.id);
      expect(assigned.length, integration.id).toBeGreaterThan(0);
      for (const workspace of assigned) expect(known.has(workspace)).toBe(true);
    }
  });
