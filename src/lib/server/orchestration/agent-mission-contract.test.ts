import { describe, expect, it } from "vitest";
import {
  createAgentMissionEnvelope,
  validateAgentMissionResult,
  type AgentMissionResult,
} from "./agent-mission-contract";

const missionInput = {
  missionId: "mission-001",
  projectId: "project-001",
  role: "architect" as const,
  objective: "Proposer une architecture sûre et évolutive.",
  instructions: ["Analyser les besoins", "Identifier les composants et leurs responsabilités"],
  contextReferences: ["project:brief:v1", "repository:branch:feature-x"],
  constraints: ["Ne pas modifier la production", "Ne pas exposer de secrets"],
  approvalRequiredFor: ["database.write", "production.deploy"],
};

const validResult: AgentMissionResult = {
  contractVersion: 1,
  missionId: "mission-001",
  projectId: "project-001",
  providerId: "anthropic",
  status: "completed",
  summary: "Architecture proposée et vérifications documentées.",
  findings: [{ severity: "info", title: "Séparation des responsabilités", detail: "Les modules sont isolés." }],
  artifacts: [{ kind: "document", reference: "artifact://architecture-v1" }],
  verification: {
    performed: ["Revue des dépendances"],
    passed: ["Périmètre projet"],
    failed: [],
    notPerformed: ["Test de charge"],
  },
  requiresHumanDecision: false,
};

describe("agent mission contract", () => {
  it("creates a bounded provider-neutral mission packet", () => {
    expect(createAgentMissionEnvelope(missionInput)).toEqual({
      contractVersion: 1,
      ...missionInput,
      expectedOutput: { summary: true, findings: true, artifacts: true, verification: true },
    });
  });

  it("rejects empty objectives and oversized instruction sets", () => {
    expect(() => createAgentMissionEnvelope({ ...missionInput, objective: " " }))
      .toThrow("Mission objective must be non-empty and within its length limit.");
    expect(() => createAgentMissionEnvelope({ ...missionInput, instructions: [] }))
      .toThrow("Mission must contain between 1 and 20 instructions.");
  });

  it("deduplicates context references and approval boundaries", () => {
    const mission = createAgentMissionEnvelope({
      ...missionInput,
      contextReferences: ["repo:main", "repo:main"],
      approvalRequiredFor: ["deploy", "deploy"],
    });
    expect(mission.contextReferences).toEqual(["repo:main"]);
    expect(mission.approvalRequiredFor).toEqual(["deploy"]);
  });

  it("accepts a result only for the exact project and mission", () => {
    expect(validateAgentMissionResult(missionInput, validResult)).toEqual(validResult);
    expect(() => validateAgentMissionResult(
      { missionId: "another-mission", projectId: "project-001" },
      validResult,
    )).toThrow("Mission result scope mismatch.");
    expect(() => validateAgentMissionResult(
      { missionId: "mission-001", projectId: "another-project" },
      validResult,
    )).toThrow("Mission result scope mismatch.");
  });

  it("does not allow a completed result with failed verification", () => {
    expect(() => validateAgentMissionResult(missionInput, {
      ...validResult,
      verification: { ...validResult.verification, failed: ["Typecheck"] },
    })).toThrow("A result with failed verification cannot be marked completed.");
  });

  it("rejects oversized result collections", () => {
    expect(() => validateAgentMissionResult(missionInput, {
      ...validResult,
      artifacts: Array.from({ length: 51 }, (_, index) => ({
        kind: "document" as const,
        reference: `artifact://${index}`,
      })),
    })).toThrow("Mission result collection limit exceeded.");
  });
});
