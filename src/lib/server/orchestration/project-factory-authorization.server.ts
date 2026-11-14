import { callUserData } from "@/lib/server/supabase-rest";
import {
  evaluateProjectFactoryApprovals,
  type ProjectFactoryApprovalState,
} from "./project-factory-authorization";

/** Loads the approvals attached to one exact project plan version. */
export async function loadProjectFactoryApprovalState(input: {
  projectId: string;
  accessToken: string;
  planVersion: number;
  planDigest: string;
  scopeDigest: string;
}): Promise<ProjectFactoryApprovalState> {
  if (!input.projectId.trim() || !input.accessToken.trim()
    || !Number.isSafeInteger(input.planVersion) || input.planVersion < 1) {
    throw new Error("PROJECT_APPROVAL_SCOPE_INVALID");
  }

  const result = await callUserData(
    `project_memory_approvals?select=approval_kind,decision,plan_digest,scope_digest,ai_processing_consent&project_id=eq.${encodeURIComponent(input.projectId)}&plan_version=eq.${input.planVersion}`,
    "GET",
    input.accessToken,
  );
  if (!result.ok) throw new Error("PROJECT_APPROVAL_READ_FAILED");
  const rows = Array.isArray(result.data) ? result.data : [];
  return evaluateProjectFactoryApprovals(rows, {
    planDigest: input.planDigest,
    scopeDigest: input.scopeDigest,
  });
}
