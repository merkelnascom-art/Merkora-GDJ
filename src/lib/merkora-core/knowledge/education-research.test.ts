import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { EDUCATION_RESEARCH_CATALOG } from "./education-research-catalog";

describe("Fondation A — famille 13 Éducation et recherche", () => {
 const registry=createUniversalKnowledgeRegistry();
 it("réutilise cinq domaines canoniques sans dupliquer les identifiants",()=>{
  expect(registry.concepts.filter(x=>x.id==="family:education-research")).toHaveLength(1);
  for(const id of ["domain:primary-secondary-education","domain:higher-education","domain:vocational-training","domain:research-development","domain:career-guidance"]) expect(registry.concepts.filter(x=>x.id===id)).toHaveLength(1);
 });
 it("reconnaît les parcours scolaires, supérieurs, professionnels, scientifiques et d'orientation",()=>{
  const cases=[["enseignement secondaire","subdomain-edu:school-secondary"],["formation professionnelle continue","subdomain-edu:continuing-vocational"],["recherche scientifique","subdomain-edu:scientific-research"],["orientation scolaire et professionnelle","subdomain-edu:career-guidance"],["enseignement universitaire","subdomain-edu:university-teaching"]] as const;
  for(const [q,id] of cases){const m=matchKnowledgeConcept(q,registry,{expectedType:"subdomain",language:"fr"});expect(m.status,q).toBe("matched");if(m.status==="matched")expect(m.concept.id).toBe(id);}
 });
 it("distingue apprentissage, évaluation, certification, recherche et orientation",()=>{
  for(const q of ["conception d'un cours","évaluation des acquis","délivrance d'une certification","conduite d'une étude scientifique","accompagnement à l'orientation"]){expect(matchKnowledgeConcept(q,registry,{expectedType:"activity",language:"fr"}).status).toBe("matched");}
 });
 it("contient 90 concepts dans les neuf catégories attendues",()=>{
  expect(EDUCATION_RESEARCH_CATALOG).toHaveLength(90);
  const catalog=registry.concepts.filter(x=>/^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-edu:/.test(x.id));
  expect(catalog).toHaveLength(90);
  const counts:Record<string,number>={subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7};
  for(const [type,n] of Object.entries(counts))expect(catalog.filter(x=>x.conceptType===type)).toHaveLength(n);
 });
 it("ne crée aucun identifiant ou canonicalKey en double",()=>{const ids=registry.concepts.map(x=>x.id),keys=registry.concepts.map(x=>x.canonicalKey);expect(new Set(ids).size).toBe(ids.length);expect(new Set(keys).size).toBe(keys.length);});
});
