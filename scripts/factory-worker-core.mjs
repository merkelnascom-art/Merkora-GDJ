export function readFactoryWorkerConfig(env) {
  const supabaseUrl = typeof env.SUPABASE_URL === "string" ? env.SUPABASE_URL.replace(/\/$/, "") : "";
  const serviceKey = typeof env.SUPABASE_SERVICE_ROLE_KEY === "string"
    ? env.SUPABASE_SERVICE_ROLE_KEY.trim()
    : "";

  let parsedUrl;
  try { parsedUrl = new URL(supabaseUrl); } catch { parsedUrl = null; }
  if (!parsedUrl || !["https:", "http:"].includes(parsedUrl.protocol)) {
    throw new Error("SUPABASE_URL must be a valid HTTP(S) URL.");
  }
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");

  const requestedInterval = Number(env.MERKORA_WORKER_POLL_MS || 30_000);
  const pollIntervalMs = Number.isFinite(requestedInterval)
    ? Math.max(10_000, Math.min(300_000, Math.floor(requestedInterval)))
    : 30_000;

  return { supabaseUrl, serviceKey, pollIntervalMs };
}

export function summarizeFactoryQueue(jobs) {
  if (!Array.isArray(jobs)) throw new Error("Invalid factory queue response.");
  const statuses = {};
  for (const job of jobs) {
    const status = typeof job?.status === "string" ? job.status : "unknown";
    statuses[status] = (statuses[status] || 0) + 1;
  }
  return { activeJobs: jobs.length, statuses };
}
