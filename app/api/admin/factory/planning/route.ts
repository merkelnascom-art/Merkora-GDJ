import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
function isRecord(value: unknown): value is Row {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function GET() {
  const admin = await getAdminAccess();
  if (!admin.ok) return NextResponse.json({ error: "Accès administrateur requis." }, { status: admin.reason === "unauthenticated" ? 401 : 403 });

  try {
    const token = await getAccessToken(await cookies());
    if (!token) return NextResponse.json({ error: "Session administrateur expirée." }, { status: 401 });

    const launchResult = await callUserData(
      "client_project_launches?select=id,request_id,client_user_id,quote_version_id,invoice_id,launched_at,required_amount,invoice_total_at_launch,confirmed_amount_at_launch&order=launched_at.desc&limit=100",
      "GET", token,
    );
    if (!launchResult.ok) return NextResponse.json({ error: "Impossible de charger les lancements officiels." }, { status: 502 });
    const launches = Array.isArray(launchResult.data) ? launchResult.data.filter(isRecord) : [];
    const requestIds = [...new Set(launches.map((row) => row.request_id).filter((id): id is string => typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id)))];
    if (!requestIds.length) return NextResponse.json({ projects: [] }, { headers: { "Cache-Control": "no-store" } });

    const requestResult = await callUserData(
      "client_requests?select=id,user_id,project_id,project_title,payload,admin_status,created_at&id=in.(" + requestIds.join(",") + ")",
      "GET", token,
    );
    if (!requestResult.ok) return NextResponse.json({ error: "Impossible de rapprocher les lancements des dossiers clients." }, { status: 502 });
    const requests = Array.isArray(requestResult.data) ? requestResult.data.filter(isRecord) : [];
    const requestById = new Map(requests.map((row) => [String(row.id), row]));
    const latestLaunchByProject = new Map<string, Row>();
    for (const launch of launches) {
      const request = requestById.get(String(launch.request_id));
      if (!request || typeof request.project_id !== "string" ||
        request.user_id !== launch.client_user_id || request.id !== launch.request_id) continue;
      if (!latestLaunchByProject.has(request.project_id)) latestLaunchByProject.set(request.project_id, launch);
    }
    const projectIds = [...latestLaunchByProject.keys()];
    if (!projectIds.length) return NextResponse.json({ projects: [] }, { headers: { "Cache-Control": "no-store" } });

    const filter = projectIds.join(",");
    const planResult = await callUserData(
      "project_memory_plan_versions?select=project_id,version,payload,payload_digest,scope_digest,created_at&project_id=in.(" + filter + ")&order=version.desc",
      "GET", token,
    );
    if (!planResult.ok) return NextResponse.json({ error: "Impossible de charger les plans internes." }, { status: 502 });
    const planByProject = new Map<string, Row>();
    for (const plan of (Array.isArray(planResult.data) ? planResult.data.filter(isRecord) : [])) {
      if (typeof plan.project_id === "string" && !planByProject.has(plan.project_id)) planByProject.set(plan.project_id, plan);
    }

    const approvalResult = await callUserData(
      "project_memory_approvals?select=id,project_id,plan_version,approval_kind,decision,plan_digest,scope_digest,created_at&project_id=in.(" + filter + ")",
      "GET", token,
    );
    if (!approvalResult.ok) return NextResponse.json({ error: "Impossible de charger les validations internes." }, { status: 502 });
    const approvals = Array.isArray(approvalResult.data) ? approvalResult.data.filter(isRecord) : [];

    const projects = projectIds.flatMap((projectId) => {
      const launch = latestLaunchByProject.get(projectId);
      const request = launch ? requestById.get(String(launch.request_id)) : null;
      if (!launch || !request) return [];
      const plan = planByProject.get(projectId) ?? null;
      const exactApprovals = plan ? approvals.filter((approval) =>
        approval.project_id === projectId && approval.plan_version === plan.version &&
        approval.plan_digest === plan.payload_digest && approval.scope_digest === plan.scope_digest,
      ) : [];
      return [{ launch, request, plan, approvals: exactApprovals }];
    });

    return NextResponse.json({ projects }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le suivi de planification est momentanément indisponible." }, { status: 503 });
  }
}
