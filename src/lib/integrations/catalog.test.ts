import { describe, expect, it } from "vitest";
import { getIntegrationDefinition, listIntegrationCatalog } from "./catalog";

describe("integration catalog", () => {
  it("lists the planned ecosystem without pretending providers are connected", () => {
    const catalog = listIntegrationCatalog();
    const ids = catalog.map((item) => item.id);

    expect(ids).toContain("github");
    expect(ids).toContain("vercel");
    expect(ids).toContain("supabase");
    expect(ids).toContain("openai");
    expect(ids).toContain("anthropic");
    expect(ids).toContain("google-gemini");
    expect(ids).toContain("figma");
    expect(ids).toContain("capcut");
    expect(ids).toContain("netlify");
    expect(ids).toContain("render");
    expect(ids).toContain("magicpath");
    expect(ids).toContain("website-publisher");
    expect(ids).toContain("chatgpt-mcp");
    expect(ids).toContain("claude-mcp");
    expect(new Set(ids).size).toBe(ids.length);
    expect(catalog.every((item) => item.initialStatus === "not_configured")).toBe(true);
  });

  it("marks providers whose API or authorization path still needs verification", () => {
    expect(getIntegrationDefinition("figma")?.verificationRequired).toBe(false);
    expect(getIntegrationDefinition("runway")?.verificationRequired).toBe(true);
    expect(getIntegrationDefinition("heygen")?.verificationRequired).toBe(true);
    expect(getIntegrationDefinition("capcut")?.verificationRequired).toBe(true);
    expect(getIntegrationDefinition("codunk")?.verificationRequired).toBe(true);
  });

  it("declares connection direction and transport honestly", () => {
    const catalog = listIntegrationCatalog();
    expect(catalog.find((item) => item.id === "github")?.directions).toEqual(["outbound", "inbound"]);
    expect(catalog.find((item) => item.id === "figma")?.directions).toEqual(["outbound", "inbound"]);
    expect(catalog.find((item) => item.id === "chatgpt-mcp")?.directions).toEqual(["inbound"]);
    expect(catalog.find((item) => item.id === "claude-mcp")?.transport).toBe("mcp");
    expect(catalog.find((item) => item.id === "capcut")?.transport).toBe("manual_handoff");
    expect(catalog.find((item) => item.id === "capcut")?.directions).toEqual(["outbound"]);
    expect(catalog.every((item) => item.directions.length > 0)).toBe(true);
  });

  it("returns null for an unknown provider instead of inventing a connector", () => {
    expect(getIntegrationDefinition("unknown-provider")).toBeNull();
  });
});
