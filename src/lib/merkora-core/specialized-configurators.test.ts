import { describe, expect, it } from "vitest";
import {
  getSpecializedConfigurator,
  validateSpecializedConfiguratorAnswers,
} from "./specialized-configurators";

describe("specialized configurators", () => {
  it("gives e-commerce its own sales, stock, checkout and fulfilment decisions", () => {
    const configurator = getSpecializedConfigurator("ecommerce");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "selling_model", "catalogue", "inventory", "checkout", "fulfilment", "after_sales",
    ]);
    expect(configurator?.moduleIds).toEqual(expect.arrayContaining([
      "product_catalog", "inventory_movements", "order_management", "delivery_tracking",
    ]));
  });

  it("models reservation resources, capacity, time slots and booking lifecycle", () => {
    const configurator = getSpecializedConfigurator("reservation");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "bookable_resource", "availability", "capacity", "booking_policy", "notifications",
    ]);
    expect(configurator?.moduleIds).toContain("reservation_slots");
  });

  it("separates operational management, responsibilities and financial approvals", () => {
    const configurator = getSpecializedConfigurator("business_management");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "organization", "people_and_roles", "workflows", "financial_controls", "reporting",
    ]);
    expect(configurator?.moduleIds).toContain("expense_approval");
  });

  it("supports both school workflows and assessment-led orientation without forcing school administration", () => {
    const configurator = getSpecializedConfigurator("education");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "education_model", "audience", "learning_content", "assessment", "progression",
    ]);
    expect(configurator?.steps.find((step) => step.id === "education_model")?.options)
      .toEqual(expect.arrayContaining(["school_management", "career_orientation", "training"]));
  });

  it("treats digitization as a document processing and archive workflow", () => {
    const configurator = getSpecializedConfigurator("digitization");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "intake", "capture", "recognition", "classification", "search_and_retention",
    ]);
    expect(configurator?.steps.find((step) => step.id === "recognition")?.options)
      .toContain("ocr");
  });

  it("defines game-specific modes, rules, sessions and scoring", () => {
    const configurator = getSpecializedConfigurator("games");
    expect(configurator?.steps.map((step) => step.id)).toEqual([
      "game_format", "players", "rules", "session_flow", "scoring_and_progression",
    ]);
    expect(configurator?.moduleIds).toContain("game_rules_engine");
  });

  it("rejects answers that do not belong to the selected configurator", () => {
    const result = validateSpecializedConfiguratorAnswers("ecommerce", {
      selling_model: "retail",
      assessment: "multiple_choice",
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "unknown_step" }),
    ]));
  });

  it("rejects unsupported options rather than silently accepting malformed configuration", () => {
    const result = validateSpecializedConfiguratorAnswers("reservation", {
      bookable_resource: "appointment",
      availability: "whenever",
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "invalid_option", path: "availability" }),
    ]));
  });
});
