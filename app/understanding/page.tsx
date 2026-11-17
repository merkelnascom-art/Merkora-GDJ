"use client";

import React, { useEffect, useState } from "react";
import {
  attachKnowledgeProposalToUnderstanding,
  createProjectUnderstanding,
  getActiveUnderstandingItems,
  reviseUnderstandingItem,
  rejectUnderstandingItem,
  validateProjectUnderstanding,
  validateUnderstandingItem,
  UNDERSTANDING_SECTIONS,
  type ProjectUnderstanding,
  type ProjectUnderstandingItem,
} from "../../src/lib/merkora-core/project-diagnostic";
import type { UnderstandingSession } from "../../src/lib/merkora-core/situation-intake-engine";
import { deriveScreen03Evidence } from "../../src/lib/merkora-core/understanding-quality";
import { enrichSituationGraphWithKnowledge } from "../../src/lib/merkora-core/knowledge/situation-linker";
import { buildProjectKnowledgeMap } from "../../src/lib/merkora-core/knowledge/universal-project-knowledge";
import { createProjectKnowledgeProposal } from "../../src/lib/merkora-core/knowledge/proposals";
import { createUniversalKnowledgeRegistry, getKnowledgeConcept } from "../../src/lib/merkora-core/knowledge/registry";
import { ESCO_API_LANGUAGE_CODES, type ESCOSuggestion } from "../../src/lib/merkora-core/knowledge/esco-api";
import { UNIVERSAL_DOMAIN_COUNT, UNIVERSAL_DOMAIN_FAMILY_COUNT, UNIVERSAL_SPECIALIZATION_COUNT } from "../../src/lib/merkora-core/knowledge/universal-domain-catalog";

const SCREEN_03_KNOWLEDGE = createUniversalKnowledgeRegistry();
import type { SituationEntity } from "../../src/lib/merkora-core/situation-graph";

const SOURCE_SESSION_KEY = "merkora-v2-understanding-session";
const DOSSIER_KEY = "merkora-v2-project-understanding";
const EDIT_DRAFT_KEY = "merkora-v2-understanding-edit-draft";

function readSession(): UnderstandingSession | null {
  try {
    const raw = window.sessionStorage.getItem(SOURCE_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<UnderstandingSession>;
    if (typeof value.originalDescription === "string" && Array.isArray(value.evidence) && Array.isArray(value.messages)) {
      return value as UnderstandingSession;
    }
  } catch { /* Le parcours reste accessible si le stockage est indisponible. */ }
  return null;
}

function statusLabel(status: ProjectUnderstandingItem["status"]): string {
  const labels: Record<ProjectUnderstandingItem["status"], string> = {
    user_stated: "Exprimé par toi",
    observed: "Observation",
    inferred: "Interprétation à confirmer",
    hypothesis: "Hypothèse à vérifier",
    unknown: "Inconnu",
    not_applicable: "Non applicable",
    conversation_only: "Réaction de conversation",
    validated: "Validé par toi",
    rejected: "Écarté",
  };
  return labels[status];
}

function restoreEditDraft(dossier: ProjectUnderstanding, setEditingId: (id: string | null) => void, setEditValue: (value: string) => void) {
  try {
    const raw = window.sessionStorage.getItem(EDIT_DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw) as { itemId?: string; value?: string };
    if (draft.itemId && typeof draft.value === "string" && getActiveUnderstandingItems(dossier).some((item) => item.id === draft.itemId)) {
      setEditingId(draft.itemId);
      setEditValue(draft.value);
    }
  } catch { /* Le dossier reste disponible même si le brouillon est illisible. */ }
}

export default function UnderstandingPage() {
  const [dossier, setDossier] = useState<ProjectUnderstanding | null>(null);
  const [sourceAvailable, setSourceAvailable] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [notice, setNotice] = useState("");
  const [escoLanguage, setEscoLanguage] = useState("fr");
  const [escoSearchType, setEscoSearchType] = useState<"occupation" | "skill">("occupation");
  const [escoSuggestions, setEscoSuggestions] = useState<Record<string, ESCOSuggestion[]>>({});
  const [escoLoadingId, setEscoLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session) return;
    setSourceAvailable(true);
    try {
      const saved = window.sessionStorage.getItem(DOSSIER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ProjectUnderstanding;
        if (parsed.projectId === session.conversationId && Array.isArray(parsed.items)) {
          const normalized: ProjectUnderstanding = {
            ...parsed,
            situationGraph: enrichSituationGraphWithKnowledge(parsed.situationGraph ?? session.situationGraph, SCREEN_03_KNOWLEDGE, "fr"),
            knowledgeProposals: Array.isArray(parsed.knowledgeProposals) ? parsed.knowledgeProposals : [],
            contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
            unresolvedQuestions: Array.isArray(parsed.unresolvedQuestions) ? parsed.unresolvedQuestions : [],
            privacyConsiderations: Array.isArray(parsed.privacyConsiderations) ? parsed.privacyConsiderations : [],
            knowledgeMap: parsed.knowledgeMap ?? buildProjectKnowledgeMap(parsed.items, parsed.situationGraph, SCREEN_03_KNOWLEDGE),
          };
          setDossier(normalized);
          restoreEditDraft(normalized, setEditingId, setEditValue);
          return;
        }
      }
    } catch { /* Reconstruire à partir de la session source. */ }
    const created = createProjectUnderstanding(session);
    const initial: ProjectUnderstanding = {
      ...created,
      situationGraph: enrichSituationGraphWithKnowledge(created.situationGraph ?? session.situationGraph, SCREEN_03_KNOWLEDGE, "fr"),
    };
    setDossier(initial);
    restoreEditDraft(initial, setEditingId, setEditValue);
    try { window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(initial)); } catch { /* Mémoire de page seulement. */ }
  }, []);

  function persist(next: ProjectUnderstanding) {
    setDossier(next);
    try { window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(next)); } catch { setNotice("Le navigateur n'a pas pu conserver cette mise à jour."); }
  }

  function validateItem(itemId: string) {
    if (!dossier) return;
    persist(validateUnderstandingItem(dossier, itemId));
    setNotice("Élément validé. Son origine et son historique sont conservés.");
  }

  function startEdit(item: ProjectUnderstandingItem) {
    setEditingId(item.id);
    setEditValue(item.value);
    setNotice("");
    try { window.sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ itemId: item.id, value: item.value })); } catch { /* La saisie reste disponible dans le champ courant. */ }
  }

  function saveEdit() {
    if (!dossier || !editingId || !editValue.trim()) return;
    persist(reviseUnderstandingItem(dossier, editingId, editValue));
    setEditingId(null);
    setEditValue("");
    try { window.sessionStorage.removeItem(EDIT_DRAFT_KEY); } catch { /* Le dossier est déjà enregistré. */ }
    setNotice("Correction enregistrée comme une nouvelle version. La formulation précédente est conservée.");
  }

  function rejectItem(itemId: string) {
    if (!dossier) return;
    persist(rejectUnderstandingItem(dossier, itemId));
    setNotice("Interprétation écartée. Elle reste conservée dans l'historique.");
  }

  function changeKnowledgeLanguage(language: string) {
    setEscoLanguage(language);
    setEscoSuggestions({});
    if (!dossier) return;
    persist({
      ...dossier,
      situationGraph: enrichSituationGraphWithKnowledge(dossier.situationGraph, SCREEN_03_KNOWLEDGE, language),
    });
  }

  async function searchESCO(entity: SituationEntity) {
    setEscoLoadingId(entity.id);
    setNotice("");
    try {
      const searchTerm = entity.kind === "actor" && entity.role ? entity.role : entity.label;
      const params = new URLSearchParams({ text: searchTerm, language: escoLanguage, type: escoSearchType });
      const response = await fetch(`/api/knowledge/esco?${params.toString()}`);
      const payload = await response.json() as { results?: ESCOSuggestion[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Recherche ESCO indisponible.");
      setEscoSuggestions((current) => ({ ...current, [entity.id]: payload.results ?? [] }));
      if (!(payload.results ?? []).length) setNotice("Aucune profession ESCO trouvée dans cette langue. Le terme reste libre et peut être proposé.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "La recherche ESCO a échoué.");
    } finally {
      setEscoLoadingId(null);
    }
  }

  function proposeUnknownConcept(entity: SituationEntity, externalReference?: ESCOSuggestion) {
    if (!dossier || entity.knowledge?.matchStatus !== "unmatched") return;
    const source = entity.evidence[0];
    if (!source) return;

    const proposalLabel = entity.kind === "actor" && entity.role ? entity.role : entity.label;
    const proposal = createProjectKnowledgeProposal({
      projectId: dossier.projectId,
      label: proposalLabel,
      language: externalReference?.language ?? "und",
      sourceMessageId: source.messageId,
      sourceQuote: source.quote,
      ...(externalReference ? {
        externalReference: {
          system: "ESCO" as const,
          conceptType: externalReference.conceptType,
          uri: externalReference.uri,
          label: externalReference.label,
          language: externalReference.language,
          datasetVersion: "ESCO API — version par défaut du service",
        },
      } : {}),
    }, SCREEN_03_KNOWLEDGE);
    try {
      persist(attachKnowledgeProposalToUnderstanding(dossier, proposal));
    } catch {
      setNotice("Ce terme a déjà été proposé pour ce projet.");
      return;
    }
    setNotice(externalReference
      ? "Rapprochement ESCO proposé et conservé dans ce projet. Il attend une revue humaine."
      : "Proposition privée enregistrée dans ce projet. Elle n'est pas encore ajoutée au référentiel commun.");
  }

  function continueToDiagnostic() {
    if (!dossier) return;
    const validated = validateProjectUnderstanding(dossier);
    persist(validated);
    window.location.href = "/diagnostic";
  }

  const evidenceView = dossier
    ? deriveScreen03Evidence(getActiveUnderstandingItems(dossier))
    : { projectItems: [], conversationOnly: [], notApplicable: [], unknown: [], duplicates: [] };
  const activeItems = evidenceView.projectItems;
  const screen03KnowledgeMap = dossier ? buildProjectKnowledgeMap(activeItems, dossier.situationGraph, SCREEN_03_KNOWLEDGE) : null;
  const populatedSections = dossier ? UNDERSTANDING_SECTIONS.filter((section) => activeItems.some((item) => item.dimension === section.id)) : [];
  const missingSections = dossier ? UNDERSTANDING_SECTIONS.filter((section) => !activeItems.some((item) => item.dimension === section.id)) : [];

  return (
    <main className="mk-v2-page mk-stage-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span></a>
        <a className="mk-back-link" href="/conversation">← Retour à notre échange</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps"><span className="done">01 · Entrée</span><span className="done">02 · Conversation</span><span className="active">03 · Compréhension</span><span>04 · Diagnostic</span></div>
          <span className="mk-eyebrow"><span /> ÉTAPE 03 · MIROIR DU PROJET</span>
          <h1>Voici ce que j'ai compris.<br /><em>Vérifions-le ensemble.</em></h1>
          <p>Je rassemble tes mots et les informations déjà exprimées : activité, idée, situation, personnes, objectifs et contraintes. Tu peux corriger chaque élément. Ce qui reste inconnu ne sera pas inventé.</p>
        </div>

        {!sourceAvailable && (
          <section className="mk-stage-empty">
            <h2>Retrouvons d'abord ton échange</h2>
            <p>Je n'ai pas trouvé de conversation enregistrée dans cette session. Reviens à l'écran 02 pour reprendre ton projet.</p>
            <a className="mk-continue-button" href="/conversation">Revenir à la conversation <span>→</span></a>
          </section>
        )}

        {sourceAvailable && dossier && (
          <>
            <section className="mk-original-narrative">
              <span className="mk-summary-kicker">TON EXPRESSION INITIALE · CONSERVÉE INTÉGRALEMENT</span>
              <p>{dossier.originalDescription}</p>
            </section>
            {dossier.situationGraph.entities.length > 0 && <section className="mk-understanding-section mk-knowledge-section">
              <div className="mk-understanding-section-heading">
                <div>
                  <h2>Repères du référentiel universel</h2>
                  <p>MerKora relie les éléments du récit à une cartographie ouverte de {UNIVERSAL_DOMAIN_FAMILY_COUNT} familles, {UNIVERSAL_DOMAIN_COUNT} domaines et {UNIVERSAL_SPECIALIZATION_COUNT} spécialisations initiales. Les métiers et compétences peuvent être recherchés dans ESCO ; aucune correspondance n'est imposée automatiquement.</p>
                </div>
                <span>{dossier.situationGraph.entities.length}</span>
              </div>
              <div className="mk-item-meta">
                <label htmlFor="esco-language">Langue de recherche ESCO</label>
                <select id="esco-language" value={escoLanguage} onChange={(event) => changeKnowledgeLanguage(event.target.value)}>
                  {ESCO_API_LANGUAGE_CODES.map((language) => <option key={language} value={language}>{language.toUpperCase()}</option>)}
                </select>
                <label htmlFor="esco-type">Catalogue à consulter</label>
                <select id="esco-type" value={escoSearchType} onChange={(event) => { setEscoSearchType(event.target.value as "occupation" | "skill"); setEscoSuggestions({}); }}>
                  <option value="occupation">Métiers et professions</option>
                  <option value="skill">Compétences et spécialisations</option>
                </select>
              </div>
              <div className="mk-understanding-items">
                {dossier.situationGraph.entities.map((entity) => (
                  <article className="mk-understanding-item" key={"knowledge-" + entity.id}>
                    <p><strong>{entity.label}</strong></p>
                    <div className="mk-item-meta">
                      {entity.knowledge?.typeConceptLabel
                        ? <span>Type universel : {entity.knowledge.typeConceptLabel}</span>
                        : <span>Type ouvert : {entity.kind}</span>}
                      {entity.knowledge?.matchStatus === "matched" && entity.knowledge.conceptLabel
                        ? <span>Concept rapproché : {entity.knowledge.conceptLabel}</span>
                        : entity.knowledge?.matchStatus === "ambiguous"
                          ? <span>Plusieurs correspondances possibles ; aucune n'est choisie.</span>
                          : <span>Terme conservé sans correspondance forcée.</span>}
                    </div>
                    {entity.knowledge?.classificationPath && entity.knowledge.classificationPath.length > 0 && (
                      <small>Classement : {entity.knowledge.classificationPath.map((item) => item.label).join(" → ")}</small>
                    )}
                    {entity.knowledge?.matchStatus === "ambiguous" && entity.knowledge.candidateConceptIds && (
                      <div className="mk-item-meta">
                        <span>Correspondances à départager :</span>
                        {entity.knowledge.candidateConceptIds.map((id) => {
                          const candidate = getKnowledgeConcept(SCREEN_03_KNOWLEDGE, id);
                          const label = candidate?.definitions.find((item) => item.language === "fr")?.label ?? candidate?.definitions[0]?.label ?? id;
                          return <span key={id}>{label}</span>;
                        })}
                      </div>
                    )}
                    {entity.knowledge?.matchStatus === "unmatched" && entity.evidence.length > 0 && (
                      <>
                        <div className="mk-inline-actions">
                          <button className="mk-small-action" type="button" onClick={() => proposeUnknownConcept(entity)}>
                            Proposer comme nouveau concept
                          </button>
                          {(entity.kind === "activity" || entity.kind === "actor") && (
                            <button className="mk-small-action" type="button" onClick={() => searchESCO(entity)} disabled={escoLoadingId === entity.id}>
                              {escoLoadingId === entity.id ? "Recherche…" : escoSearchType === "occupation" ? "Chercher un métier dans ESCO" : "Chercher une compétence dans ESCO"}
                            </button>
                          )}
                        </div>
                        {(escoSuggestions[entity.id] ?? []).length > 0 && (
                          <div className="mk-knowledge-proposals">
                            <small>Suggestions externes ESCO — à vérifier, aucune n'est sélectionnée automatiquement.</small>
                            {(escoSuggestions[entity.id] ?? []).map((suggestion) => (
                              <article className="mk-understanding-item" key={suggestion.uri}>
                                <p><strong>{suggestion.label}</strong></p>
                                {suggestion.description && <small>{suggestion.description}</small>}
                                {suggestion.alternativeLabels.length > 0 && <small>Autres appellations : {suggestion.alternativeLabels.join(", ")}</small>}
                                <div className="mk-inline-actions">
                                  <a className="mk-small-action" href={suggestion.uri} target="_blank" rel="noreferrer">Consulter la fiche ESCO</a>
                                  <button className="mk-small-action mk-small-action-gold" type="button" onClick={() => proposeUnknownConcept(entity, suggestion)}>Proposer ce rapprochement</button>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </article>
                ))}
              </div>
              <small>Ces repères organisent les connaissances ; ils ne constituent pas de nouvelles déclarations de ta part.</small>
              {(dossier.knowledgeProposals ?? []).length > 0 && (
                <div className="mk-knowledge-proposals">
                  <h3>Propositions privées de ce projet</h3>
                  {(dossier.knowledgeProposals ?? []).map((proposal) => (
                    <article className="mk-understanding-item" key={proposal.id}>
                      <p><strong>{proposal.label}</strong></p>
                      <div className="mk-item-meta">
                        <span>{proposal.status === "proposed" ? "Proposition privée" : proposal.status === "under_review" ? "En revue" : proposal.status === "approved" ? "Validée" : "Refusée"}</span>
                        <span>{proposal.externalReference ? `Langue de la référence : ${proposal.externalReference.language.toUpperCase()}` : "Langue non déterminée"}</span>
                      </div>
                      <small>{proposal.sourceQuote}</small>
                      {proposal.externalReference && <small>Référence externe proposée : {proposal.externalReference.label} · {proposal.externalReference.language.toUpperCase()} · {proposal.externalReference.system} · {proposal.externalReference.datasetVersion}</small>}
                      {(proposal.possibleDuplicateConceptIds ?? []).length > 0 && <small>Concept(s) proche(s) déjà présent(s) : {(proposal.possibleDuplicateConceptIds ?? []).map((id) => getKnowledgeConcept(SCREEN_03_KNOWLEDGE, id)?.definitions.find((item) => item.language === "fr")?.label ?? id).join(", ")}. Une revue doit décider s’il s’agit d’un synonyme ou d’un concept distinct.</small>}
                    </article>
                  ))}
                  <small>Ces propositions restent attachées à ce projet. Elles ne modifient pas le référentiel commun sans revue explicite.</small>
                </div>
              )}
            </section>}
            {dossier.situationGraph.relations.length > 0 && <section className="mk-understanding-section">
              <div className="mk-understanding-section-heading"><div><h2>Relations repérées dans ton récit</h2><p>Ces liens proviennent des éléments exprimés ; ils ne constituent pas automatiquement des relations de cause à effet.</p></div><span>{dossier.situationGraph.relations.length}</span></div>
              <div className="mk-relation-list">{dossier.situationGraph.relations.slice(0, 8).map((relation) => {
                const from = dossier.situationGraph.entities.find((entity) => entity.id === relation.fromEntityId);
                const to = dossier.situationGraph.entities.find((entity) => entity.id === relation.toEntityId);
                return <p key={relation.id}><strong>{from?.label ?? "Élément non identifié"}</strong><span>{relation.predicate.replaceAll("_", " ")}</span><strong>{to?.label ?? "Élément non identifié"}</strong></p>;
              })}</div>
              {dossier.situationGraph.unresolvedRelations.length > 0 && <small className="mk-unresolved-count">{dossier.situationGraph.unresolvedRelations.length} relation(s) restent à préciser.</small>}
            </section>}
            {dossier.contradictions.length > 0 && <section className="mk-understanding-section mk-contradictions">
              <div className="mk-understanding-section-heading"><div><h2>Points à clarifier</h2><p>Des indications semblent différentes ou incompatibles. Aucune n'est écartée automatiquement.</p></div><span>{dossier.contradictions.filter((item) => item.status !== "resolved").length}</span></div>
              {dossier.contradictions.map((item) => <article className="mk-contradiction-item" key={item.id}>
                <span className={"mk-status " + (item.status === "resolved" ? "mk-status-validated" : "mk-status-inferred")}>{item.status === "resolved" ? "Clarifié" : item.status === "deferred" ? "À reprendre" : "À éclaircir"}</span>
                <p><strong>Première indication :</strong> {item.statementA}</p>
                <p><strong>Autre indication :</strong> {item.statementB}</p>
                {item.status !== "resolved" && <small>Question proposée : {item.question}</small>}
              </article>)}
            </section>}
            {dossier.unresolvedQuestions.length > 0 && <section className="mk-understanding-section"><h2>Références à préciser</h2><ul className="mk-unresolved-list">{dossier.unresolvedQuestions.map((item, index) => <li key={index}>{item}</li>)}</ul></section>}
            {dossier.privacyConsiderations.length > 0 && <section className="mk-understanding-section"><h2>Précautions de confidentialité repérées</h2><ul className="mk-unresolved-list">{dossier.privacyConsiderations.map((item, index) => <li key={index}>{item}</li>)}</ul></section>}

            <div className="mk-stage-overview">
              <div><strong>{activeItems.length}</strong><span>déclarations utiles, sans doublons</span></div>
              <div><strong>{activeItems.filter((item) => item.status === "validated").length}</strong><span>confirmées</span></div>
              <div><strong>{activeItems.filter((item) => item.status !== "validated").length}</strong><span>à vérifier</span></div>
              <div><strong>{evidenceView.notApplicable.length}</strong><span>non applicables</span></div>
              <div><strong>{evidenceView.unknown.length}</strong><span>sans réponse connue</span></div>
            </div>
            {evidenceView.duplicates.length > 0 && <p className="mk-unresolved-count">{evidenceView.duplicates.length} répétition(s) regroupée(s) à l’écran. Toutes les déclarations et leurs sources originales restent conservées dans le dossier.</p>}
            {evidenceView.notApplicable.length > 0 && <section className="mk-understanding-section"><h2>Non applicable au projet</h2><p>Ces réponses explicites sont conservées séparément. Elles ne sont comptées ni comme faits du projet ni comme informations inconnues.</p>{evidenceView.notApplicable.map((item) => <article className="mk-understanding-item" key={item.id}><p>{item.value}</p><small>Source conservée : {item.sourceQuote}</small></article>)}</section>}
            {evidenceView.conversationOnly.length > 0 && <section className="mk-understanding-section"><h2>Réactions de conversation</h2><p>Ces messages restent dans l’historique, mais ne sont pas présentés comme des objectifs, résultats ou faits du projet.</p>{evidenceView.conversationOnly.map((item) => <article className="mk-understanding-item" key={item.id}><p>{item.value}</p><small>Message conservé hors des éléments métier.</small></article>)}</section>}
            {evidenceView.unknown.length > 0 && <section className="mk-understanding-section"><h2>Informations encore inconnues</h2><p>Ces réponses restent visibles, mais ne remplissent pas une dimension du projet.</p>{evidenceView.unknown.map((item) => <article className="mk-understanding-item" key={item.id}><p>{item.value}</p><small>Statut : à préciser</small></article>)}</section>}

            {screen03KnowledgeMap && (screen03KnowledgeMap.familyCandidates.length > 0 || screen03KnowledgeMap.unresolved.length > 0) && (
              <section className="mk-knowledge-map" aria-label="Cartographie métier et fonctionnelle">
                <div className="mk-knowledge-map-heading">
                  <span className="mk-summary-kicker">FONDATION A · 20 FAMILLES · 100 DOMAINES CANONIQUES</span>
                  <strong>Raccordements métier proposés</strong>
                  <p>MerKora relie les activités, problèmes, processus, ressources, fonctions et indicateurs identifiés. Les correspondances non validées restent des suggestions.</p>
                </div>
                {screen03KnowledgeMap.familyCandidates.length > 0 && <div className="mk-knowledge-map-group"><span>Familles et secteurs repérés</span><div className="mk-knowledge-chips">{screen03KnowledgeMap.familyCandidates.slice(0,5).map((family)=><span key={family.familyId}>{family.labelFr}</span>)}</div></div>}
                {screen03KnowledgeMap.solutionCandidates.length > 0 && <div className="mk-knowledge-map-group"><span>Fonctions reliées aux problèmes</span><ul>{screen03KnowledgeMap.solutionCandidates.slice(0,6).map((candidate)=><li key={candidate.conceptId}>{candidate.labelFr}</li>)}</ul></div>}
                {screen03KnowledgeMap.processCandidates.length > 0 && <div className="mk-knowledge-map-group"><span>Processus liés</span><ul>{screen03KnowledgeMap.processCandidates.slice(0,5).map((candidate)=><li key={candidate.conceptId}>{candidate.labelFr}</li>)}</ul></div>}
                {screen03KnowledgeMap.resourceCandidates.length > 0 && <div className="mk-knowledge-map-group"><span>Ressources liées</span><ul>{screen03KnowledgeMap.resourceCandidates.slice(0,5).map((candidate)=><li key={candidate.conceptId}>{candidate.labelFr}</li>)}</ul></div>}
                {screen03KnowledgeMap.indicatorCandidates.length > 0 && <div className="mk-knowledge-map-group"><span>Indicateurs à définir</span><ul>{screen03KnowledgeMap.indicatorCandidates.slice(0,5).map((candidate)=><li key={candidate.conceptId}>{candidate.labelFr}</li>)}</ul></div>}
                {screen03KnowledgeMap.unresolved.length > 0 && <p className="mk-knowledge-map-footnote">{screen03KnowledgeMap.unresolved.length} élément(s) restent inconnus, non classés ou à clarifier.</p>}
              </section>
            )}
            <div className="mk-understanding-sections">
              {populatedSections.length === 0 && <p className="mk-section-empty">Aucun élément structuré n'a encore été extrait. Ton récit initial reste conservé intégralement ; le diagnostic pourra commencer par clarifier l'activité ou l'idée.</p>}
              {populatedSections.map((section) => {
                const items = activeItems.filter((item) => item.dimension === section.id);
                return (
                  <section className="mk-understanding-section" key={section.id}>
                    <div className="mk-understanding-section-heading">
                      <div><h2>{section.title}</h2><p>{section.description}</p></div>
                      <span>{items.length}</span>
                    </div>
                    <div className="mk-understanding-items">
                      {items.map((item) => (
                          <article className="mk-understanding-item" key={item.id}>
                            {editingId === item.id ? (
                              <div className="mk-edit-item">
                                <label htmlFor={"edit-" + item.id}>Corriger cet élément</label>
                                <textarea id={"edit-" + item.id} value={editValue} onChange={(event) => { setEditValue(event.target.value); try { window.sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ itemId: item.id, value: event.target.value })); } catch { /* Le champ reste éditable. */ } }} rows={3} />
                                <div className="mk-inline-actions"><button type="button" className="mk-continue-button" onClick={saveEdit} disabled={!editValue.trim()}>Enregistrer la correction</button><button type="button" className="mk-tertiary-button" onClick={() => { setEditingId(null); try { window.sessionStorage.removeItem(EDIT_DRAFT_KEY); } catch { /* Rien à nettoyer. */ } }}>Annuler</button></div>
                              </div>
                            ) : (
                              <>
                                <p>{item.value}</p>
                                <div className="mk-item-meta"><span className={"mk-status mk-status-" + item.status}>{statusLabel(item.status)}</span><span>Source : {item.source === "conversation" ? "ton récit" : item.source === "user_correction" ? "ta correction" : "ta réponse au diagnostic"}</span></div>
                                <details><summary>Voir l'origine et l'historique</summary><p>{item.sourceQuote}</p><small>Référence : {item.sourceMessageId ?? item.sourceReferenceId ?? "source conservée"}</small>{item.supersedesId && <p><strong>Version précédente :</strong> {dossier.items.find((previous) => previous.id === item.supersedesId)?.value ?? "Version antérieure conservée."}</p>}</details>
                                <div className="mk-inline-actions">
                                  <button type="button" className="mk-small-action" onClick={() => startEdit(item)}>Modifier</button>
                                  {item.status !== "validated" && <button type="button" className="mk-small-action mk-small-action-gold" onClick={() => validateItem(item.id)}>Confirmer cet élément</button>}
                                  {(item.status === "hypothesis" || item.status === "inferred") && <button type="button" className="mk-small-action" onClick={() => rejectItem(item.id)}>Écarter cette interprétation</button>}
                                </div>
                              </>
                            )}
                          </article>
                        ))}
                    </div>
                  </section>
                );
              })}
            </div>
            {missingSections.length > 0 && <details className="mk-missing-sections"><summary>Voir les {missingSections.length} dimensions non encore identifiées</summary><ul>{missingSections.map((section) => <li key={section.id}><strong>{section.title}</strong><span>{section.description}</span></li>)}</ul><p>Ces dimensions ne sont pas des champs obligatoires. MerKora les explorera seulement si elles deviennent utiles au projet.</p></details>}

            <section className="mk-stage-next">
              <div><span className="mk-summary-kicker">PROCHAINE ÉTAPE</span><h2>Approfondir ce qui doit encore être compris</h2><p>La validation confirme les informations que tu as exprimées. Les hypothèses restent des hypothèses. Le diagnostic pourra préciser les éléments manquants, un par un.</p></div>
              <button type="button" className="mk-continue-button" onClick={continueToDiagnostic}>Valider et passer au diagnostic <span>→</span></button>
            </section>
            {notice && <p className="mk-stage-notice" role="status">{notice}</p>}
          </>
        )}
      </section>

      <footer className="mk-footer"><span><b>MerKora GDJ</b> · Comprendre avant de construire.</span><span>Vos idées restent les vôtres.</span></footer>
    </main>
  );
}
