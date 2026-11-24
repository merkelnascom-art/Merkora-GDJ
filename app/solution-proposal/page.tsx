"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  acceptSolutionComponent,
  buildSolutionProposal,
  rejectSolutionComponent,
  reviseSolutionComponent,
  type SolutionProposal,
} from "../../src/lib/merkora-core/solution-proposal";
import {
  getDomainCatalogs,
  getProductTypeCatalog,
  type SolutionBrandingMode,
  type SolutionDomainId,
  type SolutionNavigationStyle,
  type SolutionProductProfile,
  type SolutionProductTypeId,
} from "../../src/lib/merkora-core/solution-catalog";
import type { ProjectUnderstanding } from "../../src/lib/merkora-core/project-diagnostic";
import type { ProductDefinitionSession } from "../../src/lib/merkora-core/product-definition";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const PROPOSAL_KEY = "merkora-v2-solution-proposal";
const PROFILE_KEY = "merkora-v2-solution-product-profile";

interface StoredProposal {
  definitionVersion: number;
  proposal: SolutionProposal;
  validated: boolean;
}

interface ProfileDraft {
  projectName: string;
  productTypeId: SolutionProductTypeId | "";
  domainIds: SolutionDomainId[];
  navigationStyle: SolutionNavigationStyle;
  brandingMode: SolutionBrandingMode;
}

const productTypes = getProductTypeCatalog();
const domainCatalogs = getDomainCatalogs();

export default function SolutionProposalPage() {
  const [proposal, setProposal] = useState<SolutionProposal | null>(null);
  const [validated, setValidated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [dossier, setDossier] = useState<ProjectUnderstanding | null>(null);
  const [definition, setDefinition] = useState<ProductDefinitionSession | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    projectName: "",
    productTypeId: "",
    domainIds: [],
    navigationStyle: "sidebar",
    brandingMode: "to_define",
  });

  useEffect(() => {
    try {
      const dossierRaw = window.sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = window.sessionStorage.getItem(DEFINITION_KEY);
      if (!dossierRaw || !definitionRaw) {
        setProblem("Le dossier des étapes précédentes est introuvable dans cette session.");
        setLoaded(true);
        return;
      }

      const loadedDossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
      const loadedDefinition = JSON.parse(definitionRaw) as ProductDefinitionSession;
      if (loadedDefinition.understandingId !== loadedDossier.id || loadedDefinition.status !== "ready_for_review") {
        setProblem("La définition du produit doit être terminée avant de composer la solution.");
        setLoaded(true);
        return;
      }

      setDossier(loadedDossier);
      setDefinition(loadedDefinition);
      const activity = loadedDossier.items.find((item) => item.status === "user_stated" && item.dimension === "activity")?.value ?? "";
      const storedProfileRaw = window.sessionStorage.getItem(PROFILE_KEY);
      const storedProfile = storedProfileRaw ? JSON.parse(storedProfileRaw) as SolutionProductProfile : null;
      if (storedProfile) {
        setProfileDraft(storedProfile);
        const storedRaw = window.sessionStorage.getItem(PROPOSAL_KEY);
        const stored = storedRaw ? JSON.parse(storedRaw) as StoredProposal : null;
        const current = stored?.definitionVersion === loadedDefinition.version
          ? stored
          : { definitionVersion: loadedDefinition.version, proposal: buildSolutionProposal(loadedDossier, loadedDefinition, storedProfile), validated: false };
        setProposal(current.proposal);
        setValidated(current.validated);
        window.sessionStorage.setItem(PROPOSAL_KEY, JSON.stringify(current));
      } else {
        setProfileDraft((current) => ({ ...current, projectName: activity }));
        setNeedsProfile(true);
      }
    } catch {
      setProblem("Les données du projet n'ont pas pu être lues. Retourne à l'écran 05 pour vérifier la définition.");
    }
    setLoaded(true);
  }, []);

  const acceptedCount = useMemo(
    () => proposal?.components.filter((item) => item.status === "accepted" || item.status === "modified").length ?? 0,
    [proposal],
  );
  const rejectedCount = useMemo(
    () => proposal?.components.filter((item) => item.status === "rejected").length ?? 0,
    [proposal],
  );

  function save(next: SolutionProposal, nextValidated = false) {
    setProposal(next);
    setValidated(nextValidated);
    try {
      const raw = window.sessionStorage.getItem(DEFINITION_KEY);
      const currentDefinition = raw ? JSON.parse(raw) as ProductDefinitionSession : null;
      window.sessionStorage.setItem(PROPOSAL_KEY, JSON.stringify({
        definitionVersion: currentDefinition?.version ?? 0,
        proposal: next,
        validated: nextValidated,
      } satisfies StoredProposal));
    } catch {
      setProblem("La modification est visible, mais le navigateur n'a pas pu la conserver. Garde cet onglet ouvert.");
    }
  }

  function completeProductProfile() {
    if (!dossier || !definition || !profileDraft.projectName.trim() || !profileDraft.productTypeId) return;
    const profile: SolutionProductProfile = {
      ...profileDraft,
      projectName: profileDraft.projectName.trim(),
    };
    const next = buildSolutionProposal(dossier, definition, profile);
    setProfileDraft(profile);
    setProposal(next);
    setValidated(false);
    setNeedsProfile(false);
    try {
      window.sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      window.sessionStorage.setItem(PROPOSAL_KEY, JSON.stringify({
        definitionVersion: definition.version,
        proposal: next,
        validated: false,
      } satisfies StoredProposal));
    } catch {
      setProblem("La proposition est prête, mais le navigateur n'a pas pu conserver le cadrage. Garde cet onglet ouvert.");
    }
  }

  function toggleDomain(domainId: SolutionDomainId) {
    setProfileDraft((current) => ({
      ...current,
      domainIds: current.domainIds.includes(domainId)
        ? current.domainIds.filter((id) => id !== domainId)
        : [...current.domainIds, domainId],
    }));
  }

  function beginEdit(id: string, title: string) {
    setEditingId(id);
    setEditingTitle(title);
  }

  function saveEdit(id: string) {
    if (!proposal) return;
    save(reviseSolutionComponent(proposal, id, editingTitle));
    setEditingId(null);
    setEditingTitle("");
  }

  function validateProposal() {
    if (!proposal || acceptedCount === 0) return;
    save({ ...proposal, version: proposal.version + 1, updatedAt: new Date().toISOString() }, true);
  }

  return (
    <main className="mk-v2-page mk-stage-page mk-solution-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/product-definition">← Retour à l'écran 05</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span>
            <span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span>
            <span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span>
            <span className="active">06 · Solution</span>
            <span>07 · Maquette</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 06 · ARCHITECTURE ET COMPOSITION</span>
          <h1>Construisons la structure<br /><em>de ton projet.</em></h1>
          <p>On commence par identifier le produit et son domaine. MerKora utilisera ensuite les catalogues adaptés, puis assemblera les modules retenus sans confondre leurs règles métier.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation du projet…</p></section>}

        {loaded && problem && (
          <section className="mk-stage-empty">
            <h2>Impossible de préparer la solution</h2>
            <p>{problem}</p>
            <a className="mk-continue-button" href="/product-definition">Revenir à l'écran 05 <span>→</span></a>
          </section>
        )}

        {loaded && needsProfile && (
          <section className="mk-solution-profile">
            <div className="mk-solution-profile-heading">
              <span className="mk-summary-kicker">01 · IDENTITÉ DU PROJET</span>
              <h2>Quel produit veux-tu créer ?</h2>
              <p>Le nom, la nature du produit et le ou les domaines déterminent la structure de départ. Tu peux combiner plusieurs domaines : MerKora construira une solution hybride.</p>
            </div>

            <label className="mk-solution-field">
              <span>Nom du projet</span>
              <input
                value={profileDraft.projectName}
                onChange={(event) => setProfileDraft((current) => ({ ...current, projectName: event.target.value }))}
                placeholder="Ex. : Aéro Service — Gestion intégrée"
                maxLength={100}
              />
            </label>

            <div className="mk-solution-profile-group">
              <span className="mk-solution-field-title">Nature du produit</span>
              <p>Un site vitrine, une plateforme et une application mobile ne suivent pas la même architecture.</p>
              <div className="mk-solution-type-grid">
                {productTypes.map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    className={"mk-solution-type-card" + (profileDraft.productTypeId === type.id ? " selected" : "")}
                    aria-pressed={profileDraft.productTypeId === type.id}
                    onClick={() => setProfileDraft((current) => ({
                      ...current,
                      productTypeId: type.id,
                      navigationStyle: type.defaultNavigation,
                    }))}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mk-solution-profile-group">
              <span className="mk-solution-field-title">Domaines et secteurs concernés</span>
              <p>Choisis un ou plusieurs domaines. Tu peux associer, par exemple, présence + réservation ou formation + finance.</p>
              <div className="mk-solution-domain-grid">
                {domainCatalogs.map((domain) => (
                  <label className={"mk-solution-domain-option" + (profileDraft.domainIds.includes(domain.id) ? " selected" : "")} key={domain.id}>
                    <input
                      type="checkbox"
                      checked={profileDraft.domainIds.includes(domain.id)}
                      onChange={() => toggleDomain(domain.id)}
                    />
                    <span><strong>{domain.label}</strong><small>{domain.description}</small></span>
                  </label>
                ))}
              </div>
              {profileDraft.domainIds.length > 1 && (
                <p className="mk-solution-hybrid-note">Composition hybride : {profileDraft.domainIds.length} domaines seront assemblés. Leurs règles et fonctions resteront identifiables.</p>
              )}
            </div>

            <div className="mk-solution-profile-settings">
              <label className="mk-solution-field">
                <span>Style de navigation souhaité</span>
                <select
                  value={profileDraft.navigationStyle}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, navigationStyle: event.target.value as SolutionNavigationStyle }))}
                >
                  <option value="sidebar">Menu latéral</option>
                  <option value="topbar">Menu horizontal supérieur</option>
                  <option value="bottom_tabs">Navigation inférieure mobile</option>
                  <option value="contextual">Navigation contextuelle</option>
                  <option value="not_applicable">Pas de navigation logicielle</option>
                </select>
              </label>
              <label className="mk-solution-field">
                <span>Identité visuelle</span>
                <select
                  value={profileDraft.brandingMode}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, brandingMode: event.target.value as SolutionBrandingMode }))}
                >
                  <option value="to_define">À définir avec MerKora</option>
                  <option value="existing_logo">J'ai déjà un logo</option>
                  <option value="create_logo">Je veux créer un logo</option>
                </select>
              </label>
            </div>

            <div className="mk-solution-owner-note">
              <strong>Un espace propriétaire distinct</strong>
              <p>Le compte de la personne qui commande et administre le produit sera séparé des espaces destinés aux clients, membres, apprenants, agents ou autres utilisateurs finaux.</p>
            </div>

            <button
              type="button"
              className="mk-continue-button"
              disabled={!profileDraft.projectName.trim() || !profileDraft.productTypeId}
              onClick={completeProductProfile}
            >
              Construire la proposition <span>→</span>
            </button>
          </section>
        )}

        {loaded && proposal && (
          <>
            <section className="mk-solution-overview">
              <span className="mk-summary-kicker">PROPOSITION GLOBALE</span>
              <h2>{proposal.title}</h2>
              <p className="mk-solution-lead">{proposal.description}</p>
              <div className="mk-solution-profile-summary">
                <span>{productTypes.find((item) => item.id === proposal.productProfile?.productTypeId)?.label ?? "Type à préciser"}</span>
                {(proposal.productProfile?.domainIds ?? []).map((id) => (
                  <span key={id}>{domainCatalogs.find((domain) => domain.id === id)?.label ?? id}</span>
                ))}
                {proposal.domainComposition?.isHybrid && <strong>Architecture hybride</strong>}
              </div>
              <div className="mk-solution-context-grid">
                <article><span>LE BESOIN À RÉSOUDRE</span><p>{proposal.problem}</p></article>
                <article><span>LE RÉSULTAT RECHERCHÉ</span><p>{proposal.objective}</p></article>
              </div>
              <p className="mk-solution-principle">{proposal.operatingPrinciple}</p>
            </section>

            <section className="mk-solution-architecture">
              <div>
                <span className="mk-summary-kicker">ARCHITECTURE PROPOSÉE</span>
                <h2>{proposal.architectures[0]?.title}</h2>
                <p>{proposal.architectures[0]?.description}</p>
              </div>
              <details>
                <summary>Voir les avantages et points à préciser</summary>
                <ul>{proposal.architectures[0]?.tradeOffs.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            </section>

            <section className="mk-solution-components">
              <div className="mk-solution-section-heading">
                <div>
                  <span className="mk-summary-kicker">COMPOSITION PERSONNALISABLE</span>
                  <h2>Les éléments de la solution</h2>
                  <p>Les éléments du catalogue restent des propositions jusqu'à ta validation.</p>
                </div>
                <span className="mk-solution-count">{proposal.components.length} élément(s)</span>
              </div>

              {proposal.components.length === 0 ? (
                <div className="mk-solution-empty">La définition ne contient pas encore de composant précis. Reviens à l'écran 05 pour compléter les éléments utiles.</div>
              ) : (
                <div className="mk-solution-component-list">
                  {proposal.components.map((component, index) => (
                    <article className={"mk-solution-component is-" + component.status} key={component.id}>
                      <div className="mk-solution-component-top">
                        <span className="mk-solution-index">{String(index + 1).padStart(2, "0")}</span>
                        <div className="mk-solution-component-copy">
                          {editingId === component.id ? (
                            <div className="mk-solution-edit">
                              <input aria-label="Nom du composant" value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} />
                              <button type="button" onClick={() => saveEdit(component.id)}>Enregistrer</button>
                              <button type="button" className="quiet" onClick={() => setEditingId(null)}>Annuler</button>
                            </div>
                          ) : <h3>{component.title}</h3>}
                          <span className={"mk-solution-status status-" + component.status}>
                            {component.status === "accepted" ? "Accepté" : component.status === "modified" ? "Modifié et retenu" : component.status === "rejected" ? "Écarté" : "À examiner"}
                          </span>
                        </div>
                        <details className="mk-solution-why">
                          <summary>Pourquoi ?</summary>
                          <p>{component.description}</p>
                          <small>
                            {component.source === "validated_definition"
                              ? "Issu de tes réponses à l'écran 05."
                              : component.source === "knowledge_suggestion"
                                ? "Suggestion du référentiel métier, à confirmer."
                                : component.source === "catalog_suggestion"
                                  ? "Élément du catalogue produit ou métier, à confirmer."
                                  : "Issu du dossier de projet."}
                          </small>
                        </details>
                      </div>
                      {component.status !== "rejected" && editingId !== component.id && (
                        <div className="mk-solution-actions">
                          <button type="button" onClick={() => save(acceptSolutionComponent(proposal, component.id))}>Retenir</button>
                          <button type="button" className="quiet" onClick={() => beginEdit(component.id, component.title)}>Modifier</button>
                          <button type="button" className="quiet" onClick={() => save(rejectSolutionComponent(proposal, component.id))}>Écarter</button>
                        </div>
                      )}
                      {component.status === "rejected" && (
                        <div className="mk-solution-actions">
                          <button type="button" className="quiet" onClick={() => save(acceptSolutionComponent(proposal, component.id))}>Réintégrer</button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            {(proposal.coherenceNotes.length > 0 || proposal.unresolvedPoints.length > 0) && (
              <details className="mk-solution-coherence">
                <summary>Points à vérifier avant de figer la solution ({proposal.unresolvedPoints.length})</summary>
                {proposal.coherenceNotes.map((item) => <p key={item}>{item}</p>)}
                {proposal.unresolvedPoints.map((item) => <div key={item}>• {item}</div>)}
              </details>
            )}

            <div className="mk-solution-footer">
              <div>
                <strong>{acceptedCount} élément(s) retenu(s) · {rejectedCount} écarté(s)</strong>
                <p>Les éléments encore proposés ne seront pas considérés comme validés tant que tu ne les as pas retenus.</p>
              </div>
              <button type="button" className="mk-continue-button" disabled={acceptedCount === 0} onClick={validateProposal}>
                Valider cette composition <span>→</span>
              </button>
            </div>

            {validated && (
              <section className="mk-solution-validated" role="status">
                <span>✓</span>
                <div>
                  <strong>Composition validée</strong>
                  <p>La prochaine étape sera la maquette réelle de l'écran 07 : elle devra représenter les espaces, les écrans, la navigation et les fonctions de cette composition.</p>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
