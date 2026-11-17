import {describe,expect,it} from "vitest";
import {createUniversalKnowledgeRegistry} from "./registry";
import {matchKnowledgeConcept} from "./matching";
import {MEDIA_COMMUNICATION_CATALOG} from "./media-communication-catalog";
describe("Fondation A — famille 17 Médias et communication",()=>{
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise la famille et cinq domaines canoniques",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:media-communication")).toHaveLength(1);
  for(const id of ["domain:journalism","domain:audiovisual-production","domain:marketing-advertising","domain:public-relations","domain:content-management"])expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît presse, audiovisuel, publicité, communication institutionnelle et contenus",()=>{
  const cases=[["reportage de presse","subdomain-media:press-reporting"],["production audiovisuelle","subdomain-media:audiovisual-production"],["campagne publicitaire","subdomain-media:advertising-campaigns"],["communication institutionnelle","subdomain-media:institutional-communication"],["gestion éditoriale de contenus","subdomain-media:content-management"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue enquête, vérification, production, publication et mesure d'audience",()=>{
  for(const q of ["conduite d'une enquête journalistique","vérification des faits et des sources","production d'un reportage audiovisuel","publication d'un contenu éditorial","analyse de l'audience média"])expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");
 });
 it("contient 90 concepts dans les neuf catégories",()=>{
  expect(MEDIA_COMMUNICATION_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-media:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
  const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);
 });
});
