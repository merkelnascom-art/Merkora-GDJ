import { describe, expect, it } from "vitest";
import { createMcpProtectedResourceMetadata, createMcpUnauthorizedHeaders } from "./oauth-resource";

describe("MCP OAuth resource metadata", () => {
  it("advertises the MCP resource and the Supabase Auth authorization server", () => {
    expect(createMcpProtectedResourceMetadata(
      "https://merkora.example/api/mcp",
      "https://project-ref.supabase.co",
    )).toEqual({
      resource: "https://merkora.example/api/mcp",
      authorization_servers: ["https://project-ref.supabase.co/auth/v1"],
      bearer_methods_supported: ["header"],
    });
  });

  it("rejects insecure non-local resource URLs", () => {
    expect(() => createMcpProtectedResourceMetadata(
      "http://merkora.example/api/mcp",
      "https://project-ref.supabase.co",
    )).toThrow();
  });

  it("advertises protected-resource discovery in the 401 challenge", () => {
    const headers = createMcpUnauthorizedHeaders("https://merkora.example/.well-known/oauth-protected-resource", true);
    expect(headers.get("www-authenticate")).toBe(
      'Bearer resource_metadata="https://merkora.example/.well-known/oauth-protected-resource", error="invalid_token"',
    );
    expect(headers.get("cache-control")).toBe("no-store");
  });
});
