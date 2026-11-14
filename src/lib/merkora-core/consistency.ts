import type { ApparentContradiction, RuleAssertion } from "./types";

function sameValue(left: RuleAssertion["value"], right: RuleAssertion["value"]): boolean {
  return typeof left === typeof right && left === right;
}

function stablePairId(leftId: string, rightId: string): string {
  return [leftId, rightId].sort((a, b) => a.localeCompare(b)).join("::");
}

/**
 * Detects only conflicts in explicitly declared mutually-exclusive predicates.
 * It is a structured rule checker, not a natural-language contradiction detector.
 * Every result remains "apparent" until the person explicitly confirms the conflict.
 */
export function detectApparentContradictions(
  assertions: RuleAssertion[],
  exclusivePredicates: string[],
): ApparentContradiction[] {
  const exclusive = new Set(exclusivePredicates);
  const conflicts: ApparentContradiction[] = [];

  for (let leftIndex = 0; leftIndex < assertions.length; leftIndex += 1) {
    const left = assertions[leftIndex];

    for (let rightIndex = leftIndex + 1; rightIndex < assertions.length; rightIndex += 1) {
      const right = assertions[rightIndex];
      if (!exclusive.has(left.predicate)) continue;
      if (left.subject !== right.subject || left.predicate !== right.predicate) continue;
      if (left.scopeKey !== right.scopeKey || left.contextKey !== right.contextKey) continue;
      if (typeof left.value !== typeof right.value) continue;
      if (sameValue(left.value, right.value)) continue;

      const assertionIds = [left.id, right.id].sort((a, b) => a.localeCompare(b)) as [string, string];
      const evidenceIds = [left.sourceEvidenceId, right.sourceEvidenceId]
        .sort((a, b) => a.localeCompare(b)) as [string, string];

      conflicts.push({
        id: `conflict:${stablePairId(left.id, right.id)}`,
        status: "apparent",
        subject: left.subject,
        predicate: left.predicate,
        scopeKey: left.scopeKey,
        contextKey: left.contextKey,
        assertionIds,
        evidenceIds,
        explanation: "Deux valeurs incompatibles ont été enregistrées pour la même règle, le même périmètre et le même contexte. Une clarification humaine est nécessaire.",
      });
    }
  }

  return conflicts.sort((a, b) => a.id.localeCompare(b.id));
}

/** Call only after an explicit user confirmation has been recorded as evidence. */
export function confirmConflict(
  conflict: ApparentContradiction,
  confirmationEvidenceId: string,
): ApparentContradiction {
  if (conflict.status !== "apparent") {
    throw new Error("Only an apparent contradiction can be confirmed.");
  }
  if (!confirmationEvidenceId.trim()) {
    throw new Error("A user-confirmation evidence reference is required.");
  }

  return {
    ...conflict,
    status: "confirmed",
    confirmationEvidenceId,
  };
}
