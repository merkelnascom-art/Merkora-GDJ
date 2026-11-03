export type AgentRole = "analyst" | "architect" | "implementer" | "reviewer" | "tester" | "cross_checker";
export type AgentProviderConnection = { providerId: string; status: string; capabilities: readonly string[] };
export type AgentAssignment = { role: AgentRole; providerId: string; capability: string };
export type AgentCollaborationPlan = { projectId: string; assignments: AgentAssignment[]; blockedRoles: AgentRole[] };
const ROLE_CAPABILITIES: Record<AgentRole, readonly string[]> = { analyst:["models.generate"], architect:["models.generate"], implementer:["models.generate"], reviewer:["models.generate"], tester:["models.generate"], cross_checker:["models.generate"] };
const INDEPENDENT_REVIEW_ROLES = new Set<AgentRole>(["reviewer","cross_checker"]);
function isAgentRole(value:string):value is AgentRole{return Object.prototype.hasOwnProperty.call(ROLE_CAPABILITIES,value)}
export function planAgentCollaboration(input:{projectId:string;requestedRoles:readonly string[];providers:readonly AgentProviderConnection[]}):AgentCollaborationPlan{
 if(!input.projectId.trim()||input.projectId.length>160)throw new Error("A project identifier is required.");
 const roles=[...new Set(input.requestedRoles)],assigned=new Map<AgentRole,AgentAssignment>(),used=new Set<string>();
 const order=[...roles.filter(r=>!INDEPENDENT_REVIEW_ROLES.has(r as AgentRole)),...roles.filter(r=>INDEPENDENT_REVIEW_ROLES.has(r as AgentRole))];
 for(const requested of order){if(!isAgentRole(requested))throw new Error("Unknown agent role.");const role=requested,independent=INDEPENDENT_REVIEW_ROLES.has(role);
 const provider=input.providers.find(p=>p.status==="connected"&&(!independent||!used.has(p.providerId))&&ROLE_CAPABILITIES[role].some(c=>p.capabilities.includes(c)));
 if(!provider)continue;const capability=ROLE_CAPABILITIES[role].find(c=>provider.capabilities.includes(c));if(!capability)continue;
 assigned.set(role,{role,providerId:provider.providerId,capability});used.add(provider.providerId);}
 return {projectId:input.projectId,assignments:roles.map(r=>assigned.get(r as AgentRole)).filter((x):x is AgentAssignment=>!!x),blockedRoles:roles.filter(r=>!assigned.has(r as AgentRole)) as AgentRole[]};
}