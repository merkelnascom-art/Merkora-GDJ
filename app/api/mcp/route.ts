import { NextResponse } from "next/server";
import { MERKORA_MCP_TOOLS, validateMcpToolArguments } from "@/lib/mcp/tools";
import { validateMcpHttpRequest, MERKORA_MCP_PROTOCOL_VERSION } from "@/lib/mcp/http-validation";
import { createMcpUnauthorizedHeaders } from "@/lib/mcp/oauth-resource";
import { getOAuthClientIdFromAccessToken, hasMcpResourceAudience } from "@/lib/mcp/oauth-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;

type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
};

type AuthenticatedUser = { id: string; email: string | null; clientId: string };

function rpcResult(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: { "MCP-Protocol-Version": MERKORA_MCP_PROTOCOL_VERSION } });
}

function rpcError(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { headers: { "MCP-Protocol-Version": MERKORA_MCP_PROTOCOL_VERSION } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function authenticate(request: Request): Promise<AuthenticatedUser | null> {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return null;
  const oauthClientId = getOAuthClientIdFromAccessToken(token);
  if (!oauthClientId) return null;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json();
    if (!user || typeof user.id !== "string") return null;
    return { id: user.id, email: typeof user.email === "string" ? user.email : null, clientId: oauthClientId };
  } catch {
    return null;
  }
}

async function fetchOwnProjects(request: Request, user: AuthenticatedUser, projectId?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const accessToken = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!url || !key || !accessToken) throw new Error("MCP_DATA_ACCESS_UNAVAILABLE");

  const query = new URLSearchParams({
    select: projectId ? "id,title,category,problem,desired_outcome,budget,urgency,status,created_at,updated_at" : "id,title,category,status,created_at,updated_at",
    user_id: `eq.${user.id}`,
    order: "updated_at.desc",
    limit: projectId ? "1" : "50",
  });
  if (projectId) query.set("id", `eq.${projectId}`);

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/user_projects?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("MCP_PROJECT_READ_FAILED");
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error("MCP_PROJECT_READ_FAILED");
  return rows;
}

export async function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}

export async function POST(request: Request) {
  const auth = await authenticate(request);
  if (!auth) {
    const metadataUrl = new URL("/.well-known/oauth-protected-resource", request.url).toString();
    const hasBearerToken = /^Bearer\s+.+$/i.test(request.headers.get("authorization") ?? "");
    return NextResponse.json(
      { error: "Authentification MerKora requise." },
      { status: 401, headers: createMcpUnauthorizedHeaders(metadataUrl, hasBearerToken) },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON-RPC invalide." }, { status: 400 });
  }

  if (!isRecord(body) || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return rpcError(isRecord(body) ? body.id ?? null : null, -32600, "Invalid JSON-RPC request");
  }

  const httpValidation = validateMcpHttpRequest(request.headers, body.method);
  if (!httpValidation.ok) {
    return NextResponse.json({ error: httpValidation.message }, { status: httpValidation.status });
  }
  const message = body as JsonRpcRequest;
  const id = message.id ?? null;

  if (message.method === "notifications/initialized" || message.method === "notifications/cancelled") {
    return new Response(null, { status: 202, headers: { "MCP-Protocol-Version": MERKORA_MCP_PROTOCOL_VERSION } });
  }

  if (message.method === "initialize") {
    return rpcResult(id, {
      protocolVersion: MERKORA_MCP_PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: "merkora-gdj", version: "0.1.0" },
      instructions: "MerKora exposes uniquement des outils de lecture des données du compte authentifié. Aucune mutation, dépense ou publication n'est autorisée par ce serveur.",
    });
  }

  if (message.method === "ping") return rpcResult(id, {});

  if (message.method === "tools/list") {
    return rpcResult(id, { tools: MERKORA_MCP_TOOLS });
  }

  if (message.method === "tools/call") {
    if (!isRecord(message.params) || typeof message.params.name !== "string") {
      return rpcError(id, -32602, "Invalid tool parameters");
    }
    const args: unknown = message.params.arguments ?? {};
    if (!validateMcpToolArguments(message.params.name, args)) {
      return rpcError(id, -32602, "Invalid tool arguments");
    }

    try {
      let result: unknown;
      switch (message.params.name) {
        case "merkora_get_profile":
          result = { id: auth.id, email: auth.email };
          break;
        case "merkora_list_projects":
          result = await fetchOwnProjects(request, auth);
          break;
        case "merkora_get_project": {
          const projectId = (args as { project_id: string }).project_id;
          const rows = await fetchOwnProjects(request, auth, projectId);
          if (!rows.length) {
            return rpcResult(id, { content: [{ type: "text", text: "Projet introuvable ou non autorisé." }], isError: true });
          }
          result = rows[0];
          break;
        }
        default:
          return rpcError(id, -32602, "Unknown tool");
      }
      return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(result) }], isError: false });
    } catch {
      return rpcResult(id, { content: [{ type: "text", text: "Lecture indisponible. Réessayez plus tard." }], isError: true });
    }
  }

  return rpcError(id, -32601, "Method not found");
}
