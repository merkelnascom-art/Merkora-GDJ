export type IntegrationStatusTone = "success" | "warning" | "neutral";

export type IntegrationStatusPresentation = {
  label: string;
  tone: IntegrationStatusTone;
};

/**
 * Provides a safe, display-only label for integration connection states.
 * Unknown states deliberately fall back to neutral rather than implying
 * that an integration is connected or authorized.
 */
export function getIntegrationStatusPresentation(status: string): IntegrationStatusPresentation {
  switch (status) {
    case "connected":
    case "active":
      return { label: "Connecté", tone: "success" };
    case "pending":
    case "verification_required":
      return { label: "Vérification requise", tone: "warning" };
    case "not_configured":
      return { label: "Non configuré", tone: "neutral" };
    case "error":
    case "disconnected":
      return { label: "À vérifier", tone: "warning" };
    default:
      return { label: "État à confirmer", tone: "neutral" };
  }
}
