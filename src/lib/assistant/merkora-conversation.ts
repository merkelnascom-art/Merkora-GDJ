export type ConversationRole = "user" | "assistant";
export type ConversationMessage = { role: ConversationRole; content: string };
export type ConversationInput = { message: string; history: ConversationMessage[] };
import { identifyDomain, getDomainModules, getDomainQuestions, type DomainId } from "../domain-registry";
export type SuggestedModule = { id: string; title: string; description: string; reason: string };
export type ConversationReply = {
  assistantMessage: string;
  status: "needs_clarification" | "draft";
  clarifyingQuestions: string[];
  extractedNeeds: string[];
  suggestedModules: SuggestedModule[];
  nextAction: "clarify_need" | "review_modules";
  disclaimer: string;
  domainId: DomainId | null;
  domainLabel: string | null;
  specializationId: string | null;
  confidence: "high" | "medium" | "low";
};

const MAX_MESSAGE_LENGTH = 5000;
const MAX_HISTORY_ITEMS = 12;
const MAX_HISTORY_ITEM_LENGTH = 2000;

export function validateConversationInput(value: unknown):
  | { ok: true; value: ConversationInput }
  | { ok: false; reason: "invalid_payload" | "message_too_long" | "invalid_history" } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_payload" };
  }
  const record = value as Record<string, unknown>;
  if (typeof record.message !== "string" || !record.message.trim()) {
    return { ok: false, reason: "invalid_payload" };
  }
  if (record.message.trim().length > MAX_MESSAGE_LENGTH) {
    return { ok: false, reason: "message_too_long" };
  }
  if (record.history !== undefined && !Array.isArray(record.history)) {
    return { ok: false, reason: "invalid_history" };
  }
  const rawHistory = (record.history ?? []) as unknown[];
  const history: ConversationMessage[] = [];
  for (const item of rawHistory.slice(-MAX_HISTORY_ITEMS)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { ok: false, reason: "invalid_history" };
    }
    const message = item as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string" || !message.content.trim() ||
      message.content.length > MAX_HISTORY_ITEM_LENGTH) {
      return { ok: false, reason: "invalid_history" };
    }
    history.push({ role: message.role, content: message.content.trim() });
  }
  return { ok: true, value: { message: record.message.trim(), history } };
}

type ModuleRule = { keywords: string[]; module: SuggestedModule };
const MODULE_RULES: ModuleRule[] = [
  { keywords: ["personnel", "employé", "employes", "employés", "staff", "équipe", "equipe", "retard", "absence", "présence", "presence", "pointage"],
    module: { id: "staff-attendance", title: "Gestion du personnel et présence", description: "Suivi des employés, horaires, retards, absences et historiques d'activité.", reason: "Votre message mentionne le personnel, les horaires ou la présence." } },
  { keywords: ["caisse", "recette", "recettes", "dépense", "depense", "dépenses", "depenses", "finance", "rapport financier"],
    module: { id: "cash-reports", title: "Caisse, recettes et dépenses", description: "Enregistrement des mouvements de caisse et rapports consultables.", reason: "Votre message évoque les recettes, dépenses ou mouvements de caisse." } },
  { keywords: ["stock", "inventaire", "produit", "produits", "marchandise"],
    module: { id: "inventory", title: "Stock et inventaire", description: "Entrées, sorties, quantités disponibles et alertes de stock.", reason: "Votre message mentionne le stock ou les produits." } },
  { keywords: ["client", "clients", "commande", "commandes", "vente", "ventes"],
    module: { id: "customers-sales", title: "Clients, commandes et ventes", description: "Suivi des clients, commandes et ventes selon les règles à confirmer.", reason: "Votre message parle de clients, commandes ou ventes." } },
  { keywords: ["projet", "tâche", "tache", "planning", "échéance", "echeance", "avancement"],
    module: { id: "project-tracking", title: "Suivi des projets et tâches", description: "Organisation des tâches, responsables, échéances et avancement.", reason: "Votre message mentionne un projet, des tâches ou un planning." } },
];

function containsKeyword(text: string, keywords: string[]): boolean {
  const normalized = text.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return keywords.some((keyword) => {
    const needle = keyword.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i").test(normalized);
  });
}

export function createMerkoraConversationReply(input: ConversationInput): ConversationReply {
  const text = input.message.trim();
  const match = identifyDomain(text);
  const vague = text.length < 35 ||
    /^(bonjour|salut|bonsoir|je veux une application|je veux un site|aide-moi|aidez-moi)[.! ]*$/i.test(text);
  const legacyModules = MODULE_RULES.filter((rule) => containsKeyword(text, rule.keywords))
    .map((rule) => rule.module);
  const domainModules = getDomainModules(match);
  const suggestedModules = [...domainModules, ...legacyModules]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 5);
  const domainContext = {
    domainId: match.domain?.id ?? null,
    domainLabel: match.domain?.label ?? null,
    specializationId: match.specialization?.id ?? null,
    confidence: match.confidence,
  };

  if (vague || suggestedModules.length === 0 || !match.domain && legacyModules.length === 0) {
    const clarifyingQuestions = getDomainQuestions(match);
    return {
      assistantMessage: match.domain
        ? `Je repère le domaine « ${match.domain.label} ». Avant de proposer une solution, précisons votre activité et le résultat attendu.`
        : "Je vais vous aider à transformer votre idée en un besoin clair avant de proposer une application. Commençons par comprendre le problème à résoudre.",
      status: "needs_clarification",
      clarifyingQuestions,
      extractedNeeds: text.length >= 35 ? [text] : [],
      suggestedModules: [],
      nextAction: "clarify_need",
      disclaimer: "Les questions et suggestions de cette étape sont une première analyse, pas encore un cahier des charges validé.",
      ...domainContext,
    };
  }

  const extractedNeeds = [text];
  const clarifyingQuestions = getDomainQuestions(match);
  if (match.domain && clarifyingQuestions.length < 3) {
    clarifyingQuestions.push(
      "Quels rôles pourront consulter ou modifier ces informations ?",
      "Sur quels appareils la solution doit-elle fonctionner ?",
    );
  }
  return {
    assistantMessage: `J'ai repéré le domaine « ${match.domain?.label ?? "à confirmer"} »${match.specialization ? ` et la spécialisation « ${match.specialization.label} »` : ""}. Voici des modules de départ que nous pouvons ajuster ensemble avant de créer le plan.`,
    status: "draft",
    clarifyingQuestions: clarifyingQuestions.slice(0, 7),
    extractedNeeds,
    suggestedModules,
    nextAction: "review_modules",
    disclaimer: "Ceci est une proposition initiale basée sur vos mots. Aucun module, règle métier, prix ou développement n'est encore validé.",
    ...domainContext,
  };
}
