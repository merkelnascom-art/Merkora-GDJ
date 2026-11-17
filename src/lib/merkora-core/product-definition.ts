import {
  getProjectEvidenceItems,
  type ProjectUnderstanding,
} from "./project-diagnostic";
import { getFamilyDiagnosticQuestionSeeds } from "./knowledge/universal-project-knowledge";

export const PRODUCT_DEFINITION_FAMILIES = [
  { id: "nature", label: "Nature du produit", description: "Ce qui sera réellement conçu ou livré." },
  { id: "users_roles", label: "Utilisateurs et rôles", description: "Les profils, responsabilités et droits." },
  { id: "spaces", label: "Espaces", description: "Les lieux, espaces de travail ou environnements." },
  { id: "navigation", label: "Navigation", description: "La manière de se déplacer dans le produit." },
  { id: "functionalities", label: "Fonctionnalités", description: "Les capacités utiles au projet." },
  { id: "interactions", label: "Actions et interactions", description: "Les actions et réactions du produit." },
  { id: "data", label: "Données", description: "Les informations à recueillir, conserver et exploiter." },
  { id: "integrations_equipment", label: "Intégrations et équipements", description: "Les outils, appareils et services connectés." },
  { id: "security_control", label: "Sécurité et contrôle", description: "Les accès, protections et validations." },
  { id: "finances", label: "Finances", description: "Les flux financiers et règles de gestion." },
  { id: "visual_identity", label: "Identité visuelle", description: "L'apparence et l'expérience de marque." },
  { id: "operations", label: "Exploitation", description: "Le fonctionnement, le suivi et la maintenance." },
] as const;

export type ProductDefinitionFamilyId = typeof PRODUCT_DEFINITION_FAMILIES[number]["id"];
export type ProductDefinitionAnswerType = "text" | "single_choice" | "multi_choice";

export interface ProductDefinitionQuestion {
  id: string;
  familyId: ProductDefinitionFamilyId;
  domainFamilyId?: string;
  prompt: string;
  purpose: string;
  answerType: ProductDefinitionAnswerType;
  options?: string[];
  allowDetail: boolean;
  evidenceIds: string[];
  suggestedIndicators?: string[];
  suggestedFunctions?: string[];
}

export interface ProductDefinitionAnswer {
  id: string;
  questionId: string;
  familyId: ProductDefinitionFamilyId;
  value: string | string[];
  detail?: string;
  status: "answered" | "unknown" | "not_applicable";
  createdAt: string;
  version: number;
  question: ProductDefinitionQuestion;
  supersedesId?: string;
}

export interface ProductDefinitionSession {
  id: string;
  projectId: string;
  understandingId: string;
  version: number;
  answers: ProductDefinitionAnswer[];
  askedQuestionIds: string[];
  deferredQuestionIds: string[];
  status: "in_progress" | "ready_for_review";
  createdAt: string;
  updatedAt: string;
}

export interface ProductDefinitionAnswerInput {
  value: string | string[];
  detail?: string;
  status?: "answered" | "unknown" | "not_applicable";
}

const now = () => new Date().toISOString();
let sequence = 0;
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;

export function createProductDefinitionSession(dossier: ProjectUnderstanding): ProductDefinitionSession {
  const timestamp = now();
  return {
    id: makeId("product-definition"),
    projectId: dossier.projectId,
    understandingId: dossier.id,
    version: 1,
    answers: [],
    askedQuestionIds: [],
    deferredQuestionIds: [],
    status: "in_progress",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getActiveProductDefinitionAnswers(session: ProductDefinitionSession): ProductDefinitionAnswer[] {
  const superseded = new Set(session.answers.flatMap((answer) => answer.supersedesId ? [answer.supersedesId] : []));
  return session.answers.filter((answer) => !superseded.has(answer.id));
}

function handled(session: ProductDefinitionSession, questionId: string): boolean {
  return session.askedQuestionIds.includes(questionId) || session.deferredQuestionIds.includes(questionId);
}

function makeQuestion(
  id: string,
  familyId: ProductDefinitionFamilyId,
  prompt: string,
  purpose: string,
  evidenceIds: string[],
  answerType: ProductDefinitionAnswerType = "text",
  options?: string[],
  extra: Partial<Pick<ProductDefinitionQuestion, "domainFamilyId" | "suggestedIndicators" | "suggestedFunctions">> = {},
): ProductDefinitionQuestion {
  return {
    id,
    familyId,
    prompt,
    purpose,
    answerType,
    ...(options?.length ? { options } : {}),
    allowDetail: answerType !== "text",
    evidenceIds,
    ...extra,
  };
}

/**
 * Selects only a relevant next product-definition question.
 * The 12 families are a conditional decision library, not a fixed questionnaire.
 */
export function getNextProductDefinitionQuestion(
  dossier: ProjectUnderstanding,
  session: ProductDefinitionSession,
): ProductDefinitionQuestion | null {
  if (session.status === "ready_for_review") return null;

  const evidence = getProjectEvidenceItems(dossier);
  const activeAnswers = getActiveProductDefinitionAnswers(session);
  const answerText = activeAnswers
    .filter((answer) => answer.status === "answered")
    .flatMap((answer) => Array.isArray(answer.value) ? answer.value : [answer.value]);
  const allText = [dossier.originalDescription, ...evidence.map((item) => item.value), ...answerText].join("\n");
  const normalizedText = allText.toLocaleLowerCase("fr");
  const byDimension = (dimensions: string[]) => evidence.filter((item) => dimensions.includes(item.dimension));
  const has = (...dimensions: string[]) => byDimension(dimensions).length > 0;
  const hasSignal = (pattern: RegExp) => pattern.test(normalizedText);
  const candidate = (item: ProductDefinitionQuestion) =>
    !handled(session, item.id);

  const activityEvidence = byDimension(["activity"]);
  const solutionEvidence = byDimension(["imagined_solution"]);
  const contextEvidence = byDimension(["context"]);
  const operationsEvidence = byDimension(["operations"]);
  const actorsEvidence = byDimension(["actors"]);
  const resourcesEvidence = byDimension(["resources"]);
  const indicators = dossier.knowledgeMap?.indicatorCandidates ?? [];
  const solutionCandidates = dossier.knowledgeMap?.solutionCandidates ?? [];

  const familyCandidates = dossier.knowledgeMap?.familyCandidates ?? [];
  const domainClarification = activeAnswers.find((answer) => answer.questionId === "domain-scope-clarification" && answer.status === "answered");
  const selectedFamilyLabels = domainClarification
    ? (Array.isArray(domainClarification.value) ? domainClarification.value : [domainClarification.value])
    : [];
  const selectedFamilyMatches = familyCandidates.filter((family) => selectedFamilyLabels.includes(family.labelFr));
  const selectedFamily = selectedFamilyLabels.length === 1 && selectedFamilyMatches.length === 1 ? selectedFamilyMatches[0] : undefined;
  const effectivePrimaryFamilyId = dossier.knowledgeMap?.primaryFamilyId ?? (selectedFamily ? selectedFamily.familyId : undefined);
  const ambiguousDomainLinks = dossier.knowledgeMap?.unresolved.filter((item) => item.status === "ambiguous") ?? [];
  if ((dossier.knowledgeMap?.needsFamilyClarification || ambiguousDomainLinks.length > 0) && !handled(session, "domain-scope-clarification")) {
    const options = familyCandidates.length > 1
      ? [...familyCandidates.map((family) => family.labelFr), "Plusieurs domaines à la fois", "Autre / à préciser"]
      : undefined;
    return makeQuestion(
      "domain-scope-clarification",
      "functionalities",
      "Plusieurs rattachements métier sont possibles. Quelle activité ou quelle partie du projet est réellement au cœur de ta demande ?",
      "MerKora conserve les possibilités ouvertes et te demande de préciser le périmètre avant de choisir un référentiel métier.",
      [...ambiguousDomainLinks.map((item) => item.evidenceId), ...evidence.map((item) => item.id)],
      options ? "multi_choice" : "text",
      options,
    );
  }

  // When the activity is still vague, use the selected domain's own vocabulary.
  if (activityEvidence.length === 0 && effectivePrimaryFamilyId) {
    const seed = getFamilyDiagnosticQuestionSeeds(effectivePrimaryFamilyId)
      .find((item) => !has(item.dimension) && !handled(session, `domain-${effectivePrimaryFamilyId}-${item.id}`));
    if (seed) {
      const familyId: ProductDefinitionFamilyId = seed.dimension === "constraints" ? "security_control" : "functionalities";
      const item = makeQuestion(
        `domain-${effectivePrimaryFamilyId}-${seed.id}`,
        familyId,
        seed.prompt,
        seed.purpose,
        evidence.map((entry) => entry.id),
        "text",
        undefined,
        { domainFamilyId: effectivePrimaryFamilyId },
      );
      if (candidate(item)) return item;
    }
  }

  const digitalProductNegated = /\b(sans|pas de|pas d['’]|aucun(?:e)?|ni)\b.{0,35}\b(application|app|plateforme|site web|site internet|logiciel|portail|interface|tableau de bord|système numérique|outil numérique|application mobile)\b/i.test(normalizedText);
  const digitalProduct = !digitalProductNegated && /\b(application|app|plateforme|site web|site internet|logiciel|portail|interface|tableau de bord|système numérique|outil numérique|application mobile)\b/i.test(normalizedText);
  const publicFacing = digitalProduct || /\b(publication|catalogue public|vitrine|clients|usagers|visiteurs)\b/i.test(normalizedText);
  const explicitProductNature = solutionEvidence.length > 0 || /\b(application|app|plateforme|site web|site internet|logiciel|portail|prototype|équipement|ouvrage|protocole|service|produit physique)\b/i.test(normalizedText);
  const roleMatches = [...normalizedText.matchAll(/\b(administrateur|administratrice|gestionnaire|responsable|enseignant|enseignante|apprenant|élève|client|vendeur|fournisseur|arbitre|joueur|agent|technicien|médecin|infirmier|conducteur|opérateur|superviseur|membre|bénéficiaire)\b/gi)].map((match) => match[0]);
  const roleSignals = roleMatches.length > 0;
  const financeSignals = /\b(prix|paiement|paiements|vente|ventes|chiffre d'affaires|recette|recettes|dépense|dépenses|budget|facture|facturation|commission|cotisation|abonnement|caisse|comptabilité|trésorerie|crédit|assurance|investissement)\b/i.test(normalizedText);
  const securitySignals = /\b(donnée personnelle|données personnelles|santé|patient|mineur|enfant|confidentiel|confidentialité|paiement|identifiant|mot de passe|accès|autorisation|validation|sécurité|secret professionnel)\b/i.test(normalizedText);
  const integrationSignals = /\b(whatsapp|sms|email|e-mail|qr code|code qr|api|synchronis|connecter|intégrer|gps|capteur|biométr|imprimante|scanner|terminal|mobile money|mtn|moov|celtis|canal\+)\b/i.test(normalizedText);
  const navigationSignals = /\b(menu|navigation|onglet|page|écran|rubrique|parcours|tableau de bord|espace personnel)\b/i.test(normalizedText);
  const interactionSignals = /\b(notifier|notification|alerte|valider|rejeter|confirmer|annuler|téléverser|envoyer|signature|scanner|cliquer|glisser|réserver)\b/i.test(normalizedText);
  const visualSignals = /\b(couleur|couleurs|logo|charte graphique|identité visuelle|style visuel|design|apparence|typographie|maquette)\b/i.test(normalizedText);
  const exploitationSignals = /\b(maintenance|hébergement|héberger|administrer|exploitation|support|assistance|mise à jour|sauvegarde|surveillance|fonctionnement quotidien)\b/i.test(normalizedText);
  const dataSignals = /\b(données|informations|document|documents|dossier|dossiers|historique|historique|registre|fiche|fichier|score|scores|classement|récolte|stock|inventaire|inscription|résultat|résultats|suivi)\b/i.test(normalizedText);

  const questions: ProductDefinitionQuestion[] = [];

  if (!explicitProductNature) {
    questions.push(makeQuestion(
      "product-nature", "nature",
      "Quel type de produit ou de résultat concret souhaites-tu obtenir à la fin de ce projet ?",
      "Préciser ce qui doit être conçu ou livré, sans présumer qu'il s'agit forcément d'une application.",
      evidence.map((item) => item.id),
      "single_choice",
      ["Un site web", "Une application mobile", "Une plateforme ou un logiciel", "Un outil ou équipement matériel", "Un service ou une organisation", "Un document, protocole ou méthode", "Autre", "Je ne sais pas encore"],
    ));
  }

  if (digitalProduct && (!roleSignals || actorsEvidence.length === 0 || new Set(roleMatches).size < 2)) {
    questions.push(makeQuestion(
      "users-roles", "users_roles",
      actorsEvidence.length
        ? "Tu as déjà indiqué certains profils. Quels autres profils devront utiliser le produit, et que pourra faire chacun ?"
        : "Quels profils utiliseront ce produit, et que devra pouvoir faire chacun d'eux ?",
      "Transformer les personnes déjà identifiées en profils d'utilisation et responsabilités, sans inventer de droits.",
      [...activityEvidence, ...actorsEvidence].map((item) => item.id),
    ));
  }

  if (digitalProduct && /\b(plusieurs sites|plusieurs centres|plusieurs agences|plusieurs établissements|plusieurs équipes|plusieurs services|multi-sites|plusieurs lieux)\b/i.test(normalizedText) && !hasSignal(/\b(espaces? dédiés?|espace par|espace de travail par|espace distinct)\b/i)) {
    questions.push(makeQuestion(
      "product-spaces", "spaces",
      "Quels espaces distincts faut-il prévoir pour ces lieux, équipes ou services ?",
      "Organiser les environnements de travail sans créer d'espaces inutiles.",
      [...activityEvidence, ...contextEvidence, ...actorsEvidence].map((item) => item.id),
    ));
  }

  if (digitalProduct && !navigationSignals) {
    questions.push(makeQuestion(
      "product-navigation", "navigation",
      "Comment les utilisateurs devraient-ils retrouver les différentes parties du produit ?",
      "Définir une navigation simple à partir des tâches et des profils réellement prévus.",
      [...activityEvidence, ...actorsEvidence, ...operationsEvidence].map((item) => item.id),
      "single_choice",
      ["Un espace unique et simple", "Des menus par rubrique", "Des espaces différents selon le profil", "Un parcours guidé étape par étape", "Une combinaison de ces approches", "À définir avec la maquette"],
    ));
  }

  if (digitalProduct && !hasSignal(/\b(fonctionnalité|fonctionnalités|module|modules|permettra de|doit permettre|options? du produit)\b/i)) {
    const knownOperations = operationsEvidence.map((item) => item.value).filter(Boolean);
    const problemEvidence = byDimension(["problem", "causes", "objectives", "expected_outcome", "motivation"]);
    const suggestedFunctions = solutionCandidates.slice(0, 8).map((item) => item.labelFr);
    const hasSuggestions = suggestedFunctions.length > 0;
    questions.push(makeQuestion(
      "product-functions", "functionalities",
      hasSuggestions
        ? problemEvidence.length
          ? "Pour répondre aux difficultés et objectifs déjà décrits, voici des fonctions possibles. Lesquelles sont réellement utiles pour ce produit ?"
          : "Voici des fonctions possibles issues du référentiel métier. Lesquelles sont réellement utiles pour ce produit ?"
        : knownOperations.length
          ? "Parmi les actions déjà décrites, lesquelles le produit doit-il prendre en charge directement, et lesquelles resteront manuelles ?"
          : "Quelles sont les principales actions que ce produit doit permettre de réaliser ?",
      hasSuggestions
        ? "Ces propositions sont des pistes issues des informations du projet et du référentiel. Tu peux les choisir, les compléter ou les refuser ; aucune n'est activée automatiquement."
        : "Convertir les activités et processus connus en fonctions utiles, sans ajouter de modules hors sujet.",
      [...activityEvidence, ...operationsEvidence, ...actorsEvidence, ...problemEvidence].map((item) => item.id),
      hasSuggestions ? "multi_choice" : "text",
      hasSuggestions ? suggestedFunctions : undefined,
      hasSuggestions ? { suggestedFunctions } : {},
    ));
  }

  if (digitalProduct && interactionSignals && !has("constraints")) {
    questions.push(makeQuestion(
      "product-interactions", "interactions",
      "Lorsqu'une action est réalisée, quelle réaction le produit doit-il déclencher : confirmation, notification, alerte, validation ou autre ?",
      "Préciser les réactions attendues et les validations humaines nécessaires.",
      [...operationsEvidence, ...actorsEvidence].map((item) => item.id),
    ));
  }

  if (digitalProduct && !dataSignals && !has("information") && !hasSignal(/\b(base de données|données à enregistrer|informations à conserver|fiches? à créer|historique à conserver)\b/i)) {
    questions.push(makeQuestion(
      "product-data", "data",
      "Quelles informations faut-il recueillir, conserver, consulter ou retrouver plus tard dans ce projet ?",
      "Définir les données réellement nécessaires à l'activité et éviter toute collecte superflue.",
      [...activityEvidence, ...operationsEvidence, ...resourcesEvidence].map((item) => item.id),
    ));
  }

  if (integrationSignals && !hasSignal(/\b(intégration|intégrer|connecter|synchroniser|liaison avec|compatible avec)\b/i)) {
    questions.push(makeQuestion(
      "product-integrations", "integrations_equipment",
      "Quels outils, appareils, services ou moyens de paiement doivent fonctionner avec ce produit ?",
      "Identifier uniquement les intégrations et équipements utiles au fonctionnement réel.",
      resourcesEvidence.map((item) => item.id),
    ));
  }

  if ((digitalProduct && (actorsEvidence.length > 0 || dataSignals) || securitySignals) && !hasSignal(/\b(sécurité|confidentialité|droits d'accès|permissions|protection des données|contrôle d'accès)\b/i)) {
    questions.push(makeQuestion(
      "product-security", "security_control",
      "Quelles informations ou actions doivent être protégées, et qui doit être autorisé à les consulter ou les valider ?",
      "Définir les protections et contrôles adaptés aux personnes, aux données et aux risques du projet.",
      [...actorsEvidence, ...operationsEvidence, ...resourcesEvidence].map((item) => item.id),
    ));
  }

  if (financeSignals && !hasSignal(/\b(règles? de paiement|mode de paiement|modes de paiement|commission|marge|budget maximum|plafond|devise|facturation)\b/i)) {
    questions.push(makeQuestion(
      "product-finances", "finances",
      "Quels flux financiers ou règles de calcul le produit doit-il prendre en charge ?",
      "Préciser les prix, paiements, recettes, dépenses ou contrôles financiers réellement concernés.",
      [...activityEvidence, ...operationsEvidence, ...resourcesEvidence].map((item) => item.id),
    ));
  }

  if (indicators.length > 0 && !hasSignal(/\b(indicateur|taux de|pourcentage|moyenne|objectif chiffré|seuil|tableau de suivi)\b/i)) {
    const options = indicators.slice(0, 8).map((item) => item.labelFr);
    questions.push(makeQuestion(
      "business-indicators", "functionalities",
      "Voici des indicateurs possibles issus du référentiel métier. Lesquels sont réellement utiles pour suivre ce projet ?",
      "Les indicateurs sont des suggestions contextualisées ; tu peux en choisir plusieurs, les compléter ou ne pas les retenir.",
      evidence.map((item) => item.id),
      "multi_choice",
      options,
      { suggestedIndicators: options },
    ));
  }

  if (publicFacing && !visualSignals) {
    questions.push(makeQuestion(
      "visual-identity", "visual_identity",
      "As-tu déjà une identité visuelle à respecter, ou souhaites-tu que nous en concevions une pour ce produit ?",
      "Ne pas imposer une nouvelle identité si une marque, un logo ou une charte existe déjà.",
      solutionEvidence.map((item) => item.id),
      "single_choice",
      ["J'ai déjà un logo et une charte à respecter", "J'ai un logo, mais pas de charte complète", "Je souhaite une nouvelle identité visuelle", "L'apparence peut rester simple pour le moment", "Je ne sais pas encore"],
    ));
  }

  if (digitalProduct && !exploitationSignals) {
    questions.push(makeQuestion(
      "product-exploitation", "operations",
      "Après la mise en service, qui devra faire fonctionner, administrer et suivre ce produit au quotidien ?",
      "Anticiper l'exploitation réelle, les responsabilités, l'assistance et les besoins de maintenance.",
      [...actorsEvidence, ...operationsEvidence].map((item) => item.id),
    ));
  }

  return questions.find(candidate) ?? null;
}

export function recordProductDefinitionAnswer(
  session: ProductDefinitionSession,
  currentQuestion: ProductDefinitionQuestion,
  input: ProductDefinitionAnswerInput,
): ProductDefinitionSession {
  if (handled(session, currentQuestion.id)) throw new Error("This product-definition question has already been handled.");
  const values = (Array.isArray(input.value) ? input.value : [input.value]).map((value) => value.trim()).filter(Boolean);
  if (!values.length) throw new Error("A product-definition answer cannot be empty.");
  const valueText = values.join(" · ");
  const requestedStatus = input.status ?? "answered";
  const unknown = requestedStatus === "unknown" || /^je ne sais pas encore$/i.test(valueText);
  const answer: ProductDefinitionAnswer = {
    id: makeId("product-answer"),
    questionId: currentQuestion.id,
    familyId: currentQuestion.familyId,
    value: Array.isArray(input.value) ? values : values[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : {}),
    status: unknown ? "unknown" : requestedStatus,
    createdAt: now(),
    version: session.version + 1,
    question: currentQuestion,
    ...(getActiveProductDefinitionAnswers(session).find((previous) => previous.questionId === currentQuestion.id)
      ? { supersedesId: getActiveProductDefinitionAnswers(session).find((previous) => previous.questionId === currentQuestion.id)?.id }
      : {}),
  };
  return {
    ...session,
    version: session.version + 1,
    answers: [...session.answers, answer],
    askedQuestionIds: [...session.askedQuestionIds, currentQuestion.id],
    updatedAt: now(),
  };
}

export function reviseProductDefinitionAnswer(
  session: ProductDefinitionSession,
  answerId: string,
  input: ProductDefinitionAnswerInput,
): ProductDefinitionSession {
  const original = session.answers.find((answer) => answer.id === answerId);
  if (!original) throw new Error("The product-definition answer does not exist.");
  const values = (Array.isArray(input.value) ? input.value : [input.value]).map((value) => value.trim()).filter(Boolean);
  if (!values.length) throw new Error("A product-definition answer cannot be empty.");
  const valueText = values.join(" · ");
  const requestedStatus = input.status ?? "answered";
  const answer: ProductDefinitionAnswer = {
    ...original,
    id: makeId("product-answer-revision"),
    value: Array.isArray(input.value) ? values : values[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : { detail: undefined }),
    status: requestedStatus === "unknown" || /^je ne sais pas encore$/i.test(valueText) ? "unknown" : requestedStatus,
    createdAt: now(),
    version: session.version + 1,
    supersedesId: original.id,
  };
  return { ...session, version: session.version + 1, answers: [...session.answers, answer], updatedAt: now() };
}

export function deferProductDefinitionQuestion(
  session: ProductDefinitionSession,
  currentQuestion: ProductDefinitionQuestion,
): ProductDefinitionSession {
  if (handled(session, currentQuestion.id)) throw new Error("This product-definition question has already been handled.");
  return {
    ...session,
    version: session.version + 1,
    deferredQuestionIds: [...session.deferredQuestionIds, currentQuestion.id],
    updatedAt: now(),
  };
}

export function resumeDeferredProductDefinitionQuestions(session: ProductDefinitionSession): ProductDefinitionSession {
  return {
    ...session,
    version: session.version + 1,
    deferredQuestionIds: [],
    status: "in_progress",
    updatedAt: now(),
  };
}

export function markProductDefinitionReady(session: ProductDefinitionSession): ProductDefinitionSession {
  return { ...session, version: session.version + 1, status: "ready_for_review", updatedAt: now() };
}
