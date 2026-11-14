import type { PlanTask, ProjectPlan } from "./plan-types";

export type ProjectPlanDiff = {
  projectId: string;
  fromVersion: number;
  toVersion: number;
  scope: {
    added: ProjectPlan["includedScope"];
    removed: ProjectPlan["includedScope"];
  };
  tasks: {
    added: PlanTask[];
    removed: PlanTask[];
    changed: Array<{ id: string; before: PlanTask; after: PlanTask }>;
  };
  assumptions: { added: string[]; removed: string[] };
  openQuestions: { added: string[]; removed: string[] };
  estimateChanged: boolean;
  hasChanges: boolean;
};

function compareById<T extends { id: string }>(before: T[], after: T[]) {
  const beforeById = new Map(before.map((item) => [item.id, item]));
  const afterById = new Map(after.map((item) => [item.id, item]));

  const added = after.filter((item) => !beforeById.has(item.id));
  const removed = before.filter((item) => !afterById.has(item.id));
  const changed = after.flatMap((item) => {
    const previous = beforeById.get(item.id);
    if (!previous || JSON.stringify(previous) === JSON.stringify(item)) return [];
    return [{ id: item.id, before: previous, after: item }];
  });
  return { added, removed, changed };
}

function compareStrings(before: string[], after: string[]) {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((item) => !beforeSet.has(item)),
    removed: before.filter((item) => !afterSet.has(item)),
  };
}

export function compareProjectPlans(before: ProjectPlan, after: ProjectPlan): ProjectPlanDiff {
  if (before.projectId !== after.projectId) {
    throw new Error("Les deux plans doivent appartenir au même projet.");
  }

  const scope = compareById(before.includedScope, after.includedScope);
  const tasks = compareById(before.tasks, after.tasks) as ProjectPlanDiff["tasks"];
  const assumptions = compareStrings(before.assumptions, after.assumptions);
  const openQuestions = compareStrings(before.openQuestions, after.openQuestions);
  const estimateChanged = JSON.stringify(before.estimate) !== JSON.stringify(after.estimate);

  const hasChanges =
    scope.added.length > 0 ||
    scope.removed.length > 0 ||
    tasks.added.length > 0 ||
    tasks.removed.length > 0 ||
    tasks.changed.length > 0 ||
    assumptions.added.length > 0 ||
    assumptions.removed.length > 0 ||
    openQuestions.added.length > 0 ||
    openQuestions.removed.length > 0 ||
    estimateChanged;

  return {
    projectId: before.projectId,
    fromVersion: before.version,
    toVersion: after.version,
    scope: { added: scope.added, removed: scope.removed },
    tasks,
    assumptions,
    openQuestions,
    estimateChanged,
    hasChanges,
  };
}
