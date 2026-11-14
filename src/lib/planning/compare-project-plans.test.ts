import { describe, expect, it } from "vitest";
import { generateProjectPlan } from "./generate-project-plan";
import { compareProjectPlans } from "./compare-project-plans";
import type { PlanTask, ProjectPlan } from "./plan-types";

function makePlan(projectId = "MK-DIFF-001", version = 1): ProjectPlan {
  return generateProjectPlan({
    projectId,
    briefVersion: version,
    planVersion: version,
    plannerVersion: "1.0.0",
    need: {
      title: "Gestion d'équipe",
      category: "organization",
      problem: "Je ne sais pas qui est présent dans mon équipe et quelles tâches avancent.",
      desiredOutcome: "Suivre les présences et les responsabilités de chaque personne.",
      budget: "À définir",
      urgency: "normal",
    },
  });
}

function extraTask(id: string, title: string): PlanTask {
  return {
    id,
    kind: "implementation",
    title,
    purpose: "Ajouter une capacité explicitement demandée.",
    priority: "medium",
    dependencies: ["task-design-03"],
    deliverable: title,
    acceptanceCriteria: ["La capacité est vérifiable dans le périmètre approuvé."],
    effort: "unknown",
    uncertaintyNotes: ["Effort à réévaluer."],
  };
}

describe("compareProjectPlans", () => {
  it("identifies an added selected feature and the task introduced for it", () => {
    const before = makePlan();
    const after = {
      ...makePlan("MK-DIFF-001", 2),
      includedScope: [...makePlan("MK-DIFF-001", 2).includedScope, {
        id: "overtime",
        title: "Suivi des heures supplémentaires",
        description: "Consigner les heures validées.",
        source: "selected_option" as const,
      }],
      tasks: [...makePlan("MK-DIFF-001", 2).tasks, extraTask("task-overtime-01", "Configurer le suivi des heures supplémentaires")],
    };

    const diff = compareProjectPlans(before, after);

    expect(diff.scope.added.map((item) => item.id)).toContain("overtime");
    expect(diff.tasks.added.map((task) => task.id)).toContain("task-overtime-01");
    expect(diff.hasChanges).toBe(true);
  });

  it("identifies a removed feature and its removed task", () => {
    const before = {
      ...makePlan(),
      includedScope: [{
        id: "attendance",
        title: "Suivi des présences",
        description: "Enregistrer les arrivées.",
        source: "selected_option" as const,
      }],
      tasks: [...makePlan().tasks, extraTask("task-attendance-01", "Configurer le suivi des présences")],
    };
    const after = makePlan("MK-DIFF-001", 2);

    const diff = compareProjectPlans(before, after);

    expect(diff.scope.removed.map((item) => item.id)).toContain("attendance");
    expect(diff.tasks.removed.map((task) => task.id)).toContain("task-attendance-01");
  });

  it("detects changed assumptions, open questions and estimate", () => {
    const before = makePlan();
    const after = {
      ...makePlan("MK-DIFF-001", 2),
      assumptions: ["Le budget est désormais confirmé."],
      openQuestions: ["Quel format de rapport faut-il exporter ?"],
      estimate: { ...makePlan("MK-DIFF-001", 2).estimate, effortBand: "high" as const },
    };

    const diff = compareProjectPlans(before, after);

    expect(diff.assumptions.added).toContain("Le budget est désormais confirmé.");
    expect(diff.assumptions.removed.length).toBeGreaterThan(0);
    expect(diff.openQuestions.added).toContain("Quel format de rapport faut-il exporter ?");
    expect(diff.estimateChanged).toBe(true);
  });

  it("does not report unchanged sections as changed", () => {
    const before = makePlan();
    const after = { ...makePlan("MK-DIFF-001", 2), version: 2, briefVersion: 2 };

    const diff = compareProjectPlans(before, after);

    expect(diff.scope.added).toHaveLength(0);
    expect(diff.scope.removed).toHaveLength(0);
    expect(diff.tasks.added).toHaveLength(0);
    expect(diff.tasks.removed).toHaveLength(0);
    expect(diff.tasks.changed).toHaveLength(0);
    expect(diff.assumptions.added).toHaveLength(0);
    expect(diff.assumptions.removed).toHaveLength(0);
    expect(diff.estimateChanged).toBe(false);
    expect(diff.hasChanges).toBe(false);
  });

  it("rejects plans belonging to different projects", () => {
    expect(() => compareProjectPlans(makePlan("MK-A"), makePlan("MK-B", 2)))
      .toThrow(/même projet/i);
  });

  it("does not mutate either source plan", () => {
    const before = makePlan();
    const after = {
      ...makePlan("MK-DIFF-001", 2),
      includedScope: [{
        id: "attendance",
        title: "Suivi des présences",
        description: "Enregistrer les arrivées.",
        source: "selected_option" as const,
      }],
    };
    const beforeSnapshot = structuredClone(before);
    const afterSnapshot = structuredClone(after);

    compareProjectPlans(before, after);

    expect(before).toEqual(beforeSnapshot);
    expect(after).toEqual(afterSnapshot);
  });
});
