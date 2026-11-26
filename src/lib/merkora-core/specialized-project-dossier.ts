import {
  getSpecializedConfigurator,
  getVisibleConfiguratorSteps,
  type ConfiguratorAnswer,
  type SpecializedConfiguratorStep,
} from "./specialized-configurators";

export interface SpecializedProjectDossierInput {
  id: string;
  configuratorId: string;
  answers: Record<string, ConfiguratorAnswer>;
  notes?: Record<string, string>;
  generatedAt?: string;
}

export interface SpecializedProjectDossierAnswer {
  stepId: string;
  title: string;
  question: string;
  input: SpecializedConfiguratorStep["input"];
  required: boolean;
  value: ConfiguratorAnswer;
}

export interface SpecializedProjectDossierEvidence {
  id: string;
  stepId: string;
  kind: "explicit_selection" | "client_note";
  content: ConfiguratorAnswer | string;
  classification: "user_provided";
  reviewStatus: "unreviewed";
}

export interface SpecializedProjectDossier {
  schemaVersion: 1;
  id: string;
  title: string;
  status: "draft_needs_review";
  createdAt: string;
  source: {
    journey: "catalogue_specialized_configurator";
    configuratorId: string;
    configuratorVersion: 1;
  };
  productContext: {
    domainIds: string[];
    candidateModuleIds: string[];
  };
  answers: SpecializedProjectDossierAnswer[];
  evidence: SpecializedProjectDossierEvidence[];
  unansweredStepIds: string[];
  skippedStepIds: string[];
  interpretation: {
    facts: string[];
    deductions: string[];
    hypotheses: string[];
    humanReviewRequired: true;
  };
  commercial: {
    quoteCreated: false;
    orderCreated: false;
  };
}

function hasAnswer(value: ConfiguratorAnswer | undefined): value is ConfiguratorAnswer {
  return value !== undefined && value !== null && value !== "" &&
    !(Array.isArray(value) && value.length === 0);
}

function cloneAnswer(value: ConfiguratorAnswer): ConfiguratorAnswer {
  return Array.isArray(value) ? [...value] : value;
}

/**
 * Converts only visible, customer-provided configurator input into a provisional
 * dossier. It does not infer business facts, make recommendations, or create a quote.
 */
export function buildSpecializedProjectDossier(
  input: SpecializedProjectDossierInput,
): SpecializedProjectDossier | undefined {
  const configurator = getSpecializedConfigurator(input.configuratorId);
  if (!configurator) return undefined;

  const visibleSteps = getVisibleConfiguratorSteps(input.configuratorId, input.answers);
  const visibleIds = new Set(visibleSteps.map((step) => step.id));
  const answers: SpecializedProjectDossierAnswer[] = [];
  const evidence: SpecializedProjectDossierEvidence[] = [];
  const unansweredStepIds: string[] = [];

  visibleSteps.forEach((step) => {
    const value = input.answers[step.id];
    if (!hasAnswer(value)) {
      unansweredStepIds.push(step.id);
    } else {
      const copiedValue = cloneAnswer(value);
      answers.push({
        stepId: step.id,
        title: step.title,
        question: step.question,
        input: step.input,
        required: step.required,
        value: copiedValue,
      });
      evidence.push({
        id: `answer:${step.id}`,
        stepId: step.id,
        kind: "explicit_selection",
        content: cloneAnswer(value),
        classification: "user_provided",
        reviewStatus: "unreviewed",
      });
    }

    // A free-text note is independent evidence: retain it even if the
    // customer has not selected an answer for this visible question yet.
    const note = input.notes?.[step.id]?.trim();
    if (note) {
      evidence.push({
        id: `note:${step.id}`,
        stepId: step.id,
        kind: "client_note",
        content: note,
        classification: "user_provided",
        reviewStatus: "unreviewed",
      });
    }
  });

  const skippedStepIds = configurator.steps
    .filter((step) => !visibleIds.has(step.id))
    .map((step) => step.id);

  return {
    schemaVersion: 1,
    id: input.id,
    title: configurator.title,
    status: "draft_needs_review",
    createdAt: input.generatedAt ?? new Date().toISOString(),
    source: {
      journey: "catalogue_specialized_configurator",
      configuratorId: configurator.id,
      configuratorVersion: 1,
    },
    productContext: {
      domainIds: [...configurator.domainIds],
      candidateModuleIds: [...configurator.moduleIds],
    },
    answers,
    evidence,
    unansweredStepIds,
    skippedStepIds,
    interpretation: {
      facts: [],
      deductions: [],
      hypotheses: [],
      humanReviewRequired: true,
    },
    commercial: {
      quoteCreated: false,
      orderCreated: false,
    },
  };
}

/** Builds an editable hand-off prompt from source data, without adding conclusions. */
export function formatSpecializedProjectDossierForConversation(
  dossier: SpecializedProjectDossier,
): string {
  const lines = [
    "Je souhaite poursuivre dans la conception intelligente MerKora GDJ à partir de mon dossier provisoire.",
    `Parcours d'origine : configurateur spécialisé « ${dossier.title} ».`,
    "Les éléments ci-dessous sont mes choix et mes précisions. Ils ne sont pas encore validés comme spécifications finales.",
    "",
    "MES CHOIX EXPLICITES :",
  ];

  dossier.answers.forEach((answer) => {
    const value = Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value);
    lines.push(`- ${answer.title} : ${value.replaceAll("_", " ")}`);
  });

  dossier.evidence
    .filter((item) => item.kind === "client_note")
    .forEach((item) => lines.push(`- Ma précision (${item.stepId}) : ${String(item.content)}`));

  if (dossier.unansweredStepIds.length) {
    lines.push("", `Points que je n'ai pas encore précisés : ${dossier.unansweredStepIds.join(", ")}.`);
  }
  if (dossier.skippedStepIds.length) {
    lines.push(`Questions non posées car elles ne correspondent pas au parcours choisi : ${dossier.skippedStepIds.join(", ")}.`);
  }

  lines.push(
    "",
    "Merci de reprendre ces éléments sans les transformer en faits confirmés, de ne pas me redemander ce qui est déjà indiqué et de clarifier les incertitudes utiles.",
  );
  return lines.join("\n");
}
