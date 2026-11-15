export type LocalDossier<T = unknown> = {
  id: string;
  title: string;
  payload: T;
  version: number;
  updatedAt: string;
};

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "merkora:dossiers:v1";

/** Local-first storage: a dossier is persisted before any network request is attempted. */
export function readLocalDossiers<T = unknown>(storage: StorageLike): LocalDossier<T>[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is LocalDossier<T> =>
      Boolean(item && typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.version === "number" &&
        typeof item.updatedAt === "string" &&
        "payload" in item),
    );
  } catch {
    return [];
  }
}

export function saveLocalDossier<T>(storage: StorageLike, dossier: LocalDossier<T>): LocalDossier<T>[] {
  const existing = readLocalDossiers<T>(storage);
  const next = [dossier, ...existing.filter(item => item.id !== dossier.id)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getLatestLocalDossier<T = unknown>(storage: StorageLike): LocalDossier<T> | null {
  return readLocalDossiers<T>(storage)[0] ?? null;
}

export function browserDossierStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}
