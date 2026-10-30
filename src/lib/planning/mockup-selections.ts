import { buildMockupModel, type MockupConfig } from "../mockup-studio";
import type { Project } from "../project-types";
import type { ProjectPlanInput } from "./plan-types";

type StoredStudioConfig = Partial<MockupConfig>;

function isFormat(value: unknown): value is MockupConfig["format"] {
  return value === "website" || value === "mobile" || value === "dashboard";
}

function isPalette(value: unknown): value is MockupConfig["palette"] {
  return value === "violet" || value === "blue" || value === "emerald" || value === "amber";
}

/** Translate only explicit Studio selections. Default visible suggestions are not treated as customer approval. */
export function buildSelectedPlanOptions(
  project: Project,
  saved: StoredStudioConfig,
): NonNullable<ProjectPlanInput["selectedOptions"]> {
  const config: MockupConfig = {
    format: isFormat(saved.format) ? saved.format : "website",
    palette: isPalette(saved.palette) ? saved.palette : "violet",
    enabledModules: Array.isArray(saved.enabledModules)
      ? saved.enabledModules.filter((id): id is string => typeof id === "string")
      : [],
    ...(Array.isArray(saved.selectedRecommendationIds)
      ? { selectedRecommendationIds: saved.selectedRecommendationIds.filter((id): id is string => typeof id === "string") }
      : {}),
  };
  const model = buildMockupModel(project, config);
  const options: NonNullable<ProjectPlanInput["selectedOptions"]> = [];

  if ((saved.enabledModules?.length ?? 0) > 0) {
    for (const item of model.modules) {
      if (saved.enabledModules?.includes(item.id)) {
        options.push({ id: `module:${item.id}`, title: item.title, description: item.description });
      }
    }
  }

  if (Array.isArray(saved.selectedRecommendationIds)) {
    for (const item of model.recommendations) {
      if (saved.selectedRecommendationIds.includes(item.id)) {
        options.push({ id: `recommendation:${item.id}`, title: item.title, description: item.description });
      }
    }
  }
  return options;
}
