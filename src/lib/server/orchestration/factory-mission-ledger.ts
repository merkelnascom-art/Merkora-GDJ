export type FactoryMissionState =
  | "ready"
  | "claimed"
  | "running"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

export type FactoryMissionLease = {
  workerId: string;
  expiresAt: string;
};

export type FactoryMissionAttempt = {
  attempt: number;
  workerId: string;
  claimedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  outcome: "active" | "completed" | "failed" | "blocked" | "lease_expired";
  failureReason?: string;
};

export type FactoryMissionRecord = {
  schemaVersion: 1;
  missionId: string;
  projectId: string;
  workflowId: string;
  agentId: string;
  state: FactoryMissionState;
  attempt: number;
  maxAttempts: number;
  idempotencyKey: string;
  lease: FactoryMissionLease | null;
  result: { summary: string; artifactRefs?: string[] } | null;
  verification: { passed: boolean; summary: string } | null;
  failure: { reason: string; occurredAt: string } | null;
  blockReason?: string | null;
  attemptHistory: FactoryMissionAttempt[];
  updatedAt: string;
};

export type FactoryMissionCommand =
  | { type: "claim"; workerId: string; now: string; leaseDurationMs: number }
  | { type: "start"; workerId: string; now: string }
  | { type: "heartbeat"; workerId: string; now: string; leaseDurationMs: number }
  | {
      type: "complete";
      workerId: string;
      now: string;
      result: FactoryMissionRecord["result"];
      verification: FactoryMissionRecord["verification"];
    }
  | { type: "fail"; workerId: string; now: string; reason: string }
  | { type: "block"; workerId: string; now: string; reason: string }
  | { type: "unblock"; approved: boolean; now: string };

function timestamp(value: string): number {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error("Horodatage invalide.");
  return parsed;
}

function validateLeaseDuration(duration: number): void {
  if (!Number.isInteger(duration) || duration < 1_000 || duration > 15 * 60_000) {
    throw new Error("Durée de bail invalide.");
  }
}

function requireLeaseOwner(
  mission: FactoryMissionRecord,
  workerId: string,
  now: string,
): FactoryMissionLease {
  const nowMs = timestamp(now);
  if (!mission.lease || mission.lease.workerId !== workerId || timestamp(mission.lease.expiresAt) <= nowMs) {
    throw new Error("Le worker ne détient pas le bail de cette mission.");
  }
  return mission.lease;
}

function updateCurrentAttempt(
  history: FactoryMissionAttempt[],
  patch: Partial<FactoryMissionAttempt>,
): FactoryMissionAttempt[] {
  if (!history.length) return history;
  return history.map((item, index) => index === history.length - 1 ? { ...item, ...patch } : item);
}

/**
 * Pure state transition for the durable mission ledger.
 * Persistence must apply this result with an atomic compare-and-swap on the
 * stored state/version; this function alone does not provide distributed locks.
 */
export function transitionFactoryMission(
  mission: FactoryMissionRecord,
  command: FactoryMissionCommand,
): FactoryMissionRecord {
  const nowMs = timestamp(command.now);
  if (mission.state === "completed" || mission.state === "cancelled") {
    throw new Error("Une mission terminée ou annulée est immuable.");
  }

  if (command.type === "claim") {
    if (!command.workerId.trim()) throw new Error("Identifiant de worker obligatoire.");
    validateLeaseDuration(command.leaseDurationMs);
    const hasLiveLease = mission.lease && timestamp(mission.lease.expiresAt) > nowMs;
    if (hasLiveLease) throw new Error("Cette mission possède déjà un bail actif.");
    if (mission.state !== "ready" && mission.state !== "claimed" && mission.state !== "running") {
      throw new Error("Cette mission ne peut pas être réclamée dans son état actuel.");
    }
    if (mission.attempt >= mission.maxAttempts) {
      throw new Error("La limite de tentatives de cette mission est atteinte.");
    }

    const previousAttemptExpired = mission.lease !== null;
    const history = previousAttemptExpired
      ? updateCurrentAttempt(mission.attemptHistory, {
          finishedAt: command.now,
          outcome: "lease_expired",
        })
      : mission.attemptHistory;

    return {
      ...mission,
      state: "claimed",
      attempt: mission.attempt + 1,
      lease: {
        workerId: command.workerId,
        expiresAt: new Date(nowMs + command.leaseDurationMs).toISOString(),
      },
      attemptHistory: [
        ...history,
        {
          attempt: mission.attempt + 1,
          workerId: command.workerId,
          claimedAt: command.now,
          startedAt: null,
          finishedAt: null,
          outcome: "active",
        },
      ],
      updatedAt: command.now,
    };
  }

  if (command.type === "unblock") {
    if (mission.state !== "blocked") throw new Error("Seule une mission bloquée peut être débloquée.");
    if (!command.approved) return mission;
    return { ...mission, state: "ready", lease: null, blockReason: null, updatedAt: command.now };
  }

  if (command.type === "start") {
    requireLeaseOwner(mission, command.workerId, command.now);
    if (mission.state !== "claimed") throw new Error("Seule une mission réclamée peut démarrer.");
    return {
      ...mission,
      state: "running",
      attemptHistory: updateCurrentAttempt(mission.attemptHistory, { startedAt: command.now }),
      updatedAt: command.now,
    };
  }

  if (command.type === "heartbeat") {
    const lease = requireLeaseOwner(mission, command.workerId, command.now);
    validateLeaseDuration(command.leaseDurationMs);
    if (mission.state !== "claimed" && mission.state !== "running") {
      throw new Error("Cette mission ne peut pas renouveler son bail.");
    }
    return {
      ...mission,
      lease: {
        workerId: lease.workerId,
        expiresAt: new Date(nowMs + command.leaseDurationMs).toISOString(),
      },
      updatedAt: command.now,
    };
  }

  if (command.type === "complete") {
    requireLeaseOwner(mission, command.workerId, command.now);
    if (mission.state !== "running") throw new Error("Seule une mission en cours peut être terminée.");
    if (!command.result || !command.result.summary.trim()) {
      throw new Error("Un résultat vérifiable est obligatoire.");
    }
    if (!command.verification?.passed || !command.verification.summary.trim()) {
      throw new Error("La vérification doit réussir avant de terminer la mission.");
    }
    return {
      ...mission,
      state: "completed",
      result: command.result,
      verification: command.verification,
      lease: null,
      failure: null,
      attemptHistory: updateCurrentAttempt(mission.attemptHistory, {
        finishedAt: command.now,
        outcome: "completed",
      }),
      updatedAt: command.now,
    };
  }

  if (command.type === "fail") {
    requireLeaseOwner(mission, command.workerId, command.now);
    if (mission.state !== "running" && mission.state !== "claimed") {
      throw new Error("Seule une mission réclamée ou en cours peut échouer.");
    }
    if (!command.reason.trim()) throw new Error("La cause de l'échec est obligatoire.");
    return {
      ...mission,
      state: mission.attempt < mission.maxAttempts ? "ready" : "failed",
      lease: null,
      failure: { reason: command.reason, occurredAt: command.now },
      attemptHistory: updateCurrentAttempt(mission.attemptHistory, {
        finishedAt: command.now,
        outcome: "failed",
        failureReason: command.reason,
      }),
      updatedAt: command.now,
    };
  }

  if (command.type === "block") {
    requireLeaseOwner(mission, command.workerId, command.now);
    if (mission.state !== "running" && mission.state !== "claimed") {
      throw new Error("Seule une mission réclamée ou en cours peut être bloquée.");
    }
    if (!command.reason.trim()) throw new Error("Le motif du blocage est obligatoire.");
    return {
      ...mission,
      state: "blocked",
      lease: null,
      blockReason: command.reason,
      attemptHistory: updateCurrentAttempt(mission.attemptHistory, {
        finishedAt: command.now,
        outcome: "blocked",
      }),
      updatedAt: command.now,
    };
  }

  return mission;
}
