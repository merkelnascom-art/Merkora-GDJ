export interface UniversalProjectUnderstanding {
  /** Original user wording. Never overwrite this with a paraphrase. */
  rawIntent: string;
  /** Lexically detected need clusters; these are clues, not validated project categories. */
  intentGroups: string[];
  /** Explicitly described current process, when a known phrase is detected. */
  currentSituation: string | null;
  /** Clauses that appear to describe desired outcomes. */
  desiredOutcomes: string[];
  /** People or groups explicitly mentioned by known lexical patterns. */
  actors: string[];
  /** Explicitly mentioned practical constraints. */
  constraints: string[];
  /** Flags indicating that other people's information may be involved. */
  privacyConsiderations: string[];
}

const INTENT_LEXICONS: Array<{ id: string; pattern: RegExp }> = [
  { id: "finance_and_contributions", pattern: /revenu|dépense|depense|contribution|budget|paiement|recette|caisse|facture/i },
  { id: "visits_and_attendance", pattern: /visite|visiteur|présence|presence|arrivée|arrivee|départ|depart|heure de passage/i },
  { id: "sales_and_commerce", pattern: /vente|client|commande|stock|produit|livraison|commerce/i },
  { id: "education_and_training", pattern: /élève|eleve|étudiant|etudiant|formation|cours|enseignant|apprenant/i },
  { id: "staff_and_operations", pattern: /employé|employe|personnel|salarié|salarie|horaire|retard|planning|équipe|equipe/i },
  { id: "documents_and_records", pattern: /document|dossier|archive|registre|cahier|formulaire|justificatif/i },
  { id: "communication_and_follow_up", pattern: /message|notification|rappel|discussion|suivi|rapport|résumé|resume/i },
];

const CURRENT_PROCESS = /(?:aujourd'hui|actuellement|pour le moment|en ce moment)[^.!?\n]*(?:je|on|nous|ils|elles|utilise|note|gère|gere|fait|suiv|enregistr)[^.!?\n]*|(?:je note|on note|nous notons|je gère|je gere|on gère|on gere|nous gérons|nous gerons|j'utilise|nous utilisons)[^.!?\n]*/i;
const OUTCOME = /(?:je veux|je voudrais|j'aimerais|mon objectif est|mon souhait est|afin de|pour pouvoir)[^.!?\n]*/gi;
const ACTOR_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "famille", pattern: /famille|foyer|maison/i },
  { label: "amis", pattern: /amis|amies|proches/i },
  { label: "clients", pattern: /clients|clientèle|clientele/i },
  { label: "personnel", pattern: /employés|employes|personnel|salariés|salaries|collaborateurs/i },
  { label: "apprenants", pattern: /élèves|eleves|étudiants|etudiants|apprenants|stagiaires/i },
  { label: "visiteurs", pattern: /visiteurs|visites|invités|invites/i },
];
const CONSTRAINT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "budget", pattern: /budget|fcfa|francs?|coût|cout|prix/i },
  { label: "connectivity", pattern: /internet|connexion|hors ligne|offline/i },
  { label: "devices", pattern: /téléphone|telephone|ordinateur|tablette|appareil/i },
  { label: "time", pattern: /délai|delai|urgent|temps disponible|date limite/i },
];

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

/**
 * Transparent lexical baseline only.
 * It does not infer root causes, validate facts, assign confidence or understand
 * arbitrary language. Its output is a set of clues to guide a follow-up question.
 */
export function analyzeUniversalProjectIntent(rawIntent: string): UniversalProjectUnderstanding {
  const text = rawIntent.trim();
  const intentGroups = INTENT_LEXICONS
    .filter((entry) => entry.pattern.test(text))
    .map((entry) => entry.id);

  const currentMatch = text.match(CURRENT_PROCESS);
  const desiredOutcomes = text.match(OUTCOME) ?? [];
  const actors = ACTOR_PATTERNS
    .filter((entry) => entry.pattern.test(text))
    .map((entry) => entry.label);
  const constraints = CONSTRAINT_PATTERNS
    .filter((entry) => entry.pattern.test(text))
    .map((entry) => entry.label);

  const privacyConsiderations = actors.length > 0
    ? ["third_party_information_may_be_involved"]
    : [];

  return {
    rawIntent,
    intentGroups: unique(intentGroups),
    currentSituation: currentMatch?.[0]?.trim() ?? null,
    desiredOutcomes: unique(desiredOutcomes.map((value) => value.trim())),
    actors: unique(actors),
    constraints: unique(constraints),
    privacyConsiderations,
  };
}
