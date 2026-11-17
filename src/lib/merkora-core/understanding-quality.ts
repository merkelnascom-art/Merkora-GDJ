import type { ProjectUnderstandingItem } from "./project-diagnostic";

export interface Screen03DuplicateGroup {
  key: string;
  retainedItemId: string;
  sourceItemIds: string[];
}

export interface Screen03EvidenceView {
  /** Unique, project-relevant statements for the screen; source records remain untouched. */
  projectItems: ProjectUnderstandingItem[];
  /** Conversational reactions are retained for traceability, but are not project facts. */
  conversationOnly: ProjectUnderstandingItem[];
  /** Explicit "not applicable" answers are neither unknown nor project facts. */
  notApplicable: ProjectUnderstandingItem[];
  /** Explicitly unknown answers remain visible without filling a project dimension. */
  unknown: ProjectUnderstandingItem[];
  duplicates: Screen03DuplicateGroup[];
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function classifyDimension(item: ProjectUnderstandingItem): ProjectUnderstandingItem["dimension"] {
  const text = normalizeText(item.value);

  if (/\b(j ai deja dit|je l ai deja dit|j ai deja repondu|je viens de le dire|c est deja dit)\b/.test(text)) {
    return "interaction";
  }
  if (/\b(non applicable|pas applicable|ne s applique pas|sans objet)\b/.test(text)) {
    return "not_applicable";
  }
  if (/tournoi.{0,30}(baby foot|babyfoot)|baby foot.{0,30}tournoi/.test(text)) {
    return "activity";
  }
  if (/interface.{0,50}(organigramme|arbre|schema)|organigramme.{0,50}interface/.test(text)) {
    return "imagined_solution";
  }
  if (/\b(detendre|rassembler|divertir|amuser|creer du lien|passer un bon moment)\b/.test(text)) {
    return "motivation";
  }
  if (/\b(je declare|je designe).{0,80}(gagn|perd)|gagn.{0,60}perd.{0,60}elimin/.test(text)) {
    return "operations";
  }
  if (/\b(acces|accessible).{0,60}(sans connexion|sans compte)|sans connexion.{0,60}(tout le monde|interface)/.test(text)) {
    return "constraints";
  }
  if (/\b(joueurs|participants|personnes concernees)\b/.test(text) && /\b(9|neuf|joueurs|participants)\b/.test(text)) {
    return "actors";
  }
  if (/\b(paye|payer|paiement|participation).{0,40}(fcfa|f|franc|1000|mille)/.test(text)) {
    return "constraints";
  }
  if (/\b(baby foot|tee shirt|materiel|recompense)\b/.test(text)) {
    return "resources";
  }
  return item.dimension;
}

export function isConversationOnlyStatement(value: string): boolean {
  const text = normalizeText(value);
  return /^(?:mais )?(?:j ai deja dit ca|je l ai deja dit|j ai deja repondu|je viens de le dire|je l ai deja explique|je l ai deja precise|c est deja dit|c est deja explique|c est deja precise)(?: non)?$/.test(text);
}

function isNotApplicable(value: string): boolean {
  const text = normalizeText(value);
  return /\b(non applicable|pas applicable|ne s applique pas|sans objet)\b/.test(text);
}

export function deriveScreen03Evidence(items: ProjectUnderstandingItem[]): Screen03EvidenceView {
  const conversationOnly: ProjectUnderstandingItem[] = [];
  const notApplicable: ProjectUnderstandingItem[] = [];
  const unknown: ProjectUnderstandingItem[] = [];
  const unique = new Map<string, ProjectUnderstandingItem>();
  const duplicateSources = new Map<string, string[]>();

  for (const original of items) {
    const classified = { ...original, dimension: classifyDimension(original) };
    if (original.status === "conversation_only" || isConversationOnlyStatement(original.value)) {
      conversationOnly.push(classified);
      continue;
    }
    if (original.status === "not_applicable" || isNotApplicable(original.value)) {
      notApplicable.push(classified);
      continue;
    }
    if (original.status === "unknown" || /^je ne sais pas encore$/i.test(original.value.trim())) {
      unknown.push(classified);
      continue;
    }

    // Prefer the exact user wording; a repeated sentence is shown once even if
    // intake heuristics attached it to several dimensions.
    const key = `${original.sourceMessageId ?? original.sourceReferenceId ?? "no-source"}::${normalizeText(original.sourceQuote || original.value)}`;
    const existing = unique.get(key);
    if (existing) {
      duplicateSources.set(key, [...(duplicateSources.get(key) ?? [existing.id]), original.id]);
      continue;
    }
    unique.set(key, classified);
  }

  return {
    projectItems: [...unique.values()],
    conversationOnly,
    notApplicable,
    unknown,
    duplicates: [...duplicateSources.entries()].map(([key, sourceItemIds]) => ({
      key,
      retainedItemId: sourceItemIds[0],
      sourceItemIds,
    })),
  };
}
