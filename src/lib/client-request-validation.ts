const statuses = new Set(["draft", "changes_requested", "approved"]);
const choices = new Set(["undecided", "accepted", "changes_requested", "negotiate"]);
const maxText = (value: unknown, length: number): value is string => typeof value === "string" && value.length <= length;

export function isValidClientRequestPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  if (!p.project || typeof p.project !== "object" || Array.isArray(p.project)) return false;
  const project = p.project as Record<string, unknown>;
  if (!maxText(project.id, 160) || project.id.trim().length < 3 ||
      !maxText(project.title, 160) || !project.title.trim() ||
      !maxText(project.category, 40) ||
      !maxText(project.problem, 2500) || !maxText(project.desiredOutcome, 1500) ||
      !maxText(project.budget, 100) || !maxText(project.urgency, 20) ||
      !Array.isArray(project.recommendations) || project.recommendations.length > 20) return false;
  if (!p.studio || typeof p.studio !== "object" || Array.isArray(p.studio)) return false;
  const studio = p.studio as Record<string, unknown>;
  const displayFormats = new Set(["website", "mobile", "dashboard"]);
  const solutionFormats = new Set(["human", "organizational", "documentary", "physical", "digital", "hybrid"]);
  if ((studio.format !== null && studio.format !== undefined && !displayFormats.has(String(studio.format))) ||
      !["violet", "blue", "emerald", "amber"].includes(String(studio.palette)) ||
      (studio.solutionFormat !== null && studio.solutionFormat !== undefined && !solutionFormats.has(String(studio.solutionFormat))) ||
      (studio.formatConfirmed === true && (studio.solutionFormat !== "digital" || !displayFormats.has(String(studio.format))))) return false;
  if (studio.reviewStatus !== undefined && (!maxText(studio.reviewStatus, 30) || !statuses.has(String(studio.reviewStatus)))) return false;
  if (p.quote !== undefined) {
    if (!p.quote || typeof p.quote !== "object" || Array.isArray(p.quote)) return false;
    const quote = p.quote as Record<string, unknown>;
    if (!maxText(quote.amount, 40) || (quote.amount && !/^\d+$/.test(quote.amount)) ||
        !maxText(quote.days, 20) || (quote.days && !/^\d+$/.test(quote.days)) ||
        !maxText(quote.paymentTerms, 500)) return false;
  }
  if (p.clientResponse !== undefined) {
    if (!p.clientResponse || typeof p.clientResponse !== "object" || Array.isArray(p.clientResponse)) return false;
    const response = p.clientResponse as Record<string, unknown>;
    if (!maxText(response.choice, 30) || !choices.has(response.choice) ||
        !maxText(response.comment, 1200)) return false;
  }
  if (studio.conceptValidation !== undefined && studio.conceptValidation !== null) {
    if (typeof studio.conceptValidation !== "object" || Array.isArray(studio.conceptValidation) || JSON.stringify(studio.conceptValidation).length > 20_000) return false;
  }
  return JSON.stringify(p).length <= 100_000;
}
