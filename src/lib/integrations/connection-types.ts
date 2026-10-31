export type IntegrationConnectionStatus =
  | "not_configured"
  | "ready_to_connect"
  | "pending_authorization"
  | "connected"
  | "expired"
  | "error"
  | "revoked";

export type IntegrationConnectionOwner =
  | { type: "organization"; id: string }
  | { type: "user"; id: string }
  | { type: "customer"; id: string };

export interface IntegrationConnectionMetadata {
  providerId: string;
  owner: IntegrationConnectionOwner;
  status: IntegrationConnectionStatus;
  grantedCapabilities: string[];
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt: string | null;
  safeErrorCode: string | null;
}

const CONNECTION_STATUSES: readonly IntegrationConnectionStatus[] = [
  "not_configured",
  "ready_to_connect",
  "pending_authorization",
  "connected",
  "expired",
  "error",
  "revoked",
];

export function isIntegrationConnectionStatus(
  value: unknown,
): value is IntegrationConnectionStatus {
  return (
    typeof value === "string" &&
    CONNECTION_STATUSES.includes(value as IntegrationConnectionStatus)
  );
}

export function canUseIntegrationConnection(
  metadata: Pick<IntegrationConnectionMetadata, "status">,
): boolean {
  return metadata.status === "connected";
}
