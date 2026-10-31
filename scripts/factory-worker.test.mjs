import { describe, expect, it } from "vitest";
import { readFactoryWorkerConfig, summarizeFactoryQueue } from "./factory-worker-core.mjs";

describe("factory worker bootstrap", () => {
  it("requires a valid Supabase URL and server-side key", () => {
    expect(() => readFactoryWorkerConfig({})).toThrow("SUPABASE_URL");
    expect(() => readFactoryWorkerConfig({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "server-secret",
    })).not.toThrow();
  });

  it("clamps polling to a safe bounded interval", () => {
    expect(readFactoryWorkerConfig({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "server-secret",
      MERKORA_WORKER_POLL_MS: "1",
    }).pollIntervalMs).toBe(10_000);
    expect(readFactoryWorkerConfig({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "server-secret",
      MERKORA_WORKER_POLL_MS: "999999",
    }).pollIntervalMs).toBe(300_000);
  });

  it("summarizes only status counts and rejects malformed queue data", () => {
    expect(summarizeFactoryQueue([{ status: "queued" }, { status: "queued" }, { status: "building" }]))
      .toEqual({ activeJobs: 3, statuses: { queued: 2, building: 1 } });
    expect(() => summarizeFactoryQueue({})).toThrow("Invalid factory queue response.");
  });
});
