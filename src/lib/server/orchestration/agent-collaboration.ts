export type AgentRole =
  | "analyst"
  | "architect"
  | "implementer"
  | "reviewer"
  | "tester"
  | "cross_checker";

export type AgentProviderConnection = {
  providerId: string;
  status: string;
  capabilities: readonly string[];
};

export type AgentAssignment = {
  role: AgentRole;
  providerId: string;
  capability: string;
};

export type AgentCollaborationPlan = {
  projectId: string;
  assignments: AgentAssignment[];
  blockedRoles: AgentRole[];
};

const ROLE_CAPABILITIES: Record<AgentRole, readonly string[]> = {
  // Roles are prompt/workflow specializations. Provider capabilities below
  // represent the actual API operation exposed by the connected provider.
  analyst: ["models.generate", "messages.create", "generate_content"],
  architect: ["models.generate", "messages.create", "generate_content"],
  implementer: ["models.generate", "messages.create", "generate_content"],
  reviewer: ["models.generate", "messages.create", "generate_content"],
  tester: ["models.generate", "messages.create", "generate_content"],
  cross_checker: ["models.generate", "messages.create", "generate_content"],
};

const INDEPENDENT_REVIEW_ROLES = new Set<AgentRole>(["reviewer", "cross_checker"]);

function isAgentRole(value: string): value is AgentRole {
  return Object.prototype.hasOwnProperty.call(ROLE_CAPABILITIES, value);
}

/**
 * Plans provider assignments only. It does not invoke a model, share credentials,
 * persist tasks, or authorize tool execution. A real runner must enforce project
 * scope, per-task budgets, data minimization, approval gates and audit logging.
 */
export function planAgentCollaboration(input: {
  projectId: string;
  requestedRoles: readonly string[];
  providers: readonly AgentProviderConnection[];
}): AgentCollaborationPlan {
  if (!input.projectId.trim() || input.projectId.length > 160) {
    throw new Error("A project identifier is required.");
  }

  const roles = [...new Set(input.requestedRoles)];
  const assignments: AgentAssignment[] = [];
  const blockedRoles: AgentRole[] = [];
  const usedProviders = new Set<string>();

  for (const requestedRole of roles) {
    if (!isAgentRole(requestedRole)) throw new Error("Unknown agent role.");

    const role = requestedRole;
    const requiredCapabilities = ROLE_CAPABILITIES[role];
    const independent = INDEPENDENT_REVIEW_ROLES.has(role);
    const provider = input.providers.find((candidate) =>
      candidate.status === "connected"
      && (!independent || !usedProviders.has(candidate.providerId))
      && requiredCapabilities.some((capability) => candidate.capabilities.includes(capability)),
    );

    if (!provider) {
      blockedRoles.push(role);
      continue;
    }

    const capability = requiredCapabilities.find((item) => provider.capabilities.includes(item));
    if (!capability) {
      blockedRoles.push(role);
      continue;
    }

    assignments.push({ role, providerId: provider.providerId, capability });
    usedProviders.add(provider.providerId);
  }

  return { projectId: input.projectId, assignments, blockedRoles };
}
