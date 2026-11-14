import type { ProjectPlan } from "./plan-types";

export type ExecutionApprovalState = {
  planApproved: boolean;
  scopeApproved: boolean;
  executionAuthorized: boolean;
};

export type ExecutionReadiness = {
  ready: boolean;
  blockers: string[];
};

/**
 * Pure safety gate for the future factory.
 *
 * This function does not start jobs, persist approvals or infer consent.
 * Callers must provide explicit approval state from a trusted, auditable source.
 */
export function assessExecutionReadiness(
  plan: ProjectPlan,
  approvals: ExecutionApprovalState,
): ExecutionReadiness {
  const blockers: string[] = [];

  if (plan.status !== "ready_for_review") {
    blockers.push("Le plan doit être complet et prêt pour examen avant toute exécution.");
  }
  if (plan.openQuestions.length > 0) {
    blockers.push("Des questions de clarification restent ouvertes.");
  }
  if (plan.includedScope.length === 0) {
    blockers.push("Aucun élément de périmètre n'est confirmé.");
  }
  if (plan.tasks.length === 0) {
    blockers.push("Le plan ne contient aucune tâche de réalisation vérifiable.");
  }
  if (plan.tasks.some((task) => task.acceptanceCriteria.length === 0)) {
    blockers.push("Chaque tâche doit avoir au moins un critère d'acceptation vérifiable.");
  }
  if (plan.acceptanceCriteria.length === 0) {
    blockers.push("Le plan doit définir des critères d'acceptation globaux.");
  }
  if (!approvals.planApproved) {
    blockers.push("Le plan n'a pas été explicitement approuvé.");
  }
  if (!approvals.scopeApproved) {
    blockers.push("Le périmètre exact n'a pas été explicitement approuvé.");
  }
  if (!approvals.executionAuthorized) {
    blockers.push("Aucune autorisation explicite de lancer l'exécution n'est fournie.");
  }

  return {
    ready: blockers.length === 0,
    blockers,
  };
}
