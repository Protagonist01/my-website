"""Referral campaign domain logic and Supabase REST gateway."""

from __future__ import annotations

import hashlib
import json
import os
import re
import secrets
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from http.cookies import SimpleCookie
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen

APPLICATION_WINDOW_SECONDS = 60
APPLICATION_LIMIT = 5
LEAD_LIMIT = 20
ATTRIBUTION_DAYS = 60
CLEARANCE_DAYS = 14
RATE_LIMITS: dict[str, list[float]] = {}
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
CODE_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{4,47}$")
TRON_ADDRESS_PATTERN = re.compile(r"^T[1-9A-HJ-NP-Za-km-z]{33}$")


class ReferralError(RuntimeError):
    """Expected request or configuration failure."""

    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _clean(value: Any, limit: int) -> str:
    return value.strip()[:limit] if isinstance(value, str) else ""


def _email(value: Any) -> str:
    email = _clean(value, 254).lower()
    if not EMAIL_PATTERN.fullmatch(email):
        raise ReferralError("Please enter a valid email address.")
    return email


def _slug(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized[:22] or "referrer"


def generate_referral_code(full_name: str) -> str:
    return f"{_slug(full_name)}-{secrets.token_hex(3)}"


def commission_rate(opportunity_type: str) -> float:
    return 0.05 if opportunity_type == "employment" else 0.10


def _client_ip(headers: dict[str, str]) -> str:
    forwarded = headers.get("x-forwarded-for", "local")
    return forwarded.split(",", 1)[0].strip() or "local"


def _consume_rate_limit(scope: str, client: str, limit: int, now: float | None = None) -> None:
    now = time.time() if now is None else now
    key = f"{scope}:{client}"
    recent = [timestamp for timestamp in RATE_LIMITS.get(key, []) if timestamp > now - APPLICATION_WINDOW_SECONDS]
    if len(recent) >= limit:
        raise ReferralError("Please wait a moment before trying again.", 429)
    recent.append(now)
    RATE_LIMITS[key] = recent


def _visitor_hash(headers: dict[str, str]) -> str:
    salt = os.environ.get("REFERRAL_HASH_SALT", "local-referral-salt")
    source = f"{salt}|{_client_ip(headers)}|{headers.get('user-agent', '')[:320]}"
    return hashlib.sha256(source.encode("utf-8")).hexdigest()


def _parse_json(raw_body: bytes) -> dict[str, Any]:
    if len(raw_body) > 32 * 1024:
        raise ReferralError("Request body is too large.", 413)
    try:
        body = json.loads(raw_body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ReferralError("Please send valid JSON.") from error
    if not isinstance(body, dict):
        raise ReferralError("JSON body must be an object.")
    return body


def _bearer(headers: dict[str, str]) -> str:
    value = headers.get("authorization", "")
    if not value.lower().startswith("bearer "):
        raise ReferralError("Sign in to continue.", 401)
    token = value[7:].strip()
    if not token:
        raise ReferralError("Sign in to continue.", 401)
    return token


def _cookie_referral(headers: dict[str, str]) -> str:
    cookie = SimpleCookie()
    cookie.load(headers.get("cookie", ""))
    morsel = cookie.get("hf_referral")
    return morsel.value if morsel else ""


@dataclass
class SupabaseGateway:
    url: str
    service_key: str
    publishable_key: str

    @classmethod
    def from_environment(cls) -> "SupabaseGateway":
        url = os.environ.get("SUPABASE_URL", "").rstrip("/")
        service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        publishable_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "") or os.environ.get("SUPABASE_ANON_KEY", "")
        if not url or not service_key:
            raise ReferralError("Referral services are not configured yet.", 503)
        return cls(url=url, service_key=service_key, publishable_key=publishable_key or service_key)

    def _request(
        self,
        method: str,
        path: str,
        *,
        query: dict[str, str] | None = None,
        payload: Any | None = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        target = f"{self.url}{path}"
        if query:
            target += f"?{urlencode(query)}"
        request_headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            **(headers or {}),
        }
        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        request = Request(target, data=data, headers=request_headers, method=method)
        try:
            with urlopen(request, timeout=12) as response:
                content = response.read()
                return json.loads(content.decode("utf-8")) if content else None
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")[:800]
            if error.code in {401, 403}:
                raise ReferralError("This referral request is not authorized.", error.code) from error
            if error.code == 409:
                raise ReferralError("That referral record already exists.", 409) from error
            raise ReferralError(f"Referral storage rejected the request: {detail or error.reason}", 502) from error
        except (URLError, TimeoutError) as error:
            raise ReferralError("Referral storage is temporarily unavailable.", 502) from error

    def select(self, table: str, filters: dict[str, str], columns: str = "*") -> list[dict[str, Any]]:
        query = {"select": columns, **filters}
        result = self._request("GET", f"/rest/v1/{quote(table)}", query=query)
        return result if isinstance(result, list) else []

    def insert(self, table: str, payload: dict[str, Any]) -> dict[str, Any]:
        result = self._request(
            "POST",
            f"/rest/v1/{quote(table)}",
            payload=payload,
            headers={"Prefer": "return=representation"},
        )
        return result[0] if isinstance(result, list) and result else {}

    def update(self, table: str, payload: dict[str, Any], filters: dict[str, str]) -> dict[str, Any]:
        result = self._request(
            "PATCH",
            f"/rest/v1/{quote(table)}",
            query=filters,
            payload=payload,
            headers={"Prefer": "return=representation"},
        )
        return result[0] if isinstance(result, list) and result else {}

    def upsert(self, table: str, payload: dict[str, Any], conflict: str) -> dict[str, Any]:
        result = self._request(
            "POST",
            f"/rest/v1/{quote(table)}",
            query={"on_conflict": conflict},
            payload=payload,
            headers={"Prefer": "resolution=merge-duplicates,return=representation"},
        )
        return result[0] if isinstance(result, list) and result else {}

    def auth_user(self, access_token: str) -> dict[str, Any]:
        result = self._request(
            "GET",
            "/auth/v1/user",
            headers={
                "apikey": self.publishable_key,
                "Authorization": f"Bearer {access_token}",
            },
        )
        if not isinstance(result, dict) or not result.get("id") or not result.get("email"):
            raise ReferralError("Your session is no longer valid.", 401)
        return result


def _approved_profile(gateway: SupabaseGateway, code: str) -> dict[str, Any]:
    if not CODE_PATTERN.fullmatch(code):
        raise ReferralError("This referral link is not valid.", 404)
    profiles = gateway.select(
        "referral_profiles",
        {"referral_code": f"eq.{code}", "status": "eq.approved", "limit": "1"},
    )
    if not profiles:
        raise ReferralError("This referral link is not active.", 404)
    return profiles[0]


def _authenticated_profile(gateway: SupabaseGateway, headers: dict[str, str]) -> tuple[dict[str, Any], dict[str, Any]]:
    user = gateway.auth_user(_bearer(headers))
    email = _email(user.get("email"))
    profiles = gateway.select("referral_profiles", {"email": f"eq.{email}", "limit": "1"})
    if not profiles:
        raise ReferralError("No referral application is connected to this email.", 404)
    profile = profiles[0]
    auth_user_id = profile.get("auth_user_id")
    if auth_user_id and auth_user_id != user["id"]:
        raise ReferralError("This referral account belongs to a different sign-in.", 403)
    if not auth_user_id:
        profile = gateway.update(
            "referral_profiles",
            {"auth_user_id": user["id"]},
            {"id": f"eq.{profile['id']}"},
        ) or profile
    return user, profile


def _application(body: dict[str, Any], headers: dict[str, str], gateway: SupabaseGateway) -> dict[str, Any]:
    _consume_rate_limit("application", _client_ip(headers), APPLICATION_LIMIT)
    if _clean(body.get("website"), 200):
        return {"status": "received"}
    full_name = _clean(body.get("full_name"), 100)
    country = _clean(body.get("country"), 80)
    promotion_plan = _clean(body.get("promotion_plan"), 600)
    email = _email(body.get("email"))
    if len(full_name) < 2:
        raise ReferralError("Please enter your full name.")
    if len(country) < 2:
        raise ReferralError("Please enter your country.")
    if len(promotion_plan) < 12:
        raise ReferralError("Tell us briefly how you plan to share your referral link.")
    if body.get("accepted_terms") is not True:
        raise ReferralError("Accept the referral programme terms to apply.")
    existing = gateway.select("referral_profiles", {"email": f"eq.{email}", "limit": "1"})
    if existing:
        return {"status": existing[0].get("status", "pending"), "message": "An application already exists for this email."}
    profile = gateway.insert(
        "referral_profiles",
        {
            "full_name": full_name,
            "email": email,
            "country": country,
            "promotion_plan": promotion_plan,
            "referral_code": generate_referral_code(full_name),
            "status": "pending",
        },
    )
    return {"status": profile.get("status", "pending"), "message": "Application received for review."}


def _visit(query: dict[str, str], headers: dict[str, str], gateway: SupabaseGateway) -> tuple[dict[str, Any], dict[str, str]]:
    requested_code = _clean(query.get("code"), 48).lower()
    code = requested_code
    profile = None
    existing_code = _cookie_referral(headers).lower()
    if existing_code:
        try:
            profile = _approved_profile(gateway, existing_code)
            code = existing_code
        except ReferralError:
            profile = None
    profile = profile or _approved_profile(gateway, requested_code)
    gateway.insert(
        "referral_clicks",
        {
            "referrer_id": profile["id"],
            "referral_code": code,
            "landing_page": _clean(query.get("landing_page"), 240) or "/",
            "visitor_key": _visitor_hash(headers),
            "user_agent_hash": hashlib.sha256(headers.get("user-agent", "").encode("utf-8")).hexdigest(),
        },
    )
    max_age = ATTRIBUTION_DAYS * 24 * 60 * 60
    extra_headers = {}
    if not existing_code or code != existing_code:
        extra_headers["Set-Cookie"] = f"hf_referral={code}; Max-Age={max_age}; Path=/; HttpOnly; Secure; SameSite=Lax"
    return {
        "active": True,
        "code": code,
        "referrer": profile.get("full_name", "Referral partner"),
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=ATTRIBUTION_DAYS)).isoformat(),
    }, extra_headers


def _lead(body: dict[str, Any], headers: dict[str, str], gateway: SupabaseGateway) -> dict[str, Any]:
    _consume_rate_limit("lead", _client_ip(headers), LEAD_LIMIT)
    code = (_cookie_referral(headers) or _clean(body.get("referral_code"), 48)).lower()
    if not code:
        return {"attributed": False, "reason": "no_referral"}
    profile = _approved_profile(gateway, code)
    prospect_email = _email(body.get("email"))
    prospect_name = _clean(body.get("name"), 100)
    if len(prospect_name) < 2:
        raise ReferralError("Please enter the prospect's name.")
    existing = gateway.select("referral_leads", {"prospect_email": f"eq.{prospect_email}", "limit": "1"}, "id,referrer_id,status")
    if existing:
        return {"attributed": False, "reason": "duplicate"}
    opportunity_type = _clean(body.get("opportunity_type"), 20).lower() or "unclassified"
    if opportunity_type not in {"unclassified", "gig", "contract", "employment"}:
        opportunity_type = "unclassified"
    lead = gateway.insert(
        "referral_leads",
        {
            "referrer_id": profile["id"],
            "referral_code": code,
            "prospect_name": prospect_name,
            "prospect_email": prospect_email,
            "opportunity_type": opportunity_type,
            "source": _clean(body.get("source"), 100) or "portfolio enquiry",
            "description": _clean(body.get("description"), 1800),
            "status": "new",
        },
    )
    return {"attributed": True, "lead_id": lead.get("id"), "status": "new"}


def _dashboard(headers: dict[str, str], gateway: SupabaseGateway) -> dict[str, Any]:
    _, profile = _authenticated_profile(gateway, headers)
    referrer_id = profile["id"]
    clicks = gateway.select("referral_clicks", {"referrer_id": f"eq.{referrer_id}", "limit": "500"}, "id,created_at")
    leads = gateway.select(
        "referral_leads",
        {"referrer_id": f"eq.{referrer_id}", "order": "created_at.desc", "limit": "100"},
        "id,opportunity_type,status,created_at",
    )
    commissions = gateway.select(
        "referral_commissions",
        {"referrer_id": f"eq.{referrer_id}", "order": "created_at.desc", "limit": "100"},
        "id,opportunity_type,rate,amount,currency,status,clearance_at,paid_at,created_at",
    )
    now = datetime.now(timezone.utc)
    for commission in commissions:
        if commission.get("status") != "clearance" or not commission.get("clearance_at"):
            continue
        try:
            clearance_at = datetime.fromisoformat(str(commission["clearance_at"]).replace("Z", "+00:00"))
        except ValueError:
            continue
        if clearance_at <= now:
            commission["status"] = "payable"
            gateway.update("referral_commissions", {"status": "payable"}, {"id": f"eq.{commission['id']}"})
    methods = gateway.select(
        "referral_payout_methods",
        {"referrer_id": f"eq.{referrer_id}", "limit": "1"},
        "method_type,display_label,updated_at",
    )
    approved = profile.get("status") == "approved"
    commission_due_by_currency: dict[str, float] = {}
    for item in commissions:
        if item.get("status") not in {"clearance", "payable"}:
            continue
        currency = _clean(item.get("currency"), 12).upper() or "USD"
        commission_due_by_currency[currency] = commission_due_by_currency.get(currency, 0) + float(item.get("amount") or 0)
    configured_url = os.environ.get("PUBLIC_SITE_URL", "https://henryfadeni.vercel.app").strip()
    parsed_url = urlsplit(configured_url)
    site_origin = f"{parsed_url.scheme}://{parsed_url.netloc}" if parsed_url.scheme and parsed_url.netloc else configured_url.rstrip("/")
    referral_link = f"{site_origin}/v2/ecommerce/?ref={profile['referral_code']}" if approved else None
    return {
        "profile": {
            "full_name": profile.get("full_name"),
            "email": profile.get("email"),
            "country": profile.get("country"),
            "status": profile.get("status"),
            "referral_code": profile.get("referral_code") if approved else None,
            "referral_link": referral_link,
        },
        "stats": {
            "clicks": len(clicks),
            "enquiries": len(leads),
            "qualified": sum(1 for lead in leads if lead.get("status") in {"qualified", "won"}),
            "commission_due_by_currency": commission_due_by_currency,
        },
        "leads": leads,
        "commissions": commissions,
        "payout_method": methods[0] if methods else None,
        "rules": {"attribution_days": ATTRIBUTION_DAYS, "clearance_days": CLEARANCE_DAYS, "gig_rate": 0.10, "employment_rate": 0.05},
    }


def _payout_method(body: dict[str, Any], headers: dict[str, str], gateway: SupabaseGateway) -> dict[str, Any]:
    _, profile = _authenticated_profile(gateway, headers)
    if profile.get("status") != "approved":
        raise ReferralError("Your application must be approved before adding payout details.", 403)
    method_type = _clean(body.get("method_type"), 20).lower()
    if method_type == "crypto":
        address = _clean(body.get("wallet_address"), 80)
        if not TRON_ADDRESS_PATTERN.fullmatch(address):
            raise ReferralError("Enter a valid TRON wallet address beginning with T.")
        details = {"asset": "USDT", "network": "TRON (TRC-20)", "wallet_address": address}
        label = f"USDT / TRON / ••••{address[-4:]}"
    elif method_type == "bank":
        account_name = _clean(body.get("account_name"), 120)
        bank_name = _clean(body.get("bank_name"), 120)
        country = _clean(body.get("country"), 80)
        currency = _clean(body.get("currency"), 12).upper()
        account_number = _clean(body.get("account_number"), 40).replace(" ", "")
        if min(len(account_name), len(bank_name), len(country), len(currency), len(account_number)) < 2:
            raise ReferralError("Complete the required bank transfer details.")
        details = {
            "account_name": account_name,
            "bank_name": bank_name,
            "country": country,
            "currency": currency,
            "account_number": account_number,
            "iban": _clean(body.get("iban"), 40).replace(" ", "").upper(),
            "swift_bic": _clean(body.get("swift_bic"), 20).replace(" ", "").upper(),
            "routing_number": _clean(body.get("routing_number"), 30).replace(" ", ""),
        }
        label = f"{bank_name} / {currency} / ••••{account_number[-4:]}"
    else:
        raise ReferralError("Choose bank transfer or USDT on TRON.")
    gateway.upsert(
        "referral_payout_methods",
        {"referrer_id": profile["id"], "method_type": method_type, "display_label": label, "details": details},
        "referrer_id",
    )
    return {"saved": True, "method_type": method_type, "display_label": label}


def handle_referral_request(
    method: str,
    query: dict[str, str],
    headers: dict[str, str],
    raw_body: bytes,
    gateway: SupabaseGateway | None = None,
) -> tuple[int, dict[str, str], dict[str, Any]]:
    normalized_headers = {key.lower(): value for key, value in headers.items()}
    response_headers = {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
    }
    try:
        gateway = gateway or SupabaseGateway.from_environment()
        action = _clean(query.get("action"), 40).lower()
        if method.upper() == "GET" and action == "visit":
            payload, extra_headers = _visit(query, normalized_headers, gateway)
            return 200, {**response_headers, **extra_headers}, payload
        if method.upper() == "GET" and action == "dashboard":
            return 200, response_headers, _dashboard(normalized_headers, gateway)
        if method.upper() != "POST":
            return 405, {**response_headers, "Allow": "GET, POST"}, {"error": "Method not allowed."}
        body = _parse_json(raw_body)
        if action == "apply":
            return 201, response_headers, _application(body, normalized_headers, gateway)
        if action == "lead":
            return 201, response_headers, _lead(body, normalized_headers, gateway)
        if action == "payout-method":
            return 200, response_headers, _payout_method(body, normalized_headers, gateway)
        return 404, response_headers, {"error": "Unknown referral action."}
    except ReferralError as error:
        return error.status, response_headers, {"error": str(error)}
    except Exception as error:  # pragma: no cover - final safety boundary
        print(f"Referral request failed: {error}")
        return 500, response_headers, {"error": "The referral service could not complete this request."}
