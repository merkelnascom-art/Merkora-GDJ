import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./knowledge/registry";
import {UNIVERSAL_FAMILY_CONCEPTS,UNIVERSAL_DOMAIN_CONCEPTS,UNIVERSAL_DOMAIN_FAMILY_COUNT,UNIVERSAL_DOMAIN_COUNT} from "./knowledge/universal-domain-catalog";
import {getClassificationLineage} from "./knowledge/classification-graph";
import {buildProjectKnowledgeMap} from "./knowledge/universal-project-knowledge";

const EXPECTED_FAMILIES=[
 "family:agriculture-agrofood","family:animals-veterinary","family:environment-natural-resources","family:manufacturing-industry","family:construction-built-environment",
 "family:energy-utilities","family:mobility-transport","family:logistics-supply-chain","family:commerce-markets","family:finance-insurance",
 "family:public-governance","family:legal-services","family:education-research","family:health-social-services","family:sport-physical-activity",
 "family:culture-arts","family:media-communication","family:digital-technology","family:business-management","family:crafts-personal-services"
];

describe("Fondation A — raccordement universel des 20 familles",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("expose exactement vingt familles canoniques et cent domaines, cinq par famille",()=>{
  expect(UNIVERSAL_DOMAIN_FAMILY_COUNT).toBe(20);
  expect(UNIVERSAL_FAMILY_CONCEPTS).toHaveLength(20);
  expect(UNIVERSAL_DOMAIN_COUNT).toBe(100);
  expect(UNIVERSAL_DOMAIN_CONCEPTS).toHaveLength(100);
  expect(UNIVERSAL_FAMILY_CONCEPTS.map(x=>x.id).sort()).toEqual([...EXPECTED_FAMILIES].sort());
  for(const familyId of EXPECTED_FAMILIES){
   expect(UNIVERSAL_DOMAIN_CONCEPTS.filter(domain=>domain.classifications.some(c=>c.classificationType==="universal-domain"&&c.parentConceptId===familyId)),familyId).toHaveLength(5);
  }
 });
 it("raccorde les familles anciennes et nouvelles à leur véritable filiation canonique",()=>{
  const examples=[
   ["subdomain-v2:field-crops","family:agriculture-agrofood"],
   ["subdomain-vet:cattle-farming","family:animals-veterinary"],
   ["subdomain-env:water-resource-management","family:environment-natural-resources"],
   ["subdomain-industry:industrial-maintenance","family:manufacturing-industry"],
   ["subdomain-gov:public-service-delivery","family:public-governance"],
   ["subdomain-law:corporate-law","family:legal-services"],
   ["subdomain-edu:scientific-research","family:education-research"],
   ["subdomain-health:medical-consultations","family:health-social-services"],
   ["subdomain-sport:team-ball-sports","family:sport-physical-activity"],
   ["subdomain-culture:dance-training","family:culture-arts"],
   ["subdomain-media:press-reporting","family:media-communication"],
   ["subdomain-digital:cloud-infrastructure","family:digital-technology"],
   ["subdomain-pro:business-consulting","family:business-management"],
   ["subdomain-craft:artisanal-production","family:crafts-personal-services"],
  ] as const;
  for(const [conceptId,familyId] of examples){
   const path=getClassificationLineage(registry,conceptId,"universal-domain");
   expect(path[0]?.id,conceptId).toBe(familyId);
   expect(path.at(-1)?.id,conceptId).toBe(conceptId);
  }
 });
 it("ne contient aucun identifiant ni canonicalKey dupliqué",()=>{
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);
  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(keys).size).toBe(keys.length);
 });
 it("relie problème, besoin, activité, ressources, fonctions et solutions candidates sans décider à la place du client",()=>{
  const items=[
   {id:"e1",dimension:"activity",originalDimension:"activity",value:"réservation et gestion des rendez-vous clients",status:"user_stated",source:"conversation",sourceQuote:"réservation et gestion des rendez-vous clients",createdAt:"2026-11-17T00:00:00.000Z"},
   {id:"e2",dimension:"problem",originalDimension:"problem",value:"rendez-vous et réservations mal coordonnés",status:"user_stated",source:"conversation",sourceQuote:"rendez-vous et réservations mal coordonnés",createdAt:"2026-11-17T00:00:00.000Z"},
   {id:"e3",dimension:"objectives",originalDimension:"goal",value:"améliorer la coordination des rendez-vous",status:"user_stated",source:"conversation",sourceQuote:"améliorer la coordination des rendez-vous",createdAt:"2026-11-17T00:00:00.000Z"},
   {id:"e4",dimension:"resources",originalDimension:"resource",value:"calendrier des rendez-vous et intervenants",status:"user_stated",source:"conversation",sourceQuote:"calendrier des rendez-vous et intervenants",createdAt:"2026-11-17T00:00:00.000Z"},
  ];
  const map=buildProjectKnowledgeMap(items,undefined,registry);
  expect(map.familyCandidates.some(x=>x.familyId==="family:crafts-personal-services")).toBe(true);
  expect(map.links.some(x=>x.conceptId==="problem-craft:service-booking-gaps")).toBe(true);
  expect(map.solutionCandidates.some(x=>x.conceptId==="function-craft:customer-booking")).toBe(true);
  expect(map.solutionCandidates.every(x=>x.status==="suggested")).toBe(true);
  expect(map.indicatorCandidates.length).toBeGreaterThan(0);
 });
 it("conserve les hypothèses et inconnues comme telles et ne publie pas de décision automatique",()=>{
  const map=buildProjectKnowledgeMap([
   {id:"h1",dimension:"problem",originalDimension:"problem",value:"peut-être un manque de personnel",status:"hypothesis",source:"conversation",sourceQuote:"peut-être un manque de personnel",createdAt:"2026-11-17T00:00:00.000Z"},
   {id:"u1",dimension:"activity",originalDimension:"activity",value:"je ne sais pas encore",status:"unknown",source:"conversation",sourceQuote:"je ne sais pas encore",createdAt:"2026-11-17T00:00:00.000Z"}
  ],undefined,registry);
  expect(map.links.some(x=>x.evidenceStatus==="hypothesis")).toBe(true);
  expect(map.links.some(x=>x.evidenceStatus==="unknown")).toBe(true);
  expect(map.automaticDecisions).toHaveLength(0);
 });
});
