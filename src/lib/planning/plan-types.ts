import type { DiscoveryDomain, DiscoveryResult } from "../discovery";
import type { NeedInput, Recommendation } from "../solution-recommendations";

export type ProjectPlanStatus = "needs_clarification" | "draft" | "ready_for_review";

export type PlanScopeInput = {
  id: string;
  label: string;
  description?: string;
};

export type PlanSelectedOption = {
  id: string;
  title: string;
  description: string;
};

export type ConfirmedConstraint = {
  key: string;
  value: string;
};

export type ProjectPlanInput = {
  projectId: string;
  briefVersion: number;
  planVersion: number;
  plannerVersion: string;
  need: NeedInput;
  discovery?: DiscoveryResult;
  selectedOptions?: PlanSelectedOption[];
  approvedScope?: PlanScopeInput[];
  confirmedConstraints?: ConfirmedConstraint[];
};

export type PlanTaskKind =
  | "analysis"
  | "scope"
  | "design"
  | "implementation"
  | "production"
  | "verification"
  | "handover";

export type PlanPriority = "high" | "medium" | "low";

export type PlanEffortBand = "low" | "medium" | "high" | "unknown";

export type PlanTask = {
  id: string;
  kind: PlanTaskKind;
  title: string;
  purpose: string;
  priority: PlanPriority;
  dependencies: string[];
  deliverable: string;
  acceptanceCriteria: string[];
  effort: PlanEffortBand;
  uncertaintyNotes: string[];
};

export type PlanMilestone = {
  id: string;
  title: string;
  taskIds: string[];
  exitCriteria: string[];
};

export type PlanEstimate = {
  effortBand: PlanEffortBand;
  confidence: "low" | "medium" | "high";
  notes: string[];
  calendarDays: number | null;
  price: number | null;
};

export type ProjectPlan = {
  id: string;
  projectId: string;
  version: number;
  briefVersion: number;
  plannerVersion: string;
  status: ProjectPlanStatus;
  domain: DiscoveryDomain;
  summary: string;
  goals: string[];
  includedScope: Array<{ id: string; title: string; description: string; source: "selected_option" | "approved_scope" }>;
  suggestions: Recommendation[];
  exclusions: string[];
  assumptions: string[];
  openQuestions: string[];
  proposedArchitecture: {
    style: string;
    description: string;
    components: string[];
  } | null;
  tasks: PlanTask[];
  milestones: PlanMilestone[];
  estimate: PlanEstimate;
  acceptanceCriteria: string[];
  verificationChecklist: string[];
};
