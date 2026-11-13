"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/lib/project-types";
import { createConceptValidationState, createConceptVersionId, recordConceptDecision, startNewConceptVersion, type ConceptValidationState } from "@/lib/concept-validation";
import { getUniversalFamilyById } from "@/lib/universal-reference";
import {
  buildMockupModel,
  MOCKUP_PALETTE_TOKENS,
  type MockupConfig,
  type MockupFormat,
  type MockupPalette,
  type SolutionFormat,
  SOLUTION_FORMAT_LABELS,
  DELIVERABLE_FORMAT_CATALOG,
} from "@/lib/mockup-studio";

type Props = { project: Project; showValidation?: boolean; selectedRecommendationIds?: string[]; onSelectedRecommendationIdsChange?: (ids: string[]) => void; onConceptVersionChange?: (versionId: string) => void; onConceptDecision?: (state: ConceptValidationState) => void };
type LocalReviewStatus = "draft" | "changes_requested" | "approved";
type ClientQuoteResponse = "undecided" | "accepted" | "changes_requested" | "negotiate";
type StoredMockupConfig = Partial<MockupConfig> & { diagnosticResponses?: Record<string, string>; diagnosticSchemaVersion?: number; reviewStatus?: LocalReviewStatus; reviewNote?: string; quoteAmount?: string; quoteDays?: string; quotePaymentTerms?: string; clientQuoteResponse?: ClientQuoteResponse; clientQuoteNote?: string; conceptValidation?: ConceptValidationState };
const STORAGE_PREFIX = "merkora-gdj-mockup-v1:";
const solutionFormatOptions: { value: SolutionFormat; description: string }[] = [
  { value: "human", description: "Accompagnement, expertise, médiation ou intervention humaine." },
  { value: "organizational", description: "Rôles, méthodes, responsabilités et processus de travail." },
  { value: "documentary", description: "Guides, dossiers, formulaires, supports et ressources." },
  { value: "physical", description: "Objet, équipement, aménagement, prototype ou dispositif physique." },
  { value: "digital", description: "Service accessible par site web, application ou interface numérique." },
  { value: "hybrid", description: "Combinaison coordonnée de plusieurs formes de solution." },
];
const formatOptions: { value: MockupFormat; label: string; icon: string }[] = [
  { value: "website", label: "Site web", icon: "▤" },
  { value: "mobile", label: "Mobile", icon: "▯" },
  { value: "dashboard", label: "Tableau de bord", icon: "▦" },
];
const paletteOptions: { value: MockupPalette; label: string }[] = [
  { value: "violet", label: "Violet" },
  { value: "blue", label: "Bleu" },
  { value: "emerald", label: "Émeraude" },
  { value: "amber", label: "Ambre" },
];

export function ProjectMockupStudio({ project, showValidation = false, selectedRecommendationIds, onSelectedRecommendationIdsChange, onConceptVersionChange, onConceptDecision }: Props) {
  const [config, setConfig] = useState<MockupConfig>({ format: "website", formatConfirmed: false, solutionFormat: null, palette: "violet", enabledModules: [], selectedDeliverableFormats: [] });
  const [ready, setReady] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState("Vérification de la mémoire en ligne…");
  const workspaceRevisionRef = useRef(0);
  const workspacePayloadRef = useRef<Record<string, unknown>>({});
  const cloudAvailableRef = useRef(false);
  const skipCloudSaveRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<LocalReviewStatus>("draft");
  const [reviewNote, setReviewNote] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDays, setQuoteDays] = useState("");
  const [quotePaymentTerms, setQuotePaymentTerms] = useState("À convenir après échange avec le client");
  const [clientQuoteResponse, setClientQuoteResponse] = useState<ClientQuoteResponse>("undecided");
  const [clientQuoteNote, setClientQuoteNote] = useState("");
  const [diagnosticResponses, setDiagnosticResponses] = useState<Record<string, string>>({});
  const [conceptValidation, setConceptValidation] = useState<ConceptValidationState>(() => createConceptValidationState("pending"));
  const model = useMemo(() => buildMockupModel(project, config), [project, config]);
  const selectedSectorIds = config.selectedUniversalSectorIds ?? [];
  const visibleProfessionCandidates = selectedSectorIds.length
    ? model.professionCandidates.filter((candidate) => candidate.sectorIds?.some((sectorId) => selectedSectorIds.includes(sectorId)))
    : model.professionCandidates;
  const storageKey = `${STORAGE_PREFIX}${project.id}`;
  const conceptVersionId = useMemo(() => createConceptVersionId(project.id, project, { ...config, diagnosticResponses }), [project, config, diagnosticResponses]);

  useEffect(() => {
    if (!ready) return;
    setConceptValidation((current) => startNewConceptVersion(current, conceptVersionId));
    onConceptVersionChange?.(conceptVersionId);
  }, [ready, conceptVersionId, onConceptVersionChange]);

  useEffect(() => {
    if (!ready || !selectedRecommendationIds) return;
    setConfig((current) => {
      const existing = current.selectedRecommendationIds ?? [];
      if (existing.length === selectedRecommendationIds.length && existing.every((id, index) => id === selectedRecommendationIds[index])) return current;
      return { ...current, selectedRecommendationIds: [...selectedRecommendationIds] };
    });
  }, [ready, selectedRecommendationIds]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredMockupConfig;
        const formats: MockupFormat[] = ["website", "mobile", "dashboard"];
        const palettes: MockupPalette[] = ["violet", "blue", "emerald", "amber"];
        setReviewStatus(parsed.reviewStatus === "approved" || parsed.reviewStatus === "changes_requested" ? parsed.reviewStatus : "draft");
        setReviewNote(typeof parsed.reviewNote === "string" ? parsed.reviewNote.slice(0, 1200) : "");
        if (parsed.conceptValidation && typeof parsed.conceptValidation === "object" && parsed.conceptValidation.currentVersionId && Array.isArray(parsed.conceptValidation.history)) {
          setConceptValidation(parsed.conceptValidation);
        } else if (parsed.reviewStatus === "approved" || parsed.reviewStatus === "changes_requested") {
          const legacyVersionId = createConceptVersionId(project.id, project, parsed);
          setConceptValidation(recordConceptDecision(createConceptValidationState(legacyVersionId), {
            conceptVersionId: legacyVersionId,
            action: parsed.reviewStatus === "approved" ? "approve" : "request_changes",
            clientNote: typeof parsed.reviewNote === "string" ? parsed.reviewNote : "",
          }));
        }
        setQuoteAmount(typeof parsed.quoteAmount === "string" ? parsed.quoteAmount : "");
        setQuoteDays(typeof parsed.quoteDays === "string" ? parsed.quoteDays : "");
        setQuotePaymentTerms(typeof parsed.quotePaymentTerms === "string" ? parsed.quotePaymentTerms.slice(0, 500) : "À convenir après échange avec le client");
        setClientQuoteResponse(parsed.clientQuoteResponse === "accepted" || parsed.clientQuoteResponse === "changes_requested" || parsed.clientQuoteResponse === "negotiate" ? parsed.clientQuoteResponse : "undecided");
        setClientQuoteNote(typeof parsed.clientQuoteNote === "string" ? parsed.clientQuoteNote.slice(0, 1200) : "");
        setDiagnosticResponses(parsed.diagnosticSchemaVersion === 1 && parsed.diagnosticResponses && typeof parsed.diagnosticResponses === "object" && !Array.isArray(parsed.diagnosticResponses)
          ? Object.fromEntries(Object.entries(parsed.diagnosticResponses).filter((entry): entry is [string, string] => typeof entry[1] === "string").map(([id, value]) => [id, value.slice(0, 4000)]))
          : {});
        const solutionFormats: SolutionFormat[] = ["human", "organizational", "documentary", "physical", "digital", "hybrid"];
        const legacyDisplayChoice = parsed.solutionFormat === undefined && formats.includes(parsed.format as MockupFormat);
        setConfig({
          format: formats.includes(parsed.format as MockupFormat) ? parsed.format as MockupFormat : "website",
          solutionFormat: solutionFormats.includes(parsed.solutionFormat as SolutionFormat) ? parsed.solutionFormat as SolutionFormat : parsed.solutionFormat === null ? null : legacyDisplayChoice ? "digital" : null,
          formatConfirmed: parsed.formatConfirmed === true || legacyDisplayChoice,
          palette: palettes.includes(parsed.palette as MockupPalette) ? parsed.palette as MockupPalette : "violet",
          enabledModules: Array.isArray(parsed.enabledModules) ? parsed.enabledModules.filter((id): id is string => typeof id === "string") : [],
          moduleSelectionConfirmed: parsed.moduleSelectionConfirmed === true,
          ...(Array.isArray(parsed.selectedRecommendationIds)
            ? { selectedRecommendationIds: parsed.selectedRecommendationIds.filter((id): id is string => typeof id === "string") }
            : {}),
          ...(Array.isArray(parsed.selectedProfessionCandidateIds)
            ? { selectedProfessionCandidateIds: parsed.selectedProfessionCandidateIds.filter((id): id is string => typeof id === "string") }
            : {}),
          ...(Array.isArray(parsed.selectedUniversalSectorIds)
            ? { selectedUniversalSectorIds: parsed.selectedUniversalSectorIds.filter((id): id is string => typeof id === "string") }
            : {}),
          ...(Array.isArray(parsed.selectedDeliverableFormats)
            ? { selectedDeliverableFormats: parsed.selectedDeliverableFormats.filter((id): id is string => DELIVERABLE_FORMAT_CATALOG.some((item) => item.id === id)) }
            : {}),
        });
      }
    } catch {
      // Keep safe defaults if local storage is unavailable or malformed.
    } finally {
      setReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    let active = true;
    async function loadCloudWorkspace() {
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspace`, { cache: "no-store" });
        if (!response.ok) {
          cloudAvailableRef.current = false;
          if (active) setCloudSyncStatus(response.status === 401 ? "Connectez-vous pour synchroniser" : "Mémoire en ligne indisponible");
          return;
        }
        const result: unknown = await response.json();
        const workspace = result && typeof result === "object" && "workspace" in result
          ? (result as { workspace: unknown }).workspace : null;
        if (workspace && typeof workspace === "object") {
          const row = workspace as { revision?: unknown; payload?: unknown };
          workspaceRevisionRef.current = typeof row.revision === "number" ? row.revision : 0;
          const payload = row.payload && typeof row.payload === "object" && !Array.isArray(row.payload)
            ? row.payload as Record<string, unknown> : {};
          workspacePayloadRef.current = payload;
          const saved = payload.studioConfig && typeof payload.studioConfig === "object" && !Array.isArray(payload.studioConfig)
            ? payload.studioConfig as StoredMockupConfig : null;
          if (saved) {
            const formats: MockupFormat[] = ["website", "mobile", "dashboard"];
            const palettes: MockupPalette[] = ["violet", "blue", "emerald", "amber"];
            const solutionFormats: SolutionFormat[] = ["human", "organizational", "documentary", "physical", "digital", "hybrid"];
            const legacyDisplayChoice = saved.solutionFormat === undefined && formats.includes(saved.format as MockupFormat);
            setConfig({
              format: formats.includes(saved.format as MockupFormat) ? saved.format as MockupFormat : "website",
              solutionFormat: solutionFormats.includes(saved.solutionFormat as SolutionFormat) ? saved.solutionFormat as SolutionFormat : saved.solutionFormat === null ? null : legacyDisplayChoice ? "digital" : null,
              formatConfirmed: saved.formatConfirmed === true || legacyDisplayChoice,
              palette: palettes.includes(saved.palette as MockupPalette) ? saved.palette as MockupPalette : "violet",
              enabledModules: Array.isArray(saved.enabledModules) ? saved.enabledModules.filter((id): id is string => typeof id === "string") : [],
              moduleSelectionConfirmed: saved.moduleSelectionConfirmed === true,
              ...(Array.isArray(saved.selectedRecommendationIds) ? { selectedRecommendationIds: saved.selectedRecommendationIds.filter((id): id is string => typeof id === "string") } : {}),
              ...(Array.isArray(saved.selectedProfessionCandidateIds) ? { selectedProfessionCandidateIds: saved.selectedProfessionCandidateIds.filter((id): id is string => typeof id === "string") } : {}),
              ...(Array.isArray(saved.selectedUniversalSectorIds) ? { selectedUniversalSectorIds: saved.selectedUniversalSectorIds.filter((id): id is string => typeof id === "string") } : {}),
              ...(Array.isArray(saved.selectedDeliverableFormats) ? { selectedDeliverableFormats: saved.selectedDeliverableFormats.filter((id): id is string => DELIVERABLE_FORMAT_CATALOG.some((item) => item.id === id)) } : {}),
            });
            setDiagnosticResponses(saved.diagnosticSchemaVersion === 1 && saved.diagnosticResponses && typeof saved.diagnosticResponses === "object" && !Array.isArray(saved.diagnosticResponses)
              ? Object.fromEntries(Object.entries(saved.diagnosticResponses).filter((entry): entry is [string, string] => typeof entry[1] === "string").map(([id, value]) => [id, value.slice(0, 4000)]))
              : {});
            setReviewStatus(saved.reviewStatus === "approved" || saved.reviewStatus === "changes_requested" ? saved.reviewStatus : "draft");
            setReviewNote(typeof saved.reviewNote === "string" ? saved.reviewNote.slice(0, 1200) : "");
            if (saved.conceptValidation && typeof saved.conceptValidation === "object" && saved.conceptValidation.currentVersionId && Array.isArray(saved.conceptValidation.history)) {
              setConceptValidation(saved.conceptValidation);
            } else if (saved.reviewStatus === "approved" || saved.reviewStatus === "changes_requested") {
              const legacyVersionId = createConceptVersionId(project.id, project, saved);
              setConceptValidation(recordConceptDecision(createConceptValidationState(legacyVersionId), {
                conceptVersionId: legacyVersionId,
                action: saved.reviewStatus === "approved" ? "approve" : "request_changes",
                clientNote: typeof saved.reviewNote === "string" ? saved.reviewNote : "",
              }));
            }
            setQuoteAmount(typeof saved.quoteAmount === "string" ? saved.quoteAmount.slice(0, 80) : "");
            setQuoteDays(typeof saved.quoteDays === "string" ? saved.quoteDays.slice(0, 40) : "");
            setQuotePaymentTerms(typeof saved.quotePaymentTerms === "string" ? saved.quotePaymentTerms.slice(0, 500) : "À convenir après échange avec le client");
            setClientQuoteResponse(saved.clientQuoteResponse === "accepted" || saved.clientQuoteResponse === "changes_requested" || saved.clientQuoteResponse === "negotiate" ? saved.clientQuoteResponse : "undecided");
            setClientQuoteNote(typeof saved.clientQuoteNote === "string" ? saved.clientQuoteNote.slice(0, 1200) : "");
            skipCloudSaveRef.current = true;
          }
        } else {
          workspaceRevisionRef.current = 0;
        }
        cloudAvailableRef.current = true;
        if (active) setCloudSyncStatus("Mémoire du projet synchronisée");
      } catch {
        cloudAvailableRef.current = false;
        if (active) setCloudSyncStatus("Synchronisation en attente");
      } finally {
        if (active) setCloudLoaded(true);
      }
    }
    void loadCloudWorkspace();
    return () => { active = false; };
  }, [project.id]);

  useEffect(() => {
    if (!ready || !cloudLoaded || !cloudAvailableRef.current) return;
    if (skipCloudSaveRef.current) {
      skipCloudSaveRef.current = false;
      return;
    }
    const timer = window.setTimeout(async () => {
      setCloudSyncStatus("Synchronisation…");
      const payload = {
        ...workspacePayloadRef.current,
        schemaVersion: 1,
        project: {
          id: project.id, title: project.title, category: project.category,
          problem: project.problem, desiredOutcome: project.desiredOutcome,
          budget: project.budget, urgency: project.urgency,
        },
        discovery: project.discovery ?? null,
        studioConfig: {
          ...config, diagnosticSchemaVersion: 1, diagnosticResponses,
          reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote, conceptValidation,
        },
        clientConfirmedChoices: {
          selectedSectorIds: config.selectedUniversalSectorIds ?? [],
          selectedDeliverableFormats: config.selectedDeliverableFormats ?? [],
          selectedProfessionCandidateIds: config.selectedProfessionCandidateIds ?? [],
          selectedRecommendationIds: config.selectedRecommendationIds ?? [],
          enabledModules: config.enabledModules,
          moduleSelectionConfirmed: config.moduleSelectionConfirmed === true,
          deliverableFormat: config.format,
          visualDirection: config.palette,
          diagnosticResponses,
          clientQuoteResponse,
          quoteAmount,
          quoteDays,
          quotePaymentTerms,
          reviewStatus,
          reviewNote,
          clientQuoteNote,
          conceptValidation,
          conceptVersionId,
          solutionFormat: config.solutionFormat ?? null,
          displayFormatConfirmed: config.formatConfirmed === true,
        },
        updatedAt: new Date().toISOString(),
      };
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspace`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedRevision: workspaceRevisionRef.current,
            payload,
            eventType: Object.keys(diagnosticResponses).length ? "diagnostic_answer_saved" : "client_decision",
            summary: "Réponses et choix de conception du client synchronisés depuis le Studio.",
          }),
        });
        const result: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 409) {
            cloudAvailableRef.current = false;
            setCloudSyncStatus("Conflit : rechargez la dernière version");
          } else {
            setCloudSyncStatus("Synchronisation non confirmée");
          }
          return;
        }
        workspacePayloadRef.current = payload;
        if (result && typeof result === "object" && "revision" in result && typeof (result as { revision: unknown }).revision === "number") {
          workspaceRevisionRef.current = (result as { revision: number }).revision;
        }
        setCloudSyncStatus("Toutes vos décisions sont synchronisées");
      } catch {
        setCloudSyncStatus("Synchronisation en attente");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [ready, cloudLoaded, project, config, diagnosticResponses, reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote, conceptValidation, conceptVersionId]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ ...config, diagnosticSchemaVersion: 1, diagnosticResponses, reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote, conceptValidation }));
    } catch {
      // The preview still works for this session if storage is unavailable.
    }
  }, [config, diagnosticResponses, reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote, conceptValidation, ready, storageKey]);

  function commitConceptDecision(action: "approve" | "request_changes") {
    const next = recordConceptDecision(conceptValidation, {
      conceptVersionId,
      action,
      clientNote: reviewNote,
      decidedAt: new Date().toISOString(),
    });
    setConceptValidation(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        ...config,
        diagnosticSchemaVersion: 1,
        diagnosticResponses,
        reviewStatus: action === "approve" ? "approved" : "changes_requested",
        reviewNote,
        quoteAmount,
        quoteDays,
        quotePaymentTerms,
        clientQuoteResponse,
        clientQuoteNote,
        conceptValidation: next,
      }));
    } catch {
      // The parent journey state also records the explicit approval for this session.
    }
    onConceptDecision?.(next);
  }

  function updateDiagnosticAnswer(questionId: string, value: string) {
    setDiagnosticResponses((current) => ({ ...current, [questionId]: value.slice(0, 4000) }));
  }

  function toggleModule(id: string) {
    setConfig((current) => {
      const selected = current.moduleSelectionConfirmed ? current.enabledModules : [];
      const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
      return { ...current, enabledModules: next, moduleSelectionConfirmed: true };
    });
  }

  function toggleDeliverableFormat(id: string) {
    setConfig((current) => {
      const selected = current.selectedDeliverableFormats ?? [];
      return { ...current, selectedDeliverableFormats: selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id] };
    });
  }

  function toggleUniversalSector(id: string) {
    setConfig((current) => { const selected = current.selectedUniversalSectorIds ?? []; return { ...current, selectedUniversalSectorIds: selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id] }; });
  }

  function toggleProfessionCandidate(id: string) {
    setConfig((current) => {
      const selected = current.selectedProfessionCandidateIds ?? [];
      return {
        ...current,
        selectedProfessionCandidateIds: selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id],
      };
    });
  }

  function toggleRecommendation(id: string) {
    const current = config.selectedRecommendationIds ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    setConfig((value) => ({ ...value, selectedRecommendationIds: next }));
    onSelectedRecommendationIdsChange?.(next);
  }

  async function copySummary() {
    const summary = [
      `Projet : ${model.title}`,
      `Format d’aperçu : ${model.formatLabel}`,
      `Direction : ${model.domainLabel}`,
      ...(model.selectedDeliverableFormats.length > 0 ? [`Livrables confirmés : ${model.selectedDeliverableFormats.map((id) => DELIVERABLE_FORMAT_CATALOG.find((item) => item.id === id)?.label ?? id).join(" · ")}`] : ["Livrables : aucun format confirmé"]),
      ...(model.universalFamilyCandidates.length > 0 ? [`Familles de référence possibles : ${model.universalFamilyCandidates.map((family) => family.label).join(" · ")}`] : []),
      ...(model.selectedProfessionCandidates.length > 0 ? [`Métiers confirmés par le client : ${model.selectedProfessionCandidates.map((item) => item.title).join(" · ")}`] : ["Métier : à confirmer avec le client"]),
      ...(model.activityDiagnostic.selectedSectors.length > 0 ? [`Secteurs confirmés par le client : ${model.activityDiagnostic.selectedSectors.map((item) => item.label).join(" · ")}`] : ["Secteur : à confirmer avec le client"]),
      ...(model.businessSignals.signals.length ? ["Indices financiers et métier détectés :", ...model.businessSignals.signals.map((signal) => `- ${signal.label} [${signal.confidence}] : ${signal.evidence.join(", ")}`), `Capacités transversales à étudier : ${model.businessSignals.transversalCapabilities.join(", ")}`, model.businessSignals.caution] : ["Aucun indice financier explicite détecté dans le texte fourni."]),
      "Réponses au diagnostic :",
      ...model.activityDiagnostic.questions.map((item) => `- ${item.title} : ${diagnosticResponses[item.id]?.trim() || "Non renseignée"}`),
      `Palette : ${paletteOptions.find((item) => item.value === model.palette)?.label ?? model.palette}`,
      config.moduleSelectionConfirmed ? "Blocs retenus par le client :" : "Blocs proposés à examiner — non confirmés :",
      ...model.visibleModules.map((item) => `- Bloc : ${item.title} : ${item.description}`),
      Array.isArray(config.selectedRecommendationIds) ? "Pistes retenues par le client :" : "Pistes proposées à examiner — non confirmées :",
      ...model.visibleRecommendations.map((item) => `- ${item.title} : ${item.description} (raison : ${item.reason})`),
      `État de validation de la version : ${conceptValidation.status === "approved" ? "Approuvée par le client" : conceptValidation.status === "changes_requested" ? "Modifications demandées" : "À examiner"}`,
      ...(conceptValidation.clientNote.trim() ? [`Note du client : ${conceptValidation.clientNote.trim()}`] : []),
      "La validation concerne uniquement la version de concept affichée; elle ne vaut ni devis accepté ni paiement.",
      model.conceptNotice,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mockup-studio" aria-labelledby="mockup-studio-title">
      <div className="mockup-studio-heading">
        <div>
          <div className="eyebrow">ÉTAPE 02 · CONCEPTION VISUELLE</div>
          <h3 id="mockup-studio-title">Studio de maquettes MerKora</h3>
          <p>MerKora assemble un premier aperçu à partir du dossier. Le client pourra comparer les directions, demander des changements et valider le concept avant le devis.</p>
        </div>
        <span className="mockup-concept-badge">Concept · non fonctionnel</span>
        <span className="local-tag" role="status">{cloudSyncStatus}</span>
      </div>

      <div className="mockup-studio-layout">
        <aside className="mockup-controls" aria-label="Personnaliser la maquette">
          <details className="mockup-step" name="mockup-studio-step" open>
          <summary>01 · Nature de la solution</summary>
          <div className="mockup-control-group">
            <span className="mockup-control-title">Quelle forme de solution correspond le mieux à votre besoin ?</span>
            <p className="mockup-control-hint">Il ne s’agit pas encore de choisir un écran ou une technologie. Une solution peut être humaine, organisationnelle, documentaire, physique, numérique ou hybride.</p>
            <div className="mockup-solution-format-options">
              {solutionFormatOptions.map((option) => (
                <button key={option.value} type="button" className={config.solutionFormat === option.value ? "mockup-solution-format is-selected" : "mockup-solution-format"} aria-pressed={config.solutionFormat === option.value} onClick={() => setConfig((current) => ({ ...current, solutionFormat: option.value, formatConfirmed: false }))}>
                  <strong>{SOLUTION_FORMAT_LABELS[option.value]}</strong><small>{option.description}</small>
                </button>
              ))}
            </div>
            <button type="button" className="mockup-choice mockup-undecided-choice" aria-pressed={config.solutionFormat === null} onClick={() => setConfig((current) => ({ ...current, solutionFormat: null, formatConfirmed: false }))}>Je ne sais pas encore — garder la direction ouverte</button>
          </div>
          </details>

          {config.solutionFormat === "digital" && (
            <details className="mockup-step" name="mockup-studio-step" open>
              <summary>02 · Format de l’interface</summary>
              <div className="mockup-control-group">
                <span className="mockup-control-title">Quel aperçu numérique souhaitez-vous examiner ?</span>
                <p className="mockup-control-hint">Ce choix définit uniquement la représentation visuelle. Il ne transforme pas automatiquement votre projet en produit fonctionnel.</p>
                <div className="mockup-format-options">
                  {formatOptions.map((option) => (
                    <button key={option.value} type="button" className={config.formatConfirmed && config.format === option.value ? "mockup-choice is-selected" : "mockup-choice"} aria-pressed={config.formatConfirmed === true && config.format === option.value} onClick={() => setConfig((current) => ({ ...current, format: option.value, formatConfirmed: true }))}>
                      <span>{option.icon}</span>{option.label}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          )}
          {config.solutionFormat && config.solutionFormat !== "digital" && (
            <div className="mockup-nondigital-note"><strong>{SOLUTION_FORMAT_LABELS[config.solutionFormat]}</strong><p>Le concept sera présenté sous forme de parcours, d’organisation ou de livrable adapté. Aucune interface web, mobile ou tableau de bord ne sera supposée.</p></div>
          )}

          <details className="mockup-step" name="mockup-studio-step">
          <summary>03 · Formats de réalisation</summary>
          <div className="mockup-control-group">
            <span className="mockup-control-title">Formats de réalisation souhaités</span>
            <p className="mockup-control-hint">MerKora recommande des formats selon votre besoin. Vous pouvez en choisir plusieurs, retirer une suggestion ou ajouter un format non recommandé.</p>
            <div className="mockup-format-options mockup-deliverable-options">
              {DELIVERABLE_FORMAT_CATALOG.map((item) => {
                const selected = (config.selectedDeliverableFormats ?? []).includes(item.id);
                const recommendation = model.recommendedDeliverables.find((candidate) => candidate.id === item.id);
                return (
                  <button key={item.id} type="button" className={selected ? "mockup-choice is-selected" : "mockup-choice"} aria-pressed={selected} onClick={() => toggleDeliverableFormat(item.id)}>
                    <span aria-hidden="true">{selected ? "✓" : recommendation ? "✳" : "＋"}</span>
                    <span><strong>{item.label}</strong><small>{item.description}{recommendation ? ` Recommandé : ${recommendation.reason}` : ""}</small></span>
                  </button>
                );
              })}
            </div>
            <p className="mockup-control-hint">{(config.selectedDeliverableFormats ?? []).length} format(s) confirmé(s) par le client. Les recommandations non sélectionnées restent de simples suggestions.</p>
          </div>
          </details>

          <details className="mockup-step" name="mockup-studio-step">
          <summary>04 · Ambiance visuelle</summary>
          <div className="mockup-control-group">
            <span className="mockup-control-title">Ambiance visuelle</span>
            <div className="mockup-palette-options">
              {paletteOptions.map((option) => (
                <button key={option.value} type="button" className={`mockup-palette palette-${option.value}${config.palette === option.value ? " is-selected" : ""}`} aria-pressed={config.palette === option.value} onClick={() => setConfig((current) => ({ ...current, palette: option.value }))}>
                  <span aria-hidden="true" />{option.label}
                </button>
              ))}
            </div>
          </div>
          </details>

          <details className="mockup-step" name="mockup-studio-step">
          <summary>05 · Diagnostic métier et options</summary>
          <div className="mockup-control-group">
            <span className="mockup-control-title">Options du domaine : {model.domainLabel}</span>
            {model.universalFamilyCandidates.length > 0 && <p className="mockup-control-hint">Familles de référence possibles : {model.universalFamilyCandidates.map((family) => family.label).join(" · ")}. Cette correspondance aide à élargir l’analyse ; elle ne remplace pas la confirmation du métier et du secteur par le client.</p>}
            {model.universalFamilyCandidates.length > 0 && <div className="mockup-profession-confirmation">
              <span className="mockup-control-title" style={{ display: "block", marginTop: 12 }}>Secteurs d’activité à confirmer</span>
              <p className="mockup-control-hint">Coche uniquement les secteurs réellement concernés. Un projet peut en combiner plusieurs.</p>
              {model.universalFamilyCandidates.flatMap((family) => (getUniversalFamilyById(family.id)?.sectors ?? []).map((sector) => {
                const selected = (config.selectedUniversalSectorIds ?? []).includes(sector.id);
                return <label className="mockup-module-toggle" key={sector.id}><input type="checkbox" checked={selected} onChange={() => toggleUniversalSector(sector.id)} /><span><strong>{sector.label}</strong><small>{sector.description}</small></span></label>;
              }))}
            </div>}
            {model.professionCandidates.length > 0 && <div className="mockup-profession-confirmation">
              <span className="mockup-control-title" style={{ display: "block", marginTop: 12 }}>Métiers à confirmer avec le client</span>
              <p className="mockup-control-hint">Voici des pistes issues du référentiel. Coche uniquement les métiers réellement concernés. Aucun métier n’est sélectionné automatiquement et cette liste ne constitue pas une qualification officielle.</p>
              {visibleProfessionCandidates.map((candidate) => {
                const selected = model.selectedProfessionCandidates.some((item) => item.id === candidate.id);
                return <label className="mockup-module-toggle" key={candidate.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleProfessionCandidate(candidate.id)} />
                  <span><strong>{candidate.title}</strong><small>{candidate.sourceGroup} · candidat à confirmer</small></span>
                </label>;
              })}
            </div>}
            <div className="mockup-profession-confirmation">
              <span className="mockup-control-title" style={{ display: "block", marginTop: 16 }}>Diagnostic du travail réel</span>
              <p className="mockup-control-hint">{model.activityDiagnostic.status === "sector_focused" ? "Questions affinées selon les secteurs confirmés." : "Questions exploratoires : confirme les secteurs pour affiner le diagnostic."}</p>
              {model.businessSignals.signals.length > 0 && <div className="mockup-local-note"><strong>Indices financiers et opérationnels à approfondir</strong><ul>{model.businessSignals.signals.map((signal) => <li key={signal.id}><strong>{signal.label}</strong> — {signal.confidence === "explicit" ? "mention explicite" : "piste à vérifier"}<small>Repères détectés : {signal.evidence.join(", ")}</small><small>Question à poser : {signal.followUp}</small></li>)}</ul><small>{model.businessSignals.caution}</small></div>}
              {model.activityDiagnostic.questions.map((question) => <div className="mockup-module-toggle" key={question.id}><span><strong>{question.stage} — {question.title}</strong><small>{question.prompt}</small><small>Objectif : {question.purpose}</small><label className="mockup-review-note-label" htmlFor={`diagnostic-answer-${project.id}-${question.id}`}>Réponse du client</label><textarea id={`diagnostic-answer-${project.id}-${question.id}`} className="mockup-review-note" maxLength={4000} rows={3} value={diagnosticResponses[question.id] ?? ""} onChange={(event) => updateDiagnosticAnswer(question.id, event.target.value)} placeholder="Décris comment cela se passe réellement dans ton activité…" /></span></div>)}
              <p className="mockup-local-note">{model.activityDiagnostic.questions.filter((question) => diagnosticResponses[question.id]?.trim()).length} réponse(s) renseignée(s) sur {model.activityDiagnostic.questions.length}. Les réponses sont conservées dans ce navigateur comme copie de secours et synchronisées dans l’espace du projet lorsque la session est connectée et que la mémoire en ligne est disponible. Le statut en haut du Studio indique l’état réel de la synchronisation.</p>
            </div>
            <p className="mockup-control-hint">Ces fonctions sont adaptées au métier détecté. Coche uniquement celles que le client souhaite retenir; une proposition visible n'est pas encore une validation.</p>
            {model.modules.filter((item) => item.group === "metier").map((item) => {
              const selected = (config.moduleSelectionConfirmed === true || config.enabledModules.length > 0) && config.enabledModules.includes(item.id);
              return (
                <label className="mockup-module-toggle" key={item.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleModule(item.id)} />
                  <span><strong>{item.title}</strong><small>{item.description}</small></span>
                </label>
              );
            })}
            <span className="mockup-control-title" style={{ display: "block", marginTop: 16 }}>Options transversales (facultatives)</span>
            <p className="mockup-control-hint">Ces fonctions peuvent servir à plusieurs métiers. Elles ne sont pas ajoutées automatiquement au projet.</p>
            {model.transversalOptions.map((item) => {
              const selected = config.moduleSelectionConfirmed === true && config.enabledModules.includes(item.id);
              return (
                <label className="mockup-module-toggle" key={item.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleModule(item.id)} />
                  <span><strong>{item.title}</strong><small>{item.description}</small></span>
                </label>
              );
            })}
          </div>
          </details>

          <details className="mockup-step" name="mockup-studio-step">
          <summary>06 · Pistes de solution</summary>
          <div className="mockup-control-group">
            <span className="mockup-control-title">Pistes de solution proposées</span>
            <p className="mockup-control-hint">Sélectionne les pistes que le client veut réellement voir dans son concept. Les pistes décochées ne seront pas présentées comme retenues.</p>
            {model.recommendations.map((item) => {
              const selected = config.selectedRecommendationIds?.includes(item.id) ?? false;
              return (
                <label className="mockup-module-toggle" key={item.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleRecommendation(item.id)} />
                  <span><strong>{item.title}</strong><small>{item.description}</small><small>Pourquoi : {item.reason}</small></span>
                </label>
              );
            })}
            {model.recommendations.length === 0 && <p className="mockup-control-hint">Aucune piste n’est disponible. Les pistes apparaîtront ici après l’analyse du besoin.</p>}
          </div>
          </details>

          {showValidation && (
            <section className="mockup-review-panel" aria-labelledby={`mockup-review-title-${project.id}`}>
              <div className="mockup-review-heading">
                <div><span className="mockup-control-title">DÉCISION SUR CETTE VERSION</span><h4 id={`mockup-review-title-${project.id}`}>Le concept correspond-il à votre besoin ?</h4></div>
                <span className={`mockup-review-status status-${conceptValidation.status}`}>{conceptValidation.status === "approved" ? "Version approuvée" : conceptValidation.status === "changes_requested" ? "Modifications demandées" : "Brouillon à examiner"}</span>
              </div>
              <label className="mockup-review-note-label" htmlFor={`mockup-review-note-${project.id}`}>Votre retour ou les changements souhaités</label>
              <textarea id={`mockup-review-note-${project.id}`} className="mockup-review-note" maxLength={1200} value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder="Décrivez ce qui doit être ajusté avant de valider cette version…" />
              <div className="mockup-review-actions">
                <button type="button" className="button button-quiet" onClick={() => commitConceptDecision("request_changes")}>Demander des modifications</button>
                <button type="button" className="button button-primary" onClick={() => commitConceptDecision("approve")}>Valider cette version</button>
              </div>
              <p className="mockup-local-note">Cette décision est liée à la version {conceptVersionId}. Une modification ultérieure du concept créera une nouvelle version à valider. Elle ne vaut ni acceptation d’un devis ni paiement.</p>
              {conceptValidation.history.length > 0 && <p className="mockup-local-note">Historique conservé : {conceptValidation.history.length} décision(s) sur les versions précédentes ou actuelle.</p>}
            </section>
          )}
          <button type="button" className="button button-quiet mockup-copy-button" onClick={() => void copySummary()}>{copied ? "Résumé copié ✓" : "Copier le résumé du concept ↗"}</button>
          <p className="mockup-local-note">Les réponses du diagnostic, secteurs, métiers, modules, commentaires et choix de présentation sont conservés localement comme secours et synchronisés dans la mémoire du projet lorsque la session est connectée. Vérifiez le statut affiché en haut avant de quitter.</p>
        </aside>

        <div
          className={`mockup-preview-wrap palette-${model.palette} format-${model.previewKind === "digital" ? model.format : model.previewKind}`}
          style={{
            "--mockup-accent": MOCKUP_PALETTE_TOKENS[model.palette].accent,
            "--mockup-accent-soft": MOCKUP_PALETTE_TOKENS[model.palette].accentSoft,
            "--mockup-accent-deep": MOCKUP_PALETTE_TOKENS[model.palette].accentDeep,
          } as CSSProperties}
        >
          <div className="mockup-preview-toolbar"><span><i /> {model.previewKind === "digital" ? "Aperçu visuel conceptuel" : "Concept en cours de définition"}</span><span>{model.formatLabel}</span><span>Couleur : {paletteOptions.find((option) => option.value === model.palette)?.label ?? model.palette}</span></div>
          {model.previewKind === "exploration" ? (
            <div className="mockup-neutral-preview"><span className="mockup-kicker">CONCEPT À EXPLORER</span><h4>{model.title}</h4><p>{model.supportingCopy}</p><div className="mockup-neutral-prompt"><strong>La forme de solution reste ouverte.</strong><span>Choisissez d’abord une direction parmi les formes humaine, organisationnelle, documentaire, physique, numérique ou hybride.</span></div></div>
          ) : model.previewKind === "digital_selection" ? (
            <div className="mockup-neutral-preview"><span className="mockup-kicker">SOLUTION NUMÉRIQUE</span><h4>{model.title}</h4><p>{model.supportingCopy}</p><div className="mockup-neutral-prompt"><strong>Quel type d’interface souhaitez-vous examiner ?</strong><span>Site web, application mobile ou tableau de bord : aucun n’est présélectionné.</span></div></div>
          ) : model.previewKind === "universal" ? (
            <div className="mockup-neutral-preview"><span className="mockup-kicker">{model.solutionFormatLabel.toLocaleUpperCase("fr")}</span><h4>{model.title}</h4><p>{model.supportingCopy}</p><div className="mockup-universal-preview-grid"><article><span>01</span><strong>Situation à traiter</strong><p>{project.problem}</p></article><article><span>02</span><strong>Résultat attendu</strong><p>{project.desiredOutcome}</p></article><article><span>03</span><strong>Éléments à construire</strong><p>{model.visibleModules.slice(0, 3).map((item) => item.title).join(" · ") || "À préciser avec vous"}</p></article></div><div className="mockup-neutral-prompt"><strong>Concept de travail — pas un écran numérique.</strong><span>La présentation suit la nature de la solution retenue.</span></div></div>
          ) : model.format === "mobile" ? (
            <div className="mockup-phone">
              <div className="mockup-phone-top"><span /> <span>•••</span></div>
              <div className="mockup-preview-brand"><span className="mockup-brand-mark">M</span><strong>{model.title}</strong><button type="button" aria-label="Menu conceptuel">☰</button></div>
              <div className="mockup-hero mockup-hero-mobile"><span className="mockup-kicker">{model.domainLabel}</span><h4>{model.headline}</h4><p>{model.supportingCopy}</p><button type="button" className="mockup-preview-cta">Découvrir les pistes <span>→</span></button></div>
              <div className="mockup-module-stack">{model.visibleModules.map((item, index) => <article className="mockup-content-card" key={item.id}><span className="mockup-card-index">0{index + 1}</span><div><h5>{item.title}</h5><p>{item.description}</p></div><span className="mockup-card-arrow">↗</span></article>)}</div>
              {model.visibleRecommendations.length > 0 && <section className="mockup-solution-tracks" aria-label="Pistes de solution"><h5>{Array.isArray(config.selectedRecommendationIds) ? "Pistes retenues par le client" : "Pistes proposées à examiner"}</h5>{model.visibleRecommendations.map((item) => <article className="mockup-content-card" key={item.id}><div><h5>{item.title}</h5><p>{item.description}</p><small>Pourquoi : {item.reason}</small></div></article>)}</section>}
              <div className="mockup-phone-footer">Concept d’interface · aperçu</div>
            </div>
          ) : (
            <div className={`mockup-browser ${model.format === "dashboard" ? "is-dashboard" : ""}`}>
              <div className="mockup-browser-chrome"><span /><span /><span /><div>aperçu.merkora / {model.title.toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}</div></div>
              <div className="mockup-browser-body">
                {model.format === "dashboard" && <aside className="mockup-demo-sidebar"><div className="mockup-demo-logo">M <span>{model.title}</span></div><span className="is-active">Vue d’ensemble</span><span>Mes espaces</span><span>Ressources</span><span>Paramètres</span><div className="mockup-demo-user">Profil de démonstration</div></aside>}
                <div className="mockup-demo-main">
                  {model.format === "website" && <nav className="mockup-demo-nav"><div className="mockup-demo-logo">M <span>{model.title}</span></div><div><span>Découvrir</span><span>Parcours</span><span>À propos</span></div><button type="button">Commencer ↗</button></nav>}
                  <div className="mockup-hero"><span className="mockup-kicker">{model.domainLabel}</span><h4>{model.headline}</h4><p>{model.supportingCopy}</p><button type="button" className="mockup-preview-cta">{model.format === "dashboard" ? "Continuer le parcours" : "Découvrir les pistes"} <span>→</span></button><div className="mockup-hero-orbit" aria-hidden="true"><span>✳</span></div></div>
                  <div className="mockup-preview-section-title"><div><span>VOTRE ESPACE</span><h5>Ce que vous pourrez explorer</h5></div><span className="mockup-section-counter">{model.visibleModules.length} bloc(s) conceptuels</span></div>
                  <div className="mockup-module-grid">{model.visibleModules.map((item, index) => <article className="mockup-content-card" key={item.id}><span className="mockup-card-index">0{index + 1}</span><h5>{item.title}</h5><p>{item.description}</p><span className="mockup-card-arrow">↗</span></article>)}</div>
                  {model.visibleRecommendations.length > 0 && <section className="mockup-solution-tracks" aria-label="Pistes de solution"><div className="mockup-preview-section-title"><div><span>{Array.isArray(config.selectedRecommendationIds) ? "PISTES RETENUES" : "PISTES PROPOSÉES"}</span><h5>{Array.isArray(config.selectedRecommendationIds) ? "Les pistes que vous avez retenues" : "Des pistes à examiner"}</h5></div><span className="mockup-section-counter">{model.visibleRecommendations.length} piste(s)</span></div>{model.visibleRecommendations.map((item) => <article className="mockup-content-card" key={item.id}><h5>{item.title}</h5><p>{item.description}</p><small>Pourquoi : {item.reason}</small></article>)}</section>}
                  <div className="mockup-demo-footer">Contenu de démonstration · à confirmer avec le client</div>
                </div>
              </div>
            </div>
          )}
          <div className="mockup-preview-disclaimer"><span>ⓘ</span>{model.conceptNotice}</div>
          <section className="mockup-image-studio" aria-labelledby="mockup-image-title">
            <div className="mockup-image-studio-heading">
              <div>
                <span className="mockup-kicker">MODE ZÉRO DÉPENSE</span>
                <h4 id="mockup-image-title">Visualiser votre idée</h4>
                <p>La maquette interactive ci-dessus est générée directement par MerKora. Les appels à un fournisseur d’images IA externe restent désactivés pour garantir qu’aucun crédit ou paiement ne soit consommé.</p>
              </div>
            </div>
            <p className="mockup-local-note">Alternative gratuite disponible : personnalise le format, les couleurs, les blocs et les pistes retenues, puis copie le résumé du concept. Cette maquette est un aperçu, pas encore une application fonctionnelle.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
