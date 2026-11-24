import type { SolutionProductTypeId } from "./solution-catalog";

export interface SolutionProfileAnswers {
  projectName: string;
  productTypeId: SolutionProductTypeId | "";
}

export const SOLUTION_PROFILE_QUESTIONS = [
  {
    title: "Comment s'appelle ton projet ?",
    description: "Tu peux garder le nom déjà proposé ou le modifier.",
  },
  {
    title: "Quel type de produit veux-tu créer ?",
    description: "Un site, une plateforme et une application mobile n'ont pas la même structure.",
  },
  {
    title: "Dans quel(s) domaine(s) sera-t-il utilisé ?",
    description: "Tu peux choisir plusieurs domaines pour créer une solution hybride. Tu peux aussi passer cette question.",
  },
  {
    title: "Comment souhaites-tu naviguer dans le produit ?",
    description: "MerKora propose un choix adapté au produit. Tu pourras le modifier plus tard.",
  },
  {
    title: "Quelle identité visuelle souhaites-tu ?",
    description: "Tu pourras créer un logo, utiliser celui que tu as déjà ou décider plus tard.",
  },
] as const;

export function canAdvanceSolutionProfileStep(
  step: number,
  answers: SolutionProfileAnswers,
): boolean {
  if (step === 0) return answers.projectName.trim().length > 0;
  if (step === 1) return Boolean(answers.productTypeId);
  return step >= 2 && step < SOLUTION_PROFILE_QUESTIONS.length;
}
