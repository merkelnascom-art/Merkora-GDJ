"use client";

import type { Project } from "@/lib/project-types";
import type { DiscoveryQuestionSelection } from "@/lib/universal-project-discovery";
import { analyzeUniversalProjectIntent } from "@/lib/universal-project-understanding";

type Props = { project: Project; discovery: DiscoveryQuestionSelection; onContinue: () => void };

export function ClientAnalysisStep({ project, discovery, onContinue }: Props) {
  const analysis = analyzeUniversalProjectIntent(`${project.title}\n${project.problem}\n${project.desiredOutcome}`);
  return (
    <section className="mk-step-view">
      <div className="mk-step-heading">
        <div className="mk-step-kicker">ÉTAPE 02 · ANALYSE</div>
        <h1>Mettre de l’ordre dans <em>votre besoin.</em></h1>
        <p>Nous séparons ce que vous avez expliqué, ce qui reste incertain et les points à ne pas décider à votre place.</p>
      </div>
      <div className="mk-analysis-status"><span className="mk-status-dot" /> Pré-analyse locale · Aucun service IA externe n’est déclaré comme exécuté ici</div>
      <div className="mk-analysis-grid">
        <article><span>CE QUE VOUS AVEZ EXPRIMÉ</span><h3>Éléments compris</h3>{analysis.statedFacts.length ? <ul>{analysis.statedFacts.map((fact, index) => <li key={`${fact.text}-${index}`}>{fact.text}</li>)}</ul> : <p>{project.problem}</p>}</article>
        <article><span>À CONFIRMER</span><h3>Points encore ouverts</h3>{[...analysis.unknowns, ...discovery.remainingGaps.map((gap) => `Clarification requise : ${gap.replace(/_/g, " ")}`)].length ? <ul>{[...analysis.unknowns, ...discovery.remainingGaps.map((gap) => `Clarification requise : ${gap.replace(/_/g, " ")}`)].map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p>Aucun point critique signalé par la vérification actuelle.</p>}</article>
      </div>
      {analysis.hypotheses.length > 0 && <div className="mk-hypothesis-list"><strong>Hypothèses à vérifier — pas des décisions</strong>{analysis.hypotheses.map((item, index) => <p key={`${item.statement}-${index}`}>{item.statement} <small>{item.reason}</small></p>)}</div>}
      <div className="mk-step-footer">
        <div><strong>Votre contrôle reste prioritaire.</strong><p>Les propositions suivantes sont des pistes à examiner, pas des choix déjà validés.</p></div>
        <button className="mk-primary-button" onClick={onContinue}>Voir les pistes adaptées <span>→</span></button>
      </div>
    </section>
  );
}
