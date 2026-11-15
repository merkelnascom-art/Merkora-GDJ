"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { browserDossierStorage, readLocalDossiers, saveLocalDossier, type LocalDossier } from "@/lib/dossiers/local-dossiers";

type CloudDossier = { id: string; title: string; payload: unknown; version: number; updated_at: string };

export default function ProjectsPage() {
  const [local, setLocal] = useState<LocalDossier[]>([]);
  const [cloud, setCloud] = useState<CloudDossier[]>([]);
  const [status, setStatus] = useState("Les dossiers locaux restent disponibles même sans connexion.");
  const [busy, setBusy] = useState(false);

  function refreshLocal() {
    const storage = browserDossierStorage();
    if (storage) setLocal(readLocalDossiers(storage));
  }

  useEffect(() => {
    refreshLocal();
    void loadCloud();
  }, []);

  async function loadCloud() {
    try {
      const response = await fetch("/api/dossiers", { cache: "no-store" });
      if (response.status === 401) { setStatus("Connecte-toi pour synchroniser tes dossiers sur plusieurs appareils."); return; }
      if (response.status === 503) { setStatus("La synchronisation cloud attend la configuration sécurisée de Supabase."); return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Chargement impossible.");
      setCloud(body.dossiers ?? []);
      setStatus("Dossiers cloud chargés.");
    } catch { setStatus("Le cloud est momentanément indisponible. Tes dossiers locaux sont conservés."); }
  }

  function restoreCloud(dossier: CloudDossier) {
    const storage = browserDossierStorage();
    if (!storage) { setStatus("Le stockage local de ce navigateur est indisponible."); return; }
    try {
      saveLocalDossier(storage, { id: dossier.id, title: dossier.title, payload: dossier.payload, version: dossier.version, syncedVersion: dossier.version, updatedAt: new Date().toISOString() });
      if (dossier.payload && typeof dossier.payload === "object") window.sessionStorage.setItem("merkora-v2-understanding-session", JSON.stringify(dossier.payload));
      window.sessionStorage.removeItem("merkora-v2-new-journey");
      refreshLocal();
      setStatus("Dossier restauré sur cet appareil. L'original cloud reste intact.");
    } catch {
      setStatus("Impossible d'enregistrer ce dossier sur cet appareil. Aucun dossier cloud n'a été supprimé.");
    }
  }

  async function syncLocal() {
    setBusy(true);
    let saved = 0;
    let conflicts = 0;
    try {
      for (const dossier of local) {
        const exists = cloud.find(item => item.id === dossier.id);
        if (exists && dossier.syncedVersion === undefined) { conflicts++; continue; }
        const response = exists
          ? await fetch("/api/dossiers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: dossier.id, title: dossier.title, payload: dossier.payload, expectedVersion: dossier.syncedVersion }) })
          : await fetch("/api/dossiers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dossier) });
        const body = await response.json().catch(() => ({}));
        if (response.status === 409) conflicts++;
        else if (response.ok && body.dossier) {
          saved++;
          const storage = browserDossierStorage();
          if (storage) saveLocalDossier(storage, { ...dossier, syncedVersion: body.dossier.version });
        } else if (response.status === 401 || response.status === 503) {
          setStatus("Connexion ou configuration cloud nécessaire. Aucun dossier local n'a été supprimé.");
          return;
        }
      }
      refreshLocal();
      await loadCloud();
      setStatus(`Synchronisation terminée : ${saved} dossier(s) synchronisé(s), ${conflicts} conflit(s) à vérifier. Les originaux locaux sont conservés.`);
    } finally { setBusy(false); }
  }

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff" }}>
      <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>ESPACE PROJETS · FONDATION B2</small></span></Link><Link className="mk-back-link" href="/account">Mon compte</Link></header>
      <section style={{ maxWidth: 900, margin: "3rem auto" }}>
        <span className="mk-eyebrow"><span /> TES DOSSIERS, SUR TES APPAREILS</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>Mes projets.</h1>
        <p style={{ opacity: .75 }}>{status}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "1.5rem 0" }}>
          <button className="mk-continue-button" onClick={syncLocal} disabled={busy || local.length === 0}>{busy ? "Synchronisation…" : "Synchroniser mes dossiers locaux"} <span>↗</span></button>
          <Link className="mk-secondary-button" href="/conversation">Créer un projet <span>→</span></Link>
        </div>
        <h2>Dossiers sur cet appareil ({local.length})</h2>
        {local.length === 0 ? <p>Aucun dossier local enregistré pour le moment. Commence une conversation pour créer ton premier dossier.</p> : <div style={{ display: "grid", gap: 12 }}>{local.map(item => <article key={item.id} style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}><strong>{item.title}</strong><p style={{ opacity: .65, fontSize: ".8rem" }}>Mis à jour : {new Date(item.updatedAt).toLocaleString("fr-FR")} · Version locale {item.version}{item.syncedVersion !== undefined ? ` · Version cloud synchronisée ${item.syncedVersion}` : " · Non synchronisé"}</p></article>)}</div>}
        <h2 style={{ marginTop: 32 }}>Dossiers synchronisés ({cloud.length})</h2>
        {cloud.length === 0 ? <p>Aucun dossier cloud chargé. Connecte-toi et configure la synchronisation pour les retrouver sur d'autres appareils.</p> : <div style={{ display: "grid", gap: 12 }}>{cloud.map(item => <article key={item.id} style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}><strong>{item.title}</strong><p style={{ opacity: .65, fontSize: ".8rem" }}>Version cloud {item.version} · {new Date(item.updated_at).toLocaleString("fr-FR")}</p><button className="mk-secondary-button" onClick={() => restoreCloud(item)}>Restaurer sur cet appareil</button></article>)}</div>}
      </section>
    </main>
  );
}
