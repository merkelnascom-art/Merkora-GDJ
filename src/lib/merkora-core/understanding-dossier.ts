import type { ConversationMessage, NeedDimension } from "./types";

export interface UnderstandingFacet {
  dimension: NeedDimension;
  title: string;
  content: string;
  status: "user_stated";
  sourceMessageIds: string[];
  sourceQuotes: string[];
}

export interface UnderstandingDossier {
  title: string | null;
  rawVisitorMessages: string[];
  facets: UnderstandingFacet[];
  missingDimensions: NeedDimension[];
  openQuestions: string[];
  repairRequested: boolean;
}

const REPAIR = /tu ne me suis pas|tu ne me comprends pas|tu n'as pas compris|tu n'as pas encore compris|tu ne comprends pas|tu m'écoutes pas|tu ne m'écoutes pas|tu es à côté|tu pars à côté|ce n'est pas ce que je veux dire|avec tout ce que j'ai dit.{0,50}(?:pas compris|ne comprends)/i;
const PROBLEM = /probl[eè]me|difficult[ée]|stress|frustr|se perdent|ne savent pas|au hasard|désorganis|retard|perte de temps|n'arriv\\w* pas|ne parviennent pas|bloqu/i;
const AUDIENCE = /élèves?|étudiants?|apprenants?|jeunes|clients?|patients?|joueurs?|danseurs?|invités?|employés?|personnel|enseignants?|famille|utilisateurs?/i;
const SOLUTION = /application|plateforme|site web|logiciel|outil numérique|outil digital|service de réservation|jeu interactif|système|système|interface|agent|agence|quiz|consultation/i;
const GOAL = /je veux|je souhaite|j'aimerais|mon objectif|permet(?:tre)?|afin de|pour que|propose(?:r)?|aider à|accompagner/i;
const FEATURE = /choisit|sélectionne|indique|renseigne|joint|téléverse|analyse|évalue|calcule|compare|synchronise|propose|réserve|confirme|reçoit|répond|crée|partage|consulte|joue|tape|défile|disparaît|réapparaît|test(?:s|er)?|questionnaire|devinette|classement|résultat/i;
const CONSTRAINT = /sans connexion|sans compte|sans se connecter|hors ligne|offline|uniquement|seulement|obligatoire|facultatif|gratuit|budget|fcfa|délai|téléphone|ordinateur/i;

function visitorMessages(messages: ConversationMessage[]) {
  return messages.filter((item) => item.role === "visitor" && item.content.trim());
}

function splitSentences(content: string): string[] {
  return content.split(/(?<=[.!?])\s+|\n+/).map((item) => item.trim()).filter(Boolean);
}

function addFacet(
  facets: Map<string, UnderstandingFacet>,
  dimension: NeedDimension,
  title: string,
  quote: string,
  messageId: string,
): void {
  const content = quote.trim();
  if (!content) return;
  const key = dimension + "::" + content.toLocaleLowerCase("fr");
  const existing = facets.get(key);
  if (existing) {
    if (!existing.sourceMessageIds.includes(messageId)) existing.sourceMessageIds.push(messageId);
    return;
  }
  facets.set(key, {
    dimension, title, content, status: "user_stated",
    sourceMessageIds: [messageId], sourceQuotes: [content],
  });
}

/**
 * Builds one cumulative, source-backed dossier from every visitor message.
 * It deliberately preserves complete sentences and never uses assistant text
 * as evidence or upgrades an interpretation to a confirmed fact.
 */
export function buildUnderstandingDossier(messages: ConversationMessage[]): UnderstandingDossier {
  const visitors = visitorMessages(messages);
  const facets = new Map<string, UnderstandingFacet>();
  const allText = visitors.map((item) => item.content).join("\n");
  const repairRequested = visitors.some((item) => REPAIR.test(item.content));
  const titleMatch = allText.match(/(?:ça s'appelle|cela s'appelle|le projet s'appelle|nommé|nommée|nom du projet\s*[:：])\s*[«"']?([^.!?\n»"']{2,70})/i) ||
    allText.match(/^\s*([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÿ0-9 -]{2,35})\s*:/);
  const title = titleMatch?.[1]?.trim() ?? null;

  for (const visitor of visitors) {
    const sentences = splitSentences(visitor.content);
    for (const sentence of sentences) {
      if (REPAIR.test(sentence)) continue;
      if (PROBLEM.test(sentence)) addFacet(facets, "problem", "Problème ou difficulté", sentence, visitor.id);
      if (AUDIENCE.test(sentence)) addFacet(facets, "audience", "Public concerné", sentence, visitor.id);
      if (SOLUTION.test(sentence)) addFacet(facets, "preference", "Solution ou idée envisagée", sentence, visitor.id);
      if (GOAL.test(sentence)) addFacet(facets, "goal", "Objectif ou résultat recherché", sentence, visitor.id);
      if (FEATURE.test(sentence)) addFacet(facets, "feature", "Fonctionnement ou actions imaginées", sentence, visitor.id);
      if (CONSTRAINT.test(sentence)) addFacet(facets, "constraint", "Contraintes et conditions", sentence, visitor.id);
      if (/parce que|car |à cause de|puisque|en raison de/i.test(sentence)) {
        addFacet(facets, "cause", "Cause évoquée", sentence, visitor.id);
      }
      if (/bac|relevé|notes scolaires|données personnelles|informations personnelles|dossier médical|santé|mineur/i.test(sentence)) {
        addFacet(facets, "risk", "Données ou précautions à examiner", sentence, visitor.id);
      }
      if (/dans une école|au lycée|à l'université|en entreprise|dans mon agence|à domicile|sur téléphone|sur mobile|en ligne/i.test(sentence)) {
        addFacet(facets, "context", "Cadre ou environnement", sentence, visitor.id);
      }
    }
  }

  const dimensions = new Set([...facets.values()].map((item) => item.dimension));
  const privacyAnswerPresent = /informé|informés|accord|consent|seul(?:e)?s? l['’]?(?:élève|eleve)|uniquement|accès|acces|consulter|consultation|confidentiel|parent|conseiller/i.test(allText);
  const sensitiveDataMentioned = /relevé|releve|notes scolaires|bulletin|dossier médical|dossier medical|données personnelles|donnees personnelles|résultats scolaires|resultats scolaires/i.test(allText);
  const missingDimensions: NeedDimension[] = [];
  if (!dimensions.has("problem")) missingDimensions.push("problem");
  if (!dimensions.has("audience")) missingDimensions.push("audience");
  if (!dimensions.has("goal")) missingDimensions.push("goal");
  if (!dimensions.has("preference")) missingDimensions.push("preference");
  if (sensitiveDataMentioned && !privacyAnswerPresent) missingDimensions.push("risk");

  const prompts: Partial<Record<NeedDimension, string>> = {
    problem: "Quelle difficulté ou quel besoin concret ce projet doit-il traiter ?",
    audience: "Qui utilisera ce projet ou en bénéficiera principalement ?",
    goal: "Quel résultat concret souhaites-tu obtenir ?",
    preference: "Quelle solution ou expérience imagines-tu ?",
    context: "Dans quel environnement le projet sera-t-il utilisé ?",
    constraint: "Y a-t-il une limite importante à respecter dès le départ ?",
    risk: "Qui pourra consulter les relevés et les résultats des élèves ?",
  };
  const openQuestions = missingDimensions.map((dimension) => prompts[dimension]).filter((item): item is string => Boolean(item));

  return {
    title,
    rawVisitorMessages: visitors.map((item) => item.content),
    facets: [...facets.values()],
    missingDimensions,
    openQuestions,
    repairRequested,
  };
}
