"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { analyzeNeed } from "@/lib/discovery";
import { fromCloudProjectRow, type CloudProjectRow, type Project } from "@/lib/project-types";

type SafeUser = { id: string; email: string | null; fullName: string | null };
type Props = { localProjects: Project[]; localJourneys: Record<string, unknown>; onCloudProjectsLoaded: (projects: Project[]) => void; onCloudJourneysLoaded: (journeys: Record<string, unknown>, projects: Project[]) => void; storageReady: boolean };

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return await response.json().catch(() => ({})) as Record<string, unknown>;
}

export function CloudAccountPanel({ localProjects, localJourneys, onCloudProjectsLoaded, onCloudJourneysLoaded, storageReady }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState<SafeUser | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCloudProjects = useCallback(async () => {
    const response = await fetch("/api/projects", { cache: "no-store" });
    const data = await readJson(response);
    if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Impossible de charger les dossiers en ligne.");
    const rows = Array.isArray(data.projects) ? data.projects as CloudProjectRow[] : [];
    const projects = rows.map((row) => {
      const project = fromCloudProjectRow(row);
      return { ...project, discovery: analyzeNeed(project) };
    });
    onCloudProjectsLoaded(projects);
    const journeyEntries = await Promise.all(projects.map(async (project) => {
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspace`, { cache: "no-store" });
      if (!response.ok) return null;
      const workspaceData = await readJson(response);
      const workspace = workspaceData.workspace;
      if (!workspace || typeof workspace !== "object") return null;
      const payload = (workspace as Record<string, unknown>).payload;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
      const journey = (payload as Record<string, unknown>).journey;
      return journey && typeof journey === "object" && !Array.isArray(journey) ? [project.id, journey] as const : null;
    }));
    const cloudJourneys = Object.fromEntries(journeyEntries.filter((entry): entry is readonly [string, unknown] => entry !== null));
    onCloudJourneysLoaded(cloudJourneys, projects);
    return projects.length;
  }, [onCloudProjectsLoaded, onCloudJourneysLoaded]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await readJson(response);
      setConfigured(data.configured === true);
      const nextUser = data.user && typeof data.user === "object" ? data.user as SafeUser : null;
      setUser(data.authenticated === true ? nextUser : null);
      if (data.authenticated === true && nextUser) {
        try {
          const count = await loadCloudProjects();
          setMessage(`Compte connecté · ${count} dossier(s) en ligne trouvé(s).`);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Chargement des dossiers impossible.");
        }
      }
    } catch {
      setConfigured(false);
      setError("Le service de compte est momentanément indisponible.");
    }
  }, [loadCloudProjects]);

  useEffect(() => { if (storageReady) void refreshSession(); }, [refreshSession, storageReady]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "L’opération a échoué.");
      if (data.confirmationRequired === true) {
        setMessage(typeof data.message === "string" ? data.message : "Vérifiez votre e-mail pour confirmer le compte.");
        setMode("login");
        setPassword("");
        return;
      }
      await refreshSession();
      setMessage(mode === "register" ? "Compte créé et connecté." : "Connexion réussie.");
      setPassword("");
      setExpanded(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le service est momentanément indisponible.");
    } finally {
      setBusy(false);
    }
  }

  async function syncProjects() {
    const confirmed = window.confirm(`Copier les ${localProjects.length} dossier(s) de ce navigateur vers le compte ${user?.email ?? "connecté"} ? Les dossiers locaux resteront sur cet appareil. Vérifiez que ce navigateur n’est pas partagé avec une autre personne.`);
    if (!confirmed) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localProjects),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "La synchronisation a échoué.");
      let journeySaved = 0;
      let journeyConflict = 0;
      for (const project of localProjects) {
        const journey = localJourneys[project.id];
        if (!journey || typeof journey !== "object" || Array.isArray(journey)) continue;
        const workspaceResponse = await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspace`, { cache: "no-store" });
        if (!workspaceResponse.ok) throw new Error("Impossible de vérifier la version en ligne d'un parcours. Les dossiers locaux sont conservés.");
        const workspaceData = await readJson(workspaceResponse);
        const workspace = workspaceData.workspace && typeof workspaceData.workspace === "object"
          ? workspaceData.workspace as Record<string, unknown>
          : null;
        if (workspace && Number(workspace.revision) > 0) {
          journeyConflict += 1;
          continue;
        }
        const saveResponse = await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspace`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedRevision: 0,
            payload: { journey },
            eventType: "client_journey_saved",
            summary: "Synchronisation initiale du parcours client",
          }),
        });
        const saveData = await readJson(saveResponse);
        if (!saveResponse.ok) {
          if (saveResponse.status === 409) { journeyConflict += 1; continue; }
          throw new Error(typeof saveData.error === "string" ? saveData.error : "La sauvegarde du parcours a échoué. Les dossiers locaux sont conservés.");
        }
        journeySaved += 1;
      }
      const count = await loadCloudProjects();
      setMessage(`Synchronisation terminée : ${count} dossier(s) en ligne, ${journeySaved} parcours sauvegardé(s)${journeyConflict ? `, ${journeyConflict} parcours déjà présents conservés sans écrasement` : ""}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La synchronisation a échoué. Les dossiers locaux sont conservés.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("La déconnexion n’a pas pu être confirmée.");
      setUser(null);
      setMessage("Vous êtes déconnecté. Les dossiers locaux restent sur cet appareil.");
      setExpanded(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Déconnexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="cloud-account" aria-label="Compte et sauvegarde en ligne">
      <div className="cloud-account-summary">
        <span className={`cloud-status-dot ${user ? "online" : ""}`} />
        <div className="cloud-account-label">
          <strong>{user ? (user.fullName || user.email || "Compte connecté") : configured === false ? "Compte en ligne indisponible" : "Sauvegarde en ligne"}</strong>
          <span>{user ? "Dossiers privés liés à votre compte" : configured === false ? "Configuration requise" : "Connectez-vous pour retrouver vos projets"}</span>
        </div>
        {user ? (
          <>
            <button className="button button-primary cloud-sync-button" onClick={syncProjects} disabled={busy}>{busy ? "Synchronisation…" : "Synchroniser mes dossiers"}</button>
            <button className="button button-quiet cloud-account-toggle" onClick={() => setExpanded(!expanded)}>{expanded ? "Fermer" : "Compte"}</button>
          </>
        ) : (
          <button className="button button-quiet cloud-account-toggle" onClick={() => { setExpanded(!expanded); setError(""); setMessage(""); }}>{expanded ? "Fermer" : "Se connecter"}</button>
        )}
      </div>

      {expanded && !user && configured !== false && (
        <form className="cloud-auth-form" onSubmit={submitAuth}>
          <div className="cloud-auth-heading">
            <div><div className="eyebrow">{mode === "register" ? "CRÉER UN COMPTE" : "RETROUVER SES PROJETS"}</div><h3>{mode === "register" ? "Votre espace MerKora" : "Bon retour."}</h3></div>
            <button type="button" className="text-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }}>{mode === "login" ? "Créer un compte" : "J’ai déjà un compte"}</button>
          </div>
          {mode === "register" && <label>Nom ou nom d’activité<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} placeholder="Votre nom (facultatif)" /></label>}
          <label>Adresse e-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} placeholder="vous@exemple.com" /></label>
          <label>Mot de passe<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 10 : 1} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "register" ? "10 caractères minimum" : "Votre mot de passe"} /></label>
          <div className="cloud-auth-actions"><p>{mode === "register" ? "Selon la configuration du service, une confirmation par e-mail peut être demandée." : "Vos dossiers en ligne restent privés à votre compte."}</p><button className="button button-primary" disabled={busy} type="submit">{busy ? "Patientez…" : mode === "register" ? "Créer mon compte" : "Se connecter"}</button></div>
        </form>
      )}

      {expanded && user && <div className="cloud-auth-signed-in"><p>Connecté avec <strong>{user.email}</strong>.</p><button className="button button-quiet" disabled={busy} onClick={signOut}>Se déconnecter</button></div>}
      {message && <p className="cloud-feedback success" role="status">{message}</p>}
      {error && <p className="cloud-feedback error" role="alert">{error}</p>}
      {configured === false && <p className="cloud-feedback">Le compte et la sauvegarde en ligne nécessitent une configuration des variables Supabase. Aucun dossier local n’a été supprimé.</p>}
    </section>
  );
}
