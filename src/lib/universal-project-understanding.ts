import { calculateEvidenceCoverage } from "./intelligence/scientific-engine";

/**
 * Universal, domain-neutral interpretation of a client's first project description.
 *
 * This layer extracts evidence and uncertainty. It deliberately does not decide
 * that a request belongs to a profession, sector, or software format.
 */
export type IntentGroup = {
  id: string;
  subject: string;
  desiredAction: string;
  evidence: string[];
  confidence: "high" | "medium" | "low";
};

/** A statement reported by the client; provenance is known, external truth is not independently verified. */
export type EvidenceItem = { text: string; source: "client"; };
export type AnalysisHypothesis = { statement: string; reason: string; confirmationRequired: true; };
export type UniversalProjectUnderstanding = {
  rawIntent: string;
  statedFacts: EvidenceItem[];
  currentSituation: string;
  desiredOutcomes: string[];
  possibleCauses: AnalysisHypothesis[];
  hypotheses: AnalysisHypothesis[];
  constraints: string[];
  risks: string[];
  intentGroups: IntentGroup[];
  actors: string[];
  informationToClarify: string[];
  unknowns: string[];
  questions: string[];
  privacyConsiderations: string[];
  recommendedFormats: string[];
  confidence: "high" | "medium" | "low";
  prematureClassification: false;
  interpretationNote: string;
  analysisMetrics: import("./intelligence/scientific-engine").EvidenceCoverage;
};

type PatternGroup = {
  id: string;
  subject: string;
  action: string;
  patterns: RegExp[];
  questions: string[];
  privacy?: string;
};

const GROUPS: PatternGroup[] = [
  {
    id: "money-flow",
    subject: "revenus, argent et mouvements financiers",
    action: "comprendre ou suivre les entrées et sorties d'argent",
    patterns: [/argent|revenu|gagne|gagner|salaire|recette|depense|dépense|budget familial|budget du foyer|gestion du budget|suivi du budget|budget de fonctionnement|cotisation|contribution|epargne|épargne|benefice|bénéfice/i],
    questions: [
      "Souhaitez-vous suivre les revenus, les dépenses, les contributions de chacun, ou plusieurs de ces éléments ?",
      "Quelles personnes participeront volontairement au suivi, et qui pourra consulter les informations ?",
      "Quelles informations faut-il conserver : montant, origine, date, fréquence ou justificatif ?",
    ],
    privacy: "Les données financières personnelles doivent être visibles uniquement par les personnes autorisées et participantes.",
  },
  {
    id: "visitors-and-events",
    subject: "visites, arrivées et événements au domicile",
    action: "conserver ou consulter un historique des visites",
    patterns: [/\bamis?\b|\bvisiteurs?\b|\bvisites?\b|\bchez moi\b|\bdomicile\b|\binvites?\b/i],
    questions: [
      "Voulez-vous noter les visites manuellement, permettre aux visiteurs de signaler leur arrivée, ou simplement organiser un agenda ?",
      "Quelles informations sont réellement nécessaires : nom, heure d'arrivée, heure de départ ou motif de visite ?",
      "Les personnes concernées seront-elles informées et d'accord pour que ces informations soient enregistrées ?",
    ],
    privacy: "L'enregistrement des visites touche à la vie privée : les visiteurs doivent être informés, et aucune collecte cachée ni géolocalisation implicite ne doit être proposée.",
  },
  {
    id: "people-and-relationships",
    subject: "personnes, membres d'un foyer ou d'un groupe",
    action: "organiser les informations et interactions entre les personnes concernées",
    patterns: [/relation entre|relations entre|communication familiale|entraide|conflit familial|médiation/i],
    questions: [
      "Qui fait partie du groupe concerné et quel rôle chaque personne souhaite-t-elle avoir ?",
    ],
  },
  {
    id: "alerts-and-notifications",
    subject: "alertes et notifications",
    action: "être averti lorsqu'un événement ou une condition se produit",
    patterns: [/alerte|notification|avertir|prévenir|prevenir|rappeler|message|signal/i],
    questions: [
      "Quel événement doit déclencher une alerte, qui doit la recevoir et par quel moyen ?",
    ],
  },
  {
    id: "time-and-scheduling",
    subject: "horaires, dates et organisation du temps",
    action: "enregistrer, comparer ou planifier des événements dans le temps",
    patterns: [/horaire|calendrier|planning|agenda|durée|duree|retard|rendez-vous|planifier|programmer/i],
    questions: [
      "Avez-vous besoin d'un historique, d'un calendrier à venir ou des deux ?",
    ],
  },
  {
    id: "goods-and-deliveries",
    subject: "objets, colis et livraisons",
    action: "suivre la réception, la remise ou le déplacement d'objets",
    patterns: [/colis|livraison|paquet|commande|reception|réception|remise|objet|bagage/i],
    questions: [
      "Qui enregistre la réception et comment confirmer qu'un colis a bien été remis à la bonne personne ?",
    ],
  },
  {
    id: "work-and-tasks",
    subject: "activités, tâches et responsabilités",
    action: "organiser qui fait quoi et suivre l'avancement",
    patterns: [/\btaches?\b|\btravail\b|\bactivites?\b|\bmissions?\b|\bresponsables?\b|\bequipes?\b|\bpointage\b|\bavancement\b/i],
    questions: [
      "Quelles actions doivent être suivies, par qui et selon quelles règles ?",
    ],
  },
  {
    id: "career-documents",
    subject: "CV et documents de candidature personnalisés",
    action: "créer et personnaliser des documents adaptés au parcours, au profil et à l'objectif de chaque personne",
    patterns: [/\bc\.?v\.?\b|curriculum vitae|lettre de motivation|candidature|candidatures|parcours professionnel|profil professionnel/i],
    questions: [
      "Les CV doivent-ils être créés à partir de modèles proposés, d'un document existant ou des deux ?",
      "Quelles parties chaque personne doit-elle pouvoir personnaliser : texte, photo, couleurs, police, rubriques et mise en page ?",
      "Les CV doivent-ils être adaptés à un métier ou à une offre précise, ou rester polyvalents selon l'objectif choisi ?",
    ],
  },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function sentenceEvidence(input: string): string[] {
  return input.split(/(?<=[.!?;])\s+|\n+/).map((part) => part.trim()).filter(Boolean).slice(0, 20);
}

function extractCurrentSituation(sentences: string[]): string {
  return sentences.find((sentence) =>
    /aujourd'hui|actuellement|pour le moment|en ce moment|jusqu'ici|on fait|nous faisons|je fais|je note|nous notons|on note|on utilise|nous utilisons|je travaille avec|on procède|par whatsapp|dans un cahier|sur excel|notre façon actuelle/i.test(sentence),
  ) ?? "";
}

function inferConstraints(text: string): string[] {
  const constraints: string[] = [];
  if (/connexion|internet|reseau|réseau|hors ligne|offline/i.test(text)) constraints.push("connectivité ou fonctionnement hors ligne à préciser");
  if (/budget|pas cher|cout|coût|prix|gratuit|argent limite|moyen limite/i.test(text)) constraints.push("budget et coût acceptable à préciser");
  if (/telephone|téléphone|mobile|smartphone|ordinateur|tablette/i.test(text)) constraints.push("équipements disponibles à préciser");
  if (/temps|rapidement|urgent|delai|délai|date limite/i.test(text)) constraints.push("délais et disponibilité à préciser");
  if (/discret|secret|sans qu|sans que|cacher|surveill/i.test(text)) constraints.push("limites de confidentialité, information et consentement à clarifier");
  return constraints;
}

function inferOutcomes(text: string): string[] {
  const outcomes: string[] = [];
  if (/\bc\.?v\.?\b|curriculum vitae|lettre de motivation|candidature/i.test(text)) {
    outcomes.push("créer ou personnaliser des documents de candidature adaptés au parcours et à l'objectif de chaque personne");
  }
  if (/eviter|éviter|reduire|réduire|diminuer|moins de|ne plus|arreter|arrêter/i.test(text)) outcomes.push("réduire ou éviter une difficulté mentionnée (résultat exact à préciser)");
  if (/connaitre|connaître|savoir|voir|suivre|surveill/i.test(text)) outcomes.push("obtenir une meilleure visibilité sur les éléments cités (périmètre à confirmer)");
  if (/organis|planifi|program|rappel|agenda/i.test(text)) outcomes.push("mieux organiser ou planifier les activités mentionnées");
  if (/alerte|notifi|prevenir|prévenir|avertir|resume|résumé|rapport/i.test(text)) outcomes.push("recevoir des informations ou alertes selon une fréquence à définir");
  if (/automatis|automatiser|sans avoir|tout seul/i.test(text)) outcomes.push("réduire certaines opérations manuelles (niveau d'automatisation à confirmer)");
  return outcomes;
}

function inferCauses(text: string): AnalysisHypothesis[] {
  const causes: AnalysisHypothesis[] = [];
  if (/je ne sais plus|oubli|oublie|perd|perdu|difficile de retrouver|pas de trace/i.test(text)) {
    causes.push({ statement: "Le suivi actuel pourrait manquer de traces fiables ou faciles à retrouver.", reason: "Le client mentionne des oublis ou une difficulté à retrouver l'information.", confirmationRequired: true });
  }
  if (/dispute|conflit|malentendu|désaccord|desaccord|erreur/i.test(text)) {
    causes.push({ statement: "Des informations partagées ou des règles peu explicites pourraient provoquer des désaccords.", reason: "Le client mentionne des disputes, conflits ou erreurs.", confirmationRequired: true });
  }
  if (/attend|retard|ne repond|ne répond|pas inform|ne sait pas/i.test(text)) {
    causes.push({ statement: "La circulation de l'information ou la coordination pourrait être insuffisante.", reason: "Le client évoque une attente ou un manque d'information.", confirmationRequired: true });
  }
  return causes;
}

function privacyConsiderationsPlaceholder(matchedIds: Set<string>): string[] {
  return [
    ...(matchedIds.has("money-flow") ? ["Confidentialité des informations financières et limitation des accès."] : []),
    ...(matchedIds.has("visitors-and-events") ? ["Information préalable des visiteurs et collecte strictement nécessaire."] : []),
  ];
}

function inferActors(text: string): string[] {
  const actors: string[] = [];
  if (/famille|foyer|parent|enfant|conjoint|frere|frère|soeur|sœur/i.test(text)) actors.push("membres de la famille ou du foyer (à préciser)");
  if (/ami|amis|visiteur|visite|invité|invite/i.test(text)) actors.push("amis ou visiteurs (à préciser)");
  if (/client|acheteur|vendeur|fournisseur/i.test(text)) actors.push("clients, vendeurs ou fournisseurs (à préciser)");
  if (/employ|personnel|salari|collaborateur|equipe|équipe/i.test(text)) actors.push("personnel ou collaborateurs (à préciser)");
  if (/responsable|administrateur|directeur|gestionnaire/i.test(text)) actors.push("responsable ou gestionnaire (à préciser)");
  return unique(actors);
}

export function analyzeUniversalProjectIntent(rawInput: string): UniversalProjectUnderstanding {
  const rawIntent = rawInput.trim().slice(0, 5000);
  const text = normalize(rawIntent);
  const intentGroups: IntentGroup[] = GROUPS.flatMap((group) => {
    const evidence = group.patterns.filter((pattern) => pattern.test(text)).map((pattern) => {
      const match = rawIntent.match(pattern);
      return match?.[0] ?? "";
    });
    return evidence.length ? [{
      id: group.id,
      subject: group.subject,
      desiredAction: group.action,
      evidence: unique(evidence),
      confidence: evidence.length > 1 ? "medium" as const : "low" as const,
    }] : [];
  });

  const matchedIds = new Set(intentGroups.map((group) => group.id));
  const evidenceSentences = sentenceEvidence(rawIntent);
  const statedFacts = evidenceSentences.map((text) => ({ text, source: "client" as const }));
  const possibleCauses = inferCauses(text);
  const desiredOutcomes = inferOutcomes(text);
  const constraints = inferConstraints(text);
  const hypotheses: AnalysisHypothesis[] = [
    ...possibleCauses,
    ...(intentGroups.length > 1 ? [{
      statement: "Les besoins mentionnés pourraient relever d'un même projet ou de plusieurs projets distincts.",
      reason: "Plusieurs intentions apparaissent dans le même message.",
      confirmationRequired: true as const,
    }] : []),
  ];
  const risks = unique([
    ...(privacyConsiderationsPlaceholder(matchedIds)),
    ...(constraints.some((item) => /confidentialité/i.test(item)) ? ["Risque de collecte excessive ou insuffisamment transparente."] : []),
    ...(matchedIds.has("money-flow") ? ["Risque d'accès non autorisé à des informations financières personnelles."] : []),
    ...(matchedIds.has("visitors-and-events") ? ["Risque d'atteinte à la vie privée si les visites sont enregistrées sans information ni accord."] : []),
  ]);
  const questions = unique(GROUPS.filter((group) => matchedIds.has(group.id)).flatMap((group) => group.questions));
  const privacyConsiderations = unique(GROUPS.filter((group) => matchedIds.has(group.id) && group.privacy).map((group) => group.privacy!));
  const informationToClarify = unique([
    ...(matchedIds.has("money-flow") ? ["personnes participantes", "type de revenus et dépenses", "montants et fréquence", "droits de consultation"] : []),
    ...(matchedIds.has("visitors-and-events") ? ["mode d'enregistrement des visites", "informations nécessaires", "information et accord des visiteurs"] : []),
    ...(matchedIds.has("alerts-and-notifications") ? ["événement déclencheur", "destinataires", "canal de notification"] : []),
    ...(matchedIds.has("time-and-scheduling") ? ["dates et heures", "historique ou planification"] : []),
    ...(matchedIds.has("goods-and-deliveries") ? ["personne qui réceptionne", "preuve de remise"] : []),
    ...(matchedIds.has("work-and-tasks") ? ["actions", "responsables", "règles de suivi"] : []),
    ...(matchedIds.has("career-documents") ? ["modèles de CV", "informations du parcours", "photo et éléments visuels", "objectif de candidature", "formats d'export"] : []),
  ]);
  const unknowns = unique([
    ...(rawIntent.length < 35 ? ["le problème concret à résoudre"] : []),
    ...(desiredOutcomes.length ? [] : ["le résultat prioritaire attendu"]),
    "les personnes concernées et leurs autorisations",
    "le fonctionnement actuel et les étapes réellement suivies",
    "les règles de fonctionnement et les exceptions",
    ...(constraints.length ? [] : ["les contraintes de budget, de matériel, de connexion et de disponibilité"]),
  ]);

  const vague = rawIntent.length < 35 || /mieux organiser certaines choses|quelque chose|je ne sais pas encore/i.test(text);
  const confidence = vague || intentGroups.length === 0 ? "low" : intentGroups.length > 1 ? "medium" : "low";
  const needsMoreContext = vague || intentGroups.length === 0 || questions.length > 0;
  const evidenceSignals = [
    statedFacts.length > 0,
    Boolean(extractCurrentSituation(evidenceSentences)),
    desiredOutcomes.length > 0,
    intentGroups.length > 0,
    constraints.length > 0,
    inferActors(rawIntent).length > 0,
  ].filter(Boolean).length;
  const analysisMetrics = calculateEvidenceCoverage(evidenceSignals, unknowns.length);

  const prioritizedQuestions = unique([
    ...(intentGroups.length > 1 ? ["Ces besoins font-ils partie d'un seul projet ou souhaitez-vous les traiter séparément ?"] : []),
    ...questions,
    "Quel est le problème le plus important que vous voulez résoudre en premier ?",
    "Comment faites-vous aujourd'hui, et qu'est-ce qui ne fonctionne pas ?",
  ]).slice(0, 7);

  return {
    rawIntent,
    statedFacts,
    currentSituation: extractCurrentSituation(evidenceSentences),
    desiredOutcomes,
    possibleCauses,
    hypotheses,
    constraints,
    risks,
    intentGroups,
    actors: inferActors(rawIntent),
    informationToClarify,
    unknowns: needsMoreContext ? unknowns : [],
    questions: prioritizedQuestions,
    privacyConsiderations,
    recommendedFormats: [],
    confidence,
    prematureClassification: false,
    analysisMetrics,
    interpretationNote: intentGroups.length
      ? "Des intentions possibles ont été extraites des mots du client. Elles restent des hypothèses à confirmer ; aucun secteur, métier, module ou format de solution n'est imposé."
      : "La demande est encore trop ouverte pour classer le projet. MerKora doit d'abord comprendre la situation, le résultat attendu et les contraintes.",
  };
}
