export type OfficialMockupStatus = "draft" | "changes_requested" | "approved";

export type OwnedProjectSnapshot = {
  id: string;
  title: string;
  category: string;
  problem: string;
  desired_outcome: string;
  budget: string;
  urgency: string;
  recommendations: unknown[];
};

export type OfficialMockupSnapshot = Record<string, unknown> & {
  project: {
    id: string;
    title: string;
    category: string;
    problem: string;
    desiredOutcome: string;
    budget: string;
    urgency: string;
    recommendations: unknown[];
  };
  studio: Record<string, unknown> & { reviewStatus: OfficialMockupStatus };
  version: number;
  snapshotCreatedAt: string;
  officialDecision: {
    status: OfficialMockupStatus;
    actorUserId: string;
    recordedAt: string;
  };
};

/**
 * Build an immutable, server-stamped mockup record.
 * Project identity and business details always come from the owner-scoped DB row,
 * never from the browser's submitted project object.
 */
export function createOfficialMockupSnapshot(
  input: Record<string, unknown>,
  ownedProject: OwnedProjectSnapshot,
  actorUserId: string,
  version: number,
  recordedAt: string,
): OfficialMockupSnapshot {
  const studio = input.studio as Record<string, unknown>;
  const status = studio.reviewStatus as OfficialMockupStatus;

  return {
    ...input,
    project: {
      id: ownedProject.id,
      title: ownedProject.title,
      category: ownedProject.category,
      problem: ownedProject.problem,
      desiredOutcome: ownedProject.desired_outcome,
      budget: ownedProject.budget,
      urgency: ownedProject.urgency,
      recommendations: ownedProject.recommendations,
    },
    studio: { ...studio, reviewStatus: status },
    version,
    snapshotCreatedAt: recordedAt,
    officialDecision: {
      status,
      actorUserId,
      recordedAt,
    },
  };
}
