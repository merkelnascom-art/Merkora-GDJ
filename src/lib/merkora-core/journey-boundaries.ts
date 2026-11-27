export type CustomerJourney = "catalogue" | "idp" | "drt";

export interface JourneyTransitionRequest {
  from: CustomerJourney;
  to: CustomerJourney;
  /** The customer must explicitly request every cross-journey hand-off. */
  customerRequested: boolean;
  /** IDP-to-DRT hand-off additionally requires the assigned counselor's agreement. */
  counselorApproved?: boolean;
}

/**
 * Keeps the three customer journeys independent.
 * A transition is possible only through an explicit customer request; IDP-to-DRT
 * also requires counselor approval. No transition is implicit or automatic.
 */
export function canTransitionJourney(request: JourneyTransitionRequest): boolean {
  if (!request.customerRequested || request.from === request.to) return false;

  if (request.from === "catalogue" && (request.to === "idp" || request.to === "drt")) {
    return true;
  }

  if (request.from === "idp" && request.to === "drt") {
    return request.counselorApproved === true;
  }

  if (request.from === "drt" && request.to === "idp") {
    return true;
  }

  return false;
}

/** Identifies a DRT understanding session without accepting Catalogue/IDP dossiers. */
export function isDrtUnderstandingSessionPayload(value: unknown): value is {
  originalDescription: string;
  messages: unknown[];
  evidence: unknown[];
  stage: string;
} {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.originalDescription === "string"
    && Array.isArray(candidate.messages)
    && Array.isArray(candidate.evidence)
    && typeof candidate.stage === "string";
}
