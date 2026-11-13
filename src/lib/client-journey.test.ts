import { describe, expect, it } from "vitest";
import {
  createClientJourneyState,
  getNextJourneyStage,
  canEnterJourneyStage,
  restoreClientJourneyState,
  type ClientJourneyInput,
} from "./client-journey";

function readyInput(overrides: Partial<ClientJourneyInput> = {}): ClientJourneyInput {
  return {
    projectId: "project-1",
    currentStage: "understanding",
    discovery: {
      stage: "solution_review",
      contradictions: [],
      nextQuestion: "",
      remainingGaps: [],
      readyForSolutionReview: true,
      reason: "Les éléments nécessaires sont clarifiés.",
      evaluation: {
        clientStatements: [],
        hypothesesToConfirm: [],
        unresolvedUnknowns: [],
        blockingStages: [],
        blockingQuestions: [],
        status: "reviewable",
        solutionReviewAllowed: true,
      },
    },
    decisions: {
      selectedProposalIds: [],
      proposalSelectionConfirmed: false,
      selectedConceptId: null,
      designValidated: false,
    },
    ...overrides,
  };
}

describe("client journey", () => {
  it("starts a new project in understanding, never in a commercial stage", () => {
    expect(createClientJourneyState("project-1")).toEqual({
      projectId: "project-1",
      stage: "understanding",
      completedStages: [],
      pendingQuestion: null,
    });
  });

  it("keeps an unresolved critical discovery gap in understanding", () => {
    const input = readyInput({
      discovery: {
        stage: "constraints",
        contradictions: [],
        nextQuestion: "Comment cela fonctionne-t-il actuellement ?",
        remainingGaps: ["constraints"],
        readyForSolutionReview: false,
        reason: "Une contrainte reste à clarifier.",
        evaluation: { clientStatements: [], hypothesesToConfirm: [], unresolvedUnknowns: ["Une contrainte reste à clarifier."], blockingStages: ["constraints"], blockingQuestions: ["Comment cela fonctionne-t-il actuellement ?"], status: "blocked", solutionReviewAllowed: false },
      },
    });

    expect(canEnterJourneyStage("proposals", input)).toBe(false);
    expect(getNextJourneyStage(input)).toBe("understanding");
  });

  it("blocks proposals while a contradiction remains unresolved", () => {
    const input = readyInput({
      discovery: {
        stage: "resolve_contradiction",
        contradictions: [{
          topic: "access",
          statementA: "Tout le monde doit consulter.",
          statementB: "Seul le responsable doit consulter.",
          question: "Qui doit consulter ?",
          confirmationRequired: true,
        }],
        nextQuestion: "Qui doit consulter ?",
        remainingGaps: ["resolve_contradiction"],
        readyForSolutionReview: false,
        reason: "Des indications se contredisent.",
        evaluation: { clientStatements: [], hypothesesToConfirm: [], unresolvedUnknowns: ["Des indications se contredisent."], blockingStages: ["resolve_contradiction"], blockingQuestions: ["Qui doit consulter ?"], status: "blocked", solutionReviewAllowed: false },
      },
    });

    expect(canEnterJourneyStage("proposals", input)).toBe(false);
  });


  it("fails closed when legacy readiness flags conflict with the evaluation", () => {
    const input = readyInput({
      discovery: {
        stage: "solution_review",
        contradictions: [],
        nextQuestion: "Quel point reste à confirmer ?",
        remainingGaps: [],
        readyForSolutionReview: true,
        reason: "Les anciens indicateurs indiquent que la découverte est prête.",
        evaluation: {
          clientStatements: ["Je veux suivre les visiteurs."],
          hypothesesToConfirm: ["Le suivi pourrait nécessiter une identification."],
          unresolvedUnknowns: ["L'accord des visiteurs reste à confirmer."],
          blockingStages: ["privacy_and_consent"],
          blockingQuestions: ["Les visiteurs seront-ils informés ?"],
          status: "blocked",
          solutionReviewAllowed: false,
        },
      },
    });

    expect(canEnterJourneyStage("proposals", input)).toBe(false);
    expect(getNextJourneyStage(input)).toBe("understanding");
  });

  it("does not turn AI recommendations into confirmed client decisions", () => {
    const input = readyInput({
      decisions: {
        selectedProposalIds: [],
        proposalSelectionConfirmed: false,
        selectedConceptId: null,
        designValidated: false,
      },
    });

    expect(canEnterJourneyStage("concept", input)).toBe(false);
    expect(canEnterJourneyStage("realization", input)).toBe(false);
  });

  it("allows compatible multi-selection but waits for the client's continue action", () => {
    const selected = readyInput({
      currentStage: "proposals",
      decisions: {
        selectedProposalIds: ["proposal-a", "proposal-b"],
        proposalSelectionConfirmed: false,
        selectedConceptId: null,
        designValidated: false,
      },
    });

    expect(canEnterJourneyStage("concept", selected)).toBe(false);
    expect(getNextJourneyStage(selected)).toBe("proposals");
    expect(canEnterJourneyStage("concept", {
      ...selected,
      decisions: { ...selected.decisions, proposalSelectionConfirmed: true },
    })).toBe(true);
  });

  it("does not confuse concept validation with quote acceptance or payment", () => {
    const input = readyInput({
      currentStage: "validation",
      decisions: {
        selectedProposalIds: ["proposal-a"],
        proposalSelectionConfirmed: true,
        selectedConceptId: "concept-a",
        designValidated: true,
      },
      commercial: { quoteAccepted: false, paymentCompleted: false },
    });

    expect(canEnterJourneyStage("realization", input)).toBe(true);
    expect(getNextJourneyStage(input)).toBe("realization");
  });

  it("restores a saved stage without clearing completed stages or the pending question", () => {
    const saved = {
      projectId: "project-1",
      stage: "personalization",
      completedStages: ["understanding", "analysis", "proposals", "concept"],
      pendingQuestion: "Quel élément souhaitez-vous ajuster ?",
    };

    expect(restoreClientJourneyState(saved)).toEqual(saved);
  });

  it("returns the safe welcome state for missing project identifiers", () => {
    expect(createClientJourneyState(null)).toEqual({
      projectId: null,
      stage: "welcome",
      completedStages: [],
      pendingQuestion: null,
    });
    expect(restoreClientJourneyState({
      projectId: "",
      stage: "realization",
      completedStages: ["validation"],
      pendingQuestion: null,
    }).stage).toBe("welcome");
  });

  it("returns to understanding for an unknown saved stage when a project exists", () => {
    expect(restoreClientJourneyState({
      projectId: "project-1",
      stage: "billing",
      completedStages: ["understanding"],
      pendingQuestion: null,
    }).stage).toBe("understanding");
  });
});
