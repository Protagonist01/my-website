"""Validation and server-only persistence for portfolio chat feedback."""

from __future__ import annotations

import json
import sys
import time
from typing import Any
from uuid import UUID

from api._lib.referrals import ReferralError, SupabaseGateway

MAX_BODY_BYTES = 8 * 1024
FEEDBACK_LIMIT = 20
RATE_WINDOW_SECONDS = 60
RATE_LIMITS: dict[str, list[float]] = {}
ALLOWED_RATINGS = {"positive", "negative"}
ALLOWED_TRIGGERS = {"chat_close", "booking_complete", "inquiry_complete"}


class ChatFeedbackError(RuntimeError):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _client_ip(headers: dict[str, str]) -> str:
    forwarded = headers.get("x-forwarded-for", "local")
    return forwarded.split(",", 1)[0].strip() or "local"


def _consume_rate_limit(client: str, now: float | None = None) -> None:
    now = time.time() if now is None else now
    recent = [timestamp for timestamp in RATE_LIMITS.get(client, []) if timestamp > now - RATE_WINDOW_SECONDS]
    if len(recent) >= FEEDBACK_LIMIT:
        raise ChatFeedbackError("Please wait before sending more feedback.", 429)
    recent.append(now)
    RATE_LIMITS[client] = recent


def _parse_json(raw_body: bytes) -> dict[str, Any]:
    if len(raw_body) > MAX_BODY_BYTES:
        raise ChatFeedbackError("Feedback is too large.", 413)
    try:
        body = json.loads(raw_body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ChatFeedbackError("Please send valid feedback data.") from error
    if not isinstance(body, dict):
        raise ChatFeedbackError("Feedback data must be an object.")
    return body


def _bounded_count(value: Any, label: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= 100:
        raise ChatFeedbackError(f"{label} is not valid.")
    return value


def _validated_feedback(body: dict[str, Any]) -> dict[str, Any]:
    try:
        conversation_id = str(UUID(str(body.get("conversation_id", ""))))
    except (ValueError, TypeError, AttributeError) as error:
        raise ChatFeedbackError("Conversation ID is not valid.") from error

    rating = body.get("rating")
    if rating not in ALLOWED_RATINGS:
        raise ChatFeedbackError("Choose a positive or negative rating.")

    raw_comment = body.get("comment", "")
    if not isinstance(raw_comment, str):
        raise ChatFeedbackError("Feedback note is not valid.")
    comment = raw_comment.strip()
    if len(comment) > 500:
        raise ChatFeedbackError("Keep the feedback note under 500 characters.")

    trigger = body.get("trigger", "chat_close")
    if trigger not in ALLOWED_TRIGGERS:
        raise ChatFeedbackError("Feedback trigger is not valid.")

    page = body.get("page", "/")
    if not isinstance(page, str) or not page.startswith("/") or len(page) > 240:
        raise ChatFeedbackError("Page is not valid.")

    last_assistant_message_id = body.get("last_assistant_message_id")
    if last_assistant_message_id is not None:
        if not isinstance(last_assistant_message_id, str) or len(last_assistant_message_id) > 100:
            raise ChatFeedbackError("Message ID is not valid.")

    return {
        "conversation_id": conversation_id,
        "rating": rating,
        "comment": comment or None,
        "trigger": trigger,
        "page": page,
        "user_message_count": _bounded_count(body.get("user_message_count"), "User message count"),
        "assistant_message_count": _bounded_count(body.get("assistant_message_count"), "Assistant message count"),
        "last_assistant_message_id": last_assistant_message_id,
    }


def handle_chat_feedback_request(
    method: str,
    raw_body: bytes,
    headers: dict[str, str] | None = None,
    gateway: SupabaseGateway | None = None,
) -> tuple[int, dict[str, str], dict[str, Any]]:
    normalized_headers = {key.lower(): value for key, value in (headers or {}).items()}
    response_headers = {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "Referrer-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
    }
    if method.upper() != "POST":
        return 405, {**response_headers, "Allow": "POST"}, {"error": "Method not allowed."}

    try:
        body = _parse_json(raw_body)
        _consume_rate_limit(_client_ip(normalized_headers))
        feedback = _validated_feedback(body)
        gateway = gateway or SupabaseGateway.from_environment()
        stored = gateway.upsert("chat_feedback", feedback, "conversation_id")
        return 201, response_headers, {
            "saved": True,
            "feedback_id": stored.get("id"),
            "conversation_id": stored.get("conversation_id") or feedback["conversation_id"],
        }
    except ChatFeedbackError as error:
        return error.status, response_headers, {"error": str(error)}
    except ReferralError as error:
        status = error.status if error.status >= 500 else 502
        return status, response_headers, {"error": "Feedback storage is unavailable right now."}
    except Exception as error:  # pragma: no cover - final safety boundary
        print(f"Chat feedback request failed: {error}", file=sys.stderr)
        return 500, response_headers, {"error": "Feedback could not be saved right now."}
