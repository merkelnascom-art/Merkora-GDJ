import type { ApparentContradiction, RuleAssertion } from "./types";
function sameValue(left: RuleAssertion["value"], right: RuleAssertion["value"]): boolean { return typeof left === typeof right && left === right; }
function stablePairId(leftId: string, rightId: string): string { return [leftId, rightId].sort((a,b)=>a.localeCompare(b)).join("::"); }
export function detectApparentContradictions(assertions: RuleAssertion[], exclusivePredicates: string[]): ApparentContradiction[] {
  const exclusive = new Set(exclusivePredicates);
  const conflicts: ApparentContradiction[] = [];
  for (let i=0;i<assertions.length;i+=1) for (let j=i+1;j<assertions.length;j+=1) {
    const left=assertions[i], right=assertions[j];
    if (!exclusive.has(left.predicate) || left.subject!==right.subject || left.predicate!==right.predicate ||
      left.scopeKey!==right.scopeKey || left.contextKey!==right.contextKey || typeof left.value!==typeof right.value || sameValue(left.value,right.value)) continue;
    const assertionIds=[left.id,right.id].sort((a,b)=>a.localeCompare(b)) as [string,string];
    const evidenceIds=[left.sourceEvidenceId,right.sourceEvidenceId].sort((a,b)=>a.localeCompare(b)) as [string,string];
    conflicts.push({id:`conflict:${stablePairId(left.id,right.id)}`,status:"apparent",subject:left.subject,predicate:left.predicate,scopeKey:left.scopeKey,contextKey:left.contextKey,assertionIds,evidenceIds,explanation:"Deux valeurs incompatibles ont été enregistrées pour la même règle, le même périmètre et le même contexte. Une clarification humaine est nécessaire."});
  }
  return conflicts.sort((a,b)=>a.id.localeCompare(b.id));
}
export function confirmConflict(conflict: ApparentContradiction, confirmationEvidenceId: string): ApparentContradiction {
  if (conflict.status!=="apparent") throw new Error("Only an apparent contradiction can be confirmed.");
  if (!confirmationEvidenceId.trim()) throw new Error("A user-confirmation evidence reference is required.");
  return {...conflict,status:"confirmed",confirmationEvidenceId};
}
