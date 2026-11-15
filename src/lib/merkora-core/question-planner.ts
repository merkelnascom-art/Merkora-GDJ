import type { NeedDimension, QuestionCandidate, QuestionPlan, QuestionPlannerInput, QuestionScoreBreakdown } from "./types";
export const QUESTION_SCORE_WEIGHTS = { impact: 0.35, uncertainty: 0.3, decisionRelevance: 0.25, answerability: 0.1 } as const;
function validateUnitInterval(value: number, field: string, questionId: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`Question "${questionId}" has an invalid ${field}; expected a number between 0 and 1.`);
}
export function scoreQuestion(question: QuestionCandidate): QuestionScoreBreakdown {
  validateUnitInterval(question.impact, "impact", question.id);
  validateUnitInterval(question.uncertainty, "uncertainty", question.id);
  validateUnitInterval(question.decisionRelevance, "decisionRelevance", question.id);
  validateUnitInterval(question.answerability, "answerability", question.id);
  const impact = question.impact * QUESTION_SCORE_WEIGHTS.impact;
  const uncertainty = question.uncertainty * QUESTION_SCORE_WEIGHTS.uncertainty;
  const decisionRelevance = question.decisionRelevance * QUESTION_SCORE_WEIGHTS.decisionRelevance;
  const answerability = question.answerability * QUESTION_SCORE_WEIGHTS.answerability;
  return { impact, uncertainty, decisionRelevance, answerability, total: Number((impact + uncertainty + decisionRelevance + answerability).toFixed(6)) };
}
export function selectNextQuestion(input: QuestionPlannerInput): QuestionPlan {
  const answered = new Set<NeedDimension>(input.answeredDimensions);
  const deferred = new Set<NeedDimension>(input.deferredDimensions);
  const asked = new Set(input.askedQuestionIds);
  const eligible = input.candidates.filter((candidate) =>
    candidate.id.trim().length > 0 && candidate.prompt.trim().length > 0 &&
    !answered.has(candidate.dimension) && !deferred.has(candidate.dimension) && !asked.has(candidate.id)
  ).map((question) => ({ question, score: scoreQuestion(question) }))
   .sort((a, b) => b.score.total - a.score.total || a.question.id.localeCompare(b.question.id));
  const selected = eligible[0];
  return selected ? { kind: "question", question: selected.question, score: selected.score } : { kind: "complete", reason: "no_actionable_question" };
}
