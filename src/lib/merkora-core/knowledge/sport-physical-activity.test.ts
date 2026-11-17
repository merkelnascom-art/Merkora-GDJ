import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {SPORT_PHYSICAL_ACTIVITY_CATALOG} from "./sport-physical-activity-catalog";
describe("Fondation A — famille 15 Sport et activités physiques",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:sport-physical-activity")).toHaveLength(1);
  for(const id of ["domain:team-sports","domain:individual-sports","domain:fitness-conditioning","domain:sports-clubs","domain:sports-performance"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît les sports collectifs, individuels, fitness, clubs et performance",()=>{
  const cases=[["football en équipe","subdomain-sport:team-ball-sports"],["athlétisme individuel","subdomain-sport:individual-athletics"],["préparation physique et fitness","subdomain-sport:fitness-training"],["gestion d'un club sportif","subdomain-sport:club-administration"],["encadrement de la performance sportive","subdomain-sport:performance-coaching"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue entraînement, compétition, arbitrage, suivi et prévention des blessures",()=>{
  for(const q of ["conduite d'une séance d'entraînement","organisation d'une compétition sportive","arbitrage d'un match","suivi des performances d'un athlète","prévention des blessures sportives"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts dans les neuf catégories",()=>{
  expect(SPORT_PHYSICAL_ACTIVITY_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-sport:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
 });
 it("ne crée aucun identifiant ou canonicalKey en double",()=>{const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);});
});
