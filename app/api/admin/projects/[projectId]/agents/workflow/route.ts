import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { planAgentFactoryWorkflow } from "@/lib/agents/agent-factory-workflow";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

type WorkflowPayload = {
  workflowId: string;
  agentIds: string[];
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function text(value: unknown, max: number, min = 0): value is string {
  return typeof value === "string" && value.length <= max && value.trim().length >= min;
}

function validPayload(value: unknown): value is WorkflowPayload {
  return record(value)
    && text(value.workflowId, 30, 1)
    && /^[a-z0-9][a-z0-9-]{0,29}$/.test(value.workflowId)
    && Array.isArray(value.agentIds)
    && value.agentIds.length >= 1
    && value.agentIds.length <= 35
    && value.agentIds.every((agentId) => text(agentId, 100, 1))
    && JSON.stringify(value).length <= 10_000;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }
  if (!validPayload(body)) {
    return NextResponse.json({ error: "La sélection des spécialistes est invalide." }, { status: 400 });
  }

  try {
    const admin = await getAdminAccess();
    if (!admin.ok) {
      return NextResponse.json(
        { error: admin.reason === "unauthenticated" ? "Connexion administrateur requise." : "Accès administrateur refusé." },
        { status: admin.reason === "unauthenticated" ? 401 : 403 },
      );
    }

    const token = await getAccessToken(await cookies());
    if (!token) {
      return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
    }

    const { projectId } = await context.params;
    if (!text(projectId, 100, 3)) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const snapshot = await callUserData(
      `project_memory_plan_versions?select=version,source_brief_version,payload_digest,scope_digest&project_id=eq.${encodeURIComponent(projectId)}&order=version.desc&limit=1`,
      "GET",
      token,
    );
    if (!snapshot.ok) {
      return NextResponse.json({ error: "Lecture du plan projet impossible." }, { status: 502 });
    }

    const rows = Array.isArray(snapshot.data) ? snapshot.data : [];
    const latest = rows[0];
    if (
      !record(latest)
      || typeof latest.version !== "number"
      || !Number.isInteger(latest.version)
      || latest.version < 1
      || typeof latest.source_brief_version !== "number"
      || !Number.isInteger(latest.source_brief_version)
      || latest.source_brief_version < 1
      || !text(latest.payload_digest, 64, 64)
      || !/^[a-f0-9]{64}$/i.test(latest.payload_digest)
      || !text(latest.scope_digest, 64, 64)
      || !/^[a-f0-9]{64}$/i.test(latest.scope_digest)
    ) {
      return NextResponse.json(
        { error: "Aucun plan projet versionné et vérifiable n'est disponible. Préparez d'abord le plan administratif." },
        { status: 409 },
      );
    }

    const workflow = planAgentFactoryWorkflow({
      projectId,
      workflowId: body.workflowId,
      agentIds: body.agentIds,
      contextReferences: [
        `project-brief-version:${latest.source_brief_version}`,
        `project-plan-version:${latest.version}`,
        `project-plan-digest:${latest.payload_digest}`,
        `project-scope-digest:${latest.scope_digest}`,
      ],
    });

    return NextResponse.json({
      prepared: true,
      executionStarted: false,
      sourceVersions: {
        briefVersion: latest.source_brief_version,
        planVersion: latest.version,
      },
      workflow,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const knownSelectionError = message.startsWith("Agent inconnu :")
      || message === "Identifiant de workflow invalide."
      || message === "Identifiant d'agent invalide."
      || message === "Sélection d'agents vide."
      || message === "La sélection dépasse les 35 agents du catalogue.";
    return NextResponse.json(
      { error: knownSelectionError ? message : "Le workflow projet n'a pas pu être préparé." },
      { status: knownSelectionError ? 400 : 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
