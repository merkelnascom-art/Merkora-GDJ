import { loadProjectFactoryContext } from "./project-factory-context";
import {
  executeConfiguredAgentFactoryWorkflow,
  type AgentFactoryExecutionPolicyInput,
  type AgentFactoryExecutionResult,
} from "./agent-factory-executor";
import type { ProviderCredentialResolver, ProviderRuntimeEnvironment } from "./provider-runtime";

export type ExecuteProjectFactoryWorkflowInput = Omit<
  AgentFactoryExecutionPolicyInput,
  "contextReferences" | "projectContextInstructions"
> & {
  accessToken: string;
  env: ProviderRuntimeEnvironment;
  resolveCredential?: ProviderCredentialResolver;
};

export type ExecuteProjectFactoryWorkflowResult = AgentFactoryExecutionResult & {
  sourceVersions: { briefVersion: number; planVersion: number };
};

/**
 * Trusted server composition point for the full project-aware agent workflow.
 * It loads and verifies the immutable brief/plan snapshot before handing its
 * bounded context to the guarded provider executor. The caller still supplies
 * project ACL, external-AI consent, budget and human-approval policies.
 */
export async function executeProjectFactoryWorkflow(
  input: ExecuteProjectFactoryWorkflowInput,
): Promise<ExecuteProjectFactoryWorkflowResult> {
  const context = await loadProjectFactoryContext(input.projectId, input.accessToken);
  const result = await executeConfiguredAgentFactoryWorkflow({
    ...input,
    contextReferences: context.contextReferences,
    projectContextInstructions: context.contextInstructions,
  });

  return {
    ...result,
    sourceVersions: {
      briefVersion: context.briefVersion,
      planVersion: context.planVersion,
    },
  };
}
