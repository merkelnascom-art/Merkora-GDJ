import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal, SolutionProposalComponent } from "./solution-proposal";

export interface VisualProfile {
  id: string;
  name: string;
  note: string;
}

export interface VisualScreen {
  id: string;
  title: string;
  description: string;
  items: string[];
  previewFields: string[];
  primaryActionLabel: string;
}

export interface VisualBlueprint {
  projectTitle: string;
  kind: "digital" | "operational";
  summary: string;
  profiles: VisualProfile[];
  screens: VisualScreen[];
  flow: string[];
  pendingItems: string[];
  unresolvedPoints: string[];
  sourceVersion: number;
}

const FAMILY_TITLES: Record<string, string> = {
  nature: "Vue d'ensemble",
  users_roles: "Profils et accès",
  spaces: "Espaces de travail",
  navigation: "Navigation",
  functionalities: "Fonctionnalités",
  interactions: "Actions et interactions",
  data: "Informations et dossiers",
  integrations_equipment: "Outils et équipements",
  security_control: "Sécurité et contrôle",
  finances: "Gestion financière",
  visual_identity: "Identité visuelle",
  operations: "Organisation et suivi",
};

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function retained(component: SolutionProposalComponent): boolean {
  return component.status === "accepted" || component.status === "modified";
}

function demonstrationLayout(components: SolutionProposalComponent[]): Pick<VisualScreen, "previewFields" | "primaryActionLabel"> {
  const text = components.map((component) => component.title).join(" ").toLocaleLowerCase("fr");

  if (/paiement|encaissement|transaction|règlement/.test(text)) {
    return {
      previewFields: ["Référence", "Montant", "Mode de paiement", "Date"],
      primaryActionLabel: "Enregistrer une opération",
    };
  }
  if (/présence|présences|pointage|assiduité|retard/.test(text)) {
    return {
      previewFields: ["Personne concernée", "Date", "Heure", "Statut"],
      primaryActionLabel: "Enregistrer une présence",
    };
  }
  if (/inscription|inscrire|apprenant|élève|étudiant|adhésion/.test(text)) {
    return {
      previewFields: ["Nom complet", "Contact", "Formation ou service", "Date"],
      primaryActionLabel: "Ajouter un dossier",
    };
  }
  if (/stock|inventaire|article|produit|équipement/.test(text)) {
    return {
      previewFields: ["Article ou ressource", "Quantité", "Emplacement", "État"],
      primaryActionLabel: "Ajouter une ressource",
    };
  }
  if (/commande|réservation|rendez-vous|livraison/.test(text)) {
    return {
      previewFields: ["Référence", "Personne concernée", "Date prévue", "Statut"],
      primaryActionLabel: "Créer un suivi",
    };
  }
  return {
    previewFields: ["Intitulé ou référence", "Description", "Responsable", "Date"],
    primaryActionLabel: "Ajouter un élément",
  };
}

export function buildVisualBlueprint(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
  proposal: SolutionProposal,
): VisualBlueprint {
  if (definition.understandingId !== dossier.id || proposal.projectId !== dossier.projectId) {
    throw new Error("Les éléments des étapes précédentes ne correspondent pas au même projet.");
  }

  const sourceText = [
    dossier.originalDescription,
    ...dossier.items.map((item) => item.value),
    ...definition.answers.flatMap((answer) => Array.isArray(answer.value) ? answer.value : [answer.value]),
    ...proposal.architectures.flatMap((architecture) => [architecture.title, architecture.description]),
  ].join(" ").toLocaleLowerCase("fr");
  const kind = /application|plateforme|logiciel|site web|portail|numérique|mobile|interface|espace en ligne/.test(sourceText)
    ? "digital" as const
    : "operational" as const;

  const roles = definition.answers
    .filter((answer) => answer.status === "answered" && answer.familyId === "users_roles")
    .flatMap((answer) => Array.isArray(answer.value) ? answer.value : [answer.value]);
  const profiles = unique(roles).map((name, index) => ({
    id: `profile-${index + 1}`,
    name,
    note: "Profil mentionné dans la définition du projet ; ses droits détaillés restent à confirmer.",
  }));
  if (profiles.length === 0) {
    profiles.push({ id: "profile-to-define", name: "Vue générale", note: "Aucun profil d'utilisation n'a encore été confirmé." });
  }

  const retainedComponents = proposal.components.filter(retained);
  const pendingItems = proposal.components
    .filter((component) => component.status === "suggested")
    .map((component) => component.title);

  const grouped = new Map<string, SolutionProposalComponent[]>();
  retainedComponents.forEach((component) => {
    const family = component.familyId ?? "nature";
    grouped.set(family, [...(grouped.get(family) ?? []), component]);
  });

  const screens = [...grouped.entries()].map(([family, components], index) => ({
    id: `screen-${index + 1}`,
    title: FAMILY_TITLES[family] ?? "Espace du produit",
    description: "Aperçu construit uniquement à partir des éléments retenus à l'étape 06.",
    items: components.map((component) => component.title),
    ...demonstrationLayout(components),
  }));

  if (kind === "digital" && screens.length === 0) {
    screens.push({
      id: "screen-overview",
      title: "Vue d'ensemble",
      description: "Structure visuelle en attente de fonctions validées.",
      items: ["Aucune fonction n'a encore été retenue."],
      previewFields: [],
      primaryActionLabel: "Aucune action à simuler",
    });
  }

  const flow = retainedComponents.length
    ? retainedComponents.map((component) => component.title)
    : ["Préciser les étapes de l'activité", "Retenir les éléments utiles", "Compléter la représentation"];
  return {
    projectTitle: proposal.title,
    kind,
    summary: proposal.description,
    profiles,
    screens,
    flow,
    pendingItems,
    unresolvedPoints: unique([...proposal.unresolvedPoints, ...proposal.coherenceNotes]),
    sourceVersion: proposal.version,
  };
}
