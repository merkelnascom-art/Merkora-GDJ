import { describe, expect, it } from "vitest";
import { selectNextQuestion } from "./question-planner";
import { confirmConflict, detectApparentContradictions } from "./consistency";
import type { QuestionCandidate, RuleAssertion } from "./types";

const candidate = (overrides: Partial<QuestionCandidate> & Pick<QuestionCandidate, "id" | "dimension">): QuestionCandidate => ({
  prompt: "Question de clarification",
  rationale: "Cette réponse peut modifier la conception.",
  impact: 0.5,
  uncertainty: 0.5,
  decisionRelevance: 0.5,
  answerability: 0.5,
  ...overrides,
});

describe("selectNextQuestion", () => {
  it("selects the question with the highest transparent priority score", () => {
    const result = selectNextQuestion({
      candidates: [
        candidate({ id: "low", dimension: "preference", impact: 0.2, uncertainty: 0.2, decisionRelevance: 0.2, answerability: 0.5 }),
        candidate({ id: "high", dimension: "problem", impact: 1, uncertainty: 0.9, decisionRelevance: 1, answerability: 0.8 }),
      ],
      answeredDimensions: [],
      deferredDimensions: [],
      askedQuestionIds: [],
    });

    expect(result.kind).toBe("question");
    if (result.kind === "question") expect(result.question.id).toBe("high");
  });

  it("returns at most one question and never repeats answered, deferred or already asked items", () => {
    const result = selectNextQuestion({
      candidates: [
        candidate({ id: "already-answered", dimension: "problem" }),
        candidate({ id: "deferred", dimension: "cause" }),
        candidate({ id: "already-asked", dimension: "goal" }),
        candidate({ id: "next", dimension: "constraint" }),
      ],
      answeredDimensions: ["problem"],
      deferredDimensions: ["cause"],
      askedQuestionIds: ["already-asked"],
    });

    expect(result.kind).toBe("question");
    if (result.kind === "question") expect(result.question.id).toBe("next");
  });

  it("uses a stable identifier as a deterministic tie-breaker", () => {
    const result = selectNextQuestion({
      candidates: [
        candidate({ id: "z-question", dimension: "problem" }),
        candidate({ id: "a-question", dimension: "goal" }),
      ],
      answeredDimensions: [],
      deferredDimensions: [],
      askedQuestionIds: [],
    });

    expect(result.kind).toBe("question");
    if (result.kind === "question") expect(result.question.id).toBe("a-question");
  });

  it("explains when no actionable question remains instead of inventing one", () => {
    const result = selectNextQuestion({
      candidates: [candidate({ id: "done", dimension: "problem" })],
      answeredDimensions: ["problem"],
      deferredDimensions: [],
      askedQuestionIds: [],
    });

    expect(result).toEqual({ kind: "complete", reason: "no_actionable_question" });
  });
});

describe("contradiction checking", () => {
  const assertions: RuleAssertion[] = [
    { id: "a1", subject: "centre", predicate: "opens_on_sunday", value: true, scopeKey: "site-1", contextKey: "current-policy", sourceEvidenceId: "e1" },
    { id: "a2", subject: "centre", predicate: "opens_on_sunday", value: false, scopeKey: "site-1", contextKey: "current-policy", sourceEvidenceId: "e2" },
  ];

  it("flags incompatible explicit assertions as apparent, never as confirmed", () => {
    const conflicts = detectApparentContradictions(assertions, ["opens_on_sunday"]);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].status).toBe("apparent");
    expect(conflicts[0].evidenceIds).toEqual(["e1", "e2"]);
  });

  it("does not compare different contexts or predicates not declared exclusive", () => {
    const conflicts = detectApparentContradictions([
      ...assertions,
      { ...assertions[1], id: "a3", contextKey: "future-policy", sourceEvidenceId: "e3" },
    ], []);

    expect(conflicts).toHaveLength(0);
  });

  it("only marks a conflict confirmed after an explicit confirmation reference is supplied", () => {
    const apparent = detectApparentContradictions(assertions, ["opens_on_sunday"])[0];
    const confirmed = confirmConflict(apparent, "user-confirmation-1");

    expect(apparent.status).toBe("apparent");
    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.confirmationEvidenceId).toBe("user-confirmation-1");
  });
});
