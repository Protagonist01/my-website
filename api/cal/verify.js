import { consumeRateLimit, readJsonBody, rejectMethod, safePublicError, sendJson } from "../_lib/http.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAL_ATOMS_URL = "https://api.cal.com/v2/atoms/verification/email";

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function calError(payload, fallback) {
  const message = payload?.error?.message || payload?.message;
  return typeof message === "string" && message.toLowerCase().includes("invalid")
    ? "That verification code is not valid. Please check it and try again."
    : fallback;
}

async function calRequest(path, options = {}) {
  const response = await fetch(`${CAL_ATOMS_URL}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return rejectMethod(req, res, ["POST"]);

  try {
    const body = await readJsonBody(req, 4_000);
    const action = clean(body.action, 12);
    const email = clean(body.email, 180).toLowerCase();
    const name = clean(body.name, 100);
    const code = clean(body.code, 12);

    if (!EMAIL_PATTERN.test(email)) return sendJson(res, 400, { error: "Please enter a valid email address." });

    const limit = action === "send" ? 3 : action === "verify" ? 8 : 30;
    const rateLimit = consumeRateLimit(req, `cal-email-${action || "unknown"}`, limit, 60_000);
    if (!rateLimit.allowed) {
      res.setHeader("Retry-After", String(rateLimit.retryAfter));
      return sendJson(res, 429, { error: "Please wait a moment before trying again." });
    }

    if (action === "check") {
      const query = new URLSearchParams({ email });
      const { response, payload } = await calRequest(`check?${query}`, { method: "GET" });
      if (!response.ok || payload.status === "error") {
        return sendJson(res, 502, { error: "Email verification could not be checked just now." });
      }
      return sendJson(res, 200, { required: Boolean(payload.data) });
    }

    if (action === "send") {
      const { response, payload } = await calRequest("send-code", {
        method: "POST",
        body: JSON.stringify({ email, username: name || undefined, language: "en", isVerifyingEmail: true }),
      });
      if (!response.ok || payload.status === "error") {
        return sendJson(res, 502, { error: "The verification email could not be sent. Please try again." });
      }
      return sendJson(res, 200, { sent: payload.data?.sent !== false });
    }

    if (action === "verify") {
      if (!/^\d{6}$/.test(code)) return sendJson(res, 400, { error: "Enter the six-digit code from your email." });
      const { response, payload } = await calRequest("verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      if (!response.ok || payload.status === "error" || payload.data?.verified === false) {
        return sendJson(res, 400, { error: calError(payload, "That code could not be verified. Please try again.") });
      }
      return sendJson(res, 200, { verified: true });
    }

    return sendJson(res, 400, { error: "Choose a valid verification action." });
  } catch (error) {
    console.error("Cal.com email verification failed:", error.message);
    return sendJson(res, 502, { error: safePublicError(error, "Email verification is temporarily unavailable.") });
  }
}
