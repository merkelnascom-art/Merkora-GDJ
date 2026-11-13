export const ADMIN_NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: "⌂" },
  { id: "requests", label: "Demandes clients", icon: "▤" },
  { id: "conception", label: "Analyse & conception", icon: "✳" },
  { id: "quotes", label: "Validations & devis", icon: "✓" },
  { id: "realization", label: "Réalisation", icon: "⚙" },
  { id: "clients", label: "Clients", icon: "♙" },
  { id: "finances", label: "Finances", icon: "◈" },
  { id: "configuration", label: "Configuration", icon: "☷" },
] as const;

export type AdminSectionId = (typeof ADMIN_NAV_ITEMS)[number]["id"];
