export const MERKORA_MCP_PROTOCOL_VERSION = "2025-11-25";

function parseSecureUrl(value: string, label: string): URL {
  const parsed = new URL(value);
  const localHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]";
  if (parsed.protocol !== "https:" && !(localHost && parsed.protocol === "http:")) {
    throw new Error(`${label} must use HTTPS`);
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(`${label} must not contain credentials, query parameters or fragments`);
  }
  return parsed;
}

export function createMcpProtectedResourceMetadata(resourceUrl: string, supabaseUrl: string) {
  const resource = parseSecureUrl(resourceUrl, "MCP resource");
  const supabase = parseSecureUrl(supabaseUrl, "Supabase URL");
  const authorizationServer = new URL("/auth/v1", supabase.origin);

  return {
    resource: resource.toString().replace(/\/$/, ""),
    authorization_servers: [authorizationServer.toString().replace(/\/$/, "")],
    bearer_methods_supported: ["header"] as const,
  };
}

export function createMcpUnauthorizedHeaders(metadataUrl: string, invalidToken: boolean): Headers {
  const metadata = parseSecureUrl(metadataUrl, "Protected resource metadata URL");
  const challenge = `Bearer resource_metadata="${metadata.toString()}"${invalidToken ? ', error="invalid_token"' : ""}`;
  return new Headers({
    "WWW-Authenticate": challenge,
    "Cache-Control": "no-store",
    Vary: "Authorization",
  });
}
