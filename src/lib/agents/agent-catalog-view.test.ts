import { describe, expect, it } from "vitest";
import { filterAgentCatalog } from "./agent-catalog-view";

describe("filterAgentCatalog", () => {
  it("returns every specialist when the query is empty", () => {
    const result = filterAgentCatalog("", "all");
    expect(result).toHaveLength(35);
  });

  it("matches specialist names and mission text without accent sensitivity", () => {
    const result = filterAgentCatalog("securite", "all");
    expect(result.map((agent) => agent.id)).toContain("expert-securite");
  });

  it("restricts results to the selected pole", () => {
    const result = filterAgentCatalog("", "fabrication");
    expect(result).toHaveLength(5);
    expect(result.every((agent) => agent.poleId === "fabrication")).toBe(true);
  });

  it("combines the pole and text filters", () => {
    const result = filterAgentCatalog("test", "controle");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((agent) => agent.poleId === "controle")).toBe(true);
    expect(result.map((agent) => agent.id)).toContain("testeur-logiciel");
  });
});
