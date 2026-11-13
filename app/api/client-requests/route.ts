import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { isValidClientRequestPayload } from "@/lib/client-request-validation";

export const dynamic = "force-dynamic";

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
        `client_requests?select=id,project_id,project_title,admin_status,created_at,updated_at&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=100`,
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
  if (!isValidClientRequestPayload(body)) return NextResponse.json({ error: "Le dossier ou la réponse contient des informations invalides." }, { status: 400 });

  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token || !user.email) return NextResponse.json({ error: "Connectez-vous à votre compte MerKora avant d’envoyer le dossier." }, { status: 401 });

    const project = body.project as Record<string, unknown>;
    const result = await callUserData(
      "client_requests",
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
      "return=representation",
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
