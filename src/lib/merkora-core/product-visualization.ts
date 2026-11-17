import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal } from "./solution-proposal";
import { buildVisualBlueprint } from "./visual-blueprint";

export interface ProductVisualizationScreen {
  id: string;
  title: string;
  componentId: string | null;
  description: string;
  items: string[];
}

export interface ProductVisualization {
  projectTitle: string;
  kind: "digital" | "operational";
  summary: string;
  roles: string[];
  screens: ProductVisualizationScreen[];
  journey: string[];
  pendingItems: string[];
  unresolvedPoints: string[];
  sourceVersion: number;
}

/**
 * Produces a component-level view for consumers that need one preview screen
 * per retained solution component. The richer visual blueprint remains the
 * source for the grouped, interactive screen 07 experience.
 */
export function buildProductVisualization(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
  proposal: SolutionProposal,
): ProductVisualization {
  const blueprint = buildVisualBlueprint(dossier, definition, proposal);
  const retained = proposal.components.filter(
    (component) => component.status === "accepted" || component.status === "modified",
  );
  const screens: ProductVisualizationScreen[] = blueprint.kind === "digital"
    ? [
        {
          id: "screen-overview",
          title: "Vue d'ensemble",
          componentId: null,
          description: "Point d'entrée du produit, construit à partir des éléments confirmés.",
          items: retained.map((component) => component.title),
        },
        ...retained.map((component, index) => ({
          id: `screen-component-${index + 1}`,
          title: component.title,
          componentId: component.id,
          description: component.description,
          items: [component.title],
        })),
      ]
    : [];

  return {
    projectTitle: blueprint.projectTitle,
    kind: blueprint.kind,
    summary: blueprint.summary,
    roles: blueprint.profiles.map((profile) => profile.name),
    screens,
    journey: blueprint.kind === "operational" ? retained.map((component) => component.title) : [],
    pendingItems: blueprint.pendingItems,
    unresolvedPoints: blueprint.unresolvedPoints,
    sourceVersion: blueprint.sourceVersion,
  };
}
