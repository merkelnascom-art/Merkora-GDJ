import type { NeedInput, Recommendation, ProjectStatus } from "@/lib/solution-recommendations";

export type ProjectRecord = NeedInput & {
  id: string;
  createdAt: string;
  status: ProjectStatus;
  recommendations: Recommendation[];
};

export type SupabaseProjectRow = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  problem: string;
  desired_outcome: string;
  budget: string;
  urgency: string;
  status: string;
  recommendations: Recommendation[];
  created_at: string;
  updated_at: string;
};

export function toProjectRecord(row: SupabaseProjectRow): ProjectRecord {
  return {
    id: row.id,
    title: row.title,
    category: row.category as NeedInput["category"],
    problem: row.problem,
    desiredOutcome: row.desired_outcome,
    budget: row.budget,
    urgency: row.urgency as NeedInput["urgency"],
    status: row.status as ProjectStatus,
    recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
    createdAt: row.created_at,
  };
}

export function toSupabaseProjectRow(project: ProjectRecord, userId: string) {
  return {
    id: project.id,
    user_id: userId,
    title: project.title,
    category: project.category,
    problem: project.problem,
    desired_outcome: project.desiredOutcome,
    budget: project.budget,
    urgency: project.urgency,
    status: project.status,
    recommendations: project.recommendations,
    created_at: project.createdAt,
    updated_at: new Date().toISOString(),
  };
}
