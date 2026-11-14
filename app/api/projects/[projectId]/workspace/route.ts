import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validProjectId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 3 && value.length <= 100 && /^[a-zA-Z0-9_-]+$/.test(value);
}

async function getOwnerProject(projectId: string, userId: string, token: string) {
  return callUserData(
    `user_projects?select=id&id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    "GET",
    token,
  );
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour retrouver votre dossier." }, { status: 401 });
    const owner = await getOwnerProject(projectId, user.id, token);
    if (!owner.ok) return NextResponse.json({ error: "Impossible de vérifier l'accès au dossier." }, { status: 502 });
    if (!Array.isArray(owner.data) || owner.data.length !== 1) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

    const [state, events] = await Promise.all([
      callUserData(`project_workspace_state?select=project_id,revision,payload,payload_digest,updated_at&project_id=eq.${encodeURIComponent(projectId)}&limit=1`, "GET", token),
      callUserData(`project_workspace_events?select=id,revision,event_type,summary,payload,created_at&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.desc&limit=100`, "GET", token),
    ]);
    if (!state.ok || !events.ok) return NextResponse.json({ error: "Le contexte du projet est momentanément indisponible." }, { status: 502 });
    return NextResponse.json({
      workspace: Array.isArray(state.data) ? state.data[0] ?? null : null,
      events: Array.isArray(events.data) ? events.data : [],
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le service de dossier est momentanément indisponible." }, { status: 502 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  try {
    const { projectId } = await context.params;
    if (!validProjectId(projectId)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    const raw: unknown = await request.json().catch(() => null);
    if (!isRecord(raw) || !isRecord(raw.payload) ||
      !Number.isInteger(raw.expectedRevision) || (raw.expectedRevision as number) < 0 ||
      typeof raw.eventType !== "string" || typeof raw.summary !== "string") {
      return NextResponse.json({ error: "Le contexte transmis est invalide." }, { status: 400 });
    }
    const serialized = JSON.stringify(raw.payload);
    if (Buffer.byteLength(serialized, "utf8") > 60_000) {
      return NextResponse.json({ error: "Le contexte du projet dépasse la taille autorisée." }, { status: 413 });
    }
    const allowedEvents = new Set([
      "workspace_created", "diagnostic_answer_saved", "sector_confirmed",
      "profession_confirmed", "deliverable_selected", "client_decision",
      "client_change_requested", "conversation_turn_saved", "client_journey_saved",
    ]);
    const summary = raw.summary.trim().slice(0, 1000);
    if (!allowedEvents.has(raw.eventType) || !summary) {
      return NextResponse.json({ error: "Le type d'événement ou son résumé est invalide." }, { status: 400 });
    }

    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) return NextResponse.json({ error: "Connectez-vous pour sauvegarder votre dossier." }, { status: 401 });
    const owner = await getOwnerProject(projectId, user.id, token);
    if (!owner.ok) return NextResponse.json({ error: "Impossible de vérifier l'accès au dossier." }, { status: 502 });
    if (!Array.isArray(owner.data) || owner.data.length !== 1) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

    const digest = createHash("sha256").update(serialized).digest("hex");
    const saved = await callUserData("rpc/save_project_workspace_state", "POST", token, {
      p_project_id: projectId,
      p_expected_revision: raw.expectedRevision,
      p_payload: raw.payload,
      p_payload_digest: digest,
      p_event_type: raw.eventType,
      p_summary: summary,
    });
    if (!saved.ok) {
      const detail = isRecord(saved.data) && typeof saved.data.message === "string" ? saved.data.message : "";
      if (saved.status === 409 || detail.includes("workspace_revision_conflict") || detail.includes("40001")) {
        return NextResponse.json({ error: "Ce dossier a été modifié sur un autre appareil. Rechargez sa dernière version avant de réessayer.", code: "REVISION_CONFLICT" }, { status: 409 });
      }
      return NextResponse.json({ error: "La sauvegarde en ligne a échoué. Vos données locales ne doivent pas être effacées.", code: "WORKSPACE_SAVE_FAILED" }, { status: 502 });
    }
    const result = isRecord(saved.data) ? saved.data : {};
    return NextResponse.json({ saved: true, revision: result.revision ?? (raw.expectedRevision as number) + 1, digest }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Le service de sauvegarde est momentanément indisponible." }, { status: 502 });
  }
}
