import { describe, expect, it } from "vitest";
import { analyzeNeed } from "../discovery";
import type { NeedInput } from "../solution-recommendations";
import { generateProjectPlan } from "./generate-project-plan";
import type { ProjectPlanInput } from "./plan-types";

function makeInput(overrides: Partial<NeedInput> = {}, extras: Partial<ProjectPlanInput> = {}): ProjectPlanInput {
  const need: NeedInput = {
    title: "Suivi d'équipe commerciale",
    category: "organization",
    problem: "Je ne sais pas qui est présent et quelles tâches avancent dans mon équipe.",
    desiredOutcome: "Suivre les présences, les responsabilités et l'avancement des tâches.",
    budget: "À définir",
    urgency: "normal",
    ...overrides,
  };

  return {
    projectId: "MK-PLAN-001",
    briefVersion: 1,
    planVersion: 1,
    plannerVersion: "1.0.0",
    need,
    discovery: analyzeNeed(need),
    selectedOptions: [],
    approvedScope: [],
    confirmedConstraints: [],
    ...extras,
  };
}

describe("generateProjectPlan", () => {
  it("creates a draft plan with a distinct delivery lifecycle for a complete team-management brief", () => {
    const plan = generateProjectPlan(makeInput());

    expect(plan.status).toBe("draft");
    expect(plan.projectId).toBe("MK-PLAN-001");
    expect(plan.tasks.map((task) => task.kind)).toEqual(
      expect.arrayContaining(["analysis", "design", "implementation", "verification"]),
    );
    expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
    expect(plan.milestones.length).toBeGreaterThanOrEqual(3);
  });

  it("creates an education-oriented plan without inventing retail or inventory features", () => {
    const plan = generateProjectPlan(makeInput({
      title: "Student Vision",
      category: "digital",
      problem: "Les élèves ont du mal à choisir leur orientation après le bac et à comprendre leurs possibilités.",
      desiredOutcome: "Explorer des métiers et des formations selon leurs intérêts et leurs résultats.",
    }));

    expect(plan.domain).toBe("education");
    const scopeText = JSON.stringify(plan.includedScope).toLowerCase();
    expect(scopeText).not.toMatch(/stock|inventaire|caisse|boutique|retail/);
    expect(plan.proposedArchitecture?.components.join(" ").toLowerCase()).not.toMatch(/caisse|inventaire/);
  });

  it("plans a creative production and approval workflow instead of a software application", () => {
    const plan = generateProjectPlan(makeInput({
      title: "Identité visuelle",
      category: "creative",
      problem: "Mon entreprise a besoin d'une identité visuelle cohérente pour ses supports de communication.",
      desiredOutcome: "Obtenir un logo, une palette et des supports validés avant impression.",
    }));

    expect(plan.domain).toBe("creative");
    expect(plan.tasks.some((task) => task.kind === "production")).toBe(true);
    expect(plan.tasks.some((task) => task.kind === "implementation")).toBe(false);
    expect(plan.proposedArchitecture).toBeNull();
  });

  it("includes only explicitly selected options and approved scope, not unselected recommendations", () => {
    const plan = generateProjectPlan(makeInput({}, {
      selectedOptions: [{ id: "attendance", title: "Suivi des présences", description: "Enregistrer les arrivées." }],
      approvedScope: [{ id: "staff-dashboard", label: "Tableau de bord du personnel" }],
    }));

    expect(plan.includedScope.map((item) => item.id)).toEqual(["attendance", "staff-dashboard"]);
    expect(plan.suggestions.some((item) => item.title === "Clarifier le besoin")).toBe(true);
  });

  it("keeps missing budget, deadline, team size and infrastructure as unknowns", () => {
    const plan = generateProjectPlan(makeInput({ budget: "" }));

    expect(plan.assumptions.join(" ").toLowerCase()).toMatch(/budget/);
    expect(plan.assumptions.join(" ").toLowerCase()).toMatch(/délai|date/);
    expect(plan.assumptions.join(" ").toLowerCase()).toMatch(/effectif|utilisateur|équipe/);
    expect(plan.assumptions.join(" ").toLowerCase()).toMatch(/infrastructure|hébergement/);
    expect(plan.estimate.calendarDays).toBeNull();
    expect(plan.estimate.price).toBeNull();
  });

  it("returns needs_clarification for an incomplete brief and asks targeted questions", () => {
    const plan = generateProjectPlan(makeInput({
      title: "Projet",
      problem: "Je ne sais pas",
      desiredOutcome: "",
    }));

    expect(plan.status).toBe("needs_clarification");
    expect(plan.openQuestions.length).toBeGreaterThan(0);
    expect(plan.tasks).toHaveLength(0);
  });

  it("gives every task a stable id, a deliverable and verifiable acceptance criteria", () => {
    const plan = generateProjectPlan(makeInput());

    expect(new Set(plan.tasks.map((task) => task.id)).size).toBe(plan.tasks.length);
    for (const task of plan.tasks) {
      expect(task.deliverable.trim()).not.toBe("");
      expect(task.acceptanceCriteria.length).toBeGreaterThan(0);
      expect(task.id).toMatch(/^task-/);
    }
  });

  it("uses only valid acyclic task dependencies", () => {
    const plan = generateProjectPlan(makeInput());
    const ids = new Set(plan.tasks.map((task) => task.id));

    for (const task of plan.tasks) {
      for (const dependency of task.dependencies) {
        expect(ids.has(dependency)).toBe(true);
        expect(dependency).not.toBe(task.id);
      }
    }

    const byId = new Map(plan.tasks.map((task) => [task.id, task]));
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const visit = (id: string) => {
      if (visiting.has(id)) throw new Error("Task dependency cycle detected");
      if (visited.has(id)) return;
      visiting.add(id);
      for (const dependency of byId.get(id)?.dependencies ?? []) visit(dependency);
      visiting.delete(id);
      visited.add(id);
    };
    for (const id of ids) visit(id);
  });

  it("does not invent external vendors, API keys or cloud providers", () => {
    const plan = generateProjectPlan(makeInput());

    expect(JSON.stringify(plan)).not.toMatch(/api[_ -]?key|openai|aws|azure|firebase|stripe/i);
  });

  it("records the source brief version, plan version and planner version", () => {
    const plan = generateProjectPlan(makeInput({}, {
      briefVersion: 4,
      planVersion: 3,
      plannerVersion: "1.2.0",
    }));

    expect(plan.briefVersion).toBe(4);
    expect(plan.version).toBe(3);
    expect(plan.plannerVersion).toBe("1.2.0");
  });

  it("produces equivalent content for equivalent inputs without timestamps or random ids", () => {
    const input = makeInput();
    const first = generateProjectPlan(input);
    const second = generateProjectPlan(input);

    expect(first).toEqual(second);
    expect(first).not.toHaveProperty("createdAt");
    expect(JSON.stringify(first)).not.toMatch(/2026-|createdAt|updatedAt/);
  });
});
