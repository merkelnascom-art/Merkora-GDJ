import {
  buildProjectImplementationPrompt,
  parseProjectCodePatchResponse,
  type ImplementationBrief,
  type ProjectCodePatch,
} from "./implementation-agent";

export type ProjectAiImplementationResult =
  | { ok: true; patch: ProjectCodePatch }
  | { ok: false; reason: "provider_error" | "invalid_provider_response" | "invalid_patch"; detail?: string };

type CompletionRequest = (input: {
  apiKey: string;
  model: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
  maxTokens?: number;
  timeoutMs?: number;
}) => Promise<Response>;

function readMessageContent(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") return null;
  const message = (choices[0] as { message?: unknown }).message;
  if (!message || typeof message !== "object") return null;
  const content = (message as { content?: unknown }).content;
  return typeof content === "string" ? content : null;
}

/**
 * Calls the configured AI provider only when the caller has already checked
 * explicit project-level consent. Credentials are passed by the server only.
 */
export async function generateProjectImplementationPatch(input: {
  brief: ImplementationBrief;
  apiKey: string;
  model: string;
  requestCompletion: CompletionRequest;
}): Promise<ProjectAiImplementationResult> {
  if (!input.apiKey.trim() || !input.model.trim()) {
    return { ok: false, reason: "provider_error", detail: "Configuration IA absente." };
  }

  const prompt = buildProjectImplementationPrompt(input.brief);
  let response: Response;
  try {
    response = await input.requestCompletion({
      apiKey: input.apiKey,
      model: input.model,
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt },
      ],
      maxTokens: 8_000,
      timeoutMs: 90_000,
    });
  } catch {
    return { ok: false, reason: "provider_error" };
  }

  if (!response.ok) return { ok: false, reason: "provider_error", detail: `HTTP ${response.status}` };
  let payload: unknown;
  try { payload = await response.json(); }
  catch { return { ok: false, reason: "invalid_provider_response" }; }

  const content = readMessageContent(payload);
  if (!content) return { ok: false, reason: "invalid_provider_response" };
  const parsed = parseProjectCodePatchResponse(content);
  if (!parsed.ok) return { ok: false, reason: "invalid_patch", detail: parsed.reason };
  return { ok: true, patch: parsed.patch };
}
