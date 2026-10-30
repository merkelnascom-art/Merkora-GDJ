import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

type Body = {
  planVersion: number;
  approvalKind: "client_scope" | "admin_review" | "execution_authorization";
  decision: "approved" | "changes_requested";
  comment: string;
  requestId: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function validBody(value: unknown): value is Body {
  if (!isRecord(value)) return false;
  return Number.isSafeInteger(value.planVersion) && Number(value.planVersion) > 0 &&
    ["client_scope", "admin_review", "execution_authorization"].includes(String(value.approvalKind)) &&
    ["approved", "changes_requested"].includes(String(value.decision)) &&
    typeof value.comment === "string" && value.comment.length <= 2000 &&
    typeof value.requestId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.requestId);
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!validBody(body)) return NextResponse.json({ error: "La validation transmise est invalide." }, { status: 400 });

  try {
    const store = await cookies();
    const [user, token, admin] = await Promise.all([
      getCurrentUser(store), getAccessToken(store), getAdminAccess(),
    ]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour valider ce plan." }, { status: 401 });
    const isAdmin = admin.ok;
    if ((isAdmin && body.approvalKind === "client_scope") || (!isAdmin && body.approvalKind !== "client_scope")) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à effectuer ce type de validation." }, { status: 403 });
    }

    const { projectId } = await context.params;
    if (typeof projectId !== "string" || projectId.length < 3 || projectId.length > 100) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }
    const planResult = await callUserData(
      `project_memory_plan_versions?select=version,payload_digest,scope_digest&project_id=eq.${encodeURIComponent(projectId)}&version=eq.${body.planVersion}&limit=1`,
      "GET", token,
    );
    if (!planResult.ok) return NextResponse.json({ error: "Impossible de vérifier la version du plan." }, { status: 502 });
    const plan = Array.isArray(planResult.data) ? planResult.data[0] : null;
    if (!isRecord(plan) || plan.version !== body.planVersion ||
      typeof plan.payload_digest !== "string" || typeof plan.scope_digest !== "string") {
      return NextResponse.json({ error: "Cette version du plan est introuvable." }, { status: 404 });
    }

    const approval = await callUserData("project_memory_approvals", "POST", token, {
      project_id: projectId, plan_version: body.planVersion,
      approval_kind: body.approvalKind, decision: body.decision,
      plan_digest: plan.payload_digest, scope_digest: plan.scope_digest,
      actor_user_id: user.id, actor_role: isAdmin ? "admin" : "client",
      comment: body.comment.trim(), request_id: body.requestId,
    }, "return=representation");
    if (!approval.ok) {
      return NextResponse.json(
        { error: approval.status === 409 ? "Cette demande de validation a déjà été enregistrée." : "La validation a été refusée par les règles de sécurité du projet." },
        { status: approval.status === 409 ? 409 : approval.status === 401 ? 401 : 403 },
      );
    }

    if (isAdmin) {
      const event = await callUserData("project_memory_events", "POST", token, {
        project_id: projectId, event_type: "approval_recorded",
        actor_user_id: user.id, actor_role: "admin",
        correlation_id: body.requestId, plan_version: body.planVersion,
        summary: `Validation administrative « ${body.approvalKind} » : ${body.decision}.`,
        payload: { approval_kind: body.approvalKind, decision: body.decision },
      }, "return=minimal");
      if (!event.ok) return NextResponse.json({ error: "La validation est enregistrée, mais l'événement d'audit doit être réconcilié." }, { status: 502 });
    }

    return NextResponse.json({ saved: true, approvalKind: body.approvalKind, decision: body.decision }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    return NextResponse.json({ error: notConfigured ? "Le service n'est pas configuré." : "Le service de validation est momentanément indisponible." }, {
      status: notConfigured ? 503 : 502, headers: { "Cache-Control": "no-store" },
    });
  }
}
