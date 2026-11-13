import { CLIENT_JOURNEY_STAGES, type ClientJourneyStage } from "./client-journey";

export type ClientWorkspaceView = "home" | Exclude<ClientJourneyStage, "welcome">;

export function getClientWorkspaceView(
  stage: unknown,
  hasProject: boolean,
): ClientWorkspaceView {
  if (!hasProject || typeof stage !== "string") return "home";
  if (!CLIENT_JOURNEY_STAGES.includes(stage as ClientJourneyStage) || stage === "welcome") {
    return "home";
  }
  return stage as ClientWorkspaceView;
}

export function shouldShowCommercialPanels(
  stage: ClientJourneyStage,
  hasCommercialRecord: boolean,
): boolean {
  return stage === "realization" && hasCommercialRecord;
}
