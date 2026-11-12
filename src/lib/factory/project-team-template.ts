export const projectTeamManagementSource = String.raw`"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ModuleOption = { id: string; title: string };
type Grant = { moduleId: string; canView: boolean; canEdit: boolean };
type TeamMember = {
  id: string;
  email: string;
  status: "pending" | "active" | "revoked";
  created_at: string;
  grants: Grant[];
};

function makeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

export function ProjectTeamManagement({
  projectId,
  modules,
}: {
  projectId: string;
  modules: ModuleOption[];
}) {
  const supabase = useMemo(() => makeClient(), []);
  const [userId, setUserId] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Record<string, { canView: boolean; canEdit: boolean }>>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    setBusy(true);
    const { data: auth } = await supabase.auth.getUser();
    const currentUserId = auth.user?.id ?? "";
    setUserId(currentUserId);
    if (!currentUserId) {
      setIsOwner(false);
      setMembers([]);
      setBusy(false);
      return;
    }

    const { data: ownerProject, error: ownerError } = await supabase
      .from("user_projects").select("id").eq("id", projectId).eq("user_id", currentUserId).maybeSingle();
    if (ownerError) {
      setFeedback("Impossible de vérifier le compte propriétaire.");
      setBusy(false);
      return;
    }
    setIsOwner(Boolean(ownerProject));
    if (!ownerProject) {
      setMembers([]);
      setBusy(false);
      return;
    }

    const { data: rows, error: membersError } = await supabase
      .from("project_team_memberships")
      .select("id,email,status,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (membersError) {
      setFeedback("Impossible de charger l'équipe.");
      setBusy(false);
      return;
    }

    const { data: grants, error: grantsError } = await supabase
      .from("project_team_module_permissions")
      .select("membership_id,module_id,can_view,can_edit")
      .eq("project_id", projectId);
    if (grantsError) {
      setFeedback("Impossible de charger les autorisations de l'équipe.");
      setBusy(false);
      return;
    }

    const mapped = (rows ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      status: row.status as TeamMember["status"],
      created_at: row.created_at,
      grants: (grants ?? [])
        .filter((grant) => grant.membership_id === row.id)
        .map((grant) => ({ moduleId: grant.module_id, canView: grant.can_view, canEdit: grant.can_edit })),
    }));
    setMembers(mapped);
    setBusy(false);
  }, [projectId, supabase]);

  useEffect(() => {
    if (!supabase) return;
    void load();
    const { data } = supabase.auth.onAuthStateChange(() => { void load(); });
    return () => data.subscription.unsubscribe();
  }, [load, supabase]);

  function changeGrant(moduleId: string, field: "canView" | "canEdit", value: boolean) {
    setSelected((current) => {
      const previous = current[moduleId] ?? { canView: false, canEdit: false };
      if (field === "canView" && !value) return { ...current, [moduleId]: { canView: false, canEdit: false } };
      if (field === "canEdit" && value) return { ...current, [moduleId]: { canView: true, canEdit: true } };
      return { ...current, [moduleId]: { ...previous, [field]: value } };
    });
  }

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !isOwner) return;
    const grants = modules
      .filter((module) => selected[module.id]?.canView)
      .map((module) => ({
        moduleId: module.id,
        canView: true,
        canEdit: Boolean(selected[module.id]?.canEdit),
      }));
    if (grants.length === 0) {
      setFeedback("Choisissez au moins un module avant d'envoyer l'invitation.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("project-team-invite", {
      body: { projectId, email: email.trim(), grants },
    });
    setBusy(false);
    if (error || !data?.ok) {
      setFeedback("Invitation non envoyée. Vérifiez l'adresse et la configuration des emails.");
      return;
    }
    setFeedback(data.message ?? "Invitation enregistrée.");
    setEmail("");
    setSelected({});
    await load();
  }

  async function revoke(member: TeamMember) {
    if (!supabase || !isOwner || member.status === "revoked") return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("project-team-revoke", {
      body: { projectId, membershipId: member.id },
    });
    setBusy(false);
    if (error || !data?.ok) {
      setFeedback("Impossible de révoquer cet accès.");
      return;
    }
    setFeedback("Accès révoqué. La personne ne pourra plus ouvrir les modules de ce projet.");
    await load();
  }

  async function acceptInvitation() {
    if (!supabase || !userId) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("project-team-accept", { body: { projectId } });
    setBusy(false);
    if (error || !data?.ok) {
      setFeedback("Aucune invitation en attente n'a été trouvée pour ce compte.");
      return;
    }
    setFeedback("Votre accès à l'équipe est activé. Vous pouvez maintenant ouvrir les modules autorisés.");
  }

  if (!supabase) {
    return <section className="card"><h2>Configuration requise</h2><p>La gestion d'équipe nécessite la connexion Supabase du projet.</p></section>;
  }

  if (!userId) {
    return <section className="card">
      <p className="eyebrow">Équipe du projet</p>
      <h2>Connexion nécessaire</h2>
      <p>Connectez-vous avec l'adresse qui a reçu l'invitation de la propriétaire.</p>
      <p>Si vous êtes la propriétaire, connectez-vous avec votre compte administrateur du projet.</p>
      <p role="status" aria-live="polite">{feedback}</p>
    </section>;
  }

  if (!isOwner) {
    return <section className="card">
      <p className="eyebrow">Accès collaborateur</p>
      <h2>Activer mon invitation</h2>
      <p>Si la propriétaire vous a invité avec cette adresse, activez votre accès ici. Vous ne pourrez ouvrir que les modules qu'elle vous a attribués.</p>
      <button type="button" onClick={() => void acceptInvitation()} disabled={busy}>Activer mon accès</button>
      <p role="status" aria-live="polite">{feedback}</p>
    </section>;
  }

  return <section className="card" aria-label="Gestion de l'équipe du projet">
    <p className="eyebrow">Espace propriétaire</p>
    <h2>Gérer mon équipe</h2>
    <p>Vous choisissez les personnes qui travaillent avec vous et les modules auxquels elles peuvent accéder. Une invitation ne donne aucun accès avant son activation.</p>
    <form onSubmit={invite}>
      <label htmlFor="team-invite-email">Adresse email du collaborateur</label>
      <input id="team-invite-email" type="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nom@exemple.com" />
      <h3>Modules et autorisations</h3>
      <div className="team-module-grants">
        {modules.map((module) => {
          const grant = selected[module.id] ?? { canView: false, canEdit: false };
          return <fieldset key={module.id}>
            <legend>{module.title}</legend>
            <label><input type="checkbox" checked={grant.canView} onChange={(event) => changeGrant(module.id, "canView", event.target.checked)} /> Consultation</label>
            <label><input type="checkbox" checked={grant.canEdit} disabled={!grant.canView} onChange={(event) => changeGrant(module.id, "canEdit", event.target.checked)} /> Modification</label>
          </fieldset>;
        })}
      </div>
      <button type="submit" disabled={busy || !email.trim()}>Envoyer l'invitation</button>
    </form>
    <h3>Personnes invitées</h3>
    {members.length === 0 ? <p>Aucun collaborateur pour le moment.</p> : <ul className="team-members">
      {members.map((member) => <li key={member.id}>
        <strong>{member.email}</strong>
        <span>{member.status === "active" ? "Accès activé" : member.status === "pending" ? "En attente d'activation" : "Accès révoqué"}</span>
        <small>{member.grants.map((grant) => {
          const module = modules.find((item) => item.id === grant.moduleId);
          return module ? module.title + (grant.canEdit ? " · modification" : " · consultation") : null;
        }).filter(Boolean).join(" | ")}</small>
        {member.status !== "revoked" ? <button type="button" className="team-revoke" onClick={() => void revoke(member)} disabled={busy}>Révoquer l'accès</button> : null}
      </li>)}
    </ul>}
    <p role="status" aria-live="polite">{feedback}</p>
    <button type="button" className="team-secondary" onClick={() => void load()} disabled={busy}>Actualiser l'équipe</button>
  </section>;
}
`