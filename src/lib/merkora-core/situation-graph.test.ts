import { describe, expect, it } from "vitest";
import { buildSituationGraph, type SituationObservationBatch } from "./situation-graph";

const source = (messageId: string, quote: string) => ({
  messageId,
  quote,
  role: "visitor" as const,
  status: "user_stated" as const,
});

describe("universal situation graph", () => {
  it("represents different human situations without requiring a predefined business domain", () => {
    const observations: SituationObservationBatch[] = [
      {
        entities: [
          { key: "initiator", kind: "actor", label: "Personne à l'origine du projet", role: "initiator", source: source("m1", "Je veux créer un jeu.") },
          { key: "young-people", kind: "actor", label: "Jeunes", role: "audience", source: source("m1", "pour distraire les jeunes") },
          { key: "game", kind: "activity", label: "Jeu interactif", source: source("m1", "Je veux créer un jeu.") },
          { key: "relaxation", kind: "goal", label: "Distraction et détente", source: source("m1", "pour distraire les jeunes") },
        ],
        relations: [
          { fromKey: "initiator", predicate: "imagines", toKey: "game", source: source("m1", "Je veux créer un jeu.") },
          { fromKey: "game", predicate: "intended_for", toKey: "young-people", source: source("m1", "pour distraire les jeunes") },
          { fromKey: "game", predicate: "aims_at", toKey: "relaxation", source: source("m1", "pour distraire les jeunes") },
        ],
      },
      {
        entities: [
          { key: "shop-owner", kind: "actor", label: "Responsable de boutique", role: "owner", source: source("m2", "Je veux suivre les ventes de ma boutique.") },
          { key: "sales", kind: "process", label: "Suivi des ventes", source: source("m2", "suivre les ventes de ma boutique") },
        ],
        relations: [
          { fromKey: "shop-owner", predicate: "wants_to_monitor", toKey: "sales", source: source("m2", "Je veux suivre les ventes de ma boutique.") },
        ],
      },
    ];

    const graph = buildSituationGraph(observations);

    expect(graph.entities.map((entity) => entity.kind)).toEqual(
      expect.arrayContaining(["actor", "activity", "goal", "process"]),
    );
    expect(graph.entities.find((entity) => entity.key === "young-people")?.role).toBe("audience");
    expect(graph.entities.find((entity) => entity.key === "shop-owner")?.role).toBe("owner");
    expect(graph.relations.map((relation) => relation.predicate)).toEqual(
      expect.arrayContaining(["imagines", "intended_for", "aims_at", "wants_to_monitor"]),
    );
    expect(graph.unresolvedRelations).toEqual([]);
  });

  it("merges repeated entities while preserving every distinct source and its evidence status", () => {
    const graph = buildSituationGraph([
      {
        entities: [
          { key: "employees", kind: "actor", label: "Employés", role: "staff", source: source("m1", "Mes employés enregistrent les ventes.") },
        ],
        relations: [],
      },
      {
        entities: [
          { key: "employees", kind: "actor", label: "Personnel", role: "staff", source: source("m2", "Le personnel utilise le téléphone.") },
        ],
        relations: [],
      },
    ]);

    const employees = graph.entities.find((entity) => entity.key === "employees");
    expect(graph.entities.filter((entity) => entity.key === "employees")).toHaveLength(1);
    expect(employees?.evidence).toHaveLength(2);
    expect(employees?.evidence.map((item) => item.messageId)).toEqual(["m1", "m2"]);
    expect(employees?.evidence.every((item) => item.status === "user_stated")).toBe(true);
  });

  it("keeps every relation attached to the exact source quote and never invents missing endpoints", () => {
    const graph = buildSituationGraph([
      {
        entities: [
          { key: "manager", kind: "actor", label: "Responsable", source: source("m3", "Le responsable contrôle les accès.") },
          { key: "access", kind: "process", label: "Contrôle des accès", source: source("m3", "Le responsable contrôle les accès.") },
        ],
        relations: [
          { fromKey: "manager", predicate: "performs", toKey: "access", source: source("m3", "Le responsable contrôle les accès.") },
          { fromKey: "manager", predicate: "approves", toKey: "payment", source: source("m4", "Le responsable contrôle les accès.") },
        ],
      },
    ]);

    expect(graph.relations).toHaveLength(1);
    expect(graph.relations[0]).toMatchObject({
      predicate: "performs",
      status: "user_stated",
      evidence: [expect.objectContaining({ messageId: "m3", quote: "Le responsable contrôle les accès." })],
    });
    expect(graph.entities.some((entity) => entity.key === "payment")).toBe(false);
    expect(graph.unresolvedRelations).toEqual([
      expect.objectContaining({ fromKey: "manager", toKey: "payment", reason: "missing_target" }),
    ]);
  });

  it("does not duplicate the same relation when the same evidence is supplied twice", () => {
    const relation = {
      fromKey: "teacher",
      predicate: "guides",
      toKey: "learners",
      source: source("m5", "L'enseignant accompagne les apprenants."),
    };
    const graph = buildSituationGraph([
      {
        entities: [
          { key: "teacher", kind: "actor", label: "Enseignant", source: source("m5", "L'enseignant accompagne les apprenants.") },
          { key: "learners", kind: "actor", label: "Apprenants", source: source("m5", "L'enseignant accompagne les apprenants.") },
        ],
        relations: [relation],
      },
      { entities: [], relations: [relation] },
    ]);

    expect(graph.relations).toHaveLength(1);
    expect(graph.relations[0].evidence).toHaveLength(1);
  });
});
