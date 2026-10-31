"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ConsentDetails = {
  clientName: string;
  redirectUri: string;
  scopes: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export default function OAuthConsentPage() {
  const [authorizationId, setAuthorizationId] = useState("");
  const [details, setDetails] = useState<ConsentDetails | null>(null);
  const [loginHref, setLoginHref] = useState("/");
  const [status, setStatus] = useState("Vérification de la demande d’autorisation…");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    let active = true;

    async function load() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("authorization_id")?.trim() ?? "";
      if (!id || id.length > 200) {
        setStatus("Demande d’autorisation invalide.");
        return;
      }
      setAuthorizationId(id);
      const returnTo = `/oauth/consent?authorization_id=${encodeURIComponent(id)}`;
      setLoginHref(`/?returnTo=${encodeURIComponent(returnTo)}`);

      if (!supabase) {
        setStatus("La connexion MerKora n’est pas configurée.");
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError) {
        setError("Impossible de vérifier votre session MerKora.");
        setStatus("Connexion requise.");
        return;
      }
      if (!sessionData.session) {
        setStatus("Connectez-vous à MerKora pour examiner cette demande.");
        return;
      }

      try {
        const { data, error: detailsError } = await supabase.auth.oauth.getAuthorizationDetails(id);
        if (detailsError) throw detailsError;
        if (!active || !isRecord(data)) return;

        if (typeof data.redirect_url === "string") {
          window.location.replace(data.redirect_url);
          return;
        }

        const client = isRecord(data.client) ? data.client : {};
        const clientName = typeof client.name === "string" ? client.name : "Application externe";
        const redirectUri = typeof data.redirect_uri === "string" ? data.redirect_uri : "Non communiqué";
        const scope = typeof data.scope === "string" ? data.scope.split(" ").filter(Boolean) : [];

        if (!("authorization_id" in data)) {
          throw new Error("La demande reçue ne contient pas les informations de consentement attendues.");
        }

        setDetails({ clientName, redirectUri, scopes: scope });
        setStatus("Examinez les accès demandés avant de choisir.");
      } catch {
        if (active) {
          setError("Cette demande d’autorisation est expirée, invalide ou indisponible. Relancez la connexion depuis votre assistant.");
          setStatus("Demande non disponible.");
        }
      }
    }

    void load();
    return () => { active = false; };
  }, [supabase]);

  async function decide(approve: boolean) {
    if (!supabase || !authorizationId || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = approve
        ? await supabase.auth.oauth.approveAuthorization(authorizationId)
        : await supabase.auth.oauth.denyAuthorization(authorizationId);
      if (result.error) throw result.error;
      const redirectUrl = isRecord(result.data) ? result.data.redirect_url : null;
      if (typeof redirectUrl !== "string") throw new Error("Missing OAuth redirect URL");
      window.location.assign(redirectUrl);
    } catch {
      setError("Votre choix n’a pas pu être transmis. Réessayez ou relancez la demande.");
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f6fb", color: "#172033", padding: "28px 18px", display: "grid", placeItems: "center", fontFamily: "Arial, sans-serif" }}>
      <section style={{ width: "min(100%, 620px)", background: "#fff", border: "1px solid #e5e7ef", borderRadius: 22, padding: "clamp(22px, 5vw, 38px)", boxShadow: "0 18px 50px rgba(30, 35, 70, .08)" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#6157c8", fontWeight: 800 }}>MerKora GDJ</Link>
        <p style={{ margin: "28px 0 8px", color: "#6b62c9", fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>AUTORISATION DE CONNEXION</p>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.15, margin: "0 0 12px" }}>Autoriser un assistant externe ?</h1>
        <p style={{ color: "#667085", lineHeight: 1.6 }}>{status}</p>

        {details && (
          <>
            <div style={{ background: "#f7f7fc", border: "1px solid #e8e7f4", borderRadius: 14, padding: 18, marginTop: 22 }}>
              <p style={{ margin: "0 0 6px", color: "#667085", fontSize: 12 }}>APPLICATION DEMANDEUSE</p>
              <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{details.clientName}</h2>
              <p style={{ fontSize: 12, color: "#667085", margin: "0 0 5px" }}>Adresse de retour déclarée</p>
              <p style={{ margin: 0, overflowWrap: "anywhere", fontSize: 13 }}>{details.redirectUri}</p>
              {details.scopes.length > 0 && (
                <>
                  <p style={{ fontSize: 12, color: "#667085", margin: "18px 0 7px" }}>SCOPES D’IDENTITÉ DEMANDÉS PAR LE FOURNISSEUR</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>{details.scopes.map((scope) => <li key={scope} style={{ padding: "3px 0" }}>{scope}</li>)}</ul>
                </>
              )}
            </div>

            <div style={{ marginTop: 18, padding: 18, border: "1px solid #dcebe5", background: "#f4faf7", borderRadius: 14 }}>
              <strong style={{ display: "block", marginBottom: 8 }}>Données et accès MCP</strong>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#344b42", lineHeight: 1.55 }}>
                <li>Votre identifiant de compte et votre adresse e-mail, pour identifier la session autorisée.</li>
                <li>La lecture de vos projets reste désactivée jusqu’à l’activation et la vérification des règles RLS dédiées aux clients OAuth.</li>
              </ul>
              <p style={{ margin: "12px 0 0", color: "#344b42", fontSize: 13, lineHeight: 1.5 }}>
                Les scopes OAuth affichés concernent l’identité. Les accès aux données MerKora sont contrôlés séparément par les règles RLS et les outils MCP. Aucun projet ne peut être modifié, aucun devis accepté, aucun paiement effectué et aucun déploiement lancé par les outils MCP actuels.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
              <button type="button" disabled={busy} onClick={() => void decide(false)} style={{ border: "1px solid #d6d9e2", borderRadius: 12, padding: 13, background: "#fff", color: "#344054", fontWeight: 800, cursor: busy ? "wait" : "pointer" }}>Refuser</button>
              <button type="button" disabled={busy} onClick={() => void decide(true)} style={{ border: 0, borderRadius: 12, padding: 13, background: "#5d55c7", color: "#fff", fontWeight: 800, cursor: busy ? "wait" : "pointer" }}>{busy ? "Transmission…" : "Autoriser l’accès"}</button>
            </div>
          </>
        )}

        {!details && status.includes("Connectez-vous") && (
          <Link href={loginHref} style={{ display: "block", marginTop: 18, textAlign: "center", borderRadius: 12, padding: 14, background: "#5d55c7", color: "#fff", textDecoration: "none", fontWeight: 800 }}>
            Se connecter à MerKora
          </Link>
        )}

        {error && <p role="alert" style={{ marginTop: 18, color: "#a12d27", background: "#fff0ef", padding: 12, borderRadius: 10 }}>{error}</p>}
        <p style={{ margin: "24px 0 0", color: "#7b8494", fontSize: 12, lineHeight: 1.5 }}>
          N’autorisez que les assistants que vous reconnaissez. Vous pourrez révoquer leurs accès depuis les paramètres de sécurité lorsque la gestion des autorisations sera activée.
        </p>
      </section>
    </main>
  );
}
