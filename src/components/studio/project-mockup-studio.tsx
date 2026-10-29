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

  const model = useMemo(() => buildMockupModel(project, config), [project, config]);
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

  async function copySummary() {
    const summary = [
      `Projet : ${model.title}`,
      `Format : ${model.formatLabel}`,
      `Direction : ${model.domainLabel}`,
      `Palette : ${paletteOptions.find((item) => item.value === model.palette)?.label ?? model.palette}`,
      "Blocs retenus :",
      ...model.visibleModules.map((item) => `- ${item.title} : ${item.description}`),
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
                  <div className="mockup-demo-footer">Contenu de démonstration · à confirmer avec le client</div>
                </div>
              </div>
            </div>
          )}
          <div className="mockup-preview-disclaimer"><span>ⓘ</span>{model.conceptNotice}</div>
        </div>
      </div>
    </section>
  );
}
