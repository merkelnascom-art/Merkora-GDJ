export function getPlanGenerationAction(planExists: boolean): {
  label: string;
  hint: string;
} {
  return planExists
    ? {
        label: "Générer une nouvelle version du plan",
        hint: "Les validations précédentes ne seront pas réutilisées.",
      }
    : {
        label: "Générer le plan interne",
        hint: "Aucun worker ni service payant ne sera lancé.",
      };
}
