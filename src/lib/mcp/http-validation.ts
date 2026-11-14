export const MERKORA_MCP_PROTOCOL_VERSION = "2025-11-25";

export type McpHttpValidation =
  | { ok: true }
  | { ok: false; status: 400 | 406 | 415; message: string };

/** Enforce the Streamable HTTP media and protocol headers before parsing RPC. */
export function validateMcpHttpRequest(headers: Headers, method: string): McpHttpValidation {
  const contentType = headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return { ok: false, status: 415, message: "Content-Type application/json required" };
  }

  const accepted = (headers.get("accept") ?? "")
    .split(",")
    .map((value) => value.split(";")[0].trim().toLowerCase());
  if (!accepted.includes("application/json") || !accepted.includes("text/event-stream")) {
    return { ok: false, status: 406, message: "Accept must include application/json and text/event-stream" };
  }

  if (method !== "initialize" && headers.get("mcp-protocol-version") !== MERKORA_MCP_PROTOCOL_VERSION) {
    return { ok: false, status: 400, message: "Unsupported or missing MCP protocol version" };
  }

  return { ok: true };
}
