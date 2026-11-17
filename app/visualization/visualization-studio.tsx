"use client";

import "./visualization.css";

import React, { useEffect, useMemo, useState } from "react";
import { buildVisualBlueprint, type VisualBlueprint, type VisualDeliveryMode, type VisualProductNature, type VisualScreen } from "../../src/lib/merkora-core/visual-blueprint";
import type { ProjectUnderstanding } from "../../src/lib/merkora-core/project-diagnostic";
import type { ProductDefinitionSession } from "../../src/lib/merkora-core/product-definition";
import type { SolutionProposal } from "../../src/lib/merkora-core/solution-proposal";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const PROPOSAL_KEY = "merkora-v2-solution-proposal";
const STUDIO_KEY = "merkora-v2-design-studio";

interface StoredProposal {
  definitionVersion: number;
  proposal: SolutionProposal;
  validated: boolean;
}

type WorkspaceId = "type" | "identity" | "references" | "architecture" | "prototype" | "validation";
type PaletteId = "violet" | "ocean" | "forest" | "sand" | "mono" | "custom";
type LayoutId = "sidebar" | "topbar" | "bottom";
type StyleId = "modern" | "minimal" | "professional" | "institutional" | "luxury" | "futuristic" | "playful" | "editorial";
type DeviceId = "desktop" | "tablet" | "mobile";
type ComponentId = "cards" | "tables" | "dialogs" | "calendar" | "dashboard" | "charts";

interface DesignPreferences {
  productNature: VisualProductNature;
  natureConfirmed: boolean;
  deliveryModes: VisualDeliveryMode[];
  deliveryModesConfirmed: boolean;
  palette: PaletteId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  paletteConfirmed: boolean;
  layout: LayoutId;
  layoutConfirmed: boolean;
  style: StyleId;
  styleConfirmed: boolean;
  devices: DeviceId[];
  devicesConfirmed: boolean;
  components: ComponentId[];
  customInstructions: string;
}

interface ReferenceAsset {
  id: string;
  kind: "logo" | "reference";
  name: string;
  dataUrl: string;
  notes: string;
  addedAt: string;
}

interface OfficialDesignVersion {
  version: number;
  revision: number;
  sourceProposalVersion: number;
  approvedAt: string;
  approvedBy: string;
  preferences: DesignPreferences;
  screenIds: string[];
  decisionRegister: VisualBlueprint["decisionRegister"];
  referenceNames: string[];
  changeRequests: string[];
}

interface DesignStudioState {
  projectId: string;
  sourceProposalVersion: number;
  revision: number;
  preferences: DesignPreferences;
  references: ReferenceAsset[];
  changeRequests: string[];
  versions: OfficialDesignVersion[];
  validatedVersion: number | null;
  updatedAt: string;
}

const WORKSPACES: Array<{ id: WorkspaceId; number: string; title: string; subtitle: string }> = [
  { id: "type", number: "01", title: "Réalisation", subtitle: "Nature et accès" },
  { id: "identity", number: "02", title: "Identité", subtitle: "Style et apparence" },
  { id: "references", number: "03", title: "Références", subtitle: "Images et croquis" },
  { id: "architecture", number: "04", title: "Écrans", subtitle: "Structure du produit" },
  { id: "prototype", number: "05", title: "Prototype", subtitle: "Aperçu interactif" },
  { id: "validation", number: "06", title: "Validation", subtitle: "Sources et versions" },
];

const PALETTES: Record<Exclude<PaletteId, "custom">, { primary: string; secondary: string; accent: string; label: string }> = {
  violet: { primary: "#6553b7", secondary: "#eee9fb", accent: "#c6a46b", label: "Violet créatif" },
  ocean: { primary: "#176b87", secondary: "#e4f2f7", accent: "#d6a65f", label: "Bleu océan" },
  forest: { primary: "#34745b", secondary: "#e7f2eb", accent: "#c3a46b", label: "Vert naturel" },
  sand: { primary: "#8b6845", secondary: "#f5eee4", accent: "#bd9556", label: "Sable chaleureux" },
  mono: { primary: "#343a46", secondary: "#edf0f3", accent: "#9a805b", label: "Noir et blanc" },
};

const NATURE_OPTIONS: Array<{ value: VisualProductNature; title: string; description: string; mark: string }> = [
  { value: "website", title: "Site web", description: "Vitrine, institutionnel, éditorial ou commercial.", mark: "W" },
  { value: "platform", title: "Plateforme", description: "Plusieurs espaces, gestion, administration et processus.", mark: "P" },
  { value: "application", title: "Application", description: "Mobile, web ou hybride selon les usages.", mark: "A" },
  { value: "other", title: "Autre solution", description: "Logiciel spécialisé, outil interne ou système connecté.", mark: "＋" },
];

const DELIVERY_OPTIONS: Array<{ value: VisualDeliveryMode; title: string; description: string }> = [
  { value: "browser", title: "Navigateur", description: "Accessible par une adresse web." },
  { value: "pwa", title: "PWA installable", description: "Installable depuis le navigateur." },
  { value: "web", title: "Web", description: "Expérience conçue pour ordinateur et tablette." },
  { value: "mobile", title: "Mobile", description: "Application pensée pour Android ou iPhone." },
  { value: "hybrid", title: "Hybride", description: "Combinaison web et mobile." },
];

const STYLE_OPTIONS: Array<{ value: StyleId; title: string; description: string }> = [
  { value: "modern", title: "Moderne", description: "Équilibré, actuel et dynamique." },
  { value: "minimal", title: "Minimaliste", description: "Simple, épuré et direct." },
  { value: "professional", title: "Professionnel", description: "Clair, structuré et rassurant." },
  { value: "institutional", title: "Institutionnel", description: "Sobre et formel." },
  { value: "luxury", title: "Luxe", description: "Raffiné, élégant et soigné." },
  { value: "futuristic", title: "Futuriste", description: "Technologique et expérimental." },
  { value: "playful", title: "Ludique", description: "Accessible, vivant et expressif." },
  { value: "editorial", title: "Éditorial", description: "Typographie et contenu au premier plan." },
];

const COMPONENT_OPTIONS: Array<{ value: ComponentId; title: string }> = [
  { value: "cards", title: "Cartes" },
  { value: "tables", title: "Tableaux" },
  { value: "dialogs", title: "Fenêtres de dialogue" },
  { value: "calendar", title: "Calendrier" },
  { value: "dashboard", title: "Tableau de bord" },
  { value: "charts", title: "Graphiques" },
];

function createInitialStudio(blueprint: VisualBlueprint): DesignStudioState {
  return {
    projectId: "",
    sourceProposalVersion: blueprint.sourceVersion,
    revision: 1,
    preferences: {
      productNature: blueprint.productNature,
      natureConfirmed: blueprint.productNatureStatus === "confirmed",
      deliveryModes: blueprint.deliveryModes,
      deliveryModesConfirmed: blueprint.deliveryModeStatus === "confirmed",
      palette: "violet",
      primaryColor: PALETTES.violet.primary,
      secondaryColor: PALETTES.violet.secondary,
      accentColor: PALETTES.violet.accent,
      paletteConfirmed: false,
      layout: "sidebar",
      layoutConfirmed: false,
      style: "professional",
      styleConfirmed: false,
      devices: ["desktop", "tablet", "mobile"],
      devicesConfirmed: false,
      components: ["cards", "tables", "dashboard"],
      customInstructions: "",
    },
    references: [],
    changeRequests: [],
    versions: [],
    validatedVersion: null,
    updatedAt: new Date().toISOString(),
  };
}

function loadStudioState(blueprint: VisualBlueprint, projectId: string): DesignStudioState {
  try {
    const raw = window.sessionStorage.getItem(STUDIO_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as DesignStudioState;
      if (saved.projectId === projectId && saved.sourceProposalVersion === blueprint.sourceVersion && saved.preferences) {
        return saved;
      }
    }
  } catch {
    // Un brouillon de conception illisible est remplacé sans toucher aux étapes précédentes.
  }
  return { ...createInitialStudio(blueprint), projectId };
}

function labelForNature(value: VisualProductNature): string {
  return NATURE_OPTIONS.find((option) => option.value === value)?.title ?? "À choisir";
}

function screenSummary(screen: VisualScreen): string {
  return screen.features.length === 1
    ? "1 fonction retenue"
    : screen.features.length + " fonctions retenues";
}

export default function VisualizationStudio({ actor, email }: { actor: string; email: string }) {
  const [blueprint, setBlueprint] = useState<VisualBlueprint | null>(null);
  const [studio, setStudio] = useState<DesignStudioState | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceId>("type");
  const [activeScreenId, setActiveScreenId] = useState("overview");
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<DeviceId>("desktop");
  const [simulationMessage, setSimulationMessage] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [problem, setProblem] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const dossierRaw = window.sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = window.sessionStorage.getItem(DEFINITION_KEY);
      const proposalRaw = window.sessionStorage.getItem(PROPOSAL_KEY);
      if (!dossierRaw || !definitionRaw || !proposalRaw) {
        setProblem("Les informations validées des écrans 03, 05 et 06 sont introuvables dans cet onglet.");
      } else {
        const dossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
        const definition = JSON.parse(definitionRaw) as ProductDefinitionSession;
        const stored = JSON.parse(proposalRaw) as StoredProposal;
        if (!stored.validated) {
          setProblem("La composition de la solution doit d'abord être validée à l'écran 06.");
        } else if (definition.status !== "ready_for_review" || stored.definitionVersion !== definition.version) {
          setProblem("La définition du produit a changé. Vérifie à nouveau la composition à l'écran 06.");
        } else if (stored.proposal.projectId !== dossier.projectId) {
          setProblem("Les données chargées ne correspondent pas au même projet.");
        } else {
          const nextBlueprint = buildVisualBlueprint(dossier, definition, stored.proposal);
          setBlueprint(nextBlueprint);
          setStudio(loadStudioState(nextBlueprint, dossier.projectId));
        }
      }
    } catch {
      setProblem("L'atelier n'a pas pu être préparé à partir des décisions validées du projet.");
    }
    setLoaded(true);
  }, []);

  const currentScreen = useMemo(
    () => blueprint?.screens.find((screen) => screen.id === activeScreenId) ?? null,
    [blueprint, activeScreenId],
  );
  const selectedFeature = currentScreen?.features.find((feature) => feature.id === activeFeatureId) ?? null;
  const activeProfileData = blueprint?.profiles[activeProfile] ?? null;
  const acceptedFeatureCount = blueprint?.screens.reduce((total, screen) => total + screen.features.length, 0) ?? 0;
  const isOperational = blueprint?.kind === "operational";

  function persist(next: DesignStudioState) {
    setStudio(next);
    try {
      window.sessionStorage.setItem(STUDIO_KEY, JSON.stringify(next));
      setNotice("Décision enregistrée dans l'atelier de cette session.");
    } catch {
      setNotice("La décision reste visible, mais le navigateur n'a pas pu la conserver. Garde cet onglet ouvert.");
    }
  }

  function reviseStudio(patch: Partial<Pick<DesignStudioState, "preferences" | "references" | "changeRequests">>) {
    if (!studio) return;
    persist({
      ...studio,
      ...patch,
      revision: studio.revision + 1,
      validatedVersion: null,
      updatedAt: new Date().toISOString(),
    });
  }

  function revisePreferences(patch: Partial<DesignPreferences>) {
    if (!studio) return;
    reviseStudio({ preferences: { ...studio.preferences, ...patch } });
  }

  function selectPalette(palette: Exclude<PaletteId, "custom">) {
    const colors = PALETTES[palette];
    revisePreferences({
      palette,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
      paletteConfirmed: true,
    });
  }

  function toggleDeliveryMode(mode: VisualDeliveryMode) {
    if (!studio) return;
    const current = studio.preferences.deliveryModes;
    const next = current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode];
    revisePreferences({ deliveryModes: next, deliveryModesConfirmed: true });
  }

  function toggleDevice(device: DeviceId) {
    if (!studio) return;
    const current = studio.preferences.devices;
    const next = current.includes(device) ? current.filter((item) => item !== device) : [...current, device];
    revisePreferences({ devices: next, devicesConfirmed: true });
  }

  function toggleComponent(component: ComponentId) {
    if (!studio) return;
    const current = studio.preferences.components;
    const next = current.includes(component) ? current.filter((item) => item !== component) : [...current, component];
    revisePreferences({ components: next });
  }

  function addAsset(event: React.ChangeEvent<HTMLInputElement>, kind: ReferenceAsset["kind"]) {
    const file = event.currentTarget.files?.[0];
    if (!file || !studio) return;
    event.currentTarget.value = "";
    if (!file.type.startsWith("image/")) {
      setNotice("Choisis un fichier image (PNG, JPG, WebP ou SVG).");
      return;
    }
    if (file.size > 1_200_000) {
      setNotice("Cette image dépasse 1,2 Mo. Réduis sa taille avant de l'ajouter à la session.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string" || !studio) return;
      const asset: ReferenceAsset = {
        id: "reference-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        kind,
        name: file.name,
        dataUrl: reader.result,
        notes: "",
        addedAt: new Date().toISOString(),
      };
      reviseStudio({ references: [...studio.references, asset] });
    };
    reader.onerror = () => setNotice("Le fichier n'a pas pu être lu par le navigateur.");
    reader.readAsDataURL(file);
  }

  function updateReferenceNotes(id: string, notes: string) {
    if (!studio) return;
    reviseStudio({ references: studio.references.map((item) => item.id === id ? { ...item, notes } : item) });
  }

  function removeReference(id: string) {
    if (!studio) return;
    reviseStudio({ references: studio.references.filter((item) => item.id !== id) });
  }

  function addChangeRequest() {
    const note = feedbackDraft.trim();
    if (!note || !studio) return;
    reviseStudio({ changeRequests: [...studio.changeRequests, note] });
    setFeedbackDraft("");
  }

  function validateDesign() {
    if (!studio || !blueprint) return;
    const missing: string[] = [];
    if (!studio.preferences.natureConfirmed || studio.preferences.productNature === "undecided") missing.push("la nature du produit");
    if (blueprint.kind === "digital" && (!studio.preferences.deliveryModesConfirmed || studio.preferences.deliveryModes.length === 0)) missing.push("le mode d'accès");
    if (!studio.preferences.paletteConfirmed) missing.push("la palette de couleurs");
    if (!studio.preferences.layoutConfirmed) missing.push("la structure de navigation");
    if (!studio.preferences.styleConfirmed) missing.push("le style de présentation");
    if (!studio.preferences.devicesConfirmed || studio.preferences.devices.length === 0) missing.push("les appareils compatibles");
    if (missing.length) {
      setNotice("Avant de figer la conception, confirme : " + missing.join(", ") + ".");
      return;
    }
    const versionNumber = (studio.versions[studio.versions.length - 1]?.version ?? 0) + 1;
    const version: OfficialDesignVersion = {
      version: versionNumber,
      revision: studio.revision,
      sourceProposalVersion: blueprint.sourceVersion,
      approvedAt: new Date().toISOString(),
      approvedBy: actor,
      preferences: studio.preferences,
      screenIds: blueprint.screens.map((screen) => screen.id),
      decisionRegister: blueprint.decisionRegister,
      referenceNames: studio.references.map((reference) => reference.name),
      changeRequests: studio.changeRequests,
    };
    persist({
      ...studio,
      versions: [...studio.versions, version],
      validatedVersion: versionNumber,
      revision: studio.revision + 1,
      updatedAt: new Date().toISOString(),
    });
    setNotice("Version " + versionNumber + " de la conception validée dans cette session.");
  }

  function simulateAction() {
    setSimulationMessage("Interaction de démonstration terminée. Aucune donnée métier n'a été créée, envoyée ou modifiée.");
  }

  const canValidate = Boolean(
    studio && blueprint &&
    studio.preferences.natureConfirmed &&
    studio.preferences.productNature !== "undecided" &&
    (blueprint.kind !== "digital" || (studio.preferences.deliveryModesConfirmed && studio.preferences.deliveryModes.length > 0)) &&
    studio.preferences.paletteConfirmed &&
    studio.preferences.layoutConfirmed &&
    studio.preferences.styleConfirmed &&
    studio.preferences.devicesConfirmed &&
    studio.preferences.devices.length > 0,
  );

  const previewStyle = studio ? ({
    "--product-primary": studio.preferences.primaryColor,
    "--product-secondary": studio.preferences.secondaryColor,
    "--product-accent": studio.preferences.accentColor,
  } as React.CSSProperties) : undefined;

  if (!loaded) {
    return <main className="mk-v2-page mk-studio-page"><div className="mk-studio-loading">Préparation de l'atelier de conception…</div></main>;
  }

  if (problem || !blueprint || !studio) {
    return (
      <main className="mk-v2-page mk-studio-page">
        <header className="mk-header">
          <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>ATELIER DE CONCEPTION</small></span></a>
          <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
        </header>
        <section className="mk-studio-error"><span className="mk-studio-kicker">ÉTAPE 07 · ATELIER DE CONCEPTION</span><h1>Le projet n'est pas encore prêt pour la conception.</h1><p>{problem || "Les décisions précédentes ne sont pas disponibles."}</p><a className="mk-studio-primary-link" href="/solution-proposal">Revenir à la composition <span>→</span></a></section>
      </main>
    );
  }

  return (
    <main className="mk-v2-page mk-studio-page">
      <div className="mk-studio-glow" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · ATELIER</small></span>
        </a>
        <div className="mk-studio-account"><span className="mk-studio-account-dot" /><span><strong>{actor}</strong><small>{email}</small></span></div>
        <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
      </header>

      <section className="mk-studio-wrap">
        <div className="mk-studio-heading">
          <div>
            <span className="mk-studio-kicker">ÉTAPE 07 · CONCEPTION VISUELLE ET FONCTIONNELLE</span>
            <h1>Entrons dans ton <em>atelier de conception.</em></h1>
            <p>Les décisions validées deviennent une structure de produit. Choisis son identité, organise ses écrans, explore le prototype et vérifie pourquoi chaque élément existe.</p>
          </div>
          <div className="mk-studio-project-card">
            <span>PROJET EN COURS</span>
            <strong>{blueprint.projectTitle}</strong>
            <small>{acceptedFeatureCount} fonction(s) retenue(s) · version source {blueprint.sourceVersion}</small>
          </div>
        </div>

        <nav className="mk-studio-workspaces" aria-label="Espaces de conception">
          {WORKSPACES.map((item) => (
            <button type="button" key={item.id} className={workspace === item.id ? "is-active" : ""} onClick={() => setWorkspace(item.id)}>
              <span className="mk-studio-step-number">{item.number}</span>
              <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
              {workspace === item.id && <i aria-hidden="true">●</i>}
            </button>
          ))}
        </nav>

        {notice && <p className="mk-studio-notice" role="status">{notice}</p>}

        {workspace === "type" && (
          <section className="mk-studio-panel">
            <div className="mk-studio-panel-heading">
              <div><span className="mk-studio-kicker">01 · CHOIX DE RÉALISATION</span><h2>Quelle forme doit prendre le produit ?</h2><p>La nature du produit et son mode de livraison sont deux décisions différentes. Une plateforme peut, par exemple, être accessible sur navigateur et installable comme PWA.</p></div>
              <span className={studio.preferences.natureConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.natureConfirmed ? "Choix confirmé" : "À confirmer"}</span>
            </div>
            {blueprint.productNatureStatus === "suggested" && !studio.preferences.natureConfirmed && <p className="mk-studio-suggestion">MerKora suggère « {labelForNature(studio.preferences.productNature)} » à partir des informations déjà fournies. Tu peux confirmer ou choisir autre chose.</p>}
            {blueprint.productNatureStatus === "conflicting" && <p className="mk-studio-warning">Plusieurs natures différentes ont été détectées dans les réponses. Choisis celle qui correspond réellement au produit final.</p>}
            <div className="mk-studio-nature-grid">
              {NATURE_OPTIONS.map((option) => (
                <button type="button" key={option.value} className={studio.preferences.productNature === option.value ? "is-selected" : ""} onClick={() => revisePreferences({ productNature: option.value, natureConfirmed: true })}>
                  <span className="mk-studio-option-mark">{option.mark}</span><strong>{option.title}</strong><small>{option.description}</small><i>{studio.preferences.productNature === option.value ? "✓ Sélectionné" : "Choisir cette forme"}</i>
                </button>
              ))}
            </div>
            <div className="mk-studio-subsection">
              <div><h3>Comment le produit sera-t-il accessible ?</h3><p>Plusieurs modes compatibles peuvent être combinés.</p></div>
              <span className={studio.preferences.deliveryModesConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.deliveryModesConfirmed ? "Accès confirmé" : "À confirmer"}</span>
            </div>
            {blueprint.kind === "digital" ? (
              <div className="mk-studio-delivery-grid">
                {DELIVERY_OPTIONS.map((option) => (
                  <label key={option.value} className={studio.preferences.deliveryModes.includes(option.value) ? "is-selected" : ""}>
                    <input type="checkbox" checked={studio.preferences.deliveryModes.includes(option.value)} onChange={() => toggleDeliveryMode(option.value)} />
                    <span><strong>{option.title}</strong><small>{option.description}</small></span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mk-studio-info">Le projet est actuellement représenté comme une solution opérationnelle. Aucun accès numérique n'est imposé. Si tu souhaites aussi un espace numérique, sélectionne « Autre solution » puis précise-le dans les instructions.</p>
            )}
            <div className="mk-studio-panel-footer"><p>Les choix restent modifiables tant que la conception n'est pas figée.</p><button type="button" className="mk-studio-primary" onClick={() => setWorkspace("identity")}>Continuer vers l'identité <span>→</span></button></div>
          </section>
        )}

        {workspace === "identity" && (
          <section className="mk-studio-panel">
            <div className="mk-studio-panel-heading"><div><span className="mk-studio-kicker">02 · IDENTITÉ ET APPARENCE</span><h2>Donnons une personnalité visuelle au produit.</h2><p>Cette identité appartient au projet du client. Elle ne reprend pas automatiquement la marque MerKora.</p></div><span className={studio.preferences.paletteConfirmed && studio.preferences.styleConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.paletteConfirmed && studio.preferences.styleConfirmed ? "Identité choisie" : "Proposition à personnaliser"}</span></div>
            <div className="mk-studio-subsection"><div><h3>Palette de couleurs</h3><p>Choisis une ambiance, puis ajuste les couleurs si nécessaire.</p></div></div>
            <div className="mk-studio-palette-grid">
              {(Object.entries(PALETTES) as Array<[Exclude<PaletteId, "custom">, typeof PALETTES.violet]>).map(([key, palette]) => (
                <button type="button" key={key} className={studio.preferences.palette === key ? "is-selected" : ""} onClick={() => selectPalette(key)}>
                  <span><i style={{ background: palette.primary }} /><i style={{ background: palette.secondary }} /><i style={{ background: palette.accent }} /></span><strong>{palette.label}</strong>{studio.preferences.palette === key && <small>✓ Choisie</small>}
                </button>
              ))}
            </div>
            <div className="mk-studio-color-fields">
              <label>Couleur principale<input type="color" value={studio.preferences.primaryColor} onChange={(event) => revisePreferences({ palette: "custom", primaryColor: event.target.value, paletteConfirmed: true })} /></label>
              <label>Couleur secondaire<input type="color" value={studio.preferences.secondaryColor} onChange={(event) => revisePreferences({ palette: "custom", secondaryColor: event.target.value, paletteConfirmed: true })} /></label>
              <label>Couleur d'accent<input type="color" value={studio.preferences.accentColor} onChange={(event) => revisePreferences({ palette: "custom", accentColor: event.target.value, paletteConfirmed: true })} /></label>
            </div>
            <div className="mk-studio-subsection"><div><h3>Style de présentation</h3><p>Le style change le ton, la densité et la personnalité de l'interface.</p></div><span className={studio.preferences.styleConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.styleConfirmed ? "Confirmé" : "À choisir"}</span></div>
            <div className="mk-studio-style-grid">
              {STYLE_OPTIONS.map((option) => <button type="button" key={option.value} className={studio.preferences.style === option.value ? "is-selected" : ""} onClick={() => revisePreferences({ style: option.value, styleConfirmed: true })}><strong>{option.title}</strong><small>{option.description}</small></button>)}
            </div>
            <div className="mk-studio-subsection"><div><h3>Structure de navigation</h3><p>La structure sera adaptée aux écrans choisis et aux usages mobiles.</p></div><span className={studio.preferences.layoutConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.layoutConfirmed ? "Confirmée" : "À choisir"}</span></div>
            <div className="mk-studio-layout-options">
              <button type="button" className={studio.preferences.layout === "sidebar" ? "is-selected" : ""} onClick={() => revisePreferences({ layout: "sidebar", layoutConfirmed: true })}><span className="mk-layout-demo layout-side"><i /><b /><b /><b /></span><strong>Menu latéral</strong></button>
              <button type="button" className={studio.preferences.layout === "topbar" ? "is-selected" : ""} onClick={() => revisePreferences({ layout: "topbar", layoutConfirmed: true })}><span className="mk-layout-demo layout-top"><i /><b /><b /><b /></span><strong>Navigation supérieure</strong></button>
              <button type="button" className={studio.preferences.layout === "bottom" ? "is-selected" : ""} onClick={() => revisePreferences({ layout: "bottom", layoutConfirmed: true })}><span className="mk-layout-demo layout-bottom"><i /><b /><b /><b /></span><strong>Navigation inférieure</strong></button>
            </div>
            <div className="mk-studio-subsection"><div><h3>Appareils compatibles</h3><p>Choisis les supports sur lesquels la conception doit être vérifiée.</p></div><span className={studio.preferences.devicesConfirmed ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.preferences.devicesConfirmed ? "Supports choisis" : "À confirmer"}</span></div>
            <div className="mk-studio-device-options">
              {(["desktop", "tablet", "mobile"] as DeviceId[]).map((device) => <label key={device}><input type="checkbox" checked={studio.preferences.devices.includes(device)} onChange={() => toggleDevice(device)} /><span>{device === "desktop" ? "Ordinateur" : device === "tablet" ? "Tablette" : "Téléphone"}</span></label>)}
            </div>
            <div className="mk-studio-subsection"><div><h3>Composants d'interface souhaités</h3><p>Ces éléments sont des choix de présentation, pas des fonctions métier supplémentaires.</p></div></div>
            <div className="mk-studio-component-options">
              {COMPONENT_OPTIONS.map((component) => <label key={component.value}><input type="checkbox" checked={studio.preferences.components.includes(component.value)} onChange={() => toggleComponent(component.value)} /><span>{component.title}</span></label>)}
            </div>
            <div className="mk-studio-panel-footer"><p>Les choix visuels seront appliqués à l'aperçu du prototype.</p><button type="button" className="mk-studio-primary" onClick={() => setWorkspace("references")}>Continuer vers les références <span>→</span></button></div>
          </section>
        )}

        {workspace === "references" && (
          <section className="mk-studio-panel">
            <div className="mk-studio-panel-heading"><div><span className="mk-studio-kicker">03 · LOGO ET RÉFÉRENCES VISUELLES</span><h2>Ajoutons les éléments qui inspirent le résultat.</h2><p>Tu peux joindre un logo existant, une capture d'écran, une photo d'ambiance ou un croquis. Les fichiers restent dans cette session de conception.</p></div><span className="mk-studio-state">{studio.references.length} fichier(s)</span></div>
            <div className="mk-studio-upload-grid">
              <label className="mk-studio-upload-card"><span className="mk-upload-icon">◎</span><strong>Ajouter un logo</strong><small>PNG, JPG, WebP ou SVG · 1,2 Mo maximum</small><input type="file" accept="image/*" onChange={(event) => addAsset(event, "logo")} /><em>Choisir un fichier</em></label>
              <label className="mk-studio-upload-card"><span className="mk-upload-icon">▧</span><strong>Ajouter une référence</strong><small>Capture d'écran, croquis ou image d'inspiration</small><input type="file" accept="image/*" onChange={(event) => addAsset(event, "reference")} /><em>Choisir une image</em></label>
            </div>
            <div className="mk-studio-capability-note"><strong>Génération et analyse visuelles</strong><p>Les fichiers joints sont conservés et consultables. Le moteur de génération de logos et l'analyse automatique des images de référence ne sont pas encore connectés dans cette version : MerKora ne prétendra donc pas avoir généré ou analysé un visuel.</p></div>
            {studio.references.length > 0 ? (
              <div className="mk-studio-reference-list">
                {studio.references.map((reference) => (
                  <article key={reference.id} className="mk-studio-reference-card">
                    <div className="mk-studio-reference-image"><img src={reference.dataUrl} alt={reference.name} /></div>
                    <div className="mk-studio-reference-copy"><span>{reference.kind === "logo" ? "LOGO FOURNI" : "IMAGE DE RÉFÉRENCE"}</span><strong>{reference.name}</strong><label>Ce que tu souhaites conserver ou éviter<textarea value={reference.notes} onChange={(event) => updateReferenceNotes(reference.id, event.target.value)} rows={2} placeholder="Ex. : conserver la disposition, mais changer les couleurs…" /></label><button type="button" className="mk-studio-text-button" onClick={() => removeReference(reference.id)}>Retirer ce fichier</button></div>
                  </article>
                ))}
              </div>
            ) : <div className="mk-studio-empty">Aucune image ajoutée pour le moment. Tu peux continuer sans référence.</div>}
            <div className="mk-studio-subsection"><div><h3>Brief de logo ou d'identité</h3><p>Décris le symbole, le nom, l'ambiance et les contraintes de lisibilité à prendre en compte.</p></div></div>
            <textarea className="mk-studio-large-textarea" value={studio.preferences.customInstructions} onChange={(event) => revisePreferences({ customInstructions: event.target.value })} placeholder="Nom à afficher, activité, symboles souhaités, couleurs à éviter, versions claires et sombres…" rows={4} />
            <div className="mk-studio-panel-footer"><p>Les notes de référence seront conservées avec la version de conception.</p><button type="button" className="mk-studio-primary" onClick={() => setWorkspace("architecture")}>Continuer vers les écrans <span>→</span></button></div>
          </section>
        )}

        {workspace === "architecture" && (
          <section className="mk-studio-panel">
            <div className="mk-studio-panel-heading"><div><span className="mk-studio-kicker">04 · ARCHITECTURE DES ÉCRANS</span><h2>Voici les espaces réellement issus de la solution retenue.</h2><p>Chaque page regroupe des fonctions validées. Les suggestions et les éléments écartés restent à part et ne sont pas injectés dans le produit.</p></div><span className="mk-studio-state is-confirmed">{blueprint.screens.length} espace(s)</span></div>
            <div className="mk-studio-architecture-summary"><div><span>PROFILS IDENTIFIÉS</span><strong>{blueprint.profiles.length}</strong><small>Profils déclarés à l'écran 05</small></div><div><span>FONCTIONS RETENUES</span><strong>{acceptedFeatureCount}</strong><small>Acceptées ou modifiées à l'écran 06</small></div><div><span>SOURCES TRAÇABLES</span><strong>{blueprint.decisionRegister.length}</strong><small>Éléments du registre de conception</small></div></div>
            {blueprint.kind === "digital" ? (
              <div className="mk-studio-screen-list">
                {blueprint.screens.map((screen, index) => (
                  <article key={screen.id} className="mk-studio-screen-card">
                    <div className="mk-studio-screen-number">{String(index + 1).padStart(2, "0")}</div>
                    <div className="mk-studio-screen-copy"><span>ESPACE DU PRODUIT</span><h3>{screen.title}</h3><p>{screen.description}</p><small>{screenSummary(screen)}</small></div>
                    <div className="mk-studio-screen-features">{screen.features.map((feature) => <details key={feature.id}><summary>{feature.label}</summary><p>{feature.description}</p><small>Source : {feature.sourceLabel}</small><ul>{feature.fields.map((field) => <li key={field}>{field}</li>)}</ul></details>)}</div>
                  </article>
                ))}
                {blueprint.screens.every((screen) => screen.features.length === 0) && <div className="mk-studio-empty">Aucune fonction n'a encore été retenue. Retourne à l'écran 06 pour compléter la composition.</div>}
              </div>
            ) : (
              <div className="mk-studio-process-map"><span>PARCOURS OPÉRATIONNEL</span><h3>Organisation de l'activité</h3><div>{blueprint.flow.map((item, index) => <article key={index}><b>{String(index + 1).padStart(2, "0")}</b><strong>{item}</strong></article>)}</div></div>
            )}
            {blueprint.pendingItems.length > 0 && <details className="mk-studio-separated-items"><summary>Suggestions non retenues ({blueprint.pendingItems.length})</summary><ul>{blueprint.pendingItems.map((item) => <li key={item}>{item}</li>)}</ul><p>Elles ne font pas partie du prototype tant que tu ne les as pas acceptées à l'écran 06.</p></details>}
            <div className="mk-studio-panel-footer"><p>La structure est construite à partir de la composition validée. Les droits d'accès restent à définir séparément.</p><button type="button" className="mk-studio-primary" onClick={() => setWorkspace("prototype")}>Explorer le prototype <span>→</span></button></div>
          </section>
        )}

        {workspace === "prototype" && (
          <section className="mk-studio-panel mk-studio-prototype-workspace">
            <div className="mk-studio-panel-heading"><div><span className="mk-studio-kicker">05 · PROTOTYPE VISUEL ET FONCTIONNEL</span><h2>Explore le produit en situation.</h2><p>Ce prototype est une interface de conception navigable. Les interactions sont simulées et ne déclenchent aucune opération réelle.</p></div><span className="mk-studio-state is-confirmed">Mode démonstration</span></div>
            <div className="mk-studio-preview-toolbar">
              <div><span>APERÇU RESPONSIVE</span><strong>{blueprint.projectTitle}</strong></div>
              <div className="mk-studio-device-switch">{(["desktop", "tablet", "mobile"] as DeviceId[]).map((device) => <button type="button" key={device} className={previewDevice === device ? "is-active" : ""} onClick={() => setPreviewDevice(device)}>{device === "desktop" ? "Ordinateur" : device === "tablet" ? "Tablette" : "Mobile"}</button>)}</div>
            </div>
            <div className={"mk-studio-preview-frame device-" + previewDevice}>
              <div className={"mk-product-preview layout-" + studio.preferences.layout + " style-" + studio.preferences.style} style={previewStyle}>
                <header className="mk-product-topbar"><div className="mk-product-brand"><span>{studio.references.find((reference) => reference.kind === "logo") ? <img src={studio.references.find((reference) => reference.kind === "logo")?.dataUrl} alt="" /> : blueprint.projectTitle.slice(0, 1).toUpperCase()}</span><strong>{blueprint.projectTitle}</strong></div><div className="mk-product-top-actions"><span>APERÇU DU PRODUIT</span><span className="mk-product-user">{activeProfileData?.name.slice(0, 1).toUpperCase() ?? "U"}</span></div></header>
                <div className="mk-product-layout">
                  {studio.preferences.layout === "sidebar" && <nav className="mk-product-nav" aria-label="Navigation du produit"><button type="button" className={activeScreenId === "overview" ? "is-active" : ""} onClick={() => { setActiveScreenId("overview"); setActiveFeatureId(null); }}>Vue d'ensemble</button>{blueprint.screens.map((screen) => <button type="button" key={screen.id} className={activeScreenId === screen.id ? "is-active" : ""} onClick={() => { setActiveScreenId(screen.id); setActiveFeatureId(null); }}>{screen.navLabel}</button>)}</nav>}
                  <div className="mk-product-content">
                    <div className="mk-product-content-top"><div><span>ESPACE DE TRAVAIL</span><h3>{currentScreen?.title ?? "Vue d'ensemble"}</h3><p>{currentScreen?.description ?? blueprint.summary}</p></div><label>PROFIL D'APERÇU<select value={activeProfile} onChange={(event) => setActiveProfile(Number(event.target.value))}>{blueprint.profiles.map((profile, index) => <option key={profile.id} value={index}>{profile.name}</option>)}</select></label></div>
                    {studio.preferences.layout === "topbar" && <nav className="mk-product-topnav" aria-label="Navigation du produit"><button type="button" className={activeScreenId === "overview" ? "is-active" : ""} onClick={() => { setActiveScreenId("overview"); setActiveFeatureId(null); }}>Vue d'ensemble</button>{blueprint.screens.map((screen) => <button type="button" key={screen.id} className={activeScreenId === screen.id ? "is-active" : ""} onClick={() => { setActiveScreenId(screen.id); setActiveFeatureId(null); }}>{screen.navLabel}</button>)}</nav>}
                    {activeScreenId === "overview" ? (
                      <div className="mk-product-dashboard">
                        <div className="mk-product-metrics"><article><span>FONCTIONS RETENUES</span><strong>{acceptedFeatureCount}</strong><small>Dans la composition validée</small></article><article><span>PROFILS DÉCLARÉS</span><strong>{blueprint.profiles.length}</strong><small>Sans présumer des droits</small></article><article><span>POINTS OUVERTS</span><strong>{blueprint.unresolvedPoints.length}</strong><small>À confirmer avec le client</small></article></div>
                        <div className="mk-product-section-title"><div><span>ESPACES DU PRODUIT</span><h4>Accès rapides</h4></div><small>Structure proposée</small></div>
                        <div className="mk-product-screen-tiles">{blueprint.screens.map((screen) => <button type="button" key={screen.id} onClick={() => { setActiveScreenId(screen.id); setActiveFeatureId(null); }}><span>{String(screen.features.length).padStart(2, "0")}</span><strong>{screen.title}</strong><small>{screen.description}</small><i>Ouvrir l'espace ↗</i></button>)}</div>
                      </div>
                    ) : currentScreen ? (
                      <div className="mk-product-screen-body">
                        <div className="mk-product-section-title"><div><span>{currentScreen.navLabel.toLocaleUpperCase("fr")}</span><h4>Fonctions de cet espace</h4></div><small>{screenSummary(currentScreen)}</small></div>
                        <div className="mk-product-feature-grid">{currentScreen.features.map((feature) => <button type="button" key={feature.id} className={activeFeatureId === feature.id ? "is-selected" : ""} onClick={() => { setActiveFeatureId(feature.id); setSimulationMessage(""); }}><span className="mk-product-feature-symbol">↗</span><strong>{feature.label}</strong><small>{feature.description}</small><i>Examiner cette fonction</i></button>)}</div>
                        {selectedFeature && <section className="mk-product-action-panel"><div><span>INTERACTION DE DÉMONSTRATION</span><h4>{selectedFeature.label}</h4><p>{selectedFeature.description}</p></div><div className="mk-product-fields">{selectedFeature.fields.map((field) => <label key={field}>{field}<input placeholder="Exemple de saisie" /></label>)}</div><button type="button" onClick={simulateAction}>{selectedFeature.actionLabel} <span>→</span></button>{simulationMessage && <p className="mk-product-simulation" role="status">{simulationMessage}</p>}<details><summary>Pourquoi cette fonction est-elle présente ?</summary><p>{selectedFeature.sourceLabel}</p><small>Elle provient de la composition validée à l'écran 06. Les règles métier détaillées restent à préciser.</small></details></section>}
                      </div>
                    ) : <div className="mk-studio-empty">Aucun espace n'est encore défini.</div>}
                    {studio.preferences.layout === "bottom" && <nav className="mk-product-bottomnav" aria-label="Navigation du produit"><button type="button" className={activeScreenId === "overview" ? "is-active" : ""} onClick={() => { setActiveScreenId("overview"); setActiveFeatureId(null); }}>Accueil</button>{blueprint.screens.slice(0, 4).map((screen) => <button type="button" key={screen.id} className={activeScreenId === screen.id ? "is-active" : ""} onClick={() => { setActiveScreenId(screen.id); setActiveFeatureId(null); }}>{screen.navLabel}</button>)}</nav>}
                  </div>
                </div>
              </div>
            </div>
            <div className="mk-studio-profile-note"><strong>Perspective du profil : {activeProfileData?.name}</strong><span>{activeProfileData?.note} Le changement de profil sert à examiner la présentation ; il ne crée pas automatiquement des autorisations.</span></div>
            <div className="mk-studio-prototype-note">Représentation visuelle et prototype fonctionnel de démonstration : les champs sont illustratifs, aucune donnée réelle n'est enregistrée et aucune notification n'est envoyée.</div>
            <div className="mk-studio-panel-footer"><p>Tu peux revenir aux choix d'identité ou demander une retouche avant validation.</p><button type="button" className="mk-studio-primary" onClick={() => setWorkspace("validation")}>Vérifier les sources et valider <span>→</span></button></div>
          </section>
        )}

        {workspace === "validation" && (
          <section className="mk-studio-panel">
            <div className="mk-studio-panel-heading"><div><span className="mk-studio-kicker">06 · REGISTRE DES DÉCISIONS ET VERROUILLAGE</span><h2>Pourquoi chaque élément est-il présent ?</h2><p>Le registre relie les écrans, fonctions, actions et champs aux réponses et décisions qui les ont produits.</p></div><span className={studio.validatedVersion ? "mk-studio-state is-confirmed" : "mk-studio-state"}>{studio.validatedVersion ? "Version " + studio.validatedVersion + " validée" : "En préparation"}</span></div>
            <div className="mk-studio-validation-summary"><div><span>VERSION SOURCE</span><strong>{blueprint.sourceVersion}</strong></div><div><span>RÉVISION DE CONCEPTION</span><strong>{studio.revision}</strong></div><div><span>VERSIONS OFFICIELLES</span><strong>{studio.versions.length}</strong></div><div><span>DÉCISIONS TRAÇABLES</span><strong>{blueprint.decisionRegister.length}</strong></div></div>
            <div className="mk-studio-register">
              {blueprint.decisionRegister.map((entry) => <details key={entry.id}><summary><span className={"mk-register-type type-" + entry.elementType}>{entry.elementType === "dashboard" ? "Vue" : entry.elementType === "screen" ? "Écran" : entry.elementType === "feature" ? "Fonction" : entry.elementType === "action" ? "Action" : "Champ"}</span><strong>{entry.elementLabel}</strong></summary><div><p>{entry.rationale}</p><small><b>Origine :</b> {entry.sourceLabel}</small><small><b>Références :</b> {entry.sourceIds.join(", ")}</small></div></details>)}
            </div>
            {blueprint.unresolvedPoints.length > 0 && <details className="mk-studio-separated-items"><summary>Points encore à préciser ({blueprint.unresolvedPoints.length})</summary><ul>{blueprint.unresolvedPoints.map((point) => <li key={point}>{point}</li>)}</ul></details>}
            <div className="mk-studio-subsection"><div><h3>Demandes de modification</h3><p>Chaque retouche reste associée à la conception. Une modification après validation créera une nouvelle version.</p></div></div>
            <textarea className="mk-studio-large-textarea" value={feedbackDraft} onChange={(event) => setFeedbackDraft(event.target.value)} placeholder="Ex. : Je souhaite déplacer le suivi des paiements sur le tableau de bord…" rows={3} />
            <button type="button" className="mk-studio-secondary" onClick={addChangeRequest} disabled={!feedbackDraft.trim()}>Ajouter cette demande</button>
            {studio.changeRequests.length > 0 && <div className="mk-studio-change-list">{studio.changeRequests.map((request, index) => <p key={index}><span>{String(index + 1).padStart(2, "0")}</span>{request}</p>)}</div>}
            <div className="mk-studio-lock-note"><strong>Avant de figer la conception</strong><p>Confirme la nature du produit, son mode d'accès si nécessaire, sa palette, son style, sa navigation et les appareils pris en charge. La validation crée un instantané officiel de cette session avec le cahier des charges source, les écrans, les préférences et le registre des décisions.</p></div>
            <button type="button" className="mk-studio-primary mk-studio-validate-button" onClick={validateDesign} disabled={!canValidate}>Valider et figer la version {((studio.versions[studio.versions.length - 1]?.version ?? 0) + 1)} <span>→</span></button>
            {studio.validatedVersion && <div className="mk-studio-validated-banner" role="status"><span>✓</span><div><strong>Version {studio.validatedVersion} validée par {studio.versions[studio.versions.length - 1]?.approvedBy}</strong><p>Validée le {new Date(studio.versions[studio.versions.length - 1]?.approvedAt ?? "").toLocaleString("fr-FR")}. Toute modification ultérieure ouvrira une nouvelle révision sans effacer cette version.</p></div></div>}
            {studio.versions.length > 0 && <div className="mk-studio-version-history"><h3>Historique des versions officielles</h3>{studio.versions.map((version) => <article key={version.version}><strong>Version {version.version}</strong><span>{new Date(version.approvedAt).toLocaleString("fr-FR")} · {version.approvedBy}</span><small>{version.screenIds.length} espace(s) · {version.decisionRegister.length} décisions · source écran 06 v{version.sourceProposalVersion}</small></article>)}</div>}
            <p className="mk-studio-storage-note">Conservation actuelle : session de ce navigateur et de cet onglet. La synchronisation multi-appareils et l'archivage serveur ne sont pas activés.</p>
          </section>
        )}
      </section>
      <footer className="mk-studio-footer"><span>MERKORA GDJ · ATELIER DE CONCEPTION</span><span>Les décisions importantes restent sous ton contrôle.</span></footer>
    </main>
  );
}
