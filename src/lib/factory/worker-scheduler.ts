export type FactoryTaskState =
  | "not_started"
  | "ready"
  | "in_progress"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

export type FactoryTaskCandidate = {
  id: string;
  taskKey: string;
  state: FactoryTaskState;
  dependencies: string[];
  evidenceRequired: boolean;
  evidenceCount: number;
  externalSideEffect: boolean;
};

export type SelectedFactoryTask = { taskId: string; taskKey: string };

/**
 * Deterministically selects one safe task for a worker to execute.
 * This is a scheduling policy only: it does not claim a database lease,
 * authorize a job, or execute commands. The worker must re-check those
 * conditions atomically at the persistence boundary before running anything.
 */
export function selectNextFactoryTask(
  tasks: FactoryTaskCandidate[],
): SelectedFactoryTask | null {
  for (const task of tasks) {
    if (task.state !== "not_started" && task.state !== "ready") continue;
    if (task.externalSideEffect) continue;

    const dependenciesSatisfied = task.dependencies.every((dependencyKey) => {
      const dependency = tasks.find((candidate) => candidate.taskKey === dependencyKey);
      return dependency?.state === "completed"
        && (!dependency.evidenceRequired || dependency.evidenceCount > 0);
    });

    if (dependenciesSatisfied) {
      return { taskId: task.id, taskKey: task.taskKey };
    }
  }

  return null;
}
