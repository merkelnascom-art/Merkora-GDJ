import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {PROFESSIONAL_SERVICES_CATALOG} from "./professional-services-catalog";
describe("Fondation A — famille 19 Services professionnels et entreprises",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:business-management")).toHaveLength(1);
  for(const id of ["domain:business-administration","domain:human-resources","domain:consulting","domain:quality-risk-compliance","domain:entrepreneurship"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît conseil, RH, services spécialisés, sécurité et accompagnement d'entreprise",()=>{
  const cases=[["conseil en stratégie d'entreprise","subdomain-pro:business-consulting"],["gestion des ressources humaines","subdomain-pro:human-resources-operations"],["services professionnels spécialisés","subdomain-pro:technical-consulting"],["sécurité et prévention des risques","subdomain-pro:security-risk-services"],["accompagnement à la création d'entreprise","subdomain-pro:business-startup-support"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue conseil, audit, recrutement, prestation et suivi contractuel",()=>{
  for(const q of ["réalisation d'une mission de conseil","conduite d'un audit organisationnel","recrutement d'un salarié","exécution d'une prestation de service","suivi d'un contrat de prestation"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts et aucun doublon",()=>{
  expect(PROFESSIONAL_SERVICES_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-pro:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);
 });
});
