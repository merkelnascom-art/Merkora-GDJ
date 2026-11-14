export type IntegrationStatus = "not_configured" | "connected" | "attention_required";

export type IntegrationStatusPresentation = {
  label: string;
  tone: "neutral" | "success" | "warning";
};

export function getIntegrationStatusPresentation(status: string): IntegrationStatusPresentation {
  switch (status) {
    case "not_configured":
      return { label: "Non connecté", tone: "neutral" };
    case "connected":
      return { label: "Connecté", tone: "success" };
    case "attention_required":
      return { label: "À vérifier", tone: "warning" };
    default:
      return { label: "État inconnu", tone: "neutral" };
  }
}
