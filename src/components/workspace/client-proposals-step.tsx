"use client";

import type { Project } from "@/lib/project-types";
import type { Recommendation } from "@/lib/solution-recommendations";
import { AiProposalPanel } from "@/components/ai/ai-proposal-panel";

export function getClientProposalId(recommendation: Recommendation): string {
  return recommendation.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Props = {
  project: Project;
  recommendations: Recommendation[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRecommendationsChange: (items: Recommendation[]) => void;
  onContinue: () => void;
};

export function ClientProposalsStep({ project, recommendations, selectedIds, onSelectionChange, onRecommendationsChange, onContinue }: Props) {
  function toggle(id: string) {
    onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  return (
    <section className="mk-step-view">
      <div className="mk-step-heading">
        <div className="mk-step-kicker">ÉTAPE 03 · PROPOSITIONS</div>
        <h1>Des pistes, <em>pas des décisions.</em></h1>
        <p>Choisissez les directions qui vous semblent utiles. Vous pouvez en retenir plusieurs, les modifier ou ne rien retenir pour le moment.</p>
      </div>
      <div className="mk-proposal-list">
        {recommendations.map((recommendation) => {
          const id = getClientProposalId(recommendation);
          const selected = selectedIds.includes(id);
          return (
            <label className={`mk-proposal-card ${selected ? "is-selected" : ""}`} key={id}>
              <input type="checkbox" checked={selected} onChange={() => toggle(id)} />
              <span className="mk-proposal-check" aria-hidden="true">{selected ? "✓" : "+"}</span>
              <span className="mk-proposal-copy"><strong>{recommendation.title}</strong><span>{recommendation.description}</span><small>Pourquoi cette piste : {recommendation.reason}</small></span>
              <span className="mk-proposal-state">{selected ? "Retenue par vous" : "À examiner"}</span>
            </label>
          );
        })}
      </div>
      <AiProposalPanel project={project} onApply={onRecommendationsChange} />
      <div className="mk-step-footer">
        <div><strong>{selectedIds.length} piste{selectedIds.length > 1 ? "s" : ""} retenue{selectedIds.length > 1 ? "s" : ""}</strong><p>Votre sélection sera confirmée uniquement lorsque vous choisirez de continuer.</p></div>
        <button className="mk-primary-button" disabled={selectedIds.length === 0} onClick={onContinue}>Confirmer ma sélection <span>→</span></button>
      </div>
    </section>
  );
}
