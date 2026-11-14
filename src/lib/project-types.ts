import type { DiscoveryResult } from "./discovery";
import type { NeedInput, ProjectStatus, Recommendation } from "./solution-recommendations";

export type Project = NeedInput & {
  id: string;
  createdAt: string;
  status: ProjectStatus;
  recommendations: Recommendation[];
  discovery?: DiscoveryResult;
};

export type CloudProjectRow = {
  id: string;
  user_id: string;
  title: string;
  category: NeedInput["category"];
  problem: string;
  desired_outcome: string;
  budget: string;
  urgency: "low" | "normal" | "high" | "urgent";
  status: ProjectStatus;
  recommendations: Recommendation[];
  created_at: string;
  updated_at: string;
};

export function toCloudProjectRow(project: Project, userId: string) {
  return {
    id: project.id,
    user_id: userId,
    title: project.title,
    category: project.category,
    problem: project.problem,
    desired_outcome: project.desiredOutcome,
    budget: project.budget,
    urgency: project.urgency === "soon" ? "high" : project.urgency === "urgent" ? "urgent" : "normal",
    status: project.status,
    recommendations: project.recommendations,
    created_at: project.createdAt,
    updated_at: new Date().toISOString(),
  };
}

export function fromCloudProjectRow(row: CloudProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    problem: row.problem,
    desiredOutcome: row.desired_outcome,
    budget: row.budget,
    urgency: row.urgency === "urgent" ? "urgent" : row.urgency === "high" ? "soon" : "normal",
    status: row.status,
    recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
    createdAt: row.created_at,
  };
}
