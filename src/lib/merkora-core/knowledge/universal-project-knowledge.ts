import { getClassificationLineage } from "./classification-graph";
import { matchKnowledgeConcept } from "./matching";
import { createUniversalKnowledgeRegistry } from "./registry";
import type { KnowledgeConcept, KnowledgeRegistry, KnowledgeRelationship } from "./types";

export interface ProjectKnowledgeEvidence {
  id:string;
  dimension:string;
  value:string;
  status:"user_stated"|"observed"|"inferred"|"hypothesis"|"unknown"|"validated"|"rejected"|string;
  sourceQuote?:string;
}
export type ProjectKnowledgeLinkStatus="confirmed"|"suggested"|"ambiguous"|"unmatched";
export interface ProjectKnowledgeLink {
  evidenceId:string;
  dimension:string;
  query:string;
  evidenceStatus:string;
  conceptId?:string;
  conceptType?:string;
  familyId?:string;
  domainId?:string;
  lineage:string[];
  confidence:number;
  matchMethod?:"exact"|"normalized"|"synonym";
  status:ProjectKnowledgeLinkStatus;
  candidateConceptIds?:string[];
  explanation:string;
}
export interface ProjectKnowledgeCandidate {
  conceptId:string;
  labelFr:string;
  labelEn:string;
  familyId?:string;
  domainId?:string;
  confidence:number;
  status:"suggested"|"confirmed";
  humanValidationRequired:boolean;
  evidenceIds:string[];
  relationshipIds:string[];
  explanation:string;
}
export interface ProjectKnowledgeMap {
  version:1;
  familyCandidates:Array<{familyId:string;labelFr:string;labelEn:string;confidence:number;evidenceCount:number}>;
  primaryFamilyId?:string;
  needsFamilyClarification:boolean;
  links:ProjectKnowledgeLink[];
  solutionCandidates:ProjectKnowledgeCandidate[];
  processCandidates:ProjectKnowledgeCandidate[];
  resourceCandidates:ProjectKnowledgeCandidate[];
  indicatorCandidates:ProjectKnowledgeCandidate[];
  unresolved:Array<{evidenceId:string;dimension:string;value:string;status:"unknown"|"unmatched"|"ambiguous";candidateConceptIds?:string[]}>;
  automaticDecisions:never[];
  registryVersion:number;
}

const DEFAULT_REGISTRY=createUniversalKnowledgeRegistry();
const TYPES_BY_DIMENSION:Record<string,string[]>={
 activity:["activity","subdomain","domain","specialization"],
 problem:["problem"],
 causes:["problem","risk","process"],
 objectives:["indicator","goal","objective"],
 expected_outcome:["indicator","goal","objective"],
 actors:["occupation","organization","role"],
 operations:["activity","process","function"],
 resources:["resource","equipment","document","data"],
 constraints:["risk","constraint","rule"],
 imagined_solution:["function","solution","product"],
 success_criteria:["indicator"],
 context:["domain","subdomain","specialization"],
 current_situation:["activity","process","problem","subdomain"],
 impact:["problem","indicator"],
 motivation:["problem","goal","objective"],
 information:["resource","document","data"],
 jurisdiction:["jurisdiction"],
 project_identity:[],
 other:["subdomain","activity","process","problem","function"]
};
const label=(concept:KnowledgeConcept,language:"fr"|"en")=>concept.definitions.find(x=>x.language===language)?.label??concept.definitions[0]?.label??concept.id;
function lineageFor(registry:KnowledgeRegistry,conceptId:string):KnowledgeConcept[]{
 const universal=getClassificationLineage(registry,conceptId,"universal-domain");
 if(universal.length>1)return universal;
 const legacy=getClassificationLineage(registry,conceptId,"foundation-a-family-v2");
 return legacy.length>1?legacy:universal;
}
function getParents(registry:KnowledgeRegistry,concept:KnowledgeConcept){
 const lineage=lineageFor(registry,concept.id);
 const family=lineage.find(x=>x.conceptType==="domain_family");
 const domain=[...lineage].reverse().find(x=>x.conceptType==="domain");
 return {lineage,familyId:family?.id,domainId:domain?.id};
}
function matchesForEvidence(item:ProjectKnowledgeEvidence,registry:KnowledgeRegistry){
 const types=TYPES_BY_DIMENSION[item.dimension]??TYPES_BY_DIMENSION.other;
 const found:KnowledgeConcept[]=[];
 const ambiguous:string[]=[];
 for(const type of types){
  const result=matchKnowledgeConcept(item.value,registry,{expectedType:type});
  if(result.status==="matched")found.push(result.concept);
  else if(result.status==="ambiguous")ambiguous.push(...result.candidates.map(x=>x.id));
 }
 const unique=[...new Map(found.map(x=>[x.id,x])).values()];
 if(unique.length===1)return {concept:unique[0],ambiguous:[] as string[]};
 if(unique.length>1)return {ambiguous:unique.map(x=>x.id),concept:undefined};
 if(ambiguous.length)return {ambiguous:[...new Set(ambiguous)],concept:undefined};
 return {ambiguous:[] as string[],concept:undefined};
}
function relationshipsOf(registry:KnowledgeRegistry):KnowledgeRelationship[]{
 return registry.relationships;
}
function makeCandidate(registry:KnowledgeRegistry,concept:KnowledgeConcept,evidenceIds:string[],relationshipIds:string[],explanation:string,confidence=0.9):ProjectKnowledgeCandidate{
 const parents=getParents(registry,concept);
 return {
  conceptId:concept.id,labelFr:label(concept,"fr"),labelEn:label(concept,"en"),
  ...(parents.familyId?{familyId:parents.familyId}:{}),...(parents.domainId?{domainId:parents.domainId}:{}),
  confidence,status:"suggested",humanValidationRequired:true,evidenceIds,relationshipIds,explanation
 };
}
export function buildProjectKnowledgeMap(
 evidence:readonly ProjectKnowledgeEvidence[],
 _situationGraph?:unknown,
 registry:KnowledgeRegistry=DEFAULT_REGISTRY,
):ProjectKnowledgeMap{
 const links:ProjectKnowledgeLink[]=[];
 const unresolved:ProjectKnowledgeMap["unresolved"]=[];
 const familyEvidence=new Map<string,{confidence:number;evidenceIds:Set<string>}>();
 const matchedByEvidence=new Map<string,KnowledgeConcept>();
 for(const item of evidence){
  if(item.status==="rejected")continue;
  if(item.status==="unknown"||!item.value.trim()){
   links.push({evidenceId:item.id,dimension:item.dimension,query:item.value,evidenceStatus:item.status,status:"unmatched",lineage:[],confidence:0,explanation:"Information inconnue ou non fournie : aucune classification n'est inventée."});
   unresolved.push({evidenceId:item.id,dimension:item.dimension,value:item.value,status:"unknown"});
   continue;
  }
  const result=matchesForEvidence(item,registry);
  if(result.concept){
   const concept=result.concept,parents=getParents(registry,concept);
   const status:ProjectKnowledgeLinkStatus=item.status==="validated"?"confirmed":"suggested";
   links.push({evidenceId:item.id,dimension:item.dimension,query:item.value,evidenceStatus:item.status,conceptId:concept.id,conceptType:concept.conceptType,...(parents.familyId?{familyId:parents.familyId}:{}),...(parents.domainId?{domainId:parents.domainId}:{}),lineage:parents.lineage.map(x=>x.id),confidence:0.94,matchMethod:"synonym",status,explanation:status==="confirmed"?"Concept confirmé par validation humaine.":"Correspondance lexicale proposée ; le rattachement reste à confirmer par le client ou l'équipe MerKora."});
   matchedByEvidence.set(item.id,concept);
   if(parents.familyId){
    const current=familyEvidence.get(parents.familyId)??{confidence:0,evidenceIds:new Set<string>()};
    current.confidence=Math.max(current.confidence,0.94);current.evidenceIds.add(item.id);familyEvidence.set(parents.familyId,current);
   }
  }else if(result.ambiguous.length){
   links.push({evidenceId:item.id,dimension:item.dimension,query:item.value,evidenceStatus:item.status,status:"ambiguous",lineage:[],confidence:0,candidateConceptIds:result.ambiguous,explanation:"Plusieurs concepts lexicaux correspondent ; MerKora demande une clarification plutôt que de choisir arbitrairement."});
   unresolved.push({evidenceId:item.id,dimension:item.dimension,value:item.value,status:"ambiguous",candidateConceptIds:result.ambiguous});
  }else{
   links.push({evidenceId:item.id,dimension:item.dimension,query:item.value,evidenceStatus:item.status,status:"unmatched",lineage:[],confidence:0,explanation:"Aucun terme canonique exact n'a été trouvé. Le vocabulaire du client est conservé sans être forcé dans une catégorie."});
   unresolved.push({evidenceId:item.id,dimension:item.dimension,value:item.value,status:"unmatched"});
  }
 }
 const familyCandidates=[...familyEvidence.entries()].map(([familyId,data])=>{
  const family=registry.concepts.find(x=>x.id===familyId)!;
  return {familyId,labelFr:label(family,"fr"),labelEn:label(family,"en"),confidence:data.confidence,evidenceCount:data.evidenceIds.size};
 }).sort((a,b)=>b.evidenceCount-a.evidenceCount||b.confidence-a.confidence||a.familyId.localeCompare(b.familyId));
 const top=familyCandidates[0],second=familyCandidates[1];
 const needsFamilyClarification=Boolean(top&&second&&top.evidenceCount===second.evidenceCount&&Math.abs(top.confidence-second.confidence)<0.05);
 const primaryFamilyId=top&&!needsFamilyClarification?top.familyId:undefined;
 const relations=relationshipsOf(registry);
 const solutionMap=new Map<string,ProjectKnowledgeCandidate>();
 const processMap=new Map<string,ProjectKnowledgeCandidate>();
 const resourceMap=new Map<string,ProjectKnowledgeCandidate>();
 const indicatorMap=new Map<string,ProjectKnowledgeCandidate>();
 for(const [evidenceId,concept] of matchedByEvidence){
  const item=evidence.find(x=>x.id===evidenceId);
  if(!item)continue;
  if(concept.conceptType==="problem"){
   for(const rel of relations.filter(r=>r.sourceConceptId===concept.id&&["may_be_mitigated_by","may_be_addressed_by","supports"].includes(r.predicate))){
    const target=registry.concepts.find(x=>x.id===rel.targetConceptId);
    if(target&&["function","solution","product"].includes(target.conceptType))solutionMap.set(target.id,makeCandidate(registry,target,[evidenceId],[rel.id],"Fonction reliée explicitement à ce problème dans le référentiel ; proposition à valider.",rel.confidence));
   }
  }
  for(const rel of relations.filter(r=>r.sourceConceptId===concept.id||r.targetConceptId===concept.id)){
   const otherId=rel.sourceConceptId===concept.id?rel.targetConceptId:rel.sourceConceptId;
   const other=registry.concepts.find(x=>x.id===otherId);
   if(!other)continue;
   const candidate=makeCandidate(registry,other,[evidenceId],[rel.id],"Élément relié par une relation métier typée ; vérifier le contexte et le sens de la relation.",rel.confidence);
   if(other.conceptType==="process")processMap.set(other.id,candidate);
   if(other.conceptType==="resource")resourceMap.set(other.id,candidate);
   if(other.conceptType==="indicator")indicatorMap.set(other.id,candidate);
   if(other.conceptType==="function"&&["supports","may_be_mitigated_by","may_be_addressed_by"].includes(rel.predicate))solutionMap.set(other.id,candidate);
  }
 }
 if(primaryFamilyId){
  const domainIds=new Set(links.filter(x=>x.familyId===primaryFamilyId&&x.domainId).map(x=>x.domainId));
  const familyIndicators=registry.concepts.filter(x=>x.conceptType==="indicator"&&getParents(registry,x).familyId===primaryFamilyId);
  for(const indicator of familyIndicators.slice(0,3)){
   if(!indicatorMap.has(indicator.id))indicatorMap.set(indicator.id,makeCandidate(registry,indicator,[...familyEvidence.get(primaryFamilyId)!.evidenceIds],[],"Indicateur du même domaine proposé pour le suivi ; sa formule, sa source et sa cible doivent être définies avec le client."));
  }
 }
 return {
  version:1,familyCandidates, ...(primaryFamilyId?{primaryFamilyId}:{}),needsFamilyClarification,links,
  solutionCandidates:[...solutionMap.values()],processCandidates:[...processMap.values()],resourceCandidates:[...resourceMap.values()],indicatorCandidates:[...indicatorMap.values()],
  unresolved,automaticDecisions:[],registryVersion:registry.version
 };
}
