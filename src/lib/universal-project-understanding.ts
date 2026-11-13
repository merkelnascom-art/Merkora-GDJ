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

export type UniversalProjectUnderstanding = {
  rawIntent: string;
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
    patterns: [/argent|revenu|gagne|gagner|salaire|recette|depense|dépense|budget|cotisation|contribution|epargne|épargne|benefice|bénéfice/i],
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
    patterns: [/ami|amis|visiteur|visite|vient|viennent|arrive|arrivée|passage|chez moi|domicile|invité|invite/i],
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
    patterns: [/famille|foyer|maison|parent|enfant|conjoint|frere|frère|soeur|sœur|membre|proche|voisin|colocataire/i],
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
    patterns: [/heure|horaire|date|calendrier|planning|agenda|durée|duree|retard|départ|depart|arrivée|arrivee/i],
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
    patterns: [/tache|tâche|travail|activité|activite|mission|responsable|equipe|équipe|projet|avancement/i],
    questions: [
      "Quelles actions doivent être suivies, par qui et selon quelles règles ?",
    ],
  },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
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
  const questions = unique(GROUPS.filter((group) => matchedIds.has(group.id)).flatMap((group) => group.questions));
  const privacyConsiderations = unique(GROUPS.filter((group) => matchedIds.has(group.id) && group.privacy).map((group) => group.privacy!));
  const informationToClarify = unique([
    ...(matchedIds.has("money-flow") ? ["personnes participantes", "type de revenus et dépenses", "montants et fréquence", "droits de consultation"] : []),
    ...(matchedIds.has("visitors-and-events") ? ["mode d'enregistrement des visites", "informations nécessaires", "information et accord des visiteurs"] : []),
    ...(matchedIds.has("alerts-and-notifications") ? ["événement déclencheur", "destinataires", "canal de notification"] : []),
    ...(matchedIds.has("time-and-scheduling") ? ["dates et heures", "historique ou planification"] : []),
    ...(matchedIds.has("goods-and-deliveries") ? ["personne qui réceptionne", "preuve de remise"] : []),
    ...(matchedIds.has("work-and-tasks") ? ["actions", "responsables", "règles de suivi"] : []),
  ]);
  const unknowns = unique([
    ...(rawIntent.length < 35 ? ["le problème concret à résoudre"] : []),
    "le résultat prioritaire attendu",
    "les personnes concernées et leurs autorisations",
    "les règles de fonctionnement et les exceptions",
    "les contraintes de budget, de matériel, de connexion et de disponibilité",
  ]);

  const vague = rawIntent.length < 35 || /mieux organiser certaines choses|quelque chose|je ne sais pas encore/i.test(text);
  const confidence = vague || intentGroups.length === 0 ? "low" : intentGroups.length > 1 ? "medium" : "low";
  const needsMoreContext = vague || intentGroups.length === 0 || questions.length > 0;
  const prioritizedQuestions = unique([
    ...(intentGroups.length > 1 ? ["Ces besoins font-ils partie d'un seul projet ou souhaitez-vous les traiter séparément ?"] : []),
    ...questions,
    "Quel est le problème le plus important que vous voulez résoudre en premier ?",
    "Comment faites-vous aujourd'hui, et qu'est-ce qui ne fonctionne pas ?",
  ]).slice(0, 7);

  return {
    rawIntent,
    intentGroups,
    actors: inferActors(rawIntent),
    informationToClarify,
    unknowns: needsMoreContext ? unknowns : [],
    questions: prioritizedQuestions,
    privacyConsiderations,
    recommendedFormats: [],
    confidence,
    prematureClassification: false,
    interpretationNote: intentGroups.length
      ? "Des intentions possibles ont été extraites des mots du client. Elles restent des hypothèses à confirmer ; aucun secteur, métier, module ou format de solution n'est imposé."
      : "La demande est encore trop ouverte pour classer le projet. MerKora doit d'abord comprendre la situation, le résultat attendu et les contraintes.",
  };
}
