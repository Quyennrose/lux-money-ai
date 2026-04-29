import io
import sqlite3
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app as finance_app


def csrf_headers(client):
    token = client.get("/api/auth/status").get_json()["csrfToken"]
    return {"X-CSRF-Token": token}


@pytest.fixture()
def client(tmp_path):
    original_db_path = finance_app.DB_PATH
    finance_app.DB_PATH = str(tmp_path / "test-finance.db")
    finance_app.app.config.update(TESTING=True)
    finance_app.init_db()
    finance_app.seed_demo_profile()

    with finance_app.app.test_client() as test_client:
        yield test_client

    finance_app.DB_PATH = original_db_path


def test_dashboard_and_source_filters_use_demo_data(client):
    sample_transactions = client.get("/api/transactions?source=sample")
    real_transactions = client.get("/api/transactions?source=real")
    dashboard = client.get("/api/dashboard-summary?source=sample")
    analytics = client.get("/api/analytics-12m?source=sample")
    ai_insight = client.get("/api/ai-insight?month=2026-04&source=sample")

    assert sample_transactions.status_code == 200
    assert real_transactions.status_code == 200
    assert dashboard.status_code == 200
    assert analytics.status_code == 200
    assert ai_insight.status_code == 200
    assert len(sample_transactions.get_json()) > 0
    assert real_transactions.get_json() == []
    assert analytics.get_json()["monthly"]
    assert ai_insight.get_json()["spending_insights"]


def test_transaction_crud_marks_manual_source(client):
    create_response = client.post(
        "/api/transactions",
        headers=csrf_headers(client),
        json={
            "date": "2026-04-20",
            "note": "pytest manual coffee",
            "amount": 45000,
            "type": "expense",
            "category": "Ăn uống",
        },
    )
    assert create_response.status_code == 200
    transaction_id = create_response.get_json()["id"]

    update_response = client.put(
        f"/api/transactions/{transaction_id}",
        headers=csrf_headers(client),
        json={
            "date": "2026-04-21",
            "note": "pytest manual lunch",
            "amount": 75000,
            "type": "expense",
            "category": "Ăn uống",
        },
    )
    assert update_response.status_code == 200

    manual_transactions = client.get("/api/transactions?source=manual&search=pytest").get_json()
    assert len(manual_transactions) == 1
    assert manual_transactions[0]["source"] == "manual"
    assert manual_transactions[0]["note"] == "pytest manual lunch"

    delete_response = client.delete(f"/api/transactions/{transaction_id}", headers=csrf_headers(client))
    assert delete_response.status_code == 200
    assert client.get("/api/transactions?source=manual&search=pytest").get_json() == []


def test_csv_preview_import_and_duplicate_skip(client):
    csv_data = (
        "date,amount,note,type,category\n"
        "2026-04-22,123456,pytest csv import,expense,Khác\n"
    )
    preview_response = client.post(
        "/api/import/csv/preview",
        headers=csrf_headers(client),
        data={"file": (io.BytesIO(csv_data.encode("utf-8")), "transactions.csv")},
        content_type="multipart/form-data",
    )
    assert preview_response.status_code == 200
    preview = preview_response.get_json()
    assert preview["suggestedMapping"]["date_column"] == "date"
    assert preview["previewRows"][0]["transaction"]["amount"] == 123456

    def import_file():
        return client.post(
            "/api/import/csv",
            headers=csrf_headers(client),
            data={"file": (io.BytesIO(csv_data.encode("utf-8")), "transactions.csv")},
            content_type="multipart/form-data",
        )

    first_import = import_file()
    duplicate_import = import_file()
    assert first_import.status_code == 200
    assert duplicate_import.status_code == 200
    assert first_import.get_json()["inserted"] == 1
    assert duplicate_import.get_json()["skippedDuplicates"] == 1

    imported = client.get("/api/transactions?source=import&search=pytest").get_json()
    assert len(imported) == 1
    assert imported[0]["source"] == "import"


def test_import_infers_mdy_dates_from_csv(client):
    csv_data = (
        "Date,Description,Amount,Transaction Type,Category\n"
        "01/02/2018,pytest mdy first,10.00,debit,Test\n"
        "01/13/2018,pytest mdy signal,20.00,debit,Test\n"
    )
    preview_response = client.post(
        "/api/import/csv/preview",
        headers=csrf_headers(client),
        data={"file": (io.BytesIO(csv_data.encode("utf-8")), "transactions.csv")},
        content_type="multipart/form-data",
    )
    assert preview_response.status_code == 200
    preview = preview_response.get_json()
    assert preview["suggestedMapping"]["date_order"] == "mdy"
    assert preview["previewRows"][0]["transaction"]["date"] == "2018-01-02"


def test_import_parses_excel_serial_dates():
    assert finance_app.parse_import_date("43102") == "2018-01-02"


def test_clear_imported_transactions_keeps_manual_and_sample(client):
    csv_data = (
        "date,amount,note,type,category\n"
        "2026-04-22,123456,pytest clear import,expense,Khác\n"
    )
    import_response = client.post(
        "/api/import/csv",
        headers=csrf_headers(client),
        data={"file": (io.BytesIO(csv_data.encode("utf-8")), "transactions.csv")},
        content_type="multipart/form-data",
    )
    assert import_response.status_code == 200
    assert import_response.get_json()["inserted"] == 1

    manual_response = client.post(
        "/api/transactions",
        headers=csrf_headers(client),
        json={
            "date": "2026-04-23",
            "note": "pytest clear manual",
            "amount": 1000,
            "type": "expense",
            "category": "Khác",
        },
    )
    assert manual_response.status_code == 200

    clear_response = client.delete("/api/import/csv", headers=csrf_headers(client))
    assert clear_response.status_code == 200
    assert clear_response.get_json()["deleted"] == 1
    assert client.get("/api/transactions?source=import&search=pytest clear").get_json() == []
    assert len(client.get("/api/transactions?source=manual&search=pytest clear").get_json()) == 1
    assert len(client.get("/api/transactions?source=sample").get_json()) > 0


def test_recurring_rules_and_report_export(client):
    recurring_response = client.get("/api/recurring-transactions?source=sample")
    assert recurring_response.status_code == 200
    recurring = recurring_response.get_json()
    assert recurring["items"]
    first_item = recurring["items"][0]

    ignore_response = client.post(
        "/api/recurring-rules",
        headers=csrf_headers(client),
        json={
            "ruleKey": first_item["ruleKey"],
            "note": first_item["note"],
            "category": first_item["category"],
            "status": "ignored",
        },
    )
    assert ignore_response.status_code == 200

    after_ignore = client.get("/api/recurring-transactions?source=sample").get_json()
    ignored_items = [item for item in after_ignore["items"] if item["ruleKey"] == first_item["ruleKey"]]
    assert ignored_items and ignored_items[0]["status"] == "ignored"

    report_response = client.get("/api/export/report?month=2026-04&source=sample")
    assert report_response.status_code == 200
    assert report_response.mimetype == "text/html"
    assert "Báo cáo tài chính" in report_response.get_data(as_text=True)


def test_test_database_is_temporary(client):
    assert "test-finance.db" in finance_app.DB_PATH
    with sqlite3.connect(finance_app.DB_PATH) as conn:
        total = conn.execute("SELECT COUNT(*) FROM transactions").fetchone()[0]
    assert total > 0


def test_auth_register_login_logout_and_user_owned_transaction(client):
    register = client.post(
        "/api/auth/register",
        headers=csrf_headers(client),
        json={"email": "pytest@example.com", "name": "Pytest User", "password": "secret123"},
    )
    assert register.status_code == 200
    assert register.get_json()["user"]["email"] == "pytest@example.com"

    create_response = client.post(
        "/api/transactions",
        headers=csrf_headers(client),
        json={
            "date": "2026-04-23",
            "note": "pytest owned transaction",
            "amount": 99000,
            "type": "expense",
            "category": "Khác",
        },
    )
    assert create_response.status_code == 200
    transaction = client.get("/api/transactions?source=manual&search=pytest owned").get_json()[0]
    assert transaction["userId"] is not None

    logout = client.post("/api/auth/logout", headers=csrf_headers(client))
    assert logout.status_code == 200
    status = client.get("/api/auth/status").get_json()
    assert status["authenticated"] is False

    login = client.post("/api/auth/login", headers=csrf_headers(client), json={"email": "pytest@example.com", "password": "secret123"})
    assert login.status_code == 200
    assert client.get("/api/auth/status").get_json()["authenticated"] is True


def test_backup_endpoint_and_static_pwa_files(client, monkeypatch):
    health = client.get("/api/health")
    assert health.status_code == 200
    health_json = health.get_json()
    assert health_json["status"] == "ok"
    assert health_json["database"]["integrity"] == "ok"
    assert health_json["database"]["tables"]["transactions"] > 0

    unauthenticated_backup = client.get("/api/backup/db")
    assert unauthenticated_backup.status_code == 401

    monkeypatch.setenv("ADMIN_EMAILS", "admin@example.com")
    register = client.post(
        "/api/auth/register",
        headers=csrf_headers(client),
        json={"email": "admin@example.com", "name": "Admin", "password": "secret123"},
    )
    assert register.status_code == 200
    assert register.get_json()["user"]["isAdmin"] is True

    backup = client.get("/api/backup/db")
    assert backup.status_code == 200
    assert backup.headers["Content-Disposition"].startswith("attachment;")
    assert backup.data.startswith(b"SQLite format 3")

    manifest = client.get("/manifest.json")
    service_worker = client.get("/sw.js")
    icon = client.get("/icon.svg")
    assert manifest.status_code == 200
    assert service_worker.status_code == 200
    assert icon.status_code == 200
    assert "Lux Money AI" in manifest.get_data(as_text=True)


def test_csrf_required_for_state_changing_requests(client):
    response = client.post(
        "/api/transactions",
        json={
            "date": "2026-04-24",
            "note": "pytest no csrf",
            "amount": 1000,
            "type": "expense",
            "category": "Khác",
        },
    )
    assert response.status_code == 403
    assert "CSRF" in response.get_json()["error"]

    same_origin = client.post(
        "/api/chat",
        headers={"Origin": "http://localhost"},
        json={"message": "test", "month": "2026-04", "source": "sample"},
    )
    assert same_origin.status_code == 200
