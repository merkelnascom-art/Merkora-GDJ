import type { ConversationMessage } from "./types";

export type SituationNodeKind = "actor" | "event" | "object" | "process";
export type SituationActorRole = "organizer" | "invitees";
export type SituationPredicate =
  | "organizes"
  | "invites"
  | "confirms_attendance"
  | "checks_access_with"
  | "performs"
  | "part_of";

export interface SituationNode {
  id: string;
  kind: SituationNodeKind;
  label: string;
  role?: SituationActorRole;
  sourceMessageIds: string[];
  sourceQuotes: string[];
}

export interface SituationRelation {
  id: string;
  fromNodeId: string;
  predicate: SituationPredicate;
  toNodeId: string;
  sourceMessageId: string;
  sourceQuote: string;
  status: "user_stated";
}

export interface SituationModel {
  nodes: SituationNode[];
  relations: SituationRelation[];
  processOrder: string[];
}

type UserStatement = Pick<ConversationMessage, "id" | "content">;

function statementsFrom(messages: ConversationMessage[]): UserStatement[] {
  return messages
    .filter((message) => message.role === "visitor" && message.content.trim().length > 0)
    .map(({ id, content }) => ({ id, content }));
}

function sentencesOf(statement: UserStatement): string[] {
  return statement.content
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function stableId(kind: SituationNodeKind, key: string): string {
  return `${kind}:${key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function addNode(
  nodes: Map<string, SituationNode>,
  kind: SituationNodeKind,
  label: string,
  source: UserStatement,
  role?: SituationActorRole,
): SituationNode {
  const key = role ?? label;
  const id = stableId(kind, key);
  const existing = nodes.get(id);
  if (existing) {
    if (!existing.sourceMessageIds.includes(source.id)) existing.sourceMessageIds.push(source.id);
    for (const quote of sentencesOf(source)) {
      if (!existing.sourceQuotes.includes(quote)) existing.sourceQuotes.push(quote);
    }
    return existing;
  }
  const node: SituationNode = {
    id,
    kind,
    label,
    ...(role ? { role } : {}),
    sourceMessageIds: [source.id],
    sourceQuotes: sentencesOf(source),
  };
  nodes.set(id, node);
  return node;
}

function addRelation(
  relations: Map<string, SituationRelation>,
  from: SituationNode,
  predicate: SituationPredicate,
  to: SituationNode,
  source: UserStatement,
  sourceQuote: string,
): void {
  const id = `${from.id}|${predicate}|${to.id}|${source.id}`;
  if (relations.has(id)) return;
  relations.set(id, {
    id,
    fromNodeId: from.id,
    predicate,
    toNodeId: to.id,
    sourceMessageId: source.id,
    sourceQuote,
    status: "user_stated",
  });
}

/**
 * Builds a conservative, traceable situation graph from visitor statements
 * across turns. Only explicit event-planning language is modeled in this
 * first slice; assistant messages are never treated as user evidence.
 */
export function buildSituationModel(messages: ConversationMessage[]): SituationModel {
  const nodes = new Map<string, SituationNode>();
  const relations = new Map<string, SituationRelation>();
  const processOrder: string[] = [];
  const statements = statementsFrom(messages);
  const allText = statements.map((statement) => statement.content).join("\n");
  const eventMatch = allText.match(/pool party|anniversaire|fête|soiree|soirée|mariage|cérémonie|conférence|événement/i);

  const organizerSource = statements.find((statement) =>
    /\bje\b[^.!?\n]{0,100}\b(?:organis|invite|vérifi|verifi|accueill)/i.test(statement.content),
  );
  const inviteesSource = statements.find((statement) =>
    /mes amis|les invités|les invites|mes proches|les participants|les convives/i.test(statement.content),
  );
  const eventSource = eventMatch
    ? statements.find((statement) => new RegExp(eventMatch[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(statement.content))
    : undefined;
  const qrSource = statements.find((statement) => /qr\s*code/i.test(statement.content));

  const organizer = organizerSource
    ? addNode(nodes, "actor", "Organisateur", organizerSource, "organizer")
    : undefined;
  const invitees = inviteesSource
    ? addNode(nodes, "actor", /mes amis/i.test(inviteesSource.content) ? "Amis invités" : "Personnes invitées", inviteesSource, "invitees")
    : undefined;
  const event = eventMatch && eventSource
    ? addNode(nodes, "event", eventMatch[0], eventSource)
    : undefined;
  const qrCode = qrSource
    ? addNode(nodes, "object", "QR code", qrSource)
    : undefined;

  const addProcess = (label: string, source: UserStatement, sentence: string, actor?: SituationNode): void => {
    const process = addNode(nodes, "process", label, source);
    if (!processOrder.includes(process.id)) processOrder.push(process.id);
    if (actor) addRelation(relations, actor, "performs", process, source, sentence);
    if (event) addRelation(relations, process, "part_of", event, source, sentence);
  };

  for (const statement of statements) {
    for (const sentence of sentencesOf(statement)) {
      const organizesEvent = /\bje\b[^.!?\n]{0,80}\borganis/i.test(sentence) &&
        Boolean(eventMatch && new RegExp(eventMatch[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(sentence));
      if (organizer && event && organizesEvent) {
        addRelation(relations, organizer, "organizes", event, statement, sentence);
      }

      const invitesPeople = /\bje\b[^.!?\n]{0,80}\binvit/i.test(sentence) &&
        /mes amis|les invités|les invites|mes proches|les participants|les convives/i.test(sentence);
      if (organizer && invitees && invitesPeople) {
        addRelation(relations, organizer, "invites", invitees, statement, sentence);
        addProcess("Envoi des invitations", statement, sentence, organizer);
      }

      const confirmsAttendance = /invités?[^.!?\n]{0,80}confirm(?:er|ent|é|ation)[^.!?\n]{0,40}(?:présence|participation)|confirm(?:er|ent)[^.!?\n]{0,40}(?:présence|participation)[^.!?\n]{0,40}invités?/i.test(sentence);
      if (invitees && event && confirmsAttendance) {
        addRelation(relations, invitees, "confirms_attendance", event, statement, sentence);
        addProcess("Confirmation des présences", statement, sentence, invitees);
      }

      const checksAccess = /\bje\b[^.!?\n]{0,80}(?:vérifi|verifi|contrôl|control)[^.!?\n]{0,80}(?:invitation|entrée|entree|accès|acces)[^.!?\n]{0,50}qr\s*code|\bqr\s*code\b[^.!?\n]{0,80}(?:vérifi|verifi|contrôl|control)/i.test(sentence);
      if (organizer && qrCode && checksAccess) {
        addRelation(relations, organizer, "checks_access_with", qrCode, statement, sentence);
        addProcess("Contrôle des accès", statement, sentence, organizer);
      }
    }
  }

  return {
    nodes: [...nodes.values()],
    relations: [...relations.values()],
    processOrder,
  };
}
