export type AssistantProvider = "openai" | "anthropic";
export type AssistantRuntimeConfig =
  | { status: "disabled"; provider: null; model: null; credential: null }
  | { status: "not_configured"; provider: null; model: null; credential: null }
  | { status: "ready"; provider: AssistantProvider; model: string; credential: string };

export type ExternalAssistantAuthorization = {
  explicitUserRequest: boolean;
  clientConsent: boolean;
  adminSpendAuthorized: boolean;
};

export function getAssistantRuntimeConfig(
  env: Record<string, string | undefined> = process.env,
): AssistantRuntimeConfig {
  if (env.MERKORA_AI_ENABLED !== "true") {
    return { status: "disabled", provider: null, model: null, credential: null };
  }
  const model = env.MERKORA_ASSISTANT_MODEL?.trim() ?? "";
  const credential = env.AI_GATEWAY_API_KEY?.trim() || env.VERCEL_OIDC_TOKEN?.trim() || "";
  const match = /^(openai|anthropic)\/([a-z0-9][a-z0-9._:-]*)$/i.exec(model);
  if (!match || !credential) {
    return { status: "not_configured", provider: null, model: null, credential: null };
  }
  return {
    status: "ready",
    provider: match[1].toLowerCase() as AssistantProvider,
    model,
    credential,
  };
}

export function authorizeExternalAssistant(
  config: AssistantRuntimeConfig,
  authorization: ExternalAssistantAuthorization,
): { allowed: true } | { allowed: false; reason: "disabled" | "not_configured" | "explicit_request_required" | "client_consent_required" | "admin_spend_authorization_required" } {
  if (config.status === "disabled") return { allowed: false, reason: "disabled" };
  if (config.status !== "ready") return { allowed: false, reason: "not_configured" };
  if (authorization.explicitUserRequest !== true) {
    return { allowed: false, reason: "explicit_request_required" };
  }
  if (authorization.clientConsent !== true) {
    return { allowed: false, reason: "client_consent_required" };
  }
  if (authorization.adminSpendAuthorized !== true) {
    return { allowed: false, reason: "admin_spend_authorization_required" };
  }
  return { allowed: true };
}
