"use client";

import React, { useEffect, useMemo, useState } from "react";
import { buildVisualBlueprint, type VisualBlueprint } from "../../src/lib/merkora-core/visual-blueprint";
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

export default function VisualisationPage() {
  const [blueprint, setBlueprint] = useState<VisualBlueprint | null>(null);
  const [activeProfile, setActiveProfile] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    try {
      const dossierRaw = window.sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = window.sessionStorage.getItem(DEFINITION_KEY);
      const proposalRaw = window.sessionStorage.getItem(PROPOSAL_KEY);
      if (!dossierRaw || !definitionRaw || !proposalRaw) {
        setProblem("Les informations des étapes précédentes sont introuvables dans cet onglet.");
      } else {
        const dossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
        const definition = JSON.parse(definitionRaw) as ProductDefinitionSession;
        const stored = JSON.parse(proposalRaw) as StoredProposal;
        if (!stored.validated) {
          setProblem("La composition de la solution doit d'abord être validée à l'écran 06.");
        } else if (definition.status !== "ready_for_review" || stored.definitionVersion !== definition.version) {
          setProblem("La définition du produit a changé. Vérifie à nouveau la composition à l'écran 06.");
        } else {
          setBlueprint(buildVisualBlueprint(dossier, definition, stored.proposal));
        }
      }
    } catch {
      setProblem("La maquette n'a pas pu être préparée à partir des données de cette session.");
    }
    setLoaded(true);
  }, []);

  const currentScreen = useMemo(
    () => blueprint?.screens[activeScreen] ?? null,
    [blueprint, activeScreen],
  );

  return (
    <main className="mk-v2-page mk-stage-page mk-visual-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span><span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span><span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span><span className="done">06 · Solution</span>
            <span className="active">07 · Maquette</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 07 · VISUALISATION DU PRODUIT</span>
          <h1>Découvrons ton futur<br /><em>produit en situation.</em></h1>
          <p>Voici une première représentation construite à partir des éléments retenus. Explore les espaces et les profils, puis repère ce que tu souhaites faire évoluer.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation de la maquette…</p></section>}
        {loaded && problem && (
          <section className="mk-stage-empty">
            <h2>La maquette n'est pas encore disponible</h2><p>{problem}</p>
            <a className="mk-continue-button" href="/solution-proposal">Revenir à l'écran 06 <span>→</span></a>
          </section>
        )}

        {blueprint && (
          <>
            <section className="mk-visual-intro">
              <div><span className="mk-summary-kicker">APERÇU DU PROJET</span><h2>{blueprint.projectTitle}</h2><p>{blueprint.summary}</p></div>
              <span className="mk-visual-kind">{blueprint.kind === "digital" ? "Prototype d'interface" : "Représentation de l'activité"}</span>
            </section>

            {blueprint.kind === "digital" ? (
              <section className="mk-prototype-shell" aria-label="Prototype visuel interactif">
                <aside className="mk-prototype-sidebar">
                  <div className="mk-prototype-brand"><span>M</span><strong>{blueprint.projectTitle}</strong></div>
                  <small>APERÇU DES ESPACES</small>
                  <nav aria-label="Écrans du prototype">
                    {blueprint.screens.map((screen, index) => (
                      <button type="button" key={screen.id} className={activeScreen === index ? "active" : ""} onClick={() => setActiveScreen(index)}>
                        <span>{String(index + 1).padStart(2, "0")}</span>{screen.title}
                      </button>
                    ))}
                  </nav>
                  <div className="mk-prototype-sidebar-note">Maquette de conception · données fictives non utilisées</div>
                </aside>
                <div className="mk-prototype-main">
                  <div className="mk-prototype-topbar"><span>ESPACE DE PRÉSENTATION</span><span className="mk-prototype-avatar">{blueprint.profiles[activeProfile]?.name.slice(0, 1).toUpperCase()}</span></div>
                  <div className="mk-prototype-content">
                    <div className="mk-prototype-welcome"><div><small>APERÇU DE L'ESPACE</small><h2>{currentScreen?.title ?? "Vue d'ensemble"}</h2><p>{currentScreen?.description}</p></div><span>Bonjour, {blueprint.profiles[activeProfile]?.name}</span></div>
                    <div className="mk-prototype-profile-switch"><span>VISUALISER EN TANT QUE</span>{blueprint.profiles.map((profile, index) => <button type="button" key={profile.id} className={activeProfile === index ? "active" : ""} onClick={() => setActiveProfile(index)}>{profile.name}</button>)}</div>
                    <div className="mk-prototype-cards">
                      {(currentScreen?.items ?? []).map((item, index) => (
                        <article key={item}><span className="mk-prototype-card-icon">{String(index + 1).padStart(2, "0")}</span><div><small>FONCTION RETENUE</small><h3>{item}</h3><p>Cette fonction fait partie de la composition validée.</p></div><span className="mk-prototype-card-arrow">↗</span></article>
                      ))}
                      {(!currentScreen || currentScreen.items.length === 0) && <p>Aucun élément confirmé dans cet espace pour le moment.</p>}
                    </div>
                    <div className="mk-prototype-lower"><div><small>ESPACE ACTUEL</small><strong>{currentScreen?.title ?? "Aperçu"}</strong></div><div><small>PROFIL SÉLECTIONNÉ</small><strong>{blueprint.profiles[activeProfile]?.name}</strong></div></div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mk-operational-preview">
                <div className="mk-operational-heading"><span>PARCOURS DE L'ACTIVITÉ</span><h2>Comment la solution s'organise</h2><p>Les étapes ci-dessous reprennent les éléments validés, sans imposer d'outil numérique.</p></div>
                <div className="mk-operational-flow">{blueprint.flow.map((item, index) => <article key={index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < blueprint.flow.length - 1 && <i>→</i>}</article>)}</div>
              </section>
            )}

            <section className="mk-visual-notes">
              <div><span className="mk-summary-kicker">À COMPLÉTER OU À CONFIRMER</span><p>Les éléments proposés mais non retenus ne sont pas intégrés à la maquette.</p></div>
              {blueprint.pendingItems.length > 0 && <details><summary>Suggestions non retenues ({blueprint.pendingItems.length})</summary><ul>{blueprint.pendingItems.map((item) => <li key={item}>{item}</li>)}</ul></details>}
              {blueprint.unresolvedPoints.length > 0 && <details><summary>Points encore à préciser ({blueprint.unresolvedPoints.length})</summary><ul>{blueprint.unresolvedPoints.map((item) => <li key={item}>{item}</li>)}</ul></details>}
            </section>
            <div className="mk-visual-footer"><div><strong>Cette maquette est une base de discussion.</strong><p>Elle n'est pas encore une application fonctionnelle. Les modifications demandées serviront à améliorer la conception avant la spécification détaillée.</p></div><a className="mk-continue-button" href="/solution-proposal">Revoir la solution <span>↗</span></a></div>
          </>
        )}
      </section>
    </main>
  );
}
