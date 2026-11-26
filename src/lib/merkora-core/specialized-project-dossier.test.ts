import { describe, expect, it } from "vitest";
import { buildSpecializedProjectDossier } from "./specialized-project-dossier";

describe("specialized project dossier", () => {
  it("preserves explicit choices and client notes as unreviewed source evidence", () => {
    const dossier = buildSpecializedProjectDossier({
      id: "student-vision-draft",
      configuratorId: "education",
      generatedAt: "2026-11-26T12:00:00.000Z",
      answers: {
        education_model: "career_orientation",
        audience: ["students", "job_seekers"],
        assessment: ["quizzes", "riddles", "interest_tests"],
        progression: ["career_suggestions", "recommendations"],
      },
      notes: {
        assessment: "Les résultats doivent expliquer pourquoi un métier est proposé.",
      },
    });

    expect(dossier).toMatchObject({
      id: "student-vision-draft",
      status: "draft_needs_review",
      source: { journey: "catalogue_specialized_configurator", configuratorId: "education", configuratorVersion: 1 },
      createdAt: "2026-11-26T12:00:00.000Z",
      productContext: { domainIds: ["education"], candidateModuleIds: ["learner_records", "learning_schedule", "pedagogical_tracking", "quizzes_assessments", "career_orientation"] },
      commercial: { quoteCreated: false, orderCreated: false },
    });
    expect(dossier?.answers).toEqual(expect.arrayContaining([
      expect.objectContaining({ stepId: "education_model", value: "career_orientation" }),
      expect.objectContaining({ stepId: "assessment", value: ["quizzes", "riddles", "interest_tests"] }),
    ]));
    expect(dossier?.evidence).toEqual(expect.arrayContaining([
      expect.objectContaining({ stepId: "assessment", kind: "explicit_selection", classification: "user_provided" }),
      expect.objectContaining({ stepId: "assessment", kind: "client_note", content: "Les résultats doivent expliquer pourquoi un métier est proposé.", classification: "user_provided" }),
    ]));
    expect(dossier?.interpretation).toEqual({ facts: [], deductions: [], hypotheses: [], humanReviewRequired: true });
  });

  it("distinguishes unanswered visible steps from questions skipped by a conditional path", () => {
    const dossier = buildSpecializedProjectDossier({
      id: "orientation-draft",
      configuratorId: "education",
      answers: {
        education_model: "career_orientation",
        audience: ["students"],
        assessment: ["quizzes"],
      },
      notes: {},
    });

    expect(dossier?.unansweredStepIds).toContain("progression");
    expect(dossier?.skippedStepIds).toContain("learning_content");
    expect(dossier?.unansweredStepIds).not.toContain("learning_content");
  });

  it("does not invent interpretations or include answers from another configurator", () => {
    const dossier = buildSpecializedProjectDossier({
      id: "shop-draft",
      configuratorId: "ecommerce",
      answers: {
        selling_model: ["digital_products"],
        catalogue: ["photos", "descriptions"],
        inventory: "automatic_stock",
        checkout: ["mobile_money"],
        fulfilment: ["digital_delivery"],
        after_sales: ["customer_support"],
        assessment: ["interest_tests"],
      },
      notes: {},
    });

    expect(dossier?.answers.map((answer) => answer.stepId)).not.toContain("assessment");
    expect(dossier?.skippedStepIds).toContain("inventory");
    expect(dossier?.interpretation.deductions).toEqual([]);
    expect(dossier?.interpretation.hypotheses).toEqual([]);
  });

  it("returns no dossier for an unknown configurator", () => {
    expect(buildSpecializedProjectDossier({
      id: "invalid",
      configuratorId: "unknown",
      answers: {},
      notes: {},
    })).toBeUndefined();
  });
});
