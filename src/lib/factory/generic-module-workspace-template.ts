export const genericModuleWorkspaceSource = String.raw`"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type WorkItem = { id: string; label: string; done: boolean };
type ModulePayload = { items?: unknown };

function makeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

export function ModuleWorkspace({
  projectId,
  moduleId,
  title,
  description,
}: {
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
}) {
  const supabase = useMemo(() => makeClient(), []);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<WorkItem[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadData = useCallback(async () => {
    if (!supabase || !userId) return;
    setBusy(true);
    const { data, error } = await supabase.from("project_module_data")
      .select("payload")
      .eq("project_id", projectId)
      .eq("module_id", moduleId)
      .maybeSingle();
    setBusy(false);
    if (error) {
      setFeedback("Chargement impossible. Vérifiez que votre compte est bien propriétaire de ce projet.");
      return;
    }
    const payload = (data?.payload ?? {}) as ModulePayload;
    const saved = Array.isArray(payload.items) ? payload.items : [];
    setItems(saved.filter((item): item is WorkItem =>
      Boolean(item) && typeof item === "object" &&
      typeof (item as WorkItem).id === "string" &&
      typeof (item as WorkItem).label === "string" &&
      typeof (item as WorkItem).done === "boolean"
    ));
    setFeedback("Données du module récupérées depuis l'espace sécurisé du projet.");
  }, [moduleId, projectId, supabase, userId]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUserId(data.user?.id ?? "");
      setUserEmail(data.user?.email ?? "");
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? "");
      setUserEmail(session?.user?.email ?? "");
      if (!session?.user) setItems([]);
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (userId) void loadData();
  }, [loadData, userId]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setFeedback("Connexion impossible : " + error.message);
    else {
      setPassword("");
      setUserId(data.user.id);
      setUserEmail(data.user.email ?? "");
      setFeedback("Connexion réussie. Chargement des données du projet…");
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setFeedback("Déconnexion impossible.");
    else { setUserId(""); setUserEmail(""); setItems([]); setFeedback("Vous êtes déconnecté."); }
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = draft.trim();
    if (!label) return;
    setItems((current) => [...current, { id: crypto.randomUUID(), label, done: false }]);
    setDraft("");
  }

  function toggleItem(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  async function saveData() {
    if (!supabase || !userId) return;
    setBusy(true);
    const { error } = await supabase.from("project_module_data").upsert({
      project_id: projectId,
      module_id: moduleId,
      payload: { items },
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: "project_id,module_id" });
    setBusy(false);
    setFeedback(error
      ? "Enregistrement refusé. Seul le propriétaire du projet peut modifier cet espace pour le moment."
      : "Modifications enregistrées dans Supabase. Elles seront disponibles sur vos autres appareils.");
  }

  if (!supabase) {
    return <section className="card"><h2>Configuration requise</h2><p>Configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY pour activer les données partagées.</p></section>;
  }

  if (!userId) {
    return (
      <section className="card" aria-label={"Connexion au module : " + title}>
        <p className="eyebrow">Espace sécurisé du projet</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Connectez-vous avec le compte propriétaire du projet pour retrouver les données enregistrées sur tous vos appareils.</p>
        <form onSubmit={signIn}>
          <label>Email <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Mot de passe <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button type="submit" disabled={busy}>Se connecter</button>
        </form>
        <p role="status" aria-live="polite">{feedback}</p>
      </section>
    );
  }

  const completed = items.filter((item) => item.done).length;
  return (
    <section className="card" aria-label={"Espace de travail : " + title}>
      <p className="eyebrow">Données partagées du projet</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="sweet-inline"><span>Connecté : {userEmail}</span><button type="button" onClick={signOut}>Déconnexion</button></div>
      <p>{completed}/{items.length} action(s) terminée(s)</p>
      <form onSubmit={addItem}>
        <label htmlFor={moduleId + "-new-item"}>Nouvelle action</label>
        <input id={moduleId + "-new-item"} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={180} placeholder="Ajouter une action à suivre…" />
        <button type="submit" disabled={!draft.trim()}>Ajouter</button>
      </form>
      {items.length === 0 ? <p>Aucune action pour le moment.</p> : (
        <ul>{items.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} /> <span>{item.done ? <s>{item.label}</s> : item.label}</span></label></li>)}</ul>
      )}
      <button type="button" onClick={() => void saveData()} disabled={busy}>Enregistrer les modifications</button>
      <button type="button" onClick={() => void loadData()} disabled={busy}>Récupérer les données du module</button>
      <p role="status" aria-live="polite">{feedback || "Les données sont privées et protégées par les règles Supabase du projet."}</p>
    </section>
  );
}
`;
