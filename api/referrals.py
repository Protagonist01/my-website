"""FastAPI entry point for the referral campaign."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import parse_qsl

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api._lib.referrals import handle_referral_request  # noqa: E402


def _run_local_bridge() -> None:
    envelope = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    query = dict(parse_qsl(envelope.get("query", ""), keep_blank_values=True))
    status, headers, payload = handle_referral_request(
        envelope.get("method", "GET"),
        query,
        envelope.get("headers", {}),
        envelope.get("body", "").encode("utf-8"),
    )
    sys.stdout.write(json.dumps({"status": status, "headers": headers, "body": payload}, ensure_ascii=False))


if __name__ == "__main__" and "--local" in sys.argv:
    _run_local_bridge()
    raise SystemExit(0)

from fastapi import FastAPI, Request, Response  # noqa: E402

app = FastAPI(title="Henry Fadeni Referral API", docs_url=None, redoc_url=None, openapi_url=None)


async def _dispatch(request: Request) -> Response:
    raw_body = await request.body()
    status, headers, payload = handle_referral_request(
        request.method,
        dict(request.query_params),
        dict(request.headers),
        raw_body,
    )
    return Response(
        content=json.dumps(payload, ensure_ascii=False),
        status_code=status,
        headers=headers,
        media_type="application/json",
    )


@app.api_route("/", methods=["GET", "POST"])
@app.api_route("/api/referrals", methods=["GET", "POST"])
async def referrals(request: Request) -> Response:
    return await _dispatch(request)

