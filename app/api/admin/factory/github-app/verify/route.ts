import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/server/admin-access";
import { verifyMerkoraGitHubApp } from "@/lib/server/merkora-factory-github";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) {
    const status = access.reason === "unauthenticated" ? 401
      : access.reason === "not_configured" ? 503 : 403;
    return NextResponse.json(
      { verified: false, message: "Accès administrateur requis ou non configuré." },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await verifyMerkoraGitHubApp();
  if (result.ok) {
    return NextResponse.json(
      {
        verified: true,
        workflowActive: true,
        message: "GitHub App authentifiée ; le workflow MerKora est accessible et actif.",
        sideEffects: "none",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const messages: Record<typeof result.reason, string> = {
    not_configured: "Les variables GitHub App sont incomplètes dans cet environnement.",
    invalid_configuration: "La configuration GitHub App présente un format invalide.",
    github_rejected: "GitHub a refusé la vérification de l’installation ou du workflow.",
    insufficient_permissions: "L’installation GitHub App ne possède pas la permission Actions:write attendue.",
    workflow_unavailable: "Le workflow MerKora est introuvable, inactif ou ne correspond pas au chemin attendu.",
    network_error: "La vérification GitHub est momentanément indisponible.",
  };

  return NextResponse.json(
    { verified: false, reason: result.reason, message: messages[result.reason], sideEffects: "none" },
    { status: result.reason === "not_configured" ? 503 : 502, headers: { "Cache-Control": "no-store" } },
  );
}
