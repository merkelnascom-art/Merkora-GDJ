import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {CULTURE_ARTS_CATALOG} from "./culture-arts-catalog";
describe("Fondation A — famille 16 Culture et arts",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:culture-arts")).toHaveLength(1);
  for(const id of ["domain:dance-movement","domain:music-sound","domain:visual-arts","domain:cultural-performance","domain:heritage-institutions"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît danse, musique, arts visuels, spectacle et patrimoine",()=>{
  const cases=[["enseignement de la danse","subdomain-culture:dance-training"],["production musicale","subdomain-culture:music-production"],["création d'une œuvre visuelle","subdomain-culture:visual-art-creation"],["production d'un spectacle vivant","subdomain-culture:live-performance"],["gestion d'un musée patrimonial","subdomain-culture:museum-heritage"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue création, répétition, production, diffusion et conservation",()=>{
  for(const q of ["création d'une œuvre artistique","répétition d'un spectacle","production d'un concert","diffusion d'une exposition","conservation d'une collection patrimoniale"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts et aucun doublon",()=>{
  expect(CULTURE_ARTS_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-culture:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);
 });
});
