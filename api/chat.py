"""Vercel Python function for the portfolio chat endpoint."""

from __future__ import annotations

import json
import sys
import time
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api._lib.assistant import answer_portfolio_question  # noqa: E402

MAX_BODY_BYTES = 24 * 1024
RATE_LIMIT: dict[str, list[float]] = {}
SAFE_HEADERS = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
}


def _consume_rate_limit(ip_address: str, now: float | None = None) -> tuple[bool, int]:
    now = time.time() if now is None else now
    recent = [timestamp for timestamp in RATE_LIMIT.get(ip_address, []) if timestamp > now - 60]
    if len(recent) >= 20:
        return False, max(1, int(60 - (now - recent[0])))
    recent.append(now)
    RATE_LIMIT[ip_address] = recent
    return True, 0


def handle_request(method: str, raw_body: bytes, headers: dict[str, str] | None = None) -> tuple[int, dict[str, str], dict[str, Any]]:
    headers = {key.lower(): value for key, value in (headers or {}).items()}
    response_headers = dict(SAFE_HEADERS)
    if method.upper() != "POST":
        response_headers["Allow"] = "POST"
        return 405, response_headers, {"error": "Method not allowed."}
    forwarded = headers.get("x-forwarded-for", "local")
    ip_address = forwarded.split(",", 1)[0].strip() or "local"
    allowed, retry_after = _consume_rate_limit(ip_address)
    if not allowed:
        response_headers["Retry-After"] = str(retry_after)
        return 429, response_headers, {"error": "Please wait a moment before sending another message."}
    if len(raw_body) > MAX_BODY_BYTES:
        return 413, response_headers, {"error": "Request body is too large."}
    try:
        body = json.loads(raw_body.decode("utf-8"))
        if not isinstance(body, dict):
            raise ValueError("JSON body must be an object")
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError):
        return 400, response_headers, {"error": "Please send valid JSON."}
    message = body.get("message", "").strip() if isinstance(body.get("message"), str) else ""
    page = body.get("page", "/v2/")[:220] if isinstance(body.get("page"), str) else "/v2/"
    raw_history = body.get("history", [])
    history = [
        item for item in raw_history
        if isinstance(item, dict) and item.get("role") in {"user", "assistant"} and isinstance(item.get("content"), str)
    ] if isinstance(raw_history, list) else []
    if not message or len(message) > 1_200:
        return 400, response_headers, {"error": "Please send a message between 1 and 1,200 characters."}
    try:
        answer = answer_portfolio_question(message=message, history=history, page=page)
        return 200, response_headers, answer
    except Exception as error:
        print(f"Portfolio chat request failed: {error}", file=sys.stderr)
        return 502, response_headers, {"error": "The guide could not answer just now. Please try again or use the contact option."}


class handler(BaseHTTPRequestHandler):
    def _respond(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0") or 0)
        raw_body = self.rfile.read(content_length) if content_length <= MAX_BODY_BYTES else b"x" * (MAX_BODY_BYTES + 1)
        status, headers, payload = handle_request(self.command, raw_body, dict(self.headers.items()))
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        for key, value in headers.items():
            self.send_header(key, value)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    do_POST = _respond
    do_GET = _respond
    do_PUT = _respond
    do_DELETE = _respond


def _run_local_bridge() -> None:
    envelope = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    raw_body = envelope.get("body", "").encode("utf-8")
    status, headers, payload = handle_request(envelope.get("method", "POST"), raw_body, envelope.get("headers", {}))
    sys.stdout.write(json.dumps({"status": status, "headers": headers, "body": payload}, ensure_ascii=False))


if __name__ == "__main__" and "--local" in sys.argv:
    _run_local_bridge()
