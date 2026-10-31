function readJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;

  try {
    const payloadText = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload: unknown = JSON.parse(payloadText);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Reads the OAuth client_id claim from a JWT-shaped access token.
 *
 * This is deliberately only a claim extractor, not a JWT verifier. Callers
 * MUST validate the same token with the configured Supabase Auth instance
 * before trusting the returned client id.
 */
export function getOAuthClientIdFromAccessToken(token: string): string | null {
  const clientId = readJwtPayload(token)?.client_id;
  if (typeof clientId !== "string" || clientId.trim().length === 0 || clientId.length > 512) {
    return null;
  }
  return clientId;
}

/**
 * Enforces OAuth resource-indicator audience binding for the MCP endpoint.
 * The token signature and issuer must still be verified independently.
 */
export function hasMcpResourceAudience(token: string, resourceUrl: string): boolean {
  if (!resourceUrl) return false;

  try {
    const resource = new URL(resourceUrl);
    const localHost = resource.hostname === "localhost" || resource.hostname === "127.0.0.1" || resource.hostname === "[::1]";
    if (resource.protocol !== "https:" && !(localHost && resource.protocol === "http:")) return false;
    if (resource.username || resource.password || resource.search || resource.hash) return false;
    const canonicalResource = resource.toString().replace(/\/$/, "");

    const audience = readJwtPayload(token)?.aud;
    const values = typeof audience === "string" ? [audience] : Array.isArray(audience) ? audience : [];
    return values.some((value) => {
      if (typeof value !== "string") return false;
      try {
        const candidate = new URL(value);
        const candidateLocal = candidate.hostname === "localhost" || candidate.hostname === "127.0.0.1" || candidate.hostname === "[::1]";
        if (candidate.protocol !== "https:" && !(candidateLocal && candidate.protocol === "http:")) return false;
        if (candidate.username || candidate.password || candidate.search || candidate.hash) return false;
        return candidate.toString().replace(/\/$/, "") === canonicalResource;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}
