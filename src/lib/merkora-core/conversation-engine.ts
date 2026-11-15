import type { NeedDimension, NeedEvidence, ConversationMessage, QuestionCandidate, ValidationDecision } from "./types";
export interface UnderstandingSession {
  id: string;
  conversationId: string;
  originalDescription: string;
  messages: ConversationMessage[];
  evidence: NeedEvidence[];
  validations: ValidationDecision[];
  askedQuestionIds: string[];
  deferredDimensions: NeedDimension[];
  stage: "clarification" | "summary_validation" | "complete";
  pendingQuestion: QuestionCandidate | null;
  summary?: string;
  version: number;
}
export function beginUnderstanding(_rawIntent: string): UnderstandingSession {
  return {} as UnderstandingSession;
}
export function answerUnderstanding(_session: UnderstandingSession, _answer: string): UnderstandingSession {
  return {} as UnderstandingSession;
}
export function decideUnderstandingSummary(_session: UnderstandingSession, _decision: "confirmed" | "corrected" | "rejected" | "deferred", _correction?: string): UnderstandingSession {
  return {} as UnderstandingSession;
}
