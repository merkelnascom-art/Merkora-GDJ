import type { ConversationMessage } from "./types";

export type ReasoningStatus = "fact" | "deduction" | "hypothesis";

export interface ReasoningAssertion {
  id: string;
  messageId: string;
  quote: string;
  status: ReasoningStatus;
  rationale: string;
}

export interface ResolvedReference {
  messageId: string;
  mention: string;
  targetLabel: string | null;
  resolved: boolean;
  confidence: number;
}

export interface ReasoningContradiction {
  topic: string;
  statementA: string;
  statementB: string;
  messageIds: [string, string];
  question: string;
}

export type NextIntervention =
  | { kind: "resolve_contradiction"; topic: string; messageIds: [string, string]; prompt: string }
  | { kind: "clarify_reference"; messageId: string; mention: string; prompt: string }
  | { kind: "continue"; reason: string };

export interface ConversationReasoning {
  assertions: ReasoningAssertion[];
  references: ResolvedReference[];
  contradictions: ReasoningContradiction[];
  domains: string[];
  isHybrid: boolean;
  nextIntervention: NextIntervention;
}

interface ConstraintClaim {
  topic: string;
  polarity: string;
  quote: string;
  messageId: string;
  question: string;
}

const HYPOTHESIS = /\b(?:je pense que|je suppose que|j'imagine que|j’imagine que|peut-être que|peut etre que|probablement|il est possible que|j'espère que|j’espère que)\b/i;
const DEDUCTION = /\b(?:donc|cela signifie que|ce qui montre que|j'en déduis que|j’en déduis que|par conséquent)\b/i;

function statements(content: string): string[] {
  return content.replace(/\r/g, "\n").split(/(?<=[.!?])\s+|\n+|\s*;\s*/).map((part) => part.trim()).filter(Boolean);
}

function classifyStatement(quote: string): Pick<ReasoningAssertion, "status" | "rationale"> {
  if (HYPOTHESIS.test(quote)) {
    return { status: "hypothesis", rationale: "La formulation exprime une possibilité ou une anticipation de l'utilisateur." };
  }
  if (DEDUCTION.test(quote)) {
    return { status: "deduction", rationale: "La formulation présente une conclusion ou une conséquence, pas un fait indépendant." };
  }
  return { status: "fact", rationale: "L'énoncé est directement présenté par l'utilisateur ; il reste attribué à sa source." };
}

function extractConstraintClaims(message: ConversationMessage): ConstraintClaim[] {
  const content = message.content;
  const claims: ConstraintClaim[] = [];
  const add = (topic: string, polarity: string, quote: string, question: string) => {
    if (quote.trim()) claims.push({ topic, polarity, quote: quote.trim(), messageId: message.id, question });
  };

  const internet = content.match(/[^.!?\n]*(?:sans connexion(?: internet)?|hors ligne|offline)[^.!?\n]*/i);
  if (internet) add("internet_access", "not_required", internet[0], "La solution doit-elle fonctionner sans connexion Internet, ou une connexion est-elle obligatoire ?");
  const internetRequired = content.match(/[^.!?\n]*(?:connexion internet obligatoire|obligatoirement connecté(?:e)?s? à internet|toujours connecté(?:e)?s? à internet|connexion requise|en ligne uniquement)[^.!?\n]*/i);
  if (internetRequired) add("internet_access", "required", internetRequired[0], "La solution doit-elle fonctionner sans connexion Internet, ou une connexion est-elle obligatoire ?");

  const account = content.match(/[^.!?\n]*(?:sans compte|sans inscription|sans créer de compte|sans création de compte)[^.!?\n]*/i);
  if (account) add("account_required", "not_required", account[0], "L'utilisation doit-elle être possible sans compte, ou la création d'un compte est-elle obligatoire ?");
  const accountRequired = content.match(/[^.!?\n]*(?:compte obligatoire|doit obligatoirement créer un compte|inscription obligatoire|authentification obligatoire)[^.!?\n]*/i);
  if (accountRequired) add("account_required", "required", accountRequired[0], "L'utilisation doit-elle être possible sans compte, ou la création d'un compte est-elle obligatoire ?");

  const noPayment = content.match(/[^.!?\n]*(?:pas de paiement en ligne|aucun paiement en ligne|sans paiement en ligne|ne doit pas demander de paiement)[^.!?\n]*/i);
  if (noPayment) add("online_payment", "not_required", noPayment[0], "Le paiement en ligne est-il exclu ou doit-il être proposé ?");
  const paymentRequired = content.match(/[^.!?\n]*(?:paiement en ligne obligatoire|doit payer en ligne|paiement en ligne requis)[^.!?\n]*/i);
  if (paymentRequired) add("online_payment", "required", paymentRequired[0], "Le paiement en ligne est-il exclu ou doit-il être proposé ?");

  return claims;
}

function detectContradictions(messages: ConversationMessage[]): ReasoningContradiction[] {
  const claims = messages.filter((message) => message.role === "visitor").flatMap(extractConstraintClaims);
  const byTopic = new Map<string, ConstraintClaim[]>();
  for (const claim of claims) byTopic.set(claim.topic, [...(byTopic.get(claim.topic) ?? []), claim]);

  const result: ReasoningContradiction[] = [];
  for (const [topic, items] of byTopic) {
    const pair = items.find((item, index) => items.slice(index + 1).some((other) => item.polarity !== other.polarity));
    if (!pair) continue;
    const other = items.find((item) => item !== pair && item.polarity !== pair.polarity);
    if (!other) continue;
    result.push({
      topic,
      statementA: pair.quote,
      statementB: other.quote,
      messageIds: [pair.messageId, other.messageId],
      question: pair.question,
    });
  }
  return result;
}

const ANTECEDENT = /\b(?:une?|la|le|cette?|ce|cet)\s+(plateforme|application|site|logiciel|système|systeme|solution|outil|projet|service|clinique|école|ecole)\b/gi;
const REFERENCE = /\b(elle|il|elles|ils|cette plateforme|cette application|ce site|ce logiciel|ce système|ce systeme|cette solution|cet outil|ce projet|ce service)\b/gi;

function resolveReferences(messages: ConversationMessage[]): ResolvedReference[] {
  const visitorMessages = messages.filter((message) => message.role === "visitor");
  const known: Array<{ label: string; gender: "f" | "m"; messageId: string }> = [];
  const results: ResolvedReference[] = [];

  for (const message of visitorMessages) {
    const mentions = [...message.content.matchAll(REFERENCE)];
    for (const mention of mentions) {
      const token = mention[0];
      const isFeminine = /^(elle|elles|cette)/i.test(token);
      const candidates = known.filter((item) => item.gender === (isFeminine ? "f" : "m"));
      const target = candidates.at(-1);
      results.push({
        messageId: message.id,
        mention: token,
        targetLabel: target?.label ?? null,
        resolved: Boolean(target),
        confidence: target ? 0.82 : 0.2,
      });
    }
    for (const match of message.content.matchAll(ANTECEDENT)) {
      const noun = match[1].toLocaleLowerCase("fr");
      const gender = ["plateforme", "application", "solution", "clinique", "école", "ecole"].includes(noun) ? "f" : "m";
      const label = match[0].replace(/^(?:un|une|la|le|ce|cet|cette)\s+/i, "").trim();
      known.push({ label, gender, messageId: message.id });
    }
  }
  return results;
}

const DOMAIN_RULES: Array<[string, RegExp]> = [
  ["healthcare", /\b(?:clinique|hôpital|hopital|patient\w*|médical|medical|médecin|medecin|soin\w*|rendez-vous médicaux?)\b/i],
  ["education", /\b(?:école|ecole|établissement scolaire|élève\w*|étudiant\w*|apprenant\w*|formation|cours|enseignant\w*|pédagog\w*)\b/i],
  ["finance", /\b(?:banque|paiement|facture\w*|comptab\w*|budget|finance\w*|crédit)\b/i],
  ["commerce", /\b(?:boutique|vente\w*|client\w*|commande\w*|stock\w*|commerce|produit\w*)\b/i],
  ["logistics", /\b(?:livraison\w*|transport\w*|véhicule\w*|trajet\w*|entrepôt\w*|logistique)\b/i],
  ["events", /\b(?:événement\w*|mariage|anniversaire|fête\w*|invité\w*|cérémonie)\b/i],
];

function detectDomains(messages: ConversationMessage[]): string[] {
  const text = messages.filter((message) => message.role === "visitor").map((message) => message.content).join("\n");
  return DOMAIN_RULES.filter(([, pattern]) => pattern.test(text)).map(([domain]) => domain);
}

export function analyzeConversation(messages: ConversationMessage[]): ConversationReasoning {
  const assertions = messages
    .filter((message) => message.role === "visitor")
    .flatMap((message) => statements(message.content).map((quote, index) => ({
      id: `${message.id}:statement:${index + 1}`,
      messageId: message.id,
      quote,
      ...classifyStatement(quote),
    })));
  const contradictions = detectContradictions(messages);
  const references = resolveReferences(messages);
  const domains = detectDomains(messages);
  const conflict = contradictions[0];
  const unresolvedReference = references.find((reference) => !reference.resolved);

  let nextIntervention: NextIntervention = { kind: "continue", reason: "Aucune contradiction ou référence non résolue ne bloque la compréhension." };
  if (conflict) {
    nextIntervention = {
      kind: "resolve_contradiction",
      topic: conflict.topic,
      messageIds: conflict.messageIds,
      prompt: conflict.question,
    };
  } else if (unresolvedReference) {
    nextIntervention = {
      kind: "clarify_reference",
      messageId: unresolvedReference.messageId,
      mention: unresolvedReference.mention,
      prompt: `Quand tu dis « ${unresolvedReference.mention} », à quel élément de ton récit fais-tu référence ?`,
    };
  }

  return { assertions, references, contradictions, domains, isHybrid: domains.length > 1, nextIntervention };
}
