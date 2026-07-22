import json
import os
import unittest
from unittest.mock import patch

from api._lib.chat_feedback import RATE_LIMITS, handle_chat_feedback_request


class FakeGateway:
    def __init__(self):
        self.rows = {}

    def upsert(self, table, payload, conflict):
        self.assertions = (table, conflict)
        current = self.rows.get(payload[conflict], {"id": "feedback-1"})
        current.update(payload)
        self.rows[payload[conflict]] = current
        return current.copy()


def feedback_body(**overrides):
    payload = {
        "conversation_id": "7f3cb3bc-c0cf-4bd8-a878-8c41590ce9db",
        "rating": "positive",
        "comment": "",
        "trigger": "chat_close",
        "page": "/v2/work/",
        "user_message_count": 2,
        "assistant_message_count": 2,
        "last_assistant_message_id": "message-2",
    }
    payload.update(overrides)
    return json.dumps(payload).encode()


class ChatFeedbackApiTests(unittest.TestCase):
    def setUp(self):
        RATE_LIMITS.clear()
        self.gateway = FakeGateway()
        self.headers = {"x-forwarded-for": "203.0.113.10"}

    def test_valid_rating_is_stored_without_a_transcript(self):
        status, headers, payload = handle_chat_feedback_request(
            "POST", feedback_body(), self.headers, self.gateway,
        )
        self.assertEqual(status, 201)
        self.assertTrue(payload["saved"])
        self.assertIn("application/json", headers["Content-Type"])
        stored = self.gateway.rows[payload["conversation_id"]]
        self.assertEqual(stored["rating"], "positive")
        self.assertIsNone(stored["comment"])
        self.assertNotIn("messages", stored)
        self.assertNotIn("transcript", stored)
        self.assertEqual(self.gateway.assertions, ("chat_feedback", "conversation_id"))

    def test_optional_note_updates_the_same_conversation(self):
        handle_chat_feedback_request("POST", feedback_body(), self.headers, self.gateway)
        status, _, _ = handle_chat_feedback_request(
            "POST",
            feedback_body(rating="negative", comment="The answer missed my question."),
            self.headers,
            self.gateway,
        )
        self.assertEqual(status, 201)
        self.assertEqual(len(self.gateway.rows), 1)
        stored = next(iter(self.gateway.rows.values()))
        self.assertEqual(stored["rating"], "negative")
        self.assertEqual(stored["comment"], "The answer missed my question.")

    def test_invalid_rating_uuid_and_long_note_are_rejected(self):
        for body in (
            feedback_body(rating="five-stars"),
            feedback_body(conversation_id="not-a-uuid"),
            feedback_body(comment="x" * 501),
        ):
            status, _, payload = handle_chat_feedback_request("POST", body, self.headers, self.gateway)
            self.assertEqual(status, 400)
            self.assertIn("error", payload)
        self.assertEqual(self.gateway.rows, {})

    def test_only_post_is_allowed(self):
        status, headers, _ = handle_chat_feedback_request("GET", b"", self.headers, self.gateway)
        self.assertEqual(status, 405)
        self.assertEqual(headers["Allow"], "POST")

    def test_rate_limit_is_enforced(self):
        for _ in range(20):
            status, _, _ = handle_chat_feedback_request("POST", feedback_body(), self.headers, self.gateway)
            self.assertEqual(status, 201)
        status, _, payload = handle_chat_feedback_request("POST", feedback_body(), self.headers, self.gateway)
        self.assertEqual(status, 429)
        self.assertIn("wait", payload["error"].lower())

    @patch.dict(os.environ, {"SUPABASE_URL": "", "SUPABASE_SERVICE_ROLE_KEY": ""}, clear=False)
    def test_missing_storage_configuration_is_a_safe_error(self):
        status, _, payload = handle_chat_feedback_request("POST", feedback_body(), self.headers)
        self.assertEqual(status, 503)
        self.assertEqual(payload["error"], "Feedback storage is unavailable right now.")


if __name__ == "__main__":
    unittest.main()
