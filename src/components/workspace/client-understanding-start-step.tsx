"use client";

import { useState, type FormEvent } from "react";

type Props = { initialTitle?: string; error?: string; onSubmit: (description: string) => void; onCancel?: () => void };

export function ClientUnderstandingStartStep({ initialTitle, error, onSubmit, onCancel }: Props) {
  const [description, setDescription] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (description.trim().length < 15) return;
    onSubmit(description.trim());
  }

  return (
    <section className="mk-step-view mk-start-view">
      <div className="mk-step-heading">
        <div className="mk-step-kicker">NOUVEAU PROJET · PREMIER ÉCHANGE</div>
        <h1>Qu’aimeriez-vous <em>résoudre ou améliorer ?</em></h1>
        <p>Racontez la situation avec vos propres mots. Vous n’avez pas besoin de choisir un domaine, un outil, un appareil ou un budget.</p>
      </div>
      {initialTitle && <div className="mk-example-context">Point de départ : <strong>{initialTitle}</strong> <span>Vous pouvez le modifier dans votre description.</span></div>}
      <form className="mk-start-form" onSubmit={submit}>
        <label htmlFor="mk-first-description">Décrivez ce qui se passe, ce qui vous pose problème ou ce que vous souhaitez voir changer</label>
        <textarea
          id="mk-first-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Exemple : Aujourd’hui, je rencontre des difficultés pour… Cela entraîne… J’aimerais pouvoir…"
          rows={7}
          maxLength={5000}
          required
        />
        <div className="mk-start-meta"><span>{description.length}/5000 caractères</span><span>Minimum 15 caractères</span></div>
        {error && <p className="mk-form-error" role="alert">{error}</p>}
        <div className="mk-start-actions">
          {onCancel && <button type="button" className="mk-secondary-button" onClick={onCancel}>Annuler</button>}
          <button type="submit" className="mk-primary-button" disabled={description.trim().length < 15}>Créer mon espace de réflexion <span>→</span></button>
        </div>
      </form>
      <p className="mk-privacy-note">Votre description est d’abord conservée sur cet appareil. La synchronisation en ligne nécessite une connexion à votre compte.</p>
    </section>
  );
}
