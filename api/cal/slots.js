import { CAL_EVENT_SLUGS, CAL_EVENT_TYPES, CAL_USERNAME } from "../_lib/config.js";
import { consumeRateLimit, getQuery, rejectMethod, sendJson } from "../_lib/http.js";

const SLOTS_API_VERSION = "2024-09-04";

function isoDate(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function validTimeZone(value) {
  if (!value || value.length > 80) return false;
  try {
    Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function flattenSlots(data) {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data)
    .flatMap(([date, entries]) => (Array.isArray(entries) ? entries : []).map((entry) => ({
      date,
      start: typeof entry === "string" ? entry : entry?.start,
      end: typeof entry === "object" ? entry?.end || null : null,
    })))
    .filter((slot) => slot.start && !Number.isNaN(new Date(slot.start).getTime()) && new Date(slot.start).getTime() > Date.now())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method !== "GET") return rejectMethod(req, res, ["GET"]);

  const rateLimit = consumeRateLimit(req, "cal-slots", 30, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return sendJson(res, 429, { error: "Please wait a moment before checking availability again." });
  }

  const query = getQuery(req);
  const eventTypeSlug = typeof query.eventTypeSlug === "string" ? query.eventTypeSlug : "";
  const timeZone = typeof query.timeZone === "string" ? query.timeZone : "UTC";
  if (!CAL_EVENT_SLUGS.has(eventTypeSlug)) return sendJson(res, 400, { error: "Choose one of the available meeting types." });
  if (!validTimeZone(timeZone)) return sendJson(res, 400, { error: "That time zone is not valid." });
  if (!process.env.CAL_API_KEY) return sendJson(res, 503, { error: "Live availability is not configured yet." });

  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 14 * 86_400_000);
  const start = isoDate(query.start, now.toISOString());
  const end = isoDate(query.end, defaultEnd.toISOString());
  if (!start || !end) return sendJson(res, 400, { error: "The requested date range is not valid." });

  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (endMs <= startMs || endMs - startMs > 31 * 86_400_000) {
    return sendJson(res, 400, { error: "Availability can be checked for up to 31 days at a time." });
  }

  const params = new URLSearchParams({
    eventTypeSlug,
    username: CAL_USERNAME,
    start,
    end,
    timeZone,
    format: "range",
  });

  try {
    const response = await fetch(`https://api.cal.com/v2/slots?${params}`, {
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "cal-api-version": SLOTS_API_VERSION,
      },
      signal: AbortSignal.timeout(15_000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.status === "error") {
      console.error("Cal.com slot request failed:", response.status, JSON.stringify(payload).slice(0, 500));
      return sendJson(res, 502, { error: "Live availability could not be loaded. You can still open the Cal.com booking page." });
    }

    const eventType = CAL_EVENT_TYPES.find((item) => item.slug === eventTypeSlug);
    return sendJson(res, 200, {
      eventType,
      timeZone,
      slots: flattenSlots(payload.data),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cal.com slot request failed:", error.message);
    return sendJson(res, 502, { error: "Live availability could not be loaded. You can still open the Cal.com booking page." });
  }
}

