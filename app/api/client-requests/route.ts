import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { createOfficialMockupSnapshot, type OwnedProjectSnapshot } from "@/lib/mockup-approval";

export const dynamic = "force-dynamic";
const statuses = new Set(["draft", "changes_requested", "approved"]);
const choices = new Set(["undecided", "accepted", "changes_requested", "negotiate"]);
const maxText = (value: unknown, length: number): value is string => typeof value === "string" && value.length <= length;

function validPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  if (!p.project || typeof p.project !== "object" || Array.isArray(p.project)) return false;
  const project = p.project as Record<string, unknown>;
  // Only the project identifier is accepted from the browser. The server
  // reloads all descriptive fields from the authenticated owner's saved row.
  if (!maxText(project.id, 160) || project.id.trim().length < 3 ||
      !maxText(project.title, 160) || !project.title.trim()) return false;
  if (!p.studio || typeof p.studio !== "object" || Array.isArray(p.studio)) return false;
  const studio = p.studio as Record<string, unknown>;
  if (!["website", "mobile", "dashboard"].includes(String(studio.format)) ||
      !["violet", "blue", "emerald", "amber"].includes(String(studio.palette)) ||
      !maxText(studio.reviewStatus, 30) || !statuses.has(String(studio.reviewStatus))) return false;
  if (studio.enabledModules !== undefined &&
      (!Array.isArray(studio.enabledModules) || studio.enabledModules.length > 30 ||
       !studio.enabledModules.every((id) => typeof id === "string" && id.length <= 120))) return false;
  if (studio.selectedRecommendationIds !== undefined &&
      (!Array.isArray(studio.selectedRecommendationIds) || studio.selectedRecommendationIds.length > 20 ||
       !studio.selectedRecommendationIds.every((id) => typeof id === "string" && id.length <= 160))) return false;
  if (p.recordType !== undefined && p.recordType !== "mockup_version") return false;
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

export async function GET() {
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour consulter vos demandes." }, { status: 401 });
    // Explicitly scope to the signed-in user even when the account is also on the admin allowlist.
    // Never return admin_note here: it is an internal-only field.
    const [result, launchResult] = await Promise.all([
      callUserData(
        `client_requests?select=id,project_id,project_title,payload,admin_status,created_at,updated_at&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=100`,
        "GET",
        token,
      ),
      callUserData(
        `client_project_launches?select=id,request_id,required_amount,invoice_total_at_launch,confirmed_amount_at_launch,launch_message,launched_at&client_user_id=eq.${encodeURIComponent(user.id)}&order=launched_at.desc&limit=100`,
        "GET",
        token,
      ),
    ]);
    if (!result.ok) return NextResponse.json({ error: "Impossible de charger vos demandes en ligne pour le moment." }, { status: 502 });
    if (!launchResult.ok) return NextResponse.json({ error: "Impossible de charger les confirmations de lancement de vos projets." }, { status: 502 });
    return NextResponse.json({
      requests: Array.isArray(result.data) ? result.data : [],
      launches: Array.isArray(launchResult.data) ? launchResult.data : [],
    });
  } catch {
    return NextResponse.json({ error: "Le suivi de vos demandes est momentanément indisponible." }, { status: 503 });
  }
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

    const submittedProject = body.project as Record<string, unknown>;
    // The browser may submit only a project ID; all project details are reloaded
    // through the signed-in user's RLS-scoped session before anything is recorded.
    const ownedResult = await callUserData(
      `user_projects?select=id,title,category,problem,desired_outcome,budget,urgency,recommendations&id=eq.${encodeURIComponent(String(submittedProject.id))}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET",
      token,
    );
    if (!ownedResult.ok) return NextResponse.json({ error: "Impossible de vérifier l’accès à ce projet. Rien n’a été transmis." }, { status: 502 });
    const ownedProject = Array.isArray(ownedResult.data) ? ownedResult.data[0] as OwnedProjectSnapshot | undefined : undefined;
    if (!ownedProject) return NextResponse.json({ error: "Ce projet n’est pas enregistré dans votre compte ou vous n’y avez pas accès. Enregistrez d’abord le projet puis réessayez." }, { status: 404 });

    let payloadToSave: Record<string, unknown> = {
      ...body,
      project: {
        id: ownedProject.id,
        title: ownedProject.title,
        category: ownedProject.category,
        problem: ownedProject.problem,
        desiredOutcome: ownedProject.desired_outcome,
        budget: ownedProject.budget,
        urgency: ownedProject.urgency,
        recommendations: ownedProject.recommendations,
      },
    };
    let versionNumber: number | null = null;
    if (body.recordType === "mockup_version") {
      // Immutable snapshots are counted only inside the authenticated owner's project.
      const previous = await callUserData(
        `client_requests?select=id&user_id=eq.${encodeURIComponent(user.id)}&project_id=eq.${encodeURIComponent(String(ownedProject.id))}&payload->>recordType=eq.mockup_version&order=created_at.desc&limit=1000`,
        "GET",
        token,
      );
      if (!previous.ok) return NextResponse.json({ error: "Impossible de vérifier l’historique des versions. Rien n’a été enregistré." }, { status: 502 });
      versionNumber = (Array.isArray(previous.data) ? previous.data.length : 0) + 1;
      payloadToSave = createOfficialMockupSnapshot(
        body,
        ownedProject,
        user.id,
        versionNumber,
        new Date().toISOString(),
      );
    }
    const result = await callUserData(
      "client_requests",
      "POST",
      token,
      {
        user_id: user.id,
        user_email: user.email,
        project_id: ownedProject.id,
        project_title: ownedProject.title,
        payload: payloadToSave,
        admin_status: "to_review",
        admin_note: "",
        updated_at: new Date().toISOString(),
      },
      "return=representation",
    );
    if (!result.ok) return NextResponse.json({
      error: result.status === 404 || result.status === 400
        ? "La boîte de réception centrale n’est pas encore installée. La demande n’a pas été envoyée."
        : "Impossible d’envoyer la demande pour le moment. Votre dossier local est conservé.",
    }, { status: result.status === 401 ? 401 : 502 });
    return NextResponse.json({ sent: true, version: versionNumber, message: versionNumber ? `Version ${versionNumber} enregistrée officiellement côté serveur et transmise à MerKora.` : "Demande transmise à MerKora. Elle est enregistrée en ligne." });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    return NextResponse.json({ error: notConfigured ? "La sauvegarde en ligne n’est pas configurée." : "Le service est momentanément indisponible." }, { status: notConfigured ? 503 : 502 });
  }
}
