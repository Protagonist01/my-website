"""Run versioned regression evaluations for the portfolio assistant."""

from __future__ import annotations

import argparse
import json
import os
import re
import statistics
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

DEFAULT_DATASET = ROOT / "evals" / "portfolio_chat_v1.json"


def load_local_env(path: Path = ROOT / ".env") -> None:
    """Load simple KEY=VALUE entries without replacing process environment values."""
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


load_local_env()

from api._lib import assistant  # noqa: E402


def load_dataset(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("version") != 1 or not isinstance(payload.get("cases"), list):
        raise ValueError("The evaluation dataset must use version 1 and contain a cases array.")
    identifiers = [case.get("id") for case in payload["cases"]]
    if any(not isinstance(identifier, str) or not identifier for identifier in identifiers):
        raise ValueError("Every evaluation case needs a non-empty string id.")
    if len(identifiers) != len(set(identifiers)):
        raise ValueError("Evaluation case ids must be unique.")
    return payload


def _check(dimension: str, name: str, passed: bool, detail: str) -> dict[str, Any]:
    return {"dimension": dimension, "name": name, "passed": bool(passed), "detail": detail}


def evaluate_retrieval(case: dict[str, Any]) -> list[dict[str, Any]]:
    expected = case.get("expect", {}).get("retrievalHeadings", [])
    if not expected:
        return []
    retrieved = assistant._retrieve_knowledge(case["prompt"], case.get("page", "/v2/"))
    headings = retrieved.get("headings", [])
    return [
        _check(
            "retrieval_relevance",
            f"retrieves:{heading}",
            heading in headings,
            f"expected {heading!r}; retrieved {headings}",
        )
        for heading in expected
    ]


def _action_matches(actual: dict[str, Any], expected: dict[str, Any]) -> bool:
    for key, value in expected.items():
        if key == "targetAny":
            if actual.get("target") not in value:
                return False
        elif actual.get(key) != value:
            return False
    return True


def redact_sensitive(value: Any) -> Any:
    """Keep accidental secret-shaped output out of saved or uploaded reports."""
    if isinstance(value, str):
        value = re.sub(r"\bsk-[A-Za-z0-9_-]{8,}", "[REDACTED_API_KEY]", value)
        return re.sub(r"(?i)(?:OPENAI|OPENROUTER|CAL)_API_KEY\s*[:=]\s*\S+", "[REDACTED_API_KEY]", value)
    if isinstance(value, list):
        return [redact_sensitive(item) for item in value]
    if isinstance(value, dict):
        return {key: redact_sensitive(item) for key, item in value.items()}
    return value


def evaluate_response(case: dict[str, Any], response: dict[str, Any], elapsed_ms: int) -> list[dict[str, Any]]:
    expected = case.get("expect", {})
    category = case.get("category", "groundedness")
    text = response.get("message", "") if isinstance(response.get("message"), str) else ""
    normalized = text.casefold()
    checks = [
        _check(
            "reliability",
            "response-contract",
            bool(text) and isinstance(response.get("suggestions"), list) and isinstance(response.get("actions"), list),
            "message is present and suggestions/actions are arrays",
        )
    ]

    for phrase in expected.get("requiredAll", []):
        checks.append(_check(category, f"contains:{phrase}", phrase.casefold() in normalized, f"answer must contain {phrase!r}"))
    required_any = expected.get("requiredAny", [])
    if required_any:
        passed = any(phrase.casefold() in normalized for phrase in required_any)
        checks.append(_check(category, "contains-any", passed, f"answer must contain one of {required_any}"))
    for phrase in expected.get("forbiddenAll", []):
        checks.append(_check("safety", f"excludes:{phrase}", phrase.casefold() not in normalized, f"answer must not contain {phrase!r}"))
    for pattern in expected.get("forbiddenPatterns", []):
        checks.append(_check("safety", f"pattern-excluded:{pattern}", re.search(pattern, text, flags=re.IGNORECASE) is None, f"answer must not match /{pattern}/"))

    actual_actions = response.get("actions", []) if isinstance(response.get("actions"), list) else []
    for index, expected_action in enumerate(expected.get("actions", []), start=1):
        passed = any(_action_matches(actual, expected_action) for actual in actual_actions if isinstance(actual, dict))
        checks.append(_check("action_accuracy", f"action:{index}", passed, f"expected {expected_action}; received {actual_actions}"))

    max_latency_ms = int(expected.get("maxLatencyMs", 36_000))
    checks.append(_check("performance", "latency", elapsed_ms <= max_latency_ms, f"{elapsed_ms} ms <= {max_latency_ms} ms"))
    provider = response.get("meta", {}).get("provider")
    if provider and provider != "action-router":
        usage = response.get("meta", {}).get("usage", {})
        checks.append(_check("performance", "token-usage-present", int(usage.get("totalTokens", 0)) > 0, f"usage={usage}"))
    return checks


def estimate_cost(results: list[dict[str, Any]]) -> float | None:
    input_rate = os.environ.get("EVAL_INPUT_COST_PER_MILLION")
    output_rate = os.environ.get("EVAL_OUTPUT_COST_PER_MILLION")
    if not input_rate or not output_rate:
        return None
    input_tokens = sum(item.get("usage", {}).get("inputTokens", 0) for item in results)
    output_tokens = sum(item.get("usage", {}).get("outputTokens", 0) for item in results)
    return (input_tokens * float(input_rate) + output_tokens * float(output_rate)) / 1_000_000


def run_evaluations(dataset: dict[str, Any], mode: str, selected_ids: set[str] | None = None) -> dict[str, Any]:
    started_at = time.time()
    results = []
    for case in dataset["cases"]:
        if selected_ids and case["id"] not in selected_ids:
            continue
        checks = evaluate_retrieval(case)
        should_run_response = mode == "live" or case.get("execution") == "deterministic"
        response = None
        elapsed_ms = None
        error = None
        if should_run_response:
            request_started = time.monotonic()
            try:
                response = assistant.answer_portfolio_question(
                    message=case["prompt"],
                    history=case.get("history", []),
                    page=case.get("page", "/v2/"),
                )
                elapsed_ms = round((time.monotonic() - request_started) * 1000)
                checks.extend(evaluate_response(case, response, elapsed_ms))
            except Exception as exc:
                elapsed_ms = round((time.monotonic() - request_started) * 1000)
                error = str(exc)
                checks.append(_check("reliability", "request-completed", False, error))
        passed = all(check["passed"] for check in checks)
        results.append({
            "id": case["id"],
            "category": case.get("category"),
            "execution": case.get("execution"),
            "responseEvaluated": should_run_response,
            "passed": passed,
            "elapsedMs": elapsed_ms,
            "provider": response.get("meta", {}).get("provider") if response else None,
            "model": response.get("meta", {}).get("model") if response else None,
            "usage": response.get("meta", {}).get("usage", {}) if response else {},
            "response": redact_sensitive({
                "message": response.get("message"),
                "suggestions": response.get("suggestions", []),
                "actions": response.get("actions", []),
            }) if response else None,
            "error": error,
            "checks": checks,
        })

    checks_by_dimension: dict[str, list[bool]] = defaultdict(list)
    for result in results:
        for check in result["checks"]:
            checks_by_dimension[check["dimension"]].append(check["passed"])
    dimensions = {
        dimension: {
            "passed": sum(values),
            "total": len(values),
            "score": round(sum(values) / len(values), 4),
        }
        for dimension, values in sorted(checks_by_dimension.items())
    }
    all_checks = [check for result in results for check in result["checks"]]
    latencies = [result["elapsedMs"] for result in results if result["elapsedMs"] is not None]
    report = {
        "dataset": dataset.get("name"),
        "datasetVersion": dataset.get("version"),
        "mode": mode,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "durationMs": round((time.time() - started_at) * 1000),
        "summary": {
            "casesPassed": sum(result["passed"] for result in results),
            "casesTotal": len(results),
            "checksPassed": sum(check["passed"] for check in all_checks),
            "checksTotal": len(all_checks),
            "score": round(sum(check["passed"] for check in all_checks) / len(all_checks), 4) if all_checks else 0,
            "averageLatencyMs": round(statistics.mean(latencies)) if latencies else None,
            "p95LatencyMs": round(sorted(latencies)[max(0, int(len(latencies) * 0.95) - 1)]) if latencies else None,
            "inputTokens": sum(result["usage"].get("inputTokens", 0) for result in results),
            "outputTokens": sum(result["usage"].get("outputTokens", 0) for result in results),
        },
        "dimensions": dimensions,
        "results": results,
    }
    report["summary"]["estimatedCostUsd"] = estimate_cost(results)
    return report


def print_report(report: dict[str, Any]) -> None:
    summary = report["summary"]
    print(f"Portfolio chat evals ({report['mode']}, dataset v{report['datasetVersion']})")
    print(f"Cases: {summary['casesPassed']}/{summary['casesTotal']} passed")
    print(f"Checks: {summary['checksPassed']}/{summary['checksTotal']} passed ({summary['score']:.1%})")
    for dimension, values in report["dimensions"].items():
        print(f"  {dimension}: {values['passed']}/{values['total']} ({values['score']:.1%})")
    if summary["averageLatencyMs"] is not None:
        print(f"Latency: avg {summary['averageLatencyMs']} ms, p95 {summary['p95LatencyMs']} ms")
    if summary["inputTokens"] or summary["outputTokens"]:
        print(f"Tokens: {summary['inputTokens']} input, {summary['outputTokens']} output")
    if summary["estimatedCostUsd"] is not None:
        print(f"Estimated cost: ${summary['estimatedCostUsd']:.6f}")
    for result in report["results"]:
        marker = "PASS" if result["passed"] else "FAIL"
        evaluated = "response" if result["responseEvaluated"] else "retrieval-only"
        print(f"[{marker}] {result['id']} ({evaluated})")
        for check in result["checks"]:
            if not check["passed"]:
                print(f"  - {check['dimension']}/{check['name']}: {check['detail']}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--mode", choices=["static", "live"], default="static")
    parser.add_argument("--case", action="append", dest="cases", help="Run one case id; repeat to select several.")
    parser.add_argument("--output", type=Path, help="Write the complete JSON report to this path.")
    parser.add_argument("--min-score", type=float, default=1.0, help="Exit non-zero below this check pass rate.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    load_local_env()
    dataset = load_dataset(args.dataset)
    selected = set(args.cases) if args.cases else None
    if selected:
        unknown = selected - {case["id"] for case in dataset["cases"]}
        if unknown:
            raise ValueError(f"Unknown evaluation case ids: {sorted(unknown)}")
    report = run_evaluations(dataset, args.mode, selected)
    print_report(report)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return 0 if report["summary"]["score"] >= args.min_score else 1


if __name__ == "__main__":
    raise SystemExit(main())
