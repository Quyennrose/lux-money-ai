import os
import sqlite3
import calendar
import shutil
import tempfile
import secrets
import time
from functools import wraps
from datetime import UTC, datetime, timedelta
from urllib.parse import urlparse
from flask import Flask, request, jsonify, send_from_directory, Response, send_file, session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix
import csv
import io
import json
import unicodedata
import html

try:
    from openai import OpenAI, OpenAIError
except ImportError:  # The app can still run without AI dependencies installed.
    OpenAI = None
    OpenAIError = RuntimeError

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.getenv("DB_PATH", os.path.join(BASE_DIR, "finance.db"))

if load_dotenv:
    load_dotenv(os.path.join(BASE_DIR, ".env"))
else:
    env_path = os.path.join(BASE_DIR, ".env")
    if os.path.exists(env_path):
        with open(env_path, encoding="utf-8") as env_file:
            for line in env_file:
                key, separator, value = line.strip().partition("=")
                if separator and key and not key.startswith("#"):
                    os.environ.setdefault(key, value.strip().strip('"').strip("'"))

CATEGORY_KEYWORDS = {
    "Ăn uống": ["quán", "cafe", "ăn", "uống", "đồ ăn", "coffee", "restaurant"],
    "Đi lại": ["taxi", "grab", "uber", "xăng", "vé", "bus", "metro"],
    "Giải trí": ["rạp", "game", "net", "mua sắm", "shopping", "movie"],
    "Hóa đơn": ["điện", "nước", "internet", "điện thoại", "gas", "bill"],
    "Mua sắm": ["shop", "đồ", "quần áo", "electronics", "mua"],
    "Tiết kiệm": ["tiết kiệm", "vay", "gửi", "savings"],
    "Đầu tư": ["cổ phiếu", "crypto", "vốn", "đầu tư", "fund"],
}
DEFAULT_CATEGORY = "Khác"
VALID_TRANSACTION_TYPES = {"income", "expense"}
VALID_TRANSACTION_SOURCES = {"sample", "manual", "import"}
VALID_SOURCE_FILTERS = {"all", "sample", "manual", "import", "real"}
OPENAI_MODEL = "gpt-4.1-mini"
APP_VERSION = "1.0.0"
DEMO_TRANSACTION_NOTES = {
    "Lương tháng",
    "Đầu tư ETF định kỳ",
    "Tiền thuê nhà",
    "Điện nước và internet",
    "Mua thực phẩm siêu thị",
    "Grab và gửi xe đi làm",
    "Ăn ngoài cuối tuần",
    "Netflix và xem phim",
    "Mua đồ cá nhân",
    "Cafe và ăn trưa",
    "Khám sức khỏe định kỳ",
    "Du lịch ngắn ngày",
    "Thưởng dự án",
    "Khóa học và sách",
}

app = Flask(__name__, static_folder="static", template_folder="static")
app.secret_key = os.getenv("SECRET_KEY", "dev-local-secret-change-me")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true",
    MAX_CONTENT_LENGTH=int(os.getenv("MAX_UPLOAD_MB", "5")) * 1024 * 1024,
)
if os.getenv("USE_PROXY_FIX", "true").lower() == "true":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
LOGIN_ATTEMPTS = {}
LOGIN_WINDOW_SECONDS = 300
LOGIN_MAX_ATTEMPTS = 8


def env_bool(name: str, default: bool = False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def admin_emails():
    return {item.strip().lower() for item in os.getenv("ADMIN_EMAILS", "").split(",") if item.strip()}


def utc_now():
    return datetime.now(UTC)


def utc_today():
    return utc_now().date()


def current_month_utc():
    return utc_now().strftime("%Y-%m")


def current_user_id():
    return session.get("user_id")


def current_user_payload():
    if not current_user_id():
        return None
    email = session.get("user_email")
    return {
        "id": session.get("user_id"),
        "email": email,
        "name": session.get("user_name"),
        "isAdmin": bool(email and email.lower() in admin_emails()),
    }


def current_user_is_admin():
    user = current_user_payload()
    return bool(user and user.get("isAdmin"))


def admin_required(route_handler):
    @wraps(route_handler)
    def wrapper(*args, **kwargs):
        if not current_user_id():
            return jsonify({"error": "Bạn cần đăng nhập để dùng chức năng này."}), 401
        if not current_user_is_admin():
            return jsonify({"error": "Chức năng này chỉ dành cho admin."}), 403
        return route_handler(*args, **kwargs)

    return wrapper


@app.after_request
def add_security_headers(response):
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    if request.is_secure or app.config.get("SESSION_COOKIE_SECURE"):
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


def ensure_csrf_token():
    token = session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["csrf_token"] = token
    return token


def csrf_exempt_endpoint():
    return request.endpoint in {"index", "send_static", "static"}


def is_same_origin_request():
    fetch_site = request.headers.get("Sec-Fetch-Site")
    if fetch_site in {"same-origin", "same-site", "none"}:
        return True

    expected = urlparse(request.host_url)
    for header_name in ("Origin", "Referer"):
        value = request.headers.get(header_name)
        if not value:
            continue
        parsed = urlparse(value)
        if parsed.scheme == expected.scheme and parsed.netloc == expected.netloc:
            return True
    return False


@app.before_request
def protect_state_changing_requests():
    ensure_csrf_token()
    if request.method in {"POST", "PUT", "PATCH", "DELETE"} and not csrf_exempt_endpoint():
        expected = session.get("csrf_token")
        provided = request.headers.get("X-CSRF-Token")
        token_is_valid = bool(expected and provided and secrets.compare_digest(expected, provided))
        if not token_is_valid and not is_same_origin_request():
            return jsonify({"error": "CSRF token không hợp lệ. Hãy refresh trang và thử lại."}), 403


def rate_limit_login(email: str):
    now = time.monotonic()
    key = f"{request.remote_addr or 'local'}:{email.lower()}"
    attempts = [timestamp for timestamp in LOGIN_ATTEMPTS.get(key, []) if now - timestamp < LOGIN_WINDOW_SECONDS]
    if len(attempts) >= LOGIN_MAX_ATTEMPTS:
        LOGIN_ATTEMPTS[key] = attempts
        return False
    attempts.append(now)
    LOGIN_ATTEMPTS[key] = attempts
    return True


def reset_login_attempts(email: str):
    key = f"{request.remote_addr or 'local'}:{email.lower()}"
    LOGIN_ATTEMPTS.pop(key, None)


def parse_positive_float(value, field_name: str):
    try:
        amount = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} phải là số hợp lệ")
    if amount <= 0:
        raise ValueError(f"{field_name} phải lớn hơn 0")
    return amount


def parse_non_negative_float(value, field_name: str):
    try:
        amount = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} phải là số hợp lệ")
    if amount < 0:
        raise ValueError(f"{field_name} không được âm")
    return amount


def normalize_date(value: str | None, default: str | None = None):
    if not value:
        return default
    try:
        return datetime.strptime(value, "%Y-%m-%d").date().isoformat()
    except (TypeError, ValueError):
        raise ValueError("Ngày không hợp lệ, định dạng cần là YYYY-MM-DD")


def normalize_month(value: str | None, default: str | None = None):
    if not value:
        return default
    try:
        return datetime.strptime(value, "%Y-%m").strftime("%Y-%m")
    except (TypeError, ValueError):
        raise ValueError("Tháng không hợp lệ, định dạng cần là YYYY-MM")


def clean_text(value, default: str = ""):
    if value is None:
        return default
    return str(value).strip()


def normalize_source_filter(value):
    source = clean_text(value, "all").lower()
    return source if source in VALID_SOURCE_FILTERS else "all"


def normalize_transaction_source(value, default="manual"):
    source = clean_text(value, default).lower()
    return source if source in VALID_TRANSACTION_SOURCES else default


def append_source_filter(clauses, params, source):
    source = normalize_source_filter(source)
    if source == "real":
        clauses.append("COALESCE(source, 'manual') != ?")
        params.append("sample")
    elif source in VALID_TRANSACTION_SOURCES:
        clauses.append("COALESCE(source, 'manual') = ?")
        params.append(source)
    return clauses, params


def append_transaction_visibility(clauses, params):
    user_id = current_user_id()
    if user_id:
        clauses.append("(COALESCE(source, 'manual') = 'sample' OR user_id IS NULL OR user_id = ?)")
        params.append(user_id)
    else:
        clauses.append("(COALESCE(source, 'manual') = 'sample' OR user_id IS NULL)")
    return clauses, params


def append_owned_record_visibility(clauses, params):
    user_id = current_user_id()
    if user_id:
        clauses.append("(user_id IS NULL OR user_id = ?)")
        params.append(user_id)
    else:
        clauses.append("user_id IS NULL")
    return clauses, params


def owned_record_condition(params):
    user_id = current_user_id()
    if user_id:
        params.append(user_id)
        return "(user_id IS NULL OR user_id = ?)"
    return "user_id IS NULL"


def normalize_column_name(value):
    return normalize_ai_text(clean_text(value)).replace("_", " ").replace("-", " ")


def parse_import_date(value):
    text = clean_text(value)
    if not text:
        raise ValueError("Thiếu ngày giao dịch")
    text = text.split("T")[0].split(" ")[0]
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d", "%d.%m.%Y"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue
    raise ValueError(f"Ngày không hợp lệ: {value}")


def parse_import_amount(value):
    text = clean_text(value)
    if not text:
        return 0.0
    negative = text.startswith("(") and text.endswith(")")
    text = (
        text.replace("VND", "")
        .replace("₫", "")
        .replace("đ", "")
        .replace(" ", "")
        .replace("(", "")
        .replace(")", "")
    )
    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif text.count(".") > 1:
        text = text.replace(".", "")
    elif text.count(",") > 1:
        text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", "")
    amount = float(text)
    return -amount if negative else amount


def normalize_import_type(value, amount=None):
    text = normalize_ai_text(value)
    if text in {"income", "thu", "thu nhap", "credit", "in", "tien vao"}:
        return "income"
    if text in {"expense", "chi", "chi tieu", "debit", "out", "tien ra"}:
        return "expense"
    return "expense" if float(amount or 0) < 0 else "income"


def pick_csv_column(headers, requested, candidates):
    if requested and requested in headers:
        return requested
    normalized = {normalize_column_name(header): header for header in headers}
    if requested:
        normalized_requested = normalize_column_name(requested)
        if normalized_requested in normalized:
            return normalized[normalized_requested]
    for candidate in candidates:
        if normalize_column_name(candidate) in normalized:
            return normalized[normalize_column_name(candidate)]
    return None


CSV_COLUMN_CANDIDATES = {
    "date_column": ["date", "ngày", "ngay", "transaction date", "posted date"],
    "amount_column": ["amount", "số tiền", "so tien", "money", "value"],
    "debit_column": ["debit", "withdrawal", "chi", "tien ra", "out"],
    "credit_column": ["credit", "deposit", "thu", "tien vao", "in"],
    "note_column": ["note", "description", "memo", "nội dung", "noi dung", "ghi chú", "ghi chu", "details"],
    "type_column": ["type", "loại", "loai", "direction"],
    "category_column": ["category", "danh mục", "danh muc"],
}


def transaction_to_dict(row):
    tx = dict(row)
    tx_date = tx.get("date") or (tx.get("timestamp") or "")[:10]
    note = tx.get("note") or tx.get("description") or ""
    return {
        "id": tx["id"],
        "date": tx_date,
        "category": tx.get("category") or DEFAULT_CATEGORY,
        "amount": round(float(tx.get("amount") or 0), 2),
        "type": tx.get("type") or "expense",
        "source": normalize_transaction_source(tx.get("source")),
        "userId": tx.get("user_id"),
        "note": note,
        # Backward-compatible fields used by older frontend code/export.
        "timestamp": tx.get("timestamp") or f"{tx_date}T00:00:00",
        "description": tx.get("description") or note,
    }


def get_monthly_trends():
    clauses = []
    params = []
    append_transaction_visibility(clauses, params)
    where_sql = "WHERE " + " AND ".join(clauses)
    conn = get_db_connection()
    rows = conn.execute(f"""
        SELECT strftime('%Y-%m', date) as month,
               type,
               SUM(amount) as total
        FROM transactions
        {where_sql}
        GROUP BY strftime('%Y-%m', date), type
        ORDER BY month
    """, params).fetchall()
    conn.close()
    trends = {}
    for row in rows:
        month = row["month"]
        if month not in trends:
            trends[month] = {"income": 0.0, "expense": 0.0}
        trends[month][row["type"]] = row["total"]
    return [{"month": k, "income": v["income"], "expense": v["expense"], "balance": v["income"] - v["expense"]} for k, v in trends.items()]


def get_monthly_summary(source: str = "all"):
    clauses = []
    params = []
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    where_sql = "WHERE " + " AND ".join(clauses) if clauses else ""
    conn = get_db_connection()
    rows = conn.execute(
        f"""
        SELECT strftime('%Y-%m', date) as month,
               SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
        FROM transactions
        {where_sql}
        GROUP BY strftime('%Y-%m', date)
        ORDER BY month ASC
        """,
        params,
    ).fetchall()
    conn.close()
    return [
        {
            "month": row["month"],
            "total_income": round(float(row["total_income"] or 0), 2),
            "total_expense": round(float(row["total_expense"] or 0), 2),
        }
        for row in rows
        if row["month"]
    ]


def get_monthly_transactions(source: str = "all"):
    transactions = query_transactions(source=source)
    grouped = {}
    for tx in sorted(transactions, key=lambda item: (item["date"], item["id"]), reverse=True):
        month = tx["date"][:7]
        grouped.setdefault(month, []).append(tx)
    return [{"month": month, "transactions": grouped[month]} for month in sorted(grouped.keys(), reverse=True)]


def get_category_summary(month: str = None, source: str = "all"):
    clauses = ["type = 'expense'"]
    params = []
    if month:
        clauses.append("date LIKE ?")
        params.append(f"{month}-%")
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    conn = get_db_connection()
    rows = conn.execute(
        f"""
        SELECT category, SUM(amount) as total
        FROM transactions
        WHERE {' AND '.join(clauses)}
        GROUP BY category
        ORDER BY total DESC
        """,
        params,
    ).fetchall()
    conn.close()
    return [{"category": row["category"], "total": round(float(row["total"] or 0), 2)} for row in rows]


def recurring_rule_key(category, note):
    return f"{normalize_column_name(category)}::{normalize_column_name(note)[:64]}"


def get_recurring_rules():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM recurring_rules").fetchall()
    conn.close()
    return {row["rule_key"]: dict(row) for row in rows}


def detect_recurring_transactions(source: str = "all"):
    transactions = query_transactions(source=source)
    rules = get_recurring_rules()
    buckets = {}
    for tx in transactions:
        if tx["type"] != "expense":
            continue
        key = recurring_rule_key(tx["category"], tx["note"])
        buckets.setdefault(key, []).append(tx)

    recurring = []
    for rule_key, items in buckets.items():
        months = sorted({item["date"][:7] for item in items})
        if len(items) >= 2 and len(months) >= 2:
            sorted_items = sorted(items, key=lambda item: item["date"], reverse=True)
            sample = sorted_items[0]
            recent_amounts = [float(item["amount"]) for item in sorted_items[:3]]
            estimated_amount = sum(recent_amounts) / len(recent_amounts)
            rule = rules.get(rule_key, {})
            recurring.append({
                "ruleKey": rule_key,
                "note": sample["note"],
                "category": sample["category"],
                "estimatedAmount": round(estimated_amount, 2),
                "occurrences": len(items),
                "months": months[-4:],
                "status": rule.get("status", "likely"),
                "label": {"confirmed": "Confirmed", "ignored": "Ignored"}.get(rule.get("status"), "Likely recurring"),
            })
    return sorted(recurring, key=lambda item: (item["status"] == "ignored", -item["occurrences"]))[:12]


def get_dashboard_summary(month: str = None, source: str = "all"):
    month = month or current_month_utc()
    previous_month = (datetime.strptime(month + "-01", "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m")
    current = get_summary(month, source)
    previous = get_summary(previous_month, source)
    monthly_summary = get_monthly_summary(source)
    category_summary = get_category_summary(month, source)
    transactions = query_transactions(month, source=source)
    expenses = [tx for tx in transactions if tx["type"] == "expense"]
    total_income = current["income"]
    total_expense = current["expense"]
    savings_rate = round(((total_income - total_expense) / total_income) * 100, 2) if total_income > 0 else 0.0
    top_category = category_summary[0] if category_summary else None
    biggest_expense = max(expenses, key=lambda tx: tx["amount"], default=None)
    average_monthly_expense = round(
        sum(item["total_expense"] for item in monthly_summary) / max(len(monthly_summary), 1), 2
    )
    highest_spending_month = max(monthly_summary, key=lambda item: item["total_expense"], default=None)
    comparison = {
        "previousMonth": previous_month,
        "incomeChange": round(total_income - previous["income"], 2),
        "expenseChange": round(total_expense - previous["expense"], 2),
        "cashFlowChange": round(current["balance"] - previous["balance"], 2),
    }
    quick_insights = []
    if top_category:
        quick_insights.append(f"Top spending category this month: {top_category['category']} ({top_category['total']:,.0f} VND).")
    if biggest_expense:
        quick_insights.append(f"Biggest expense: {biggest_expense['note']} at {biggest_expense['amount']:,.0f} VND.")
    if comparison["expenseChange"] > 0:
        quick_insights.append(f"Expenses increased {comparison['expenseChange']:,.0f} VND versus {previous_month}.")
    elif previous["expense"] > 0:
        quick_insights.append(f"Expenses decreased {abs(comparison['expenseChange']):,.0f} VND versus {previous_month}.")
    if not quick_insights:
        quick_insights.append("Add more transactions to unlock richer monthly insights.")

    return {
        "month": month,
        "totalIncome": total_income,
        "totalExpense": total_expense,
        "netCashFlow": current["balance"],
        "savingsRate": savings_rate,
        "topSpendingCategory": top_category,
        "biggestExpense": biggest_expense,
        "quickInsights": quick_insights,
        "comparison": comparison,
        "averageMonthlyExpense": average_monthly_expense,
        "highestSpendingMonth": highest_spending_month,
        "recurringTransactions": [item for item in detect_recurring_transactions(source) if item["status"] != "ignored"],
        "categorySummary": category_summary,
    }


def get_analytics_12m(month: str = None, source: str = "all"):
    month = normalize_month(month, current_month_utc())
    start_month = add_months(month, -11)
    month_start_date = datetime.strptime(month + "-01", "%Y-%m-%d").date()
    days_in_month = calendar.monthrange(month_start_date.year, month_start_date.month)[1]
    monthly = [
        item for item in get_monthly_summary(source)
        if start_month <= item["month"] <= month
    ]
    if not monthly:
        return {
            "month": month,
            "startMonth": start_month,
            "monthly": [],
            "summary": {},
            "categoryTotals": [],
            "categoryTrend": [],
            "dailySpending": [],
            "compareToAverage": {},
        }

    enriched = []
    for item in monthly:
        income = float(item["total_income"] or 0)
        expense = float(item["total_expense"] or 0)
        cash_flow = income - expense
        savings_rate = round((cash_flow / income) * 100, 2) if income > 0 else 0.0
        enriched.append({
            **item,
            "cash_flow": round(cash_flow, 2),
            "savings_rate": savings_rate,
        })

    total_income = sum(item["total_income"] for item in enriched)
    total_expense = sum(item["total_expense"] for item in enriched)
    total_cash_flow = total_income - total_expense
    average_income = total_income / max(len(enriched), 1)
    average_expense = total_expense / max(len(enriched), 1)
    average_savings_rate = (total_cash_flow / total_income) * 100 if total_income > 0 else 0.0
    current_month_record = next((item for item in enriched if item["month"] == month), None)
    best_cash_flow_month = max(enriched, key=lambda item: item["cash_flow"])
    highest_expense_month = max(enriched, key=lambda item: item["total_expense"])
    lowest_savings_month = min(enriched, key=lambda item: item["savings_rate"])

    conn = get_db_connection()
    category_clauses = ["type = 'expense'", "date >= ?", "date <= ?"]
    category_params = [f"{start_month}-01", f"{month}-31"]
    append_source_filter(category_clauses, category_params, source)
    append_transaction_visibility(category_clauses, category_params)
    category_rows = conn.execute(
        """
        SELECT category, SUM(amount) as total
        FROM transactions
        WHERE """ + " AND ".join(category_clauses) + """
        GROUP BY category
        ORDER BY total DESC
        """,
        category_params,
    ).fetchall()
    daily_clauses = ["type = 'expense'", "date LIKE ?"]
    daily_params = [f"{month}-%"]
    append_source_filter(daily_clauses, daily_params, source)
    append_transaction_visibility(daily_clauses, daily_params)
    daily_rows = conn.execute(
        """
        SELECT date, SUM(amount) as total
        FROM transactions
        WHERE """ + " AND ".join(daily_clauses) + """
        GROUP BY date
        ORDER BY date
        """,
        daily_params,
    ).fetchall()
    conn.close()
    category_totals = [{"category": row["category"], "total": round(float(row["total"] or 0), 2)} for row in category_rows]
    top_categories = [item["category"] for item in category_totals[:5]]
    month_labels = [item["month"] for item in enriched]
    category_trend = []
    if top_categories:
        conn = get_db_connection()
        placeholders = ",".join("?" for _ in top_categories)
        trend_clauses = ["type = 'expense'", "date >= ?", "date <= ?", f"category IN ({placeholders})"]
        trend_params = [f"{start_month}-01", f"{month}-31", *top_categories]
        append_source_filter(trend_clauses, trend_params, source)
        append_transaction_visibility(trend_clauses, trend_params)
        trend_rows = conn.execute(
            f"""
            SELECT substr(date, 1, 7) as month, category, SUM(amount) as total
            FROM transactions
            WHERE {' AND '.join(trend_clauses)}
            GROUP BY month, category
            ORDER BY month
            """,
            trend_params,
        ).fetchall()
        conn.close()
        trend_lookup = {(row["month"], row["category"]): round(float(row["total"] or 0), 2) for row in trend_rows}
        category_trend = [
            {
                "category": category,
                "months": month_labels,
                "values": [trend_lookup.get((month_label, category), 0.0) for month_label in month_labels],
            }
            for category in top_categories
        ]

    daily_lookup = {row["date"]: round(float(row["total"] or 0), 2) for row in daily_rows}
    max_daily_spend = max(daily_lookup.values(), default=0)
    daily_spending = []
    for day in range(1, days_in_month + 1):
        date_value = f"{month}-{day:02d}"
        total = daily_lookup.get(date_value, 0.0)
        level = 0 if total <= 0 or max_daily_spend <= 0 else min(4, max(1, int((total / max_daily_spend) * 4)))
        daily_spending.append({
            "date": date_value,
            "day": day,
            "total": total,
            "level": level,
        })

    compare_to_average = {}
    if current_month_record:
        compare_to_average = {
            "incomeDelta": round(current_month_record["total_income"] - average_income, 2),
            "expenseDelta": round(current_month_record["total_expense"] - average_expense, 2),
            "cashFlowDelta": round(current_month_record["cash_flow"] - (total_cash_flow / max(len(enriched), 1)), 2),
            "savingsRateDelta": round(current_month_record["savings_rate"] - average_savings_rate, 2),
            "currentExpense": round(current_month_record["total_expense"], 2),
            "averageExpense": round(average_expense, 2),
        }

    return {
        "month": month,
        "startMonth": start_month,
        "monthly": enriched,
        "categoryTotals": category_totals,
        "categoryTrend": category_trend,
        "dailySpending": daily_spending,
        "compareToAverage": compare_to_average,
        "summary": {
            "totalIncome": round(total_income, 2),
            "totalExpense": round(total_expense, 2),
            "totalCashFlow": round(total_cash_flow, 2),
            "averageMonthlyIncome": round(average_income, 2),
            "averageMonthlyExpense": round(average_expense, 2),
            "averageSavingsRate": round(average_savings_rate, 2),
            "bestCashFlowMonth": best_cash_flow_month,
            "highestExpenseMonth": highest_expense_month,
            "lowestSavingsMonth": lowest_savings_month,
            "topCategory": category_totals[0] if category_totals else None,
        },
    }


def get_db_connection():
    db_dir = os.path.dirname(os.path.abspath(DB_PATH))
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_health_snapshot():
    snapshot = {
        "status": "ok",
        "version": APP_VERSION,
        "timestamp": utc_now().isoformat(),
        "database": {
            "path": os.path.basename(DB_PATH),
            "exists": os.path.exists(DB_PATH),
            "integrity": "unknown",
            "tables": {},
        },
        "openai": {
            "model": OPENAI_MODEL,
            "configured": bool(os.getenv("OPENAI_API_KEY")),
            "sdkAvailable": OpenAI is not None,
        },
        "pwa": {
            "manifest": os.path.exists(os.path.join(app.static_folder, "manifest.json")),
            "serviceWorker": os.path.exists(os.path.join(app.static_folder, "sw.js")),
            "icon": os.path.exists(os.path.join(app.static_folder, "icon.svg")),
        },
        "auth": {
            "authenticated": bool(current_user_id()),
            "csrfReady": bool(session.get("csrf_token")),
            "secureCookie": bool(app.config.get("SESSION_COOKIE_SECURE")),
        },
    }
    if not snapshot["database"]["exists"]:
        snapshot["status"] = "degraded"
        return snapshot

    try:
        conn = get_db_connection()
        snapshot["database"]["integrity"] = conn.execute("PRAGMA integrity_check").fetchone()[0]
        for table in ("transactions", "budgets", "goals", "users", "recurring_rules"):
            try:
                snapshot["database"]["tables"][table] = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            except sqlite3.Error:
                snapshot["database"]["tables"][table] = None
        conn.close()
        if snapshot["database"]["integrity"] != "ok":
            snapshot["status"] = "degraded"
    except sqlite3.Error as error:
        snapshot["status"] = "degraded"
        snapshot["database"]["integrity"] = f"error: {error}"
    return snapshot


def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            note TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            description TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'manual',
            user_id INTEGER
        )
        """
    )
    cur.execute("PRAGMA table_info(transactions)")
    transaction_columns = {row["name"] for row in cur.fetchall()}
    if "date" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN date TEXT")
    if "note" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN note TEXT")
    if "timestamp" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN timestamp TEXT")
    if "description" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN description TEXT")
    if "source" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN source TEXT DEFAULT 'manual'")
    if "user_id" not in transaction_columns:
        cur.execute("ALTER TABLE transactions ADD COLUMN user_id INTEGER")

    cur.execute(
        """
        UPDATE transactions
        SET date = COALESCE(NULLIF(date, ''), substr(timestamp, 1, 10), date('now')),
            note = COALESCE(NULLIF(note, ''), description, ''),
            timestamp = COALESCE(NULLIF(timestamp, ''), COALESCE(NULLIF(date, ''), date('now')) || 'T00:00:00'),
            description = COALESCE(NULLIF(description, ''), note, ''),
            source = COALESCE(NULLIF(source, ''), 'manual')
        """
    )
    if DEMO_TRANSACTION_NOTES:
        demo_placeholders = ",".join("?" for _ in DEMO_TRANSACTION_NOTES)
        cur.execute(
            f"""
            UPDATE transactions
            SET source = 'sample'
            WHERE note IN ({demo_placeholders})
               OR description IN ({demo_placeholders})
            """,
            [*DEMO_TRANSACTION_NOTES, *DEMO_TRANSACTION_NOTES],
        )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            month TEXT NOT NULL,
            user_id INTEGER
        )
        """
    )
    cur.execute("PRAGMA table_info(budgets)")
    budget_columns = {row["name"] for row in cur.fetchall()}
    if "user_id" not in budget_columns:
        cur.execute("ALTER TABLE budgets ADD COLUMN user_id INTEGER")
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS recurring_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rule_key TEXT NOT NULL UNIQUE,
            note TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'confirmed',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            target_amount REAL NOT NULL,
            saved_amount REAL NOT NULL,
            deadline TEXT NOT NULL,
            created_at TEXT NOT NULL,
            user_id INTEGER
        )
        """
    )
    cur.execute("PRAGMA table_info(goals)")
    goal_columns = {row["name"] for row in cur.fetchall()}
    if "user_id" not in goal_columns:
        cur.execute("ALTER TABLE goals ADD COLUMN user_id INTEGER")
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def classify_transaction(description: str) -> str:
    text = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category
    return DEFAULT_CATEGORY


def insert_transaction(description, amount, type_, category=None, transaction_date=None, source="manual"):
    if not category:
        category = classify_transaction(description)

    date_value = normalize_date(transaction_date, utc_today().isoformat())
    timestamp = f"{date_value}T00:00:00"
    source = normalize_transaction_source(source)

    conn = get_db_connection()
    cursor = conn.execute(
        """
        INSERT INTO transactions (date, category, amount, type, note, timestamp, description, source, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (date_value, category, amount, type_, description, timestamp, description, source, current_user_id()),
    )
    conn.commit()
    transaction_id = cursor.lastrowid
    conn.close()

    return {"id": transaction_id, "category": category}


def add_months(month: str, offset: int):
    year, month_number = map(int, month.split("-"))
    month_index = (year * 12 + month_number - 1) + offset
    new_year = month_index // 12
    new_month = month_index % 12 + 1
    return f"{new_year:04d}-{new_month:02d}"


def seed_demo_profile():
    current_month = current_month_utc()
    start_month = add_months(current_month, -11)
    demo_transactions = []

    for index in range(12):
        month = add_months(start_month, index)
        month_number = int(month[-2:])
        income = 28500000 + (index % 4) * 700000
        rent = 8500000 + (1 if month_number >= 7 else 0) * 300000
        bills = 1120000 + (month_number % 3) * 90000
        groceries = 1450000 + (index % 5) * 120000
        eating_out = 780000 + (index % 4) * 130000
        transport = 620000 + (index % 3) * 90000
        shopping = 1250000 + (index % 6) * 320000
        investment = 4200000 + (index % 3) * 400000

        demo_transactions.extend([
            (f"{month}-01", "Lương", income, "income", "Lương tháng"),
            (f"{month}-02", "Đầu tư", investment, "expense", "Đầu tư ETF định kỳ"),
            (f"{month}-03", "Nhà ở", rent, "expense", "Tiền thuê nhà"),
            (f"{month}-04", "Hóa đơn", bills, "expense", "Điện nước và internet"),
            (f"{month}-05", "Ăn uống", groceries, "expense", "Mua thực phẩm siêu thị"),
            (f"{month}-07", "Đi lại", transport, "expense", "Grab và gửi xe đi làm"),
            (f"{month}-11", "Ăn uống", eating_out, "expense", "Ăn ngoài cuối tuần"),
            (f"{month}-13", "Giải trí", 590000 + (index % 2) * 220000, "expense", "Netflix và xem phim"),
            (f"{month}-18", "Mua sắm", shopping, "expense", "Mua đồ cá nhân"),
            (f"{month}-24", "Ăn uống", 520000 + (index % 3) * 100000, "expense", "Cafe và ăn trưa"),
        ])

        if month_number in {1, 4, 7, 10}:
            demo_transactions.append((f"{month}-09", "Sức khỏe", 1450000 + index * 30000, "expense", "Khám sức khỏe định kỳ"))
        if month_number in {2, 6, 11}:
            demo_transactions.append((f"{month}-16", "Du lịch", 3600000 + index * 250000, "expense", "Du lịch ngắn ngày"))
        if month_number in {3, 9, 12}:
            demo_transactions.append((f"{month}-20", "Lương", 4500000 + index * 180000, "income", "Thưởng dự án"))
        if month_number in {5, 8, 12}:
            demo_transactions.append((f"{month}-22", "Học tập", 1800000 + index * 120000, "expense", "Khóa học và sách"))

    current_day = utc_today().day
    demo_transactions = [
        tx for tx in demo_transactions
        if tx[0][:7] != current_month or int(tx[0][-2:]) <= current_day
    ]

    conn = get_db_connection()
    seed_notes = sorted({note for _, _, _, _, note in demo_transactions})
    placeholders = ",".join("?" for _ in seed_notes)
    legacy_demo_pattern = "[Demo " + "Lan " + "Anh]%"
    conn.execute("DELETE FROM transactions WHERE note LIKE ? OR description LIKE ?", (legacy_demo_pattern, legacy_demo_pattern))
    if seed_notes:
        conn.execute(
            f"""
            DELETE FROM transactions
            WHERE date >= ? AND date <= ? AND note IN ({placeholders})
            """,
            [f"{start_month}-01", f"{current_month}-31", *seed_notes],
        )
    for date_value, category, amount, type_, note in demo_transactions:
        timestamp = f"{date_value}T00:00:00"
        conn.execute(
            """
            INSERT INTO transactions (date, category, amount, type, note, timestamp, description, source, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (date_value, category, amount, type_, note, timestamp, note, "sample", None),
        )

    budget_categories = [
        ("Ăn uống", 4200000),
        ("Mua sắm", 2800000),
        ("Giải trí", 1200000),
        ("Đi lại", 1300000),
        ("Du lịch", 4500000),
        ("Hóa đơn", 1700000),
        ("Đầu tư", 5200000),
    ]
    demo_budgets = [
        (category, amount, add_months(current_month, offset))
        for offset in range(-2, 1)
        for category, amount in budget_categories
    ]
    for category, amount, month in demo_budgets:
        exists = conn.execute(
            "SELECT id FROM budgets WHERE category = ? AND amount = ? AND month = ?",
            (category, amount, month),
        ).fetchone()
        if not exists:
            conn.execute("INSERT INTO budgets (category, amount, month, user_id) VALUES (?, ?, ?, ?)", (category, amount, month, None))

    conn.execute("DELETE FROM goals WHERE name LIKE ? OR name IN (?, ?)", (legacy_demo_pattern, "Quỹ khẩn cấp 6 tháng", "Du lịch Nhật Bản"))
    conn.execute(
        "INSERT INTO goals (name, target_amount, saved_amount, deadline, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        (
            "Quỹ khẩn cấp 6 tháng",
            120000000,
            52000000,
            f"{int(current_month[:4]) + 1}-03-31",
            utc_now().isoformat(),
            None,
        ),
    )
    conn.execute(
        "INSERT INTO goals (name, target_amount, saved_amount, deadline, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        (
            "Du lịch Nhật Bản",
            80000000,
            18000000,
            f"{int(current_month[:4]) + 1}-10-30",
            utc_now().isoformat(),
            None,
        ),
    )
    conn.commit()
    conn.close()
    return {"month": current_month, "startMonth": start_month, "transactions": len(demo_transactions)}


def update_transaction(transaction_id, description, amount, type_, category=None, transaction_date=None):
    if not category:
        category = classify_transaction(description)

    date_value = normalize_date(transaction_date, utc_today().isoformat())
    timestamp = f"{date_value}T00:00:00"
    ownership_params = [transaction_id]
    ownership_condition = owned_record_condition(ownership_params)

    conn = get_db_connection()
    cursor = conn.execute(
        f"""
        UPDATE transactions
        SET date = ?, category = ?, amount = ?, type = ?, note = ?, timestamp = ?, description = ?
        WHERE id = ? AND {ownership_condition}
        """,
        (date_value, category, amount, type_, description, timestamp, description, *ownership_params),
    )
    conn.commit()
    conn.close()
    return cursor.rowcount


def read_csv_upload(file_storage):
    raw = file_storage.read()
    if not raw:
        raise ValueError("File CSV đang trống")
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = raw.decode("utf-8-sig", errors="replace")
    sample = text[:2048]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    if not reader.fieldnames:
        raise ValueError("CSV cần có dòng header")
    return reader.fieldnames, list(reader)


def resolve_csv_mapping(headers, mapping):
    return {
        key: pick_csv_column(headers, mapping.get(key), candidates)
        for key, candidates in CSV_COLUMN_CANDIDATES.items()
    }


def normalize_csv_transaction_row(row, resolved_mapping):
    date_col = resolved_mapping.get("date_column")
    amount_col = resolved_mapping.get("amount_column")
    debit_col = resolved_mapping.get("debit_column")
    credit_col = resolved_mapping.get("credit_column")
    note_col = resolved_mapping.get("note_column")
    type_col = resolved_mapping.get("type_column")
    category_col = resolved_mapping.get("category_column")

    if not date_col:
        raise ValueError("Không tìm thấy cột ngày. Hãy nhập tên cột ngày.")
    if not amount_col and not (debit_col or credit_col):
        raise ValueError("Không tìm thấy cột số tiền. Hãy nhập cột amount hoặc debit/credit.")

    date_value = parse_import_date(row.get(date_col))
    note = clean_text(row.get(note_col), "Imported transaction") if note_col else "Imported transaction"
    if amount_col:
        raw_amount = parse_import_amount(row.get(amount_col))
        type_ = normalize_import_type(row.get(type_col) if type_col else "", raw_amount)
        amount = abs(raw_amount)
    else:
        credit_amount = parse_import_amount(row.get(credit_col)) if credit_col else 0.0
        debit_amount = parse_import_amount(row.get(debit_col)) if debit_col else 0.0
        if credit_amount:
            amount = abs(credit_amount)
            type_ = "income"
        else:
            amount = abs(debit_amount)
            type_ = "expense"
    if amount <= 0:
        raise ValueError("Số tiền phải lớn hơn 0")
    category = clean_text(row.get(category_col)) if category_col else classify_transaction(note)
    return {
        "date": date_value,
        "note": note,
        "amount": amount,
        "type": type_,
        "category": category or DEFAULT_CATEGORY,
    }


def validate_csv_mapping(resolved_mapping):
    if not resolved_mapping.get("date_column"):
        raise ValueError("Không tìm thấy cột ngày. Hãy chọn cột ngày trong preview.")
    if not resolved_mapping.get("amount_column") and not (
        resolved_mapping.get("debit_column") or resolved_mapping.get("credit_column")
    ):
        raise ValueError("Không tìm thấy cột số tiền. Hãy chọn cột amount hoặc debit/credit trong preview.")


def preview_transactions_from_csv(file_storage, mapping, limit=8):
    headers, rows = read_csv_upload(file_storage)
    resolved_mapping = resolve_csv_mapping(headers, mapping)
    preview_rows = []
    errors = []
    for row_number, row in enumerate(rows[:limit], start=2):
        try:
            preview_rows.append({
                "row": row_number,
                "raw": row,
                "transaction": normalize_csv_transaction_row(row, resolved_mapping),
            })
        except Exception as error:
            errors.append({"row": row_number, "error": str(error), "raw": row})
    return {
        "headers": headers,
        "suggestedMapping": resolved_mapping,
        "previewRows": preview_rows,
        "errors": errors,
        "totalRows": len(rows),
    }


def import_transactions_from_csv(file_storage, mapping):
    headers, rows = read_csv_upload(file_storage)
    resolved_mapping = resolve_csv_mapping(headers, mapping)
    validate_csv_mapping(resolved_mapping)

    inserted = 0
    skipped_duplicates = 0
    errors = []
    conn = get_db_connection()
    try:
        for row_number, row in enumerate(rows, start=2):
            try:
                transaction = normalize_csv_transaction_row(row, resolved_mapping)
                timestamp = f"{transaction['date']}T00:00:00"
                duplicate = conn.execute(
                    """
                    SELECT id FROM transactions
                    WHERE date = ? AND amount = ? AND type = ? AND note = ?
                    LIMIT 1
                    """,
                    (transaction["date"], transaction["amount"], transaction["type"], transaction["note"]),
                ).fetchone()
                if duplicate:
                    skipped_duplicates += 1
                    continue
                conn.execute(
                    """
                    INSERT INTO transactions (date, category, amount, type, note, timestamp, description, source, user_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        transaction["date"],
                        transaction["category"],
                        transaction["amount"],
                        transaction["type"],
                        transaction["note"],
                        timestamp,
                        transaction["note"],
                        "import",
                        current_user_id(),
                    ),
                )
                inserted += 1
            except Exception as error:
                errors.append({"row": row_number, "error": str(error)})
        conn.commit()
    finally:
        conn.close()

    return {
        "inserted": inserted,
        "skippedDuplicates": skipped_duplicates,
        "errors": errors[:20],
        "errorCount": len(errors),
    }


def query_transactions(month: str = None, type_: str = None, category: str = None, search: str = None, sort: str = "newest", source: str = "all"):
    conn = get_db_connection()
    clauses = []
    params = []
    if month:
        clauses.append("date LIKE ?")
        params.append(f"{month}-%")
    if type_ in VALID_TRANSACTION_TYPES:
        clauses.append("type = ?")
        params.append(type_)
    if category:
        clauses.append("category = ?")
        params.append(category)
    if search:
        clauses.append("(LOWER(note) LIKE ? OR LOWER(description) LIKE ?)")
        params.extend([f"%{search.lower()}%", f"%{search.lower()}%"])
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)

    order_by = {
        "newest": "date DESC, id DESC",
        "oldest": "date ASC, id ASC",
        "highest": "amount DESC, date DESC",
        "lowest": "amount ASC, date DESC",
    }.get(sort, "date DESC, id DESC")

    sql = "SELECT * FROM transactions"
    if clauses:
        sql += " WHERE " + " AND ".join(clauses)
    sql += f" ORDER BY {order_by}"
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return [transaction_to_dict(row) for row in rows]


def query_budgets(month: str = None):
    conn = get_db_connection()
    clauses = []
    params = []
    if month:
        clauses.append("month = ?")
        params.append(month)
    append_owned_record_visibility(clauses, params)
    where_sql = "WHERE " + " AND ".join(clauses)
    order_by = "category" if month else "month DESC"
    rows = conn.execute(f"SELECT * FROM budgets {where_sql} ORDER BY {order_by}", params).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def query_goals():
    conn = get_db_connection()
    clauses = []
    params = []
    append_owned_record_visibility(clauses, params)
    rows = conn.execute(f"SELECT * FROM goals WHERE {' AND '.join(clauses)} ORDER BY created_at DESC", params).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_user_by_email(email: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email.lower(),)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_id(user_id: int):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def set_user_session(user):
    session["user_id"] = user["id"]
    session["user_email"] = user["email"]
    session["user_name"] = user["name"]


def insert_goal(name: str, target_amount: float, saved_amount: float, deadline: str):
    created_at = utc_now().isoformat()
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO goals (name, target_amount, saved_amount, deadline, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        (name, target_amount, saved_amount, deadline, created_at, current_user_id()),
    )
    conn.commit()
    conn.close()


def get_category_totals(month: str = None, source: str = "all"):
    clauses = []
    params = []
    if month:
        clauses.append("date LIKE ?")
        params.append(f"{month}-%")
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    where_sql = "WHERE " + " AND ".join(clauses) if clauses else ""
    conn = get_db_connection()
    rows = conn.execute(
        f"""
        SELECT category, type, SUM(amount) as total
        FROM transactions
        {where_sql}
        GROUP BY category, type
        """,
        params,
    ).fetchall()
    conn.close()
    categories = {}
    for row in rows:
        row = dict(row)
        categories.setdefault(row["category"], {"income": 0.0, "expense": 0.0})
        categories[row["category"]][row["type"]] = row["total"]
    return categories


def get_budget_progress(month: str = None, source: str = "all"):
    if month is None:
        month = current_month_utc()
    budgets = query_budgets(month)
    clauses = ["type = 'expense'", "date LIKE ?"]
    params = [f"{month}-%"]
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    conn = get_db_connection()
    rows = conn.execute(
        f"SELECT category, SUM(amount) as total FROM transactions WHERE {' AND '.join(clauses)} GROUP BY category",
        params,
    ).fetchall()
    conn.close()
    spent_by_category = {row["category"]: row["total"] for row in rows}
    progress = []
    for budget in budgets:
        spent = spent_by_category.get(budget["category"], 0.0)
        percent = min(round((spent / budget["amount"]) * 100, 2), 100.0) if budget["amount"] > 0 else 0.0
        progress.append({
            "category": budget["category"],
            "budgetAmount": round(budget["amount"], 2),
            "spent": round(spent, 2),
            "month": month,
            "usedPercent": percent,
            "status": "Quá ngân sách" if spent > budget["amount"] else "Ổn định",
        })
    return progress


def round_money(value: float, step: int = 50000):
    return round(float(value or 0) / step) * step


def get_budget_suggestions(month: str = None, source: str = "all"):
    month = normalize_month(month, current_month_utc())
    start_month = add_months(month, -6)
    clauses = ["type = 'expense'", "date >= ?", "date < ?"]
    params = [f"{start_month}-01", f"{month}-01"]
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    conn = get_db_connection()
    rows = conn.execute(
        f"""
        SELECT category, strftime('%Y-%m', date) as month, SUM(amount) as total
        FROM transactions
        WHERE {' AND '.join(clauses)}
        GROUP BY category, strftime('%Y-%m', date)
        ORDER BY category, month
        """,
        params,
    ).fetchall()
    if not rows:
        fallback_clauses = ["type = 'expense'", "date LIKE ?"]
        fallback_params = [f"{month}-%"]
        append_source_filter(fallback_clauses, fallback_params, source)
        append_transaction_visibility(fallback_clauses, fallback_params)
        rows = conn.execute(
            f"""
            SELECT category, strftime('%Y-%m', date) as month, SUM(amount) as total
            FROM transactions
            WHERE {' AND '.join(fallback_clauses)}
            GROUP BY category, strftime('%Y-%m', date)
            ORDER BY category, month
            """,
            fallback_params,
        ).fetchall()
    budgets = {row["category"]: row["amount"] for row in conn.execute("SELECT category, amount FROM budgets WHERE month = ?", (month,))}
    conn.close()

    grouped = {}
    active_months = sorted({row["month"] for row in rows if row["month"]})
    divisor = max(len(active_months), 1)
    for row in rows:
        grouped.setdefault(row["category"], []).append(float(row["total"] or 0))

    suggestions = []
    for category, totals in grouped.items():
        average = sum(totals) / divisor
        recent = totals[-1] if totals else 0
        suggested = round_money(max(average * 1.1, recent))
        if suggested <= 0:
            continue
        if recent > average * 1.15:
            trend = "đang tăng"
        elif recent < average * 0.85:
            trend = "đang giảm"
        else:
            trend = "ổn định"
        current_budget = budgets.get(category)
        suggestions.append({
            "category": category,
            "averageExpense": round(average, 2),
            "recentExpense": round(recent, 2),
            "suggestedAmount": round(float(suggested), 2),
            "currentBudget": round(float(current_budget), 2) if current_budget is not None else None,
            "trend": trend,
            "basisMonths": divisor,
            "targetMonth": month,
        })

    return sorted(suggestions, key=lambda item: item["suggestedAmount"], reverse=True)


def get_goals_summary():
    goals = query_goals()
    result = []
    for goal in goals:
        saved_amount = goal["saved_amount"]
        target_amount = goal["target_amount"]
        percent = min(round((saved_amount / target_amount) * 100, 2), 100.0) if target_amount > 0 else 0.0
        result.append({
            "id": goal["id"],
            "name": goal["name"],
            "targetAmount": round(target_amount, 2),
            "savedAmount": round(saved_amount, 2),
            "deadline": goal["deadline"],
            "progressPercent": percent,
            "status": "Hoàn thành" if saved_amount >= target_amount else "Đang theo dõi",
        })
    return result


def compute_goal_allocation(goals: list, available_savings: float):
    plan = []
    sorted_goals = sorted(goals, key=lambda g: g["deadline"])
    remaining = available_savings
    for goal in sorted_goals:
        if goal["status"] == "Hoàn thành":
            plan.append({
                "goal": goal["name"],
                "recommendedMonthly": 0.0,
                "note": "Đã hoàn thành"
            })
            continue
        months_left = max((datetime.fromisoformat(goal["deadline"]).date() - utc_today()).days // 30, 1)
        needed = max(goal["targetAmount"] - goal["savedAmount"], 0)
        recommended = round(min(needed / months_left, remaining), 2)
        remaining -= recommended
        plan.append({
            "goal": goal["name"],
            "recommendedMonthly": recommended,
            "note": "Ưu tiên ngắn hạn" if months_left <= 3 else "Theo dõi dài hạn"
        })
    return plan


def build_optimization_plan(income: float, expense: float, category_totals: dict, budget_progress: list, goals: list, forecast: dict):
    available_savings = max(income - expense, 0)
    overspent = [item for item in budget_progress if item["spent"] > item["budgetAmount"]]
    expense_categories = [
        (category, totals.get("expense", 0.0))
        for category, totals in category_totals.items()
        if totals.get("expense", 0.0) > 0
    ]
    top_categories = sorted(expense_categories, key=lambda x: x[1], reverse=True)[:3]
    category_actions = [
        {
            "category": category,
            "amount": amount,
            "suggestion": "Xem lại chi phí và tìm cách cắt giảm 10-20% nếu có thể"
        }
        for category, amount in top_categories
    ]
    goal_plan = compute_goal_allocation(goals, available_savings)
    actions = []

    # AI-enhanced actions
    if available_savings <= 0:
        actions.append("⚠️ Không còn dư để tiết kiệm. Ưu tiên: Tăng thu nhập hoặc cắt giảm chi tiêu thiết yếu.")
        actions.append("Gợi ý AI: Xem xét bán đồ không dùng hoặc làm việc thêm.")
    else:
        savings_rate = (available_savings / income) * 100 if income > 0 else 0
        if savings_rate > 25:
            actions.append(f"🎉 Tỷ lệ tiết kiệm {savings_rate:.1f}% xuất sắc! Đầu tư phần dư vào quỹ khẩn cấp.")
        elif savings_rate > 15:
            actions.append(f"✅ Tỷ lệ tiết kiệm {savings_rate:.1f}% tốt. Tiếp tục và tăng dần.")
        else:
            actions.append(f"📈 Tỷ lệ tiết kiệm {savings_rate:.1f}% cần cải thiện. Mục tiêu 20% thu nhập.")

    if overspent:
        actions.append("🚨 Một số danh mục đã vượt ngân sách. Cần điều chỉnh ngay để tránh nợ.")
        for item in overspent[:2]:
            actions.append(f"• {item['category']}: Vượt {item['usedPercent']:.1f}% - cắt giảm {item['spent'] - item['budgetAmount']:.0f} VND")

    trends = get_monthly_trends()
    if len(trends) > 2:
        recent_trend = trends[-3:]
        improving = all(r["balance"] >= p["balance"] for r, p in zip(recent_trend[1:], recent_trend[:-1]))
        if improving:
            actions.append("📈 Xu hướng tài chính đang cải thiện. Duy trì và mở rộng tiết kiệm.")
        else:
            actions.append("📉 Xu hướng tài chính có dấu hiệu suy giảm. Cần phân tích và điều chỉnh.")

    if forecast.get("trend") == "Tiết kiệm tốt":
        actions.append("💡 Dòng tiền khả quan; có thể tăng tỷ lệ đóng góp cho mục tiêu dài hạn hoặc đầu tư.")
    elif forecast.get("trend") == "Chi tiêu vượt thu nhập":
        actions.append("⚠️ Dự báo cho thấy chi tiêu vượt thu nhập. Ưu tiên ngân sách và tiết kiệm.")

    # Personalized AI suggestions
    if len(goals) > 2:
        actions.append("🎯 Bạn có nhiều mục tiêu. Ưu tiên 1-2 mục tiêu chính để tập trung.")
    if expense > income * 0.9:
        actions.append("🔍 Phân tích: Chi tiêu gần bằng thu nhập. Tạo quỹ khẩn cấp 3-6 tháng lương.")

    return {
        "availableSavings": round(available_savings, 2),
        "overspentCategories": overspent,
        "topExpenseCategories": category_actions,
        "goalAllocation": goal_plan,
        "actions": actions,
    }


def build_ai_metrics(income: float, expense: float, budget_progress: list, goals: list, forecast: dict):
    score = 40
    savings_rate = ((income - expense) / income) * 100 if income > 0 else 0
    score += min(30, savings_rate * 1.2)
    score -= min(20, len([b for b in budget_progress if b["usedPercent"] >= 90]) * 10)
    goal_progress_avg = sum(g["progressPercent"] for g in goals) / max(len(goals), 1)
    score += min(20, goal_progress_avg * 0.15)
    if forecast.get("trend") == "Tiết kiệm tốt":
        score += 5
    elif forecast.get("trend") == "Chi tiêu vượt thu nhập":
        score -= 10
    score = max(0, min(100, round(score)))

    if expense > income or expense > income * 0.9:
        risk = "Cao"
    elif expense > income * 0.75:
        risk = "Trung bình"
    else:
        risk = "Thấp"

    completed_goals = len([g for g in goals if g["status"] == "Hoàn thành"])
    goal_summary = f"{completed_goals} mục tiêu đã hoàn thành" if completed_goals else "Chưa có mục tiêu hoàn thành"
    summary_text = (
        f"AI VIP đánh giá: Điểm {score} / 100, mức rủi ro {risk}. "
        f"Tỷ lệ tiết kiệm {savings_rate:.1f}% và {goal_summary}."
    )

    return {
        "score": score,
        "risk_level": risk,
        "summaryText": summary_text,
    }


def build_financial_profile(income: float, expense: float, budget_progress: list, goals: list, forecast: dict):
    savings_rate = ((income - expense) / income) * 100 if income > 0 else 0
    monthly_savings = max(income - expense, 0)
    recommended_savings_goal = round(income * 0.2, 2)
    recommended_expense_cap = round(income * 0.65, 2)

    if income == 0:
        financial_style = "Chờ dữ liệu tài chính"
    elif savings_rate >= 25:
        financial_style = "Ngân sách vững chắc"
    elif savings_rate >= 15:
        financial_style = "Cân bằng"
    else:
        financial_style = "Tập trung tiết kiệm"

    goal_recommendations = []
    sorted_goals = sorted(goals, key=lambda g: g["deadline"])
    for goal in sorted_goals:
        if goal["status"] != "Hoàn thành":
            goal_recommendations.append(
                f"Ưu tiên '{goal['name']}': cần {round(max(goal['targetAmount'] - goal['savedAmount'], 0) / max(((datetime.fromisoformat(goal['deadline']).date() - utc_today()).days / 30), 1), 2)} VND/tháng để hoàn thành đúng hạn."
            )
            if len(goal_recommendations) >= 3:
                break

    if not goal_recommendations:
        goal_recommendations.append("Bạn chưa có mục tiêu chi tiêu cụ thể. Hãy đặt mục tiêu tiết kiệm hoặc đầu tư rõ ràng.")

    goal_progress_avg = sum(g["progressPercent"] for g in goals) / max(len(goals), 1)

    blueprint = []
    blueprint.append(f"Nên duy trì tiết kiệm ít nhất {recommended_savings_goal:,} VND mỗi tháng.")
    blueprint.append(f"Giới hạn chi tiêu tối ưu: không quá {recommended_expense_cap:,} VND/tháng nếu muốn duy trì dòng tiền lành mạnh.")
    if forecast.get("trend") == "Chi tiêu vượt thu nhập":
        blueprint.append("Cần giảm chi tiêu để tránh thâm hụt trong 30 ngày tới.")
    elif forecast.get("trend") == "Tiết kiệm tốt":
        blueprint.append("Xây dựng thêm quỹ đầu tư hoặc quỹ khẩn cấp từ phần dư tài chính.")

    budget_total = sum(b["budgetAmount"] for b in budget_progress)
    if budget_total > 0:
        adherence = round(max(0, 100 - max(0, (expense - budget_total) / budget_total * 100)), 2)
        adherence_text = f"{adherence}% tuân thủ ngân sách" if adherence >= 0 else "Không có ngân sách phù hợp"
    else:
        adherence = None
        adherence_text = "Chưa thiết lập ngân sách để đánh giá"

    health_index = 40
    health_index += min(30, savings_rate)
    health_index += min(15, goal_progress_avg * 0.2)
    if adherence is not None:
        health_index += min(15, adherence * 0.15)
    health_index = max(0, min(100, round(health_index)))

    top_overspent = [item for item in budget_progress if item["spent"] > item["budgetAmount"]]
    top_overspent_text = []
    for item in top_overspent[:3]:
        top_overspent_text.append(
            f"{item['category']}: vượt {round(item['spent'] - item['budgetAmount']):,} VND ({item['usedPercent']}%)."
        )
    if not top_overspent_text:
        top_overspent_text.append("Không có danh mục vượt ngân sách. Điều đó rất tốt.")

    priority_goal = next((goal for goal in sorted_goals if goal["status"] != "Hoàn thành"), None)
    priority_goal_text = (
        f"Ưu tiên: {priority_goal['name']} với khoản cần thêm {round(max(priority_goal['targetAmount'] - priority_goal['savedAmount'], 0), 2):,} VND."
        if priority_goal else
        "Hiện tại không có mục tiêu cần ưu tiên."
    )

    return {
        "financialStyle": financial_style,
        "recommendedExpenseCap": recommended_expense_cap,
        "recommendedSavingsGoal": recommended_savings_goal,
        "monthlySavings": monthly_savings,
        "priorityGoal": priority_goal_text,
        "goalRecommendations": goal_recommendations,
        "financialBlueprint": blueprint,
        "budgetAdherence": adherence,
        "budgetAdherenceText": adherence_text,
        "healthIndex": health_index,
        "topOverspentCategories": top_overspent_text,
    }


def get_summary(month: str = None, source: str = "all"):
    clauses = []
    params = []
    if month:
        clauses.append("date LIKE ?")
        params.append(f"{month}-%")
    append_source_filter(clauses, params, source)
    append_transaction_visibility(clauses, params)
    where_sql = "WHERE " + " AND ".join(clauses) if clauses else ""
    conn = get_db_connection()
    rows = conn.execute(
        f"SELECT type, SUM(amount) as total, category FROM transactions {where_sql} GROUP BY type, category",
        params,
    ).fetchall()
    conn.close()
    income = 0.0
    expense = 0.0
    category_breakdown = {}
    for row in rows:
        row = dict(row)
        if row["type"] == "income":
            income += row["total"]
        else:
            expense += row["total"]
        category_breakdown.setdefault(row["category"], 0.0)
        category_breakdown[row["category"]] += row["total"]

    forecast = forecast_cashflow()
    budget_progress = get_budget_progress(month, source)
    goals = get_goals_summary()
    category_totals = get_category_totals(month, source)
    advice = generate_advice(income, expense, forecast, budget_progress, goals)
    optimization = build_optimization_plan(income, expense, category_totals, budget_progress, goals, forecast)
    ai_metrics = build_ai_metrics(income, expense, budget_progress, goals, forecast)
    profile = build_financial_profile(income, expense, budget_progress, goals, forecast)

    return {
        "income": round(income, 2),
        "expense": round(expense, 2),
        "balance": round(income - expense, 2),
        "categoryBreakdown": {k: round(v, 2) for k, v in category_breakdown.items()},
        "forecast": forecast,
        "budgetProgress": budget_progress,
        "goals": goals,
        "advice": advice,
        "optimization": optimization,
        "aiScore": ai_metrics["score"],
        "riskLevel": ai_metrics["risk_level"],
        "vipSummary": ai_metrics["summaryText"],
        "financialStyle": profile["financialStyle"],
        "recommendedExpenseCap": profile["recommendedExpenseCap"],
        "recommendedSavingsGoal": profile["recommendedSavingsGoal"],
        "monthlySavings": profile["monthlySavings"],
        "priorityGoal": profile["priorityGoal"],
        "goalRecommendations": profile["goalRecommendations"],
        "financialBlueprint": profile["financialBlueprint"],
        "budgetAdherenceText": profile["budgetAdherenceText"],
        "healthIndex": profile["healthIndex"],
        "topOverspentCategories": profile["topOverspentCategories"],
    }


def forecast_cashflow():
    conn = get_db_connection()
    rows = conn.execute("SELECT date, amount, type FROM transactions").fetchall()
    conn.close()
    if not rows:
        return {
            "next30DaysIncome": 0.0,
            "next30DaysExpense": 0.0,
            "recommendedSavings": 0.0,
            "trend": "Chưa có dữ liệu"
        }

    cutoff = utc_today() - timedelta(days=90)
    totals = {"income": 0.0, "expense": 0.0}
    active_days = set()
    for row in [dict(row) for row in rows]:
        create_date = datetime.fromisoformat(row["date"]).date()
        if create_date >= cutoff and row["type"] in totals:
            totals[row["type"]] += row["amount"]
            active_days.add(create_date)

    days = max((utc_today() - cutoff).days, 1)
    if active_days:
        first_active_day = min(active_days)
        days = max((utc_today() - first_active_day).days + 1, 1)

    income_avg = totals["income"] / days
    expense_avg = totals["expense"] / days
    savings = max(income_avg - expense_avg, 0)
    trend = "Ổn định"
    if expense_avg > income_avg:
        trend = "Chi tiêu vượt thu nhập"
    elif income_avg > expense_avg * 1.2:
        trend = "Tiết kiệm tốt"

    return {
        "next30DaysIncome": round(income_avg * 30, 2),
        "next30DaysExpense": round(expense_avg * 30, 2),
        "recommendedSavings": round(max(savings * 30 * 0.8, 0), 2),
        "trend": trend,
    }


def generate_advice(income: float, expense: float, forecast: dict, budget_progress: list, goals: list):
    advice = []
    trends = get_monthly_trends()
    if len(trends) > 1:
        recent = trends[-1]
        previous = trends[-2] if len(trends) > 1 else None
        if previous:
            income_change = ((recent["income"] - previous["income"]) / previous["income"]) * 100 if previous["income"] > 0 else 0
            expense_change = ((recent["expense"] - previous["expense"]) / previous["expense"]) * 100 if previous["expense"] > 0 else 0
            if income_change > 10:
                advice.append(f"Thu nhập tăng {income_change:.1f}% so với tháng trước - xu hướng tích cực!")
            elif income_change < -10:
                advice.append(f"Thu nhập giảm {abs(income_change):.1f}% - cần xem xét nguồn thu nhập.")
            if expense_change > 15:
                advice.append(f"Chi tiêu tăng {expense_change:.1f}% - cần kiểm soát để tránh vượt ngân sách.")

    if income == 0:
        advice.append("Hãy nhập thu nhập để ứng dụng bắt đầu phân tích.")
    if expense > income:
        advice.append("Chi tiêu đang lớn hơn thu nhập. Cần xem lại ngân sách và tiết kiệm chi tiêu linh hoạt.")
        advice.append("Gợi ý: Giảm chi tiêu ở danh mục giải trí và ăn uống ngoài kế hoạch.")
    else:
        savings_rate = ((income - expense) / income) * 100 if income > 0 else 0
        if savings_rate > 20:
            advice.append(f"Tỷ lệ tiết kiệm {savings_rate:.1f}% rất tốt! Tiếp tục duy trì.")
        elif savings_rate < 10:
            advice.append(f"Tỷ lệ tiết kiệm chỉ {savings_rate:.1f}%. Hãy cố gắng tiết kiệm ít nhất 15% thu nhập.")

    for budget in budget_progress:
        if budget["usedPercent"] >= 90:
            advice.append(f"Ngân sách {budget['category']} sắp cạn. Hãy theo dõi và điều chỉnh trước khi hết tháng.")
        elif budget["usedPercent"] >= 70:
            advice.append(f"Ngân sách {budget['category']} đang dùng {budget['usedPercent']}%. Giữ chi tiêu hợp lý.")

    for goal in goals:
        if goal["progressPercent"] >= 100:
            advice.append(f"Mục tiêu '{goal['name']}' đã hoàn thành. Hãy đặt mục tiêu mới hoặc nâng cao dự định tiết kiệm.")
        elif goal["progressPercent"] >= 70:
            advice.append(f"Mục tiêu '{goal['name']}' đạt {goal['progressPercent']}%. Tiếp tục duy trì quỹ đều đặn.")
        elif goal["progressPercent"] < 30:
            advice.append(f"Mục tiêu '{goal['name']}' chỉ đạt {goal['progressPercent']}%. Cần tăng tốc tiết kiệm.")

    if len(budget_progress) > 0:
        advice.append("Mẹo AI: Theo dõi chi tiêu hàng ngày để tránh vượt ngân sách bất ngờ.")
    if len(goals) == 0:
        advice.append("Gợi ý: Đặt mục tiêu tiết kiệm cụ thể để có động lực tài chính.")
    if expense / max(income, 1) > 0.8:
        advice.append("Cảnh báo: Chi tiêu chiếm >80% thu nhập. Hãy lập kế hoạch tiết kiệm khẩn cấp.")

    if not advice:
        advice.append("Dữ liệu hiện ổn định. Tiếp tục cập nhật giao dịch để AI đưa ra gợi ý chính xác hơn.")

    return advice


def build_local_ai_insight(transactions, month=None):
    expense_totals = {}
    income = 0.0
    expense = 0.0
    expense_transactions = []
    for tx in transactions:
        amount = float(tx["amount"])
        if tx["type"] == "income":
            income += amount
        else:
            expense += amount
            expense_totals[tx["category"]] = expense_totals.get(tx["category"], 0.0) + amount
            expense_transactions.append(tx)

    top_categories = sorted(expense_totals.items(), key=lambda item: item[1], reverse=True)[:3]
    biggest_expense = max(expense_transactions, key=lambda tx: float(tx["amount"]), default=None)
    balance = income - expense
    savings_rate = round((balance / income) * 100, 1) if income > 0 else 0.0
    suggestions = []
    if expense > income and income > 0:
        suggestions.append("Chi tiêu đang vượt thu nhập. Hãy giảm các khoản không thiết yếu trong kỳ tới.")
    elif income > 0:
        suggestions.append(f"Tỷ lệ tiết kiệm hiện là {savings_rate}%. Nếu muốn tăng nhanh, đặt trần tuần cho danh mục chi lớn nhất.")
    if top_categories:
        top_category, top_amount = top_categories[0]
        top_share = round((top_amount / expense) * 100, 1) if expense else 0.0
        suggestions.append(f"Rà soát {top_category}: đang chiếm {top_share}% tổng chi. Đây là điểm cắt giảm ưu tiên.")
    if biggest_expense:
        note = biggest_expense["note"] or biggest_expense["category"]
        suggestions.append(f"Kiểm tra giao dịch lớn nhất: {note} ({float(biggest_expense['amount']):,.0f} VND) để xem có thể giảm hoặc tách ngân sách không.")
    if not suggestions:
        suggestions.append("Thêm thêm giao dịch để nhận gợi ý chi tiết hơn.")

    return {
        "spending_insights": [
            f"Kỳ phân tích: {month or 'dữ liệu hiện có'} với {len(transactions)} giao dịch.",
            f"Thu nhập {income:,.0f} VND, chi tiêu {expense:,.0f} VND, dòng tiền ròng {balance:,.0f} VND.",
            f"Tỷ lệ tiết kiệm: {savings_rate}%.",
        ],
        "patterns": [
            f"{category}: {amount:,.0f} VND ({round((amount / expense) * 100, 1) if expense else 0}%)"
            for category, amount in top_categories
        ] or ["Chưa đủ dữ liệu để phát hiện mẫu chi tiêu."],
        "suggestions": suggestions,
    }


def generate_openai_insight(transactions, month=None):
    if not transactions:
        return {
            "spending_insights": ["Chưa có giao dịch để phân tích."],
            "patterns": [],
            "suggestions": ["Hãy thêm thu nhập và chi tiêu để AI có dữ liệu phân tích."],
        }
    if OpenAI is None:
        raise RuntimeError("Thiếu thư viện OpenAI. Hãy chạy: pip install -r requirements.txt")
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("Thiếu OPENAI_API_KEY trong biến môi trường hoặc file .env")

    client = OpenAI()
    compact_transactions = [
        {
            "date": tx["date"],
            "category": tx["category"],
            "amount": tx["amount"],
            "type": tx["type"],
            "note": tx["note"],
        }
        for tx in transactions[:120]
    ]
    prompt = {
        "task": "Analyze personal finance transactions and return concise Vietnamese JSON.",
        "month": month,
        "schema": {
            "spending_insights": ["string"],
            "patterns": ["string"],
            "suggestions": ["string"],
        },
        "transactions": compact_transactions,
    }
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a personal finance assistant. Return only valid JSON with keys "
                    "spending_insights, patterns, and suggestions. Each value must be an array of short Vietnamese strings. "
                    "Be specific: mention totals, top category, biggest expense if visible, and 2 practical next actions. "
                    "Do not give generic advice that ignores the transaction data."
                ),
            },
            {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)},
        ],
    )
    content = response.choices[0].message.content or "{}"
    parsed = json.loads(content)
    return {
        "spending_insights": parsed.get("spending_insights") or [],
        "patterns": parsed.get("patterns") or [],
        "suggestions": parsed.get("suggestions") or [],
    }


def build_ai_context(month: str = None, scope: str = "month", source: str = "all"):
    current_month = normalize_month(month, current_month_utc())
    scope = scope if scope in {"month", "year"} else "month"
    source = normalize_source_filter(source)
    transactions = query_transactions(month=current_month, source=source) if scope == "month" else query_transactions(sort="newest", source=source)[:240]
    return {
        "current_month": current_month,
        "scope": scope,
        "source": source,
        "dashboard": get_dashboard_summary(current_month, source),
        "monthly_summary": get_monthly_summary(source)[-12:],
        "category_summary": get_category_summary(current_month, source),
        "budget_progress": get_budget_progress(current_month, source),
        "budget_suggestions": get_budget_suggestions(current_month, source),
        "recent_transactions": transactions[:80],
    }


def normalize_ai_text(value: str):
    text = unicodedata.normalize("NFD", value or "")
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return text.lower()


def vnd(value):
    return f"{float(value or 0):,.0f} VND"


def has_any(text: str, keywords: list[str]):
    return any(keyword in text for keyword in keywords)


def find_category_in_question(question_normalized: str, category_summary: list):
    padded_question = f" {question_normalized} "
    for item in category_summary:
        category = item.get("category", "")
        category_normalized = normalize_ai_text(category)
        if f" {category_normalized} " in padded_question:
            return category

    aliases = {
        "an uong": "Ăn uống",
        "tien an": "Ăn uống",
        "do an": "Ăn uống",
        "cafe": "Ăn uống",
        "sieu thi": "Ăn uống",
        "nha": "Nhà ở",
        "nha o": "Nhà ở",
        "tien nha": "Nhà ở",
        "thue nha": "Nhà ở",
        "di lai": "Đi lại",
        "grab": "Đi lại",
        "gui xe": "Đi lại",
        "hoa don": "Hóa đơn",
        "dien nuoc": "Hóa đơn",
        "internet": "Hóa đơn",
        "giai tri": "Giải trí",
        "netflix": "Giải trí",
        "xem phim": "Giải trí",
        "mua sam": "Mua sắm",
        "dau tu": "Đầu tư",
        "etf": "Đầu tư",
        "suc khoe": "Sức khỏe",
        "du lich": "Du lịch",
        "hoc tap": "Học tập",
    }
    for alias, category in aliases.items():
        if f" {alias} " in padded_question:
            return category
    return None


def generate_local_ai_answer(question: str, context: dict):
    dashboard = context["dashboard"]
    question_lc = normalize_ai_text(question)
    top_category = dashboard.get("topSpendingCategory")
    biggest_expense = dashboard.get("biggestExpense")
    comparison = dashboard.get("comparison", {})
    month = dashboard["month"]
    transactions = context.get("recent_transactions", [])
    expenses = [tx for tx in transactions if tx["type"] == "expense"]
    category_summary = context.get("category_summary", [])
    budget_progress = context.get("budget_progress", [])
    savings_rate = dashboard.get("savingsRate", 0)
    net_cash_flow = dashboard.get("netCashFlow", 0)
    monthly_summary = context.get("monthly_summary", [])
    budget_suggestions = context.get("budget_suggestions", [])
    scope = context.get("scope", "month")

    if scope == "year" or has_any(question_lc, ["12 thang", "mot nam", "ca nam", "nam nay", "6 thang", "3 thang", "dai han"]):
        if monthly_summary:
            total_income = sum(item["total_income"] for item in monthly_summary)
            total_expense = sum(item["total_expense"] for item in monthly_summary)
            best_month = max(monthly_summary, key=lambda item: item["total_income"] - item["total_expense"])
            worst_month = max(monthly_summary, key=lambda item: item["total_expense"])
            avg_expense = total_expense / max(len(monthly_summary), 1)
            if has_any(question_lc, ["thang nao", "te nhat", "xau nhat", "cao nhat", "nhieu nhat"]):
                return (
                    f"Trong {len(monthly_summary)} tháng gần nhất, tháng chi tiêu cao nhất là {worst_month['month']}: "
                    f"{vnd(worst_month['total_expense'])}. Tháng dòng tiền tốt nhất là {best_month['month']}."
                )
            return (
                f"Trong {len(monthly_summary)} tháng gần nhất: tổng thu {vnd(total_income)}, tổng chi {vnd(total_expense)}, "
                f"chi trung bình mỗi tháng {vnd(avg_expense)}. Tháng chi cao nhất là {worst_month['month']} "
                f"({vnd(worst_month['total_expense'])})."
            )

    if has_any(question_lc, ["xin chao", "hello", "chao ban", "ban la ai", "ai la gi"]):
        return (
            f"Mình là trợ lý tài chính trong app. Mình đang đọc dữ liệu tháng {month}: "
            f"thu {vnd(dashboard['totalIncome'])}, chi {vnd(dashboard['totalExpense'])}, "
            f"dòng tiền ròng {vnd(net_cash_flow)}. Bạn có thể hỏi: chi nhiều nhất ở đâu, có vượt ngân sách không, "
            "so sánh tháng trước, hoặc danh mục nào nên giảm."
        )

    if not transactions:
        return f"Tháng {month} chưa có giao dịch để phân tích. Hãy thêm vài khoản thu/chi hoặc nạp dữ liệu mẫu 12 tháng."

    asked_category = find_category_in_question(question_lc, category_summary)
    if asked_category:
        matched = [tx for tx in expenses if tx["category"] == asked_category]
        total = sum(float(tx["amount"]) for tx in matched)
        top_items = sorted(matched, key=lambda tx: float(tx["amount"]), reverse=True)[:3]
        details = "; ".join(f"{tx['note']}: {vnd(tx['amount'])}" for tx in top_items) or "chưa có giao dịch chi tiêu"
        return (
            f"Tháng {month}, danh mục {asked_category} đã chi {vnd(total)} qua {len(matched)} giao dịch. "
            f"Các khoản lớn nhất: {details}."
        )

    if has_any(question_lc, ["ngan sach", "budget", "vuot ngan sach", "con lai", "sap can"]):
        if not budget_progress:
            return f"Tháng {month} chưa có ngân sách để kiểm tra. Hãy tạo ngân sách theo danh mục, app sẽ tự tính đã dùng từ giao dịch."
        overspent = [item for item in budget_progress if item["spent"] > item["budgetAmount"]]
        near_limit = [item for item in budget_progress if item["spent"] <= item["budgetAmount"] and item["usedPercent"] >= 80]
        if overspent:
            lines = [
                f"{item['category']} vượt {vnd(item['spent'] - item['budgetAmount'])} "
                f"({vnd(item['spent'])}/{vnd(item['budgetAmount'])})"
                for item in overspent
            ]
            return f"Tháng {month}, bạn đang vượt ngân sách ở: " + "; ".join(lines) + ". Ưu tiên dừng chi thêm ở các danh mục này."
        if near_limit:
            lines = [f"{item['category']} đã dùng {item['usedPercent']}%" for item in near_limit]
            return f"Tháng {month}, chưa vượt ngân sách nhưng cần chú ý: " + "; ".join(lines) + "."
        used_text = "; ".join(f"{item['category']} {item['usedPercent']}%" for item in budget_progress[:4])
        return f"Tháng {month}, chưa có danh mục nào vượt ngân sách. Mức dùng hiện tại: {used_text}."

    if has_any(question_lc, ["goi y budget", "goi y ngan sach", "ngan sach thang sau", "budget thang sau"]):
        if not budget_suggestions:
            return f"Chưa đủ dữ liệu để gợi ý ngân sách cho tháng sau."
        top_suggestions = "; ".join(
            f"{item['category']}: {vnd(item['suggestedAmount'])} ({item['trend']})"
            for item in budget_suggestions[:5]
        )
        return f"Gợi ý ngân sách dựa trên 6 tháng gần nhất: {top_suggestions}."

    if has_any(question_lc, ["lon nhat", "giao dich lon", "khoan lon", "chi lon nhat", "biggest"]):
        if biggest_expense:
            return f"Giao dịch chi lớn nhất tháng {month} là '{biggest_expense['note']}' ở danh mục {biggest_expense['category']}: {vnd(biggest_expense['amount'])}."
        return f"Tháng {month} chưa có giao dịch chi tiêu để xác định khoản lớn nhất."

    if has_any(question_lc, ["most", "spend most", "chi nhieu", "tieu nhieu", "ton nhieu"]):
        if top_category:
            category_expenses = [tx for tx in expenses if tx["category"] == top_category["category"]]
            examples = sorted(category_expenses, key=lambda tx: float(tx["amount"]), reverse=True)[:2]
            example_text = "; ".join(f"{tx['note']} {vnd(tx['amount'])}" for tx in examples)
            return (
                f"Tháng {month}, bạn chi nhiều nhất cho {top_category['category']}: {vnd(top_category['total'])}. "
                f"Khoản nổi bật: {example_text or 'chưa có chi tiết giao dịch'}. Đây là danh mục nên rà soát trước."
            )
        return "Chưa có đủ giao dịch chi tiêu trong tháng này để xác định danh mục chi nhiều nhất."

    if has_any(question_lc, ["compare", "last month", "thang truoc", "so sanh", "truoc do"]):
        return (
            f"So với {comparison.get('previousMonth')}, thu nhập thay đổi {vnd(comparison.get('incomeChange', 0))}, "
            f"chi tiêu thay đổi {vnd(comparison.get('expenseChange', 0))}, "
            f"dòng tiền ròng thay đổi {vnd(comparison.get('cashFlowChange', 0))}."
        )

    if has_any(question_lc, ["save", "saving", "tiet kiem", "de danh", "nen tiet kiem", "can tiet kiem"]):
        suggested = max(net_cash_flow * 0.5, dashboard["totalIncome"] * 0.1) if dashboard["totalIncome"] else 0
        return (
            f"Tỷ lệ tiết kiệm tháng {month} là {savings_rate}%, dòng tiền ròng {vnd(net_cash_flow)}. "
            f"Mức tiết kiệm gợi ý cho tháng này: khoảng {vnd(suggested)} nếu vẫn giữ chi tiêu thiết yếu ổn định. "
            "Nên cắt trước ở danh mục chi lớn nhất thay vì giảm đều tất cả khoản."
        )

    if has_any(question_lc, ["risky", "rui ro", "bat thuong", "nguy hiem", "dang lo", "canh bao"]):
        alerts = []
        if top_category and dashboard["totalExpense"]:
            share = round(float(top_category["total"]) / max(float(dashboard["totalExpense"]), 1) * 100, 1)
            if share >= 40:
                alerts.append(f"{top_category['category']} chiếm {share}% tổng chi")
        overspent = [item for item in budget_progress if item["spent"] > item["budgetAmount"]]
        if overspent:
            alerts.append("có danh mục vượt ngân sách: " + ", ".join(item["category"] for item in overspent))
        if dashboard["netCashFlow"] < 0:
            alerts.append("dòng tiền ròng đang âm")
        if alerts:
            return f"Điểm cần chú ý tháng {month}: " + "; ".join(alerts) + "."
        if top_category:
            return f"Chưa thấy bất thường lớn. Danh mục cần theo dõi nhất là {top_category['category']} vì đang dẫn đầu chi tiêu tháng này."
        return "Chưa thấy rủi ro rõ ràng vì dữ liệu chi tiêu tháng này còn ít."

    if has_any(question_lc, ["danh muc", "category", "phan bo", "co cau"]):
        if not category_summary:
            return f"Tháng {month} chưa có dữ liệu danh mục."
        ranking = "; ".join(f"{item['category']}: {vnd(item['total'])}" for item in category_summary[:5])
        return f"Phân bổ chi tiêu tháng {month}: {ranking}."

    if has_any(question_lc, ["thu nhap", "chi tieu", "tong thu", "tong chi", "dong tien", "so du", "net"]):
        return (
            f"Tháng {month}: tổng thu {vnd(dashboard['totalIncome'])}, tổng chi {vnd(dashboard['totalExpense'])}, "
            f"dòng tiền ròng {vnd(dashboard['netCashFlow'])}, tỷ lệ tiết kiệm {savings_rate}%."
        )

    if has_any(question_lc, ["dinh ky", "recurring", "subscription", "lap lai", "hang thang"]):
        recurring = dashboard.get("recurringTransactions") or []
        if recurring:
            names = "; ".join(f"{item['note']} ({vnd(item.get('estimatedAmount'))})" for item in recurring[:5])
            return f"Các khoản có vẻ định kỳ: {names}."
        return "Chưa phát hiện khoản định kỳ rõ ràng từ dữ liệu hiện tại."

    if biggest_expense:
        return (
            f"Mình chưa chắc bạn muốn hỏi phần nào, nhưng với dữ liệu tháng {month}: "
            f"thu {vnd(dashboard['totalIncome'])}, chi {vnd(dashboard['totalExpense'])}, "
            f"dòng tiền ròng {vnd(net_cash_flow)}. Khoản chi lớn nhất là '{biggest_expense['note']}' ({vnd(biggest_expense['amount'])}). "
            "Bạn có thể hỏi cụ thể như: 'ăn uống tháng này bao nhiêu', 'có vượt ngân sách không', hoặc 'so sánh với tháng trước'."
        )
    return f"Tháng {month} có dữ liệu nhưng chưa đủ để trả lời chắc chắn. Bạn có thể hỏi theo danh mục, ngân sách, tổng chi hoặc so sánh tháng."


def generate_local_ai_report(month: str, scope: str = "month", source: str = "all"):
    month = normalize_month(month, current_month_utc())
    scope = scope if scope in {"month", "year"} else "month"
    source = normalize_source_filter(source)
    dashboard = get_dashboard_summary(month, source)
    analytics = get_analytics_12m(month, source)
    budget_progress = get_budget_progress(month, source)
    budget_suggestions = get_budget_suggestions(month, source)

    if scope == "year":
        summary = analytics["summary"]
        if not summary:
            return {
                "title": "Báo cáo 12 tháng",
                "scope": scope,
                "month": month,
                "dataSource": source,
                "overview": "Chưa có đủ dữ liệu 12 tháng để tạo báo cáo.",
                "risks": [],
                "opportunities": [],
                "actions": ["Nạp dữ liệu mẫu 12 tháng hoặc thêm giao dịch thực tế."],
            }
        risks = []
        if summary["topCategory"]:
            risks.append(f"Danh mục chi lớn nhất 12 tháng là {summary['topCategory']['category']}: {vnd(summary['topCategory']['total'])}.")
        risks.append(f"Tháng chi cao nhất là {summary['highestExpenseMonth']['month']}: {vnd(summary['highestExpenseMonth']['total_expense'])}.")
        opportunities = [
            f"Dòng tiền ròng 12 tháng: {vnd(summary['totalCashFlow'])}.",
            f"Tỷ lệ tiết kiệm trung bình: {summary['averageSavingsRate']}%.",
        ]
        actions = [
            f"Dùng tháng {summary['highestExpenseMonth']['month']} làm tháng benchmark để rà các khoản tăng bất thường.",
            "Đặt ngân sách tháng sau theo 3-5 danh mục chi lớn nhất.",
        ]
        if budget_suggestions:
            actions.append("Gợi ý budget ưu tiên: " + "; ".join(f"{item['category']} {vnd(item['suggestedAmount'])}" for item in budget_suggestions[:3]) + ".")
        return {
            "title": "Báo cáo tài chính 12 tháng",
            "scope": scope,
            "month": month,
            "dataSource": source,
            "overview": (
                f"Từ {analytics['startMonth']} đến {month}: tổng thu {vnd(summary['totalIncome'])}, "
                f"tổng chi {vnd(summary['totalExpense'])}, dòng tiền ròng {vnd(summary['totalCashFlow'])}."
            ),
            "risks": risks,
            "opportunities": opportunities,
            "actions": actions,
        }

    overspent = [item for item in budget_progress if item["spent"] > item["budgetAmount"]]
    near_limit = [item for item in budget_progress if item["spent"] <= item["budgetAmount"] and item["usedPercent"] >= 80]
    risks = []
    if dashboard["topSpendingCategory"]:
        risks.append(f"Chi nhiều nhất ở {dashboard['topSpendingCategory']['category']}: {vnd(dashboard['topSpendingCategory']['total'])}.")
    if dashboard["biggestExpense"]:
        risks.append(f"Giao dịch lớn nhất: {dashboard['biggestExpense']['note']} ({vnd(dashboard['biggestExpense']['amount'])}).")
    if overspent:
        risks.extend(f"{item['category']} vượt ngân sách {vnd(item['spent'] - item['budgetAmount'])}." for item in overspent)
    elif near_limit:
        risks.extend(f"{item['category']} đã dùng {item['usedPercent']}% ngân sách." for item in near_limit)

    actions = [
        "Rà soát danh mục chi lớn nhất trước khi cắt các khoản nhỏ.",
        "Giữ một ngưỡng chi tiêu tuần cho các danh mục gần chạm ngân sách.",
    ]
    if budget_suggestions:
        actions.append("Budget tháng sau nên bắt đầu với: " + "; ".join(f"{item['category']} {vnd(item['suggestedAmount'])}" for item in budget_suggestions[:3]) + ".")

    return {
        "title": f"Báo cáo tài chính tháng {month}",
        "scope": scope,
        "month": month,
        "dataSource": source,
        "overview": (
            f"Tháng {month}: thu {vnd(dashboard['totalIncome'])}, chi {vnd(dashboard['totalExpense'])}, "
            f"dòng tiền ròng {vnd(dashboard['netCashFlow'])}, tỷ lệ tiết kiệm {dashboard['savingsRate']}%."
        ),
        "risks": risks or ["Chưa thấy rủi ro lớn trong tháng đang xem."],
        "opportunities": [
            f"Có thể dành khoảng {vnd(max(dashboard['netCashFlow'] * 0.5, 0))} cho tiết kiệm/đầu tư nếu giữ nhịp chi hiện tại.",
            f"So với tháng trước, chi tiêu thay đổi {vnd(dashboard['comparison']['expenseChange'])}.",
        ],
        "actions": actions,
    }


def generate_openai_chat_answer(question: str, history: list | None = None, month: str = None, scope: str = "month", source: str = "all"):
    if not question:
        raise ValueError("Câu hỏi không được để trống")
    if OpenAI is None:
        raise RuntimeError("Thiếu thư viện OpenAI. Hãy chạy: pip install -r requirements.txt")
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("Thiếu OPENAI_API_KEY trong biến môi trường hoặc file .env")

    context = build_ai_context(month, scope, source)
    client = OpenAI()
    messages = [
        {
            "role": "system",
            "content": (
                "You are an in-app personal finance assistant. Answer in Vietnamese, concise and practical. "
                "Ground every answer in the provided transaction and analytics context. If data is insufficient, say so and suggest what to add."
            ),
        },
        {
            "role": "user",
            "content": "Finance context JSON:\n" + json.dumps(context, ensure_ascii=False),
        },
    ]
    for item in (history or [])[-8:]:
        role = item.get("role") if isinstance(item, dict) else None
        content = clean_text(item.get("content") if isinstance(item, dict) else "")
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=messages,
        temperature=0.2,
    )
    return response.choices[0].message.content or "Tôi chưa tạo được câu trả lời. Vui lòng thử lại."


@app.route("/api/transactions", methods=["GET"])
def api_transactions():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    type_ = request.args.get("type")
    category = clean_text(request.args.get("category"))
    search = clean_text(request.args.get("search"))
    sort = clean_text(request.args.get("sort"), "newest")
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(query_transactions(month, type_, category, search, sort, source))


@app.route("/api/transactions", methods=["POST"])
def api_add_transaction():
    data = request.get_json() or {}
    note = clean_text(data.get("note") or data.get("description"))
    type_ = data.get("type", "expense")
    category = clean_text(data.get("category"))
    try:
        amount = parse_positive_float(data.get("amount"), "Số tiền")
        transaction_date = normalize_date(data.get("date") or data.get("transaction_date"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not note or type_ not in VALID_TRANSACTION_TYPES:
        return jsonify({"error": "Dữ liệu không hợp lệ"}), 400
    result = insert_transaction(note, amount, type_, category if category else None, transaction_date, "manual")
    return jsonify({"message": "Đã lưu giao dịch", "id": result["id"], "category": result["category"]})


@app.route("/api/transactions/<int:transaction_id>", methods=["PUT"])
def api_update_transaction(transaction_id: int):
    data = request.get_json() or {}
    note = clean_text(data.get("note") or data.get("description"))
    type_ = data.get("type", "expense")
    category = clean_text(data.get("category"))
    try:
        amount = parse_positive_float(data.get("amount"), "Số tiền")
        transaction_date = normalize_date(data.get("date") or data.get("transaction_date"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not note or type_ not in VALID_TRANSACTION_TYPES:
        return jsonify({"error": "Dữ liệu không hợp lệ"}), 400
    updated = update_transaction(transaction_id, note, amount, type_, category if category else None, transaction_date)
    if updated == 0:
        return jsonify({"error": "Không tìm thấy giao dịch"}), 404
    return jsonify({"message": "Đã cập nhật giao dịch"})


@app.route("/api/transactions/<int:transaction_id>", methods=["DELETE"])
def api_delete_transaction(transaction_id: int):
    params = [transaction_id]
    ownership_condition = owned_record_condition(params)
    conn = get_db_connection()
    cursor = conn.execute(f"DELETE FROM transactions WHERE id = ? AND {ownership_condition}", params)
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Không tìm thấy giao dịch"}), 404
    return jsonify({"message": "Đã xóa giao dịch"})


@app.route("/api/import/csv", methods=["POST"])
def api_import_csv():
    uploaded_file = request.files.get("file")
    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"error": "Vui lòng chọn file CSV"}), 400
    mapping = {
        "date_column": clean_text(request.form.get("date_column")),
        "amount_column": clean_text(request.form.get("amount_column")),
        "debit_column": clean_text(request.form.get("debit_column")),
        "credit_column": clean_text(request.form.get("credit_column")),
        "note_column": clean_text(request.form.get("note_column")),
        "type_column": clean_text(request.form.get("type_column")),
        "category_column": clean_text(request.form.get("category_column")),
    }
    try:
        result = import_transactions_from_csv(uploaded_file, mapping)
        return jsonify({"message": "Đã import CSV", **result})
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Không thể import CSV: {error}"}), 500


@app.route("/api/import/csv/preview", methods=["POST"])
def api_import_csv_preview():
    uploaded_file = request.files.get("file")
    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"error": "Vui lòng chọn file CSV"}), 400
    mapping = {
        "date_column": clean_text(request.form.get("date_column")),
        "amount_column": clean_text(request.form.get("amount_column")),
        "debit_column": clean_text(request.form.get("debit_column")),
        "credit_column": clean_text(request.form.get("credit_column")),
        "note_column": clean_text(request.form.get("note_column")),
        "type_column": clean_text(request.form.get("type_column")),
        "category_column": clean_text(request.form.get("category_column")),
    }
    try:
        result = preview_transactions_from_csv(uploaded_file, mapping)
        return jsonify({"message": "Đã đọc preview CSV", **result})
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Không thể preview CSV: {error}"}), 500


@app.route("/api/auth/status", methods=["GET"])
def api_auth_status():
    user = current_user_payload()
    conn = get_db_connection()
    user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    conn.close()
    return jsonify({"authenticated": bool(user), "user": user, "userCount": user_count, "csrfToken": ensure_csrf_token()})


@app.route("/api/health", methods=["GET"])
def api_health():
    status = get_health_snapshot()
    http_status = 200 if status["status"] == "ok" else 503
    return jsonify(status), http_status


@app.route("/api/auth/register", methods=["POST"])
def api_auth_register():
    data = request.get_json() or {}
    email = clean_text(data.get("email")).lower()
    name = clean_text(data.get("name")) or email.split("@")[0]
    password = clean_text(data.get("password"))
    if not email or "@" not in email or len(password) < 6:
        return jsonify({"error": "Email không hợp lệ hoặc mật khẩu dưới 6 ký tự"}), 400
    if get_user_by_email(email):
        return jsonify({"error": "Email đã tồn tại"}), 409

    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)",
        (email, name, generate_password_hash(password), utc_now().isoformat()),
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    user = get_user_by_id(user_id)
    set_user_session(user)
    return jsonify({"message": "Đã tạo tài khoản", "user": current_user_payload()})


@app.route("/api/auth/login", methods=["POST"])
def api_auth_login():
    data = request.get_json() or {}
    email = clean_text(data.get("email")).lower()
    password = clean_text(data.get("password"))
    user = get_user_by_email(email)
    if not rate_limit_login(email):
        return jsonify({"error": "Đăng nhập quá nhiều lần. Hãy thử lại sau vài phút."}), 429
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Email hoặc mật khẩu không đúng"}), 401
    reset_login_attempts(email)
    set_user_session(user)
    return jsonify({"message": "Đã đăng nhập", "user": current_user_payload()})


@app.route("/api/auth/logout", methods=["POST"])
def api_auth_logout():
    session.clear()
    return jsonify({"message": "Đã đăng xuất"})


@app.route("/api/summary", methods=["GET"])
def api_summary():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_summary(month, source))


@app.route("/api/budgets", methods=["GET"])
def api_budgets():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    return jsonify(query_budgets(month))


@app.route("/api/budgets", methods=["POST"])
def api_create_budget():
    data = request.get_json() or {}
    category = clean_text(data.get("category"), "Khác")
    try:
        amount = parse_positive_float(data.get("amount"), "Số tiền ngân sách")
        month = normalize_month(data.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not category:
        return jsonify({"error": "Danh mục không được để trống"}), 400
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO budgets (category, amount, month, user_id) VALUES (?, ?, ?, ?)",
        (category, amount, month, current_user_id()),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Lưu ngân sách thành công"})


@app.route("/api/budget-suggestions", methods=["GET"])
def api_budget_suggestions():
    try:
        month = normalize_month(request.args.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_budget_suggestions(month, source))


@app.route("/api/goals", methods=["GET"])
def api_goals():
    return jsonify(query_goals())


@app.route("/api/goals", methods=["POST"])
def api_create_goal():
    data = request.get_json() or {}
    name = clean_text(data.get("name"))
    try:
        target_amount = parse_positive_float(data.get("target_amount"), "Số tiền mục tiêu")
        saved_amount = parse_non_negative_float(data.get("saved_amount", 0), "Tiền đã tiết kiệm")
        deadline = normalize_date(data.get("deadline"), utc_today().isoformat())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not name:
        return jsonify({"error": "Dữ liệu mục tiêu không hợp lệ"}), 400
    insert_goal(name, target_amount, saved_amount, deadline)
    return jsonify({"message": "Đã lưu mục tiêu"})


@app.route("/api/goals/<int:goal_id>", methods=["DELETE"])
def api_delete_goal(goal_id: int):
    params = [goal_id]
    ownership_condition = owned_record_condition(params)
    conn = get_db_connection()
    cursor = conn.execute(f"DELETE FROM goals WHERE id = ? AND {ownership_condition}", params)
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Không tìm thấy mục tiêu"}), 404
    return jsonify({"message": "Đã xóa mục tiêu"})


@app.route("/api/budget-progress", methods=["GET"])
def api_budget_progress():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_budget_progress(month, source))


@app.route("/api/budgets/<int:budget_id>", methods=["PUT"])
def api_update_budget(budget_id: int):
    data = request.get_json() or {}
    category = clean_text(data.get("category"))
    try:
        amount = parse_positive_float(data.get("amount"), "Số tiền ngân sách")
        month = normalize_month(data.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not category:
        return jsonify({"error": "Danh mục ngân sách không được để trống"}), 400

    conn = get_db_connection()
    params = [budget_id]
    ownership_condition = owned_record_condition(params)
    cursor = conn.execute(
        f"UPDATE budgets SET category = ?, amount = ?, month = ? WHERE id = ? AND {ownership_condition}",
        (category, amount, month, *params),
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Không tìm thấy ngân sách"}), 404
    return jsonify({"message": "Đã cập nhật ngân sách"})


@app.route("/api/budgets/<int:budget_id>", methods=["DELETE"])
def api_delete_budget(budget_id: int):
    params = [budget_id]
    ownership_condition = owned_record_condition(params)
    conn = get_db_connection()
    cursor = conn.execute(f"DELETE FROM budgets WHERE id = ? AND {ownership_condition}", params)
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Không tìm thấy ngân sách"}), 404
    return jsonify({"message": "Đã xóa ngân sách"})


@app.route("/api/ai/analysis", methods=["GET"])
def api_ai_analysis():
    source = normalize_source_filter(request.args.get("source"))
    summary = get_summary(source=source)
    return jsonify({
        "categories": summary["categoryBreakdown"],
        "forecast": summary["forecast"],
        "budgetProgress": summary["budgetProgress"],
        "goals": summary["goals"],
        "advice": summary["advice"],
    })


@app.route("/api/ai-insight", methods=["POST", "GET"])
def api_ai_insight():
    data = request.get_json(silent=True) or {}
    source = normalize_source_filter(data.get("source") if request.method == "POST" else request.args.get("source"))
    try:
        if request.method == "POST":
            month = normalize_month(data.get("month"), current_month_utc())
            transactions = data.get("transactions")
        else:
            month = normalize_month(request.args.get("month"), current_month_utc())
            transactions = None
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if transactions is None:
        transactions = query_transactions(month=month, source=source)
    try:
        insight = generate_openai_insight(transactions, month=month)
        return jsonify({"source": "openai", "month": month, "dataSource": source, **insight})
    except (RuntimeError, OpenAIError, json.JSONDecodeError) as error:
        fallback = build_local_ai_insight(transactions, month=month)
        return jsonify({
            "source": "local-fallback",
            "month": month,
            "dataSource": source,
            "error": str(error),
            "message": "OpenAI chưa khả dụng. Đang hiển thị phân tích local dựa trên dữ liệu giao dịch hiện có.",
            **fallback,
        })
    except Exception as error:
        return jsonify({"error": f"Không thể tạo AI insight: {error}"}), 500


@app.route("/api/trends", methods=["GET"])
def api_trends():
    return jsonify(get_monthly_trends())


@app.route("/api/monthly-summary", methods=["GET"])
def api_monthly_summary():
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_monthly_summary(source))


@app.route("/api/analytics-12m", methods=["GET"])
def api_analytics_12m():
    try:
        month = normalize_month(request.args.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_analytics_12m(month, source))


@app.route("/api/monthly-transactions", methods=["GET"])
def api_monthly_transactions():
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_monthly_transactions(source))


@app.route("/api/recurring-transactions", methods=["GET"])
def api_recurring_transactions():
    try:
        month = normalize_month(request.args.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    items = detect_recurring_transactions(source)
    active_items = [item for item in items if item["status"] != "ignored"]
    total_estimated = round(sum(float(item.get("estimatedAmount", 0)) for item in active_items), 2)
    return jsonify({
        "month": month,
        "nextMonth": add_months(month, 1),
        "count": len(active_items),
        "totalEstimatedMonthly": total_estimated,
        "items": items,
    })


@app.route("/api/recurring-rules", methods=["POST"])
def api_upsert_recurring_rule():
    data = request.get_json() or {}
    note = clean_text(data.get("note"))
    category = clean_text(data.get("category"), DEFAULT_CATEGORY)
    status = clean_text(data.get("status"), "confirmed").lower()
    if not note:
        return jsonify({"error": "Thiếu ghi chú khoản định kỳ"}), 400
    if status not in {"confirmed", "ignored", "likely"}:
        return jsonify({"error": "Trạng thái khoản định kỳ không hợp lệ"}), 400
    rule_key = clean_text(data.get("ruleKey")) or recurring_rule_key(category, note)
    now = utc_now().isoformat()
    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO recurring_rules (rule_key, note, category, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(rule_key) DO UPDATE SET
            note = excluded.note,
            category = excluded.category,
            status = excluded.status,
            updated_at = excluded.updated_at
        """,
        (rule_key, note, category, status, now, now),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Đã cập nhật khoản định kỳ", "ruleKey": rule_key, "status": status})


@app.route("/api/category-summary", methods=["GET"])
def api_category_summary():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_category_summary(month, source))


@app.route("/api/dashboard-summary", methods=["GET"])
def api_dashboard_summary():
    try:
        month = normalize_month(request.args.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    return jsonify(get_dashboard_summary(month, source))


@app.route("/api/demo-data", methods=["POST"])
def api_demo_data():
    if not env_bool("ENABLE_DEMO_DATA", True) and not current_user_is_admin():
        return jsonify({"error": "Nạp dữ liệu mẫu đang bị tắt trên môi trường này."}), 403
    result = seed_demo_profile()
    return jsonify({
        "message": "Đã nạp dữ liệu mẫu 12 tháng. Dữ liệu thật của bạn không bị xóa.",
        **result,
    })


@app.route("/api/export/csv", methods=["GET"])
def api_export_csv():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    transactions = query_transactions(month, source=source)
    if not transactions:
        return jsonify({"error": "Không có dữ liệu để xuất"}), 404

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Ngày", "Ghi chú", "Số tiền", "Danh mục", "Loại", "Nguồn"])
    for tx in transactions:
        writer.writerow([
            tx["id"],
            tx["date"],
            tx["note"],
            tx["amount"],
            tx["category"],
            tx["type"],
            tx["source"],
        ])

    output.seek(0)
    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=bao-cao-tai-chinh-{month or 'tat-ca'}.csv"
    return response


def format_report_money(value):
    return f"{float(value or 0):,.0f} VND"


def render_finance_report_html(month, source):
    source = normalize_source_filter(source)
    summary = get_summary(month, source)
    dashboard = get_dashboard_summary(month, source)
    analytics = get_analytics_12m(month or current_month_utc(), source)
    recurring_items = [item for item in detect_recurring_transactions(source) if item["status"] != "ignored"][:8]
    transactions = query_transactions(month=month, source=source)[:20]
    title_month = month or "Tất cả dữ liệu"
    source_label = {
        "all": "Tất cả dữ liệu",
        "sample": "Dữ liệu mẫu",
        "manual": "Nhập tay",
        "import": "Import CSV",
        "real": "Dữ liệu thật",
    }.get(source, "Tất cả dữ liệu")

    def esc(value):
        return html.escape(str(value if value is not None else ""))

    insights = dashboard.get("quickInsights") or []
    category_rows = "".join(
        f"<tr><td>{esc(item['category'])}</td><td>{format_report_money(item['total'])}</td></tr>"
        for item in (analytics.get("categoryTotals") or [])[:8]
    )
    recurring_rows = "".join(
        f"<tr><td>{esc(item['note'])}</td><td>{esc(item['category'])}</td><td>{format_report_money(item['estimatedAmount'])}</td><td>{esc(item['status'])}</td></tr>"
        for item in recurring_items
    ) or "<tr><td colspan='4'>Chưa phát hiện khoản định kỳ.</td></tr>"
    transaction_rows = "".join(
        f"<tr><td>{esc(tx['date'])}</td><td>{esc(tx['type'])}</td><td>{esc(tx['category'])}</td><td>{esc(tx['note'])}</td><td>{format_report_money(tx['amount'])}</td></tr>"
        for tx in transactions
    ) or "<tr><td colspan='5'>Không có giao dịch trong phạm vi này.</td></tr>"
    insight_items = "".join(f"<li>{esc(item)}</li>" for item in insights) or "<li>Chưa đủ dữ liệu để tạo insight.</li>"

    return f"""<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Báo cáo tài chính {esc(title_month)}</title>
  <style>
    body {{ margin: 0; font-family: Inter, Segoe UI, Arial, sans-serif; background: #0f172a; color: #f8fafc; }}
    main {{ max-width: 1080px; margin: 0 auto; padding: 36px 24px 56px; }}
    .hero {{ border: 1px solid #334155; border-radius: 24px; padding: 28px; background: linear-gradient(135deg, #1e293b, #111827); }}
    h1 {{ margin: 0 0 8px; font-size: 40px; letter-spacing: -0.04em; }}
    h2 {{ margin: 28px 0 12px; font-size: 22px; }}
    p, li, td, th {{ color: #cbd5e1; }}
    .grid {{ display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 22px; }}
    .card {{ border: 1px solid #334155; border-radius: 18px; padding: 16px; background: #1e293b; }}
    .card span {{ display: block; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }}
    .card strong {{ display: block; margin-top: 8px; font-size: 20px; color: #f8fafc; }}
    table {{ width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 16px; border: 1px solid #334155; }}
    th, td {{ padding: 12px 14px; border-bottom: 1px solid #334155; text-align: left; }}
    th {{ color: #f8fafc; background: #243247; }}
    .positive {{ color: #22c55e !important; }}
    .negative {{ color: #ef4444 !important; }}
    @media print {{ body {{ background: #fff; color: #111827; }} p,li,td,th {{ color: #111827; }} .hero,.card,table {{ border-color: #d1d5db; background: #fff; }} th {{ background: #f1f5f9; color: #111827; }} }}
  </style>
</head>
<body>
<main>
  <section class="hero">
    <p>{esc(source_label)} · tạo lúc {esc(utc_now().strftime("%Y-%m-%d %H:%M UTC"))}</p>
    <h1>Báo cáo tài chính {esc(title_month)}</h1>
    <p>Tổng hợp dòng tiền, ngân sách, danh mục chi tiêu và khoản định kỳ từ LUX Money AI.</p>
    <div class="grid">
      <div class="card"><span>Thu nhập</span><strong>{format_report_money(summary['income'])}</strong></div>
      <div class="card"><span>Chi tiêu</span><strong>{format_report_money(summary['expense'])}</strong></div>
      <div class="card"><span>Dòng tiền</span><strong class="{'positive' if summary['balance'] >= 0 else 'negative'}">{format_report_money(summary['balance'])}</strong></div>
      <div class="card"><span>Savings rate</span><strong>{float(dashboard.get('savingsRate') or 0):.1f}%</strong></div>
    </div>
  </section>
  <h2>Insight chính</h2>
  <ul>{insight_items}</ul>
  <h2>Top danh mục 12 tháng</h2>
  <table><thead><tr><th>Danh mục</th><th>Tổng chi</th></tr></thead><tbody>{category_rows}</tbody></table>
  <h2>Khoản định kỳ</h2>
  <table><thead><tr><th>Khoản</th><th>Danh mục</th><th>Dự kiến/tháng</th><th>Trạng thái</th></tr></thead><tbody>{recurring_rows}</tbody></table>
  <h2>Giao dịch gần đây</h2>
  <table><thead><tr><th>Ngày</th><th>Loại</th><th>Danh mục</th><th>Ghi chú</th><th>Số tiền</th></tr></thead><tbody>{transaction_rows}</tbody></table>
</main>
</body>
</html>"""


@app.route("/api/export/report", methods=["GET"])
def api_export_report():
    try:
        month = normalize_month(request.args.get("month"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(request.args.get("source"))
    content = render_finance_report_html(month, source)
    filename_month = month or "tat-ca"
    response = Response(content, mimetype="text/html")
    response.headers["Content-Disposition"] = f"attachment; filename=bao-cao-tai-chinh-{filename_month}.html"
    return response


@app.route("/api/backup/db", methods=["GET"])
@admin_required
def api_backup_db():
    if not os.path.exists(DB_PATH):
        return jsonify({"error": "Chưa có file database để backup"}), 404
    download_name = f"lux-money-backup-{utc_now().strftime('%Y%m%d-%H%M%S')}.db"
    return send_file(DB_PATH, as_attachment=True, download_name=download_name, mimetype="application/octet-stream")


@app.route("/api/restore/db", methods=["POST"])
@admin_required
def api_restore_db():
    if not env_bool("ENABLE_DB_RESTORE", False):
        return jsonify({"error": "Restore DB đang bị tắt. Bật ENABLE_DB_RESTORE=true nếu bạn thực sự cần dùng."}), 403
    uploaded_file = request.files.get("file")
    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"error": "Vui lòng chọn file SQLite backup"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=".db") as tmp:
        temp_path = tmp.name
        uploaded_file.save(tmp)
    try:
        with sqlite3.connect(temp_path) as candidate:
            result = candidate.execute("PRAGMA integrity_check").fetchone()[0]
            if result != "ok":
                return jsonify({"error": f"File backup không hợp lệ: {result}"}), 400

        if os.path.exists(DB_PATH):
            backup_path = f"{DB_PATH}.before-restore-{utc_now().strftime('%Y%m%d-%H%M%S')}.bak"
            shutil.copy2(DB_PATH, backup_path)
        shutil.copy2(temp_path, DB_PATH)
        init_db()
        return jsonify({"message": "Đã restore database thành công. Hãy refresh trang để tải lại dữ liệu."})
    except sqlite3.Error as error:
        return jsonify({"error": f"Không thể đọc SQLite backup: {error}"}), 400
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass


@app.route("/", methods=["GET"])
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def send_static(path):
    return send_from_directory(app.static_folder, path)


@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json() or {}
    message = clean_text(data.get("message") or data.get("question"))
    history = data.get("history") or []
    scope = clean_text(data.get("scope"), "month")
    if scope not in {"month", "year"}:
        scope = "month"
    source = normalize_source_filter(data.get("source"))
    try:
        month = normalize_month(data.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if not message:
        return jsonify({"error": "Tin nhắn không được để trống"}), 400

    try:
        answer = generate_openai_chat_answer(message, history, month=month, scope=scope, source=source)
        return jsonify({"source": "openai", "month": month, "scope": scope, "dataSource": source, "response": answer})
    except (RuntimeError, OpenAIError, ValueError) as error:
        context = build_ai_context(month, scope, source)
        return jsonify({
            "source": "local-fallback",
            "month": month,
            "scope": scope,
            "dataSource": source,
            "message": "AI cloud chưa khả dụng. Đang trả lời bằng phân tích cục bộ từ dữ liệu giao dịch.",
            "error": str(error),
            "response": generate_local_ai_answer(message, context),
        })
    except Exception as error:
        return jsonify({"error": f"Không thể trả lời AI chat: {error}"}), 500


@app.route("/api/ai-chat", methods=["POST"])
def api_ai_chat():
    return api_chat()


@app.route("/api/ai-report", methods=["POST"])
def api_ai_report():
    data = request.get_json() or {}
    scope = clean_text(data.get("scope"), "month")
    if scope not in {"month", "year"}:
        scope = "month"
    try:
        month = normalize_month(data.get("month"), current_month_utc())
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    source = normalize_source_filter(data.get("source"))
    return jsonify({"source": "local-report", **generate_local_ai_report(month, scope, source)})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
