import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";

export interface SolutionProposalComponent {
  id: string;
  title: string;
  description: string;
  status: "suggested" | "accepted" | "modified" | "rejected";
  source: "validated_definition" | "project_evidence" | "knowledge_suggestion";
  familyId?: string;
  sourceIds: string[];
}

export interface SolutionProposalArchitecture {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
  tradeOffs: string[];
}

export interface SolutionProposal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  problem: string;
  objective: string;
  operatingPrinciple: string;
  architectures: SolutionProposalArchitecture[];
  components: SolutionProposalComponent[];
  coherenceNotes: string[];
  unresolvedPoints: string[];
  version: number;
  updatedAt: string;
}

export function buildSolutionProposal(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
): SolutionProposal {
  return {
    id: `solution-${dossier.projectId}`,
    projectId: dossier.projectId,
    title: "",
    description: "",
    problem: "",
    objective: "",
    operatingPrinciple: "",
    architectures: [],
    components: [],
    coherenceNotes: [],
    unresolvedPoints: [],
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

export function acceptSolutionComponent(proposal: SolutionProposal, componentId: string): SolutionProposal {
  return proposal;
}

export function rejectSolutionComponent(proposal: SolutionProposal, componentId: string): SolutionProposal {
  return proposal;
}

export function reviseSolutionComponent(proposal: SolutionProposal, componentId: string, title: string): SolutionProposal {
  return proposal;
}
