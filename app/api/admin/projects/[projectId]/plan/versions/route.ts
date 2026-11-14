import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateProjectPlan } from "@/lib/planning/generate-project-plan";
import type { ConfirmedConstraint, PlanScopeInput, PlanSelectedOption } from "@/lib/planning/plan-types";
import type { NeedInput } from "@/lib/solution-recommendations";
import { createProjectMemoryDigest } from "@/lib/factory/project-memory-digest";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

type Payload = {
  plannerVersion: string;
  requestId: string;
  selectedOptions?: PlanSelectedOption[];
  approvedScope?: PlanScopeInput[];
  confirmedConstraints?: ConfirmedConstraint[];
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function text(value: unknown, max: number, min = 0): value is string {
  return typeof value === "string" && value.length <= max && value.trim().length >= min;
}
function validPayload(value: unknown): value is Payload {
  if (!record(value) || !text(value.plannerVersion, 100, 1) ||
    typeof value.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.requestId)) return false;
  const options = value.selectedOptions ?? [];
  const scope = value.approvedScope ?? [];
  const constraints = value.confirmedConstraints ?? [];
  return Array.isArray(options) && options.length <= 30 &&
    options.every((v) => record(v) && text(v.id, 100, 1) && text(v.title, 160, 1) && text(v.description, 800)) &&
    Array.isArray(scope) && scope.length <= 50 &&
    scope.every((v) => record(v) && text(v.id, 100, 1) && text(v.label, 160, 1) && (v.description === undefined || text(v.description, 800))) &&
    Array.isArray(constraints) && constraints.length <= 30 &&
    constraints.every((v) => record(v) && text(v.key, 80, 1) && text(v.value, 500, 1)) &&
    JSON.stringify(value).length <= 20000;
}

async function latestVersion(path: string, token: string): Promise<number> {
  const result = await callUserData(path, "GET", token);
  if (!result.ok) throw new Error("MEMORY_READ_FAILED");
  const rows = Array.isArray(result.data) ? result.data : [];
  const version = rows.length && record(rows[0]) ? rows[0].version : 0;
  return Number.isInteger(version) && Number(version) > 0 ? Number(version) : 0;
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!validPayload(body)) return NextResponse.json({ error: "Les choix transmis sont invalides." }, { status: 400 });

  try {
    const admin = await getAdminAccess();
    if (!admin.ok) return NextResponse.json({ error: admin.reason === "unauthenticated" ? "Connexion administrateur requise." : "Accès administrateur refusé." }, { status: admin.reason === "unauthenticated" ? 401 : 403 });
    const token = await getAccessToken(await cookies());
    if (!token) return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });

    const { projectId } = await context.params;
    if (!text(projectId, 100, 3)) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

    const requestResult = await callUserData(
      "client_requests?select=id,user_id,project_id,payload&id=eq." + encodeURIComponent(body.requestId) + "&project_id=eq." + encodeURIComponent(projectId) + "&limit=1",
      "GET", token,
    );
    if (!requestResult.ok) return NextResponse.json({ error: "Impossible de vérifier le dossier commercial source." }, { status: 502 });
    const sourceRequest = Array.isArray(requestResult.data) ? requestResult.data[0] : null;
    if (!record(sourceRequest) || sourceRequest.id !== body.requestId ||
      sourceRequest.project_id !== projectId || typeof sourceRequest.user_id !== "string" ||
      !record(sourceRequest.payload)) {
      return NextResponse.json({ error: "Le dossier client ne correspond pas à ce projet." }, { status: 409 });
    }

    const launchResult = await callUserData(
      "client_project_launches?select=id,request_id,client_user_id,quote_version_id,invoice_id,launched_at&request_id=eq." + encodeURIComponent(body.requestId) + "&limit=1",
      "GET", token,
    );
    if (!launchResult.ok) return NextResponse.json({ error: "Impossible de vérifier le lancement commercial." }, { status: 502 });
    const officialLaunch = Array.isArray(launchResult.data) ? launchResult.data[0] : null;
    if (!record(officialLaunch) || officialLaunch.request_id !== body.requestId ||
      officialLaunch.client_user_id !== sourceRequest.user_id ||
      typeof officialLaunch.quote_version_id !== "string" || typeof officialLaunch.invoice_id !== "string") {
      return NextResponse.json({ error: "Plan interne réservé aux lancements commerciaux vérifiés." }, { status: 409 });
    }

    const requestPayload = sourceRequest.payload;
    const requestProject = record(requestPayload.project) ? requestPayload.project : null;
    if (!requestProject || requestProject.id !== projectId ||
      !text(requestProject.title, 160, 1) || !text(requestProject.category, 40, 1) ||
      !text(requestProject.problem, 2500, 1) || !text(requestProject.desiredOutcome, 1500, 1) ||
      !text(requestProject.budget, 100) || !text(requestProject.urgency, 40)) {
      return NextResponse.json({ error: "Le dossier commercial ne contient pas un besoin projet complet." }, { status: 409 });
    }
    const project = {
      title: requestProject.title as string,
      category: requestProject.category as string,
      problem: requestProject.problem as string,
      desiredOutcome: requestProject.desiredOutcome as string,
      budget: requestProject.budget as string,
      urgency: requestProject.urgency as string,
    };
    const requestStudio = record(requestPayload.studio) ? requestPayload.studio : {};
    const recommendations = Array.isArray(requestProject.recommendations) ? requestProject.recommendations : [];
    const selectedIds = Array.isArray(requestStudio.selectedRecommendationIds)
      ? requestStudio.selectedRecommendationIds.filter((value): value is string => typeof value === "string")
      : [];
    const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const selectedOptions: PlanSelectedOption[] = recommendations.flatMap((value) => {
      if (!record(value) || !text(value.title, 160, 1) || !text(value.description, 800)) return [];
      const id = text(value.id, 100, 1) ? value.id : slugify(value.title);
      return selectedIds.includes(id) ? [{ id, title: value.title, description: value.description }] : [];
    });
    if (selectedOptions.length !== new Set(selectedIds).size) {
      return NextResponse.json({ error: "Certains choix du Studio ne correspondent pas aux recommandations enregistrées." }, { status: 409 });
    }

    const need: NeedInput = {
      title: project.title, category: project.category as NeedInput["category"],
      problem: project.problem, desiredOutcome: project.desiredOutcome,
      budget: project.budget, urgency: project.urgency,
    };
    const briefPayload = {
      title: project.title, category: project.category, problem: project.problem,
      desiredOutcome: project.desiredOutcome, budget: project.budget, urgency: project.urgency,
    };
    const briefLatest = await latestVersion(
      `project_memory_brief_versions?select=version&project_id=eq.${encodeURIComponent(projectId)}&order=version.desc&limit=1`, token,
    );
    const briefVersion = briefLatest + 1;
    const briefDigest = createProjectMemoryDigest(briefPayload);
    const briefInsert = await callUserData("project_memory_brief_versions", "POST", token, {
      project_id: projectId, version: briefVersion, payload: briefPayload,
      payload_digest: briefDigest, created_by: admin.user.id,
    }, "return=representation");
    if (!briefInsert.ok) return NextResponse.json({ error: "La version du besoin n'a pas pu être enregistrée. Vérifiez qu'aucune version concurrente n'a été créée." }, { status: briefInsert.status === 409 ? 409 : 502 });

    const planLatest = await latestVersion(
      `project_memory_plan_versions?select=version&project_id=eq.${encodeURIComponent(projectId)}&order=version.desc&limit=1`, token,
    );
    const plan = generateProjectPlan({
      projectId, briefVersion, planVersion: planLatest + 1,
      plannerVersion: body.plannerVersion, need,
      selectedOptions,
      approvedScope: body.approvedScope ?? [],
      confirmedConstraints: body.confirmedConstraints ?? [],
    });
    const scopePayload = plan.includedScope;
    const planDigest = createProjectMemoryDigest(plan);
    const scopeDigest = createProjectMemoryDigest(scopePayload);
    const planInsert = await callUserData("project_memory_plan_versions", "POST", token, {
      project_id: projectId, version: plan.version, source_brief_version: briefVersion,
      planner_version: body.plannerVersion, payload: plan, payload_digest: planDigest,
      scope_digest: scopeDigest, created_by: admin.user.id,
    }, "return=representation");
    if (!planInsert.ok) return NextResponse.json({ error: "Le besoin a été mémorisé, mais le plan n'a pas pu être enregistré. Aucun lancement n'a été créé." }, { status: planInsert.status === 409 ? 409 : 502 });

    const event = await callUserData("project_memory_events", "POST", token, {
      project_id: projectId, event_type: "plan_version_created",
      actor_user_id: admin.user.id, actor_role: "admin",
      correlation_id: crypto.randomUUID(), brief_version: briefVersion,
      plan_version: plan.version, summary: `Plan v${plan.version} enregistré pour le projet.`,
      payload: { plan_digest: planDigest, scope_digest: scopeDigest },
    }, "return=minimal");
    if (!event.ok) return NextResponse.json({ error: "Le plan est enregistré, mais son événement d'audit doit être réconcilié." }, { status: 502 });

    return NextResponse.json({
      saved: true, briefVersion, planVersion: plan.version,
      planDigest, scopeDigest, plan,
      executionStarted: false,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const missingConfig = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    return NextResponse.json(
      { error: missingConfig ? "La sauvegarde en ligne n'est pas configurée." : "Le service de mémoire projet est momentanément indisponible." },
      { status: missingConfig ? 503 : 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
