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
