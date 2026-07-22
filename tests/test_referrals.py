import json
import os
import unittest
from unittest.mock import patch

from api._lib.referrals import RATE_LIMITS, handle_referral_request


class FakeGateway:
    def __init__(self):
        self.tables = {
            "referral_profiles": [],
            "referral_clicks": [],
            "referral_leads": [],
            "referral_commissions": [],
            "referral_payout_methods": [],
        }
        self.user = {"id": "auth-1", "email": "partner@example.com"}
        self.counter = 0

    @staticmethod
    def _matches(row, filters):
        for key, expression in filters.items():
            if key in {"limit", "order"}:
                continue
            expected = expression[3:] if expression.startswith("eq.") else expression
            if str(row.get(key)) != expected:
                return False
        return True

    def select(self, table, filters, columns="*"):
        rows = [row.copy() for row in self.tables[table] if self._matches(row, filters)]
        if "order" in filters and filters["order"].endswith(".desc"):
            field = filters["order"].split(".", 1)[0]
            rows.sort(key=lambda row: row.get(field, ""), reverse=True)
        limit = int(filters.get("limit", len(rows)))
        if columns != "*":
            names = [name.strip() for name in columns.split(",")]
            rows = [{name: row.get(name) for name in names} for row in rows]
        return rows[:limit]

    def insert(self, table, payload):
        self.counter += 1
        row = {"id": f"row-{self.counter}", "created_at": "2026-07-22T12:00:00+00:00", **payload}
        self.tables[table].append(row)
        return row.copy()

    def update(self, table, payload, filters):
        for row in self.tables[table]:
            if self._matches(row, filters):
                row.update(payload)
                return row.copy()
        return {}

    def upsert(self, table, payload, conflict):
        current = next((row for row in self.tables[table] if row.get(conflict) == payload.get(conflict)), None)
        if current:
            current.update(payload)
            return current.copy()
        return self.insert(table, payload)

    def auth_user(self, access_token):
        if access_token != "valid-token":
            raise AssertionError("Unexpected token")
        return self.user.copy()


def request(gateway, method, action, body=None, headers=None, **query):
    return handle_referral_request(
        method,
        {"action": action, **query},
        headers or {"x-forwarded-for": "203.0.113.7", "user-agent": "Referral test"},
        json.dumps(body or {}).encode(),
        gateway,
    )


class ReferralApiTests(unittest.TestCase):
    def setUp(self):
        RATE_LIMITS.clear()
        self.gateway = FakeGateway()

    def add_approved_partner(self):
        return self.gateway.insert("referral_profiles", {
            "auth_user_id": None,
            "full_name": "Partner Person",
            "email": "partner@example.com",
            "country": "Nigeria",
            "promotion_plan": "Direct introductions to people in my network.",
            "referral_code": "partner-person-a1b2c3",
            "status": "approved",
        })

    @patch("api._lib.referrals.generate_referral_code", return_value="ada-lovelace-a1b2c3")
    def test_public_application_is_created_pending(self, _generate):
        status, _, payload = request(self.gateway, "POST", "apply", {
            "full_name": "Ada Lovelace",
            "email": "ADA@example.com",
            "country": "United Kingdom",
            "promotion_plan": "I will make thoughtful direct introductions.",
            "accepted_terms": True,
        })
        self.assertEqual(status, 201)
        self.assertEqual(payload["status"], "pending")
        profile = self.gateway.tables["referral_profiles"][0]
        self.assertEqual(profile["email"], "ada@example.com")
        self.assertEqual(profile["referral_code"], "ada-lovelace-a1b2c3")

    def test_application_requires_terms(self):
        status, _, payload = request(self.gateway, "POST", "apply", {
            "full_name": "Ada Lovelace",
            "email": "ada@example.com",
            "country": "United Kingdom",
            "promotion_plan": "I will make thoughtful direct introductions.",
            "accepted_terms": False,
        })
        self.assertEqual(status, 400)
        self.assertIn("terms", payload["error"])

    def test_visit_requires_approved_link_and_sets_sixty_day_cookie(self):
        self.add_approved_partner()
        status, headers, payload = request(
            self.gateway,
            "GET",
            "visit",
            code="partner-person-a1b2c3",
            landing_page="/v2/ecommerce/?ref=partner-person-a1b2c3",
        )
        self.assertEqual(status, 200)
        self.assertTrue(payload["active"])
        self.assertIn("Max-Age=5184000", headers["Set-Cookie"])
        self.assertEqual(len(self.gateway.tables["referral_clicks"]), 1)

    def test_first_referrer_keeps_duplicate_prospect(self):
        partner = self.add_approved_partner()
        body = {
            "referral_code": partner["referral_code"],
            "name": "Potential Client",
            "email": "client@example.com",
            "description": "A qualified AI software opportunity.",
        }
        first_status, _, first = request(self.gateway, "POST", "lead", body)
        second_status, _, second = request(self.gateway, "POST", "lead", body)
        self.assertEqual(first_status, 201)
        self.assertTrue(first["attributed"])
        self.assertEqual(second_status, 201)
        self.assertEqual(second, {"attributed": False, "reason": "duplicate"})
        self.assertEqual(len(self.gateway.tables["referral_leads"]), 1)

    def test_existing_cookie_cannot_be_replaced_by_a_later_link(self):
        first = self.add_approved_partner()
        second = self.gateway.insert("referral_profiles", {
            **{key: value for key, value in first.items() if key not in {"id", "created_at"}},
            "full_name": "Second Partner",
            "email": "second@example.com",
            "referral_code": "second-partner-d4e5f6",
        })
        status, headers, payload = request(
            self.gateway,
            "GET",
            "visit",
            headers={
                "cookie": "hf_referral=partner-person-a1b2c3",
                "x-forwarded-for": "203.0.113.7",
                "user-agent": "Referral test",
            },
            code=second["referral_code"],
            landing_page="/v2/ecommerce/",
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["code"], first["referral_code"])
        self.assertNotIn("Set-Cookie", headers)
        self.assertEqual(self.gateway.tables["referral_clicks"][0]["referrer_id"], first["id"])

    @patch.dict(os.environ, {"PUBLIC_SITE_URL": "https://example.com/v2/"})
    def test_dashboard_binds_auth_user_and_returns_only_safe_payout_label(self):
        partner = self.add_approved_partner()
        self.gateway.insert("referral_payout_methods", {
            "referrer_id": partner["id"],
            "method_type": "bank",
            "display_label": "Example Bank / NGN / ••••4321",
            "details": {"account_number": "1234564321"},
            "updated_at": "2026-07-22T12:00:00+00:00",
        })
        status, _, payload = request(
            self.gateway,
            "GET",
            "dashboard",
            headers={"authorization": "Bearer valid-token"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["profile"]["referral_link"], "https://example.com/v2/ecommerce/?ref=partner-person-a1b2c3")
        self.assertEqual(self.gateway.tables["referral_profiles"][0]["auth_user_id"], "auth-1")
        self.assertNotIn("details", payload["payout_method"])

    def test_crypto_payout_accepts_only_tron_address(self):
        self.add_approved_partner()
        headers = {"authorization": "Bearer valid-token"}
        bad_status, _, bad = request(self.gateway, "POST", "payout-method", {
            "method_type": "crypto",
            "wallet_address": "0x1234",
        }, headers=headers)
        self.assertEqual(bad_status, 400)
        self.assertIn("TRON", bad["error"])

        good_status, _, good = request(self.gateway, "POST", "payout-method", {
            "method_type": "crypto",
            "wallet_address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        }, headers=headers)
        self.assertEqual(good_status, 200)
        self.assertTrue(good["saved"])
        stored = self.gateway.tables["referral_payout_methods"][0]
        self.assertEqual(stored["details"]["network"], "TRON (TRC-20)")


if __name__ == "__main__":
    unittest.main()
