import { describe, expect, it } from "vitest";
import manifest from "../../../knowledge/manifest.json";

type Resource = {
  id: string;
  title: string;
  description: string;
  kind: string;
  sectors: string[];
  tags: string[];
  language: string;
  source: { name: string; location: string };
  version: number;
  status: string;
  sensitivity: string;
  dependencies: string[];
  notes: string[];
};

const resources = manifest.resources as Resource[];

describe("MerKora knowledge inventory manifest", () => {
  it("gives every resource a traceable identity, provenance, version and review state", () => {
    expect(resources.length).toBeGreaterThan(0);

    for (const resource of resources) {
      expect(resource.id.trim()).not.toBe("");
      expect(resource.title.trim()).not.toBe("");
      expect(resource.description.trim()).not.toBe("");
      expect(resource.kind.trim()).not.toBe("");
      expect(resource.source.name.trim()).not.toBe("");
      expect(resource.source.location.trim()).not.toBe("");
      expect(resource.version).toBeGreaterThan(0);
      expect(resource.status).toMatch(
        /^(discovered|extracted|needs_review|approved|rejected|needs_extraction)$/
      );
      expect(resource.sectors).toEqual(expect.any(Array));
      expect(resource.tags).toEqual(expect.any(Array));
      expect(resource.dependencies).toEqual(expect.any(Array));
      expect(resource.notes).toEqual(expect.any(Array));
    }
  });

  it("keeps multi-sector resources associated with more than one sector", () => {
    const aero = resources.find((item) => item.id === "aero-service-cadrage");
    expect(aero).toBeDefined();
    expect(aero?.sectors.length).toBeGreaterThan(1);
  });

  it("records the expected 500-sector source as missing instead of fabricating entries", () => {
    const catalogue = resources.find((item) => item.id === "activity-sectors-500");
    expect(catalogue).toBeDefined();
    expect(catalogue?.status).toBe("needs_extraction");
    expect(catalogue?.notes.join(" ")).toContain("Aucune des 500 entrées");
  });

  it("does not silently merge separate source files that may be duplicates", () => {
    const first = resources.find((item) => item.id === "finance-example-pasted-markdown");
    const second = resources.find((item) => item.id === "finance-example-pasted-markdown-1");
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(first?.source.location).not.toBe(second?.source.location);
  });

  it("labels client-project material as project-specific rather than universal policy", () => {
    const projectExamples = resources.filter((item) =>
      ["aero-service-cadrage", "ginesse-recovery-md", "walltrade-reseller-workbook"].includes(item.id)
    );

    expect(projectExamples.length).toBe(3);
    for (const item of projectExamples) {
      expect(item.tags).toContain("project-specific-example");
    }
  });
});
