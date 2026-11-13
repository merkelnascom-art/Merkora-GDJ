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

const MAX_ENTRIES = 100;
const MAX_TEXT = 2000;

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

function explicitDecision(text: string): boolean {
  return /\bje confirme\b|\bje valide\b|\bje choisis\b|\bma décision est\b|\bje corrige ma décision\b|\bje reviens sur ma décision\b/i.test(text);
}

function isCorrection(text: string): boolean {
  return /\bje corrige\b|\bje reviens sur ma décision\b|\bfinalement\b|\bje change d'avis\b/i.test(text);
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

  if (priorQuestion.includes("?") && content) {
    const answerId = `answer-${next.clientAnswers.length + 1}`;
    next.clientAnswers.push({
      id: answerId,
      question: priorQuestion,
      answer: content,
      status: "provided",
      source: "client",
      createdAt: next.updatedAt,
    });
    next.clientAnswers = next.clientAnswers.slice(-MAX_ENTRIES);
  }

  if (explicitDecision(content)) {
    const previous = [...next.decisions].reverse().find((decision) => decision.status === "confirmed");
    const decisionId = `decision-${next.decisions.length + 1}`;
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
  ).slice(-MAX_ENTRIES);
  const decisions = value.decisions.filter((item): item is ProjectDecision =>
    isRecord(item) && typeof item.id === "string" && typeof item.statement === "string" &&
    (item.status === "confirmed" || item.status === "superseded") && item.source === "client" &&
    typeof item.createdAt === "string" &&
    (item.supersedes === undefined || typeof item.supersedes === "string") &&
    (item.supersededBy === undefined || typeof item.supersededBy === "string"),
  ).slice(-MAX_ENTRIES);
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
