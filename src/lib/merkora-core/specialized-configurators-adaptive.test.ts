import { describe, expect, it } from "vitest";
import {
  getSpecializedConfigurator,
  getVisibleConfiguratorSteps,
  validateSpecializedConfiguratorAnswers,
} from "./specialized-configurators";

describe("adaptive configurator paths", () => {
  it("keeps Student Vision on an orientation path without asking for school course administration", () => {
    const visible = getVisibleConfiguratorSteps("education", {
      education_model: "career_orientation",
    });
    expect(visible.map((step) => step.id)).not.toContain("learning_content");
    expect(visible.map((step) => step.id)).toContain("assessment");
    expect(visible.map((step) => step.id)).toContain("progression");
  });

  it("includes teaching content questions for a school or training project", () => {
    const visible = getVisibleConfiguratorSteps("education", {
      education_model: "training",
    });
    expect(visible.map((step) => step.id)).toContain("learning_content");
  });

  it("skips stock configuration when a shop sells only digital products", () => {
    const visible = getVisibleConfiguratorSteps("ecommerce", {
      selling_model: ["digital_products"],
    });
    expect(visible.map((step) => step.id)).not.toContain("inventory");
    expect(visible.map((step) => step.id)).toContain("checkout");
  });

  it("does not require answers for steps excluded by the selected path", () => {
    const result = validateSpecializedConfiguratorAnswers("education", {
      education_model: "career_orientation",
      audience: ["students"],
      assessment: ["quizzes", "interest_tests"],
      progression: ["career_suggestions"],
    });
    expect(result.valid).toBe(true);
  });

  it("returns independent step definitions so one screen cannot mutate the shared catalogue", () => {
    const first = getSpecializedConfigurator("education");
    if (first?.steps[0].options) first.steps[0].options.push("corrupt");
    const second = getSpecializedConfigurator("education");
    expect(second?.steps[0].options).not.toContain("corrupt");
  });
});
