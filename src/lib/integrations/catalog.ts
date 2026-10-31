export type IntegrationCategory = "development" | "infrastructure" | "ai" | "design" | "video" | "builder";
export type IntegrationAuthMethod = "oauth" | "api_key" | "manual" | "external_link" | "none";

export interface IntegrationDefinition {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  authMethod: IntegrationAuthMethod;
  capabilities: readonly string[];
  initialStatus: "not_configured";
  verificationRequired: boolean;
  connectionNotes: string;
}

const definitions: readonly IntegrationDefinition[] = [
  {
    id: "github",
    name: "GitHub",
    category: "development",
    description: "Code source, branches, pull requests and automated checks.",
    authMethod: "oauth",
    capabilities: ["repositories.read", "branches.read", "pull_requests.manage", "checks.read"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "Connect with narrowly scoped repository permissions; never treat repository access as deployment approval.",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "infrastructure",
    description: "Preview deployments, production hosting and deployment status.",
    authMethod: "oauth",
    capabilities: ["deployments.read", "previews.read", "deployments.create"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "Production deployments require a separate explicit approval.",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "infrastructure",
    description: "Application database, authentication, storage and backend services.",
    authMethod: "api_key",
    capabilities: ["projects.read", "database.read", "auth.manage"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "Use project-scoped credentials; never request or store a service-role key in the browser.",
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "ai",
    description: "AI models for conversation, analysis and assistance.",
    authMethod: "api_key",
    capabilities: ["models.generate", "responses.create"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "API billing is separate from a ChatGPT subscription; require an explicit budget before activation.",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "ai",
    description: "Independent AI model provider for analysis and review.",
    authMethod: "api_key",
    capabilities: ["messages.create"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "API billing is separate from a Claude consumer plan; require an explicit budget before activation.",
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    category: "ai",
    description: "Additional AI model provider for cross-checking and generation.",
    authMethod: "api_key",
    capabilities: ["generate_content"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "Confirm the selected Google AI product, quotas and billing before enabling calls.",
  },
  {
    id: "figma",
    name: "Figma",
    category: "design",
    description: "Design files, components and visual collaboration.",
    authMethod: "oauth",
    capabilities: ["files.read", "comments.read"],
    initialStatus: "not_configured",
    verificationRequired: false,
    connectionNotes: "Request only the scopes needed for the selected workflow.",
  },
  {
    id: "runway",
    name: "Runway",
    category: "video",
    description: "AI-assisted video and media generation.",
    authMethod: "api_key",
    capabilities: ["media.generate"],
    initialStatus: "not_configured",
    verificationRequired: true,
    connectionNotes: "Verify current official API access, plan eligibility, usage limits and pricing before implementation.",
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: "video",
    description: "AI avatar and presenter video workflows.",
    authMethod: "api_key",
    capabilities: ["avatar_video.generate"],
    initialStatus: "not_configured",
    verificationRequired: true,
    connectionNotes: "Verify official API availability, account permissions and pricing before implementation.",
  },
  {
    id: "capcut",
    name: "CapCut",
    category: "video",
    description: "Video editing and final assembly.",
    authMethod: "manual",
    capabilities: ["editing.manual"],
    initialStatus: "not_configured",
    verificationRequired: true,
    connectionNotes: "Treat as a manual handoff unless an officially supported integration is verified; do not automate its interface.",
  },
  {
    id: "codunk",
    name: "Codunk",
    category: "builder",
    description: "External application builder used during product prototyping.",
    authMethod: "external_link",
    capabilities: ["project.handoff.manual"],
    initialStatus: "not_configured",
    verificationRequired: true,
    connectionNotes: "No public API or export contract is assumed. Confirm official documentation and terms before any automation.",
  },
] as const;

export function listIntegrationCatalog(): readonly IntegrationDefinition[] {
  return definitions;
}

export function getIntegrationDefinition(id: string): IntegrationDefinition | null {
  return definitions.find((definition) => definition.id === id) ?? null;
}
