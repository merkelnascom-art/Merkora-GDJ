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

  it("returns null for an unknown provider instead of inventing a connector", () => {
    expect(getIntegrationDefinition("unknown-provider")).toBeNull();
  });
});
