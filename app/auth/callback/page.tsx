"use client";

import { useEffect, useRef, useState } from "react";

export default function AuthCallbackPage() {
  const started = useRef(false);
  const [message, setMessage] = useState("Vérification de votre adresse e-mail…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function finishConfirmation() {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = Number(params.get("expires_in") || "3600");
      const authError = params.get("error_description") || params.get("error");

      // Remove tokens and errors from the address bar before making any request.
      window.history.replaceState({}, document.title, window.location.pathname);

      if (authError) {
        setFailed(true);
        setMessage("Le lien de confirmation est expiré ou invalide. Revenez à MerKora et créez un nouveau compte si nécessaire.");
        return;
      }
      if (!accessToken || !refreshToken || !Number.isFinite(expiresIn)) {
        setFailed(true);
        setMessage("Aucune session de confirmation n’a été reçue. Vérifiez que vous avez ouvert le lien le plus récent reçu par e-mail.");
        return;
      }

      try {
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn }),
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({})) as { error?: string; authenticated?: boolean };
        if (!response.ok || data.authenticated !== true) {
          setFailed(true);
          setMessage(data.error || "La confirmation a échoué. Demandez un nouveau lien et réessayez.");
          return;
        }
        setMessage("Adresse confirmée. Ouverture de votre espace MerKora…");
        window.location.replace("/");
      } catch {
        setFailed(true);
        setMessage("Connexion momentanément indisponible. Votre dossier local est conservé; réessayez dans un instant.");
      }
    }

    void finishConfirmation();
  }, []);

  return (
    <main className="auth-callback-page">
      <section className="auth-callback-card" aria-live="polite">
        <span className={`auth-callback-mark ${failed ? "is-error" : ""}`}>{failed ? "!" : "M"}</span>
        <p className="eyebrow">MERKORA GDJ · COMPTE SÉCURISÉ</p>
        <h1>{failed ? "Confirmation non terminée" : "Confirmation de votre compte"}</h1>
        <p>{message}</p>
        <a className="button button-primary" href="/">Retourner sur MerKora</a>
      </section>
    </main>
  );
}
