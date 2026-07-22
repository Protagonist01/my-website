"""FastAPI entry point for portfolio chat feedback."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api._lib.chat_feedback import handle_chat_feedback_request  # noqa: E402


def _run_local_bridge() -> None:
    envelope = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    status, headers, payload = handle_chat_feedback_request(
        envelope.get("method", "POST"),
        envelope.get("body", "").encode("utf-8"),
        envelope.get("headers", {}),
    )
    sys.stdout.write(json.dumps({"status": status, "headers": headers, "body": payload}, ensure_ascii=False))


if __name__ == "__main__" and "--local" in sys.argv:
    _run_local_bridge()
    raise SystemExit(0)

from fastapi import FastAPI, Request, Response  # noqa: E402

app = FastAPI(title="Henry Fadeni Chat Feedback API", docs_url=None, redoc_url=None, openapi_url=None)


async def _dispatch(request: Request) -> Response:
    status, headers, payload = handle_chat_feedback_request(
        request.method,
        await request.body(),
        dict(request.headers),
    )
    return Response(
        content=json.dumps(payload, ensure_ascii=False),
        status_code=status,
        headers=headers,
        media_type="application/json",
    )


@app.api_route("/", methods=["POST"])
@app.api_route("/api/feedback", methods=["POST"])
async def feedback(request: Request) -> Response:
    return await _dispatch(request)
