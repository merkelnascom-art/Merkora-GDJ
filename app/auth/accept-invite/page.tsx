"use client";

import { useEffect, useState, type FormEvent } from "react";

type AuthUser = {
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export default function AcceptTeamInvitePage() {
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [feedback, setFeedback] = useState("Vérification du lien d'invitation…");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = hash.get("access_token") ?? "";
    const queryProjectId = new URLSearchParams(window.location.search).get("projectId") ?? "";
    if (!token || !url || !key) {
      setFeedback("Le lien d'invitation est incomplet ou expiré. Ouvrez l'application et connectez-vous avec l'adresse invitée pour activer l'accès.");
      return;
    }

    window.history.replaceState({}, "", window.location.pathname + window.location.search);
    setAccessToken(token);
    setProjectId(queryProjectId);
    void fetch(url + "/auth/v1/user", {
      headers: { apikey: key, Authorization: "Bearer " + token },
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error("Lien invalide ou expiré.");
      const user = await response.json() as AuthUser;
      setEmail(user.email ?? "");
      const invitedProject = user.user_metadata?.merkora_project_invitation;
      if (!queryProjectId && typeof invitedProject === "string") setProjectId(invitedProject);
      setFeedback("Votre invitation est vérifiée. Choisissez un mot de passe pour terminer l'activation.");
    }).catch((error: unknown) => {
      setFeedback(error instanceof Error ? error.message : "Impossible de vérifier l'invitation.");
      setAccessToken("");
    });
  }, []);

  async function activate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key || !accessToken || !projectId.trim()) {
      setFeedback("Le lien ou l'identifiant du projet est incomplet.");
      return;
    }
    if (password.length < 8 || password !== passwordConfirm) {
      setFeedback("Choisissez un mot de passe d'au moins 8 caractères et confirmez-le.");
      return;
    }

    setBusy(true);
    const passwordResponse = await fetch(url + "/auth/v1/user", {
      method: "PUT",
      headers: {
        apikey: key,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      cache: "no-store",
    });
    if (!passwordResponse.ok) {
      setBusy(false);
      setFeedback("Le mot de passe n'a pas pu être enregistré. Vérifiez les exigences de sécurité et réessayez.");
      return;
    }

    const acceptResponse = await fetch(url + "/functions/v1/project-team-accept", {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: projectId.trim() }),
      cache: "no-store",
    });
    const result = await acceptResponse.json().catch(() => ({})) as { ok?: boolean };
    setBusy(false);
    setPassword("");
    setPasswordConfirm("");
    if (!acceptResponse.ok || !result.ok) {
      setFeedback("Votre mot de passe est enregistré, mais l'accès à l'équipe n'a pas encore été activé. Connectez-vous à l'application et utilisez « Activer mon invitation ».");
      return;
    }
    setAccepted(true);
    setFeedback("Votre invitation est activée. Vous pouvez maintenant vous connecter à l'application avec cette adresse et votre nouveau mot de passe.");
  }

  return (
    <main className="page-shell">
      <section className="card auth-card">
        <p className="eyebrow">MerKora GDJ · Invitation d'équipe</p>
        <h1>Activer mon accès</h1>
        <p>La propriétaire vous a invité à rejoindre l'équipe de son projet. Votre accès sera limité aux modules qu'elle a choisis.</p>
        {email ? <p><strong>Adresse invitée :</strong> {email}</p> : null}
        {accepted ? (
          <p role="status" aria-live="polite">{feedback}</p>
        ) : accessToken ? (
          <form onSubmit={activate}>
            <label>Identifiant du projet<input required value={projectId} onChange={(event) => setProjectId(event.target.value)} /></label>
            <label>Nouveau mot de passe<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <label>Confirmer le mot de passe<input required type="password" minLength={8} autoComplete="new-password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} /></label>
            <button type="submit" disabled={busy}>{busy ? "Activation…" : "Définir mon mot de passe et accepter"}</button>
          </form>
        ) : null}
        <p role="status" aria-live="polite">{feedback}</p>
        <p><a href="/">Retour à MerKora GDJ</a></p>
      </section>
    </main>
  );
}
