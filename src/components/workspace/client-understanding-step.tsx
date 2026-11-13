"use client";

import type { Project } from "@/lib/project-types";
import type { DiscoveryQuestionSelection } from "@/lib/universal-project-discovery";
import { MerkoraAssistantPanel } from "@/components/assistant/merkora-assistant-panel";

type Props = {
  project: Project;
  discovery: DiscoveryQuestionSelection;
  onDiscoveryChange: (selection: DiscoveryQuestionSelection) => void;
  onContinue: () => void;
};

export function ClientUnderstandingStep({ project, discovery, onDiscoveryChange, onContinue }: Props) {
  const ready = discovery.readyForSolutionReview && discovery.remainingGaps.length === 0 && discovery.contradictions.length === 0;
  return (
    <section className="mk-step-view">
      <div className="mk-step-heading">
        <div className="mk-step-kicker">ÉTAPE 01 · COMPRÉHENSION</div>
        <h1>Commençons par <em>vous comprendre.</em></h1>
        <p>Vous n’avez pas à connaître le nom d’un logiciel, d’un métier ou d’une technologie. Parlez simplement de votre situation.</p>
      </div>
      <div className="mk-understanding-summary">
        <span className="mk-summary-label">VOTRE DESCRIPTION</span>
        <h2>{project.title}</h2>
        <p>{project.problem}</p>
      </div>
      <MerkoraAssistantPanel
        key={"assistant-" + project.id}
        project={project}
        onDiscoveryChange={onDiscoveryChange}
      />
      <div className="mk-step-footer">
        <div>
          <strong>{ready ? "Les éléments essentiels sont suffisamment clarifiés." : "Nous avançons sans brûler les étapes."}</strong>
          <p>{ready ? "Vous pouvez passer à l’analyse et découvrir les premières pistes." : discovery.nextQuestion || "Répondez à la prochaine question utile dans la conversation ci-dessus."}</p>
        </div>
        <button className="mk-primary-button" disabled={!ready} onClick={onContinue}>Continuer <span>→</span></button>
      </div>
    </section>
  );
}
