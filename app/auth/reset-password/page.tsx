"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { updatePassword } from "@/lib/supabase/auth-actions";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updatePassword(password);
      setMessage(result.ok ? (result.message ?? "Mot de passe mis à jour.") : result.error);
      if (result.ok) window.setTimeout(() => window.location.assign("/account"), 900);
    });
  }

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff" }}>
      <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>SÉCURITÉ DU COMPTE</small></span></Link></header>
      <section style={{ maxWidth: 520, margin: "4rem auto", padding: "2rem", border: "1px solid rgba(220,190,130,.28)", borderRadius: 24, background: "rgba(12,17,38,.86)" }}>
        <span className="mk-eyebrow"><span /> RÉINITIALISATION</span>
        <h1>Nouveau mot de passe.</h1>
        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6 }}>Nouveau mot de passe<input type="password" minLength={8} required autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} /></label>
          <button className="mk-continue-button" disabled={isPending}>{isPending ? "Mise à jour…" : "Enregistrer le mot de passe"} <span>→</span></button>
        </form>
        {message && <p role="status" aria-live="polite">{message}</p>}
      </section>
    </main>
  );
}
