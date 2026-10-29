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
type LocalReviewStatus = "draft" | "changes_requested" | "approved";
type ClientQuoteResponse = "undecided" | "accepted" | "changes_requested" | "negotiate";
type StoredMockupConfig = Partial<MockupConfig> & { reviewStatus?: LocalReviewStatus; reviewNote?: string; quoteAmount?: string; quoteDays?: string; quotePaymentTerms?: string; clientQuoteResponse?: ClientQuoteResponse; clientQuoteNote?: string };
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
  const [reviewStatus, setReviewStatus] = useState<LocalReviewStatus>("draft");
  const [reviewNote, setReviewNote] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDays, setQuoteDays] = useState("");
  const [quotePaymentTerms, setQuotePaymentTerms] = useState("À convenir après échange avec le client");
  const [clientQuoteResponse, setClientQuoteResponse] = useState<ClientQuoteResponse>("undecided");
  const [clientQuoteNote, setClientQuoteNote] = useState("");
  const model = useMemo(() => buildMockupModel(project, config), [project, config]);
  const storageKey = `${STORAGE_PREFIX}${project.id}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredMockupConfig;
        const formats: MockupFormat[] = ["website", "mobile", "dashboard"];
        const palettes: MockupPalette[] = ["violet", "blue", "emerald", "amber"];
        setReviewStatus(parsed.reviewStatus === "approved" || parsed.reviewStatus === "changes_requested" ? parsed.reviewStatus : "draft");
        setReviewNote(typeof parsed.reviewNote === "string" ? parsed.reviewNote.slice(0, 1200) : "");
        setQuoteAmount(typeof parsed.quoteAmount === "string" ? parsed.quoteAmount : "");
        setQuoteDays(typeof parsed.quoteDays === "string" ? parsed.quoteDays : "");
        setQuotePaymentTerms(typeof parsed.quotePaymentTerms === "string" ? parsed.quotePaymentTerms.slice(0, 500) : "À convenir après échange avec le client");
        setClientQuoteResponse(parsed.clientQuoteResponse === "accepted" || parsed.clientQuoteResponse === "changes_requested" || parsed.clientQuoteResponse === "negotiate" ? parsed.clientQuoteResponse : "undecided");
        setClientQuoteNote(typeof parsed.clientQuoteNote === "string" ? parsed.clientQuoteNote.slice(0, 1200) : "");
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
      window.localStorage.setItem(storageKey, JSON.stringify({ ...config, reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote }));
    } catch {
      // The preview still works for this session if storage is unavailable.
    }
  }, [config, reviewStatus, reviewNote, quoteAmount, quoteDays, quotePaymentTerms, clientQuoteResponse, clientQuoteNote, ready, storageKey]);

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

  function downloadQuoteDraft() {
    const amount = quoteAmount.trim();
    const days = quoteDays.trim();
    const lines = [
      "MERKORA GDJ — PROJET DE DEVIS (BROUILLON NON CONTRACTUEL)",
      "",
      `Projet : ${model.title}`,
      `Catégorie : ${model.domainLabel}`,
      `Concept : ${reviewStatus === "approved" ? "validé localement" : "non validé"}`,
      `Format envisagé : ${model.formatLabel}`,
      "",
      "PÉRIMÈTRE ENVISAGÉ",
      ...model.visibleModules.map((item) => `- Fonction / bloc : ${item.title} — ${item.description}`),
      ...model.visibleRecommendations.map((item) => `- Piste retenue : ${item.title} — ${item.description}`),
      "",
      "BESOINS ET CONTEXTE",
      `Problème initial : ${project.problem}`,
      `Résultat souhaité : ${project.desiredOutcome}`,
      `Budget indiqué : ${project.budget}`,
      "",
      "PROPOSITION COMMERCIALE À COMPLÉTER",
      `Montant indicatif : ${amount ? `${amount} FCFA` : "À chiffrer après estimation du travail"}`,
      `Délai estimé : ${days ? `${days} jour(s)` : "À confirmer"}`,
      `Conditions de paiement : ${quotePaymentTerms.trim() || "À convenir"}`,
      "",
      "ÉTAT : brouillon préparatoire uniquement. Ce document n'est ni un devis officiel, ni une offre contractuelle, ni une acceptation client. Le prix et le délai doivent être vérifiés par MerKora avant transmission.",
      "Données et préférences conservées localement dans ce navigateur ; aucun envoi automatique n'a lieu.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merkora-brouillon-devis-${model.title.toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projet"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadClientResponse() {
    const responseLabels: Record<ClientQuoteResponse, string> = {
      undecided: "Aucune décision sélectionnée",
      accepted: "Le client indique accepter la proposition",
      changes_requested: "Le client demande des modifications",
      negotiate: "Le client souhaite discuter du prix ou des conditions",
    };
    const lines = [
      "MERKORA GDJ — RETOUR CLIENT SUR UN BROUILLON DE DEVIS",
      "",
      "Projet : " + model.title,
      "Référence locale : " + project.id,
      "Montant présenté : " + (quoteAmount.trim() ? quoteAmount.trim() + " FCFA" : "Non renseigné"),
      "Délai présenté : " + (quoteDays.trim() ? quoteDays.trim() + " jour(s)" : "Non renseigné"),
      "Décision choisie : " + responseLabels[clientQuoteResponse],
      "",
      "Commentaire du client :",
      clientQuoteNote.trim() || "Aucun commentaire ajouté.",
      "",
      "IMPORTANT : retour préparatoire exporté localement. Ce fichier n'a pas été envoyé à MerKora et ne vaut pas acceptation contractuelle ni preuve de transmission. L'administrateur doit vérifier et enregistrer la réponse par un canal convenu.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merkora-retour-client-" + (model.title.toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projet") + ".txt";
    link.click();
    URL.revokeObjectURL(url);
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
      `État local du concept : ${reviewStatus === "approved" ? "Concept validé localement" : reviewStatus === "changes_requested" ? "Modifications demandées" : "À examiner"}`,
      ...(reviewNote.trim() ? [`Note de retour : ${reviewNote.trim()}`] : []),
      "Attention : cet état et cette note sont enregistrés uniquement dans ce navigateur; ils ne sont pas transmis à MerKora ni au cloud.",
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

          <section className="mockup-review-panel" aria-labelledby="mockup-review-title">
            <div className="mockup-review-heading">
              <div>
                <span className="mockup-control-title">Étape 03 · Retour sur le concept</span>
                <h4 id="mockup-review-title">Le concept correspond-il au besoin ?</h4>
              </div>
              <span className={`mockup-review-status status-${reviewStatus}`}>{reviewStatus === "approved" ? "Validé localement" : reviewStatus === "changes_requested" ? "Modifications demandées" : "À examiner"}</span>
            </div>
            <label className="mockup-review-note-label" htmlFor={`mockup-review-note-${project.id}`}>Commentaires ou changements souhaités</label>
            <textarea id={`mockup-review-note-${project.id}`} className="mockup-review-note" maxLength={1200} value={reviewNote} onChange={(event) => { setReviewNote(event.target.value); if (reviewStatus === "approved") setReviewStatus("draft"); }} placeholder="Ex. : ajouter un espace pour les employés, retirer la partie stock, changer la couleur…"/>
            <div className="mockup-review-actions">
              <button type="button" className="button button-quiet" onClick={() => setReviewStatus("draft")}>À examiner</button>
              <button type="button" className="button button-quiet" onClick={() => setReviewStatus("changes_requested")}>Demander des modifications</button>
              <button type="button" className="button button-primary" onClick={() => setReviewStatus("approved")}>Valider ce concept</button>
            </div>
            <p className="mockup-local-note">Prototype uniquement : le statut et les commentaires sont enregistrés dans ce navigateur. Rien n’est envoyé à l’administrateur, au client connecté ou au cloud. La validation officielle nécessitera ensuite un parcours sécurisé côté serveur.</p>
          </section>
          {reviewStatus === "approved" && (
            <section className="mockup-quote-panel" aria-labelledby="mockup-quote-title">
              <div className="mockup-review-heading">
                <div>
                  <span className="mockup-control-title">Étape 04 · Préparer la proposition</span>
                  <h4 id="mockup-quote-title">Préparer un brouillon de devis</h4>
                </div>
                <span className="mockup-review-status status-draft">Brouillon</span>
              </div>
              <p className="mockup-local-note">Le concept étant marqué comme validé dans ce navigateur, tu peux préparer une première proposition. Aucun prix n'est inventé : laisse le montant vide tant que le travail n'a pas été estimé. Le brouillon n'est pas envoyé au client.</p>
              <label className="mockup-review-note-label" htmlFor={`mockup-quote-amount-${project.id}`}>Montant proposé (FCFA, facultatif)</label>
              <input id={`mockup-quote-amount-${project.id}`} className="mockup-quote-input" type="number" min="0" step="500" value={quoteAmount} onChange={(event) => setQuoteAmount(event.target.value)} placeholder="À chiffrer après estimation" />
              <label className="mockup-review-note-label" htmlFor={`mockup-quote-days-${project.id}`}>Délai estimé en jours (facultatif)</label>
              <input id={`mockup-quote-days-${project.id}`} className="mockup-quote-input" type="number" min="1" step="1" value={quoteDays} onChange={(event) => setQuoteDays(event.target.value)} placeholder="À confirmer" />
              <label className="mockup-review-note-label" htmlFor={`mockup-quote-terms-${project.id}`}>Conditions ou étapes de paiement</label>
              <textarea id={`mockup-quote-terms-${project.id}`} className="mockup-review-note" maxLength={500} value={quotePaymentTerms} onChange={(event) => setQuotePaymentTerms(event.target.value)} rows={2} />
              <button type="button" className="button button-primary" onClick={downloadQuoteDraft}>Exporter le brouillon de devis (.txt) ↗</button>
              <p className="mockup-local-note">L'export crée un fichier texte sur ton appareil. Il ne crée pas de devis officiel, ne facture personne et ne synchronise aucune donnée.</p>
              <div className="mockup-client-response" aria-labelledby="mockup-client-response-title">
                <div className="mockup-review-heading">
                  <div><span className="mockup-control-title">Étape 05 · Réponse à la proposition</span><h4 id="mockup-client-response-title">Que répondrait le client ?</h4></div>
                  <span className={"mockup-review-status " + (clientQuoteResponse === "accepted" ? "status-approved" : clientQuoteResponse === "undecided" ? "status-draft" : "status-changes_requested")}>{clientQuoteResponse === "accepted" ? "Acceptation choisie" : clientQuoteResponse === "changes_requested" ? "Modifications demandées" : clientQuoteResponse === "negotiate" ? "Discussion demandée" : "En attente"}</span>
                </div>
                <p className="mockup-local-note">Cette section prépare le parcours de réponse. Elle n'envoie pas de message : le client peut choisir une réponse, ajouter ses conditions, puis exporter son retour pour le transmettre manuellement.</p>
                <div className="mockup-quote-response-options">
                  <label><input type="radio" name={"quote-response-" + project.id} checked={clientQuoteResponse === "accepted"} onChange={() => setClientQuoteResponse("accepted")} /><span><strong>Accepter</strong><small>Le client indique être d'accord avec la proposition affichée.</small></span></label>
                  <label><input type="radio" name={"quote-response-" + project.id} checked={clientQuoteResponse === "changes_requested"} onChange={() => setClientQuoteResponse("changes_requested")} /><span><strong>Demander des modifications</strong><small>Le périmètre, le délai ou les conditions doivent être revus.</small></span></label>
                  <label><input type="radio" name={"quote-response-" + project.id} checked={clientQuoteResponse === "negotiate"} onChange={() => setClientQuoteResponse("negotiate")} /><span><strong>Discuter du prix ou des conditions</strong><small>Le client souhaite échanger avant de décider.</small></span></label>
                </div>
                <label className="mockup-review-note-label" htmlFor={"mockup-client-response-note-" + project.id}>Message ou conditions proposés par le client</label>
                <textarea id={"mockup-client-response-note-" + project.id} className="mockup-review-note" maxLength={1200} rows={3} value={clientQuoteNote} onChange={(event) => setClientQuoteNote(event.target.value)} placeholder="Ex. : je souhaite réduire le périmètre, préciser la livraison ou discuter d'un paiement en deux étapes…" />
                <button type="button" className="button button-primary" onClick={downloadClientResponse} disabled={clientQuoteResponse === "undecided"}>Exporter le retour client (.txt) ↗</button>
              </div>
            </section>
          )}
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
