import { MERKORA_UNIVERSAL_FAMILIES } from "./universal-reference";

export type UniversalFamilyRecognition = {
  familyId: string;
  sectorIds: string[];
  confidence: "medium" | "high";
  evidence: string[];
  questions: string[];
};

const RULES: Record<string, Array<{ sectorId: string; terms: string[]; questions: string[] }>> = {
  "family-16": [
    { sectorId: "S16-01", terms: ["cabinet avocat", "avocat", "conseil juridique", "dossier juridique", "audience"], questions: ["Gérez-vous des consultations, dossiers clients, audiences ou échéances juridiques ?"] },
    { sectorId: "S16-02", terms: ["notaire", "notariat", "acte notarié", "acte notarie"], questions: ["Faut-il suivre des actes, pièces justificatives, rendez-vous et formalités notariales ?"] },
    { sectorId: "S16-03", terms: ["huissier", "commissaire de justice", "signification", "constat"], questions: ["Suivez-vous des constats, significations, missions ou actes d'exécution ?"] },
    { sectorId: "S16-04", terms: ["médiation", "mediation", "médiateur", "mediateur", "conciliation", "résolution conflit", "resolution conflit"], questions: ["Faut-il organiser des séances confidentielles, suivre les parties et formaliser des accords ?"] },
    { sectorId: "S16-05", terms: ["conformité", "conformite", "protection des données", "protection des donnees", "audit conformité", "audit conformite"], questions: ["Souhaitez-vous suivre des contrôles, obligations, incidents et plans de mise en conformité ?"] },
  ],
  "family-17": [
    { sectorId: "S17-01", terms: ["développement logiciel", "developpement logiciel", "développeur", "developpeur", "application mobile", "application web", "logiciel métier", "logiciel metier"], questions: ["Concevez-vous des sites, applications ou logiciels, et faut-il suivre versions, tests et livraisons ?"] },
    { sectorId: "S17-02", terms: ["support informatique", "maintenance informatique", "dépannage informatique", "depannage informatique", "parc informatique"], questions: ["Recevez-vous des tickets d'assistance et suivez-vous les équipements et interventions ?"] },
    { sectorId: "S17-03", terms: ["réseau informatique", "reseau informatique", "télécommunication", "telecommunication", "fibre optique", "installation réseau", "installation reseau"], questions: ["Faut-il superviser des lignes, équipements, incidents réseau et interventions techniques ?"] },
    { sectorId: "S17-04", terms: ["marketing digital", "communication digitale", "community manager", "réseaux sociaux", "reseaux sociaux"], questions: ["Gérez-vous des campagnes, publications, contenus, audiences et résultats numériques ?"] },
    { sectorId: "S17-05", terms: ["intelligence artificielle", "automatisation", "analyse de données", "analyse de donnees", "workflow automatisé", "workflow automatise"], questions: ["Quelles tâches voulez-vous assister par les données, l'IA ou des automatisations ?"] },
  ],
  "family-18": [
    { sectorId: "S18-01", terms: ["distribution électricité", "distribution electricite", "production électricité", "production electricite", "réseau électrique", "reseau electrique"], questions: ["Faut-il suivre des sites, compteurs, équipements, pannes et interventions électriques ?"] },
    { sectorId: "S18-02", terms: ["panneau solaire", "installation solaire", "énergie solaire", "energie solaire", "énergie renouvelable", "energie renouvelable", "photovoltaïque", "photovoltaique"], questions: ["Installez-vous ou entretenez-vous des équipements solaires et souhaitez-vous suivre leur rendement ?"] },
    { sectorId: "S18-03", terms: ["eau potable", "distribution eau", "compteur eau", "facturation eau", "adduction eau"], questions: ["Suivez-vous les abonnés, compteurs, relevés, factures ou signalements de fuite d'eau ?"] },
    { sectorId: "S18-04", terms: ["assainissement", "collecte déchets", "collecte dechets", "gestion déchets", "gestion dechets", "ordures ménagères", "ordures menageres"], questions: ["Faut-il organiser des collectes, tournées, sites de traitement et signalements environnementaux ?"] },
    { sectorId: "S18-05", terms: ["services essentiels", "maintenance réseau", "maintenance reseau", "astreinte technique", "continuité de service", "continuite de service"], questions: ["Comment signalez-vous les pannes et organisez-vous les astreintes pour maintenir le service ?"] },
  ],
  "family-19": [
    { sectorId: "S19-01", terms: ["sécurité privée", "securite privee", "société de gardiennage", "societe de gardiennage", "gardiennage", "agent de sécurité", "agent de securite", "vigile"], questions: ["Gérez-vous des agents, sites, rondes, consignes et rapports d'incidents ?"] },
    { sectorId: "S19-02", terms: ["sécurité incendie", "securite incendie", "prévention incendie", "prevention incendie", "extincteur", "alarme incendie"], questions: ["Faut-il planifier les inspections, exercices, équipements et alertes incendie ?"] },
    { sectorId: "S19-03", terms: ["santé sécurité travail", "sante securite travail", "sécurité au travail", "securite au travail", "accident de travail", "risques professionnels"], questions: ["Souhaitez-vous enregistrer les risques professionnels, formations, incidents et actions correctives ?"] },
    { sectorId: "S19-04", terms: ["gestion de crise", "plan de continuité", "plan de continuite", "plan urgence", "cellule de crise"], questions: ["Faut-il coordonner des alertes, équipes, plans d'urgence et journaux de crise ?"] },
    { sectorId: "S19-05", terms: ["contrôle d'accès", "controle d'acces", "badge accès", "badge acces", "gestion visiteurs", "registre visiteurs"], questions: ["Faut-il gérer les visiteurs, badges, autorisations et historiques d'accès à des sites ?"] },
  ],
  "family-20": [
    { sectorId: "S20-01", terms: ["budget familial", "budget du foyer", "gestion du foyer", "dépenses familiales", "depenses familiales", "organisation familiale"], questions: ["Voulez-vous organiser le budget du foyer, les dépenses, les tâches et les objectifs familiaux ?"] },
    { sectorId: "S20-02", terms: ["association communautaire", "membres association", "cotisations", "adhérents", "adherents", "bureau association", "assemblée générale", "assemblee generale"], questions: ["Gérez-vous des adhérents, cotisations, activités, réunions ou décisions d'association ?"] },
    { sectorId: "S20-03", terms: ["ong", "organisation non gouvernementale", "solidarité", "solidarite", "projet social", "aide humanitaire", "bénéficiaires", "beneficiaires"], questions: ["Faut-il suivre des bénéficiaires, dons, programmes, distributions et rapports d'impact ?"] },
    { sectorId: "S20-04", terms: ["groupe communautaire", "communauté", "communaute", "club de membres", "groupe d'intérêt", "groupe d'interet", "forum communautaire"], questions: ["Souhaitez-vous animer un groupe, gérer ses membres, événements, échanges et règles de modération ?"] },
    { sectorId: "S20-05", terms: ["organisation personnelle", "gestion du quotidien", "planning personnel", "objectifs personnels", "tâches quotidiennes", "taches quotidiennes"], questions: ["Cherchez-vous à organiser vos tâches, rendez-vous, documents et objectifs personnels ?"] },
  ],
};

const SHARED_QUESTIONS: Record<string, string[]> = {
  "family-16": ["Votre besoin porte-t-il sur la gestion administrative d'un dossier ou sur un conseil juridique réservé à un professionnel habilité ?", "Dans quel pays ou quelle juridiction la solution sera-t-elle utilisée ?"],
  "family-17": ["Quels utilisateurs, appareils et environnements techniques sont concernés ?", "La solution doit-elle fonctionner hors connexion ou avec des services externes ?"],
  "family-18": ["Quels équipements, installations ou territoires faut-il couvrir ?", "Quelles interventions nécessitent une validation ou une habilitation technique ?"],
  "family-19": ["Quels protocoles d'urgence et responsables humains doivent être prévus ?", "Quelles données de sécurité doivent être restreintes et conservées avec traçabilité ?"],
  "family-20": ["Qui participe et quels rôles ou niveaux d'accès faut-il prévoir ?", "Quelles informations personnelles doivent rester privées et visibles uniquement par les personnes autorisées ?"],
};

function normalize(value: string): string {
  return value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function hasTerm(text: string, term: string): boolean {
  return (" " + normalize(text) + " ").includes(" " + normalize(term) + " ");
}

export function recognizeUnmappedUniversalFamilies(text: string): {
  matches: UniversalFamilyRecognition[];
  candidateFamilyIds: string[];
  candidateSectorIds: string[];
} {
  const normalizedText = normalize(text);
  const matches: UniversalFamilyRecognition[] = [];

  for (const [familyId, rules] of Object.entries(RULES)) {
    if (!MERKORA_UNIVERSAL_FAMILIES.some((family) => family.id === familyId)) continue;
    const sectorMatches = rules.map((rule) => {
      const evidence = rule.terms.filter((term) => hasTerm(normalizedText, term));
      return { rule, evidence };
    }).filter((item) => item.evidence.length > 0);
    const score = sectorMatches.reduce((sum, item) => sum + item.evidence.length, 0);
    if (score < 2) continue;

    matches.push({
      familyId,
      sectorIds: sectorMatches.map((item) => item.rule.sectorId),
      confidence: score >= 4 ? "high" : "medium",
      evidence: sectorMatches.flatMap((item) => item.evidence).slice(0, 8),
      questions: [...sectorMatches.flatMap((item) => item.rule.questions), ...(SHARED_QUESTIONS[familyId] ?? [])].slice(0, 5),
    });
  }

  matches.sort((a, b) => b.evidence.length - a.evidence.length || a.familyId.localeCompare(b.familyId));
  return {
    matches,
    candidateFamilyIds: matches.map((match) => match.familyId),
    candidateSectorIds: [...new Set(matches.flatMap((match) => match.sectorIds))],
  };
}
