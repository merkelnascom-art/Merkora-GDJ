export interface ExecutionGraphTask {
  id: string;
  dependencyIds: readonly string[];
}

/**
 * Validates a task dependency graph and returns a deterministic topological order.
 * Dependencies always appear before the task that consumes them.
 */
export function orderExecutionTasks(tasks: readonly ExecutionGraphTask[]): string[] {
  const byId = new Map<string, ExecutionGraphTask>();

  for (const task of tasks) {
    if (!task.id.trim()) throw new Error("A task identifier is required.");
    if (byId.has(task.id)) throw new Error("Duplicate task identifier.");
    byId.set(task.id, task);
  }

  for (const task of tasks) {
    for (const dependencyId of task.dependencyIds) {
      if (!byId.has(dependencyId)) throw new Error("Unknown task dependency.");
      if (dependencyId === task.id) throw new Error("Cyclic task dependencies.");
    }
  }

  const remainingDependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, string[]>();

  for (const task of tasks) {
    remainingDependencies.set(task.id, new Set(task.dependencyIds));
    for (const dependencyId of task.dependencyIds) {
      const list = dependents.get(dependencyId) ?? [];
      list.push(task.id);
      dependents.set(dependencyId, list);
    }
  }

  const ready = [...byId.keys()]
    .filter((id) => remainingDependencies.get(id)?.size === 0)
    .sort();
  const ordered: string[] = [];

  while (ready.length > 0) {
    const id = ready.shift();
    if (!id) continue;
    ordered.push(id);

    for (const dependentId of dependents.get(id) ?? []) {
      const dependencies = remainingDependencies.get(dependentId);
      dependencies?.delete(id);
      if (dependencies?.size === 0) {
        ready.push(dependentId);
        ready.sort();
      }
    }
  }

  if (ordered.length !== tasks.length) {
    throw new Error("Cyclic task dependencies.");
  }

  return ordered;
}
