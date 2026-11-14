import { recommendAgentsForProjectPlan } from "@/lib/agents/agent-recommendation";
import { matchesProjectMemoryDigest } from "@/lib/factory/project-memory-digest";
import { callUserData } from "@/lib/server/supabase-rest";

type JsonRecord = Record<string, unknown>;

export type ProjectFactoryContextSnapshot = {
  projectId: string;
  briefVersion: number;
  planVersion: number;
  planDigest: string;
  scopeDigest: string;
  contextReferences: string[];
  contextInstructions: string[];
  recommendedAgentIds: string[];
  recommendationReasons: Readonly<Record<string, readonly string[]>>;
};

function record(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function requiredText(value: unknown, max = 2_000): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("PROJECT_CONTEXT_INTEGRITY_FAILED");
  }
  return value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max);
}

function optionalText(value: unknown, max = 500): string {
  return typeof value === "string"
    ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max)
    : "";
}

function boundedList(value: unknown, maxItems: number, maxText = 300): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [optionalText(item, maxText)];
    if (record(item)) {
      const title = optionalText(item.title ?? item.label, 160);
      const description = optionalText(item.description, maxText);
      return [description ? `${title || "Élément"} : ${description}` : title].filter(Boolean);
    }
    return [];
  });
}

function buildContextInstructions(brief: JsonRecord, plan: JsonRecord): string[] {
  const briefLines = [
    `Activité : ${requiredText(brief.title, 160)}`,
    `Domaine déclaré : ${requiredText(brief.category, 80)}`,
    `Problème décrit : ${requiredText(brief.problem, 900)}`,
    `Résultat recherché : ${requiredText(brief.desiredOutcome, 700)}`,
    `Budget indiqué : ${optionalText(brief.budget, 100) || "non renseigné"}`,
    `Urgence : ${optionalText(brief.urgency, 80) || "non renseignée"}`,
  ];

  const scope = boundedList(plan.includedScope, 12, 220);
  const tasks = Array.isArray(plan.tasks)
    ? plan.tasks.slice(0, 10).flatMap((item) => {
        if (!record(item)) return [];
        return [
          `${optionalText(item.title, 120)} — ${optionalText(item.purpose, 220)} ; livrable : ${optionalText(item.deliverable, 180)} ; dépendances : ${boundedList(item.dependencies, 6, 60).join(", ") || "aucune"}`,
        ];
      })
    : [];
  const criteria = [
    ...boundedList(plan.acceptanceCriteria, 8, 180),
    ...boundedList(plan.verificationChecklist, 8, 180),
  ];

  const chunks = [
    `Dossier client : ${briefLines.join(" | ")}`,
    [
      `Plan version ${String(plan.version)} — domaine : ${optionalText(plan.domainLabel, 100)}.`,
      `Résumé : ${requiredText(plan.summary, 500)}`,
      `Objectifs : ${boundedList(plan.goals, 8, 180).join(" | ") || "non précisés"}`,
      `Périmètre inclus : ${scope.join(" | ") || "aucun élément explicitement inclus"}`,
    ].join("\n"),
    `Tâches du plan : ${tasks.join(" | ") || "aucune tâche détaillée"}`,
    [
      `Exclusions : ${boundedList(plan.exclusions, 8, 150).join(" | ") || "non précisées"}`,
      `Hypothèses : ${boundedList(plan.assumptions, 8, 150).join(" | ") || "aucune"}`,
      `Questions ouvertes : ${boundedList(plan.openQuestions, 8, 150).join(" | ") || "aucune"}`,
      `Critères et vérifications : ${criteria.join(" | ") || "à définir"}`,
    ].join("\n"),
  ];

  return chunks.map((chunk) => chunk.slice(0, 1_800));
}

/**
 * Loads the latest immutable project brief/plan snapshot for server-side
 * mission preparation. Both stored digests and the included-scope digest are
 * checked before any project data is forwarded to an AI provider.
 */
export async function loadProjectFactoryContext(
  projectId: string,
  accessToken: string,
): Promise<ProjectFactoryContextSnapshot> {
  if (!projectId.trim() || projectId.length > 100 || !accessToken.trim()) {
    throw new Error("PROJECT_CONTEXT_SCOPE_INVALID");
  }

  const planResult = await callUserData(
    `project_memory_plan_versions?select=version,source_brief_version,payload,payload_digest,scope_digest&project_id=eq.${encodeURIComponent(projectId)}&order=version.desc&limit=1`,
    "GET",
    accessToken,
  );
  if (!planResult.ok) throw new Error("PROJECT_CONTEXT_READ_FAILED");
  const planRows = Array.isArray(planResult.data) ? planResult.data : [];
  const latestPlan = planRows[0];
  if (
    !record(latestPlan)
    || typeof latestPlan.version !== "number"
    || !Number.isInteger(latestPlan.version)
    || latestPlan.version < 1
    || typeof latestPlan.source_brief_version !== "number"
    || !Number.isInteger(latestPlan.source_brief_version)
    || latestPlan.source_brief_version < 1
    || typeof latestPlan.payload_digest !== "string"
    || typeof latestPlan.scope_digest !== "string"
    || !record(latestPlan.payload)
  ) {
    throw new Error("PROJECT_PLAN_NOT_FOUND");
  }

  const plan = latestPlan.payload;
  if (
    plan.projectId !== projectId
    || plan.version !== latestPlan.version
    || plan.briefVersion !== latestPlan.source_brief_version
    || !Array.isArray(plan.includedScope)
    || !matchesProjectMemoryDigest(plan, latestPlan.payload_digest)
    || !matchesProjectMemoryDigest(plan.includedScope, latestPlan.scope_digest)
  ) {
    throw new Error("PROJECT_CONTEXT_INTEGRITY_FAILED");
  }

  const briefResult = await callUserData(
    `project_memory_brief_versions?select=version,payload,payload_digest&project_id=eq.${encodeURIComponent(projectId)}&version=eq.${latestPlan.source_brief_version}&limit=1`,
    "GET",
    accessToken,
  );
  if (!briefResult.ok) throw new Error("PROJECT_CONTEXT_READ_FAILED");
  const briefRows = Array.isArray(briefResult.data) ? briefResult.data : [];
  const briefRow = briefRows[0];
  if (
    !record(briefRow)
    || briefRow.version !== latestPlan.source_brief_version
    || !record(briefRow.payload)
    || typeof briefRow.payload_digest !== "string"
    || !matchesProjectMemoryDigest(briefRow.payload, briefRow.payload_digest)
  ) {
    throw new Error("PROJECT_CONTEXT_INTEGRITY_FAILED");
  }

  const recommendation = recommendAgentsForProjectPlan({
    domainId: typeof plan.domainId === "string" ? plan.domainId : null,
    summary: optionalText(plan.summary, 1_000),
    tasks: Array.isArray(plan.tasks)
      ? plan.tasks.flatMap((task) => record(task) && typeof task.kind === "string" ? [{ kind: task.kind }] : [])
      : [],
    includedScope: plan.includedScope.flatMap((item) => record(item) ? [{
      id: optionalText(item.id, 100),
      title: optionalText(item.title, 160),
      description: optionalText(item.description, 500),
    }] : []),
  });

  return {
    projectId,
    briefVersion: latestPlan.source_brief_version,
    planVersion: latestPlan.version,
    planDigest: latestPlan.payload_digest,
    scopeDigest: latestPlan.scope_digest,
    recommendedAgentIds: recommendation.agentIds,
    recommendationReasons: recommendation.reasons,
    contextReferences: [
      `project-brief-version:${latestPlan.source_brief_version}`,
      `project-brief-digest:${briefRow.payload_digest}`,
      `project-plan-version:${latestPlan.version}`,
      `project-plan-digest:${latestPlan.payload_digest}`,
      `project-scope-digest:${latestPlan.scope_digest}`,
    ],
    contextInstructions: buildContextInstructions(briefRow.payload, plan),
  };
}
