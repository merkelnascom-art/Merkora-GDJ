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
  analyst: ["models.generate"],
  architect: ["models.generate"],
  implementer: ["models.generate"],
  reviewer: ["models.generate"],
  tester: ["models.generate"],
  cross_checker: ["models.generate"],
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
  const assignmentsByRole = new Map<AgentRole, AgentAssignment>();
  const usedProviders = new Set<string>();
  // Reserve independent review providers after the primary project roles.
  const planningOrder = [
    ...roles.filter((role) => !INDEPENDENT_REVIEW_ROLES.has(role as AgentRole)),
    ...roles.filter((role) => INDEPENDENT_REVIEW_ROLES.has(role as AgentRole)),
  ];

  for (const requestedRole of planningOrder) {
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
      continue;
    }

    const capability = requiredCapabilities.find((item) => provider.capabilities.includes(item));
    if (!capability) {
      continue;
    }

    assignmentsByRole.set(role, { role, providerId: provider.providerId, capability });
    usedProviders.add(provider.providerId);
  }

  const assignments = roles
    .map((role) => assignmentsByRole.get(role as AgentRole))
    .filter((assignment): assignment is AgentAssignment => assignment !== undefined);
  const blockedRoles = roles.filter((role) => !assignmentsByRole.has(role as AgentRole)) as AgentRole[];
  return { projectId: input.projectId, assignments, blockedRoles };
}
