const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`[merkora-worker] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const intervalMs = Math.max(10_000, Number(process.env.MERKORA_WORKER_POLL_MS || 30_000));
const controller = new AbortController();
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
      signal: AbortSignal.timeout(15_000),
    },
  );

  if (!response.ok) {
    const safeBody = (await response.text()).slice(0, 300);
    throw new Error(`Supabase queue read failed (${response.status}): ${safeBody}`);
  }

  const jobs = await response.json();
  if (!Array.isArray(jobs)) throw new Error("Supabase returned an invalid queue response.");

  const counts = jobs.reduce((result, job) => {
    const status = typeof job?.status === "string" ? job.status : "unknown";
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});

  console.info("[merkora-worker] Queue inspected", {
    activeJobs: jobs.length,
    statuses: counts,
    mode: "read_only_observer",
    at: new Date().toISOString(),
  });
}

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.info(`[merkora-worker] Received ${signal}; stopping after current poll.`);
  controller.abort();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

console.info("[merkora-worker] Started in read-only observer mode.");
while (!stopping) {
  try {
    await inspectQueue();
  } catch (error) {
    console.error("[merkora-worker] Poll failed:", error instanceof Error ? error.message : "unknown error");
  }
  if (!stopping) await sleep(intervalMs);
}
console.info("[merkora-worker] Stopped cleanly.");
