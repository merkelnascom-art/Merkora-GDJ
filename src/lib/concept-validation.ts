export type ConceptDecisionStatus = "draft" | "changes_requested" | "approved";
export type ConceptDecisionAction = "request_changes" | "approve";

export type ConceptDecisionRecord = {
  conceptVersionId: string;
  status: Exclude<ConceptDecisionStatus, "draft">;
  clientNote: string;
  decidedAt: string | null;
  decidedBy: string | null;
};

export type ConceptValidationState = {
  currentVersionId: string;
  status: ConceptDecisionStatus;
  clientNote: string;
  updatedAt: string | null;
  updatedBy: string | null;
  history: ConceptDecisionRecord[];
};

export type ConceptDecisionInput = {
  conceptVersionId: string;
  action: ConceptDecisionAction;
  clientNote?: string;
  decidedAt?: string | null;
  decidedBy?: string | null;
};

export function createConceptValidationState(conceptVersionId: string): ConceptValidationState {
  return {
    currentVersionId: conceptVersionId,
    status: "draft",
    clientNote: "",
    updatedAt: null,
    updatedBy: null,
    history: [],
  };
}

export function recordConceptDecision(
  state: ConceptValidationState,
  decision: ConceptDecisionInput,
): ConceptValidationState {
  if (!decision.conceptVersionId || decision.conceptVersionId !== state.currentVersionId) return state;

  const status = decision.action === "approve" ? "approved" : "changes_requested";
  const record: ConceptDecisionRecord = {
    conceptVersionId: decision.conceptVersionId,
    status,
    clientNote: typeof decision.clientNote === "string" ? decision.clientNote.trim().slice(0, 1200) : "",
    decidedAt: typeof decision.decidedAt === "string" && decision.decidedAt.trim() ? decision.decidedAt : null,
    decidedBy: typeof decision.decidedBy === "string" && decision.decidedBy.trim() ? decision.decidedBy : null,
  };

  return {
    ...state,
    status,
    clientNote: record.clientNote,
    updatedAt: record.decidedAt,
    updatedBy: record.decidedBy,
    history: [...state.history, record].slice(-10),
  };
}

export function startNewConceptVersion(
  state: ConceptValidationState,
  conceptVersionId: string,
): ConceptValidationState {
  if (!conceptVersionId.trim() || conceptVersionId === state.currentVersionId) return state;
  return {
    ...state,
    currentVersionId: conceptVersionId,
    status: "draft",
    clientNote: "",
    updatedAt: null,
    updatedBy: null,
  };
}

export function createConceptVersionId(
  projectId: string,
  project: { title?: string; problem?: string; desiredOutcome?: string; recommendations?: Array<{ title?: string; description?: string; reason?: string }> },
  snapshot: {
    solutionFormat?: string | null;
    format?: string;
    formatConfirmed?: boolean;
    palette?: string;
    enabledModules?: string[];
    selectedRecommendationIds?: string[];
    selectedProfessionCandidateIds?: string[];
    selectedUniversalSectorIds?: string[];
    selectedDeliverableFormats?: string[];
    diagnosticResponses?: Record<string, string>;
  },
): string {
  const legacyDigital = snapshot.solutionFormat === undefined && Boolean(snapshot.format);
  const material = JSON.stringify({
    project: {
      title: project.title ?? "",
      problem: project.problem ?? "",
      desiredOutcome: project.desiredOutcome ?? "",
      recommendations: (project.recommendations ?? []).map((item) => ({ title: item.title ?? "", description: item.description ?? "", reason: item.reason ?? "" })),
    },
    solutionFormat: snapshot.solutionFormat === undefined
      ? legacyDigital ? "digital" : null
      : snapshot.solutionFormat,
    displayFormat: snapshot.formatConfirmed === true || legacyDigital ? snapshot.format ?? null : null,
    palette: snapshot.palette ?? "violet",
    enabledModules: [...(snapshot.enabledModules ?? [])].sort(),
    selectedRecommendationIds: [...(snapshot.selectedRecommendationIds ?? [])].sort(),
    selectedProfessionCandidateIds: [...(snapshot.selectedProfessionCandidateIds ?? [])].sort(),
    selectedUniversalSectorIds: [...(snapshot.selectedUniversalSectorIds ?? [])].sort(),
    selectedDeliverableFormats: [...(snapshot.selectedDeliverableFormats ?? [])].sort(),
    diagnosticResponses: Object.fromEntries(Object.entries(snapshot.diagnosticResponses ?? {}).sort(([a], [b]) => a.localeCompare(b))),
  });
  let hash = 2166136261;
  for (let index = 0; index < material.length; index += 1) {
    hash ^= material.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${projectId}:concept-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
