"use client";

import React, { useEffect, useMemo, useState } from "react";
import { buildVisualPrototypeModel, type VisualPrototypeModel } from "../../src/lib/merkora-core/visual-prototype";
import type { ProjectUnderstanding } from "../../src/lib/merkora-core/project-diagnostic";
import type { ProductDefinitionSession } from "../../src/lib/merkora-core/product-definition";
import type { SolutionProposal } from "../../src/lib/merkora-core/solution-proposal";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const PROPOSAL_KEY = "merkora-v2-solution-proposal";

interface StoredProposal {
  definitionVersion: number;
  proposal: SolutionProposal;
  validated: boolean;
}

export default function VisualPrototypePage() {
  const [model, setModel] = useState<VisualPrototypeModel | null>(null);
  const [activeView, setActiveView] = useState("Vue d'ensemble");
  const [activeProfile, setActiveProfile] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [changeRequest, setChangeRequest] = useState("");
  const [proposalIdentity, setProposalIdentity] = useState<{ id: string; version: number } | null>(null);
  const [prototypeValidated, setPrototypeValidated] = useState(false);

  useEffect(() => {
    try {
      const dossierRaw = sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = sessionStorage.getItem(DEFINITION_KEY);
      const proposalRaw = sessionStorage.getItem(PROPOSAL_KEY);
      if (!dossierRaw || !definitionRaw || !proposalRaw) {
        setNotice("Les décisions des étapes précédentes sont introuvables dans cet onglet.");
        setLoaded(true);
        return;
      }
      const dossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
      const definition = JSON.parse(definitionRaw) as ProductDefinitionSession;
      const stored = JSON.parse(proposalRaw) as StoredProposal;
      if (!stored.validated || definition.status !== "ready_for_review" || stored.definitionVersion !== definition.version) {
        setNotice("Valide d'abord la composition à l'écran 06 pour préparer une maquette fidèle à tes décisions.");
        setLoaded(true);
        return;
      }
      const nextModel = buildVisualPrototypeModel(dossier, definition, stored.proposal);
      setProposalIdentity({ id: stored.proposal.id, version: stored.proposal.version });
      const validationRaw = sessionStorage.getItem("merkora-v2-visual-prototype-validation");
      if (validationRaw) {
        const validation = JSON.parse(validationRaw) as { proposalId?: string; proposalVersion?: number };
        setPrototypeValidated(validation.proposalId === stored.proposal.id && validation.proposalVersion === stored.proposal.version);
      }
      setModel(nextModel);
      setActiveProfile(nextModel.profiles[0] ?? "");
    } catch {
      setNotice("Les données du projet n'ont pas pu être lues. Retourne vérifier les étapes précédentes.");
    }
    setLoaded(true);
  }, []);

  const visibleComponents = useMemo(() => {
    if (!model) return [];
    if (activeView === "Vue d'ensemble") return model.components;
    const familyMap: Record<string, string[]> = {
      "Profils": ["users_roles"],
      "Espaces": ["spaces"],
      "Parcours": ["navigation"],
      "Fonctions": ["functionalities", "nature"],
      "Interactions": ["interactions"],
      "Données": ["data"],
      "Ressources": ["integrations_equipment"],
      "Contrôles": ["security_control"],
      "Finances": ["finances"],
      "Identité": ["visual_identity"],
      "Déroulement": ["operations"],
    };
    const families = familyMap[activeView] ?? [];
    return model.components.filter((item) => families.includes(item.familyId ?? ""));
  }, [model, activeView]);

  function simulateAction(label: string) {
    setNotice("Aperçu interactif : « " + label + " » — cette action est simulée, elle n'enregistre aucune opération réelle.");
  }

  function saveChangeRequest() {
    if (!changeRequest.trim() || !proposalIdentity) return;
    sessionStorage.setItem("merkora-v2-visual-prototype-change-request", JSON.stringify({
      proposalId: proposalIdentity.id,
      proposalVersion: proposalIdentity.version,
      request: changeRequest.trim(),
      createdAt: new Date().toISOString(),
      status: "draft_for_review",
    }));
    setNotice("Ta demande de modification a été conservée dans cette session pour être reprise à l'étape de spécification.");
    setChangeRequest("");
    setShowRequest(false);
  }

  function validatePrototype() {
    if (!proposalIdentity) return;
    sessionStorage.setItem("merkora-v2-visual-prototype-validation", JSON.stringify({
      proposalId: proposalIdentity.id,
      proposalVersion: proposalIdentity.version,
      validatedAt: new Date().toISOString(),
      status: "validated_by_client",
    }));
    setPrototypeValidated(true);
    setNotice("Maquette validée pour cette version de la composition. Cette validation est conservée dans cet onglet.");
  }

  return (
    <main className="mk-v2-page mk-stage-page mk-prototype-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
      </header>

      <section className="mk-stage-shell mk-prototype-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span><span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span><span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span><span className="done">06 · Solution</span>
            <span className="active">07 · Maquette</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 07 · VISUALISATION DU PRODUIT</span>
          <h1>Découvrons ton futur<br /><em>produit en situation.</em></h1>
          <p>Voici une première représentation construite à partir des éléments que tu as retenus. Explore-la, change de profil et demande des ajustements.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation de la maquette…</p></section>}
        {loaded && !model && (
          <section className="mk-stage-empty">
            <h2>Maquette non disponible</h2><p>{notice}</p>
            <a className="mk-continue-button" href="/solution-proposal">Revenir à l'écran 06 <span>→</span></a>
          </section>
        )}

        {model && (
          <>
            <div className="mk-prototype-toolbar">
              <div><span className="mk-prototype-live-dot" /> APERÇU DU PROJET <small>{model.mode === "digital" ? "PROTOTYPE NUMÉRIQUE" : "VISUALISATION OPÉRATIONNELLE"}</small></div>
              <button type="button" onClick={() => { setShowRequest((value) => !value); setNotice(""); }}>Demander une modification</button>
            </div>

            {showRequest && <section className="mk-prototype-request"><label htmlFor="mk-prototype-change">Quelle modification souhaites-tu apporter ?</label><textarea id="mk-prototype-change" value={changeRequest} onChange={(event) => setChangeRequest(event.target.value)} placeholder="Décris la partie à modifier et le résultat que tu souhaites…" /><div><button type="button" className="quiet" onClick={() => setShowRequest(false)}>Annuler</button><button type="button" disabled={!changeRequest.trim()} onClick={saveChangeRequest}>Conserver ma demande</button></div></section>}
            <section className="mk-prototype-workspace">
              <aside className="mk-prototype-sidebar">
                <div className="mk-prototype-brand"><span>{model.title.slice(0, 1).toUpperCase()}</span><div><strong>{model.title}</strong><small>{model.mode === "digital" ? "ESPACE DE GESTION" : "ORGANISATION DU PROJET"}</small></div></div>
                {model.profiles.length > 0 && (
                  <label className="mk-prototype-profile">APERÇU EN TANT QUE
                    <select value={activeProfile} onChange={(event) => setActiveProfile(event.target.value)}>
                      {model.profiles.map((profile) => <option key={profile} value={profile}>{profile}</option>)}
                    </select>
                  </label>
                )}
                <span className="mk-prototype-nav-label">{model.mode === "digital" ? "MENU PRINCIPAL" : "VUES DU PROJET"}</span>
                <nav aria-label="Navigation de la maquette">
                  {model.navigation.map((view) => (
                    <button type="button" key={view} className={activeView === view ? "is-active" : ""} onClick={() => { setActiveView(view); setNotice(""); }}>
                      <span>{view === "Vue d'ensemble" ? "◫" : view === "Profils" ? "◎" : view === "Finances" ? "◈" : view === "Déroulement" ? "↗" : "◇"}</span>{view}
                    </button>
                  ))}
                </nav>
                <div className="mk-prototype-sidebar-foot"><span>APERÇU CONCEPTUEL</span><small>Les données affichées sont illustratives.</small></div>
              </aside>

              <div className="mk-prototype-canvas">
                <div className="mk-prototype-topbar"><div><span>PROJET</span><strong>{model.title}</strong></div><div className="mk-prototype-top-actions"><span className="mk-prototype-avatar">{(activeProfile || "P").slice(0,1).toUpperCase()}</span><small>{activeProfile || "Vue générale"}</small></div></div>
                <div className="mk-prototype-content">
                  <div className="mk-prototype-greeting"><div><span className="mk-prototype-overline">{activeView.toUpperCase()}</span><h2>{activeView === "Vue d'ensemble" ? "Bonjour, bienvenue." : activeView}</h2><p>{activeView === "Vue d'ensemble" ? model.description : "Voici les éléments prévus dans cette partie de la solution."}</p></div><button type="button" onClick={() => simulateAction("Créer un nouvel élément")}>＋ Nouvelle action</button></div>

                  {model.mode === "digital" ? (
                    <>
                      <div className="mk-prototype-stat-grid">
                        <article><span>OBJECTIF DU PROJET</span><strong>{model.objective || "À préciser"}</strong><small>Résultat attendu</small></article>
                        <article><span>COMPOSANTS RETENUS</span><strong>{visibleComponents.length}</strong><small>Éléments validés</small></article>
                        <article><span>PROFIL ACTUEL</span><strong>{activeProfile || "Général"}</strong><small>Perspective de consultation</small></article>
                      </div>
                      <div className="mk-prototype-panel">
                        <div className="mk-prototype-panel-heading"><div><span>COMPOSITION VALIDÉE</span><h3>{activeView === "Vue d'ensemble" ? "Fonctions et espaces prévus" : "Contenu de cette rubrique"}</h3></div><small>{visibleComponents.length} élément(s)</small></div>
                        {visibleComponents.length ? <div className="mk-prototype-feature-grid">{visibleComponents.map((component) => <article key={component.id}><span className="mk-prototype-feature-icon">✧</span><div><strong>{component.title}</strong><p>{component.description}</p><button type="button" onClick={() => simulateAction("Ouvrir " + component.title)}>Ouvrir cette partie →</button></div></article>)}</div> : <p className="mk-prototype-empty-note">Aucun élément validé pour cette rubrique. Rien n'a été ajouté automatiquement.</p>}
                      </div>
                      <div className="mk-prototype-lower-grid"><article className="mk-prototype-panel"><span>LE BESOIN INITIAL</span><p>{model.problem}</p></article><article className="mk-prototype-panel"><span>PROCHAINE ÉTAPE</span><p>Préciser les écrans et les détails d'utilisation de cette partie.</p></article></div>
                    </>
                  ) : (
                    <>
                      <div className="mk-prototype-operation-hero"><span>OBJECTIF DU PROJET</span><h3>{model.objective || "Résultat à définir avec toi"}</h3><p>{model.problem}</p></div>
                      <div className="mk-prototype-panel"><div className="mk-prototype-panel-heading"><div><span>ORGANISATION PROPOSÉE</span><h3>Éléments retenus pour l'activité</h3></div></div>
                        {visibleComponents.length ? <div className="mk-prototype-process">{visibleComponents.map((component, index) => <article key={component.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{component.title}</strong><p>{component.description}</p></div><button type="button" onClick={() => simulateAction("Examiner " + component.title)}>Examiner</button></article>)}</div> : <p className="mk-prototype-empty-note">Aucun élément validé dans cette rubrique pour le moment.</p>}
                      </div>
                      <div className="mk-prototype-lower-grid"><article className="mk-prototype-panel"><span>PERSONNES CONCERNÉES</span><p>{model.profiles.join(" · ") || "Les profils restent à préciser."}</p></article><article className="mk-prototype-panel"><span>RESSOURCES ET POINTS À PRÉCISER</span><p>{model.unresolvedPoints.slice(0, 3).join(" · ") || "Aucun point bloquant signalé dans la proposition."}</p></article></div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <div className="mk-prototype-bottom-note"><span>✦</span><p>Cette maquette est une représentation de conception. Les boutons illustrent les interactions ; aucune commande réelle, transaction ou donnée métier n'est exécutée.</p></div>
            {notice && <div className="mk-prototype-notice" role="status">{notice}</div>}
            <div className="mk-prototype-validation"><div><strong>La représentation correspond-elle à ton idée ?</strong><p>Tu peux demander des changements avant de passer à la spécification détaillée.</p></div><button type="button" onClick={validatePrototype} disabled={prototypeValidated}>{prototypeValidated ? "Maquette validée ✓" : "Valider cette maquette →"}</button></div>
          </>
        )}
      </section>
    </main>
  );
}
