"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getIntegrationStatusPresentation } from "@/lib/integrations/presentation";

type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  authMethod: string;
  directions: ("outbound" | "inbound")[];
  transport: string;
  capabilities: string[];
  initialStatus: "not_configured";
  verificationRequired: boolean;
  connectionNotes: string;
};

const categoryLabels: Record<string, string> = {
  development: "Développement",
  infrastructure: "Infrastructure",
  ai: "Intelligence artificielle",
  design: "Design",
  video: "Vidéo & création",
  builder: "Constructeurs",
};

const authLabels: Record<string, string> = {
  oauth: "Autorisation sécurisée (OAuth)",
  api_key: "Clé API (à configurer)",
  manual: "Utilisation manuelle",
  external_link: "Lien externe",
  none: "Aucune authentification",
};

const directionLabels: Record<string, string> = {
  outbound: "MerKora → outil",
  inbound: "Outil → MerKora",
};

const transportLabels: Record<string, string> = {
  oauth: "OAuth",
  rest_api: "API REST",
  mcp: "MCP",
  manual_handoff: "Passage manuel",
  verified_webhook: "Webhook vérifié",
};

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/integrations", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { integrations?: Integration[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "Accès refusé.");
        if (active) setIntegrations(Array.isArray(payload.integrations) ? payload.integrations : []);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Impossible de charger les intégrations.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const grouped = useMemo(() => integrations.reduce<Record<string, Integration[]>>((groups, item) => {
    (groups[item.category] ??= []).push(item);
    return groups;
  }, {}), [integrations]);

  return (
    <main style={{ minHeight: "100vh", background: "#f6f7fb", color: "#172033", padding: "clamp(20px, 4vw, 48px)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#5d55bd", textDecoration: "none", fontWeight: 700 }}>← Retour à MerKora GDJ</Link>
        <header style={{ margin: "28px 0 24px" }}>
          <p style={{ color: "#6d65c8", fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>CENTRE DE CONTRÔLE · ADMINISTRATION</p>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", margin: "8px 0" }}>Écosystème d’intégrations</h1>
          <p style={{ color: "#667085", maxWidth: 720, lineHeight: 1.6 }}>Les outils que MerKora pourra coordonner. Une présence dans ce catalogue ne signifie pas qu’un compte est connecté ou qu’une dépense est autorisée.</p>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
          <Summary label="Outils référencés" value={integrations.length} />
          <Summary label="Connexions actives" value={0} />
          <Summary label="Flux bidirectionnels prévus" value={integrations.filter((item) => item.directions.includes("inbound") && item.directions.includes("outbound")).length} />
          <Summary label="Vérifications nécessaires" value={integrations.filter((item) => item.verificationRequired).length} />
        </section>

        {loading && <p role="status">Chargement du catalogue sécurisé…</p>}
        {error && <div role="alert" style={{ background: "#fff1f0", color: "#9b2922", padding: 18, borderRadius: 14 }}>{error} <p>Connectez-vous avec un compte administrateur autorisé, puis rechargez cette page.</p></div>}

        {!loading && !error && Object.entries(grouped).map(([category, items]) => (
          <section key={category} style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, marginBottom: 12 }}>{categoryLabels[category] ?? category}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", gap: 14 }}>
              {items.map((item) => {
                const status = getIntegrationStatusPresentation(item.initialStatus);
                return (
                  <article key={item.id} style={{ background: "#fff", border: "1px solid #e6e8ef", borderRadius: 18, padding: 20, boxShadow: "0 5px 18px rgba(25, 30, 60, .04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <h3 style={{ fontSize: 18, margin: 0 }}>{item.name}</h3>
                      <span style={{ fontSize: 11, borderRadius: 99, padding: "6px 9px", background: status.tone === "success" ? "#e9f8ef" : status.tone === "warning" ? "#fff5df" : "#eef0f4", color: status.tone === "success" ? "#176b3a" : status.tone === "warning" ? "#8a5a00" : "#596273", whiteSpace: "nowrap" }}>{status.label}</span>
                    </div>
                    <p style={{ color: "#667085", lineHeight: 1.5, minHeight: 46 }}>{item.description}</p>
                    <p style={{ fontSize: 12, color: "#475467" }}><strong>Autorisation :</strong> {authLabels[item.authMethod] ?? item.authMethod}</p>
                    <p style={{ fontSize: 12, color: "#475467" }}><strong>Transport :</strong> {transportLabels[item.transport] ?? item.transport}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
                      {item.directions.map((direction) => <span key={direction} style={{ fontSize: 10, color: "#175c49", background: "#e8f5f0", padding: "5px 7px", borderRadius: 6 }}>{directionLabels[direction]}</span>)}
                    </div>
                    {item.verificationRequired && <p style={{ fontSize: 12, color: "#8a5a00", background: "#fff8e8", padding: 9, borderRadius: 9 }}>Vérification préalable requise</p>}
                    <p style={{ fontSize: 13, lineHeight: 1.5 }}>{item.connectionNotes}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                      {item.capabilities.map((capability) => <span key={capability} style={{ fontSize: 10, color: "#5550a8", background: "#f0efff", padding: "5px 7px", borderRadius: 6 }}>{capability}</span>)}
                    </div>
                    <button type="button" disabled style={{ marginTop: 18, width: "100%", border: 0, borderRadius: 10, padding: 11, background: "#eceef3", color: "#737b8a", fontWeight: 700, cursor: "not-allowed" }}>Connexion à construire</button>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        <p style={{ color: "#778092", fontSize: 12, marginTop: 36 }}>Sécurité : aucune clé API n’est affichée ici. Les connexions, autorisations et budgets seront ajoutés séparément après validation.</p>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <article style={{ background: "#fff", border: "1px solid #e6e8ef", borderRadius: 14, padding: 18 }}>
    <p style={{ color: "#667085", fontSize: 12, margin: 0 }}>{label}</p>
    <strong style={{ display: "block", fontSize: 28, marginTop: 7 }}>{value}</strong>
  </article>;
}
