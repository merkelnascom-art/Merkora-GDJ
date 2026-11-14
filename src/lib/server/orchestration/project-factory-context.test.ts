import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createProjectMemoryDigest } from "@/lib/factory/project-memory-digest";

vi.mock("@/lib/server/supabase-rest", () => ({ callUserData: vi.fn() }));

import { callUserData } from "@/lib/server/supabase-rest";
import { loadProjectFactoryContext } from "./project-factory-context";

const brief = {
  title: "Centre de formation",
  category: "organization",
  problem: "Les inscriptions et paiements sont suivis dans plusieurs cahiers.",
  desiredOutcome: "Centraliser les inscriptions et le suivi financier.",
  budget: "À définir",
  urgency: "Ce trimestre",
};

const plan = {
  projectId: "project-001",
  version: 2,
  briefVersion: 1,
  plannerVersion: "planner-v1",
  domainLabel: "Éducation et formation",
  summary: "Plateforme de gestion des inscriptions et du suivi financier.",
  goals: ["Centraliser les inscriptions", "Fiabiliser les paiements"],
  includedScope: [
    { id: "registrations", title: "Inscriptions", description: "Dossiers et statuts", source: "approved_scope" },
  ],
  tasks: [
    {
      id: "task-analysis-01",
      title: "Analyser le besoin",
      purpose: "Consolider les flux d'inscription.",
      deliverable: "Synthèse des flux",
      dependencies: [],
    },
  ],
  exclusions: ["Aucune décision automatique sur les apprenants."],
  assumptions: ["Les responsables valideront les rôles."],
  openQuestions: ["Quel moyen de paiement sera retenu ?"],
  acceptanceCriteria: ["Les dossiers sont consultables."],
  verificationChecklist: ["Tester une inscription complète."],
};

function mockValidSnapshot() {
  vi.mocked(callUserData)
    .mockResolvedValueOnce({
      ok: true, status: 200, data: [{ id: "project-001", user_id: "user-001" }],
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: [{
        version: 2,
        source_brief_version: 1,
        payload: plan,
        payload_digest: createProjectMemoryDigest(plan),
        scope_digest: createProjectMemoryDigest(plan.includedScope),
      }],
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: [{
        version: 1,
        payload: brief,
        payload_digest: createProjectMemoryDigest(brief),
      }],
    });
}

beforeEach(() => mockValidSnapshot());
afterEach(() => vi.clearAllMocks());

describe("loadProjectFactoryContext", () => {
  it("loads the latest project, plan and source brief and builds bounded mission context", async () => {
    const result = await loadProjectFactoryContext("project-001", "admin-token");

    expect(result).toMatchObject({
      projectId: "project-001",
      briefVersion: 1,
      planVersion: 2,
    });
    expect(result.contextReferences).toContain("project-plan-version:2");
    expect(result.recommendedAgentIds).toContain("analyste-metier");
    expect(result.recommendedAgentIds).toContain("chercheur-documentaire");
    expect(result.recommendationReasons["analyste-metier"]?.length).toBeGreaterThan(0);
    expect(result.contextReferences).toContain("project-brief-version:1");
    expect(result.contextInstructions).toHaveLength(4);
    expect(result.contextInstructions.join("\\n")).toContain("Centre de formation");
    expect(result.contextInstructions.join("\\n")).toContain("Centraliser les inscriptions");
    expect(result.contextInstructions.every((item) => item.length <= 1_800)).toBe(true);
    expect(callUserData).toHaveBeenCalledTimes(3);
  });

  it("rejects a tampered project plan before building agent context", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({
        ok: true, status: 200, data: [{ id: "project-001", user_id: "user-001" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: [{
          version: 2,
          source_brief_version: 1,
          payload: plan,
          payload_digest: "a".repeat(64),
          scope_digest: createProjectMemoryDigest(plan.includedScope),
        }],
      });

    await expect(loadProjectFactoryContext("project-001", "admin-token"))
      .rejects.toThrow("PROJECT_CONTEXT_INTEGRITY_FAILED");
    expect(callUserData).toHaveBeenCalledTimes(2);
  });

  it("rejects a missing source brief instead of inventing project context", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({
        ok: true, status: 200, data: [{ id: "project-001", user_id: "user-001" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: [{
          version: 2,
          source_brief_version: 1,
          payload: plan,
          payload_digest: createProjectMemoryDigest(plan),
          scope_digest: createProjectMemoryDigest(plan.includedScope),
        }],
      })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] });

    await expect(loadProjectFactoryContext("project-001", "admin-token"))
      .rejects.toThrow("PROJECT_CONTEXT_INTEGRITY_FAILED");
  });

  it("rejects access to a project without an accessible owner record", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] });

    await expect(loadProjectFactoryContext("project-001", "admin-token"))
      .rejects.toThrow("PROJECT_NOT_FOUND");
    expect(callUserData).toHaveBeenCalledTimes(1);
  });
});
