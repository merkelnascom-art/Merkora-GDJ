import { readFactoryWorkerConfig, summarizeFactoryQueue } from "./factory-worker-core.mjs";

let config;
try {
  config = readFactoryWorkerConfig(process.env);
} catch (error) {
  console.error("[merkora-worker] Invalid configuration:", error instanceof Error ? error.message : "unknown error");
  process.exit(1);
}

const { supabaseUrl, serviceKey, pollIntervalMs } = config;
const shutdownController = new AbortController();
let stopping = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function inspectQueue() {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/project_factory_jobs?select=id,status&status=in.(queued,building,testing,repairing)&order=created_at.asc&limit=50`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.any([shutdownController.signal, AbortSignal.timeout(15_000)]),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase queue read failed with HTTP ${response.status}.`);
  }

  const queue = summarizeFactoryQueue(await response.json());
  console.info("[merkora-worker] Queue inspected", {
    ...queue,
    mode: "read_only_observer",
    at: new Date().toISOString(),
  });
}

function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.info(`[merkora-worker] Received ${signal}; stopping safely.`);
  shutdownController.abort();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

console.info("[merkora-worker] Started in read-only observer mode.");
while (!stopping) {
  try {
    await inspectQueue();
  } catch (error) {
    if (!stopping) {
      console.error("[merkora-worker] Poll failed:", error instanceof Error ? error.message : "unknown error");
    }
  }
  if (!stopping) await sleep(pollIntervalMs);
}
console.info("[merkora-worker] Stopped cleanly.");
