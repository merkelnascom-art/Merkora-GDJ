import { describe, expect, it } from "vitest";
import {
  transitionFactoryMission,
  type FactoryMissionRecord,
} from "./factory-mission-ledger";

const baseMission = (overrides: Partial<FactoryMissionRecord> = {}): FactoryMissionRecord => ({
  schemaVersion: 1,
  missionId: "mission-analysis",
  projectId: "project-1",
  workflowId: "workflow-1",
  agentId: "analyste-metier",
  state: "ready",
  attempt: 0,
  maxAttempts: 3,
  idempotencyKey: "project-1:workflow-1:mission-analysis",
  lease: null,
  result: null,
  verification: null,
  failure: null,
  attemptHistory: [],
  updatedAt: "2026-11-14T10:00:00.000Z",
  ...overrides,
});

describe("durable factory mission ledger transitions", () => {
  it("claims a ready mission with a bounded lease and increments its attempt", () => {
    const next = transitionFactoryMission(baseMission(), {
      type: "claim",
      workerId: "worker-a",
      now: "2026-11-14T10:01:00.000Z",
      leaseDurationMs: 60_000,
    });

    expect(next.state).toBe("claimed");
    expect(next.attempt).toBe(1);
    expect(next.lease).toEqual({
      workerId: "worker-a",
      expiresAt: "2026-11-14T10:02:00.000Z",
    });
  });

  it("rejects a second worker while a live lease is held", () => {
    const claimed = baseMission({
      state: "claimed",
      attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });

    expect(() => transitionFactoryMission(claimed, {
      type: "claim",
      workerId: "worker-b",
      now: "2026-11-14T10:01:30.000Z",
      leaseDurationMs: 60_000,
    })).toThrow("Cette mission possède déjà un bail actif.");
  });

  it("allows reclaim after lease expiry without losing the attempt history", () => {
    const expired = baseMission({
      state: "claimed",
      attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });
    const next = transitionFactoryMission(expired, {
      type: "claim",
      workerId: "worker-b",
      now: "2026-11-14T10:03:00.000Z",
      leaseDurationMs: 60_000,
    });

    expect(next.state).toBe("claimed");
    expect(next.attempt).toBe(2);
    expect(next.lease?.workerId).toBe("worker-b");
  });

  it("requires the lease owner to start, heartbeat and complete work", () => {
    const claimed = baseMission({
      state: "claimed",
      attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });
    expect(() => transitionFactoryMission(claimed, {
      type: "start", workerId: "worker-b", now: "2026-11-14T10:01:10.000Z",
    })).toThrow("Le worker ne détient pas le bail de cette mission.");

    const running = transitionFactoryMission(claimed, {
      type: "start", workerId: "worker-a", now: "2026-11-14T10:01:10.000Z",
    });
    expect(running.state).toBe("running");
    expect(() => transitionFactoryMission(running, {
      type: "heartbeat", workerId: "worker-b", now: "2026-11-14T10:01:20.000Z", leaseDurationMs: 60_000,
    })).toThrow("Le worker ne détient pas le bail de cette mission.");
  });

  it("requires a result and successful verification before completion", () => {
    const running = baseMission({
      state: "running",
      attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });
    expect(() => transitionFactoryMission(running, {
      type: "complete", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z",
      result: null, verification: { passed: true, summary: "ok" },
    })).toThrow("Un résultat vérifiable est obligatoire.");
    expect(() => transitionFactoryMission(running, {
      type: "complete", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z",
      result: { summary: "done" }, verification: { passed: false, summary: "failed" },
    })).toThrow("La vérification doit réussir avant de terminer la mission.");

    const completed = transitionFactoryMission(running, {
      type: "complete", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z",
      result: { summary: "Analyse terminée", artifactRefs: ["private://artifact/1"] },
      verification: { passed: true, summary: "Contrôles réussis" },
    });
    expect(completed.state).toBe("completed");
    expect(completed.lease).toBeNull();
  });

  it("retries a failed attempt only within the configured attempt limit", () => {
    const running = baseMission({
      state: "running", attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });
    const retry = transitionFactoryMission(running, {
      type: "fail", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z", reason: "provider_timeout",
    });
    expect(retry.state).toBe("ready");
    expect(retry.failure?.reason).toBe("provider_timeout");
    expect(retry.lease).toBeNull();

    const exhausted = baseMission({
      state: "running", attempt: 3,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
    });
    expect(transitionFactoryMission(exhausted, {
      type: "fail", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z", reason: "fatal",
    }).state).toBe("failed");
  });

  it("keeps append-only attempt history across failures and lease expiry", () => {
    const firstClaim = transitionFactoryMission(baseMission(), {
      type: "claim", workerId: "worker-a", now: "2026-11-14T10:01:00.000Z", leaseDurationMs: 60_000,
    });
    const firstRunning = transitionFactoryMission(firstClaim, {
      type: "start", workerId: "worker-a", now: "2026-11-14T10:01:10.000Z",
    });
    const firstFailed = transitionFactoryMission(firstRunning, {
      type: "fail", workerId: "worker-a", now: "2026-11-14T10:01:30.000Z", reason: "provider_timeout",
    });
    expect(firstFailed.attemptHistory).toHaveLength(1);
    expect(firstFailed.attemptHistory[0]).toMatchObject({
      attempt: 1, workerId: "worker-a", outcome: "failed", failureReason: "provider_timeout",
    });

    const secondClaim = transitionFactoryMission(firstFailed, {
      type: "claim", workerId: "worker-b", now: "2026-11-14T10:02:00.000Z", leaseDurationMs: 60_000,
    });
    const secondRunning = transitionFactoryMission(secondClaim, {
      type: "start", workerId: "worker-b", now: "2026-11-14T10:02:10.000Z",
    });
    const completed = transitionFactoryMission(secondRunning, {
      type: "complete", workerId: "worker-b", now: "2026-11-14T10:02:30.000Z",
      result: { summary: "Terminé" }, verification: { passed: true, summary: "Vérifié" },
    });
    expect(completed.attemptHistory).toHaveLength(2);
    expect(completed.attemptHistory[0].outcome).toBe("failed");
    expect(completed.attemptHistory[1]).toMatchObject({
      attempt: 2, workerId: "worker-b", outcome: "completed",
    });
  });

  it("records an expired lease before assigning a new worker", () => {
    const expired = baseMission({
      state: "running", attempt: 1,
      lease: { workerId: "worker-a", expiresAt: "2026-11-14T10:02:00.000Z" },
      attemptHistory: [{
        attempt: 1, workerId: "worker-a", claimedAt: "2026-11-14T10:01:00.000Z",
        startedAt: "2026-11-14T10:01:10.000Z", finishedAt: null, outcome: "active",
      }],
    });
    const reclaimed = transitionFactoryMission(expired, {
      type: "claim", workerId: "worker-b", now: "2026-11-14T10:03:00.000Z", leaseDurationMs: 60_000,
    });
    expect(reclaimed.attemptHistory[0]).toMatchObject({
      outcome: "lease_expired", finishedAt: "2026-11-14T10:03:00.000Z",
    });
    expect(reclaimed.attemptHistory[1]).toMatchObject({
      attempt: 2, workerId: "worker-b", outcome: "active",
    });
  });

  it("supports an explicit worker-requested block pending human approval", () => {
    const claimed = transitionFactoryMission(baseMission(), {
      type: "claim", workerId: "worker-a", now: "2026-11-14T10:01:00.000Z", leaseDurationMs: 60_000,
    });
    const running = transitionFactoryMission(claimed, {
      type: "start", workerId: "worker-a", now: "2026-11-14T10:01:10.000Z",
    });
    const blocked = transitionFactoryMission(running, {
      type: "block", workerId: "worker-a", now: "2026-11-14T10:01:20.000Z", reason: "needs_client_validation",
    });
    expect(blocked.state).toBe("blocked");
    expect(blocked.lease).toBeNull();
    expect(blocked.blockReason).toBe("needs_client_validation");
    expect(blocked.attemptHistory[0].outcome).toBe("blocked");
  });

  it("requires explicit human approval for a blocked mission to resume", () => {
    const blocked = baseMission({ state: "blocked" });
    expect(transitionFactoryMission(blocked, {
      type: "unblock", approved: false, now: "2026-11-14T10:01:00.000Z",
    })).toEqual(blocked);
    expect(transitionFactoryMission(blocked, {
      type: "unblock", approved: true, now: "2026-11-14T10:01:00.000Z",
    }).state).toBe("ready");
  });

  it("makes completed and cancelled missions immutable", () => {
    const completed = baseMission({ state: "completed" });
    expect(() => transitionFactoryMission(completed, {
      type: "claim", workerId: "worker-a", now: "2026-11-14T10:01:00.000Z", leaseDurationMs: 60_000,
    })).toThrow("Une mission terminée ou annulée est immuable.");
    expect(() => transitionFactoryMission(baseMission({ state: "cancelled" }), {
      type: "unblock", approved: true, now: "2026-11-14T10:01:00.000Z",
    })).toThrow("Une mission terminée ou annulée est immuable.");
  });

  it("rejects invalid timestamps and lease durations", () => {
    expect(() => transitionFactoryMission(baseMission(), {
      type: "claim", workerId: "worker-a", now: "not-a-date", leaseDurationMs: 60_000,
    })).toThrow("Horodatage invalide.");
    expect(() => transitionFactoryMission(baseMission(), {
      type: "claim", workerId: "worker-a", now: "2026-11-14T10:01:00.000Z", leaseDurationMs: 0,
    })).toThrow("Durée de bail invalide.");
  });
});
