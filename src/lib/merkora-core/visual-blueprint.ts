import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal, SolutionProposalComponent } from "./solution-proposal";

export interface VisualProfile {
  id: string;
  name: string;
  note: string;
  responsibilities: string[];
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

const ROLE_HINTS = /\b(propriétaire|responsable|administrateur|administratrice|directeur|directrice|gérant|gérante|chef|agent|employé|employée|collaborateur|collaboratrice|personnel|équipe|client|utilisateur|usager|membre|apprenant|élève|étudiant|enseignant|formateur|technicien|opérateur|vendeur|caissier|livreur|fournisseur|partenaire|prestataire|bénéficiaire|patient|médecin|infirmier|conducteur|exploitant|artisan|comptable|assistant|assistante)\b/i;

function conciseVisualLabel(value: string): string {
  const firstLine = value.replace(/\r/g, "").split("\n").map((line) => line.trim()).find(Boolean) ?? value.trim();
  const withoutNumber = firstLine.replace(/^\s*\d+[.)]\s*/, "").trim();
  const firstSentence = withoutNumber.match(/^(.+?[.!?])(?:\s|$)/u)?.[1] ?? withoutNumber;
  const label = firstSentence.replace(/[.!?;:]+$/, "").trim();
  if (label.length <= 84) return label;
  return label.slice(0, 80).replace(/\s+\S*$/, "") + "…";
}

function splitResponsibilities(lines: string[]): string[] {
  return unique(lines.flatMap((line) =>
    line
      .replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "")
      .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ])/u)
      .map((part) => part.trim())
      .filter((part) => part.length > 5 && part.length <= 150 && !/^\d+[.)]\s/.test(part)),
  )).slice(0, 6);
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
      note: "Profil mentionné dans la définition ; les autorisations restent à confirmer.",
      responsibilities: splitResponsibilities(section.lines),
    }));
  }

  const fallback = conciseVisualLabel(lines[0] ?? "");
  if (fallback && fallback.length <= 72 && !/[.!?]$/.test(lines[0] ?? "")) {
    return [{
      id: "profile-" + (offset + 1),
      name: fallback,
      note: "Profil mentionné dans la définition ; les autorisations restent à confirmer.",
      responsibilities: splitResponsibilities(lines.slice(1)),
    }];
  }

  return [];
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

  const roleAnswers = definition.answers
    .filter((answer) => answer.status === "answered" && answer.familyId === "users_roles");
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
    .map((component) => conciseVisualLabel(component.title));

  const grouped = new Map<string, SolutionProposalComponent[]>();
  retainedComponents.forEach((component) => {
    const family = component.familyId ?? "nature";
    grouped.set(family, [...(grouped.get(family) ?? []), component]);
  });

  const screens = [...grouped.entries()].map(([family, components], index) => ({
    id: `screen-${index + 1}`,
    title: FAMILY_TITLES[family] ?? "Espace du produit",
    description: "Aperçu construit uniquement à partir des éléments retenus à l'étape 06.",
    items: components.map((component) => conciseVisualLabel(component.title)),
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
    ? retainedComponents.map((component) => conciseVisualLabel(component.title))
    : ["Préciser les étapes de l'activité", "Retenir les éléments utiles", "Compléter la représentation"];
  return {
    projectTitle: proposal.title,
    kind,
    summary: proposal.description,
    profiles: uniqueProfiles,
    screens,
    flow,
    pendingItems,
    unresolvedPoints: unique([...proposal.unresolvedPoints, ...proposal.coherenceNotes]),
    sourceVersion: proposal.version,
  };
}
