import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {DIGITAL_TELECOM_CATALOG} from "./digital-telecom-catalog";
describe("Fondation A — famille 18 Numérique et télécommunications",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques sans doublons",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:digital-technology")).toHaveLength(1);
  for(const id of ["domain:software-development","domain:it-infrastructure","domain:cybersecurity","domain:data-ai","domain:digital-services"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît logiciel, infrastructure, cybersécurité, IA/données et services numériques",()=>{
  const cases=[["développement d'applications logicielles","subdomain-digital:software-engineering"],["administration des infrastructures cloud","subdomain-digital:cloud-infrastructure"],["sécurité informatique et réponse aux incidents","subdomain-digital:cybersecurity-operations"],["intelligence artificielle et analyse de données","subdomain-digital:ai-data-engineering"],["services numériques et plateformes en ligne","subdomain-digital:digital-platforms"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue développement, déploiement, exploitation, sécurisation et gouvernance des données",()=>{
  for(const q of ["développement d'une application","déploiement d'un service numérique","exploitation d'une infrastructure informatique","audit de cybersécurité","gouvernance et qualité des données"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts dans les neuf catégories",()=>{
  expect(DIGITAL_TELECOM_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-digital:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);
 });
});
