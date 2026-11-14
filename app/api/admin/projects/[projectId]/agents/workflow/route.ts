import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { planAgentFactoryWorkflow } from "@/lib/agents/agent-factory-workflow";
import { loadProjectFactoryContext } from "@/lib/server/orchestration/project-factory-context";
import { getAdminAccess } from "@/lib/server/admin-access";
import { getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

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

    const snapshot = await loadProjectFactoryContext(projectId, token);
    const selectionSource = body.agentIds.length > 0 ? "explicit" : "core_recommendation";
    const selectedAgentIds = selectionSource === "explicit"
      ? body.agentIds
      : snapshot.recommendedAgentIds;
    if (selectedAgentIds.length === 0) {
      return NextResponse.json(
        { error: "Le plan ne permet pas encore de recommander une équipe. Complétez d'abord son périmètre." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const workflow = planAgentFactoryWorkflow({
      projectId,
      workflowId: body.workflowId,
      agentIds: selectedAgentIds,
      contextReferences: snapshot.contextReferences,
      contextInstructions: snapshot.contextInstructions,
    });

    return NextResponse.json({
      prepared: true,
      executionStarted: false,
      selectionSource,
      recommendedAgentIds: snapshot.recommendedAgentIds,
      recommendationReasons: snapshot.recommendationReasons,
      sourceVersions: {
        briefVersion: snapshot.briefVersion,
        planVersion: snapshot.planVersion,
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
    const missingProject = message === "PROJECT_NOT_FOUND";
    const missingPlan = message === "PROJECT_PLAN_NOT_FOUND";
    const invalidSnapshot = message === "PROJECT_CONTEXT_INTEGRITY_FAILED";
    const status = knownSelectionError ? 400 : missingProject ? 404 : missingPlan || invalidSnapshot ? 409 : 502;
    const errorMessage = knownSelectionError
      ? message
      : missingProject
        ? "Projet introuvable ou inaccessible."
        : missingPlan
          ? "Aucun plan projet versionné n'est disponible. Préparez d'abord le plan administratif."
          : invalidSnapshot
            ? "Le plan ou le brief ne correspond plus à son empreinte d'intégrité."
            : "Le workflow projet n'a pas pu être préparé.";
    return NextResponse.json(
      { error: errorMessage },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
