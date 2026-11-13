import type { ConversationMessage } from "./assistant/merkora-conversation";

export const DECISION_MEMORY_VERSION = 1;

export type ClientAnswer = {
  id: string;
  question: string;
  answer: string;
  status: "provided";
  source: "client";
  createdAt: string;
};

export type ProjectDecision = {
  id: string;
  statement: string;
  status: "confirmed" | "superseded";
  source: "client";
  createdAt: string;
  supersedes?: string;
  supersededBy?: string;
};

export type DecisionMemory = {
  version: typeof DECISION_MEMORY_VERSION;
  projectId: string;
  updatedAt: string;
  lastAssistantQuestion: string;
  clientAnswers: ClientAnswer[];
  decisions: ProjectDecision[];
  hypotheses: Array<{
    statement: string;
    source: "assistant";
    confirmationRequired: true;
  }>;
};

const MAX_ENTRIES = 15;
const MAX_TEXT = 500;

export function createDecisionMemory(projectId: string): DecisionMemory {
  return {
    version: DECISION_MEMORY_VERSION,
    projectId,
    updatedAt: new Date().toISOString(),
    lastAssistantQuestion: "",
    clientAnswers: [],
    decisions: [],
    hypotheses: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function cleanText(value: string): string {
  return value.trim().slice(0, MAX_TEXT);
}

function explicitDecision(text: string, question = ""): boolean {
  if (/\bje valide\b|\bje choisis\b|\bma décision est\b|\bje confirme (?:mon choix|cette décision|que je veux|que je souhaite)\b|\bj'opte pour\b|\bje décide de\b|\bje corrige ma décision\b|\bje reviens sur ma décision\b|\bje change d'avis\b/i.test(text)) return true;
  const shortAnswer = /^(?:oui|non|d'accord|exactement|je confirme)\b[.\s,;:]*$/i.test(text.trim());
  const decisionQuestion = /\b(confirmez|validez|choisissez|retenez|même projet|séparés|regrouper|séparer|quelle option|quel format|quelle solution)\b/i.test(question);
  return shortAnswer && decisionQuestion;
}

function isCorrection(text: string): boolean {
  return /\bje corrige\b|\bje reviens sur ma décision\b|\bje change d'avis\b/i.test(text);
}

/**
 * Updates only from an actual conversation turn. Assistant suggestions never
 * become client decisions; corrections retain the previous decision as history.
 */
export function recordDecisionMemoryTurn(
  memory: DecisionMemory,
  message: ConversationMessage,
  previousAssistantMessage?: ConversationMessage,
): DecisionMemory {
  const next: DecisionMemory = {
    ...memory,
    clientAnswers: [...memory.clientAnswers],
    decisions: memory.decisions.map((decision) => ({ ...decision })),
    hypotheses: [...memory.hypotheses],
    updatedAt: new Date().toISOString(),
  };
  const content = cleanText(message.content);

  if (message.role === "assistant") {
    if (/hypothèse|pourrait|peut-être|à vérifier/i.test(content)) {
      next.hypotheses.push({
        statement: content,
        source: "assistant",
        confirmationRequired: true,
      });
      next.hypotheses = next.hypotheses.slice(-MAX_ENTRIES);
    }
    if (content.includes("?")) next.lastAssistantQuestion = content;
    return next;
  }

  const previousContent = previousAssistantMessage?.role === "assistant"
    ? cleanText(previousAssistantMessage.content)
    : "";
  const priorQuestion = previousContent.includes("?") ? previousContent : next.lastAssistantQuestion;

  if (content) {
    const answerId = `answer-${Date.parse(next.updatedAt)}-${next.clientAnswers.length + 1}`;
    next.clientAnswers.push({
      id: answerId,
      question: priorQuestion.includes("?") ? priorQuestion : "",
      answer: content,
      status: "provided",
      source: "client",
      createdAt: next.updatedAt,
    });
    next.clientAnswers = next.clientAnswers.slice(-MAX_ENTRIES);
  }

  if (explicitDecision(content, priorQuestion)) {
    const previous = [...next.decisions].reverse().find((decision) => decision.status === "confirmed");
    const decisionId = `decision-${Date.parse(next.updatedAt)}-${next.decisions.length + 1}`;
    if (previous && isCorrection(content)) {
      previous.status = "superseded";
      previous.supersededBy = decisionId;
    }
    next.decisions.push({
      id: decisionId,
      statement: content,
      status: "confirmed",
      source: "client",
      createdAt: next.updatedAt,
      ...(previous && isCorrection(content) ? { supersedes: previous.id } : {}),
    });
    next.decisions = next.decisions.slice(-MAX_ENTRIES);
  }

  return next;
}

export function serializeDecisionMemory(memory: DecisionMemory): Record<string, unknown> {
  return {
    version: memory.version,
    projectId: memory.projectId,
    updatedAt: memory.updatedAt,
    lastAssistantQuestion: memory.lastAssistantQuestion,
    clientAnswers: memory.clientAnswers.slice(-MAX_ENTRIES),
    decisions: memory.decisions.slice(-MAX_ENTRIES),
    hypotheses: memory.hypotheses.slice(-MAX_ENTRIES),
  };
}

export function parseDecisionMemory(value: unknown, expectedProjectId: string): DecisionMemory | null {
  if (!isRecord(value) || value.version !== DECISION_MEMORY_VERSION ||
    value.projectId !== expectedProjectId || typeof value.updatedAt !== "string" ||
    typeof value.lastAssistantQuestion !== "string" ||
    !Array.isArray(value.clientAnswers) || !Array.isArray(value.decisions) ||
    !Array.isArray(value.hypotheses)) return null;

  const clientAnswers = value.clientAnswers.filter((item): item is ClientAnswer =>
    isRecord(item) && typeof item.id === "string" && typeof item.question === "string" &&
    typeof item.answer === "string" && item.status === "provided" && item.source === "client" &&
    typeof item.createdAt === "string",
  ).map((item) => ({
    ...item,
    question: item.question.slice(0, MAX_TEXT),
    answer: item.answer.slice(0, MAX_TEXT),
  })).slice(-MAX_ENTRIES);
  const decisions = value.decisions.filter((item): item is ProjectDecision =>
    isRecord(item) && typeof item.id === "string" && typeof item.statement === "string" &&
    (item.status === "confirmed" || item.status === "superseded") && item.source === "client" &&
    typeof item.createdAt === "string" &&
    (item.supersedes === undefined || typeof item.supersedes === "string") &&
    (item.supersededBy === undefined || typeof item.supersededBy === "string"),
  ).map((item) => ({ ...item, statement: item.statement.slice(0, MAX_TEXT) })).slice(-MAX_ENTRIES);
  const hypotheses = value.hypotheses.filter((item) =>
    isRecord(item) && typeof item.statement === "string" &&
    item.source === "assistant" && item.confirmationRequired === true,
  ).map((item) => ({
    statement: String(item.statement).slice(0, MAX_TEXT),
    source: "assistant" as const,
    confirmationRequired: true as const,
  })).slice(-MAX_ENTRIES);

  return {
    version: DECISION_MEMORY_VERSION,
    projectId: expectedProjectId,
    updatedAt: value.updatedAt,
    lastAssistantQuestion: value.lastAssistantQuestion.slice(0, MAX_TEXT),
    clientAnswers,
    decisions,
    hypotheses,
  };
}

export type StoredProjectDecision = {
  id?: string;
  decision_type?: string;
  decision?: string;
  comment?: string;
  actor_role?: string;
  created_at?: string;
};

export type ProjectMemoryDecisionInsert = {
  project_id: string;
  decision_type: "clarification_answered" | "scope_confirmed" | "change_requested" | "other";
  decision: string;
  comment: string;
  actor_user_id: string;
  actor_role: "client";
};

/** Rebuilds the conversational memory from the existing append-only project decision ledger. */
export function hydrateDecisionMemory(
  projectId: string,
  rows: StoredProjectDecision[],
): DecisionMemory {
  const memory = createDecisionMemory(projectId);
  for (const row of rows) {
    if (row.actor_role !== "client" || typeof row.decision !== "string") continue;
    const createdAt = typeof row.created_at === "string" ? row.created_at : memory.updatedAt;
    const id = typeof row.id === "string" ? row.id : `stored-${memory.clientAnswers.length + memory.decisions.length + 1}`;
    if (row.decision_type === "clarification_answered") {
      memory.clientAnswers.push({
        id,
        question: row.decision_type === "clarification_answered" && typeof row.comment === "string"
          ? row.comment.slice(0, MAX_TEXT) : "",
        answer: row.decision.slice(0, MAX_TEXT),
        status: "provided",
        source: "client",
        createdAt,
      });
      continue;
    }
    if (["scope_confirmed", "change_requested", "module_selected", "module_rejected", "other"].includes(row.decision_type ?? "")) {
      const previous = [...memory.decisions].reverse().find((item) => item.status === "confirmed");
      const correction = row.decision_type === "change_requested";
      if (previous && correction) {
        previous.status = "superseded";
        previous.supersededBy = id;
      }
      memory.decisions.push({
        id,
        statement: row.decision.slice(0, MAX_TEXT),
        status: "confirmed",
        source: "client",
        createdAt,
        ...(previous && correction ? { supersedes: previous.id } : {}),
      });
    }
  }
  memory.clientAnswers = memory.clientAnswers.slice(-MAX_ENTRIES);
  memory.decisions = memory.decisions.slice(-MAX_ENTRIES);
  const latest = [...rows].reverse().find((row) => typeof row.created_at === "string");
  if (latest?.created_at) memory.updatedAt = latest.created_at;
  return memory;
}

/** Converts only persisted client answers and decisions into safe resumable chat context. */
export function projectMemoryRowsToConversationHistory(
  rows: StoredProjectDecision[],
): ConversationMessage[] {
  const history: ConversationMessage[] = [];
  let lastUserContent = "";
  for (const row of rows) {
    if (row.actor_role !== "client" || typeof row.decision !== "string") continue;
    if (row.decision_type === "clarification_answered") {
      if (typeof row.comment === "string" && row.comment.trim()) {
        history.push({ role: "assistant", content: row.comment.slice(0, MAX_TEXT) });
      }
      const answer = row.decision.slice(0, MAX_TEXT);
      if (answer !== lastUserContent) history.push({ role: "user", content: answer });
      lastUserContent = answer;
    } else if (["scope_confirmed", "change_requested", "module_selected", "module_rejected", "other"].includes(row.decision_type ?? "")) {
      const decision = row.decision.slice(0, MAX_TEXT);
      if (decision !== lastUserContent) history.push({ role: "user", content: decision });
      lastUserContent = decision;
    }
  }
  return history.slice(-30);
}

/** Creates append-only rows only for client answers and explicit client decisions not already stored. */
export function buildProjectMemoryDecisionInserts(
  memory: DecisionMemory,
  previous: DecisionMemory,
  projectId: string,
  actorUserId: string,
): ProjectMemoryDecisionInsert[] {
  const knownAnswers = new Set(previous.clientAnswers.map((item) => item.id));
  const knownDecisions = new Set(previous.decisions.map((item) => item.id));
  const rows: ProjectMemoryDecisionInsert[] = [];
  for (const answer of memory.clientAnswers) {
    if (knownAnswers.has(answer.id)) continue;
    rows.push({
      project_id: projectId,
      decision_type: "clarification_answered",
      decision: answer.answer.slice(0, 3000),
      comment: answer.question.slice(0, 2000),
      actor_user_id: actorUserId,
      actor_role: "client",
    });
  }
  for (const decision of memory.decisions) {
    if (knownDecisions.has(decision.id)) continue;
    const correction = decision.supersedes !== undefined || isCorrection(decision.statement);
    const relatedAnswer = memory.clientAnswers.find((answer) => answer.answer === decision.statement);
    const scopeChoice = /\b(projet|périmètre|besoin|ensemble|séparé|séparément)\b/i.test(decision.statement) ||
      /\b(même projet|séparés|regrouper|séparer)\b/i.test(relatedAnswer?.question ?? "");
    rows.push({
      project_id: projectId,
      decision_type: correction ? "change_requested" : scopeChoice ? "scope_confirmed" : "other",
      decision: decision.statement.slice(0, 3000),
      comment: "",
      actor_user_id: actorUserId,
      actor_role: "client",
    });
  }
  return rows;
}
