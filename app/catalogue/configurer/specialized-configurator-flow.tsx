"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getVisibleConfiguratorSteps,
  validateSpecializedConfiguratorAnswers,
  type ConfiguratorAnswer,
  type SpecializedConfigurator,
  type SpecializedConfiguratorStep,
} from "../../../src/lib/merkora-core/specialized-configurators";

const optionLabels: Record<string, string> = {
  physical_products: "Produits physiques", digital_products: "Produits numériques", services: "Prestations de services",
  made_to_order: "Fabrication ou préparation sur commande", retail: "Vente au détail", wholesale: "Vente en gros",
  categories: "Catégories", photos: "Photos des articles", descriptions: "Descriptions détaillées", variants: "Variantes (taille, couleur, format)",
  multiple_prices: "Plusieurs tarifs", promotions: "Promotions et réductions", digital_downloads: "Téléchargement numérique",
  no_stock_tracking: "Pas de suivi de stock", manual_stock: "Stock mis à jour manuellement", automatic_stock: "Stock déduit automatiquement",
  multiple_locations: "Plusieurs dépôts ou points de stockage",
  cash_on_delivery: "Paiement à la livraison", mobile_money: "Mobile Money", bank_card: "Carte bancaire",
  bank_transfer: "Virement bancaire", pay_on_pickup: "Paiement au retrait", manual_confirmation: "Confirmation manuelle du paiement",
  home_delivery: "Livraison à domicile", pickup_point: "Point relais", store_pickup: "Retrait sur place",
  third_party_carrier: "Transporteur externe", digital_delivery: "Livraison numérique", delivery_zones: "Zones et frais de livraison",
  returns: "Retours", exchanges: "Échanges", refunds: "Remboursements", warranty: "Garanties", complaints: "Réclamations",
  customer_support: "Assistance client",
  appointment: "Rendez-vous", room: "Salle ou espace", vehicle: "Véhicule", accommodation: "Chambre ou hébergement",
  event_seat: "Place à un événement", service: "Prestation", equipment: "Équipement",
  fixed_hours: "Horaires fixes", variable_hours: "Horaires variables", staff_calendar: "Calendrier du personnel",
  resource_calendar: "Calendrier des ressources", date_ranges: "Périodes et plages de dates", external_calendar: "Agenda externe",
  one_per_slot: "Une réservation par créneau", limited_capacity: "Capacité limitée", unlimited_capacity: "Capacité non limitée",
  multiple_resources: "Plusieurs ressources en parallèle", automatic_confirmation: "Confirmation automatique",
  manual_approval: "Validation par un responsable", deposit_required: "Acompte obligatoire", free_booking: "Réservation gratuite",
  cancellation_window: "Délai limite d'annulation", reschedule: "Modification de réservation", waiting_list: "Liste d'attente",
  email_confirmation: "Confirmation par e-mail", sms_confirmation: "Confirmation par SMS",
  whatsapp_confirmation: "Confirmation WhatsApp", reminders: "Rappels automatiques", qr_check_in: "Accueil par QR code",
  attendance_register: "Registre des présences",
  single_site: "Un seul site", multiple_sites: "Plusieurs sites", departments: "Services ou départements",
  branches: "Agences ou succursales", field_teams: "Équipes sur le terrain", partners: "Partenaires",
  owner_admin: "Administrateur propriétaire", manager: "Responsable / manager", supervisor: "Superviseur",
  employee: "Employé", accountant: "Comptable", sales_agent: "Agent commercial", external_partner: "Partenaire externe",
  custom_roles: "Rôles personnalisés", tasks: "Tâches et activités", sales: "Ventes", purchases: "Achats", stock: "Stocks",
  staff_attendance: "Présence du personnel", customer_requests: "Demandes clients", approvals: "Validations",
  field_operations: "Opérations sur le terrain", income_expenses: "Recettes et dépenses", cash_register: "Gestion de caisse",
  invoices_receipts: "Factures et reçus", budgets: "Budgets", expense_approval: "Approbation des dépenses",
  payment_tracking: "Suivi des paiements", financial_reports: "Rapports financiers", daily_dashboard: "Tableau de bord quotidien",
  weekly_reports: "Rapports hebdomadaires", monthly_reports: "Rapports mensuels", performance_indicators: "Indicateurs de performance",
  alerts: "Alertes", excel_export: "Export Excel", audit_history: "Historique et traçabilité",
  school_management: "Gestion d'un établissement scolaire", career_orientation: "Orientation scolaire et professionnelle",
  training: "Formation", online_learning: "Apprentissage en ligne", assessment_platform: "Plateforme de tests et évaluations",
  educational_content: "Diffusion de contenus éducatifs", children: "Enfants", students: "Élèves et étudiants",
  job_seekers: "Personnes en recherche d'orientation ou d'emploi", employees: "Salariés", trainers: "Formateurs",
  parents: "Parents", career_counsellors: "Conseillers d'orientation", general_public: "Grand public",
  courses: "Cours", lessons: "Leçons", videos: "Vidéos", documents: "Documents", exercises: "Exercices",
  guided_pathways: "Parcours guidés", career_discovery: "Découverte des métiers",
  multiple_choice: "Questions à choix multiples", open_questions: "Questions ouvertes", quizzes: "Quiz",
  riddles: "Devinettes et énigmes", skills_tests: "Tests d'aptitudes", interest_tests: "Tests d'intérêts",
  practical_tasks: "Mises en situation pratiques", human_review: "Interprétation ou validation humaine",
  scores: "Scores détaillés", progress_tracking: "Suivi de progression", recommendations: "Recommandations expliquées",
  career_suggestions: "Suggestions de métiers et parcours", certificates: "Attestations ou certificats",
  feedback: "Retours personnalisés", advisor_follow_up: "Accompagnement par un conseiller",
  paper_documents: "Documents papier", pdf_files: "Fichiers PDF", images: "Images et photographies",
  office_files: "Fichiers bureautiques", bulk_import: "Import de lots", user_upload: "Dépôt par les utilisateurs",
  operator_intake: "Réception par un agent", flatbed_scanner: "Scanner à plat", document_scanner: "Scanner de documents",
  mobile_camera: "Appareil photo mobile", network_scanner: "Scanner réseau", batch_scanning: "Numérisation par lots",
  image_cleanup: "Amélioration et nettoyage des images", ocr: "OCR : reconnaissance du texte imprimé",
  handwriting_recognition: "Reconnaissance d'écriture manuscrite", metadata_extraction: "Extraction des informations clés",
  tables_extraction: "Extraction de tableaux", manual_indexing: "Indexation manuelle", human_verification: "Vérification humaine",
  folders: "Dossiers", tags: "Étiquettes / tags", metadata: "Champs descriptifs", automatic_classification: "Classement assisté",
  access_levels: "Niveaux d'accès et confidentialité", full_text_search: "Recherche dans le texte",
  advanced_filters: "Filtres avancés", retention_rules: "Durées et règles de conservation",
  long_term_archive: "Archivage longue durée", backups: "Sauvegardes", export: "Export de documents",
  authorized_disposal: "Suppression autorisée et tracée",
  quiz: "Quiz", puzzle: "Casse-tête", strategy: "Stratégie", adventure: "Aventure", simulation: "Simulation",
  competition: "Compétition", educational_game: "Jeu éducatif", single_player: "Solo", multiplayer: "Multijoueur",
  guest_players: "Joueurs invités", registered_players: "Joueurs avec compte", teams: "Équipes",
  private_rooms: "Salons privés", public_matchmaking: "Rencontres publiques", moderator: "Modérateur",
  turn_based: "Jeu au tour par tour", real_time: "Temps réel", timed_rounds: "Manches chronométrées",
  levels: "Niveaux", random_events: "Événements aléatoires", custom_rules: "Règles personnalisées",
  penalties: "Pénalités", win_conditions: "Conditions de victoire", lobby: "Salle d'attente / lobby",
  ready_check: "Confirmation des joueurs prêts", tutorial: "Tutoriel", pause_resume: "Pause et reprise",
  save_progress: "Sauvegarde de progression", reconnect: "Reconnexion après coupure", spectator_mode: "Mode spectateur",
  points: "Points", leaderboards: "Classements", badges: "Badges", achievements: "Succès",
  statistics: "Statistiques", season_progression: "Progression par saison",
};

const storageKey = (id: string) => `merkora-configurator-draft-v1:${id}`;

type Draft = {
  answers: Record<string, ConfiguratorAnswer>;
  notes: Record<string, string>;
  savedAt: string;
};

function readDraft(id: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || typeof parsed.answers !== "object" || typeof parsed.notes !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function StepAnswer({
  step,
  answer,
  onChange,
}: {
  step: SpecializedConfiguratorStep;
  answer: ConfiguratorAnswer | undefined;
  onChange: (value: ConfiguratorAnswer) => void;
}) {
  if (step.input === "multiple" || step.input === "single") {
    const selected = Array.isArray(answer) ? answer : typeof answer === "string" ? [answer] : [];
    return (
      <div className="mk-config-options" role={step.input === "single" ? "radiogroup" : "group"} aria-label={step.title}>
        {(step.options ?? []).map((option) => {
          const checked = selected.includes(option);
          return (
            <label className={`mk-config-option ${checked ? "is-selected" : ""}`} key={option}>
              <input
                type={step.input === "single" ? "radio" : "checkbox"}
                name={step.id}
                checked={checked}
                onChange={() => {
                  if (step.input === "single") onChange(option);
                  else onChange(checked ? selected.filter((item) => item !== option) : [...selected, option]);
                }}
              />
              <span className="mk-config-option-check" aria-hidden="true">{checked ? "✓" : ""}</span>
              <span>{optionLabels[option] ?? option.replaceAll("_", " ")}</span>
            </label>
          );
        })}
      </div>
    );
  }
  if (step.input === "boolean") {
    return (
      <div className="mk-config-options">
        {[true, false].map((value) => (
          <label className={`mk-config-option ${answer === value ? "is-selected" : ""}`} key={String(value)}>
            <input type="radio" name={step.id} checked={answer === value} onChange={() => onChange(value)} />
            <span className="mk-config-option-check" aria-hidden="true">{answer === value ? "✓" : ""}</span>
            <span>{value ? "Oui" : "Non"}</span>
          </label>
        ))}
      </div>
    );
  }
  if (step.input === "number") {
    return <input className="mk-config-text-input" type="number" min={step.min} value={typeof answer === "number" ? answer : ""} onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))} />;
  }
  return <textarea className="mk-config-text-input" rows={4} value={typeof answer === "string" ? answer : ""} onChange={(event) => onChange(event.target.value)} />;
}

export default function SpecializedConfiguratorFlow({ configurator }: { configurator: SpecializedConfigurator }) {
  const [answers, setAnswers] = useState<Record<string, ConfiguratorAnswer>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [review, setReview] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const draft = readDraft(configurator.id);
    if (draft) {
      setAnswers(draft.answers);
      setNotes(draft.notes);
      setSavedAt(draft.savedAt);
      setRestored(true);
    }
  }, [configurator.id]);

  const visibleSteps = useMemo(
    () => getVisibleConfiguratorSteps(configurator.id, answers),
    [configurator.id, answers],
  );
  const currentStep = visibleSteps[Math.min(currentIndex, Math.max(visibleSteps.length - 1, 0))];

  useEffect(() => {
    if (currentIndex >= visibleSteps.length && visibleSteps.length > 0) {
      setCurrentIndex(visibleSteps.length - 1);
    }
  }, [currentIndex, visibleSteps.length]);

  function saveDraft() {
    const saved = new Date().toISOString();
    try {
      window.localStorage.setItem(storageKey(configurator.id), JSON.stringify({ answers, notes, savedAt: saved } satisfies Draft));
      setSavedAt(saved);
      setValidationMessage("Ton avancement est enregistré sur cet appareil.");
    } catch {
      setValidationMessage("Le navigateur n'a pas permis l'enregistrement local. Garde cette page ouverte pour conserver tes réponses.");
    }
  }

  function updateAnswer(stepId: string, value: ConfiguratorAnswer) {
    setAnswers((current) => ({ ...current, [stepId]: value }));
    setValidationMessage("");
  }

  function next() {
    if (!currentStep) return;
    const answer = answers[currentStep.id];
    const empty = answer === undefined || answer === null || answer === "" || (Array.isArray(answer) && answer.length === 0);
    if (currentStep.required && empty) {
      setValidationMessage("Choisis au moins une réponse pour continuer. Tu peux aussi préciser ton besoin dans le champ libre.");
      return;
    }
    if (currentIndex < visibleSteps.length - 1) {
      setCurrentIndex((index) => index + 1);
      setValidationMessage("");
      return;
    }
    const result = validateSpecializedConfiguratorAnswers(configurator.id, answers);
    if (!result.valid) {
      setValidationMessage(result.issues[0]?.message ?? "Certaines réponses doivent être vérifiées.");
      return;
    }
    setReview(true);
    setValidationMessage("");
    saveDraft();
  }

  function goToStep(index: number) {
    setReview(false);
    setCurrentIndex(index);
  }

  return (
    <main className="mk-v2-page mk-configurator-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/catalogue" aria-label="Retour au catalogue MerKora GDJ">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora GDJ</strong><small>CONFIGURATION MÉTIER</small></span>
        </a>
        <a className="mk-back-link" href="/catalogue">← Retour au catalogue</a>
      </header>

      <section className="mk-configurator-shell">
        <div className="mk-configurator-heading">
          <span className="mk-eyebrow"><span /> CONFIGURATEUR SPÉCIALISÉ</span>
          <h1>{configurator.title}</h1>
          <p>{configurator.purpose}</p>
        </div>

        <p className="mk-configurator-intro-note">Tes réponses seront regroupées dans une synthèse que tu pourras relire et corriger avant de poursuivre.</p>

        <div className="mk-configurator-progress" aria-label={`Progression : ${review ? visibleSteps.length : currentIndex + 1} sur ${visibleSteps.length}`}>
          <div><span>{review ? "Récapitulatif" : `Étape ${currentIndex + 1} sur ${visibleSteps.length}`}</span><strong>{Math.round((review ? 1 : (currentIndex + 1) / Math.max(visibleSteps.length, 1)) * 100)}%</strong></div>
          <div className="mk-configurator-progress-track"><i style={{ width: `${review ? 100 : (currentIndex + 1) / Math.max(visibleSteps.length, 1) * 100}%` }} /></div>
        </div>

        {!review && currentStep && (
          <section className="mk-configurator-card" aria-live="polite">
            <div className="mk-configurator-step-meta"><span>QUESTION {String(currentIndex + 1).padStart(2, "0")}</span><span>{currentStep.required ? "Réponse nécessaire" : "Facultatif"}</span></div>
            <h2>{currentStep.title}</h2>
            <h3>{currentStep.question}</h3>
            <p className="mk-configurator-guidance">{currentStep.guidance}</p>
            <StepAnswer step={currentStep} answer={answers[currentStep.id]} onChange={(value) => updateAnswer(currentStep.id, value)} />
            <label className="mk-configurator-note">
              <span>Précision avec tes propres mots <small>(facultatif)</small></span>
              <textarea
                rows={3}
                value={notes[currentStep.id] ?? ""}
                onChange={(event) => setNotes((current) => ({ ...current, [currentStep.id]: event.target.value }))}
                placeholder="Tu peux donner un exemple, expliquer une règle particulière ou ajouter une idée…"
              />
            </label>
            {validationMessage && <p className="mk-configurator-feedback" role="alert">{validationMessage}</p>}
            <div className="mk-configurator-actions">
              <button className="mk-config-button mk-config-button-quiet" type="button" onClick={() => currentIndex > 0 ? setCurrentIndex((index) => index - 1) : window.location.assign("/catalogue")} >
                {currentIndex > 0 ? "← Précédent" : "Quitter"}
              </button>
              <button className="mk-config-button mk-config-button-save" type="button" onClick={saveDraft}>Enregistrer mon avancement</button>
              <button className="mk-config-button mk-config-button-primary" type="button" onClick={next}>
                {currentIndex === visibleSteps.length - 1 ? "Voir mon récapitulatif →" : "Continuer →"}
              </button>
            </div>
            {restored && <p className="mk-configurator-saved">Un brouillon précédent a été restauré.</p>}
            {savedAt && !validationMessage && <p className="mk-configurator-saved">Dernier enregistrement : {new Date(savedAt).toLocaleString("fr-FR")}</p>}
          </section>
        )}

        {review && (
          <section className="mk-configurator-card mk-configurator-review">
            <span className="mk-eyebrow"><span /> SYNTHÈSE DE TA CONFIGURATION</span>
            <h2>Voici les choix que tu as exprimés.</h2>
            <p className="mk-configurator-guidance">Cette synthèse sert à préparer l'analyse de ton besoin. Elle ne constitue pas encore un devis ni une commande.</p>
            {visibleSteps.map((step, index) => {
              const answer = answers[step.id];
              const values = Array.isArray(answer) ? answer : answer === undefined ? [] : [answer];
              return (
                <article className="mk-configurator-review-row" key={step.id}>
                  <div><span>ÉTAPE {String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3></div>
                  <p>{values.map((value) => typeof value === "string" ? optionLabels[value] ?? value : String(value)).join(", ") || "Non précisé"}</p>
                  {notes[step.id] && <blockquote>{notes[step.id]}</blockquote>}
                  <button type="button" onClick={() => goToStep(index)}>Modifier cette réponse</button>
                </article>
              );
            })}
            <div className="mk-configurator-review-footer">
              <p>Tes réponses seront regroupées pour préparer la suite du projet. Un membre de l'équipe pourra examiner les besoins particuliers avant toute proposition commerciale.</p>
              <div className="mk-configurator-actions">
                <button className="mk-config-button mk-config-button-quiet" type="button" onClick={() => setReview(false)}>← Revenir aux questions</button>
                <button className="mk-config-button mk-config-button-primary" type="button" onClick={saveDraft}>Enregistrer cette configuration</button>
              </div>
              {validationMessage && <p className="mk-configurator-feedback" role="status">{validationMessage}</p>}
            </div>
          </section>
        )}

        <p className="mk-configurator-privacy">Tes réponses restent enregistrées localement sur cet appareil dans ce prototype. Elles ne sont pas encore envoyées à l'équipe MerKora.</p>
      </section>
    </main>
  );
}
