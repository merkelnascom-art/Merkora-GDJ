import {
  getActiveProductDefinitionAnswers,
  type ProductDefinitionAnswer,
  type ProductDefinitionSession,
} from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal, SolutionProposalComponent } from "./solution-proposal";

export type VisualProductNature = "website" | "platform" | "application" | "other" | "undecided";
export type VisualProductNatureStatus = "confirmed" | "suggested" | "undetermined" | "conflicting";
export type VisualDeliveryMode = "browser" | "pwa" | "mobile" | "web" | "hybrid";
export type VisualArea =
  | "orders" | "finance" | "customers" | "resources" | "people" | "planning"
  | "production" | "communication" | "reporting" | "operations" | "records" | "settings" | "other";

export interface VisualProfile {
  id: string;
  name: string;
  note: string;
  responsibilities: string[];
}

export interface VisualFeature {
  id: string;
  componentId: string;
  label: string;
  description: string;
  area: VisualArea;
  fields: string[];
  actionLabel: string;
  blockType: "form" | "table" | "metrics" | "settings";
  sourceIds: string[];
  sourceLabel: string;
}

export interface VisualScreen {
  id: string;
  title: string;
  description: string;
  navLabel: string;
  items: string[];
  previewFields: string[];
  primaryActionLabel: string;
  features: VisualFeature[];
  sourceIds: string[];
}

export interface VisualDecisionRegisterEntry {
  id: string;
  elementType: "dashboard" | "screen" | "feature" | "action" | "field";
  elementLabel: string;
  sourceKind: "accepted_component" | "validated_answer" | "knowledge_suggestion" | "derived_structure";
  sourceIds: string[];
  sourceLabel: string;
  rationale: string;
}

export interface VisualBlueprint {
  projectTitle: string;
  kind: "digital" | "operational";
  summary: string;
  productNature: VisualProductNature;
  productNatureStatus: VisualProductNatureStatus;
  deliveryModes: VisualDeliveryMode[];
  deliveryModeStatus: "confirmed" | "not_selected";
  profiles: VisualProfile[];
  screens: VisualScreen[];
  flow: string[];
  pendingItems: string[];
  unresolvedPoints: string[];
  decisionRegister: VisualDecisionRegisterEntry[];
  sourceVersion: number;
}

const ROLE_HINTS = /\b(propriétaire|responsable|administrateur|administratrice|directeur|directrice|gérant|gérante|chef|agent|employé|employée|collaborateur|collaboratrice|personnel|équipe|client|utilisateur|usager|membre|apprenant|élève|étudiant|enseignant|formateur|technicien|opérateur|vendeur|caissier|livreur|fournisseur|partenaire|prestataire|bénéficiaire|patient|médecin|infirmier|conducteur|exploitant|artisan|comptable|assistant|assistante)\b/i;

const AREA_META: Record<VisualArea, { title: string; description: string; action: string }> = {
  orders: { title: "Commandes", description: "Suivi des demandes, commandes et étapes associées.", action: "Créer une commande" },
  finance: { title: "Finances", description: "Suivi des règlements et informations financières retenues.", action: "Enregistrer un règlement" },
  customers: { title: "Clients et dossiers", description: "Informations et suivi des personnes ou bénéficiaires.", action: "Ajouter un dossier" },
  resources: { title: "Stocks et ressources", description: "Suivi des ressources, équipements et disponibilités.", action: "Ajouter une ressource" },
  people: { title: "Équipe", description: "Organisation des profils et des personnes qui utilisent le produit.", action: "Ajouter un membre" },
  planning: { title: "Planning", description: "Organisation des activités, échéances et responsabilités.", action: "Ajouter au planning" },
  production: { title: "Production", description: "Organisation des tâches et étapes de réalisation.", action: "Créer une tâche" },
  communication: { title: "Communication", description: "Préparation et suivi des échanges et notifications.", action: "Préparer un message" },
  reporting: { title: "Pilotage", description: "Lecture des indicateurs et suivi des résultats.", action: "Consulter le suivi" },
  operations: { title: "Opérations", description: "Suivi des activités et des actions du projet.", action: "Créer une opération" },
  records: { title: "Dossiers", description: "Consultation et organisation des informations utiles.", action: "Ajouter un dossier" },
  settings: { title: "Paramètres", description: "Réglages, accès et éléments de configuration.", action: "Configurer cet élément" },
  other: { title: "Autres fonctions", description: "Autres fonctions retenues pour ce produit.", action: "Créer un élément" },
};

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function conciseVisualLabel(value: string): string {
  const normalized = value.replace(/\r/g, "").trim();
  const firstLine = normalized.split("\n").map((line) => line.trim()).find(Boolean) ?? "";
  const withoutNumber = firstLine.replace(/^\s*(?:\d+[.)]|[-•*])\s*/, "").trim();
  const firstSentence = withoutNumber.match(/^(.+?[.!?])(?:\s|$)/u)?.[1] ?? withoutNumber;
  const label = firstSentence.replace(/[.!?;:]+$/, "").trim();
  if (label.length <= 76) return label;
  return label.slice(0, 72).replace(/\s+\S*$/, "") + "…";
}

function splitResponsibilities(lines: string[]): string[] {
  return unique(lines.flatMap((line) =>
    line
      .replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "")
      .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ])/u)
      .map((part) => part.trim())
      .filter((part) => part.length > 5 && part.length <= 150 && !/^\d+[.)]\s/.test(part)),
  )).slice(0, 8);
}

function parseRoleProfiles(value: string | string[], offset: number): VisualProfile[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => parseRoleProfiles(entry, offset + index));
  }

  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(/([.!?])\s+(?=\d{1,2}[.)]\s+[A-ZÀ-ÖØ-Þ])/gu, "$1\n");
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const sections: Array<{ name: string; lines: string[] }> = [];
  let current: { name: string; lines: string[] } | null = null;

  for (const line of lines) {
    const numbered = line.match(/^\s*\d{1,2}[.)]\s*(.+)$/u);
    const candidate = numbered?.[1]?.trim() ?? "";
    const heading = candidate && candidate.length <= 90 && ROLE_HINTS.test(candidate)
      ? candidate.split(/\s+[—–:]\s+/u)[0].trim()
      : null;

    if (heading) {
      current = { name: conciseVisualLabel(heading), lines: [] };
      sections.push(current);
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else if (!numbered && line.length <= 72 && !/[.!?]$/.test(line) && ROLE_HINTS.test(line)) {
      current = { name: conciseVisualLabel(line), lines: [] };
      sections.push(current);
    }
  }

  if (sections.length > 0) {
    return sections.map((section, index) => ({
      id: "profile-" + (offset + index + 1),
      name: section.name,
      note: "Profil déclaré dans la définition. Les autorisations détaillées restent à confirmer.",
      responsibilities: splitResponsibilities(section.lines),
    }));
  }

  const first = lines[0] ?? "";
  const fallback = conciseVisualLabel(first);
  if (fallback && fallback.length <= 72 && !/[.!?]$/.test(first) && ROLE_HINTS.test(fallback)) {
    return [{
      id: "profile-" + (offset + 1),
      name: fallback,
      note: "Profil déclaré dans la définition. Les autorisations détaillées restent à confirmer.",
      responsibilities: splitResponsibilities(lines.slice(1)),
    }];
  }
  return [];
}

function retained(component: SolutionProposalComponent): boolean {
  return component.status === "accepted" || component.status === "modified";
}

function answerValues(answer: ProductDefinitionAnswer): string[] {
  return (Array.isArray(answer.value) ? answer.value : [answer.value]).map((value) => value.trim()).filter(Boolean);
}

function detectNature(value: string): VisualProductNature | null {
  const text = value.toLocaleLowerCase("fr");
  if (/\b(site web|site internet|site vitrine|site e-commerce|website)\b/.test(text)) return "website";
  if (/\b(plateforme|portail)\b/.test(text)) return "platform";
  if (/\b(application mobile|application|\bapp\b)\b/.test(text)) return "application";
  if (/\b(autre|logiciel spécialisé|outil interne|système connecté|solution spécialisée)\b/.test(text)) return "other";
  return null;
}

function inferNature(text: string): VisualProductNature | null {
  const normalized = text.toLocaleLowerCase("fr");
  if (/\b(site web|site internet|site vitrine|site e-commerce)\b/.test(normalized)) return "website";
  if (/\b(plateforme|portail)\b/.test(normalized)) return "platform";
  if (/\b(application mobile|application|logiciel|outil numérique|app)\b/.test(normalized)) return "application";
  return null;
}

function detectDeliveryModes(values: string[]): VisualDeliveryMode[] {
  const text = values.join(" ").toLocaleLowerCase("fr");
  const modes: VisualDeliveryMode[] = [];
  if (/\b(navigateur|browser|accès web|accessible sur le web)\b/.test(text)) modes.push("browser");
  if (/\b(pwa|progressive web app|installable|installer sur l'écran d'accueil)\b/.test(text)) modes.push("pwa");
  if (/\b(application mobile|mobile natif|android|iphone|ios)\b/.test(text)) modes.push("mobile");
  if (/\b(web|site internet|site web)\b/.test(text)) modes.push("web");
  if (/\b(hybride|web et mobile|mobile et web)\b/.test(text)) modes.push("hybrid");
  return [...new Set(modes)];
}

function areaFor(component: SolutionProposalComponent, label: string): VisualArea {
  const text = (label + " " + component.description).toLocaleLowerCase("fr");
  if (/paiement|règlement|encaissement|facture|facturation|trésorerie|dépense|recette|budget|comptabilit/.test(text) || component.familyId === "finances") return "finance";
  if (/commande|réservation|vente|devis|livraison|panier|achat/.test(text)) return "orders";
  if (/client|prospect|bénéficiaire|patient|apprenant|inscription|adhésion|contact/.test(text)) return "customers";
  if (/stock|inventaire|article|matière première|équipement|ressource|approvisionnement/.test(text) || component.familyId === "integrations_equipment") return "resources";
  if (/personnel|équipe|employé|collaborateur|utilisateur|profil|rôle|accès/.test(text) || component.familyId === "users_roles") return "people";
  if (/planning|calendrier|horaire|rendez-vous|emploi du temps|échéance/.test(text)) return "planning";
  if (/production|fabrication|préparation|tâche|atelier|chantier/.test(text)) return "production";
  if (/message|communication|notification|alerte|email|e-mail|sms|whatsapp/.test(text)) return "communication";
  if (/performance|indicateur|statistique|rapport|résultat|tableau de bord|analyse/.test(text)) return "reporting";
  if (/sécurité|confidentialité|autorisation|paramètre|configuration|identité visuelle|navigation/.test(text) || ["security_control", "visual_identity", "navigation"].includes(component.familyId ?? "")) return "settings";
  if (/dossier|document|fiche|historique|registre|information|donnée/.test(text) || component.familyId === "data") return "records";
  if (component.familyId === "operations") return "operations";
  return "other";
}

function featureFields(area: VisualArea, label: string): string[] {
  const text = label.toLocaleLowerCase("fr");
  if (/présence|pointage|assiduité|retard/.test(text)) return ["Personne concernée", "Date", "Heure", "Statut"];
  if (/inscription|inscrire|adhésion/.test(text)) return ["Nom complet", "Contact", "Formation ou service", "Date"];
  if (/paiement|règlement|encaissement|facture/.test(text)) return ["Référence", "Montant", "Mode de règlement", "Date"];
  switch (area) {
    case "orders": return ["Référence", "Client ou demandeur", "Date prévue", "Statut"];
    case "finance": return ["Référence", "Montant", "Mode de règlement", "Date"];
    case "customers": return ["Nom complet", "Contact", "Besoin ou note", "Statut"];
    case "resources": return ["Ressource ou article", "Quantité ou disponibilité", "Emplacement", "État"];
    case "people": return ["Nom complet", "Fonction", "Contact", "Statut"];
    case "planning": return ["Activité", "Responsable", "Date", "État"];
    case "production": return ["Tâche ou réalisation", "Responsable", "Échéance", "Avancement"];
    case "communication": return ["Destinataire", "Canal", "Message", "Date"];
    case "reporting": return ["Période", "Indicateur", "Résultat", "Commentaire"];
    case "operations": return ["Opération", "Responsable", "Date", "État"];
    case "records": return ["Référence", "Intitulé", "Responsable", "Date"];
    case "settings": return ["Élément à configurer", "Valeur", "Portée", "État"];
    default: return ["Intitulé", "Description", "Responsable", "Date"];
  }
}

function sourceLabelFor(
  component: SolutionProposalComponent,
  definition: ProductDefinitionSession,
  dossier: ProjectUnderstanding,
): string {
  const ids = component.sourceIds ?? [];
  const answerLabels = getActiveProductDefinitionAnswers(definition)
    .filter((answer) => ids.includes(answer.id))
    .map((answer) => "Réponse écran 05 : " + answer.question.prompt);
  const evidenceLabels = dossier.items
    .filter((item) => ids.includes(item.id))
    .map((item) => "Élément du dossier : " + (item.sourceQuote || item.value).slice(0, 150));
  const labels = unique([...answerLabels, ...evidenceLabels]);
  if (labels.length) return labels.join(" · ");
  if (component.source === "knowledge_suggestion") return "Suggestion du référentiel, retenue explicitement à l'écran 06.";
  return "Composant retenu et validé dans la composition de l'écran 06.";
}

function decision(
  id: string,
  elementType: VisualDecisionRegisterEntry["elementType"],
  elementLabel: string,
  sourceKind: VisualDecisionRegisterEntry["sourceKind"],
  sourceIds: string[],
  sourceLabel: string,
  rationale: string,
): VisualDecisionRegisterEntry {
  return { id, elementType, elementLabel, sourceKind, sourceIds: unique(sourceIds), sourceLabel, rationale };
}

export function buildVisualBlueprint(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
  proposal: SolutionProposal,
): VisualBlueprint {
  if (definition.understandingId !== dossier.id || proposal.projectId !== dossier.projectId) {
    throw new Error("Les éléments des étapes précédentes ne correspondent pas au même projet.");
  }

  const answers = getActiveProductDefinitionAnswers(definition);
  const natureAnswers = answers.filter((answer) => answer.status === "answered" && answer.familyId === "nature");
  const explicitNatureValues = unique(natureAnswers.flatMap(answerValues));
  const explicitNatures = [...new Set(explicitNatureValues.map(detectNature).filter((value): value is VisualProductNature => value !== null))];
  const inferredNature = inferNature([dossier.originalDescription, ...dossier.items.map((item) => item.value)].join(" "));
  const productNature: VisualProductNature = explicitNatures.length === 1
    ? explicitNatures[0]
    : explicitNatures.length > 1
      ? "undecided"
      : inferredNature ?? "undecided";
  const productNatureStatus: VisualProductNatureStatus = explicitNatures.length > 1
    ? "conflicting"
    : explicitNatures.length === 1
      ? "confirmed"
      : inferredNature
        ? "suggested"
        : "undetermined";

  const deliveryAnswers = answers.filter((answer) => answer.status === "answered");
  const deliveryValues = deliveryAnswers.flatMap(answerValues);
  const deliveryModes = detectDeliveryModes(deliveryValues);
  const deliveryModeStatus = deliveryModes.length > 0 ? "confirmed" as const : "not_selected" as const;

  const sourceText = [
    dossier.originalDescription,
    ...dossier.items.map((item) => item.value),
    ...answers.filter((answer) => answer.status === "answered").flatMap(answerValues),
    ...proposal.architectures.flatMap((architecture) => [architecture.title, architecture.description]),
  ].join(" ").toLocaleLowerCase("fr");
  const kind = ["website", "platform", "application"].includes(productNature)
    ? "digital" as const
    : productNature === "other"
      ? (/application|plateforme|logiciel|site web|portail|numérique|mobile|interface|outil interne|système connecté/.test(sourceText) ? "digital" as const : "operational" as const)
      : (/application|plateforme|logiciel|site web|portail|numérique|mobile|interface/.test(sourceText) ? "digital" as const : "operational" as const);

  const roleAnswers = answers.filter((answer) => answer.status === "answered" && answer.familyId === "users_roles");
  const profiles = roleAnswers.flatMap((answer, index) => parseRoleProfiles(answer.value, index * 20));
  const uniqueProfiles = profiles.filter((profile, index, all) =>
    all.findIndex((candidate) => candidate.name.toLocaleLowerCase("fr") === profile.name.toLocaleLowerCase("fr")) === index,
  );
  if (uniqueProfiles.length === 0) {
    uniqueProfiles.push({
      id: "profile-to-define",
      name: "Vue générale",
      note: "Aucun profil d'utilisation n'a encore été confirmé.",
      responsibilities: [],
    });
  }

  const retainedComponents = proposal.components.filter(retained);
  const pendingItems = proposal.components
    .filter((component) => component.status === "suggested")
    .map((component) => conciseVisualLabel(component.title))
    .filter(Boolean);

  const grouped = new Map<VisualArea, VisualFeature[]>();
  const decisionRegister: VisualDecisionRegisterEntry[] = [];
  retainedComponents.forEach((component) => {
    const label = conciseVisualLabel(component.title);
    if (!label) return;
    const area = areaFor(component, label);
    const sourceIds = unique([component.id, ...(component.sourceIds ?? [])]);
    const sourceLabel = sourceLabelFor(component, definition, dossier);
    const feature: VisualFeature = {
      id: "feature-" + component.id,
      componentId: component.id,
      label,
      description: conciseVisualLabel(component.description) || "Fonction retenue dans la composition du projet.",
      area,
      fields: featureFields(area, label),
      actionLabel: AREA_META[area].action,
      blockType: area === "reporting" ? "metrics" : area === "settings" ? "settings" : area === "records" ? "table" : "form",
      sourceIds,
      sourceLabel,
    };
    grouped.set(area, [...(grouped.get(area) ?? []), feature]);
    decisionRegister.push(decision(
      "decision-" + feature.id,
      "feature",
      label,
      component.source === "knowledge_suggestion" ? "knowledge_suggestion" : "accepted_component",
      sourceIds,
      sourceLabel,
      "Cette fonction apparaît parce qu'elle a été retenue ou modifiée dans la composition validée à l'écran 06.",
    ));
    decisionRegister.push(decision(
      "decision-action-" + feature.id,
      "action",
      feature.actionLabel + " — " + label,
      "accepted_component",
      sourceIds,
      sourceLabel,
      "L'action est une proposition d'interaction associée à la fonction retenue ; son comportement métier détaillé reste à confirmer.",
    ));
    feature.fields.forEach((field) => decisionRegister.push(decision(
      "decision-field-" + feature.id + "-" + field.toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-"),
      "field",
      field,
      "accepted_component",
      sourceIds,
      sourceLabel,
      "Champ illustratif proposé pour représenter la fonction ; les règles de saisie et les données exactes restent à valider.",
    )));
  });

  const screens: VisualScreen[] = [...grouped.entries()].map(([area, features], index) => {
    const meta = AREA_META[area];
    const first = features[0];
    const sourceIds = unique(features.flatMap((feature) => feature.sourceIds));
    return {
      id: "screen-" + (index + 1),
      title: meta.title,
      navLabel: meta.title,
      description: meta.description,
      items: features.map((feature) => feature.label),
      previewFields: first?.fields ?? [],
      primaryActionLabel: first?.actionLabel ?? meta.action,
      features,
      sourceIds,
    };
  });

  if (kind === "digital" && screens.length === 0) {
    screens.push({
      id: "screen-overview",
      title: "Vue d'ensemble",
      navLabel: "Vue d'ensemble",
      description: "La structure attend les premières fonctions retenues dans la composition.",
      items: [],
      previewFields: [],
      primaryActionLabel: "Aucune action à simuler",
      features: [],
      sourceIds: [],
    });
  }

  if (retainedComponents.length > 0) {
    const sourceIds = unique(retainedComponents.map((component) => component.id));
    decisionRegister.unshift(decision(
      "decision-dashboard",
      "dashboard",
      "Tableau de bord",
      "derived_structure",
      sourceIds,
      "Synthèse construite à partir des éléments retenus à l'écran 06.",
      "La vue d'ensemble est une structure de présentation proposée par MerKora ; elle ne constitue pas une nouvelle fonction métier.",
    ));
  }

  screens.forEach((screen) => decisionRegister.push(decision(
    "decision-" + screen.id,
    "screen",
    "Écran " + screen.title,
    "derived_structure",
    screen.sourceIds,
    screen.features.map((feature) => feature.sourceLabel).join(" · "),
    "Cet écran regroupe les fonctions retenues de même finalité pour rendre la navigation lisible.",
  )));

  const flow = retainedComponents
    .map((component) => conciseVisualLabel(component.title))
    .filter(Boolean);
  return {
    projectTitle: proposal.title,
    kind,
    summary: proposal.description,
    productNature,
    productNatureStatus,
    deliveryModes,
    deliveryModeStatus,
    profiles: uniqueProfiles,
    screens,
    flow: flow.length ? flow : ["Préciser les étapes de l'activité", "Retenir les éléments utiles", "Compléter la représentation"],
    pendingItems: unique(pendingItems),
    unresolvedPoints: unique([...proposal.unresolvedPoints, ...proposal.coherenceNotes]),
    decisionRegister,
    sourceVersion: proposal.version,
  };
}
