import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

export type FamilyDomainSeed={id:string;fr:string;en:string;create?:boolean};
export type FamilyConceptSeed={id:string;type:string;fr:string;en:string;parentId:string;aliases:string[]};
export interface FamilyCatalogInput{
 familyId:string; familyFr:string; familyEn:string; sourceId:string; familyNumber:number;
 domains:FamilyDomainSeed[]; seeds:FamilyConceptSeed[]; safetyNotes:string[];
}
export interface FamilyCatalogOutput{
 familyConcepts:KnowledgeConcept[]; catalog:KnowledgeConcept[]; relationships:KnowledgeRelationship[];
}
const CREATED_AT="2026-11-17T00:00:00.000Z";
export function createFamilyCatalog(input:FamilyCatalogInput, relationSeeds:Array<[string,string,string]>):FamilyCatalogOutput{
 const source={id:input.sourceId,sourceType:"curated_domain_knowledge",label:`MerKora GDJ — Famille ${input.familyNumber} ${input.familyFr}, version 1`};
 const reliability={evidenceLevel:"documented" as const,reviewStatus:"not_reviewed" as const,verificationNotes:input.safetyNotes};
 const base=(id:string,key:string,type:string,fr:string,en:string,frDef:string,enDef:string,parentId?:string):KnowledgeConcept=>({
  id,canonicalKey:key,conceptType:type,
  definitions:[{language:"fr",label:fr,definition:frDef},{language:"en",label:en,definition:enDef}],
  terms:[{value:fr,language:"fr",kind:"preferred"},{value:en,language:"en",kind:"preferred"}],
  classifications:parentId?[{classificationType:"universal-domain",parentConceptId:parentId}]:[],
  attributes:[],relationships:[],scope:{global:true},
  lifecycle:{status:"validated",version:1,createdAt:CREATED_AT,updatedAt:CREATED_AT},
  sources:[source],reliability
 });
 const family=base(input.familyId,`merkora.family.${input.familyId.replace("family:","")}`,"domain_family",input.familyFr,input.familyEn,`Famille couvrant ${input.familyFr.toLocaleLowerCase("fr")}.`,`Family covering ${input.familyEn.toLocaleLowerCase("en")}.`);
 const domains=input.domains.filter(d=>d.create!==false).map(d=>{
  const item=base(d.id,`merkora.domain.${d.id.replace("domain:","")}`,"domain",d.fr,d.en,`Domaine couvrant les acteurs, pratiques, organisations et opérations liés à ${d.fr.toLocaleLowerCase("fr")}.`,`Field covering actors, practices, organizations and operations related to ${d.en.toLocaleLowerCase("en")}.`,input.familyId);
  item.classifications=[{classificationType:"universal-domain",parentConceptId:input.familyId},{classificationType:"universal-domain-family",parentConceptId:input.familyId}];
  item.relationships=[{id:`rel:domain-family:${d.id.replace("domain:","")}`,sourceConceptId:d.id,targetConceptId:input.familyId,predicate:"belongs_to_family",status:"validated",confidence:1,sourceIds:[input.sourceId],version:1}];
  return item;
 });
 const catalog=input.seeds.map(seed=>{
  const typeDescription:Record<string,[string,string]>={
   subdomain:[`${seed.fr} regroupe les pratiques, acteurs, ressources et opérations propres à ce champ.`,`${seed.en} groups the practices, actors, resources and operations in this field.`],
   specialization:[`${seed.fr} constitue une spécialisation du domaine parent, sans remplacer les autres parcours.`,`${seed.en} is a specialization of its parent field without replacing other pathways.`],
   occupation:[`${seed.fr} désigne un métier ou rôle humain ; il ne se confond pas avec une fonctionnalité numérique.`,`${seed.en} describes a human occupation or role; it is not a digital feature.`],
   activity:[`${seed.fr} désigne une activité observable à distinguer d'un objectif, d'un processus et d'un outil.`,`${seed.en} is an observable activity distinct from a goal, process or tool.`],
   process:[`${seed.fr} décrit un enchaînement d'étapes avec acteurs, entrées, décisions et résultats.`,`${seed.en} describes a sequence of steps with actors, inputs, decisions and outcomes.`],
   problem:[`${seed.fr} décrit une difficulté à confirmer par des faits, causes et impacts documentés.`,`${seed.en} describes a difficulty to validate using documented facts, causes and impacts.`],
   resource:[`${seed.fr} désigne une ressource mobilisable, avec propriétaire, accès et cycle de vie.`,`${seed.en} is a usable resource with an owner, access rules and lifecycle.`],
   function:[`${seed.fr} décrit une capacité possible d'un système numérique, à valider selon le besoin réel.`,`${seed.en} describes a possible digital system capability to validate against the real need.`],
   indicator:[`${seed.fr} mesure un résultat ; sa formule, sa source, sa période et ses limites doivent être définies.`,`${seed.en} measures an outcome; its formula, source, period and limitations must be defined.`]
  };
  const [frDef,enDef]=typeDescription[seed.type]??typeDescription.subdomain;
  const item=base(seed.id,`merkora.${input.familyId.replace("family:","")}.${seed.type}.${seed.id.replace(/^[^:]+:/,"")}`,seed.type,seed.fr,seed.en,frDef,enDef,seed.parentId);
  item.terms=[{value:seed.fr,language:"fr",kind:"preferred"},{value:seed.en,language:"en",kind:"preferred"},...seed.aliases.map(value=>({value,language:"fr",kind:"synonym" as const}))];
  return item;
 });
 const relationships=relationSeeds.map(([sourceConceptId,targetConceptId,predicate],i)=>({id:`rel:family-${input.familyNumber}-${i+1}`,sourceConceptId,targetConceptId,predicate,status:"validated" as const,confidence:0.9,sourceIds:[input.sourceId],version:1}));
 return {familyConcepts:[family,...domains],catalog,relationships};
}
