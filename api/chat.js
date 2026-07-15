import { answerPortfolioQuestion } from "./_lib/assistant.js";
import { consumeRateLimit, readJsonBody, rejectMethod, safePublicError, sendJson } from "./_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return rejectMethod(req, res, ["POST"]);

  const rateLimit = consumeRateLimit(req, "chat", 20, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return sendJson(res, 429, { error: "Please wait a moment before sending another message." });
  }

  try {
    const body = await readJsonBody(req);
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const page = typeof body.page === "string" ? body.page.slice(0, 220) : "/v2/";
    const history = Array.isArray(body.history)
      ? body.history.filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      : [];

    if (!message || message.length > 1_200) {
      return sendJson(res, 400, { error: "Please send a message between 1 and 1,200 characters." });
    }

    const answer = await answerPortfolioQuestion({ message, history, page });
    return sendJson(res, 200, answer);
  } catch (error) {
    console.error("Portfolio chat request failed:", error.message);
    return sendJson(res, 502, {
      error: safePublicError(error, "The guide could not answer just now. Please try again or use the contact option."),
    });
  }
}

