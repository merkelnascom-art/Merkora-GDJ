export type ConversationRole = "user" | "assistant";
export type ConversationMessage = { role: ConversationRole; content: string };
export type ConversationInput = { message: string; history: ConversationMessage[] };
import { identifyDomain, getDomainQuestions, type DomainId } from "../domain-registry";
import { getDomainOptionCatalog } from "../domain-options";
import { analyzeUniversalProjectIntent, type UniversalProjectUnderstanding } from "../universal-project-understanding";
import { buildUniversalProjectModel, type UniversalProjectModel } from "../universal-project-model";
import { buildUniversalProjectBlueprint, type UniversalProjectBlueprint } from "../universal-project-blueprint";
import { selectNextDiscoveryQuestion, type DiscoveryQuestionSelection } from "../universal-project-discovery";
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
  intentAnalysis: UniversalProjectUnderstanding;
  projectModel: UniversalProjectModel;
  projectBlueprint: UniversalProjectBlueprint;
  discovery: DiscoveryQuestionSelection;
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
  const accumulatedProjectDescription = [
    ...input.history.filter((item) => item.role === "user").map((item) => item.content),
    text,
  ].join("\n").slice(-5000);
  const intentAnalysis = analyzeUniversalProjectIntent(accumulatedProjectDescription);
  const projectModel = buildUniversalProjectModel(intentAnalysis);
  const projectBlueprint = buildUniversalProjectBlueprint(projectModel);
  const discovery = selectNextDiscoveryQuestion(intentAnalysis, input.history);
  const match = identifyDomain(text);
  const mixedNeeds = intentAnalysis.intentGroups.length > 1;
  const vague = text.length < 35 ||
    /^(bonjour|salut|bonsoir|je veux une application|je veux un site|aide-moi|aidez-moi)[.! ]*$/i.test(text);
  const legacyModules = MODULE_RULES.filter((rule) => containsKeyword(text, rule.keywords))
    .map((rule) => rule.module);
  const domainModules = match.domain && match.confidence !== "low"
    ? getDomainOptionCatalog(match).domainOptions.slice(0, 5).map((module) => ({
        ...module,
        reason: `Option métier proposée pour le domaine ${match.domain?.label ?? "identifié"}; à confirmer avec le client.`,
      }))
    : [];
  const suggestedModules = (mixedNeeds ? [] : [...legacyModules, ...domainModules])
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 5);
  const domainContext = {
    domainId: mixedNeeds ? null : match.domain?.id ?? null,
    domainLabel: mixedNeeds ? null : match.domain?.label ?? null,
    specializationId: mixedNeeds ? null : match.specialization?.id ?? null,
    confidence: mixedNeeds ? "low" as const : match.confidence,
    intentAnalysis,
    projectModel,
    projectBlueprint,
    discovery,
  };

  if (discovery.stage === "resolve_contradiction" || vague || mixedNeeds || suggestedModules.length === 0 || !match.domain && legacyModules.length === 0) {
    return {
      assistantMessage: discovery.stage === "resolve_contradiction"
        ? "Je remarque deux indications qui semblent se contredire. Je préfère vérifier ce point avec vous avant de définir les règles ou les accès."
        : mixedNeeds
          ? `Je repère plusieurs besoins dans votre description : ${intentAnalysis.intentGroups.map((group) => group.subject).join(" ; ")}. Je vais les examiner séparément avant de voir s’ils appartiennent au même projet. Rien n’est encore classé ni choisi.`
          : match.domain
          ? `Je repère le domaine « ${match.domain.label} ». Avant de proposer une solution, précisons votre activité et le résultat attendu.`
          : "Je vais d’abord comprendre votre situation, votre objectif et les personnes concernées. Ensuite seulement, nous chercherons la solution adaptée.",
      status: "needs_clarification",
      clarifyingQuestions: [discovery.nextQuestion],
      extractedNeeds: intentAnalysis.intentGroups.map((group) => `${group.subject} : ${group.desiredAction}`).slice(0, 8),
      suggestedModules: [],
      nextAction: "clarify_need",
      disclaimer: "Les questions et suggestions de cette étape sont une première analyse, pas encore un cahier des charges validé.",
      ...domainContext,
    };
  }

  const extractedNeeds = intentAnalysis.intentGroups.map((group) => `${group.subject} : ${group.desiredAction}`);
  return {
    assistantMessage: `J'ai repéré le domaine « ${match.domain?.label ?? "à confirmer"} »${match.specialization ? ` et la spécialisation « ${match.specialization.label} »` : ""}. Voici des modules de départ que nous pouvons ajuster ensemble avant de créer le plan.`,
    status: "draft",
    clarifyingQuestions: [discovery.nextQuestion],
    extractedNeeds,
    suggestedModules,
    nextAction: "review_modules",
    disclaimer: "Ceci est une proposition initiale basée sur vos mots. Aucun module, règle métier, prix ou développement n'est encore validé.",
    ...domainContext,
  };
}
