import unittest

from scripts.run_chat_evals import DEFAULT_DATASET, evaluate_response, load_dataset, redact_sensitive


class EvaluatorTests(unittest.TestCase):
    def test_dataset_is_valid_and_versioned(self):
        dataset = load_dataset(DEFAULT_DATASET)
        self.assertEqual(dataset["version"], 1)
        self.assertGreaterEqual(len(dataset["cases"]), 10)

    def test_response_rules_detect_a_good_action(self):
        case = {
            "category": "action_accuracy",
            "expect": {"actions": [{"type": "show_booking", "eventTypeSlug": "test-slot"}]},
        }
        response = {
            "message": "Choose a time.",
            "suggestions": [],
            "actions": [{"type": "show_booking", "eventTypeSlug": "test-slot"}],
            "meta": {"provider": "action-router"},
        }
        checks = evaluate_response(case, response, 20)
        self.assertTrue(all(check["passed"] for check in checks))

    def test_response_rules_detect_forbidden_claims(self):
        case = {
            "category": "groundedness",
            "expect": {"forbiddenPatterns": [r"\$\s?\d"]},
        }
        response = {
            "message": "The fixed price is $5000.",
            "suggestions": [],
            "actions": [],
            "meta": {"provider": "action-router"},
        }
        checks = evaluate_response(case, response, 20)
        self.assertFalse(all(check["passed"] for check in checks))

    def test_saved_reports_redact_secret_shaped_text(self):
        result = redact_sensitive({"message": "key=sk-example-secret-12345"})
        self.assertEqual(result["message"], "key=[REDACTED_API_KEY]")


if __name__ == "__main__":
    unittest.main()
