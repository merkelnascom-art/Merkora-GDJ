import type { KnowledgeConcept } from "./types";

const CREATED_AT = "2026-11-15T00:00:00.000Z";

type CoreConceptSeed = {
  id: string;
  key: string;
  type: string;
  fr: string;
  en: string;
  frDefinition: string;
  enDefinition: string;
};

const CORE_CONCEPT_SEEDS: CoreConceptSeed[] = [
  { id: "core:actor", key: "universal-type:actor", type: "actor", fr: "Acteur", en: "Actor", frDefinition: "Personne, groupe ou entité qui intervient dans une situation ou une activité.", enDefinition: "A person, group, or entity participating in a situation or activity." },
  { id: "core:organization", key: "universal-type:organization", type: "organization", fr: "Organisation", en: "Organization", frDefinition: "Structure organisée composée de personnes, de ressources ou d'unités poursuivant une finalité.", enDefinition: "An organized structure of people, resources, or units pursuing a purpose." },
  { id: "core:activity", key: "universal-type:activity", type: "activity", fr: "Activité", en: "Activity", frDefinition: "Ensemble d'actions ou de pratiques réalisées par un ou plusieurs acteurs.", enDefinition: "A set of actions or practices carried out by one or more actors." },
  { id: "core:process", key: "universal-type:process", type: "process", fr: "Processus", en: "Process", frDefinition: "Enchaînement organisé d'étapes ou d'opérations conduisant à un résultat.", enDefinition: "An organized sequence of steps or operations leading to an outcome." },
  { id: "core:operation", key: "universal-type:operation", type: "operation", fr: "Opération", en: "Operation", frDefinition: "Action ou unité de travail réalisée dans une activité ou un processus.", enDefinition: "An action or unit of work performed within an activity or process." },
  { id: "core:event", key: "universal-type:event", type: "event", fr: "Événement", en: "Event", frDefinition: "Fait ou occurrence qui se produit à un moment donné.", enDefinition: "An occurrence that takes place at a particular time." },
  { id: "core:object", key: "universal-type:object", type: "object", fr: "Objet", en: "Object", frDefinition: "Élément matériel ou numérique pouvant être utilisé, transformé ou observé.", enDefinition: "A physical or digital item that can be used, transformed, or observed." },
  { id: "core:resource", key: "universal-type:resource", type: "resource", fr: "Ressource", en: "Resource", frDefinition: "Moyen humain, matériel, financier, informationnel ou technique mobilisable.", enDefinition: "A human, material, financial, informational, or technical means that can be used." },
  { id: "core:goal", key: "universal-type:goal", type: "goal", fr: "Objectif", en: "Goal", frDefinition: "État ou résultat qu'un acteur cherche à atteindre.", enDefinition: "A state or outcome an actor seeks to achieve." },
  { id: "core:problem", key: "universal-type:problem", type: "problem", fr: "Problème", en: "Problem", frDefinition: "Difficulté, écart ou situation jugée indésirable dans un contexte donné.", enDefinition: "A difficulty, gap, or undesirable situation within a given context." },
  { id: "core:outcome", key: "universal-type:outcome", type: "outcome", fr: "Résultat", en: "Outcome", frDefinition: "Effet ou état produit par une action, une activité ou un processus.", enDefinition: "An effect or state produced by an action, activity, or process." },
  { id: "core:constraint", key: "universal-type:constraint", type: "constraint", fr: "Contrainte", en: "Constraint", frDefinition: "Limite, condition ou exigence qui restreint les possibilités d'action.", enDefinition: "A limit, condition, or requirement that restricts possible actions." },
  { id: "core:place", key: "universal-type:place", type: "place", fr: "Lieu", en: "Place", frDefinition: "Espace ou emplacement géographique ou fonctionnel associé à une situation.", enDefinition: "A geographic or functional location associated with a situation." },
  { id: "core:time", key: "universal-type:time", type: "time", fr: "Temps", en: "Time", frDefinition: "Repère temporel, période, durée ou calendrier associé à un fait.", enDefinition: "A time reference, period, duration, or schedule associated with an occurrence." },
  { id: "core:information", key: "universal-type:information", type: "information", fr: "Information", en: "Information", frDefinition: "Contenu porteur de sens utilisé, communiqué ou interprété.", enDefinition: "Meaningful content that is used, communicated, or interpreted." },
  { id: "core:rule", key: "universal-type:rule", type: "rule", fr: "Règle", en: "Rule", frDefinition: "Principe, consigne ou obligation qui encadre un comportement ou une opération.", enDefinition: "A principle, instruction, or obligation governing behavior or an operation." },
  { id: "core:solution", key: "universal-type:solution", type: "solution", fr: "Solution", en: "Solution", frDefinition: "Réponse ou ensemble de moyens envisagés pour atteindre un objectif ou traiter une situation.", enDefinition: "A response or set of means intended to achieve a goal or address a situation." },
  { id: "core:service", key: "universal-type:service", type: "service", fr: "Service", en: "Service", frDefinition: "Prestation ou capacité mise à disposition d'un bénéficiaire.", enDefinition: "A provision or capability made available to a recipient." },
  { id: "core:product", key: "universal-type:product", type: "product", fr: "Produit", en: "Product", frDefinition: "Bien, artefact ou résultat conçu pour être utilisé ou fourni.", enDefinition: "A good, artifact, or result designed to be used or supplied." },
  { id: "core:project", key: "universal-type:project", type: "project", fr: "Projet", en: "Project", frDefinition: "Démarche organisée visant un résultat, une exploration ou une transformation.", enDefinition: "An organized undertaking aimed at an outcome, exploration, or transformation." },
  { id: "core:concept", key: "universal-type:concept", type: "concept", fr: "Concept", en: "Concept", frDefinition: "Unité de sens abstraite permettant de représenter une idée ou une catégorie.", enDefinition: "An abstract unit of meaning used to represent an idea or category." },
];

export const CORE_KNOWLEDGE_CONCEPTS: KnowledgeConcept[] = CORE_CONCEPT_SEEDS.map((seed) => ({
  id: seed.id,
  canonicalKey: seed.key,
  conceptType: seed.type,
  definitions: [
    { language: "fr", label: seed.fr, definition: seed.frDefinition },
    { language: "en", label: seed.en, definition: seed.enDefinition },
  ],
  terms: [
    { value: seed.fr, language: "fr", kind: "preferred" },
    { value: seed.en, language: "en", kind: "preferred" },
  ],
  classifications: [],
  attributes: [],
  relationships: [],
  scope: { global: true },
  lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
  sources: [{ id: "source:merkora-core-ontology", sourceType: "internal_foundation", label: "Noyau de représentation universelle MerKora" }],
  reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
}));
