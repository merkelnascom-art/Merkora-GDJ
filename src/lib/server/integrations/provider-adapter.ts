export type ProviderVerificationResult = {
  ok: true;
} | {
  ok: false;
  code: string;
  message?: string;
};

export interface ProviderAdapter {
  readonly providerId: string;
  readonly capabilities: readonly string[];
  verify(): Promise<ProviderVerificationResult>;
  revoke(): Promise<void>;
}
