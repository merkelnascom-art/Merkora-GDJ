import { describe, expect, it } from "vitest";
import { generateProjectPlan } from "./generate-project-plan";
import { assessExecutionReadiness } from "./execution-readiness";
import type { ProjectPlan, ProjectPlanInput } from "./plan-types";

const input: ProjectPlanInput = {
  projectId: "MK-GATE-001",
  briefVersion: 1,
  planVersion: 1,
  plannerVersion: "1.0.0",
  need: {
    title: "Gestion d'équipe",
    category: "organization",
    problem: "Je veux suivre les présences et les responsabilités de mon équipe.",
    desiredOutcome: "Suivre les présences et les responsabilités.",
    budget: "À définir",
    urgency: "normal",
  },
  selectedOptions: [{
    id: "attendance",
    title: "Suivi des présences",
    description: "Enregistrer les arrivées et départs.",
  }],
};

function readyPlan(): ProjectPlan {
  const plan = generateProjectPlan(input);
  return {
    ...plan,
    status: "ready_for_review",
    openQuestions: [],
    acceptanceCriteria: ["Les présences peuvent être enregistrées et vérifiées."],
    tasks: plan.tasks.map((task) => ({
      ...task,
      acceptanceCriteria: task.acceptanceCriteria.length
        ? task.acceptanceCriteria
        : ["Le livrable est vérifiable."],
    })),
  };
}

describe("assessExecutionReadiness", () => {
  it("blocks execution unless all approval gates are explicitly satisfied", () => {
    const result = assessExecutionReadiness(readyPlan(), {
      planApproved: false,
      scopeApproved: false,
      executionAuthorized: false,
    });

    expect(result.ready).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      expect.stringMatching(/plan/i),
      expect.stringMatching(/périmètre/i),
      expect.stringMatching(/autorisation/i),
    ]));
  });

  it("allows the gate only when plan, scope and execution authorization are explicit", () => {
    const result = assessExecutionReadiness(readyPlan(), {
      planApproved: true,
      scopeApproved: true,
      executionAuthorized: true,
    });

    expect(result.ready).toBe(true);
    expect(result.blockers).toEqual([]);
  });

  it("blocks clarification plans even if all boolean approvals are true", () => {
    const plan = generateProjectPlan({
      ...input,
      need: { ...input.need, problem: "Aide-moi." },
    });
    const result = assessExecutionReadiness(plan, {
      planApproved: true,
      scopeApproved: true,
      executionAuthorized: true,
    });

    expect(result.ready).toBe(false);
    expect(result.blockers.some((blocker) => /clarification/i.test(blocker))).toBe(true);
  });

  it("blocks a plan with no confirmed scope", () => {
    const plan = readyPlan();
    const result = assessExecutionReadiness({ ...plan, includedScope: [] }, {
      planApproved: true,
      scopeApproved: true,
      executionAuthorized: true,
    });

    expect(result.ready).toBe(false);
    expect(result.blockers.some((blocker) => /aucun élément de périmètre/i.test(blocker))).toBe(true);
  });

  it("blocks tasks without acceptance criteria", () => {
    const plan = readyPlan();
    const result = assessExecutionReadiness({
      ...plan,
      tasks: plan.tasks.map((task, index) => index === 0 ? { ...task, acceptanceCriteria: [] } : task),
    }, {
      planApproved: true,
      scopeApproved: true,
      executionAuthorized: true,
    });

    expect(result.ready).toBe(false);
    expect(result.blockers.some((blocker) => /critère d'acceptation/i.test(blocker))).toBe(true);
  });
});
