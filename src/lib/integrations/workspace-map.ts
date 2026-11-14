export const MERKORA_WORKSPACES = [
  "client",
  "admin",
  "assistant",
  "studio_visuel",
  "fabrique",
  "creation_media",
] as const;

export type MerKoraWorkspace = (typeof MERKORA_WORKSPACES)[number];

export const WORKSPACE_LABELS: Record<MerKoraWorkspace, string> = {
  client: "Espace client",
  admin: "Administration",
  assistant: "Copilote IA",
  studio_visuel: "Studio visuel",
  fabrique: "Fabrique de projets",
  creation_media: "Création média",
};

const PROVIDER_WORKSPACES: Record<string, readonly MerKoraWorkspace[]> = {
  github: ["admin", "fabrique"],
  vercel: ["admin", "fabrique"],
  supabase: ["admin", "fabrique"],
  netlify: ["admin", "fabrique"],
  render: ["admin", "fabrique"],
  openai: ["assistant", "fabrique"],
  anthropic: ["assistant", "fabrique"],
  "google-gemini": ["assistant", "fabrique"],
  figma: ["studio_visuel", "fabrique"],
  magicpath: ["studio_visuel", "fabrique"],
  runway: ["creation_media"],
  heygen: ["creation_media"],
  capcut: ["creation_media"],
  codunk: ["fabrique"],
  "website-publisher": ["fabrique"],
  "chatgpt-mcp": ["client", "assistant"],
  "claude-mcp": ["client", "assistant"],
};

export function getProviderWorkspaces(providerId: string): readonly MerKoraWorkspace[] {
  return PROVIDER_WORKSPACES[providerId] ?? [];
}

export function listWorkspaceProviders(workspace: MerKoraWorkspace): string[] {
  return Object.entries(PROVIDER_WORKSPACES)
    .filter(([, workspaces]) => workspaces.includes(workspace))
    .map(([providerId]) => providerId);
}
