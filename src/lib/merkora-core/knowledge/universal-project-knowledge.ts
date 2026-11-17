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
   links.push({evidenceId:item.id,dimension:item.dimension,query:item.value,evidenceStatus:item.status,conceptId:concept.id,conceptType:concept.conceptType,...(parents.familyId?{familyId:parents.familyId}:{}),...(parents.domainId?{domainId:parents.domainId}:{}),lineage:parents.lineage.map(x=>x.id),confidence:0.9,status,explanation:status==="confirmed"?"Concept confirmé par validation humaine.":"Correspondance lexicale proposée ; le rattachement reste à confirmer par le client ou l'équipe MerKora."});
   matchedByEvidence.set(item.id,concept);
   if(parents.familyId){
    const current=familyEvidence.get(parents.familyId)??{confidence:0,evidenceIds:new Set<string>()};
    current.confidence=Math.max(current.confidence,0.9);current.evidenceIds.add(item.id);familyEvidence.set(parents.familyId,current);
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

export interface FamilyDiagnosticQuestionSeed { id:string; prompt:string; purpose:string; dimension:"context"|"constraints" }
const FAMILY_DIAGNOSTIC_QUESTIONS:Record<string,FamilyDiagnosticQuestionSeed[]>={
 "family:agriculture-agrofood":[
  {id:"production-cycle",dimension:"context",prompt:"Quelles cultures, productions végétales, saisons ou étapes agroalimentaires sont concernées ?",purpose:"Préciser les cycles agricoles, les produits et les périodes d'activité."},
  {id:"agri-constraints",dimension:"constraints",prompt:"Quelles contraintes de terre, eau, climat, intrants, stockage, qualité ou débouchés faut-il prendre en compte ?",purpose:"Repérer les contraintes qui conditionnent les choix agricoles et agroalimentaires."}],
 "family:animals-veterinary":[
  {id:"animal-species",dimension:"context",prompt:"Quelles espèces et catégories d'animaux sont concernées, et dans quel objectif ?",purpose:"Distinguer élevage, animaux de compagnie, santé animale et productions."},
  {id:"animal-care-safety",dimension:"constraints",prompt:"Quels vétérinaires, protocoles sanitaires, installations, autorisations et règles de bien-être animal s'appliquent ?",purpose:"Identifier les validations professionnelles et mesures de biosécurité nécessaires."}],
 "family:environment-natural-resources":[
  {id:"environment-resource",dimension:"context",prompt:"Quelle ressource ou quel milieu est concerné : eau, sol, air, déchets, biodiversité ou climat ?",purpose:"Préciser le milieu et l'impact environnemental étudié."},
  {id:"environment-monitoring",dimension:"constraints",prompt:"Quelles mesures, zones, seuils, autorisations et obligations de suivi existent déjà ?",purpose:"Ancrer le projet dans des mesures et règles environnementales vérifiables."}],
 "family:manufacturing-industry":[
  {id:"industrial-product",dimension:"context",prompt:"Quel produit est fabriqué, avec quelles matières, capacités et étapes de production ?",purpose:"Décrire le système industriel et ses flux de fabrication."},
  {id:"industrial-standards",dimension:"constraints",prompt:"Quelles exigences de qualité, maintenance, sécurité, traçabilité et conformité s'appliquent ?",purpose:"Repérer les contraintes industrielles et de sécurité."}],
 "family:construction-built-environment":[
  {id:"construction-asset",dimension:"context",prompt:"Quel ouvrage ou bâtiment est concerné, et à quelle phase : étude, chantier, réception ou maintenance ?",purpose:"Situer l'ouvrage et le cycle de vie du projet."},
  {id:"construction-compliance",dimension:"constraints",prompt:"Quelles autorisations, normes, responsabilités, lots et règles de sécurité encadrent les travaux ?",purpose:"Éviter de proposer un processus de chantier sans cadre réglementaire et technique."}],
 "family:energy-utilities":[
  {id:"energy-system",dimension:"context",prompt:"Quelle énergie ou quel service essentiel est concerné : production, stockage, réseau ou distribution ?",purpose:"Identifier la chaîne énergétique et les utilisateurs."},
  {id:"energy-safety",dimension:"constraints",prompt:"Quels niveaux de continuité, capacité, sécurité, maintenance et autorisations sont requis ?",purpose:"Préciser les exigences de fiabilité et de sécurité."}],
 "family:mobility-transport":[
  {id:"transport-mode",dimension:"context",prompt:"Quel mode de transport, quels usagers, marchandises, trajets ou territoires sont concernés ?",purpose:"Identifier les flux et le système de mobilité."},
  {id:"transport-rules",dimension:"constraints",prompt:"Quelles licences, règles de circulation, horaires, capacités et exigences de sécurité s'appliquent ?",purpose:"Préciser le cadre opérationnel et réglementaire du transport."}],
 "family:logistics-supply-chain":[
  {id:"logistics-flow",dimension:"context",prompt:"Quelles marchandises, quels stocks, fournisseurs, entrepôts et flux doivent être suivis ?",purpose:"Cartographier la chaîne d'approvisionnement."},
  {id:"logistics-traceability",dimension:"constraints",prompt:"Quelles exigences de traçabilité, délais, conservation, douane et preuve de livraison existent ?",purpose:"Identifier les contraintes de flux et de conformité."}],
 "family:commerce-markets":[
  {id:"commerce-offer",dimension:"context",prompt:"Quels produits ou services sont vendus, à quels clients et par quels canaux ?",purpose:"Préciser l'offre, la clientèle et les circuits de vente."},
  {id:"commerce-transaction",dimension:"constraints",prompt:"Comment sont gérés prix, commandes, paiements, livraison, retours et garanties ?",purpose:"Décrire les règles de transaction et de service client."}],
 "family:finance-insurance":[
  {id:"finance-product",dimension:"context",prompt:"Quel service est concerné : paiement, compte, crédit, épargne, assurance, investissement ou comptabilité ?",purpose:"Identifier la nature exacte du service financier."},
  {id:"finance-compliance",dimension:"constraints",prompt:"Quelles obligations d'identification, de conformité, de confidentialité et de contrôle s'appliquent ?",purpose:"Faire ressortir les exigences réglementaires et de protection des données."}],
 "family:public-governance":[
  {id:"public-authority",dimension:"context",prompt:"Quel organisme, niveau de gouvernement, territoire et service public sont concernés ?",purpose:"Identifier la compétence administrative et le périmètre institutionnel."},
  {id:"public-decision",dimension:"constraints",prompt:"Qui est habilité à instruire, contrôler, décider, signer et notifier les actes ?",purpose:"Respecter les compétences, délégations et validations humaines."}],
 "family:legal-services":[
  {id:"legal-jurisdiction",dimension:"context",prompt:"Quel pays, quelle juridiction, quelle matière et quel type de dossier ou d'acte sont concernés ?",purpose:"Éviter toute règle juridique décontextualisée."},
  {id:"legal-authority",dimension:"constraints",prompt:"Quels professionnels sont habilités et quelles validations, signatures ou voies de recours sont requises ?",purpose:"Respecter les réserves professionnelles et les pouvoirs légaux."}],
 "family:education-research":[
  {id:"education-learners",dimension:"context",prompt:"Quels apprenants, niveaux, disciplines, parcours ou équipes de recherche sont concernés ?",purpose:"Situer le projet dans le parcours éducatif ou scientifique."},
  {id:"education-assessment",dimension:"constraints",prompt:"Quelles compétences, méthodes d'évaluation, exigences d'accréditation ou règles éthiques s'appliquent ?",purpose:"Préciser les critères pédagogiques et scientifiques."}],
 "family:health-social-services":[
  {id:"health-population",dimension:"context",prompt:"Quel service de santé ou d'accompagnement social est concerné, et pour quelle population ?",purpose:"Distinguer soin, prévention, accompagnement et orientation sociale."},
  {id:"health-professionals",dimension:"constraints",prompt:"Quels professionnels habilités, consentements, protocoles et niveaux de confidentialité sont nécessaires ?",purpose:"Protéger les personnes et respecter les responsabilités professionnelles."}],
 "family:sport-physical-activity":[
  {id:"sport-discipline",dimension:"context",prompt:"Quelle discipline, quel niveau, quelles catégories d'âge et quelles personnes pratiquent ou encadrent ?",purpose:"Préciser la pratique, le niveau et les participants."},
  {id:"sport-safeguarding",dimension:"constraints",prompt:"Quelles règles de sécurité, licences, assurances, protection des mineurs et validations médicales sont requises ?",purpose:"Intégrer la sécurité et la protection des sportifs."}],
 "family:culture-arts":[
  {id:"culture-medium",dimension:"context",prompt:"Quelle discipline artistique, œuvre, collection, institution ou manifestation culturelle est concernée ?",purpose:"Distinguer création, production, diffusion, médiation et patrimoine."},
  {id:"culture-rights",dimension:"constraints",prompt:"Quels droits d'auteur, droits à l'image, contrats, prêts, provenance et autorisations de diffusion sont nécessaires ?",purpose:"Prévenir toute utilisation non autorisée d'œuvres ou de collections."}],
 "family:media-communication":[
  {id:"media-format",dimension:"context",prompt:"Quel contenu, format, canal, public et objectif de communication sont concernés ?",purpose:"Distinguer information, communication institutionnelle, publicité et contenu éditorial."},
  {id:"media-verification",dimension:"constraints",prompt:"Quelles sources, preuves, droits, consentements et validations éditoriales doivent être vérifiés ?",purpose:"Préserver la fiabilité de l'information et les droits des personnes."}],
 "family:digital-technology":[
  {id:"digital-system",dimension:"context",prompt:"Quel logiciel, service numérique, réseau, infrastructure, jeu de données ou système IA est concerné ?",purpose:"Identifier les composants techniques et les utilisateurs."},
  {id:"digital-security",dimension:"constraints",prompt:"Quelles exigences d'accès, sécurité, disponibilité, localisation, coûts et réversibilité s'appliquent ?",purpose:"Faire ressortir les exigences d'exploitation et de sécurité."}],
 "family:business-management":[
  {id:"business-service",dimension:"context",prompt:"Quel service professionnel est vendu ou rendu, à quel client et avec quels livrables ?",purpose:"Préciser la mission, la prestation et la relation contractuelle."},
  {id:"business-qualification",dimension:"constraints",prompt:"Quelles qualifications, assurances, règles RH, normes qualité et obligations contractuelles s'appliquent ?",purpose:"Vérifier les limites professionnelles et les engagements de service."}],
 "family:crafts-personal-services":[
  {id:"craft-object-service",dimension:"context",prompt:"Quel objet, équipement ou service personnel est fabriqué, entretenu, réparé ou réalisé ?",purpose:"Préciser le besoin matériel ou la prestation attendue."},
  {id:"craft-intervention",dimension:"constraints",prompt:"L'intervention se fait-elle en atelier, salon ou domicile, et quelles règles d'hygiène, sécurité, garantie et consentement s'appliquent ?",purpose:"Encadrer les interventions, les personnes et les biens concernés."}]
};
export function getFamilyDiagnosticQuestionSeeds(familyId?:string):FamilyDiagnosticQuestionSeed[]{
 return familyId?FAMILY_DIAGNOSTIC_QUESTIONS[familyId]??[]:[];
}
