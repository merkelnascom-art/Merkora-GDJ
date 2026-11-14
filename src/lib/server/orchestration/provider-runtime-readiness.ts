import {
  createConfiguredAgentRuntime,
  type ProviderRuntimeEnvironment,
} from "./provider-runtime";

export type ProviderRuntimeReadiness = Readonly<{
  enabled: boolean;
  status: "disabled" | "not_configured" | "ready";
  providers: readonly string[];
  providerCallsPerformed: false;
  spendingStarted: false;
  projectConnectionCheckRequired: true;
}>;

/**
 * Read-only configuration inspection for the admin surface.
 *
 * This reports server-level provider registration only. It deliberately does
 * not claim that a particular project's connection is usable: ownership,
 * connection status, capabilities, tenant credentials, approvals and budget
 * must still be checked for each execution. No adapter is invoked here.
 */
export function inspectConfiguredProviderRuntime(
  env: ProviderRuntimeEnvironment,
  options: { hasCredentialResolver?: boolean } = {},
): ProviderRuntimeReadiness {
  const enabled = env.MERKORA_AGENT_RUNTIME_ENABLED === "true";
  if (!enabled) {
    return {
      enabled: false,
      status: "disabled",
      providers: [],
      providerCallsPerformed: false,
      spendingStarted: false,
      projectConnectionCheckRequired: true,
    };
  }

  // A resolver is represented by a deliberately inert function. The runtime
  // composition root only checks its presence during registration; it is never
  // called by this inspection path.
  const configured = createConfiguredAgentRuntime(env, {
    resolveCredential: options.hasCredentialResolver
      ? () => undefined
      : undefined,
  });
  const providers = [...configured.registeredProviders];

  return {
    enabled: true,
    status: providers.length > 0 ? "ready" : "not_configured",
    providers,
    providerCallsPerformed: false,
    spendingStarted: false,
    projectConnectionCheckRequired: true,
  };
}
