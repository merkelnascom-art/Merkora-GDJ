import { describe, expect, it } from "vitest";
import { toProjectRecord, toSupabaseProjectRow, type SupabaseProjectRow } from "./project-record";

const row: SupabaseProjectRow = {
  id: "MK-123",
  user_id: "user-1",
  title: "Suivre mon activité",
  category: "business",
  problem: "Je ne vois pas les recettes",
  desired_outcome: "Un suivi clair",
  budget: "À définir",
  urgency: "normal",
  status: "discovery",
  recommendations: [{ title: "Clarifier", description: "Définir", reason: "Éviter les oublis" }],
  created_at: "2026-10-28T10:00:00.000Z",
  updated_at: "2026-10-28T10:00:00.000Z",
};

describe("Supabase project record mapping", () => {
  it("maps a database row to the UI model", () => {
    expect(toProjectRecord(row)).toEqual({
      id: "MK-123",
      title: "Suivre mon activité",
      category: "business",
      problem: "Je ne vois pas les recettes",
      desiredOutcome: "Un suivi clair",
      budget: "À définir",
      urgency: "normal",
      status: "discovery",
      recommendations: row.recommendations,
      createdAt: row.created_at,
    });
  });

  it("maps a UI project to an owner-scoped database row", () => {
    const project = toProjectRecord(row);
    const mapped = toSupabaseProjectRow(project, "user-1");
    expect(mapped.user_id).toBe("user-1");
    expect(mapped.desired_outcome).toBe(project.desiredOutcome);
    expect(mapped.recommendations).toEqual(project.recommendations);
    expect(mapped.id).toBe(project.id);
  });

  it("falls back to an empty recommendations list for invalid database data", () => {
    expect(toProjectRecord({ ...row, recommendations: null as unknown as [] }).recommendations).toEqual([]);
  });
});
