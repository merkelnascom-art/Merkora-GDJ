export type ProjectMemoryEventType =
  | "brief_version_created"
  | "plan_version_created"
  | "decision_recorded"
  | "approval_recorded"
  | "task_started"
  | "task_completed"
  | "task_blocked"
  | "task_failed"
  | "job_interrupted"
  | "job_resumed"
  | "evidence_recorded"
  | "delivery_recorded";

export type ProjectMemoryEvent = {
  id: string;
  projectId: string;
  type: ProjectMemoryEventType;
  occurredAt: string;
  actorId: string;
  correlationId: string;
  briefVersion?: number;
  planVersion?: number;
  taskId?: string;
  summary: string;
};

export type MemoryTaskState =
  | "not_started"
  | "ready"
  | "in_progress"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

export type MemoryTask = {
  id: string;
  state: MemoryTaskState;
  dependencies: string[];
  evidenceRequired: boolean;
  evidenceIds: string[];
  externalSideEffect: boolean;
  resultIsKnown: boolean;
};

export type ResumeDecision = {
  taskId: string;
  action: "resume" | "verify_first" | "blocked" | "skip";
  reason: string;
};

/**
 * Classifies task recovery without executing any work.
 * This is intentionally a pure policy function: it does not read storage,
 * grant permissions, call external services, or enqueue a job.
 */
export function assessTaskResumability(tasks: MemoryTask[]): ResumeDecision[] {
  const taskIds = new Set(tasks.map((task) => task.id));

  return tasks.map((task) => {
    if (task.state === "completed" || task.state === "cancelled") {
      if (task.state === "completed" && task.evidenceRequired && task.evidenceIds.length === 0) {
        return {
          taskId: task.id,
          action: "blocked",
          reason: "La tâche est déclarée terminée mais aucune preuve obligatoire n'est enregistrée.",
        };
      }
      return {
        taskId: task.id,
        action: "skip",
        reason: task.state === "completed"
          ? "La tâche est déjà terminée."
          : "La tâche a été annulée.",
      };
    }

    const missingDependencies = task.dependencies.filter((dependency) => {
      if (!taskIds.has(dependency)) return true;
      const dependencyTask = tasks.find((candidate) => candidate.id === dependency);
      return dependencyTask?.state !== "completed"
        || (dependencyTask.evidenceRequired && dependencyTask.evidenceIds.length === 0);
    });

    if (missingDependencies.length > 0) {
      return {
        taskId: task.id,
        action: "blocked",
        reason: `Dépendances non terminées ou introuvables : ${missingDependencies.join(", ")}.`,
      };
    }

    if (task.state === "blocked") {
      return {
        taskId: task.id,
        action: "blocked",
        reason: "La tâche est bloquée et nécessite une résolution explicite avant reprise.",
      };
    }

    if (task.externalSideEffect && !task.resultIsKnown) {
      return {
        taskId: task.id,
        action: "verify_first",
        reason: "Le résultat d'une action externe est incertain ; vérifier l'état cible avant toute répétition.",
      };
    }

    if (task.state === "failed") {
      return {
        taskId: task.id,
        action: "verify_first",
        reason: "Examiner l'échec et ses preuves avant de décider d'une nouvelle tentative.",
      };
    }

    return {
      taskId: task.id,
      action: "resume",
      reason: "La tâche peut être reprise après revalidation du manifeste et des autorisations par le serveur.",
    };
  });
}

/**
 * Produces a compact, deterministic resume snapshot from already-authorized
 * project data. The caller remains responsible for authentication, persistence,
 * version/digest checks and redaction of sensitive information.
 */
export function createProjectResumeSnapshot(input: {
  projectId: string;
  briefVersion: number | null;
  planVersion: number | null;
  jobStatus: "queued" | "planning" | "building" | "testing" | "repairing" | "awaiting_approval" | "ready" | "blocked" | "failed" | "delivered" | "interrupted";
  tasks: MemoryTask[];
  requiredApprovals: string[];
  recordedApprovals: string[];
  evidenceCount: number;
}) {
  const decisions = assessTaskResumability(input.tasks);
  const missingApprovals = input.requiredApprovals.filter(
    (approval) => !input.recordedApprovals.includes(approval),
  );

  const blockedTasks = decisions.filter((decision) => decision.action === "blocked");
  const verifyFirstTasks = decisions.filter((decision) => decision.action === "verify_first");
  const resumableTasks = decisions.filter((decision) => decision.action === "resume");

  const canResume = input.briefVersion !== null
    && input.planVersion !== null
    && missingApprovals.length === 0
    && blockedTasks.length === 0
    && verifyFirstTasks.length === 0
    && input.tasks.length > 0
    && input.jobStatus !== "delivered"
    && input.jobStatus !== "failed"
    && input.jobStatus !== "interrupted";

  return {
    projectId: input.projectId,
    briefVersion: input.briefVersion,
    planVersion: input.planVersion,
    jobStatus: input.jobStatus,
    canResume,
    missingApprovals,
    resumableTaskIds: resumableTasks.map((decision) => decision.taskId),
    verifyFirstTaskIds: verifyFirstTasks.map((decision) => decision.taskId),
    blockedTasks,
    evidenceCount: Math.max(0, Math.floor(input.evidenceCount)),
    requiresHumanReview: missingApprovals.length > 0
      || blockedTasks.length > 0
      || verifyFirstTasks.length > 0
      || input.jobStatus === "interrupted",
  };
}
