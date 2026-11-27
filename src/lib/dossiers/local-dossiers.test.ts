import { describe, expect, it } from "vitest";
import { getLatestLocalDossier, readLocalDossiers, saveLocalDossier, type StorageLike } from "./local-dossiers";

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe("local-first project dossiers", () => {
  it("saves a dossier and can restore it after a page reload", () => {
    const storage = memoryStorage();
    const dossier = { id: "dossier-1", title: "Mon projet", payload: { problem: "Suivre les inscriptions" }, version: 1, updatedAt: "2026-11-15T10:00:00.000Z" };
    saveLocalDossier(storage, dossier);
    expect(readLocalDossiers(storage)).toEqual([dossier]);
    expect(getLatestLocalDossier(storage)).toEqual(dossier);
  });

  it("updates an existing dossier instead of creating duplicate copies", () => {
    const storage = memoryStorage();
    saveLocalDossier(storage, { id: "dossier-1", title: "Ancien titre", payload: {}, version: 1, updatedAt: "2026-11-15T10:00:00.000Z" });
    saveLocalDossier(storage, { id: "dossier-1", title: "Titre corrigé", payload: { ok: true }, version: 2, updatedAt: "2026-11-15T10:05:00.000Z" });
    expect(readLocalDossiers(storage)).toHaveLength(1);
    expect(readLocalDossiers(storage)[0].title).toBe("Titre corrigé");
  });

  it("keeps other projects when one project is updated", () => {
    const storage = memoryStorage();
    saveLocalDossier(storage, { id: "a", title: "A", payload: {}, version: 1, updatedAt: "2026-11-15T10:00:00.000Z" });
    saveLocalDossier(storage, { id: "b", title: "B", payload: {}, version: 1, updatedAt: "2026-11-15T11:00:00.000Z" });
    expect(readLocalDossiers(storage).map(item => item.id)).toEqual(["b", "a"]);
  });

  it("returns an empty list for malformed storage without throwing", () => {
    const storage = { getItem: () => "{broken", setItem: () => undefined };
    expect(readLocalDossiers(storage)).toEqual([]);
  });

  it("finds the latest dossier matching a journey instead of being blocked by another journey", () => {
    const storage = memoryStorage();
    const drt = { id: "drt-1", title: "Projet DRT", payload: { journey: "drt" }, version: 1, updatedAt: "2026-11-15T10:00:00.000Z" };
    const catalogue = { id: "catalogue-1", title: "Commande Catalogue", payload: { journey: "catalogue" }, version: 1, updatedAt: "2026-11-15T11:00:00.000Z" };
    saveLocalDossier(storage, drt);
    saveLocalDossier(storage, catalogue);
    expect(getLatestLocalDossier(storage, item => item.payload.journey === "drt")).toEqual(drt);
  });

  it("retains the last synchronized cloud version for conflict-safe updates", () => {
    const storage = memoryStorage();
    saveLocalDossier(storage, { id: "dossier-1", title: "Projet", payload: {}, version: 4, syncedVersion: 2, updatedAt: "2026-11-15T12:00:00.000Z" });
    expect(readLocalDossiers(storage)[0].syncedVersion).toBe(2);
  });
});
