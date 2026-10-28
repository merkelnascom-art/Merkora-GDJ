import { describe, expect, it } from "vitest";
import { fromCloudProjectRow, toCloudProjectRow, type CloudProjectRow, type Project } from "./project-types";

const localProject: Project = {
  id: "MK-ABC-1234",
  title: "Student Vision",
  category: "education" as Project["category"],
  problem: "Les élèves après le bac ne savent pas quels métiers choisir selon leurs résultats.",
  desiredOutcome: "Explorer des métiers et des formations adaptés.",
  budget: "À définir",
  urgency: "soon",
  status: "discovery",
  recommendations: [{ title: "Orientation", description: "Explorer les parcours.", reason: "Besoin d'orientation." }],
  createdAt: "2026-10-28T10:00:00.000Z",
};

describe("cloud project mapping", () => {
  it("maps local urgency values to the database constraint values", () => {
    const row = toCloudProjectRow(localProject, "user-uuid");
    expect(row.user_id).toBe("user-uuid");
    expect(row.urgency).toBe("high");
    expect(row.desired_outcome).toBe(localProject.desiredOutcome);
  });

  it("restores a cloud row without losing project details", () => {
    const row: CloudProjectRow = {
      id: localProject.id,
      user_id: "user-uuid",
      title: localProject.title,
      category: "other",
      problem: localProject.problem,
      desired_outcome: localProject.desiredOutcome,
      budget: localProject.budget,
      urgency: "urgent",
      status: localProject.status,
      recommendations: localProject.recommendations,
      created_at: localProject.createdAt,
      updated_at: localProject.createdAt,
    };
    const restored = fromCloudProjectRow(row);
    expect(restored.id).toBe(localProject.id);
    expect(restored.desiredOutcome).toBe(localProject.desiredOutcome);
    expect(restored.urgency).toBe("urgent");
    expect(restored.recommendations).toEqual(localProject.recommendations);
  });
});
