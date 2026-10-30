import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateProjectPlan } from "@/lib/planning/generate-project-plan";
import type {
  ConfirmedConstraint,
  PlanSelectedOption,
  PlanScopeInput,
} from "@/lib/planning/plan-types";
import type { NeedInput } from "@/lib/solution-recommendations";
import {
  callUserData,
  getAccessToken,
  getCurrentUser,
  isSameOrigin,
} from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

const categories = new Set(["business", "digital", "creative", "organization", "personal", "other"]);
const select = "id,user_id,title,category,problem,desired_outcome,budget,urgency";

type PreviewPayload = {
  briefVersion: number;
  planVersion: number;
  plannerVersion: string;
  selectedOptions: PlanSelectedOption[];
  approvedScope: PlanScopeInput[];
  confirmedConstraints: ConfirmedConstraint[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isText(value: unknown, maxLength: number, minLength = 0): value is string {
  return typeof value === "string" && value.length <= maxLength && value.trim().length >= minLength;
}

function validStringArray<T>(
  value: unknown,
  maxItems: number,
  validate: (item: unknown) => item is T,
): value is T[] {
  return value === undefined || (
    Array.isArray(value) && value.length <= maxItems && value.every(validate)
  );
}

function validPayload(value: unknown): value is PreviewPayload {
  if (!isRecord(value)) return false;
  if (!Number.isInteger(value.briefVersion) || Number(value.briefVersion) < 1) return false;
  if (!Number.isInteger(value.planVersion) || Number(value.planVersion) < 1) return false;
  if (!isText(value.plannerVersion, 40, 1)) return false;

  const validOption = (item: unknown): item is PlanSelectedOption =>
    isRecord(item) && isText(item.id, 100, 1) &&
    isText(item.title, 160, 1) && isText(item.description, 800);
  const validScope = (item: unknown): item is PlanScopeInput =>
    isRecord(item) && isText(item.id, 100, 1) &&
    isText(item.label, 160, 1) &&
    (item.description === undefined || isText(item.description, 800));
  const validConstraint = (item: unknown): item is ConfirmedConstraint =>
    isRecord(item) && isText(item.key, 80, 1) && isText(item.value, 500, 1);

  if (!validStringArray(value.selectedOptions, 30, validOption)) return false;
  if (!validStringArray(value.approvedScope, 50, validScope)) return false;
  if (!validStringArray(value.confirmedConstraints, 30, validConstraint)) return false;
  return JSON.stringify(value).length <= 20_000;
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
    return NextResponse.json({ error: "Données de plan invalides." }, { status: 400 });
  }
  if (!validPayload(body)) {
    return NextResponse.json({ error: "Les versions ou les choix transmis sont invalides." }, { status: 400 });
  }

  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const accessToken = await getAccessToken(store);
    if (!user || !accessToken) {
      return NextResponse.json({ error: "Connectez-vous pour préparer le plan de ce projet." }, { status: 401 });
    }

    const { projectId } = await context.params;
    if (!isText(projectId, 100, 3)) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const result = await callUserData(
      `user_projects?select=${select}&id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET",
      accessToken,
    );
    if (!result.ok) {
      return NextResponse.json(
        { error: "Impossible de consulter le dossier du projet." },
        { status: result.status === 401 ? 401 : 502 },
      );
    }

    const row = Array.isArray(result.data) ? result.data[0] : null;
    if (!isRecord(row) || row.user_id !== user.id || typeof row.id !== "string") {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }
    if (
      typeof row.title !== "string" ||
      typeof row.category !== "string" ||
      !categories.has(row.category) ||
      typeof row.problem !== "string" ||
      typeof row.desired_outcome !== "string" ||
      typeof row.budget !== "string" ||
      typeof row.urgency !== "string"
    ) {
      return NextResponse.json({ error: "Le dossier du projet contient des informations incomplètes." }, { status: 422 });
    }

    const need: NeedInput = {
      title: row.title,
      category: row.category as NeedInput["category"],
      problem: row.problem,
      desiredOutcome: row.desired_outcome,
      budget: row.budget,
      urgency: row.urgency,
    };
    const plan = generateProjectPlan({
      projectId: row.id,
      briefVersion: body.briefVersion,
      planVersion: body.planVersion,
      plannerVersion: body.plannerVersion,
      need,
      selectedOptions: body.selectedOptions ?? [],
      approvedScope: body.approvedScope ?? [],
      confirmedConstraints: body.confirmedConstraints ?? [],
    });

    return NextResponse.json({ plan }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    return NextResponse.json(
      { error: notConfigured ? "La sauvegarde en ligne n’est pas configurée." : "Le service de planification est momentanément indisponible." },
      { status: notConfigured ? 503 : 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
