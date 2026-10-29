"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/project-types";
import {
  buildMockupModel,
  type MockupConfig,
  type MockupFormat,
  type MockupPalette,
} from "@/lib/mockup-studio";

type Props = { project: Project };
const STORAGE_PREFIX = "merkora-gdj-mockup-v1:";
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

export function ProjectMockupStudio({ project }: Props) {
  const [config, setConfig] = useState<MockupConfig>({ format: "website", palette: "violet", enabledModules: [] });
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{ src: string; signature: string; model: string; persisted: boolean } | null>(null);

  const model = useMemo(() => buildMockupModel(project, config), [project, config]);
  const imageSignature = useMemo(() => JSON.stringify({
    title: project.title,
    category: project.category,
    problem: project.problem,
    desiredOutcome: project.desiredOutcome,
    budget: project.budget,
    urgency: project.urgency,
    recommendations: project.recommendations,
    config,
  }), [project, config]);
  const imageIsCurrent = generatedImage?.signature === imageSignature;
  const storageKey = `${STORAGE_PREFIX}${project.id}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MockupConfig>;
        const formats: MockupFormat[] = ["website", "mobile", "dashboard"];
        const palettes: MockupPalette[] = ["violet", "blue", "emerald", "amber"];
        setConfig({
          format: formats.includes(parsed.format as MockupFormat) ? parsed.format as MockupFormat : "website",
          palette: palettes.includes(parsed.palette as MockupPalette) ? parsed.palette as MockupPalette : "violet",
          enabledModules: Array.isArray(parsed.enabledModules) ? parsed.enabledModules.filter((id): id is string => typeof id === "string") : [],
          ...(Array.isArray(parsed.selectedRecommendationIds)
            ? { selectedRecommendationIds: parsed.selectedRecommendationIds.filter((id): id is string => typeof id === "string") }
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
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(config));
    } catch {
      // The preview still works for this session if storage is unavailable.
    }
  }, [config, ready, storageKey]);

  function toggleModule(id: string) {
    setConfig((current) => {
      const selected = current.enabledModules.length > 0
        ? current.enabledModules
        : model.modules.map((item) => item.id);
      if (selected.includes(id) && selected.length === 1) return current;
      const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
      return { ...current, enabledModules: next };
    });
  }

  function toggleRecommendation(id: string) {
    setConfig((current) => {
      const selected = current.selectedRecommendationIds ?? model.recommendations.map((item) => item.id);
      return {
        ...current,
        selectedRecommendationIds: selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id],
      };
    });
  }

  async function generateConceptImage() {
    setImageLoading(true);
    setImageError(null);
    try {
      const response = await fetch("/api/studio/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: {
            title: project.title,
            category: project.category,
            problem: project.problem,
            desiredOutcome: project.desiredOutcome,
            budget: project.budget,
            urgency: project.urgency,
            recommendations: project.recommendations,
          },
          config: {
            ...config,
            selectedRecommendationIds: config.selectedRecommendationIds ?? model.recommendations.map((item) => item.id),
          },
        }),
      });
      const payload = await response.json() as {
        imageDataUrl?: unknown;
        imageUrl?: unknown;
        model?: unknown;
        persisted?: unknown;
        error?: unknown;
      };
      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "La génération de l’image a échoué.");
      }
      const src = typeof payload.imageDataUrl === "string"
        ? payload.imageDataUrl
        : typeof payload.imageUrl === "string" ? payload.imageUrl : null;
      if (!src) throw new Error("Le fournisseur n’a pas renvoyé d’image exploitable.");
      setGeneratedImage({
        src,
        signature: imageSignature,
        model: typeof payload.model === "string" ? payload.model : "Modèle image configuré",
        persisted: payload.persisted === true,
      });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Le service image est momentanément indisponible.");
    } finally {
      setImageLoading(false);
    }
  }

  async function copySummary() {
    const summary = [
      `Projet : ${model.title}`,
      `Format : ${model.formatLabel}`,
      `Direction : ${model.domainLabel}`,
      `Palette : ${paletteOptions.find((item) => item.value === model.palette)?.label ?? model.palette}`,
      "Blocs retenus :",
      ...model.visibleModules.map((item) => `- Bloc : ${item.title} : ${item.description}`),
      "Pistes de solution retenues :",
      ...model.visibleRecommendations.map((item) => `- ${item.title} : ${item.description} (raison : ${item.reason})`),
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
      </div>

      <div className="mockup-studio-layout">
        <aside className="mockup-controls" aria-label="Personnaliser la maquette">
          <div className="mockup-control-group">
            <span className="mockup-control-title">Format de présentation</span>
            <div className="mockup-format-options">
              {formatOptions.map((option) => (
                <button key={option.value} type="button" className={config.format === option.value ? "mockup-choice is-selected" : "mockup-choice"} aria-pressed={config.format === option.value} onClick={() => setConfig((current) => ({ ...current, format: option.value }))}>
                  <span>{option.icon}</span>{option.label}
                </button>
              ))}
            </div>
          </div>

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

          <div className="mockup-control-group">
            <span className="mockup-control-title">Blocs de la maquette</span>
            <p className="mockup-control-hint">Coche les éléments que le client souhaite voir dans le concept.</p>
            {model.modules.map((item) => {
              const selected = model.visibleModules.some((visible) => visible.id === item.id);
              return (
                <label className="mockup-module-toggle" key={item.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleModule(item.id)} />
                  <span><strong>{item.title}</strong><small>{item.description}</small></span>
                </label>
              );
            })}
          </div>

          <div className="mockup-control-group">
            <span className="mockup-control-title">Pistes de solution proposées</span>
            <p className="mockup-control-hint">Sélectionne les pistes que le client veut réellement voir dans son concept. Les pistes décochées ne seront pas présentées comme retenues.</p>
            {model.recommendations.map((item) => {
              const selected = model.visibleRecommendations.some((visible) => visible.id === item.id);
              return (
                <label className="mockup-module-toggle" key={item.id}>
                  <input type="checkbox" checked={selected} onChange={() => toggleRecommendation(item.id)} />
                  <span><strong>{item.title}</strong><small>{item.description}</small><small>Pourquoi : {item.reason}</small></span>
                </label>
              );
            })}
            {model.recommendations.length === 0 && <p className="mockup-control-hint">Aucune piste n’est disponible. Les pistes apparaîtront ici après l’analyse du besoin.</p>}
          </div>

          <button type="button" className="button button-quiet mockup-copy-button" onClick={() => void copySummary()}>{copied ? "Résumé copié ✓" : "Copier le résumé du concept ↗"}</button>
          <p className="mockup-local-note">Les préférences de présentation sont enregistrées dans ce navigateur uniquement. Elles ne sont pas encore synchronisées dans le cloud.</p>
        </aside>

        <div className={`mockup-preview-wrap palette-${model.palette} format-${model.format}`}>
          <div className="mockup-preview-toolbar"><span><i /> Aperçu généré par MerKora</span><span>{model.formatLabel}</span></div>
          {model.format === "mobile" ? (
            <div className="mockup-phone">
              <div className="mockup-phone-top"><span /> <span>•••</span></div>
              <div className="mockup-preview-brand"><span className="mockup-brand-mark">M</span><strong>{model.title}</strong><button type="button" aria-label="Menu conceptuel">☰</button></div>
              <div className="mockup-hero mockup-hero-mobile"><span className="mockup-kicker">{model.domainLabel}</span><h4>{model.headline}</h4><p>{model.supportingCopy}</p><button type="button" className="mockup-preview-cta">Découvrir les pistes <span>→</span></button></div>
              <div className="mockup-module-stack">{model.visibleModules.map((item, index) => <article className="mockup-content-card" key={item.id}><span className="mockup-card-index">0{index + 1}</span><div><h5>{item.title}</h5><p>{item.description}</p></div><span className="mockup-card-arrow">↗</span></article>)}</div>
              {model.visibleRecommendations.length > 0 && <section className="mockup-solution-tracks" aria-label="Pistes de solution retenues"><h5>Pistes retenues</h5>{model.visibleRecommendations.map((item) => <article className="mockup-content-card" key={item.id}><div><h5>{item.title}</h5><p>{item.description}</p><small>Pourquoi : {item.reason}</small></div></article>)}</section>}
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
                  {model.visibleRecommendations.length > 0 && <section className="mockup-solution-tracks" aria-label="Pistes de solution retenues"><div className="mockup-preview-section-title"><div><span>PISTES CHOISIES</span><h5>Les solutions à explorer</h5></div><span className="mockup-section-counter">{model.visibleRecommendations.length} piste(s)</span></div>{model.visibleRecommendations.map((item) => <article className="mockup-content-card" key={item.id}><h5>{item.title}</h5><p>{item.description}</p><small>Pourquoi : {item.reason}</small></article>)}</section>}
                  <div className="mockup-demo-footer">Contenu de démonstration · à confirmer avec le client</div>
                </div>
              </div>
            </div>
          )}
          <div className="mockup-preview-disclaimer"><span>ⓘ</span>{model.conceptNotice}</div>
          <section className="mockup-image-studio" aria-labelledby="mockup-image-title">
            <div className="mockup-image-studio-heading">
              <div>
                <span className="mockup-kicker">ILLUSTRATION IA</span>
                <h4 id="mockup-image-title">Visualiser votre idée</h4>
                <p>L’image sera créée à partir du dossier et des choix affichés dans cette maquette. La génération peut être facturable si elle est activée par l’administrateur.</p>
              </div>
              <button type="button" className="button button-primary" onClick={() => void generateConceptImage()} disabled={imageLoading}>
                {imageLoading ? "Génération en cours…" : imageIsCurrent ? "Régénérer l’image" : generatedImage ? "Actualiser l’image" : "Générer l’illustration IA"}
              </button>
            </div>
            {generatedImage && !imageIsCurrent && <p className="mockup-image-stale" role="status">Les choix du concept ont changé. Cette image correspond à une version précédente ; génère-en une nouvelle pour la synchroniser.</p>}
            {imageError && <p className="mockup-image-error" role="alert">{imageError}</p>}
            {generatedImage && <figure className="mockup-generated-image">
              <img src={generatedImage.src} alt={`Illustration conceptuelle du projet ${model.title}`} />
              <figcaption>{imageIsCurrent ? "Illustration correspondant aux choix actuels" : "Illustration d’une version antérieure"} · {generatedImage.model} · {generatedImage.persisted ? "Sauvegardée" : "Non sauvegardée dans le cloud"}</figcaption>
            </figure>}
            <p className="mockup-local-note">L’illustration est un concept visuel, pas une application fonctionnelle. Dans cette première version, elle n’est pas encore sauvegardée dans le cloud et peut disparaître au rechargement.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
