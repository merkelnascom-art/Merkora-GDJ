import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const statuses = new Set(["draft", "changes_requested", "approved"]);
const choices = new Set(["undecided", "accepted", "changes_requested", "negotiate"]);
const maxText = (value: unknown, length: number): value is string => typeof value === "string" && value.length <= length;

function validPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  if (!p.project || typeof p.project !== "object" || Array.isArray(p.project)) return false;
  const project = p.project as Record<string, unknown>;
  if (!maxText(project.id, 160) || project.id.trim().length < 3 ||
      !maxText(project.title, 160) || !project.title.trim() ||
      !maxText(project.category, 40) ||
      !maxText(project.problem, 2500) || !maxText(project.desiredOutcome, 1500) ||
      !maxText(project.budget, 100) || !maxText(project.urgency, 20) ||
      !Array.isArray(project.recommendations) || project.recommendations.length > 20) return false;
  if (!p.studio || typeof p.studio !== "object" || Array.isArray(p.studio)) return false;
  const studio = p.studio as Record<string, unknown>;
  if (!["website", "mobile", "dashboard"].includes(String(studio.format)) ||
      !["violet", "blue", "emerald", "amber"].includes(String(studio.palette)) ||
      !maxText(studio.reviewStatus, 30) || !statuses.has(String(studio.reviewStatus))) return false;
  if (!p.quote || typeof p.quote !== "object" || Array.isArray(p.quote)) return false;
  const quote = p.quote as Record<string, unknown>;
  if (!maxText(quote.amount, 40) || (quote.amount && !/^\d+$/.test(quote.amount)) ||
      !maxText(quote.days, 20) || (quote.days && !/^\d+$/.test(quote.days)) ||
      !maxText(quote.paymentTerms, 500)) return false;
  if (!p.clientResponse || typeof p.clientResponse !== "object" || Array.isArray(p.clientResponse)) return false;
  const response = p.clientResponse as Record<string, unknown>;
  if (!maxText(response.choice, 30) || !choices.has(response.choice) ||
      !maxText(response.comment, 1200)) return false;
  return JSON.stringify(p).length <= 100_000;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!validPayload(body)) return NextResponse.json({ error: "Le dossier ou la réponse contient des informations invalides." }, { status: 400 });

  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token || !user.email) return NextResponse.json({ error: "Connectez-vous à votre compte MerKora avant d’envoyer le dossier." }, { status: 401 });

    const project = body.project as Record<string, unknown>;
    const result = await callUserData(
      "client_requests?on_conflict=user_id,project_id",
      "POST",
      token,
      {
        user_id: user.id,
        user_email: user.email,
        project_id: project.id,
        project_title: project.title,
        payload: body,
        admin_status: "to_review",
        admin_note: "",
        updated_at: new Date().toISOString(),
      },
      "resolution=merge-duplicates,return=representation",
    );
    if (!result.ok) return NextResponse.json({
      error: result.status === 404 || result.status === 400
        ? "La boîte de réception centrale n’est pas encore installée. La demande n’a pas été envoyée."
        : "Impossible d’envoyer la demande pour le moment. Votre dossier local est conservé.",
    }, { status: result.status === 401 ? 401 : 502 });
    return NextResponse.json({ sent: true, message: "Demande transmise à MerKora. Elle est enregistrée en ligne." });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    return NextResponse.json({ error: notConfigured ? "La sauvegarde en ligne n’est pas configurée." : "Le service est momentanément indisponible." }, { status: notConfigured ? 503 : 502 });
  }
}
