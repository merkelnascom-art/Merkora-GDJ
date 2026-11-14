/**
 * Server-side only: import this module from route handlers, never from client components.
 * This function deliberately does not read environment variables; the caller must enforce
 * MERKORA_AI_ENABLED before invoking it and pass server-held credentials explicitly.
 */
export type AiGatewayMessage = { role: "system" | "user"; content: string };

export type AiGatewayRequest = {
  apiKey: string;
  model: string;
  messages: AiGatewayMessage[];
  maxTokens?: number;
  timeoutMs?: number;
};

export async function requestAiGatewayCompletion(input: AiGatewayRequest): Promise<Response> {
  return fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: input.model,
      messages: input.messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: input.maxTokens ?? 2200,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(input.timeoutMs ?? 25_000),
  });
}
