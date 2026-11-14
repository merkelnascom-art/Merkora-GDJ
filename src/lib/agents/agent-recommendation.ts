import { AGENT_CATALOG } from "./agent-catalog";

export type AgentRecommendationInput = {
  domainId: string | null;
  tasks: readonly { kind: string }[];
  includedScope: readonly { id?: string; title?: string; description?: string }[];
  summary?: string;
};

export type AgentRecommendation = {
  agentIds: string[];
  reasons: Readonly<Record<string, readonly string[]>>;
};

/**
 * Deterministic first-pass routing from the approved project plan to the
 * specialist catalog. This recommends work; it never activates or executes it.
 */
export function recommendAgentsForProjectPlan(
  plan: AgentRecommendationInput,
): AgentRecommendation {
  const selected = new Map<string, string[]>();
  const add = (agentId: string, reason: string) => {
    const reasons = selected.get(agentId) ?? [];
    if (!reasons.includes(reason)) reasons.push(reason);
    selected.set(agentId, reasons);
  };

  const kinds = new Set(plan.tasks.map((task) => task.kind));
  const scopeText = [
    plan.summary ?? "",
    ...plan.includedScope.flatMap((item) => [item.id ?? "", item.title ?? "", item.description ?? ""]),
  ].join(" ").toLowerCase();

  add("analyste-metier", "Toujours requis pour vérifier la compréhension de l'activité et du besoin.");
  add("analyste-des-besoins", "Toujours requis pour relier le besoin aux résultats attendus.");

  if (plan.domainId) {
    add("expert-sectoriel", "Le plan identifie un domaine métier spécialisé.");
  }
  if (kinds.has("analysis")) {
    add("chercheur-documentaire", "Le plan contient une phase d'analyse.");
    add("detecteur-de-contradictions", "Les faits, hypothèses et contradictions doivent être recoupés.");
  }
  if (kinds.has("scope")) {
    add("expert-fonctionnel", "Le périmètre doit être transformé en règles fonctionnelles.");
    add("architecte-logiciel", "Le périmètre doit être structuré avant la conception.");
  }
  if (kinds.has("design")) {
    add("architecte-logiciel", "Le plan prévoit une phase de conception.");
    add("product-designer", "Le parcours et la proposition doivent être conçus.");
    add("ux-ui-designer", "Les écrans et interactions doivent être préparés.");
    add("redacteur-technique", "Les choix de conception doivent être documentés.");
  }
  if (kinds.has("implementation")) {
    add("developpeur-frontend", "Le plan prévoit une réalisation logicielle.");
    add("developpeur-backend", "Le plan prévoit une réalisation logicielle.");
    add("expert-base-de-donnees", "La réalisation peut nécessiter une structure de données.");
    add("integrateur-api", "Les échanges entre services doivent être évalués.");
    add("generateur-de-fichiers", "Les livrables techniques doivent être assemblés et documentés.");
  }
  if (kinds.has("production")) {
    add("product-designer", "Le plan prévoit une production créative.");
    add("ux-ui-designer", "Les supports de production doivent rester cohérents avec l'expérience.");
    add("generateur-de-fichiers", "Les livrables de production doivent être préparés.");
  }
  if (kinds.has("verification")) {
    add("testeur-logiciel", "Le plan prévoit une vérification formelle.");
    add("auditeur-de-code", "Les livrables doivent être examinés indépendamment.");
    add("detecteur-erreurs", "Les écarts et incohérences doivent être recherchés.");
    add("agent-de-correction", "Les écarts validés doivent pouvoir être corrigés.");
  }
  if (kinds.has("handover")) {
    add("documentation", "Le plan prévoit une remise de livrables.");
    add("formation", "Le transfert doit permettre une prise en main.");
    add("assistant-client", "Le client doit être accompagné pendant la remise.");
    add("suivi-des-demandes", "Les demandes de remise et de clarification doivent être suivies.");
  }

  const sensitiveDomains = new Set([
    "sante",
    "entrepreneuriat-finance",
    "administration-services-publics",
    "ressources-humaines",
    "education-formation",
  ]);
  if (plan.domainId && sensitiveDomains.has(plan.domainId)) {
    add("expert-securite", "Le domaine implique des données ou décisions qui nécessitent une revue de sécurité renforcée.");
  }

  const operationsRequested = /hébergement|hebergement|serveur|supervision|monitoring|maintenance|support|incident|mise en production|déploiement|deploiement/.test(scopeText);
  if (operationsRequested) {
    add("devops", "Le périmètre mentionne une infrastructure ou des opérations d'exploitation.");
    add("supervision", "Le périmètre prévoit le suivi opérationnel.");
    add("maintenance", "Le périmètre prévoit un suivi après mise en service.");
    add("gestion-des-incidents", "Le périmètre nécessite une préparation de réponse aux incidents.");
  }

  const productionReleaseRequested = /mise en production|déploiement en production|deploiement en production|publication publique/.test(scopeText);
  if (productionReleaseRequested) {
    add("gestionnaire-des-deploiements", "Le périmètre mentionne explicitement une mise en production.");
  }

  if (/support après livraison|support apres livraison|contrat de maintenance|maintenance continue/.test(scopeText)) {
    add("support-apres-livraison", "Le périmètre prévoit explicitement un accompagnement après livraison.");
  }

  add("estimation-ressources-couts", "Le projet doit faire l'objet d'une estimation de ressources.");
  add("preparation-des-devis", "Un devis préparatoire doit être assemblé et revu.");
  add("suivi-des-budgets", "Les hypothèses budgétaires doivent rester traçables.");
  add("gestion-des-autorisations", "Les accès et autorisations doivent être vérifiés avant les actions sensibles.");
  add("validation-administrative", "Le dossier doit passer les contrôles administratifs prévus.");

  const agentIds = AGENT_CATALOG
    .map((agent) => agent.id)
    .filter((agentId) => selected.has(agentId));
  const reasons = Object.fromEntries(
    agentIds.map((agentId) => [agentId, selected.get(agentId) ?? []]),
  );

  return { agentIds, reasons };
}
