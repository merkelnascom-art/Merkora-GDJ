import {
  buildHybridDomainComposition,
  getProductType,
  type SolutionProductProfile,
  type SolutionProductRole,
} from "./solution-catalog";

export type WorkspaceAccess = "private" | "authenticated" | "public";

export interface WorkspaceRole extends SolutionProductRole {
  access: WorkspaceAccess;
  enabled: boolean;
  permissions: string[];
  origin: "product" | "domain" | "public" | "custom";
}

export interface WorkspaceEvent {
  id: string;
  kind: "customer_order_created" | "staff_attendance_recorded" | "learner_grade_published";
  title: string;
  description: string;
  visibleToRoleIds: string[];
  createdAt: string;
}

export interface WorkspacePlan {
  projectName: string;
  productTypeId: SolutionProductProfile["productTypeId"];
  roles: WorkspaceRole[];
  events: WorkspaceEvent[];
  version: number;
}

const defaultPermissions: Record<string, string[]> = {
  project_owner_admin: ["manage_product", "manage_users", "manage_roles", "view_all_activity", "manage_settings"],
  end_user: ["use_product", "manage_own_profile"],
  public_visitor: ["view_public_content", "submit_public_request"],
  sales_agent: ["view_orders", "manage_orders", "contact_customers"],
  stock_manager: ["view_inventory", "manage_inventory"],
  attendance_controller: ["record_attendance", "view_assigned_people"],
  attendance_supervisor: ["view_attendance", "review_attendance", "approve_corrections"],
  booking_manager: ["manage_availability", "manage_bookings"],
  checkin_agent: ["verify_booking", "record_checkin"],
  finance_manager: ["view_finance", "record_transactions", "view_reports"],
  expense_approver: ["review_expenses", "approve_expenses"],
  teacher: ["manage_learning_content", "record_assessments"],
  learner: ["view_learning_content", "complete_assessments", "view_own_progress"],
};

function accessFor(role: SolutionProductRole): WorkspaceAccess {
  return role.scope === "owner" ? "private" : "authenticated";
}

function roleToWorkspace(role: SolutionProductRole, origin: WorkspaceRole["origin"]): WorkspaceRole {
  return {
    ...role,
    access: accessFor(role),
    enabled: true,
    permissions: [...(defaultPermissions[role.id] ?? [\`use_\${role.id}\`, \`view_\${role.id}_activity\`])],
    origin,
  };
}

export function buildWorkspacePlan(profile: SolutionProductProfile): WorkspacePlan {
  const product = getProductType(profile.productTypeId);
  if (!product) throw new Error("Le type de produit sélectionné est introuvable.");

  const roles = new Map<string, WorkspaceRole>();
  product.defaultRoles.forEach((role) => {
    if (role.id === "end_user" && profile.productTypeId === "showcase_website") return;
    roles.set(role.id, roleToWorkspace(role, "product"));
  });

  buildHybridDomainComposition(profile.domainIds).roles.forEach((role) => {
    if (!roles.has(role.id)) roles.set(role.id, roleToWorkspace(role, "domain"));
  });

  if (profile.productTypeId === "showcase_website") {
    roles.set("public_visitor", {
      id: "public_visitor",
      label: "Visiteur public",
      scope: "product_user",
      description: "Découvre les pages publiques et peut contacter l'organisation sans compte.",
      access: "public",
      enabled: true,
      permissions: [...defaultPermissions.public_visitor],
      origin: "public",
    });
  }

  return {
    projectName: profile.projectName,
    productTypeId: profile.productTypeId,
    roles: [...roles.values()],
    events: [],
    version: 1,
  };
}

export function updateWorkspaceRole(
  plan: WorkspacePlan,
  roleId: string,
  patch: Partial<Pick<WorkspaceRole, "label" | "description" | "access" | "permissions">>,
): WorkspacePlan {
  let found = false;
  const roles = plan.roles.map((role) => {
    if (role.id !== roleId) return role;
    found = true;
    return { ...role, ...patch, permissions: patch.permissions ? [...patch.permissions] : role.permissions };
  });
  if (!found) throw new Error("Ce profil est introuvable.");
  return { ...plan, roles, version: plan.version + 1 };
}

export function setWorkspaceRoleEnabled(plan: WorkspacePlan, roleId: string, enabled: boolean): WorkspacePlan {
  let found = false;
  const roles = plan.roles.map((role) => {
    if (role.id !== roleId) return role;
    found = true;
    return { ...role, enabled };
  });
  if (!found) throw new Error("Ce profil est introuvable.");
  if (roleId === "project_owner_admin" && !enabled) {
    throw new Error("L'espace administrateur propriétaire doit rester actif.");
  }
  return { ...plan, roles, version: plan.version + 1 };
}

export function addWorkspaceRole(
  plan: WorkspacePlan,
  role: Pick<WorkspaceRole, "id" | "label" | "description" | "access" | "permissions">,
): WorkspacePlan {
  if (plan.roles.some((item) => item.id === role.id)) throw new Error("Ce profil existe déjà.");
  if (!role.id.trim() || !role.label.trim()) throw new Error("Un identifiant et un nom sont nécessaires.");
  return {
    ...plan,
    roles: [...plan.roles, { ...role, scope: "operational", enabled: true, origin: "custom" }],
    version: plan.version + 1,
  };
}

export function simulateWorkspaceAction(
  plan: WorkspacePlan,
  kind: WorkspaceEvent["kind"],
): WorkspacePlan {
  const targets: Record<WorkspaceEvent["kind"], { title: string; description: string; roleIds: string[] }> = {
    customer_order_created: {
      title: "Nouvelle commande client",
      description: "La commande apparaît dans le suivi commercial et dans la vue de pilotage du propriétaire.",
      roleIds: ["project_owner_admin", "sales_agent"],
    },
    staff_attendance_recorded: {
      title: "Présence enregistrée",
      description: "Le responsable de présence reçoit l'événement et le propriétaire peut consulter le suivi global.",
      roleIds: ["project_owner_admin", "attendance_supervisor"],
    },
    learner_grade_published: {
      title: "Résultat pédagogique publié",
      description: "L'apprenant concerné voit son résultat et la direction peut suivre l'activité pédagogique.",
      roleIds: ["project_owner_admin", "learner", "teacher"],
    },
  };
  const target = targets[kind];
  const visibleToRoleIds = target.roleIds.filter((id) =>
    plan.roles.some((role) => role.id === id && role.enabled),
  );
  const event: WorkspaceEvent = {
    id: \`demo-event-\${plan.events.length + 1}\`,
    kind,
    title: target.title,
    description: target.description,
    visibleToRoleIds,
    createdAt: new Date().toISOString(),
  };
  return { ...plan, events: [event, ...plan.events], version: plan.version + 1 };
}

export function getWorkspaceRoleSummary(role: WorkspaceRole): string {
  if (role.access === "public") return "Accessible sans compte";
  if (role.scope === "owner") return "Espace privé du propriétaire";
  if (role.scope === "operational") return "Espace de travail d'équipe";
  return "Espace personnel avec connexion";
}
