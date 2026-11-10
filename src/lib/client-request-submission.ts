import type { Project } from "./project-types";

type ApiResult = { error?: string; message?: string; saved?: number };

async function readResult(response: Response): Promise<ApiResult> {
  return await response.json().catch(() => ({})) as ApiResult;
}

/**
 * Persist the signed-in client's project before submitting its commercial request.
 * The factory and approval pipeline address user_projects.id, so a request must
 * never be accepted while its owner-scoped project record is missing.
 */
export async function submitClientRequest(
  project: Project,
  payload: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  const projectResponse = await fetcher("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([project]),
  });
  const projectResult = await readResult(projectResponse);

  if (!projectResponse.ok || projectResult.saved !== 1) {
    throw new Error(
      projectResult.error ??
      "Le dossier n’a pas pu être enregistré dans votre compte. La demande n’a pas été transmise.",
    );
  }

  const requestResponse = await fetcher("/api/client-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const requestResult = await readResult(requestResponse);

  if (!requestResponse.ok) {
    throw new Error(
      requestResult.error ??
      "Votre dossier est sauvegardé dans votre compte, mais sa transmission à MerKora a échoué. Vous pouvez réessayer.",
    );
  }

  return requestResult.message ?? "Demande transmise à MerKora. Elle est enregistrée en ligne.";
}
