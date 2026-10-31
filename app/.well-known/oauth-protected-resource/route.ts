import { NextResponse } from "next/server";
import { createMcpProtectedResourceMetadata } from "@/lib/mcp/oauth-resource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const resourceUrl = process.env.MERKORA_MCP_RESOURCE_URL;
  if (!supabaseUrl || !resourceUrl) {
    return NextResponse.json({ error: "OAuth discovery is not configured." }, { status: 503 });
  }

  try {
    const metadata = createMcpProtectedResourceMetadata(resourceUrl, supabaseUrl);

    return NextResponse.json(metadata, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json({ error: "OAuth discovery configuration is invalid." }, { status: 500 });
  }
}
