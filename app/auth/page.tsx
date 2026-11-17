"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset, signInWithPassword, signUpWithPassword } from "@/lib/supabase/auth-actions";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = mode === "signin"
        ? await signInWithPassword({ email, password })
        : await signUpWithPassword({ email, password, displayName });
      if (result.ok) {
        setMessage(result.message ?? "Opération terminée.");
        if (mode === "signin") {
          const requested = new URLSearchParams(window.location.search).get("next");
          const destination = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/account";
          window.location.assign(destination);
        }
      } else setMessage(result.error);
    });
  }

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff" }}>
      <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY</small></span></Link><Link className="mk-back-link" href="/">← Retour</Link></header>
      <section style={{ maxWidth: 520, margin: "3rem auto", padding: "clamp(1.25rem,4vw,2.25rem)", border: "1px solid rgba(220,190,130,.28)", borderRadius: 24, background: "rgba(12,17,38,.86)" }}>
        <span className="mk-eyebrow"><span /> FONDATION B1 · COMPTE PERSONNEL</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>{mode === "signin" ? "Retrouvons ton espace." : "Créons ton compte."}</h1>
        <p style={{ opacity: .75 }}>Tes projets restent les tiens. La connexion permet de les retrouver et de les synchroniser entre tes appareils.</p>
        <div style={{ display: "flex", gap: 8, margin: "1.5rem 0" }}>
          <button type="button" className={mode === "signin" ? "mk-continue-button" : "mk-secondary-button"} onClick={() => { setMode("signin"); setMessage(""); }}>Connexion</button>
          <button type="button" className={mode === "signup" ? "mk-continue-button" : "mk-secondary-button"} onClick={() => { setMode("signup"); setMessage(""); }}>Créer un compte</button>
        </div>
        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          {mode === "signup" && <label style={{ display: "grid", gap: 6 }}>Nom ou prénom<input required autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} /></label>}
          <label style={{ display: "grid", gap: 6 }}>Adresse e-mail<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label style={{ display: "grid", gap: 6 }}>Mot de passe<input required type="password" minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button className="mk-continue-button" type="submit" disabled={isPending}>{isPending ? "Patiente un instant…" : mode === "signin" ? "Me connecter" : "Créer mon compte"} <span>→</span></button>
        </form>
        {mode === "signin" && <button type="button" className="mk-tertiary-button" onClick={() => startTransition(async () => { const result = await requestPasswordReset(email); setMessage(result.ok ? (result.message ?? "Consulte ta boîte e-mail.") : result.error); })} disabled={isPending}>Mot de passe oublié ?</button>}
        {message && <p role="status" aria-live="polite" style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.06)" }}>{message}</p>}
        <p style={{ fontSize: ".8rem", opacity: .65, marginTop: 20 }}>Si le service de compte n'est pas configuré, MerKora conserve le mode local. Aucun mot de passe n'est stocké dans le navigateur par MerKora.</p>
      </section>
    </main>
  );
}
