"use client";
import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { requestAdminOtp, verifyAdminOtp } from "@/lib/supabase/admin-auth-actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await requestAdminOtp(email);
      if (result.ok) {
        setStep("code");
        setMessage(result.message ?? "Code envoyé.");
      } else {
        setMessage(result.error);
      }
    });
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await verifyAdminOtp(email, code);
      if (result.ok) window.location.assign("/admin");
      else setMessage(result.error);
    });
  }

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff", display: "grid", placeItems: "center" }}>
      <section style={{ width: "100%", maxWidth: 520, padding: "clamp(1.4rem,4vw,2.5rem)", border: "1px solid rgba(220,190,130,.32)", borderRadius: 24, background: "rgba(12,17,38,.9)", boxShadow: "0 24px 80px rgba(0,0,0,.25)" }}>
        <Link className="mk-brand" href="/" aria-label="MerKora GDJ accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora GDJ</strong><small>ADMINISTRATION SÉCURISÉE</small></span>
        </Link>
        <div style={{ marginTop: 38 }}>
          <span className="mk-eyebrow"><span /> ACCÈS ADMINISTRATEUR UNIQUE</span>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 10 }}>
            {step === "email" ? "Bienvenue, administrateur." : "Vérifie ta boîte e-mail."}
          </h1>
          <p style={{ opacity: .75, lineHeight: 1.7 }}>
            {step === "email"
              ? "Saisis ton adresse e-mail administrateur. Un code temporaire sera envoyé si l'adresse est autorisée."
              : "Saisis le code à six chiffres reçu à l'adresse que tu viens de renseigner."}
          </p>
        </div>
        {step === "email" ? (
          <form onSubmit={submitEmail} style={{ display: "grid", gap: 16, marginTop: 26 }}>
            <label style={{ display: "grid", gap: 8 }}>
              Adresse e-mail
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Saisis ton adresse e-mail"
              />
            </label>
            <button className="mk-continue-button" type="submit" disabled={isPending}>
              {isPending ? "Envoi du code…" : "Recevoir mon code"} <span>→</span>
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} style={{ display: "grid", gap: 16, marginTop: 26 }}>
            <label style={{ display: "grid", gap: 8 }}>
              Code de vérification
              <input
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                value={code}
                onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                style={{ letterSpacing: ".35em", fontSize: "1.4rem", textAlign: "center" }}
              />
            </label>
            <button className="mk-continue-button" type="submit" disabled={isPending || code.length !== 6}>
              {isPending ? "Vérification…" : "Valider et entrer"} <span>→</span>
            </button>
            <button type="button" className="mk-secondary-button" disabled={isPending} onClick={() => { setStep("email"); setCode(""); setMessage(""); }}>
              Changer d'adresse
            </button>
            <button type="button" className="mk-tertiary-button" disabled={isPending} onClick={() => startTransition(async () => {
              const result = await requestAdminOtp(email);
              setMessage(result.ok ? (result.message ?? "Nouveau code envoyé.") : result.error);
            })}>
              Renvoyer un code
            </button>
          </form>
        )}
        {message && <p role="status" aria-live="polite" style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.07)" }}>{message}</p>}
        <p style={{ fontSize: ".78rem", opacity: .58, marginTop: 26 }}>
          Accès réservé à une seule identité administrateur. Les comptes clients et collaborateurs ne peuvent pas ouvrir cet espace.
        </p>
      </section>
    </main>
  );
}
