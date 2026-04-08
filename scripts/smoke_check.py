"""Lightweight local smoke check for LUX Money AI.

Run from the repository root:
    python scripts/smoke_check.py

It uses Flask's in-process test client, so it does not need a browser or a
running server. It intentionally reads the configured SQLite DB but does not
modify it.
"""

from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app as finance_app  # noqa: E402


GET_ENDPOINTS = [
    "/",
    "/api/health",
    "/api/auth/status",
    "/api/transactions?source=sample",
    "/api/dashboard-summary?source=sample",
    "/api/monthly-summary?source=sample",
    "/api/analytics-12m?source=sample",
    "/api/recurring-transactions?source=sample",
    "/manifest.json",
    "/sw.js",
    "/icon.svg",
]


def assert_ok(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    finance_app.init_db()
    client = finance_app.app.test_client()

    for endpoint in GET_ENDPOINTS:
        response = client.get(endpoint)
        assert_ok(response.status_code == 200, f"{endpoint} returned {response.status_code}")

    token = client.get("/api/auth/status").get_json()["csrfToken"]
    chat_response = client.post(
        "/api/chat",
        headers={"X-CSRF-Token": token},
        json={
            "message": "Tổng quan tháng này thế nào?",
            "scope": "month",
            "source": "sample",
        },
    )
    assert_ok(chat_response.status_code == 200, f"/api/chat returned {chat_response.status_code}")

    health = client.get("/api/health").get_json()
    assert_ok(health["status"] == "ok", f"health status is {health['status']}")
    assert_ok(health["database"]["integrity"] == "ok", "database integrity check failed")

    print("Smoke check passed.")
    print(f"Transactions: {health['database']['tables'].get('transactions', 0)}")
    print(f"OpenAI configured: {health['openai']['configured']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
