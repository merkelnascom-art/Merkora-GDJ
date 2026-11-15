import type { ConversationMessage } from "./types";
import type {
  SituationEntityKind,
  SituationEvidence,
  SituationObservationBatch,
} from "./situation-graph";

interface VisitorSentence {
  messageId: string;
  content: string;
}

interface EntityMatch {
  key: string;
  kind: SituationEntityKind;
  label: string;
  role?: string;
  source: SituationEvidence;
}

const AUDIENCE_PATTERNS = [
  { pattern: /\b(?:les|des|mes|aux)\s+jeunes\b/i, key: "audience:young-people", label: "Jeunes" },
  { pattern: /\b(?:les|des|mes|aux)\s+étudiants?\b/i, key: "audience:students", label: "Étudiants" },
  { pattern: /\b(?:les|des|mes|aux)\s+élèves?\b/i, key: "audience:pupils", label: "Élèves" },
  { pattern: /\b(?:les|des|mes|aux)\s+apprenants?\b/i, key: "audience:learners", label: "Apprenants" },
  { pattern: /\b(?:les|des|mes|aux)\s+clients?\b/i, key: "audience:customers", label: "Clients" },
  { pattern: /\b(?:les|des|mes|aux)\s+employés?\b/i, key: "actor:employees", label: "Employés", role: "staff" },
  { pattern: /\b(?:les|des|mes|aux)\s+invités?\b/i, key: "audience:guests", label: "Invités" },
  { pattern: /\b(?:les|des|mes|aux)\s+joueurs?\b/i, key: "audience:players", label: "Joueurs" },
  { pattern: /\b(?:les|des|mes|aux)\s+adultes?\b/i, key: "audience:adults", label: "Adultes" },
];

const CREATION_PATTERN = /\b(?:créer|creer|développer|developper|concevoir|imaginer|lancer|mettre en place)\s+(?:un|une|des|l'|le|la)?\s*([^.!?;,]+)/i;
const PURPOSE_PATTERN = /\b(?:pour|afin de|dans le but de)\s+((?:me|se|leur)\s+)?([a-zàâçéèêëîïôûùüÿñæœ-]+(?:\s+[^.!?;,]+)?)/i;
const DIRECT_GOAL_PATTERN = /\b(?:je veux|j'aimerais|je souhaite|mon objectif est de|je cherche à)\s+((?:suivre|gérer|gerer|améliorer|ameliorer|réduire|reduire|mesurer|comprendre|apprendre|automatiser|contrôler|controler|organiser|accompagner|former|vendre)\b[^.!?;,]*)/i;
const PROBLEM_PATTERN = /\b(?:stress\w*|frustr\w*|angoiss\w*|désorganis\w*|desorganis\w*|retard\w*|perte de temps|difficult[ée]s?|probl[eè]mes?)\b[^.!?;,]*/i;

function visitorSentences(messages: ConversationMessage[]): VisitorSentence[] {
  return messages
    .filter((message) => message.role === "visitor" && message.content.trim())
    .flatMap((message) =>
      message.content
        .split(/(?<=[.!?])\s+|\n+/)
        .map((content) => content.trim())
        .filter(Boolean)
        .map((content) => ({ messageId: message.id, content })),
    );
}

function evidenceFor(sentence: VisitorSentence): SituationEvidence {
  return {
    messageId: sentence.messageId,
    quote: sentence.content,
    role: "visitor",
    status: "user_stated",
  };
}

function cleanLabel(value: string): string {
  return value
    .replace(/^(?:un|une|des|le|la|les|l')\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (first) => first.toLocaleUpperCase("fr"));
}

function isInfinitive(value: string): boolean {
  const firstWord = value.trim().split(/\s+/)[0]?.toLocaleLowerCase("fr") ?? "";
  return /(?:er|ir|re|oir)$/.test(firstWord) ||
    ["être", "avoir", "faire", "aller"].includes(firstWord);
}

function makeEntity(
  key: string,
  kind: SituationEntityKind,
  label: string,
  source: SituationEvidence,
  role?: string,
): EntityMatch {
  return { key, kind, label, source, ...(role ? { role } : {}) };
}

/**
 * Extracts a deliberately small set of high-confidence French observations.
 * Unknown wording remains unmodeled; this is a first lexical adapter, not a
 * general semantic parser or a claim of universal natural-language understanding.
 */
export function extractSituationObservations(
  messages: ConversationMessage[],
): SituationObservationBatch[] {
  return visitorSentences(messages).map((sentence) => {
    const source = evidenceFor(sentence);
    const entities = new Map<string, EntityMatch>();
    const relations: SituationObservationBatch["relations"] = [];

    const hasInitiator = /\bje\b|\bj'|\bmon idée\b|\bmon projet\b|\bnotre projet\b/i.test(sentence.content);
    if (hasInitiator) {
      entities.set("actor:initiator", makeEntity(
        "actor:initiator",
        "actor",
        "Porteur du besoin",
        source,
        "initiator",
      ));
    }

    const audienceMatches = AUDIENCE_PATTERNS.filter(({ pattern }) => pattern.test(sentence.content));
    for (const audience of audienceMatches) {
      entities.set(audience.key, makeEntity(
        audience.key,
        "actor",
        audience.label,
        source,
        audience.role ?? "audience",
      ));
    }

    const creationMatch = sentence.content.match(CREATION_PATTERN);
    let activity: EntityMatch | undefined;
    if (creationMatch?.[1]) {
      const label = cleanLabel(creationMatch[1].split(/\b(?:pour|afin de|dans le but de)\b/i)[0]);
      if (label) {
        const key = `activity:${label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}`;
        activity = makeEntity(key, "activity", label, source);
        entities.set(key, activity);
      }
    }

    const purposeMatch = sentence.content.match(PURPOSE_PATTERN);
    let goal: EntityMatch | undefined;
    if (purposeMatch?.[2] && isInfinitive(purposeMatch[2])) {
      const label = cleanLabel(`${purposeMatch[1] ?? ""}${purposeMatch[2]}`);
      const key = `goal:${label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}`;
      goal = makeEntity(key, "goal", label, source);
      entities.set(key, goal);
    } else {
      const directGoalMatch = sentence.content.match(DIRECT_GOAL_PATTERN);
      if (directGoalMatch?.[1]) {
        const label = cleanLabel(directGoalMatch[1]);
        const key = `goal:${label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}`;
        goal = makeEntity(key, "goal", label, source);
        entities.set(key, goal);
      }
    }

    const problemMatch = sentence.content.match(PROBLEM_PATTERN);
    let problem: EntityMatch | undefined;
    if (problemMatch?.[0]) {
      const label = cleanLabel(problemMatch[0]);
      const key = `problem:${label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}`;
      problem = makeEntity(key, "problem", label, source);
      entities.set(key, problem);
    }

    if (activity && hasInitiator) {
      relations.push({
        fromKey: "actor:initiator",
        predicate: "imagines",
        toKey: activity.key,
        source,
      });
    }

    if (activity && goal) {
      relations.push({
        fromKey: activity.key,
        predicate: "aims_at",
        toKey: goal.key,
        source,
      });
    }

    for (const audience of audienceMatches) {
      if (activity && /\b(?:pour|destiné à|destinee a)\b[^.!?;,]*\b(?:jeunes|étudiants?|élèves?|apprenants?|clients?|invités?|joueurs?|adultes?)\b/i.test(sentence.content)) {
        relations.push({
          fromKey: activity.key,
          predicate: "intended_for",
          toKey: audience.key,
          source,
        });
      }
      if (problem) {
        relations.push({
          fromKey: audience.key,
          predicate: "experiences",
          toKey: problem.key,
          source,
        });
      }
    }

    return {
      entities: [...entities.values()],
      relations,
    };
  });
}
