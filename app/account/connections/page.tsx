"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type OAuthGrant = {
  id: string;
  client_id: string;
  client_name: string;
  scopes: string[];
  created_at: string;
  updated_at: string;
};

function isGrant(value: unknown): value is OAuthGrant {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return typeof item.client_id === "string"
    && typeof item.client_name === "string"
    && Array.isArray(item.scopes)
    && item.scopes.every((scope) => typeof scope === "string");
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date inconnue" : new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AccountConnectionsPage() {
  const supabase = getSupabaseBrowserClient();
  const [grants, setGrants] = useState<OAuthGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revoking, setRevoking] = useState<string | null>(null);

  const loadGrants = useCallback(async () => {
    if (!supabase) {
      setError("La connexion à MerKora n’est pas configurée.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError("Impossible de vérifier votre session. Reconnectez-vous.");
      setLoading(false);
      return;
    }
    if (!sessionData.session) {
      setSignedIn(false);
      setGrants([]);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    const { data, error: grantsError } = await supabase.auth.oauth.getUserGrants();
    if (grantsError) {
      setError("Impossible de charger les autorisations OAuth. Vérifiez que le serveur OAuth est activé dans Supabase.");
      setGrants([]);
    } else {
      const values: unknown = data;
      setGrants(Array.isArray(values) ? values.filter(isGrant) : []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadGrants();
  }, [loadGrants]);

  async function revoke(clientId: string) {
    if (!supabase || revoking) return;
    const grant = grants.find((item) => item.client_id === clientId);
    if (!grant) return;
    const confirmed = window.confirm(`Révoquer l’accès de « ${grant.client_name} » à votre compte MerKora ?`);
    if (!confirmed) return;

    setRevoking(clientId);
    setError("");
    setNotice("");
    const { error: revokeError } = await supabase.auth.oauth.revokeGrant(clientId);
    if (revokeError) {
      setError("La révocation a échoué. Réessayez.");
    } else {
      setNotice(`L’accès de « ${grant.client_name} » a été révoqué.`);
      await loadGrants();
    }
    setRevoking(null);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f6f7fb", color: "#172033", padding: "clamp(20px, 4vw, 48px)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#5d55bd", textDecoration: "none", fontWeight: 700 }}>← Retour à MerKora GDJ</Link>
        <header style={{ margin: "28px 0" }}>
          <p style={{ color: "#6d65c8", fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>COMPTE · SÉCURITÉ</p>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 42px)", margin: "8px 0" }}>Applications autorisées</h1>
          <p style={{ color: "#667085", maxWidth: 680, lineHeight: 1.65 }}>
            Consultez les applications externes auxquelles vous avez donné accès à votre compte MerKora. Vous pouvez révoquer une autorisation à tout moment.
          </p>
        </header>

        <section style={{ background: "#fff", border: "1px solid #e6e8ef", borderRadius: 18, padding: "clamp(18px, 4vw, 28px)" }}>
          {!signedIn && !loading && (
            <div>
              <h2 style={{ marginTop: 0 }}>Connexion requise</h2>
              <p style={{ color: "#667085" }}>Connectez-vous à MerKora pour consulter et gérer les accès externes de votre compte.</p>
              <Link href="/" style={{ display: "inline-block", background: "#5d55c7", color: "#fff", borderRadius: 10, padding: "11px 16px", textDecoration: "none", fontWeight: 700 }}>Se connecter</Link>
            </div>
          )}
          {loading && <p role="status">Chargement des autorisations…</p>}
          {signedIn && !loading && grants.length === 0 && !error && (
            <div>
              <h2 style={{ marginTop: 0 }}>Aucune application autorisée</h2>
              <p style={{ color: "#667085" }}>Lorsqu’un assistant ou un outil sera connecté à MerKora avec votre accord, son accès apparaîtra ici.</p>
            </div>
          )}
          {signedIn && grants.map((grant) => (
            <article key={grant.client_id} style={{ border: "1px solid #e7e9f0", borderRadius: 14, padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>{grant.client_name}</h2>
                  <p style={{ color: "#667085", fontSize: 12, overflowWrap: "anywhere", margin: "0 0 12px" }}>Identifiant client : {grant.client_id}</p>
                  <p style={{ fontSize: 12, color: "#667085", margin: "0 0 6px" }}>Autorisations OAuth</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {grant.scopes.map((scope) => <span key={scope} style={{ fontSize: 11, padding: "5px 8px", borderRadius: 7, background: "#f0efff", color: "#5550a8" }}>{scope}</span>)}
                    {grant.scopes.length === 0 && <span style={{ fontSize: 12, color: "#667085" }}>Aucun scope communiqué</span>}
                  </div>
                  <p style={{ color: "#667085", fontSize: 12, margin: "12px 0 0" }}>Autorisé le {formatDate(grant.created_at)}</p>
                </div>
                <button type="button" disabled={revoking !== null} onClick={() => void revoke(grant.client_id)} style={{ border: "1px solid #e6c8c5", background: "#fff7f6", color: "#a12d27", borderRadius: 9, padding: "9px 12px", fontWeight: 700, cursor: revoking ? "wait" : "pointer" }}>
                  {revoking === grant.client_id ? "Révocation…" : "Révoquer l’accès"}
                </button>
              </div>
            </article>
          ))}
          {error && <p role="alert" style={{ marginTop: 16, color: "#a12d27", background: "#fff0ef", padding: 12, borderRadius: 10 }}>{error}</p>}
          {notice && <p role="status" style={{ marginTop: 16, color: "#176b3a", background: "#e9f8ef", padding: 12, borderRadius: 10 }}>{notice}</p>}
          {signedIn && !loading && <button type="button" onClick={() => void loadGrants()} style={{ marginTop: 12, border: "1px solid #d6d9e2", background: "#fff", borderRadius: 9, padding: "9px 12px", color: "#344054", fontWeight: 700 }}>Actualiser</button>}
        </section>
      </div>
    </main>
  );
}
