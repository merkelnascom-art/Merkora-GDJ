import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {HEALTH_SOCIAL_SERVICES_CATALOG} from "./health-social-services-catalog";
describe("Fondation A — famille 14 Santé et services sociaux",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:health-social-services")).toHaveLength(1);
  for(const id of ["domain:medicine","domain:nursing-midwifery","domain:clinical-diagnostics","domain:pharmacy","domain:social-work"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît les consultations, soins, diagnostics, pharmacie et accompagnement social",()=>{
  const cases=[["consultation médicale","subdomain-health:medical-consultations"],["soins infirmiers hospitaliers","subdomain-health:hospital-nursing"],["analyse de laboratoire","subdomain-health:clinical-laboratory"],["dispensation de médicaments","subdomain-health:medication-dispensing"],["accompagnement social à domicile","subdomain-health:home-social-support"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("ne confond pas aide administrative, diagnostic, prescription et décision clinique",()=>{
  for(const q of ["accueil et orientation d'un patient","réalisation d'un examen diagnostique","prescription médicale par un médecin habilité","planification de soins infirmiers","évaluation des besoins sociaux"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts structurés",()=>{
  expect(HEALTH_SOCIAL_SERVICES_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-health:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
 });
 it("ne crée aucun identifiant ou canonicalKey en double",()=>{const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);});
});
