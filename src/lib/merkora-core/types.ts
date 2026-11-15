export type EvidenceStatus = "user_stated" | "observed" | "inferred" | "hypothesis" | "unknown" | "validated" | "rejected";
export type NeedDimension = "context" | "actor" | "activity" | "problem" | "cause" | "goal" | "expected_outcome" | "constraint" | "resource" | "business_rule" | "risk" | "preference" | "project_scope" | "unknown";
export interface NeedEvidence {
  id: string;
  dimension: NeedDimension;
  value: string;
  status: EvidenceStatus;
  sourceMessageId?: string;
  sourceQuote?: string;
  confidence?: number;
  rationale?: string;
  createdAt: string;
  supersedesId?: string;
}
export interface NeedProfile {
  id: string;
  conversationId: string;
  originalDescription: string;
  evidence: NeedEvidence[];
  unresolvedQuestions: string[];
  contradictionIds: string[];
  currentSummary?: string;
  version: number;
  updatedAt: string;
}
export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "visitor" | "merkora" | "system";
  content: string;
  createdAt: string;
  relatedEvidenceIds?: string[];
}
export interface ValidationDecision {
  id: string;
  conversationId: string;
  subject: string;
  presentedText: string;
  decision: "confirmed" | "corrected" | "rejected" | "deferred";
  correction?: string;
  evidenceIds: string[];
  createdAt: string;
}
export interface QuestionCandidate {
  id: string;
  dimension: NeedDimension;
  prompt: string;
  rationale: string;
  impact: number;
  uncertainty: number;
  decisionRelevance: number;
  answerability: number;
}
export interface QuestionPlannerInput {
  candidates: QuestionCandidate[];
  answeredDimensions: NeedDimension[];
  deferredDimensions: NeedDimension[];
  askedQuestionIds: string[];
}
export interface QuestionScoreBreakdown {
  impact: number;
  uncertainty: number;
  decisionRelevance: number;
  answerability: number;
  total: number;
}
export type QuestionPlan =
  | { kind: "question"; question: QuestionCandidate; score: QuestionScoreBreakdown }
  | { kind: "complete"; reason: "no_actionable_question" };
export interface RuleAssertion {
  id: string;
  subject: string;
  predicate: string;
  value: string | number | boolean;
  scopeKey: string;
  contextKey: string;
  sourceEvidenceId: string;
}
export interface ApparentContradiction {
  id: string;
  status: "apparent" | "confirmed";
  subject: string;
  predicate: string;
  scopeKey: string;
  contextKey: string;
  assertionIds: [string, string];
  evidenceIds: [string, string];
  explanation: string;
  confirmationEvidenceId?: string;
}
