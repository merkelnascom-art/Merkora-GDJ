import { describe, expect, it } from "vitest";
import { analyzeNeed } from "./discovery";
import { buildRecommendations, type NeedInput } from "./solution-recommendations";
import { createMerkoraConversationReply } from "./assistant/merkora-conversation";

function need(title: string, problem: string, desiredOutcome: string): NeedInput {
  return { title, category: "other", problem, desiredOutcome, budget: "À définir", urgency: "normal" };
}

describe("13-domain discovery integration", () => {
  it("routes artisan home-service requests to domain 11 and its adaptive questions", () => {
    const result = analyzeNeed(need(
      "Mon service de plomberie",
      "Je suis plombier et je veux planifier les dépannages à domicile pour mes clients.",
      "Affecter les techniciens et suivre les interventions terminées.",
    ));
    expect(result.domainId).toBe("artisanat-services");
    expect(result.specializationId).toBe("home-services");
    expect(result.questions.some((question) => /interventions|récurrentes|rendez-vous/i.test(question))).toBe(true);
  });

  it("routes ordinary team attendance and responsibility tracking to domain 10", () => {
    const result = analyzeNeed(need(
      "Gestion d'équipe",
      "Je veux suivre les présences et les responsabilités de mon équipe.",
      "Suivre les présences et les responsabilités de chaque collaborateur.",
    ));
    expect(result.domainId).toBe("ressources-humaines");
    expect(result.state).toBe("preliminary");
    expect(result.questions.some((question) => /processus RH|collaborateurs/i.test(question))).toBe(true);
  });

  it("routes municipal civil-status requests to domain 12 without making administrative decisions", () => {
    const result = analyzeNeed(need(
      "Portail de la mairie",
      "Notre mairie veut gérer les demandes d'actes de naissance des citoyens et suivre les dossiers.",
      "Permettre le dépôt et le suivi des demandes avec validation par un agent habilité.",
    ));
    expect(result.domainId).toBe("administration-services-publics");
    expect(result.specializationId).toBe("civil-status");
    expect(result.questions.some((question) => /identité|pièces|vérifiées/i.test(question))).toBe(true);
  });

  it("routes a game-design request to domain 13 and proposes game-specific modules", () => {
    const input = need(
      "Mon jeu éducatif",
      "Je veux concevoir un jeu vidéo éducatif avec des niveaux, des missions et des personnages.",
      "Permettre aux jeunes d'apprendre en jouant et de suivre leur progression.",
    );
    const result = analyzeNeed(input);
    expect(result.domainId).toBe("voyage-tourisme-creation-jeux");
    expect(result.specializationId).toBe("game-design");
    const modules = buildRecommendations(input).map((item) => item.title);
    expect(modules).toContain("Boucle de jeu et règles");
    expect(modules).toContain("Niveaux et missions");
  });

  it("uses the same domain registry in the local conversational assistant", () => {
    const reply = createMerkoraConversationReply({
      message: "Je veux créer un jeu mobile avec des niveaux, des missions et une sauvegarde de progression.",
      history: [],
    });
    expect(reply.domainId).toBe("voyage-tourisme-creation-jeux");
    expect(reply.specializationId).toBe("game-design");
    expect(reply.suggestedModules.map((item) => item.id)).toContain("game-core-loop");
  });
});
