import json
import os
import re
import unittest
from pathlib import Path
from unittest.mock import patch

from api import chat
from api._lib import assistant


class AssistantTests(unittest.TestCase):
    def test_booking_action_is_deterministic(self):
        result = assistant.answer_portfolio_question(
            message="Book a 30-minute project discovery call",
            history=[],
            page="/v2/",
        )
        self.assertEqual(result["meta"]["provider"], "action-router")
        self.assertEqual(result["actions"][0]["type"], "show_booking")
        self.assertEqual(result["actions"][0]["eventTypeSlug"], "30-minute-ai-project-discovery")

    def test_inquiry_action_is_deterministic(self):
        result = assistant.answer_portfolio_question(
            message="I want to start a project inquiry",
            history=[],
            page="/v2/",
        )
        self.assertEqual(result["actions"][0]["type"], "show_inquiry")

    def test_navigation_actions_are_allowlisted(self):
        self.assertIsNone(assistant._validate_action({"type": "navigate", "label": "Bad", "target": "https://example.com"}))
        valid = assistant._validate_action({"type": "navigate", "label": "Work", "target": "/v2/work/"})
        self.assertEqual(valid["target"], "/v2/work/")

    def test_python_routes_match_the_existing_javascript_registry(self):
        source = (Path(__file__).parents[1] / "api" / "_lib" / "config.js").read_text(encoding="utf-8")
        registry = source.split("export const APPROVED_ROUTES", 1)[1].split("export const OPENAI_MODEL", 1)[0]
        javascript_routes = set(re.findall(r'^\s*\["([^"]+)",', registry, flags=re.MULTILINE))
        javascript_routes.add(assistant.RAA_REPOSITORY_URL)
        self.assertEqual(set(assistant.APPROVED_ROUTES), javascript_routes)

    def test_openrouter_is_used_only_after_openai_fails(self):
        calls = []

        def fake_request(provider, messages, page):
            calls.append(provider["name"])
            if provider["name"] == "openai":
                raise RuntimeError("temporary failure")
            return {"message": "Fallback worked.", "suggestions": [], "actions": [], "meta": {"provider": "openrouter"}}

        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-openai", "OPENROUTER_API_KEY": "test-openrouter"}, clear=False), patch.object(assistant, "_request_provider", side_effect=fake_request):
            result = assistant.answer_portfolio_question(message="What does Henry build?", history=[], page="/v2/")
        self.assertEqual(calls, ["openai", "openrouter"])
        self.assertEqual(result["meta"]["provider"], "openrouter")

    def test_retrieval_is_bounded_and_grounded(self):
        retrieved = assistant._retrieve_knowledge("AI engineering services", "/v2/services/ai-engineering/")
        self.assertGreaterEqual(retrieved["count"], 1)
        self.assertLessEqual(len(retrieved["content"]), 18_000)
        self.assertIn("Source and Truth Policy", retrieved["content"])


class EndpointTests(unittest.TestCase):
    def setUp(self):
        chat.RATE_LIMIT.clear()

    def test_endpoint_preserves_frontend_contract(self):
        body = json.dumps({"message": "Show available meeting times", "history": [], "page": "/v2/"}).encode()
        status, headers, payload = chat.handle_request("POST", body, {"x-forwarded-for": "test-1"})
        self.assertEqual(status, 200)
        self.assertIn("application/json", headers["Content-Type"])
        self.assertEqual(set(payload).intersection({"message", "suggestions", "actions"}), {"message", "suggestions", "actions"})

    def test_invalid_json_and_message_are_rejected(self):
        status, _, _ = chat.handle_request("POST", b"not-json", {"x-forwarded-for": "test-2"})
        self.assertEqual(status, 400)
        status, _, _ = chat.handle_request("POST", b'{"message":""}', {"x-forwarded-for": "test-3"})
        self.assertEqual(status, 400)

    def test_oversized_body_is_rejected(self):
        status, _, _ = chat.handle_request("POST", b"x" * (chat.MAX_BODY_BYTES + 1), {"x-forwarded-for": "test-large"})
        self.assertEqual(status, 413)

    def test_non_post_method_is_rejected(self):
        status, headers, _ = chat.handle_request("GET", b"", {})
        self.assertEqual(status, 405)
        self.assertEqual(headers["Allow"], "POST")

    def test_rate_limit_is_enforced(self):
        body = json.dumps({"message": "Show available meeting times"}).encode()
        for _ in range(20):
            status, _, _ = chat.handle_request("POST", body, {"x-forwarded-for": "test-rate"})
            self.assertEqual(status, 200)
        status, headers, _ = chat.handle_request("POST", body, {"x-forwarded-for": "test-rate"})
        self.assertEqual(status, 429)
        self.assertIn("Retry-After", headers)


if __name__ == "__main__":
    unittest.main()
