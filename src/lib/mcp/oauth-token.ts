/**
 * Reads the OAuth client_id claim from a JWT-shaped access token.
 *
 * This is deliberately only a claim extractor, not a JWT verifier. Callers
 * MUST validate the same token with the configured Supabase Auth instance
 * before trusting the returned client id.
 */
export function getOAuthClientIdFromAccessToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;

  try {
    const payloadText = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload: unknown = JSON.parse(payloadText);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

    const clientId = (payload as Record<string, unknown>).client_id;
    if (typeof clientId !== "string" || clientId.trim().length === 0 || clientId.length > 512) {
      return null;
    }
    return clientId;
  } catch {
    return null;
  }
}
