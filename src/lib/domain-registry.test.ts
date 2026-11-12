import { describe, expect, it } from "vitest";
import { identifyDomain, MERKORA_DOMAINS } from "./domain-registry";

const samples = [
  ["sport", "Je gère un club de football et ses entraînements."],
  ["sante", "Notre clinique doit organiser les consultations des patients."],
  ["agriculture-environnement", "Je veux suivre les récoltes et les stocks de ma ferme."],
  ["commerce", "Je veux gérer les ventes et les stocks de ma boutique."],
  ["entrepreneuriat-finance", "Je veux suivre la trésorerie, le budget et la rentabilité de mon entreprise."],
  ["immobilier-btp", "Je gère des locataires, les loyers et des chantiers de construction."],
  ["education-formation", "Notre école organise les formations et les examens des apprenants."],
  ["transport-logistique", "Je veux gérer le transport de marchandises avec nos camions et planifier les tournées."],
  ["restauration-hotellerie-evenementiel", "Mon hôtel doit gérer les chambres et les réservations."],
  ["ressources-humaines", "Je veux gérer les ressources humaines, les contrats de travail et la paie."],
  ["artisanat-services", "Je suis plombier et je veux planifier les dépannages à domicile."],
  ["administration-services-publics", "Notre mairie veut gérer les demandes d'actes de naissance des citoyens."],
  ["voyage-tourisme-creation-jeux", "Je veux concevoir un jeu vidéo éducatif avec des niveaux et des missions."],
] as const;

describe("MerKora universal domain registry", () => {
  it("contains the 13 documented business domains", () => {
    expect(MERKORA_DOMAINS).toHaveLength(13);
    expect(new Set(MERKORA_DOMAINS.map((domain) => domain.id)).size).toBe(13);
  });

  it.each(samples)("recognizes domain %s from a concrete need", (expected, message) => {
    const match = identifyDomain(message);
    expect(match.domain?.id).toBe(expected);
    expect(match.confidence).not.toBe("low");
  });

  it("recognizes game design as a specialization of domain 13", () => {
    const match = identifyDomain("Je veux concevoir un jeu vidéo éducatif avec des niveaux et des missions.");
    expect(match.domain?.id).toBe("voyage-tourisme-creation-jeux");
    expect(match.specialization?.id).toBe("game-design");
  });

  it("recognizes home services as a specialization of domain 11", () => {
    const match = identifyDomain("Je suis plombier et je veux planifier les dépannages à domicile.");
    expect(match.domain?.id).toBe("artisanat-services");
    expect(match.specialization?.id).toBe("home-services");
  });

  it("does not invent a domain for a vague request", () => {
    expect(identifyDomain("Je veux améliorer quelque chose.").domain).toBeNull();
  });
});
