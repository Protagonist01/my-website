import { CAL_EVENT_SLUGS, CAL_EVENT_TYPES } from "../_lib/config.js";
import { consumeRateLimit, readJsonBody, rejectMethod, safePublicError, sendJson } from "../_lib/http.js";

const BOOKING_API_VERSION = "2026-02-25";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validTimeZone(value) {
  try {
    Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function readCalError(payload) {
  const error = payload?.error;
  return [
    typeof error === "string" ? error : "",
    error?.message,
    typeof error?.details === "string" ? error.details : error?.details?.message,
    payload?.message,
  ].filter((value) => typeof value === "string" && value.trim()).join(" ");
}

function classifyCalError(responseStatus, payload) {
  const upstream = readCalError(payload).toLowerCase();
  if (upstream.includes("verification") && upstream.includes("email")) {
    return {
      status: 428,
      error: "Please verify your email to finish this booking.",
      verificationRequired: true,
    };
  }
  if (
    responseStatus === 409
    || upstream.includes("already booked")
    || upstream.includes("not available")
    || upstream.includes("no available")
    || upstream.includes("conflict")
  ) {
    return {
      status: 409,
      error: "That time has just become unavailable. Please choose another slot.",
    };
  }
  if (upstream.includes("past")) {
    return { status: 400, error: "That appointment time has passed. Please choose another slot." };
  }
  if (responseStatus === 401 || responseStatus === 403) {
    return { status: 503, error: "Live booking is temporarily unavailable." };
  }
  return { status: 502, error: "Cal.com could not confirm that booking just now. Please try another time." };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return rejectMethod(req, res, ["POST"]);

  const rateLimit = consumeRateLimit(req, "cal-book", 8, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return sendJson(res, 429, { error: "Please wait before trying another booking." });
  }

  try {
    const body = await readJsonBody(req, 12_000);
    const eventTypeSlug = clean(body.eventTypeSlug, 80);
    const name = clean(body.name, 100);
    const email = clean(body.email, 180).toLowerCase();
    const timeZone = clean(body.timeZone, 80);
    const start = clean(body.start, 80);
    const emailVerificationCode = clean(body.emailVerificationCode, 12);
    const eventType = CAL_EVENT_TYPES.find((item) => item.slug === eventTypeSlug);
    const startTime = new Date(start).getTime();

    if (!body.confirmed) return sendJson(res, 400, { error: "Please review and confirm the booking first." });
    if (!CAL_EVENT_SLUGS.has(eventTypeSlug) || !eventType) return sendJson(res, 400, { error: "Choose one of the available meeting types." });
    if (name.length < 2) return sendJson(res, 400, { error: "Please enter your name." });
    if (!EMAIL_PATTERN.test(email)) return sendJson(res, 400, { error: "Please enter a valid email address." });
    if (!validTimeZone(timeZone)) return sendJson(res, 400, { error: "That time zone is not valid." });
    if (Number.isNaN(startTime) || startTime <= Date.now() + 60_000 || startTime > Date.now() + 366 * 86_400_000) {
      return sendJson(res, 400, { error: "Choose a valid future appointment time." });
    }
    if (!process.env.CAL_API_KEY) return sendJson(res, 503, { error: "Live booking is not configured yet.", fallbackUrl: eventType.url });

    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "Content-Type": "application/json",
        "cal-api-version": BOOKING_API_VERSION,
      },
      body: JSON.stringify({
        start: new Date(startTime).toISOString(),
        eventTypeId: eventType.id,
        attendee: {
          name,
          email,
          timeZone,
          language: "en",
        },
        metadata: {
          source: "portfolio-chat",
        },
        lengthInMinutes: eventType.duration,
        location: eventType.location,
        ...(emailVerificationCode ? { emailVerificationCode } : {}),
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.status === "error") {
      console.error("Cal.com booking failed:", response.status, JSON.stringify(payload).slice(0, 700));
      const publicError = classifyCalError(response.status, payload);
      return sendJson(res, publicError.status, publicError);
    }

    const booking = Array.isArray(payload.data) ? payload.data[0] : payload.data;
    return sendJson(res, 201, {
      booking: {
        uid: booking?.uid || null,
        title: booking?.title || eventType.title,
        status: booking?.status || "accepted",
        start: booking?.start || new Date(startTime).toISOString(),
        end: booking?.end || null,
        meetingUrl: booking?.meetingUrl || null,
      },
    });
  } catch (error) {
    console.error("Cal.com booking failed:", error.message);
    return sendJson(res, 502, {
      error: safePublicError(error, "The booking could not be completed just now."),
    });
  }
}
