export type MerKoraMcpTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; minLength?: number; maxLength?: number }>;
    required?: string[];
    additionalProperties: false;
  };
};

export const MERKORA_MCP_TOOLS: readonly MerKoraMcpTool[] = [
  {
    name: "merkora_get_profile",
    description: "Retourne le profil de l'utilisateur authentifié dans MerKora.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "merkora_list_projects",
    description: "Liste les projets appartenant à l'utilisateur authentifié (lecture seule).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "merkora_get_project",
    description: "Lit un projet appartenant à l'utilisateur authentifié (lecture seule).",
    inputSchema: {
      type: "object",
      properties: { project_id: { type: "string", minLength: 1, maxLength: 160 } },
      required: ["project_id"],
      additionalProperties: false,
    },
  },
];
