import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getCurrentUser, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import type { CloudProjectRow } from "@/lib/project-types";

export const dynamic = "force-dynamic";

const categories = new Set(["business", "digital", "creative", "organization", "personal", "other"]);
const statuses = new Set(["discovery", "design", "awaiting_approval", "in_progress", "verification", "delivered"]);
const select = "id,user_id,title,category,problem,desired_outcome,budget,urgency,status,recommendations,created_at,updated_at";

function validProject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.id === "string" && row.id.length >= 3 && row.id.length <= 100
    && typeof row.title === "string" && row.title.trim().length >= 3 && row.title.length <= 160
    && typeof row.problem === "string" && row.problem.length >= 15 && row.problem.length <= 2500
    && typeof row.desiredOutcome === "string" && row.desiredOutcome.trim().length >= 8 && row.desiredOutcome.length <= 1500
    && typeof row.category === "string" && categories.has(row.category)
    && typeof row.budget === "string" && row.budget.length <= 100
    && typeof row.urgency === "string" && ["normal", "soon", "urgent", "low", "high"].includes(row.urgency)
    && typeof row.status === "string" && statuses.has(row.status)
    && Array.isArray(row.recommendations) && row.recommendations.length <= 20
    && row.recommendations.every((item) => {
      if (!item || typeof item !== "object") return false;
      const recommendation = item as Record<string, unknown>;
      return typeof recommendation.title === "string" && recommendation.title.length <= 120
        && typeof recommendation.description === "string" && recommendation.description.length <= 600
        && typeof recommendation.reason === "string" && recommendation.reason.length <= 600;
    });
}

export async function GET() {
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour accéder à vos dossiers en ligne." }, { status: 401 });
    const result = await callUserData(`user_projects?select=${select}&order=updated_at.desc`, "GET", token);
    if (!result.ok) return NextResponse.json({ error: "Impossible de charger les dossiers en ligne." }, { status: result.status === 401 ? 401 : 502 });
    return NextResponse.json({ projects: Array.isArray(result.data) ? result.data as CloudProjectRow[] : [] });
  } catch (error) {
    const configured = !(error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED");
    return NextResponse.json({ error: configured ? "Le service de dossiers est momentanément indisponible." : "La sauvegarde en ligne n’est pas encore configurée." }, { status: configured ? 502 : 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  const items = Array.isArray(body) ? body : [body];
  if (items.length > 100 || items.some((item) => !validProject(item))) {
    return NextResponse.json({ error: "Un ou plusieurs dossiers sont invalides (maximum 100 par synchronisation)." }, { status: 400 });
  }
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous avant de synchroniser vos dossiers." }, { status: 401 });
    if (items.length === 0) return NextResponse.json({ saved: 0 });
    const rows = items.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id: row.id,
        user_id: user.id,
        title: (row.title as string).trim(),
        category: row.category,
        problem: (row.problem as string).trim(),
        desired_outcome: (row.desiredOutcome as string).trim(),
        budget: row.budget,
        urgency: row.urgency === "urgent" ? "urgent" : row.urgency === "soon" || row.urgency === "high" ? "high" : "normal",
        status: row.status,
        recommendations: row.recommendations,
        created_at: typeof row.createdAt === "string" && !Number.isNaN(Date.parse(row.createdAt)) ? row.createdAt : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
    const result = await callUserData(`user_projects?on_conflict=id&select=${select}`, "POST", token, rows, "resolution=merge-duplicates,return=representation");
    if (!result.ok) return NextResponse.json({ error: "La synchronisation a échoué. Vos dossiers locaux restent conservés." }, { status: result.status === 401 ? 401 : 502 });
    return NextResponse.json({ saved: Array.isArray(result.data) ? result.data.length : 0 });
  } catch (error) {
    const configured = !(error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED");
    return NextResponse.json({ error: configured ? "Le service de dossiers est momentanément indisponible." : "La sauvegarde en ligne n’est pas encore configurée." }, { status: configured ? 502 : 503 });
  }
}
