"use client";

import type { Project } from "@/lib/project-types";
import type { ClientJourneyDecisions, ClientJourneyStage } from "@/lib/client-journey";
import type { DiscoveryQuestionSelection } from "@/lib/universal-project-discovery";
import type { Recommendation } from "@/lib/solution-recommendations";
import type { ConceptValidationState } from "@/lib/concept-validation";
import { ClientUnderstandingStep } from "./client-understanding-step";
import { ClientAnalysisStep } from "./client-analysis-step";
import { ClientProposalsStep } from "./client-proposals-step";
import { ProjectMockupStudio } from "@/components/studio/project-mockup-studio";
import { ProjectPlanPreview } from "@/components/project-plan-preview";
import { ClientPlanApprovalPanel } from "@/components/account/client-plan-approval-panel";
import { ClientRequestSubmitPanel } from "@/components/studio/client-request-submit-panel";
import { ClientRequestTrackingPanel } from "@/components/account/client-request-tracking-panel";
import { ClientCommercialArea } from "./client-commercial-area";

type Props = {
  project: Project;
  stage: ClientJourneyStage;
  discovery: DiscoveryQuestionSelection;
  decisions: ClientJourneyDecisions;
  onDiscoveryChange: (selection: DiscoveryQuestionSelection) => void;
  onDecisionsChange: (decisions: ClientJourneyDecisions) => void;
  onRecommendationsChange: (recommendations: Recommendation[]) => void;
  onStageChange: (stage: ClientJourneyStage, decisionsOverride?: ClientJourneyDecisions) => void;
  onConceptVersionChange: (versionId: string) => void;
};

const stageHeadings: Record<ClientJourneyStage, { title: string; description: string }> = {
  welcome: { title: "Bienvenue", description: "Retrouvez vos projets." },
  understanding: { title: "Compréhension", description: "Décrire la situation et clarifier le besoin." },
  analysis: { title: "Analyse", description: "Organiser les faits et les questions." },
  proposals: { title: "Propositions", description: "Examiner les pistes adaptées." },
  concept: { title: "Concept", description: "Voir une première forme concrète." },
  personalization: { title: "Personnalisation", description: "Ajuster le concept à vos choix." },
  validation: { title: "Validation", description: "Confirmer ou demander des ajustements." },
  realization: { title: "Réalisation", description: "Suivre la suite du projet." },
};

export function ClientProjectJourney({
  project,
  stage,
  discovery,
  decisions,
  onDiscoveryChange,
  onDecisionsChange,
  onRecommendationsChange,
  onStageChange,
  onConceptVersionChange,
}: Props) {
  const recommendations = project.recommendations;

  return (
    <div className="mk-journey-view">
      <div className="mk-journey-heading">
        <div><span>PARCOURS MERKORA</span><h2>{stageHeadings[stage].title}</h2></div>
        <p>{stageHeadings[stage].description}</p>
      </div>

      {stage === "understanding" && (
        <ClientUnderstandingStep
          project={project}
          discovery={discovery}
          onDiscoveryChange={onDiscoveryChange}
          onContinue={() => onStageChange("analysis")}
        />
      )}

      {stage === "analysis" && (
        <ClientAnalysisStep project={project} discovery={discovery} onContinue={() => onStageChange("proposals")} />
      )}

      {stage === "proposals" && (
        <ClientProposalsStep
          project={project}
          recommendations={recommendations}
          selectedIds={decisions.selectedProposalIds}
          onSelectionChange={(selectedProposalIds) => onDecisionsChange({ ...decisions, selectedProposalIds, proposalSelectionConfirmed: false })}
          onRecommendationsChange={onRecommendationsChange}
          onContinue={() => {
            const nextDecisions = { ...decisions, proposalSelectionConfirmed: true };
            onDecisionsChange(nextDecisions);
            onStageChange("concept", nextDecisions);
          }}
        />
      )}

      {stage === "concept" && (
        <section className="mk-step-view">
          <div className="mk-step-heading">
            <div className="mk-step-kicker">ÉTAPE 04 · CONCEPT VISUEL</div>
            <h1>Voici une première forme <em>à explorer.</em></h1>
            <p>Cette représentation est un support de discussion construit à partir du dossier. Elle n’est pas encore une décision définitive.</p>
          </div>
          <ProjectMockupStudio project={project} showValidation={false} selectedRecommendationIds={decisions.selectedProposalIds} onSelectedRecommendationIdsChange={(ids) => onDecisionsChange({ ...decisions, selectedProposalIds: ids, proposalSelectionConfirmed: true })} onConceptVersionChange={onConceptVersionChange} />
          <ProjectPlanPreview project={project} />
          <div className="mk-step-footer">
            <div><strong>Cette direction vous convient-elle comme base de travail ?</strong><p>Vous pourrez encore modifier les éléments à l’étape suivante.</p></div>
            <button className="mk-primary-button" onClick={() => {
              onStageChange("personalization");
            }}>Personnaliser ce concept <span>→</span></button>
          </div>
        </section>
      )}

      {stage === "personalization" && (
        <section className="mk-step-view">
          <div className="mk-step-heading">
            <div className="mk-step-kicker">ÉTAPE 05 · PERSONNALISATION</div>
            <h1>Adaptons le concept à <em>vos choix.</em></h1>
            <p>Modifiez les éléments de présentation et les fonctions proposées. Vos ajustements restent modifiables avant validation.</p>
          </div>
          <ProjectMockupStudio project={project} selectedRecommendationIds={decisions.selectedProposalIds} onSelectedRecommendationIdsChange={(ids) => onDecisionsChange({ ...decisions, selectedProposalIds: ids, proposalSelectionConfirmed: true })} onConceptVersionChange={onConceptVersionChange} />
          <div className="mk-step-footer">
            <div><strong>Vous gardez la main sur la direction retenue.</strong><p>La validation intervient dans l’étape suivante, après votre vérification.</p></div>
            <button className="mk-primary-button" disabled={!decisions.selectedConceptId} onClick={() => onStageChange("validation")}>Vérifier le concept <span>→</span></button>
          </div>
        </section>
      )}

      {stage === "validation" && (
        <section className="mk-step-view">
          <div className="mk-step-heading">
            <div className="mk-step-kicker">ÉTAPE 06 · VALIDATION DU CONCEPT</div>
            <h1>Avant de réaliser, <em>vérifions ensemble.</em></h1>
            <p>Vous pouvez valider cette direction ou demander des ajustements. Cette validation concerne le concept, pas un devis ni un paiement.</p>
          </div>
          <ProjectMockupStudio
            project={project}
            showValidation
            selectedRecommendationIds={decisions.selectedProposalIds}
            onSelectedRecommendationIdsChange={(ids) => onDecisionsChange({ ...decisions, selectedProposalIds: ids, proposalSelectionConfirmed: true })}
            onConceptVersionChange={onConceptVersionChange}
            onConceptDecision={(state: ConceptValidationState) => {
              if (state.status !== "approved") return;
              const nextDecisions = { ...decisions, selectedConceptId: state.currentVersionId, designValidated: true };
              onDecisionsChange(nextDecisions);
              onStageChange("realization", nextDecisions);
            }}
          />
          <ClientPlanApprovalPanel key={`client-approval-${project.id}`} projectId={project.id} />
          <div className="mk-validation-note">
            <strong>Ce que votre validation signifie</strong>
            <p>Vous confirmez que le concept et l’orientation générale peuvent servir de base à la préparation de la réalisation. Les conditions commerciales restent séparées et seront examinées ensuite si vous souhaitez poursuivre.</p>
          </div>
          <div className="mk-validation-note"><strong>La décision est enregistrée sur la version affichée.</strong><p>Utilisez le panneau de validation du studio pour approuver cette version ou demander des modifications. Une nouvelle version devra être validée à son tour.</p></div>
        </section>
      )}

      {stage === "realization" && (
        <section className="mk-step-view">
          <div className="mk-step-heading">
            <div className="mk-step-kicker">ÉTAPE 07 · RÉALISATION</div>
            <h1>Votre projet entre dans sa <em>suite concrète.</em></h1>
            <p>Retrouvez les échanges avec MerKora, transmettez le dossier lorsque vous êtes prêt et suivez les mises à jour disponibles.</p>
          </div>
          <div className="mk-realization-notice"><strong>Concept validé</strong><p>Votre validation de conception est conservée séparément des devis, factures et paiements. La réalisation effective dépendra des étapes convenues avec MerKora.</p></div>
          <ClientRequestSubmitPanel project={project} />
          <ClientRequestTrackingPanel />
          <ClientCommercialArea stage={stage} />
        </section>
      )}
    </div>
  );
}
