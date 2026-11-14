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
  const [accessReady, setAccessReady] = useState(false);
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const loadAccess = useCallback(async () => {
    if (!supabase || !userId) return;
    setAccessReady(false);
    const { data: owner, error: ownerError } = await supabase.from("user_projects")
      .select("id").eq("id", projectId).eq("user_id", userId).maybeSingle();
    if (ownerError) {
      setCanView(false);
      setCanEdit(false);
      setAccessReady(true);
      setFeedback("Impossible de vérifier vos droits sur ce projet.");
      return;
    }
    if (owner) {
      setCanView(true);
      setCanEdit(true);
      setAccessReady(true);
      return;
    }
    const { data: membership, error: membershipError } = await supabase.from("project_team_memberships")
      .select("id").eq("project_id", projectId).eq("user_id", userId).eq("status", "active").maybeSingle();
    if (membershipError || !membership) {
      setCanView(false);
      setCanEdit(false);
      setAccessReady(true);
      setFeedback("Aucun accès actif à ce projet. Si la propriétaire vous a invité, ouvrez la page Gestion de l'équipe pour activer votre invitation.");
      return;
    }
    const { data: grant, error: grantError } = await supabase.from("project_team_module_permissions")
      .select("can_view,can_edit")
      .eq("project_id", projectId)
      .eq("membership_id", membership.id)
      .eq("module_id", moduleId)
      .maybeSingle();
    if (grantError || !grant?.can_view) {
      setCanView(false);
      setCanEdit(false);
      setAccessReady(true);
      setFeedback("La propriétaire ne vous a pas accordé l'accès à ce module.");
      return;
    }
    setCanView(true);
    setCanEdit(Boolean(grant.can_edit));
    setAccessReady(true);
  }, [moduleId, projectId, supabase, userId]);

  const loadData = useCallback(async () => {
    if (!supabase || !userId || !canView) return;
    setBusy(true);
    const { data, error } = await supabase.from("project_module_data")
      .select("payload")
      .eq("project_id", projectId)
      .eq("module_id", moduleId)
      .maybeSingle();
    setBusy(false);
    if (error) {
      setFeedback("Chargement impossible. Vérifiez que la propriétaire vous a accordé l'accès à ce module.");
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
  }, [canView, moduleId, projectId, supabase, userId]);

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
      if (!session?.user) {
        setItems([]);
        setCanView(false);
        setCanEdit(false);
        setAccessReady(false);
      }
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (userId) void loadAccess();
  }, [loadAccess, userId]);

  useEffect(() => {
    if (userId && accessReady && canView) void loadData();
  }, [accessReady, canView, loadData, userId]);

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
      setFeedback("Connexion réussie. Vérification de vos autorisations…");
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setFeedback("Déconnexion impossible.");
    else {
      setUserId("");
      setUserEmail("");
      setItems([]);
      setCanView(false);
      setCanEdit(false);
      setAccessReady(false);
      setFeedback("Vous êtes déconnecté.");
    }
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEdit) return;
    const label = draft.trim();
    if (!label) return;
    setItems((current) => [...current, { id: crypto.randomUUID(), label, done: false }]);
    setDraft("");
  }

  function toggleItem(id: string) {
    if (!canEdit) return;
    setItems((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  async function saveData() {
    if (!supabase || !userId || !canEdit) return;
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
      ? "Enregistrement refusé. Votre autorisation de modification a peut-être été retirée."
      : "Modifications enregistrées. Elles seront disponibles sur les autres appareils autorisés.");
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
        <p>Connectez-vous avec votre compte. La propriétaire choisit les modules auxquels chaque collaborateur peut accéder.</p>
        <form onSubmit={signIn}>
          <label>Email <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Mot de passe <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button type="submit" disabled={busy}>Se connecter</button>
        </form>
        <p role="status" aria-live="polite">{feedback}</p>
      </section>
    );
  }

  if (!accessReady) {
    return <section className="card"><p>Vérification des autorisations du projet…</p></section>;
  }

  if (!canView) {
    return (
      <section className="card">
        <p className="eyebrow">Accès au module</p>
        <h2>{title}</h2>
        <p>{feedback || "Vous n'avez pas accès à ce module."}</p>
        <p><a href="/team">Ouvrir la gestion de l'équipe / activer une invitation</a></p>
        <button type="button" onClick={signOut}>Déconnexion</button>
      </section>
    );
  }

  const completed = items.filter((item) => item.done).length;
  return (
    <section className="card" aria-label={"Espace de travail : " + title}>
      <p className="eyebrow">Données partagées du projet</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="module-inline"><span>Connecté : {userEmail}</span><button type="button" onClick={signOut}>Déconnexion</button></div>
      <p>{completed}/{items.length} action(s) terminée(s)</p>
      {canEdit ? (
        <form onSubmit={addItem}>
          <label htmlFor={moduleId + "-new-item"}>Nouvelle action</label>
          <input id={moduleId + "-new-item"} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={180} placeholder="Ajouter une action à suivre…" />
          <button type="submit" disabled={!draft.trim()}>Ajouter</button>
        </form>
      ) : <p>Accès en consultation uniquement. Seule la propriétaire peut modifier vos autorisations.</p>}
      {items.length === 0 ? <p>Aucune action pour le moment.</p> : (
        <ul>{items.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.done} disabled={!canEdit} onChange={() => toggleItem(item.id)} /> <span>{item.done ? <s>{item.label}</s> : item.label}</span></label></li>)}</ul>
      )}
      {canEdit ? <button type="button" onClick={() => void saveData()} disabled={busy}>Enregistrer les modifications</button> : null}
      <button type="button" onClick={() => void loadData()} disabled={busy}>Récupérer les données du module</button>
      <p role="status" aria-live="polite">{feedback || "Les données sont privées et protégées par les règles Supabase du projet."}</p>
    </section>
  );
}

`;
