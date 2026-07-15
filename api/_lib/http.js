const rateLimitBuckets = new Map();

export function applyApiHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
}

export function sendJson(res, status, payload) {
  applyApiHeaders(res);
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req, maxBytes = 24_000) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  const contentLength = Number(req.headers?.["content-length"] || 0);
  if (contentLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function getQuery(req) {
  if (req.query && typeof req.query === "object") return req.query;
  const url = new URL(req.url || "/", "http://localhost");
  return Object.fromEntries(url.searchParams.entries());
}

export function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

export function consumeRateLimit(req, namespace, limit, windowMs) {
  const now = Date.now();
  const key = `${namespace}:${getClientIp(req)}`;
  const active = (rateLimitBuckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - active[0])) / 1000));
    return { allowed: false, retryAfter };
  }
  active.push(now);
  rateLimitBuckets.set(key, active);

  if (rateLimitBuckets.size > 2_000) {
    for (const [bucketKey, timestamps] of rateLimitBuckets) {
      if (!timestamps.some((timestamp) => now - timestamp < windowMs)) rateLimitBuckets.delete(bucketKey);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

export function rejectMethod(req, res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  sendJson(res, 405, { error: "Method not allowed." });
}

export function safePublicError(error, fallback) {
  if (error?.message === "PAYLOAD_TOO_LARGE") return "That request is too large.";
  if (error instanceof SyntaxError) return "The request body is not valid JSON.";
  return fallback;
}

