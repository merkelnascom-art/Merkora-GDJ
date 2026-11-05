import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { dispatchMerkoraFactoryWorkflow } from "@/lib/server/merkora-factory-github";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  try {
    const store = await cookies();
    const [user, token, admin] = await Promise.all([
      getCurrentUser(store), getAccessToken(store), getAdminAccess(),
    ]);
    if (!user || !token) return NextResponse.json({ error: "Connexion administrateur requise." }, { status: 401 });
    if (!admin.ok) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 403 });

    const { projectId, jobId } = await context.params;
    if (typeof projectId !== "string" || !/^[a-zA-Z0-9_-]{3,100}$/.test(projectId) || !isUuid(jobId)) {
      return NextResponse.json({ error: "Projet ou travail introuvable." }, { status: 404 });
    }

    const jobResult = await callUserData(
      `project_factory_jobs?select=id,status&project_id=eq.${encodeURIComponent(projectId)}&id=eq.${encodeURIComponent(jobId)}&limit=1`,
      "GET", token,
    );
    if (!jobResult.ok) return NextResponse.json({ error: "Lecture du travail impossible." }, { status: 502 });
    const jobs = Array.isArray(jobResult.data) ? jobResult.data : [];
    const job = jobs[0] as { id?: unknown; status?: unknown } | undefined;
    if (!job || job.status !== "queued") {
      return NextResponse.json({ error: "Seul un travail en attente peut être déclenché." }, { status: 409 });
    }

    const result = await dispatchMerkoraFactoryWorkflow(projectId, jobId);
    if (!result.ok) {
      const messages = {
        not_configured: "Le déclenchement GitHub n'est pas configuré sur le serveur.",
        invalid_configuration: "La configuration de l'application GitHub est invalide.",
        github_rejected: "GitHub a refusé le déclenchement. Vérifiez les permissions Actions: write et l'installation sur le dépôt.",
        network_error: "GitHub est momentanément inaccessible. Le travail reste en attente.",
      } as const;
      return NextResponse.json({
        dispatched: false, jobId, status: "queued", retryable: true, reason: result.reason,
        error: messages[result.reason],
      }, { status: result.reason === "not_configured" ? 503 : 502, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({
      dispatched: true, jobId, status: "queued", runRequested: true,
      message: "GitHub Actions a accepté le déclenchement. Le worker doit encore réclamer et valider le travail.",
    }, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le service de déclenchement est momentanément indisponible." }, {
      status: 502, headers: { "Cache-Control": "no-store" },
    });
  }
}
