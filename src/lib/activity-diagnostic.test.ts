import { describe, expect, it } from "vitest";
import { buildActivityDiagnosticPlan } from "./activity-diagnostic";

describe("buildActivityDiagnosticPlan", () => {
  it("keeps universal workflow questions and narrows profession questions to selected sectors", () => {
    const result = buildActivityDiagnosticPlan({ familyIds: ["family-04", "family-12"], sectorIds: ["S04-01", "S12-03"], professionTitles: ["Commerçant", "Gestionnaire RH"] });
    expect(result.status).toBe("sector_focused");
    expect(result.selectedSectors.map((item) => item.id)).toEqual(["S04-01", "S12-03"]);
    expect(result.questions.map((item) => item.id)).toContain("commerce-sale");
    expect(result.questions.map((item) => item.id)).toContain("hr-cycle");
    expect(result.questions.map((item) => item.id)).toContain("workflow");
    expect(result.confirmedProfessionTitles).toEqual(["Commerçant", "Gestionnaire RH"]);
  });
  it("ignores unknown sectors and sectors outside the selected families", () => {
    const result = buildActivityDiagnosticPlan({ familyIds: ["family-04"], sectorIds: ["S12-03", "unknown"] });
    expect(result.selectedSectors).toEqual([]);
    expect(result.status).toBe("exploratory");
  });
  it("preserves hybrid contexts without merging family-specific questions", () => {
    const result = buildActivityDiagnosticPlan({ familyIds: ["family-04", "family-12"], sectorIds: ["S04-01", "S12-03"] });
    expect(result.selectedFamilies).toHaveLength(2);
    expect(result.questions.filter((item) => item.stage === "Processus")).toHaveLength(1);
    expect(result.questions.filter((item) => item.stage === "Vente" || item.stage === "RH")).toHaveLength(2);
  });
});
