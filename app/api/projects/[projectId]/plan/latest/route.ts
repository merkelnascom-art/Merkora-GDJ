import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

function validProjectId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 3 && value.length <= 100 &&
    /^[a-zA-Z0-9_-]+$/.test(value);
}

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const token = await getAccessToken(await cookies());
    if (!token) return NextResponse.json({ error: "Connectez-vous pour consulter le plan." }, { status: 401 });
    const result = await callUserData(
      `project_memory_plan_versions?select=version,payload,payload_digest,scope_digest,created_at&project_id=eq.${encodeURIComponent(projectId)}&order=version.desc&limit=1`,
      "GET", token,
    );
    if (!result.ok) return NextResponse.json({ error: "Impossible de charger le plan enregistré." }, { status: 502 });
    const row = Array.isArray(result.data) ? result.data[0] : null;
    if (!row || typeof row !== "object") return NextResponse.json({ plan: null }, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ plan: row }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le service de planification est indisponible." }, { status: 502 });
  }
}
