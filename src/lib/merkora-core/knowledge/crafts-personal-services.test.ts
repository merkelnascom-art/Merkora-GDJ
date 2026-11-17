import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {CRAFTS_PERSONAL_SERVICES_CATALOG} from "./crafts-personal-services-catalog";
describe("Fondation A — famille 20 Artisanat et services personnels",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise le domaine artisanat et ajoute les quatre domaines personnels",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:crafts-personal-services")).toHaveLength(1);
  for(const id of ["domain:crafts","domain:beauty-personal-care","domain:repair-maintenance","domain:domestic-services","domain:local-personal-services"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît artisanat, beauté, réparation, services domestiques et proximité",()=>{
  const cases=[["fabrication artisanale sur mesure","subdomain-craft:artisanal-production"],["soins esthétiques et beauté","subdomain-craft:beauty-services"],["réparation et maintenance d'équipements","subdomain-craft:equipment-repair"],["entretien ménager à domicile","subdomain-craft:home-cleaning"],["services de proximité aux particuliers","subdomain-craft:local-personal-services"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue fabrication, entretien, réparation, prestation personnelle et intervention à domicile",()=>{
  for(const q of ["fabrication d'un objet artisanal","entretien d'un logement","réparation d'un appareil","prestation de coiffure","intervention d'un service à domicile"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts et aucun doublon",()=>{
  expect(CRAFTS_PERSONAL_SERVICES_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-craft:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);
 });
});
