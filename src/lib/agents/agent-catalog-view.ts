import {
  AGENT_CATALOG,
  AGENT_POLES,
  type AgentDefinition,
  type AgentPoleId,
} from "./agent-catalog";

export type AgentCatalogFilter = AgentPoleId | "all";

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}

export function filterAgentCatalog(
  query: string,
  poleFilter: AgentCatalogFilter = "all",
): AgentDefinition[] {
  const normalizedQuery = normalizeSearchText(query);
  const selectedPole = poleFilter === "all"
    ? undefined
    : AGENT_POLES.find((pole) => pole.id === poleFilter);

  return AGENT_CATALOG.filter((agent) => {
    if (selectedPole && agent.poleId !== selectedPole.id) return false;
    if (!normalizedQuery) return true;

    const pole = AGENT_POLES.find((item) => item.id === agent.poleId);
    const searchableContent = [
      agent.id,
      agent.name,
      agent.mission,
      ...agent.responsibilities,
      ...agent.activationTriggers,
      ...agent.inputs,
      ...agent.outputs,
      ...agent.suggestedToolDomains,
      ...agent.permissionBoundaries,
      ...agent.acceptanceCriteria,
      ...agent.verificationMethods,
      ...agent.failureHandling,
      pole?.name ?? "",
      pole?.objective ?? "",
      pole?.description ?? "",
    ].join(" ");

    return normalizeSearchText(searchableContent).includes(normalizedQuery);
  });
}
