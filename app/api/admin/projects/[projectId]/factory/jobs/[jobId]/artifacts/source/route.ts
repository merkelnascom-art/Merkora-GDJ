import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, downloadUserStorageObject, getAccessToken } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET = "merkora-factory-artifacts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const admin = await getAdminAccess();
    if (!admin.ok) return Response.json({ error: "Accès administrateur refusé." }, { status: admin.reason === "unauthenticated" ? 401 : 403 });
    const token = await getAccessToken(await cookies());
    if (!token) return Response.json({ error: "Session expirée." }, { status: 401 });

    const { projectId, jobId } = await context.params;
    if (typeof projectId !== "string" || !/^[a-zA-Z0-9_-]{3,100}$/.test(projectId) || !isUuid(jobId)) {
      return Response.json({ error: "Projet ou travail introuvable." }, { status: 404 });
    }

    const result = await callUserData(
      `project_factory_jobs?select=id,status,manifest&project_id=eq.${encodeURIComponent(projectId)}&id=eq.${encodeURIComponent(jobId)}&limit=1`,
      "GET", token,
    );
    if (!result.ok) return Response.json({ error: "Lecture du travail impossible." }, { status: 502 });
    const job = Array.isArray(result.data) ? result.data[0] : null;
    if (!isRecord(job) || !isRecord(job.manifest) ||
      !["awaiting_approval", "failed", "blocked"].includes(String(job.status))) {
      return Response.json({ error: "Aucun code généré n'est disponible pour ce travail." }, { status: 404 });
    }

    const sourcePath = job.manifest.sourcePath;
    const sourceDigest = job.manifest.sourceDigest;
    if (typeof sourcePath !== "string" || typeof sourceDigest !== "string" ||
      !/^[a-f0-9]{64}$/.test(sourceDigest) ||
      sourcePath !== `${projectId}/${jobId}/source-${sourceDigest}.json`) {
      return Response.json({ error: "Le fichier source n'est pas référencé dans le manifeste." }, { status: 404 });
    }

    const artifact = await downloadUserStorageObject(BUCKET, sourcePath, token);
    if (!artifact.ok || !artifact.data) {
      return Response.json({ error: "Le fichier source privé est momentanément indisponible." }, { status: artifact.status === 404 ? 404 : 502 });
    }
    const body = artifact.data.buffer.slice(
      artifact.data.byteOffset,
      artifact.data.byteOffset + artifact.data.byteLength,
    ) as ArrayBuffer;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": artifact.contentType.startsWith("application/json") ? "application/json; charset=utf-8" : "application/octet-stream",
        "Content-Disposition": `attachment; filename="merkora-${jobId}-source.json"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "Le téléchargement sécurisé est momentanément indisponible." }, { status: 502 });
  }
}
