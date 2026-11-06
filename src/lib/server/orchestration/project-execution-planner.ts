export type ProjectRequirement =
  | "web_application"
  | "database"
  | "visual_design"
  | "ai_features"
  | "production_deployment";

export type ConnectionSnapshot = {
  providerId: string;
  status: string;
  capabilities: readonly string[];
};

export type PlannedExecutionTask = {
  id: string;
  capability: string | null;
  providerId: string | null;
  requiresApproval: boolean;
};

export type ProjectExecutionPlan = {
  projectId: string;
  selectedProviders: string[];
  blockedCapabilities: string[];
  approvalsRequired: string[];
  tasks: PlannedExecutionTask[];
};

const REQUIREMENT_CAPABILITIES: Record<ProjectRequirement, readonly string[]> = {
  web_application: ["repositories.read", "branches.write", "previews.create"],
  database: ["database.read", "database.write"],
  visual_design: ["design.create"],
  ai_features: ["models.generate"],
  production_deployment: ["production.deploy"],
};

const CAPABILITY_PROVIDER: Record<string, string> = {
  "repositories.read": "github",
  "branches.write": "github",
  "previews.create": "vercel",
  "database.read": "supabase",
  "database.write": "supabase",
  "design.create": "figma",
  "models.generate": "openai",
  "production.deploy": "vercel",
};

const APPROVAL_REQUIRED = new Set(["database.write", "production.deploy"]);

export function planProjectExecution(input: {
  projectId: string;
  requirements: readonly ProjectRequirement[];
  connections: readonly ConnectionSnapshot[];
}): ProjectExecutionPlan {
  if (!input.projectId.trim()) {
    throw new Error("A project identifier is required.");
  }

  const requested = new Set<string>();
  for (const requirement of input.requirements) {
    for (const capability of REQUIREMENT_CAPABILITIES[requirement]) {
      requested.add(capability);
    }
  }

  const connectedCapabilities = new Map<string, string>();
  for (const connection of input.connections) {
    if (connection.status !== "connected") continue;
    for (const capability of connection.capabilities) {
      if (CAPABILITY_PROVIDER[capability] === connection.providerId) {
        connectedCapabilities.set(capability, connection.providerId);
      }
    }
  }

  const capabilities = [...requested].sort();
  const blockedCapabilities = capabilities.filter((capability) => !connectedCapabilities.has(capability));
  const approvalsRequired = capabilities.filter(
    (capability) => connectedCapabilities.has(capability) && APPROVAL_REQUIRED.has(capability),
  );

  const tasks: PlannedExecutionTask[] = capabilities
    .filter((capability) => connectedCapabilities.has(capability))
    .map((capability) => ({
      id: `execute_${capability.replace(/[^a-z0-9]+/gi, "_")}`,
      capability,
      providerId: connectedCapabilities.get(capability) ?? null,
      requiresApproval: APPROVAL_REQUIRED.has(capability),
    }));

  if (tasks.length > 0) {
    tasks.push({
      id: "prepare_delivery",
      capability: null,
      providerId: null,
      requiresApproval: true,
    });
  }

  return {
    projectId: input.projectId,
    selectedProviders: [...new Set(tasks.map((task) => task.providerId).filter((id): id is string => id !== null))].sort(),
    blockedCapabilities,
    approvalsRequired,
    tasks,
  };
}
